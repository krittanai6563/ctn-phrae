<script setup lang="ts">
import { format } from "date-fns";
import { onMounted, computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBlogStore } from "@/stores/apps/blog";
import { useAuthStore } from "@/stores/auth";
import { Icon } from "@iconify/vue";
import Badge from "@/components/ui/badge/Badge.vue";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const title = useRoute();
const router = useRouter();
const getTitle = title.path.split("/").pop();
const store = useBlogStore();
const auth = useAuthStore();

// State Management
const activeTab = ref("lessons"); 
const lessonAccordionState = ref<Record<string, boolean>>({});
const showAddLessonModal = ref(false);
const showAddAssignmentModal = ref(false);
const showLessonDetailModal = ref(false);
const selectedLesson = ref<Record<string, any> | null>(null);
const showSubmissionsModal = ref(false);
const selectedAssignment = ref<Record<string, any> | null>(null);
const selectedStudentSubmission = ref<Record<string, any> | null>(null);
const reportView = ref('overview');
const settingsSaved = ref(false);
const settingsForm = ref({
  courseStatus: 'เปิด',
  accessType: 'สาธารณะ',
  showFutureLessons: false,
  allowDownloads: true,
  lateSubmission: true,
  latePenalty: 10,
  notifications: true,
});
const editingLessonId = ref<string | null>(null);
const lessonFileInput = ref<HTMLInputElement | null>(null);
const lessonInlineImageInput = ref<HTMLInputElement | null>(null);
const lessonEditor = ref<HTMLElement | null>(null);
const showLessonHtmlSource = ref(false);
const lessonForm = ref({
  title: '',
  duration: '',
  summary: '',
  objectives: '',
  requiredTools: '',
  descriptionHtml: '',
  codeLanguage: 'C',
  publishAt: '',
  isHidden: false,
  embedVideoUrl: '',
});
const lessonFiles = ref<File[]>([]);
const lessonResources = ref([
  { title: '', url: '', type: 'เครื่องมือ' },
]);
const lessonTasks = ref([
  { title: '', description: '', points: 10, due: '', submission: 'แนบไฟล์' },
]);
const lessonCriteria = ref([
  { title: 'ส่งงานล่าช้า', deduction: 10, unit: '% ต่อวัน' },
  { title: 'ไม่แนบไฟล์ตามที่กำหนด', deduction: 5, unit: '%' },
]);
const assignmentForm = ref({
  title: '',
  description: '',
  dueDate: '',
  dueTime: '23:59',
  maxScore: 100,
  submissionMode: 'code' as 'code' | 'file' | 'hybrid',
});
const assignmentRubrics = ref([
  { title: '', percentage: 60 },
  { title: '', percentage: 20 },
  { title: '', percentage: 20 },
]);

type SubmissionRow = Record<string, any> & {
  id: string | number;
  name: string;
  studentCode?: string;
  submissionStatus: string;
  submittedAt: string;
  score: number | null;
  fileName: string | null;
};

const tabItems = [
  { id: "general", label: "ภาพรวมคอร์ส", icon: "solar:info-circle-linear" },
  { id: "lessons", label: "เนื้อหาบทเรียน", icon: "solar:video-library-linear" },
  { id: "assignments", label: "งาน/แบบฝึกหัด", icon: "solar:clipboard-list-linear" },
  { id: "members", label: "สมาชิก", icon: "solar:users-group-two-rounded-linear" },
];

onMounted(() => {
  store.fetchPost(`${getTitle}`);
  store.fetchPosts();
});

// 📌 ข้อมูลจำลอง (Mock Data) สำหรับการแสดงผลแบบเต็มรูปแบบ
const mockData = {
  title: "การพัฒนา Web Application ด้วย Vue 3",
  displayTitle: "การพัฒนา Web Application ด้วย Vue 3 (Composition API)",
  category: "วิชาเอกบังคับ",
  accessType: "open",
  createdAt: "2026-08-15T09:00:00Z",
  view: 1245,
  comments: new Array(12),
  author: { avatar: "https://i.pravatar.cc/150?u=instructor1" },
  courseSummary: "เรียนรู้การสร้างเว็บแอปพลิเคชันสมัยใหม่ ตั้งแต่พื้นฐาน Component-based, การจัดการ State ด้วย Pinia, การทำ Routing และเชื่อมต่อ API จริงด้วย Axios พร้อมตกแต่ง UI ด้วย Tailwind CSS",
  level: "ปริญญาตรี ปี 3",
  semester: "1 / 2569",
  academicYear: "2569",
  classCode: "WEB-301",
  descriptionHtml: `<p><strong>วัตถุประสงค์รายวิชา:</strong></p><ul class="list-disc pl-5 mt-2 space-y-1"><li>เข้าใจสถาปัตยกรรมของ Vue 3 และ Composition API</li><li>สามารถออกแบบ UI แบบ Responsive ได้</li><li>ประยุกต์ใช้งานร่วมกับ Backend API ได้อย่างมีประสิทธิภาพ</li></ul>`,
  gradingCriteria: [
    { name: "เวลาเรียนและการมีส่วนร่วม", percentage: 10 },
    { name: "แบบฝึกหัดประจำสัปดาห์", percentage: 30 },
    { name: "สอบกลางภาค", percentage: 20 },
    { name: "โครงงานปลายภาค (Final Project)", percentage: 40 }
  ],
  modules: [
    {
      id: "m1", title: "บทที่ 1: Introduction to Vue 3 & Setup", type: "video", duration: "1 ชม. 15 นาที", status: "เรียนแล้ว", progress: 100,
      description: "แนะนำพื้นฐานของ Vue.js ความแตกต่างระหว่าง Options API และ Composition API พร้อมติดตั้ง Environment",
      summary: "ปูพื้นฐานการสร้างโปรเจกต์ Vue 3 ตั้งแต่การติดตั้งเครื่องมือจนถึงการรันแอปพลิเคชันครั้งแรก",
      objectives: ["อธิบายความแตกต่างระหว่าง Options API และ Composition API ได้", "สร้างโปรเจกต์ Vue 3 ด้วย Vite ได้", "เรียกใช้คำสั่ง npm สำหรับพัฒนาและ build โปรเจกต์ได้"],
      requiredTools: ["Node.js 20 LTS ขึ้นไป", "Visual Studio Code", "เบราว์เซอร์ Chrome หรือ Edge", "Git สำหรับจัดการ version"],
      descriptionHtml: "<p><strong>เนื้อหาหลัก:</strong> รู้จักโครงสร้างโปรเจกต์ Vue 3 และขั้นตอนการติดตั้ง Environment</p><p>ทดลองสร้างหน้าแรกด้วย <code>create-vue</code> และตรวจสอบการทำงานของ Development Server</p><h3>ขั้นตอนทดลอง</h3><ol><li>ติดตั้ง Node.js</li><li>สร้างโปรเจกต์ด้วย Vite</li><li>เปิดโปรเจกต์ใน VS Code</li></ol>",
      codeExample: "npm create vue@latest lesson-demo\ncd lesson-demo\nnpm install\nnpm run dev",
      codeLanguage: "Bash",
      gradingCriteria: [{ title: "ส่งงานล่าช้า", deduction: 10, unit: "% ต่อวัน" }, { title: "ไม่ติดตั้งและแนบภาพผลลัพธ์", deduction: 5, unit: "%" }],
      resources: [{ title: "Vue.js Official Guide", url: "https://vuejs.org/guide/introduction.html", type: "เอกสาร" }, { title: "Vite Documentation", url: "https://vite.dev/guide/", type: "เครื่องมือ" }],
      publishAt: "", isHidden: false,
      attachments: [{ name: "Slide_Ch1_Intro.pdf", type: "application/pdf", size: 2457600 }, { name: "vue-starter.zip", type: "application/zip", size: 5242880 }, { name: "main.js", type: "text/javascript", size: 1840 }],
      tasks: [{ title: "แบบฝึกหัด: ติดตั้งโปรเจกต์แรกด้วย Vite", description: "สร้างโปรเจกต์และแนบภาพหน้าจอหน้าเว็บที่รันสำเร็จ", points: 10, due: "15 ก.ย. 2569", submission: "แนบภาพหน้าจอและไฟล์ package.json" }]
    },
    {
      id: "m2", title: "บทที่ 2: Reactivity & Composition API", type: "video", duration: "2 ชม. 00 นาที", status: "กำลังเรียน", progress: 45,
      description: "เจาะลึกการใช้ ref(), reactive(), computed() และ watch() เพื่อจัดการข้อมูลในระบบ",
      summary: "เข้าใจระบบ Reactivity ของ Vue และเลือกใช้ API ให้เหมาะกับรูปแบบข้อมูลของแอปพลิเคชัน",
      objectives: ["สร้างและแก้ไข reactive state ด้วย ref และ reactive ได้", "คำนวณค่าจาก state ด้วย computed ได้", "ติดตามการเปลี่ยนแปลงข้อมูลด้วย watch ได้"],
      requiredTools: ["Visual Studio Code", "Vue Devtools", "Node.js 20 LTS", "ส่วนเสริม Volar"],
      descriptionHtml: "<p>ในบทนี้จะทดลองจัดการ state แบบ reactive ด้วย Composition API</p><p>ตัวอย่างเช่น การสร้างตัวนับด้วย <code>ref(0)</code> และการคำนวณค่าด้วย <code>computed()</code></p><blockquote>ควรแยก state ตามหน้าที่ เพื่อให้ง่ายต่อการดูแลรักษา</blockquote>",
      codeExample: "import { ref, computed } from 'vue'\n\nconst count = ref(0)\nconst doubled = computed(() => count.value * 2)\n\nfunction increment() {\n  count.value++\n}",
      codeLanguage: "TypeScript",
      gradingCriteria: [{ title: "ผลลัพธ์การทำงานไม่ตรงโจทย์", deduction: 20, unit: "%" }, { title: "ไม่อธิบายการใช้ ref และ reactive", deduction: 10, unit: "%" }],
      resources: [{ title: "Reactivity Fundamentals", url: "https://vuejs.org/guide/essentials/reactivity-fundamentals.html", type: "เอกสาร" }, { title: "Vue Devtools", url: "https://devtools.vuejs.org/", type: "เครื่องมือ" }, { title: "ลองรันตัวอย่างบน StackBlitz", url: "https://stackblitz.com/", type: "เว็บไซต์" }],
      publishAt: "2026-09-12T09:00", isHidden: false,
      attachments: [{ name: "Slide_Ch2_Reactivity.pdf", type: "application/pdf", size: 3145728 }, { name: "reactivity-demo.ts", type: "text/typescript", size: 2680 }, { name: "lesson-2-demo.mp4", type: "video/mp4", size: 18874368 }],
      tasks: [{ title: "ใบงาน: สร้างระบบ Counter & Text Reverser", description: "สร้างหน้าเว็บที่เพิ่ม/ลดตัวเลขและกลับข้อความด้วย computed", points: 20, due: "22 ก.ย. 2569", submission: "แนบไฟล์ .zip และภาพหน้าจอ" }]
    },
    {
      id: "m3", title: "บทที่ 3: Components & Props/Emits", type: "doc", duration: "1 ชม. 30 นาที", status: "ยังไม่เรียน", progress: 0,
      description: "การแบ่งส่วนหน้าเว็บเป็น Component การส่งข้อมูลผ่าน Props และรับเหตุการณ์ด้วย Emits",
      summary: "ออกแบบ Component ให้รับส่งข้อมูลระหว่าง parent และ child ได้อย่างเป็นระบบ",
      objectives: ["แบ่งหน้าเว็บเป็น Component ที่นำกลับมาใช้ซ้ำได้", "กำหนด Props พร้อม type ได้", "ส่ง event จาก child กลับไปยัง parent ด้วย Emits ได้"],
      requiredTools: ["Visual Studio Code", "Node.js 20 LTS", "Vue Language Tools", "เบราว์เซอร์สำหรับตรวจสอบผลลัพธ์"],
      descriptionHtml: "<p>เรียนรู้การออกแบบ Component และการกำหนด interface ระหว่างส่วนต่าง ๆ ของหน้าเว็บ</p><pre><code>defineProps&lt;{ title: string }&gt;()</code></pre><p>ท้ายบทจะมีแบบฝึกหัดสร้าง Card Component ที่รับข้อมูลผ่าน Props</p>",
      codeExample: "const props = defineProps<{ title: string }>()\nconst emit = defineEmits<{ select: [id: string] }>()\n\nfunction handleSelect() {\n  emit('select', props.title)\n}",
      codeLanguage: "TypeScript",
      gradingCriteria: [{ title: "Component ใช้งานซ้ำไม่ได้", deduction: 15, unit: "%" }, { title: "Props หรือ Emits ทำงานไม่ถูกต้อง", deduction: 25, unit: "%" }],
      resources: [{ title: "Components Basics", url: "https://vuejs.org/guide/essentials/component-basics.html", type: "เอกสาร" }, { title: "Vue Component Playground", url: "https://play.vuejs.org/", type: "เว็บไซต์" }],
      publishAt: "", isHidden: true,
      attachments: [{ name: "CheatSheet_Components.pdf", type: "application/pdf", size: 1572864 }, { name: "CardComponent.vue", type: "text/vue", size: 3420 }, { name: "component-example.zip", type: "application/zip", size: 7340032 }],
      tasks: [{ title: "แบบฝึกหัด: สร้าง Card Component", description: "สร้าง Card ที่รับ title, description และ emit event เมื่อคลิก", points: 15, due: "30 ก.ย. 2569", submission: "แนบไฟล์ CardComponent.vue" }]
    }
  ],
  assignments: [
    {
      id: "a1", title: "สร้าง Todo List (Composition API)", type: "Workshop",
      description: "ให้นักศึกษาพัฒนาระบบ Todo List ที่สามารถ เพิ่ม, ลบ, แก้ไข และบันทึกข้อมูลลง LocalStorage ได้",
      points: 15, createdAt: "20 ส.ค. 2569", due: "30 ส.ค. 2569, 23:59", status: "กำลังเปิดรับงาน",
      isHidden: false, submitted: 28, totalStudents: 35
    },
    {
      id: "a2", title: "เชื่อมต่อ API ข้อมูลสภาพอากาศ", type: "Mini-Project",
      description: "ดึงข้อมูลจาก OpenWeather API มาแสดงผล อุณหภูมิ ความชื้น และทำไอคอนสภาพอากาศให้ตรงกับข้อมูล",
      points: 20, createdAt: "25 ส.ค. 2569", due: "10 ก.ย. 2569, 23:59", status: "ร่าง (Draft)",
      isHidden: true, submitted: 0, totalStudents: 35
    }
  ],
  members: [
    { id: "u1", studentCode: "6701001", name: "สมชาย ใจดี", role: "นักเรียน", avatar: "https://i.pravatar.cc/150?u=student1", progress: 85, lastActive: "2 ชั่วโมงที่แล้ว", status: "good" },
    { id: "u2", studentCode: "6701002", name: "วิภา แสงมณี", role: "นักเรียน", avatar: "https://i.pravatar.cc/150?u=student2", progress: 40, lastActive: "3 วันที่แล้ว", status: "warning" },
    { id: "u3", studentCode: "6701003", name: "ธนกร พัฒนศิลป์", role: "นักเรียน", avatar: "https://i.pravatar.cc/150?u=student3", progress: 100, lastActive: "ออนไลน์", status: "excellent" },
    { id: "u4", studentCode: "6701004", name: "อารยา วงศ์สว่าง", role: "นักเรียน", avatar: "https://i.pravatar.cc/150?u=student4", progress: 10, lastActive: "2 สัปดาห์ที่แล้ว", status: "danger" },
  ],
  reports: [
    { label: "นักเรียนทั้งหมด", value: "35", trend: "up", change: "+2 คน" },
    { label: "ความคืบหน้าเฉลี่ย", value: "68%", trend: "up", change: "+12%" },
    { label: "อัตราการส่งงาน", value: "82%", trend: "up", change: "+5%" },
    { label: "นักเรียนที่ต้องติดตาม", value: "3", trend: "down", change: "-1 คน" }
  ],
  settings: [
    { key: "การแสดงผลเนื้อหา", detail: "อนุญาตให้นักเรียนเห็นบทเรียนล่วงหน้าได้หรือไม่", value: "ปิด (ตามลำดับ)" },
    { key: "การส่งงานล่าช้า", detail: "หักคะแนนหากส่งงานเกินกำหนด", value: "หัก 10% ต่อวัน" },
  ]
};

// Computed Properties
const post = computed(() => {
  const selectedPost = store.selectedPost as typeof mockData;
  if (!selectedPost || Object.keys(selectedPost).length === 0) return mockData;

  const detailedModules = (selectedPost.modules || []).map((module, index) => ({
    ...mockData.modules[index],
    ...module,
    attachments: module.attachments?.length ? module.attachments : mockData.modules[index]?.attachments || [],
    tasks: module.tasks?.length ? module.tasks : mockData.modules[index]?.tasks || [],
    objectives: module.objectives?.length ? module.objectives : mockData.modules[index]?.objectives || [],
    requiredTools: module.requiredTools?.length ? module.requiredTools : mockData.modules[index]?.requiredTools || [],
    gradingCriteria: module.gradingCriteria?.length ? module.gradingCriteria : mockData.modules[index]?.gradingCriteria || [],
    resources: module.resources?.length ? module.resources : mockData.modules[index]?.resources || [],
    descriptionHtml: module.descriptionHtml || mockData.modules[index]?.descriptionHtml || '',
    summary: module.summary || mockData.modules[index]?.summary || '',
    codeExample: module.codeExample || mockData.modules[index]?.codeExample || '',
  }));

  return { ...mockData, ...selectedPost, modules: detailedModules };
});
const displayTitle = computed(() => post.value?.displayTitle || post.value?.title || 'บทความ');
const formattedDate = computed(() => post.value?.createdAt ? format(new Date(post.value.createdAt), "d MMM yyyy") : "");
const gradingTotal = computed(() => (post.value?.gradingCriteria || []).reduce((sum: number, item: { percentage?: number }) => sum + (item.percentage || 0), 0));

const moduleList = computed(() => post.value?.modules || []);
const assignmentList = computed(() => post.value?.assignments || []);
const memberList = computed(() => post.value?.members || []);
const reportList = computed(() => post.value?.reports || []);
const reportMetrics = computed(() => {
  const members = memberList.value as Array<{ progress?: number }>;
  const assignments = assignmentList.value as Array<{ submitted?: number; totalStudents?: number }>;
  const totalStudents = members.length || Number(reportList.value.find((item) => item.label === 'นักเรียนทั้งหมด')?.value) || 0;
  const averageProgress = members.length ? Math.round(members.reduce((total, member) => total + (member.progress || 0), 0) / members.length) : 0;
  const totalSubmissions = assignments.reduce((total, assignment) => total + (assignment.submitted || 0), 0);
  const expectedSubmissions = assignments.reduce((total, assignment) => total + (assignment.totalStudents || totalStudents), 0);
  const submissionRate = expectedSubmissions ? Math.round((totalSubmissions / expectedSubmissions) * 100) : 0;
  return { totalStudents, averageProgress, submissionRate, needsAttention: members.filter((member) => (member.progress || 0) < 50).length };
});
const lessonReport = computed(() => (moduleList.value as Array<{ title: string; progress?: number; status?: string }>).map((module) => ({ title: module.title, progress: module.progress || 0, status: module.status || 'ยังไม่เริ่ม' })));
const assignmentReport = computed(() => (assignmentList.value as Array<{ title: string; submitted?: number; totalStudents?: number; due?: string; points?: number }>).map((assignment) => {
  const submitted = assignment.submitted || 0;
  const total = assignment.totalStudents || reportMetrics.value.totalStudents || 1;
  return { ...assignment, submitted, total, rate: Math.round((submitted / total) * 100) };
}));
const gradebookRows = computed(() => (memberList.value as Array<{ id: string | number; name: string; studentCode?: string; progress?: number; avatar?: string; status?: string; lastActive?: string }>).map((member) => {
  const scores = (assignmentList.value as Array<{ id: string | number; title: string; points?: number; isHidden?: boolean }>).map((assignment) => ({
    id: assignment.id,
    title: assignment.title,
    points: assignment.points || 0,
    score: assignment.isHidden ? null : Math.round(((member.progress || 0) / 100) * (assignment.points || 0)),
  }));
  const earned = scores.reduce((total, item) => total + (item.score || 0), 0);
  const possible = scores.reduce((total, item) => total + item.points, 0);
  return { ...member, scores, earned, possible, percentage: possible ? Math.round((earned / possible) * 100) : 0 };
}));

// Actions
const setLessonState = (id: string, open: boolean) => lessonAccordionState.value[id] = open;
const exportReport = () => alert(`เตรียมส่งออกรายงานมุมมอง: ${reportView.value}`);
const saveSettings = () => {
  if (!auth.isTeacher) return;
  settingsSaved.value = true;
  setTimeout(() => { settingsSaved.value = false; }, 2500);
};
const messageStudent = (name: string) => alert(`เปิดช่องแชทเพื่อส่งข้อความหา: ${name}`);
const formatLessonText = (command: string, value?: string) => document.execCommand(command, false, value);
const runLessonEditorCommand = (command: string, value?: string) => {
  lessonEditor.value?.focus();
  formatLessonText(command, value);
  if (lessonEditor.value) lessonForm.value.descriptionHtml = lessonEditor.value.innerHTML;
};
const createLessonLink = () => {
  const url = window.prompt('วาง URL ของลิงก์');
  if (url) runLessonEditorCommand('createLink', url);
};
const insertLessonTable = () => {
  runLessonEditorCommand('insertHTML', '<table class="w-full border-collapse"><tbody><tr><td class="border p-2">หัวข้อ</td><td class="border p-2">รายละเอียด</td></tr><tr><td class="border p-2">ข้อมูล</td><td class="border p-2">รายละเอียดเพิ่มเติม</td></tr></tbody></table><p><br></p>');
};
const insertInlineCode = () => {
  lessonEditor.value?.focus();
  const selection = window.getSelection();
  const selectedText = selection?.toString();
  if (!selectedText) {
    alert('กรุณาลากเลือกข้อความหรือโค้ดที่ต้องการทำเป็นโค้ดในบรรทัดก่อน');
    return;
  }
  document.execCommand('insertHTML', false, `<code class="lesson-inline-code">${selectedText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>`);
  if (lessonEditor.value) lessonForm.value.descriptionHtml = lessonEditor.value.innerHTML;
};
const toggleLessonHtmlSource = () => {
  if (!showLessonHtmlSource.value && lessonEditor.value) lessonForm.value.descriptionHtml = lessonEditor.value.innerHTML;
  showLessonHtmlSource.value = !showLessonHtmlSource.value;
};
const insertLessonImage = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => document.execCommand('insertImage', false, String(reader.result));
  reader.readAsDataURL(file);
  (event.target as HTMLInputElement).value = '';
};
const embedLessonVideo = () => {
  const url = lessonForm.value.embedVideoUrl.trim();
  if (!url) return;
  const embedUrl = url.includes('youtube.com/watch?v=')
    ? `https://www.youtube.com/embed/${url.split('v=')[1].split('&')[0]}`
    : url.includes('youtu.be/')
      ? `https://www.youtube.com/embed/${url.split('youtu.be/')[1].split('?')[0]}`
      : url;
  document.execCommand('insertHTML', false, `<div class="lesson-video my-4 aspect-video overflow-hidden rounded-lg"><iframe src="${embedUrl}" title="วิดีโอบทเรียน" class="h-full w-full" allowfullscreen></iframe></div><p><br></p>`);
  lessonForm.value.embedVideoUrl = '';
};
const updateLessonDescription = (event: Event) => {
  lessonForm.value.descriptionHtml = (event.target as HTMLElement).innerHTML;
};
const updateLessonHtmlSource = (event: Event) => {
  lessonForm.value.descriptionHtml = (event.target as HTMLTextAreaElement).value;
};
const handleLessonFiles = (event: Event) => {
  const files = Array.from((event.target as HTMLInputElement).files || []);
  lessonFiles.value = [...lessonFiles.value, ...files];
  (event.target as HTMLInputElement).value = '';
};
const removeLessonFile = (index: number) => lessonFiles.value.splice(index, 1);
const addLessonCriteria = () => lessonCriteria.value.push({ title: '', deduction: 0, unit: '%' });
const removeLessonCriteria = (index: number) => {
  if (lessonCriteria.value.length > 1) lessonCriteria.value.splice(index, 1);
};
const addLessonResource = () => lessonResources.value.push({ title: '', url: '', type: 'เครื่องมือ' });
const removeLessonResource = (index: number) => {
  if (lessonResources.value.length > 1) lessonResources.value.splice(index, 1);
};
const addLessonTask = () => lessonTasks.value.push({ title: '', description: '', points: 10, due: '', submission: 'แนบไฟล์' });
const removeLessonTask = (index: number) => {
  if (lessonTasks.value.length > 1) lessonTasks.value.splice(index, 1);
};
const fileIcon = (file: File) => {
  if (file.type.startsWith('image/')) return 'solar:gallery-linear';
  if (file.type === 'application/pdf') return 'solar:file-pdf-linear';
  if (file.type.startsWith('video/')) return 'solar:videocamera-record-linear';
  if (/\.(c|h|cpp|hpp|js|jsx|ts|tsx|py|java|json|sql|html|css|md)$/i.test(file.name)) return 'solar:code-file-linear';
  return 'solar:file-download-linear';
};
const saveLesson = () => {
  if (!auth.isTeacher) return;
  if (!lessonForm.value.title.trim()) {
    alert('กรุณาระบุชื่อบทเรียน');
    return;
  }

  const target = post.value as typeof mockData;
  target.modules = target.modules || [];
  const lessonData = {
    id: editingLessonId.value || `lesson-${Date.now()}`,
    title: lessonForm.value.title.trim(),
    type: 'lesson',
    duration: lessonForm.value.duration || 'ไม่ระบุเวลา',
    status: lessonForm.value.isHidden ? 'ซ่อนอยู่' : lessonForm.value.publishAt ? 'ตั้งเวลาเผยแพร่' : 'เผยแพร่แล้ว',
    progress: 0,
    summary: lessonForm.value.summary.trim(),
    objectives: lessonForm.value.objectives.split('\n').map((item) => item.trim()).filter(Boolean),
    requiredTools: lessonForm.value.requiredTools.split('\n').map((item) => item.trim()).filter(Boolean),
    description: lessonForm.value.descriptionHtml.replace(/<[^>]+>/g, ' ').trim(),
    descriptionHtml: lessonForm.value.descriptionHtml,
    publishAt: lessonForm.value.publishAt,
    isHidden: lessonForm.value.isHidden,
    resources: lessonResources.value.filter((resource) => resource.title.trim() && resource.url.trim()).map((resource) => ({ ...resource })),
    gradingCriteria: lessonCriteria.value.map((criteria) => ({ ...criteria })),
    attachments: lessonFiles.value.map((file) => ({ name: file.name, type: file.type, size: file.size })),
    tasks: lessonTasks.value.filter((task) => task.title.trim()).map((task) => ({ ...task })),
  };
  const modules = target.modules as Array<Record<string, any>>;
  const editingIndex = modules.findIndex((module) => module.id === editingLessonId.value);
  if (editingIndex >= 0) {
    modules[editingIndex] = { ...modules[editingIndex], ...lessonData, attachments: lessonFiles.value.length ? lessonData.attachments : modules[editingIndex].attachments };
  } else {
    modules.push(lessonData);
  }
  editingLessonId.value = null;
  lessonForm.value = { title: '', duration: '', summary: '', objectives: '', requiredTools: '', descriptionHtml: '', codeLanguage: 'C', publishAt: '', isHidden: false, embedVideoUrl: '' };
  lessonFiles.value = [];
  lessonResources.value = [{ title: '', url: '', type: 'เครื่องมือ' }];
  lessonTasks.value = [{ title: '', description: '', points: 10, due: '', submission: 'แนบไฟล์' }];
  lessonCriteria.value = [{ title: 'ส่งงานล่าช้า', deduction: 10, unit: '% ต่อวัน' }, { title: 'ไม่แนบไฟล์ตามที่กำหนด', deduction: 5, unit: '%' }];
  showAddLessonModal.value = false;
};
const editLesson = (module: Record<string, any>) => {
  if (!auth.isTeacher) return;
  editingLessonId.value = String(module.id);
  lessonForm.value = {
    title: module.title || '',
    duration: module.duration || '',
    summary: module.summary || '',
    objectives: (module.objectives || []).join('\n'),
    requiredTools: (module.requiredTools || []).join('\n'),
    descriptionHtml: module.descriptionHtml || module.description || '',
    codeLanguage: module.codeLanguage || 'C',
    publishAt: module.publishAt || '',
    isHidden: Boolean(module.isHidden),
    embedVideoUrl: '',
  };
  lessonCriteria.value = module.gradingCriteria?.length ? module.gradingCriteria.map((criteria: any) => ({ ...criteria })) : [{ title: '', deduction: 0, unit: '%' }];
  lessonResources.value = module.resources?.length ? module.resources.map((resource: any) => ({ ...resource })) : [{ title: '', url: '', type: 'เครื่องมือ' }];
  lessonTasks.value = module.tasks?.length ? module.tasks.map((task: any) => ({ title: task.title || '', description: task.description || '', points: task.points || 0, due: task.due || '', submission: task.submission || 'แนบไฟล์' })) : [{ title: '', description: '', points: 10, due: '', submission: 'แนบไฟล์' }];
  lessonFiles.value = [];
  showAddLessonModal.value = true;
};
const openAddLesson = () => {
  if (!auth.isTeacher) return;
  editingLessonId.value = null;
  lessonForm.value = { title: '', duration: '', summary: '', objectives: '', requiredTools: '', descriptionHtml: '', codeLanguage: 'C', publishAt: '', isHidden: false, embedVideoUrl: '' };
  lessonFiles.value = [];
  lessonResources.value = [{ title: '', url: '', type: 'เครื่องมือ' }];
  lessonTasks.value = [{ title: '', description: '', points: 10, due: '', submission: 'แนบไฟล์' }];
  lessonCriteria.value = [{ title: 'ส่งงานล่าช้า', deduction: 10, unit: '% ต่อวัน' }, { title: 'ไม่แนบไฟล์ตามที่กำหนด', deduction: 5, unit: '%' }];
  showAddLessonModal.value = true;
};
const deleteLesson = (moduleId: string) => {
  if (!auth.isTeacher) return;
  if (!window.confirm('ต้องการลบบทเรียนนี้ใช่หรือไม่? ข้อมูลบทเรียนจะไม่สามารถกู้คืนได้')) return;
  const target = post.value as typeof mockData;
  target.modules = (target.modules || []).filter((module: { id: string }) => module.id !== moduleId);
};
const toggleLessonVisibility = (module: Record<string, any>) => {
  if (!auth.isTeacher) return;
  module.isHidden = !module.isHidden;
  module.status = module.isHidden ? 'ซ่อนอยู่' : module.publishAt ? 'ตั้งเวลาเผยแพร่' : 'เผยแพร่แล้ว';
};
const openLessonDetail = (module: Record<string, any>) => {
  selectedLesson.value = module;
  showLessonDetailModal.value = true;
};
const submissionRows = computed<SubmissionRow[]>(() => {
  if (!selectedAssignment.value) return [];
  return (memberList.value as Array<Record<string, any>>).map((member, index) => {
    const submitted = index < Number(selectedAssignment.value?.submitted || 0);
    const pending = !submitted && index % 5 === 0;
    const points = Number(selectedAssignment.value?.points || 0);
    return {
      ...member,
      submissionStatus: submitted ? 'ส่งแล้ว' : pending ? 'รอตรวจ' : 'ยังไม่ส่ง',
      submittedAt: submitted ? `วันนี้ ${String(9 + (index % 8)).padStart(2, '0')}:2${index % 10} น.` : '-',
      score: submitted ? Math.max(0, points - (index % 4)) : null,
      fileName: submitted ? `${String(selectedAssignment.value?.title || 'assignment').slice(0, 18)}-${member.studentCode || member.id}.zip` : null,
    };
  });
});
const openAssignmentSubmissions = (assignment: Record<string, any>) => {
  selectedAssignment.value = assignment;
  selectedStudentSubmission.value = null;
  showSubmissionsModal.value = true;
};
const openAssignment = (assignment: Record<string, any>) => {
  const assignmentId = ({ a1: 'assignment-1', a2: 'assignment-2' } as Record<string, string>)[String(assignment.id)] || String(assignment.id);
  router.push(`/apps/assignments/${assignmentId}`);
};
const openStudentSubmission = (student: Record<string, any>) => {
  selectedStudentSubmission.value = student;
};
const alert = (message: string) => window.alert(message);
const addAssignmentRubric = () => assignmentRubrics.value.push({ title: '', percentage: 0 });
const removeAssignmentRubric = (index: number) => {
  if (assignmentRubrics.value.length > 1) assignmentRubrics.value.splice(index, 1);
};
const rubricTotal = computed(() => assignmentRubrics.value.reduce((total, rubric) => total + Number(rubric.percentage || 0), 0));
const saveAssignment = () => {
  if (!auth.isTeacher) return;
  if (!assignmentForm.value.title.trim() || !assignmentForm.value.description.trim()) {
    alert('กรุณากรอกชื่อใบงานและรายละเอียดคำสั่ง');
    return;
  }
  if (rubricTotal.value !== 100) {
    alert('สัดส่วนคะแนนของ Rubrics ต้องรวมกันเท่ากับ 100%');
    return;
  }

  const target = post.value as typeof mockData;
  target.assignments = target.assignments || [];
  (target.assignments as Array<Record<string, unknown>>).push({
    id: `assignment-${Date.now()}`,
    title: assignmentForm.value.title.trim(),
    type: assignmentForm.value.submissionMode === 'code' ? 'เขียนโค้ดในระบบ' : 'ใบงาน',
    description: assignmentForm.value.description.trim(),
    points: Number(assignmentForm.value.maxScore),
    createdAt: new Date().toLocaleDateString('th-TH'),
    due: `${assignmentForm.value.dueDate || 'ไม่ระบุวันที่'} ${assignmentForm.value.dueTime}`,
    status: 'กำลังเปิดรับงาน',
    isHidden: false,
    submitted: 0,
    totalStudents: memberList.value.length,
    rubrics: assignmentRubrics.value.map((rubric) => ({ ...rubric })),
  });
  assignmentForm.value = { title: '', description: '', dueDate: '', dueTime: '23:59', maxScore: 100, submissionMode: 'code' };
  assignmentRubrics.value = [{ title: '', percentage: 60 }, { title: '', percentage: 20 }, { title: '', percentage: 20 }];
  showAddAssignmentModal.value = false;
};
</script>

<template>
  <div class="flex flex-col gap-6 bg-transparent pb-12 max-w-7xl mx-auto font-sans">
    
    <!-- Header Section (Minimalist Cover) -->
    <div class="relative rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
      <!-- Subtle Accent Line instead of heavy gradient block -->
      <div class="h-2 w-full bg-slate-900 dark:bg-white"></div>
      
      <div class="p-8 md:p-10">
        <div class="flex flex-col md:flex-row gap-8 items-start">
          <!-- Avatar -->
          <Avatar v-if="post?.author?.avatar" class="h-20 w-20 md:h-24 md:w-24 rounded-2xl border border-slate-100 dark:border-slate-700 shrink-0">
            <AvatarImage :src="post.author.avatar" alt="instructor" class="object-cover rounded-2xl" />
            <AvatarFallback class="text-2xl font-medium bg-slate-50 text-slate-400">IN</AvatarFallback>
          </Avatar>
          
          <!-- Course Info -->
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-3">
              <Badge variant="secondary" class="bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 border-none px-3 py-1 text-xs font-medium rounded-full">
                {{ post?.category || 'คลาสเรียน' }}
              </Badge>
              <span class="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <Icon :icon="post.accessType === 'open' ? 'solar:global-linear' : 'solar:lock-keyhole-linear'" class="size-4" />
                {{ post.accessType === 'open' ? 'สาธารณะ' : 'ส่วนตัว' }}
              </span>
            </div>
            
            <h1 class="text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white tracking-tight leading-tight">
              {{ displayTitle }}
            </h1>
            <p v-if="post?.courseSummary" class="mt-4 text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl">
              {{ post.courseSummary }}
            </p>
            
            <!-- Minimal Meta Data -->
            <div class="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/60">
              <div class="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                <Icon icon="solar:users-group-rounded-linear" class="size-5" />
                <span>นักเรียน {{ post?.view || 0 }} คน</span>
              </div>
              <div class="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                <Icon icon="solar:calendar-linear" class="size-5" />
                <span>อัปเดต {{ formattedDate }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Tabs -->
    <div class="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <Tabs v-model="activeTab" class="w-full">
        
        <!-- Clean Tab Navigation -->
        <div class="border-b border-slate-200 dark:border-slate-800 px-4 md:px-8">
          <TabsList class="flex w-full justify-start overflow-x-auto bg-transparent p-0 h-16 hide-scrollbar gap-6">
            <TabsTrigger
              v-for="tab in tabItems"
              :key="tab.id"
              :value="tab.id"
              class="relative flex items-center gap-2.5 rounded-none border-b-2 border-transparent px-1 py-5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors data-[state=active]:border-slate-900 data-[state=active]:text-slate-900 data-[state=active]:bg-transparent dark:text-slate-400 dark:hover:text-white dark:data-[state=active]:border-white dark:data-[state=active]:text-white"
            >
              <Icon :icon="tab.icon" class="size-5" />
              {{ tab.label }}
            </TabsTrigger>
          </TabsList>
        </div>

        <div class="p-6 md:p-10">
          
          <!-- Tab 1: ภาพรวมคอร์ส (General) -->
          <TabsContent value="general" class="mt-0 space-y-10 animate-in fade-in duration-500">
            <div v-if="post?.level || post?.semester || post?.academicYear || post?.classCode" class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div v-for="(stat, key) in [{ label: 'ระดับชั้น', value: post?.level }, { label: 'ภาคเรียน', value: post?.semester }, { label: 'ปีการศึกษา', value: post?.academicYear }, { label: 'รหัสวิชา', value: post?.classCode }]" :key="key" v-show="stat.value" class="p-5 rounded-xl border border-slate-100 bg-slate-50/50 dark:bg-slate-800/30 dark:border-slate-700/50">
                <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{{ stat.label }}</p>
                <p class="text-sm font-medium text-slate-900 dark:text-slate-100">{{ stat.value }}</p>
              </div>
            </div>
            
            <div class="grid md:grid-cols-3 gap-10">
              <div class="md:col-span-2 space-y-6">
                <h3 class="text-lg font-semibold text-slate-900 dark:text-white">รายละเอียดรายวิชา</h3>
                <div v-if="post?.descriptionHtml" v-html="post.descriptionHtml" class="prose prose-slate prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-400"></div>
              </div>
              
              <div v-if="post?.gradingCriteria?.length" class="space-y-6">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold text-slate-900 dark:text-white">การประเมินผล</h3>
                  <span class="text-sm font-medium text-slate-500">รวม {{ gradingTotal }}%</span>
                </div>
                <div class="space-y-3">
                  <div v-for="(item, index) in post.gradingCriteria" :key="index" class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <span class="text-sm text-slate-600 dark:text-slate-300">{{ item.name }}</span>
                    <span class="text-sm font-medium text-slate-900 dark:text-white">{{ item.percentage }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <!-- Tab 2: เนื้อหาบทเรียน (Lessons) -->
          <TabsContent value="lessons" class="mt-0 space-y-6 animate-in fade-in duration-500">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 class="text-lg font-semibold text-slate-900 dark:text-white">โครงสร้างเนื้อหา</h3>
                <p class="text-sm text-slate-500 mt-1">จัดการและจัดลำดับบทเรียนทั้งหมด</p>
              </div>
              <button v-if="auth.isTeacher" @click="openAddLesson" class="flex items-center gap-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition">
                <Icon icon="solar:add-circle-linear" class="size-5" /> เพิ่มบทเรียน
              </button>
            </div>

            <div class="flex flex-col gap-3">
              <div v-for="(module, index) in moduleList" :key="module.id" class="rounded-xl border border-slate-200 bg-white dark:border-slate-700/50 dark:bg-slate-800/30 overflow-hidden transition-colors hover:border-slate-300 dark:hover:border-slate-600">
                <Collapsible :default-open="index === 0" :open="lessonAccordionState[module.id] ?? index === 0" @update:open="(value) => setLessonState(module.id, value)">
                  <CollapsibleTrigger class="flex w-full items-center justify-between p-5 text-left group">
                    <div class="flex items-center gap-5">
                      <div class="flex items-center justify-center size-10 rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        <Icon :icon="module.type === 'video' ? 'solar:play-linear' : 'solar:document-text-linear'" class="size-5" />
                      </div>
                      <div>
                        <div class="flex flex-wrap items-center gap-2"><h4 class="text-base font-medium text-slate-900 dark:text-white group-hover:text-primary transition-colors">{{ module.title }}</h4><span v-if="module.isHidden" class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-700 dark:text-slate-300"><Icon icon="solar:eye-closed-linear" class="size-3" /> ซ่อนอยู่</span><span v-else-if="module.publishAt" class="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"><Icon icon="solar:calendar-linear" class="size-3" /> ตั้งเวลาเผยแพร่</span><span v-else class="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">เผยแพร่แล้ว</span></div>
                        <div class="flex items-center gap-3 text-xs text-slate-500 mt-1.5">
                          <span>{{ module.duration }}</span>
                          <span class="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                          <span>{{ module.attachments?.length || 0 }} ไฟล์แนบ</span>
                        </div>
                      </div>
                    </div>
                    <Icon :icon="(lessonAccordionState[module.id] ?? index === 0) ? 'solar:alt-arrow-up-line-duotone' : 'solar:alt-arrow-down-line-duotone'" class="size-5 text-slate-400" />
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div class="border-t border-slate-100 dark:border-slate-700/50 p-6 md:pl-[4.5rem]">
                      <p v-if="module.summary" class="mb-3 text-sm font-medium text-slate-700 dark:text-slate-200">{{ module.summary }}</p>
                      <div v-if="module.descriptionHtml" v-html="module.descriptionHtml" class="prose prose-sm prose-slate mb-6 max-w-none dark:prose-invert"></div>
                      <p v-else class="mb-6 text-sm text-slate-600 dark:text-slate-400">{{ module.description }}</p>

                      <div v-if="module.objectives?.length || module.requiredTools?.length" class="mb-6 grid gap-4 md:grid-cols-2">
                        <div v-if="module.objectives?.length" class="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-700/50 dark:bg-slate-800/50"><h5 class="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">วัตถุประสงค์การเรียนรู้</h5><ul class="list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300"><li v-for="objective in module.objectives" :key="objective">{{ objective }}</li></ul></div>
                        <div v-if="module.requiredTools?.length" class="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-700/50 dark:bg-slate-800/50"><h5 class="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">เครื่องมือที่จำเป็น</h5><ul class="list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300"><li v-for="tool in module.requiredTools" :key="tool">{{ tool }}</li></ul></div>
                      </div>

                      <div v-if="module.codeExample" class="mb-6"><div class="mb-2 flex items-center justify-between"><div><h5 class="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">ตัวอย่างโค้ด</h5><p class="mt-1 text-[11px] text-slate-400">ตัวอย่างสำหรับอ่านและทำความเข้าใจ ไม่ใช่ช่องแก้ไขโค้ด</p></div><span class="text-xs text-slate-400">{{ module.codeLanguage || 'Code' }}</span></div><pre class="overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs leading-6 text-slate-100"><code>{{ module.codeExample }}</code></pre></div>

                      <div v-if="module.gradingCriteria?.length" class="mb-6"><h5 class="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">เกณฑ์การตัดคะแนน</h5><div class="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700"><table class="w-full text-left text-xs"><thead class="bg-slate-50 text-slate-500 dark:bg-slate-800"><tr><th class="px-3 py-2 font-medium">เงื่อนไข</th><th class="px-3 py-2 font-medium">จำนวนที่หัก</th><th class="px-3 py-2 font-medium">หน่วย</th></tr></thead><tbody><tr v-for="(criteria, criteriaIndex) in module.gradingCriteria" :key="criteriaIndex" class="border-t border-slate-100 dark:border-slate-700"><td class="px-3 py-2 text-slate-600 dark:text-slate-300">{{ criteria.title }}</td><td class="px-3 py-2 text-slate-600 dark:text-slate-300">{{ criteria.deduction }}</td><td class="px-3 py-2 text-slate-600 dark:text-slate-300">{{ criteria.unit }}</td></tr></tbody></table></div></div>

                      <div v-if="module.resources?.length" class="mb-6"><h5 class="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">เครื่องมือและแหล่งเรียนรู้</h5><div class="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700"><table class="w-full text-left text-xs"><thead class="bg-slate-50 text-slate-500 dark:bg-slate-800"><tr><th class="px-3 py-2 font-medium">ชื่อรายการ</th><th class="px-3 py-2 font-medium">ประเภท</th><th class="px-3 py-2 font-medium">ลิงก์</th></tr></thead><tbody><tr v-for="(resource, resourceIndex) in module.resources" :key="resourceIndex" class="border-t border-slate-100 dark:border-slate-700"><td class="px-3 py-2 text-slate-600 dark:text-slate-300">{{ resource.title }}</td><td class="px-3 py-2 text-slate-500">{{ resource.type }}</td><td class="px-3 py-2"><a :href="resource.url" target="_blank" rel="noreferrer" class="text-primary hover:underline">เปิดลิงก์</a></td></tr></tbody></table></div></div>
                      
                      <div class="grid md:grid-cols-2 gap-8">
                        <!-- Attachments -->
                        <div v-if="module.attachments?.length">
                          <h5 class="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">เอกสารแนบ</h5>
                          <div class="space-y-2">
                            <div v-for="(file, fIndex) in module.attachments" :key="fIndex" class="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50 hover:border-slate-300 transition cursor-pointer">
                              <div class="flex items-center gap-3">
                                <Icon :icon="file.type === 'pdf' ? 'solar:file-pdf-linear' : 'solar:file-download-linear'" class="size-5 text-slate-400" />
                                <span class="text-sm text-slate-700 dark:text-slate-300">{{ file.name }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <!-- Tasks -->
                        <div v-if="module.tasks?.length">
                          <h5 class="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">งานประจำบท</h5>
                          <div class="space-y-2">
                            <div v-for="(task, tIndex) in module.tasks" :key="tIndex" class="flex items-center justify-between gap-4 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
                              <div><span class="block text-sm text-slate-700 dark:text-slate-300">{{ task.title }}</span><span v-if="task.description" class="mt-1 block text-xs text-slate-500">{{ task.description }}</span><span v-if="task.submission" class="mt-1 block text-[11px] text-slate-400">{{ task.submission }}</span></div><span v-if="task.points" class="shrink-0 text-xs font-medium text-primary">{{ task.points }} คะแนน<span v-if="task.due" class="block text-right text-slate-400">ส่ง {{ task.due }}</span></span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Quick Actions -->
                      <div class="flex flex-wrap items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button class="text-sm font-medium text-primary hover:underline" @click="openLessonDetail(module)">ดูรายละเอียด</button>
                        <button v-if="auth.isTeacher" class="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium transition" @click="editLesson(module)">แก้ไข</button>
                        <button v-if="auth.isTeacher" class="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium transition" @click="toggleLessonVisibility(module)"><Icon :icon="module.isHidden ? 'solar:eye-linear' : 'solar:eye-closed-linear'" class="size-4" />{{ module.isHidden ? 'แสดง' : 'ซ่อน' }}</button>
                        <button v-if="auth.isTeacher" class="text-sm text-red-500 hover:text-red-700 font-medium transition" @click="deleteLesson(module.id)">ลบ</button>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </TabsContent>

          <!-- Tab 3: งาน/แบบฝึกหัด (Assignments) -->
          <TabsContent value="assignments" class="mt-0 space-y-6 animate-in fade-in duration-500">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 class="text-lg font-semibold text-slate-900 dark:text-white">แบบฝึกหัดและงาน</h3>
                <p class="text-sm text-slate-500 mt-1">กำหนดหมายงานและการให้คะแนน</p>
              </div>
              <button v-if="auth.isTeacher" @click="showAddAssignmentModal = true" class="flex items-center gap-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition">
                <Icon icon="solar:folder-with-files-linear" class="size-5" /> สร้างใบงาน
              </button>
            </div>

            <div class="grid gap-4">
              <div v-for="item in assignmentList" :key="item.id" :class="auth.isStudent ? 'cursor-pointer hover:border-primary/50' : ''" class="group flex flex-col md:flex-row justify-between gap-6 p-6 rounded-xl border border-slate-200 bg-white dark:border-slate-700/50 dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-600 transition-colors relative" @click="auth.isStudent && openAssignment(item)">
                
                <div v-if="item.isHidden" class="absolute top-4 right-6 flex items-center gap-1.5 text-xs font-medium text-slate-400">
                  <Icon icon="solar:eye-closed-linear" class="size-4" /> ซ่อนอยู่
                </div>

                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <Badge variant="outline" class="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md">
                      {{ item.type }}
                    </Badge>
                  </div>
                  <h4 class="text-lg font-medium text-slate-900 dark:text-white">{{ item.title }}</h4>
                  <p class="text-sm text-slate-500 mt-2 line-clamp-2">{{ item.description }}</p>
                  
                  <div class="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-xs text-slate-500 font-medium">
                    <span class="flex items-center gap-1.5"><Icon icon="solar:calendar-add-linear" class="size-4 text-slate-400" /> สั่ง: {{ item.createdAt }}</span>
                    <span class="flex items-center gap-1.5 text-slate-900 dark:text-slate-300"><Icon icon="solar:alarm-linear" class="size-4" /> กำหนด: {{ item.due }}</span>
                    <span class="flex items-center gap-1.5"><Icon icon="solar:medal-star-linear" class="size-4 text-slate-400" /> {{ item.points }} คะแนน</span>
                  </div>
                </div>

                <div class="flex flex-col items-start md:items-end justify-between md:border-l border-slate-100 dark:border-slate-700/50 md:pl-6 pt-4 md:pt-0">
                  <div class="text-left md:text-right mb-4">
                    <p class="text-xs text-slate-500 font-medium">ส่งแล้ว / ทั้งหมด</p>
                    <p class="text-xl font-semibold text-slate-900 dark:text-white mt-1">{{ item.submitted }} <span class="text-sm text-slate-400 font-normal">/ {{ item.totalStudents }}</span></p>
                  </div>
                  <div class="flex items-center gap-3">
                    <button v-if="auth.isStudent" class="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white transition hover:opacity-90" @click="openAssignment(item)"><Icon icon="solar:pen-new-square-linear" class="size-4" />ทำใบงาน</button>
                    <button v-if="auth.isTeacher" class="text-sm font-medium text-slate-900 dark:text-white underline underline-offset-4 decoration-slate-300 hover:decoration-slate-900 dark:decoration-slate-600 transition" @click="openAssignmentSubmissions(item)">ดูผลงาน</button>
                    <button v-if="auth.isTeacher" class="text-slate-400 hover:text-slate-900 dark:hover:text-white transition"><Icon icon="solar:pen-linear" class="size-5" /></button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <!-- Tab 4: นักเรียน (Members) -->
          <TabsContent value="members" class="mt-0 space-y-6 animate-in fade-in duration-500">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="relative w-full max-w-sm">
                <Icon icon="solar:magnifer-linear" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
                <input type="text" placeholder="ค้นหารายชื่อ..." class="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition text-sm" />
              </div>
              <button class="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 transition border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg">
                <Icon icon="solar:filter-linear" class="size-4" /> ตัวกรอง
              </button>
            </div>

            <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/30">
              <div class="hidden min-w-[760px] items-center gap-4 border-b border-slate-200 bg-slate-50 px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:border-slate-700 dark:bg-slate-800/80 md:flex">
                <div class="flex-[2]">ชื่อ-นามสกุล</div>
                <div v-for="assignment in assignmentList" :key="assignment.id" class="w-28 truncate text-center" :title="assignment.title">{{ assignment.title }}</div>
                <div class="w-24 text-center">คะแนนรวม</div>
                <div class="w-16 text-right">แอคชั่น</div>
              </div>
                      <div class="min-w-[760px] divide-y divide-slate-100 dark:divide-slate-700/50">
                <div v-for="row in gradebookRows" :key="row.id" class="flex flex-col gap-4 px-6 py-4 transition hover:bg-slate-50/50 dark:hover:bg-slate-800/50 md:flex-row md:items-center">
                  <div class="flex-[2] flex items-center gap-4">
                    <Avatar class="h-10 w-10"><AvatarImage :src="row.avatar || ''" alt="student" /><AvatarFallback class="bg-slate-100 text-slate-600 text-xs">{{ row.name.slice(0, 2) }}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p class="text-sm font-medium text-slate-900 dark:text-white">{{ row.name }}</p><p class="text-xs text-slate-500 mt-0.5">{{ row.studentCode }}</p>
                    </div>
                  </div>
                  <div v-for="score in row.scores" :key="score.id" class="w-28 text-center text-xs"><span v-if="score.score !== null" :class="score.score >= score.points * 0.8 ? 'text-emerald-600' : score.score >= score.points * 0.5 ? 'text-amber-600' : 'text-rose-600'" class="font-semibold">{{ score.score }}</span><span v-else class="text-slate-400">ซ่อน</span></div>
                  <div class="w-24 text-center"><span class="text-sm font-semibold text-slate-900 dark:text-white">{{ row.earned }}</span><span class="mt-0.5 block text-[11px] text-slate-400">{{ row.percentage }}%</span></div>
                  <div class="w-16 flex justify-end gap-2">
                    <button @click="messageStudent(row.name)" class="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition"><Icon icon="solar:chat-round-line-linear" class="size-5" /></button>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500"><span class="font-medium text-slate-600 dark:text-slate-300">ความหมายของสีคะแนน:</span><span class="inline-flex items-center gap-1.5"><span class="size-2 rounded-full bg-emerald-500"></span>ดีมาก (80% ขึ้นไป)</span><span class="inline-flex items-center gap-1.5"><span class="size-2 rounded-full bg-amber-500"></span>ควรติดตาม (50–79%)</span><span class="inline-flex items-center gap-1.5"><span class="size-2 rounded-full bg-rose-500"></span>ต้องช่วยเหลือ (ต่ำกว่า 50%)</span></div>
          </TabsContent>

          <!-- Tab 5: รายงาน (Reports) -->
          <TabsContent value="reports" class="mt-0 space-y-8 animate-in fade-in duration-500">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-slate-900 dark:text-white">ภาพรวมการเรียน</h3>
                <p class="text-sm text-slate-500 mt-1">สถิติและข้อมูลการเข้าเรียนของนักศึกษา</p>
              </div>
              <div class="flex items-center gap-3"><select v-model="reportView" class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"><option value="overview">ภาพรวมทั้งหมด</option><option value="lessons">แยกตามบทเรียน</option><option value="assignments">แยกตามงาน</option></select><button @click="exportReport" class="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 transition border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg"><Icon icon="solar:file-download-linear" class="size-4" /> Export CSV</button></div>
            </div>

            <div class="grid grid-cols-2 gap-4 md:grid-cols-4"><div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700/50 dark:bg-slate-800/30"><p class="text-xs font-medium text-slate-500">นักเรียนทั้งหมด</p><p class="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{{ reportMetrics.totalStudents }}</p></div><div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700/50 dark:bg-slate-800/30"><p class="text-xs font-medium text-slate-500">ความคืบหน้าเฉลี่ย</p><p class="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{{ reportMetrics.averageProgress }}%</p></div><div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700/50 dark:bg-slate-800/30"><p class="text-xs font-medium text-slate-500">อัตราการส่งงาน</p><p class="mt-2 text-2xl font-semibold text-emerald-600">{{ reportMetrics.submissionRate }}%</p></div><div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700/50 dark:bg-slate-800/30"><p class="text-xs font-medium text-slate-500">ต้องติดตาม</p><p class="mt-2 text-2xl font-semibold text-amber-600">{{ reportMetrics.needsAttention }} คน</p></div></div>

            <div class="grid gap-6 lg:grid-cols-2">
              <section class="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700/50 dark:bg-slate-800/30"><div class="flex items-center justify-between"><div><h4 class="text-sm font-semibold text-slate-900 dark:text-white">ความคืบหน้ารายบท</h4><p class="mt-1 text-xs text-slate-500">ดูว่าผู้เรียนอยู่ที่บทใดของคลาส</p></div><Icon icon="solar:chart-2-linear" class="size-5 text-primary" /></div><div class="mt-6 space-y-5"><div v-for="lesson in lessonReport" :key="lesson.title"><div class="mb-2 flex items-center justify-between gap-3 text-xs"><span class="truncate text-slate-600 dark:text-slate-300">{{ lesson.title }}</span><span class="shrink-0 font-medium text-slate-900 dark:text-white">{{ lesson.progress }}%</span></div><div class="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700"><div class="h-full rounded-full bg-primary transition-all" :style="{ width: `${lesson.progress}%` }"></div></div><p class="mt-1 text-[11px] text-slate-400">{{ lesson.status }}</p></div><p v-if="!lessonReport.length" class="text-sm text-slate-500">ยังไม่มีข้อมูลบทเรียน</p></div></section>
              <section class="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700/50 dark:bg-slate-800/30"><div class="flex items-center justify-between"><div><h4 class="text-sm font-semibold text-slate-900 dark:text-white">อัตราการส่งงานรายใบงาน</h4><p class="mt-1 text-xs text-slate-500">เปรียบเทียบจำนวนงานที่ส่งกับนักเรียนทั้งหมด</p></div><Icon icon="solar:clipboard-check-linear" class="size-5 text-primary" /></div><div class="mt-6 space-y-5"><div v-for="assignment in assignmentReport" :key="assignment.title"><div class="mb-2 flex items-center justify-between gap-3 text-xs"><span class="truncate text-slate-600 dark:text-slate-300">{{ assignment.title }}</span><span class="shrink-0 font-medium text-slate-900 dark:text-white">{{ assignment.submitted }}/{{ assignment.total }}</span></div><div class="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700"><div class="h-full rounded-full" :class="assignment.rate >= 70 ? 'bg-emerald-500' : assignment.rate >= 40 ? 'bg-amber-500' : 'bg-rose-500'" :style="{ width: `${assignment.rate}%` }"></div></div><p class="mt-1 text-[11px] text-slate-400">{{ assignment.rate }}% · กำหนดส่ง {{ assignment.due }}</p></div><p v-if="!assignmentReport.length" class="text-sm text-slate-500">ยังไม่มีข้อมูลงาน</p></div></section>
            </div>

            <section class="rounded-xl border border-rose-100 bg-rose-50/30 p-6 dark:border-rose-900/30 dark:bg-rose-900/10"><div class="flex items-center justify-between"><div><h4 class="flex items-center gap-2 text-sm font-semibold text-rose-700 dark:text-rose-400"><Icon icon="solar:danger-triangle-linear" class="size-4" /> นักเรียนที่ต้องติดตาม</h4><p class="mt-1 text-xs text-slate-500">ผู้เรียนที่มีความคืบหน้าต่ำกว่า 50%</p></div><span class="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">{{ reportMetrics.needsAttention }} คน</span></div><div class="mt-4 grid gap-3 md:grid-cols-2"><div v-for="member in memberList.filter((m: { progress: number }) => m.progress < 50).slice(0, 4)" :key="member.id" class="flex items-center justify-between rounded-lg border border-rose-100 bg-white p-3 dark:border-rose-900/30 dark:bg-slate-900"><div><p class="text-sm font-medium text-slate-900 dark:text-white">{{ member.name }}</p><p class="mt-0.5 text-[11px] text-slate-500">ความคืบหน้า {{ member.progress }}%</p></div><button @click="messageStudent(member.name)" class="text-slate-400 hover:text-rose-600" aria-label="ส่งข้อความ"><Icon icon="solar:letter-linear" class="size-4" /></button></div><p v-if="reportMetrics.needsAttention === 0" class="text-sm text-emerald-700">ไม่มีนักเรียนที่ต้องติดตามในขณะนี้</p></div></section>
          </TabsContent>

          <!-- Tab 6: ตั้งค่า (Settings) -->
          <TabsContent value="settings" class="mt-0 animate-in fade-in duration-500">
            <div class="max-w-4xl space-y-6">
              <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h3 class="text-xl font-semibold text-slate-900 dark:text-white">ตั้งค่าคลาส</h3><p class="mt-1 text-sm text-slate-500">ควบคุมการเผยแพร่ เนื้อหา การดาวน์โหลด และการส่งงาน</p></div><span v-if="settingsSaved" class="inline-flex items-center gap-1.5 self-start rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 sm:self-auto"><Icon icon="solar:check-circle-linear" class="size-4" /> บันทึกแล้ว</span></div>
              <section class="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/30"><div class="flex items-start gap-3 border-b border-slate-100 bg-slate-50/70 px-5 py-4 dark:border-slate-700 dark:bg-slate-800/60"><span class="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon icon="solar:settings-linear" class="size-5" /></span><div><h4 class="text-sm font-semibold text-slate-900 dark:text-white">การเผยแพร่และการเข้าถึง</h4><p class="mt-1 text-xs text-slate-500">กำหนดสถานะและกลุ่มผู้เรียนที่มองเห็นคลาส</p></div></div><div class="divide-y divide-slate-100 px-5 dark:divide-slate-700"><div class="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between"><div><p class="text-sm font-medium text-slate-900 dark:text-white">สถานะคลาส</p><p class="mt-1 text-xs text-slate-500">ปิดคลาสเมื่อต้องการหยุดการเข้าถึงชั่วคราว</p></div><select v-model="settingsForm.courseStatus" class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary dark:border-slate-600 dark:bg-slate-900 sm:w-32"><option>เปิด</option><option>ปิด</option></select></div><div class="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between"><div><p class="text-sm font-medium text-slate-900 dark:text-white">สิทธิ์การเข้าถึง</p><p class="mt-1 text-xs text-slate-500">กำหนดว่าใครสามารถเห็นคลาสนี้</p></div><select v-model="settingsForm.accessType" class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary dark:border-slate-600 dark:bg-slate-900 sm:w-40"><option>สาธารณะ</option><option>เฉพาะผู้มีรหัส</option><option>เฉพาะสมาชิก</option></select></div></div></section>
              <section class="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/30"><div class="flex items-start gap-3 border-b border-slate-100 bg-slate-50/70 px-5 py-4 dark:border-slate-700 dark:bg-slate-800/60"><span class="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon icon="solar:book-2-linear" class="size-5" /></span><div><h4 class="text-sm font-semibold text-slate-900 dark:text-white">การเรียนและไฟล์ประกอบ</h4><p class="mt-1 text-xs text-slate-500">ควบคุมลำดับการเรียนและสิทธิ์ดาวน์โหลด</p></div></div><div class="divide-y divide-slate-100 px-5 dark:divide-slate-700"><label class="flex cursor-pointer items-center justify-between gap-4 py-5"><span><span class="block text-sm font-medium text-slate-900 dark:text-white">อนุญาตให้เห็นบทเรียนล่วงหน้า</span><span class="mt-1 block text-xs text-slate-500">ผู้เรียนสามารถเปิดบทถัดไปก่อนจบบทก่อนหน้าได้</span></span><input v-model="settingsForm.showFutureLessons" type="checkbox" class="size-5 accent-primary" /></label><label class="flex cursor-pointer items-center justify-between gap-4 py-5"><span><span class="block text-sm font-medium text-slate-900 dark:text-white">อนุญาตดาวน์โหลดไฟล์</span><span class="mt-1 block text-xs text-slate-500">PDF, ZIP และ Source Code ในบทเรียน</span></span><input v-model="settingsForm.allowDownloads" type="checkbox" class="size-5 accent-primary" /></label></div></section>
              <section class="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/30"><div class="flex items-start gap-3 border-b border-slate-100 bg-slate-50/70 px-5 py-4 dark:border-slate-700 dark:bg-slate-800/60"><span class="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon icon="solar:clipboard-list-linear" class="size-5" /></span><div><h4 class="text-sm font-semibold text-slate-900 dark:text-white">การส่งงาน</h4><p class="mt-1 text-xs text-slate-500">กำหนดนโยบายสำหรับงานที่ส่งหลังวันกำหนด</p></div></div><div class="divide-y divide-slate-100 px-5 dark:divide-slate-700"><label class="flex cursor-pointer items-center justify-between gap-4 py-5"><span><span class="block text-sm font-medium text-slate-900 dark:text-white">รับงานล่าช้า</span><span class="mt-1 block text-xs text-slate-500">เปิดรับงานหลังวันกำหนดส่งและหักคะแนนอัตโนมัติ</span></span><input v-model="settingsForm.lateSubmission" type="checkbox" class="size-5 accent-primary" /></label><div class="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between"><div><p class="text-sm font-medium text-slate-900 dark:text-white">หักคะแนนล่าช้า</p><p class="mt-1 text-xs text-slate-500">จำนวนคะแนนที่หักต่อวัน เมื่อเปิดรับงานล่าช้า</p></div><div class="flex items-center gap-2"><input v-model.number="settingsForm.latePenalty" type="number" min="0" max="100" :disabled="!settingsForm.lateSubmission" class="w-24 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:disabled:bg-slate-800" /><span class="text-sm text-slate-500">% ต่อวัน</span></div></div></div></section>
              <section class="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/30"><div class="flex items-start gap-3 border-b border-slate-100 bg-slate-50/70 px-5 py-4 dark:border-slate-700 dark:bg-slate-800/60"><span class="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon icon="solar:bell-linear" class="size-5" /></span><div><h4 class="text-sm font-semibold text-slate-900 dark:text-white">การแจ้งเตือน</h4><p class="mt-1 text-xs text-slate-500">แจ้งเตือนงานใหม่ กำหนดส่ง และประกาศสำคัญ</p></div></div><div class="px-5"><label class="flex cursor-pointer items-center justify-between gap-4 py-5"><span><span class="block text-sm font-medium text-slate-900 dark:text-white">เปิดการแจ้งเตือนของคลาส</span><span class="mt-1 block text-xs text-slate-500">ผู้เรียนจะได้รับการแจ้งเตือนเมื่อมีการเปลี่ยนแปลง</span></span><input v-model="settingsForm.notifications" type="checkbox" class="size-5 accent-primary" /></label></div></section>
              <div class="flex items-center justify-end gap-3 border-t border-slate-200 pt-2 dark:border-slate-700"><span v-if="settingsSaved" class="text-xs text-slate-500">การตั้งค่าถูกบันทึกในคลาสนี้แล้ว</span><button class="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90 dark:bg-white dark:text-slate-900" @click="saveSettings"><Icon icon="solar:diskette-linear" class="mr-1.5 inline size-4" />บันทึกการตั้งค่า</button></div>
            </div>
          </TabsContent>

        </div>
      </Tabs>
    </div>

    <!-- Modals (Popups) - Minimal Style -->

    <!-- Modal: Assignment submissions -->
    <div v-if="showSubmissionsModal && selectedAssignment" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div class="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5 dark:border-slate-800"><div><p class="text-xs font-medium text-primary">ตรวจการส่งงาน</p><h3 class="mt-1 text-xl font-semibold text-slate-900 dark:text-white">{{ selectedAssignment.title }}</h3><p class="mt-1 text-sm text-slate-500">ส่งแล้ว {{ selectedAssignment.submitted || 0 }}/{{ selectedAssignment.totalStudents || memberList.length }} คน · คะแนนเต็ม {{ selectedAssignment.points }} คะแนน</p></div><button class="text-slate-400 hover:text-slate-900 dark:hover:text-white" aria-label="ปิด" @click="showSubmissionsModal = false"><Icon icon="solar:close-circle-linear" class="size-6" /></button></div>
        <div class="grid min-h-0 flex-1 gap-6 overflow-y-auto p-6 lg:grid-cols-[minmax(0,1fr)_280px] md:p-8">
          <div><div class="mb-4 flex flex-wrap gap-2"><span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">ส่งแล้ว {{ submissionRows.filter((row) => row.submissionStatus === 'ส่งแล้ว').length }}</span><span class="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">รอตรวจ {{ submissionRows.filter((row) => row.submissionStatus === 'รอตรวจ').length }}</span><span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">ยังไม่ส่ง {{ submissionRows.filter((row) => row.submissionStatus === 'ยังไม่ส่ง').length }}</span></div><div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700"><table class="w-full min-w-[650px] text-left text-sm"><thead class="bg-slate-50 text-xs text-slate-500 dark:bg-slate-800"><tr><th class="px-4 py-3 font-medium">นักเรียน</th><th class="px-4 py-3 font-medium">สถานะ</th><th class="px-4 py-3 font-medium">เวลาส่ง</th><th class="px-4 py-3 font-medium">คะแนน</th><th class="px-4 py-3"></th></tr></thead><tbody><tr v-for="student in submissionRows" :key="student.id" :class="selectedStudentSubmission?.id === student.id ? 'bg-primary/[0.04]' : ''" class="border-t border-slate-100 dark:border-slate-700"><td class="px-4 py-3"><button class="text-left" @click="openStudentSubmission(student)"><span class="block font-medium text-slate-800 hover:text-primary dark:text-slate-100">{{ student.name }}</span><span class="mt-1 block text-xs text-slate-400">{{ student.studentCode }}</span></button></td><td class="px-4 py-3"><span :class="student.submissionStatus === 'ส่งแล้ว' ? 'bg-emerald-100 text-emerald-700' : student.submissionStatus === 'รอตรวจ' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'" class="rounded-full px-2.5 py-1 text-xs font-medium">{{ student.submissionStatus }}</span></td><td class="px-4 py-3 text-xs text-slate-500">{{ student.submittedAt }}</td><td class="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">{{ student.score === null ? '-' : `${student.score}/${selectedAssignment.points}` }}</td><td class="px-4 py-3 text-right"><button class="text-xs font-medium text-primary hover:underline" @click="openStudentSubmission(student)">ดูรายละเอียด</button></td></tr></tbody></table></div></div>
          <aside class="h-fit rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/50"><div v-if="selectedStudentSubmission"><div class="flex items-center justify-between"><h4 class="font-semibold text-slate-900 dark:text-white">รายละเอียดการส่ง</h4><button class="text-slate-400" aria-label="ปิดรายละเอียดนักเรียน" @click="selectedStudentSubmission = null"><Icon icon="solar:close-circle-linear" class="size-5" /></button></div><p class="mt-4 font-medium text-slate-800 dark:text-slate-100">{{ selectedStudentSubmission.name }}</p><dl class="mt-4 space-y-3 text-sm"><div class="flex justify-between gap-3"><dt class="text-slate-500">สถานะ</dt><dd class="font-medium">{{ selectedStudentSubmission.submissionStatus }}</dd></div><div class="flex justify-between gap-3"><dt class="text-slate-500">เวลาส่ง</dt><dd>{{ selectedStudentSubmission.submittedAt }}</dd></div><div class="flex justify-between gap-3"><dt class="text-slate-500">คะแนน</dt><dd>{{ selectedStudentSubmission.score === null ? '-' : `${selectedStudentSubmission.score}/${selectedAssignment.points}` }}</dd></div><div class="flex justify-between gap-3"><dt class="text-slate-500">ไฟล์</dt><dd class="max-w-[150px] truncate text-right">{{ selectedStudentSubmission.fileName || '-' }}</dd></div></dl><button v-if="selectedStudentSubmission.submissionStatus !== 'ยังไม่ส่ง'" class="mt-5 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90" @click="alert('เปิดหน้าตรวจงานและให้ Feedback')">เปิดตรวจงาน</button></div><div v-else class="py-8 text-center"><Icon icon="solar:user-check-linear" class="mx-auto size-10 text-slate-300" /><p class="mt-3 text-sm text-slate-500">เลือกนักเรียนเพื่อดูรายละเอียดการส่งงาน</p></div></aside>
        </div>
        <div class="flex justify-end border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50"><button class="rounded-lg px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800" @click="showSubmissionsModal = false">ปิด</button></div>
      </div>
    </div>

    <!-- Modal: Lesson detail -->
    <div v-if="showLessonDetailModal && selectedLesson" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div class="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5 dark:border-slate-800"><div><p class="text-xs font-medium text-primary">รายละเอียดบทเรียน</p><h3 class="mt-1 text-xl font-semibold text-slate-900 dark:text-white">{{ selectedLesson.title }}</h3><p class="mt-1 text-sm text-slate-500">{{ selectedLesson.duration }} · {{ selectedLesson.status }}</p></div><button class="text-slate-400 hover:text-slate-900 dark:hover:text-white" aria-label="ปิดรายละเอียด" @click="showLessonDetailModal = false"><Icon icon="solar:close-circle-linear" class="size-6" /></button></div>
        <div class="space-y-6 overflow-y-auto p-6 md:p-8">
          <p v-if="selectedLesson.summary" class="text-sm leading-7 text-slate-600 dark:text-slate-300">{{ selectedLesson.summary }}</p>
          <div v-if="selectedLesson.descriptionHtml" v-html="selectedLesson.descriptionHtml" class="prose prose-sm prose-slate max-w-none dark:prose-invert"></div>
          <div v-else class="text-sm leading-7 text-slate-600 dark:text-slate-300">{{ selectedLesson.description || 'ยังไม่มีรายละเอียดบทเรียน' }}</div>
          <div v-if="selectedLesson.codeExample" class="rounded-xl bg-slate-950 p-4"><div class="mb-2 flex items-center justify-between"><h4 class="text-sm font-semibold text-white">ตัวอย่างโค้ด</h4><span class="text-xs text-slate-400">อ่านอย่างเดียว</span></div><pre class="overflow-x-auto text-xs leading-6 text-slate-100"><code>{{ selectedLesson.codeExample }}</code></pre></div>
          <div v-if="selectedLesson.objectives?.length || selectedLesson.requiredTools?.length" class="grid gap-4 md:grid-cols-2"><div v-if="selectedLesson.objectives?.length" class="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60"><h4 class="mb-2 text-sm font-semibold text-slate-900 dark:text-white">วัตถุประสงค์</h4><ul class="list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300"><li v-for="objective in selectedLesson.objectives" :key="objective">{{ objective }}</li></ul></div><div v-if="selectedLesson.requiredTools?.length" class="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60"><h4 class="mb-2 text-sm font-semibold text-slate-900 dark:text-white">เครื่องมือที่จำเป็น</h4><ul class="list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300"><li v-for="tool in selectedLesson.requiredTools" :key="tool">{{ tool }}</li></ul></div></div>
          <div v-if="selectedLesson.gradingCriteria?.length"><h4 class="mb-2 text-sm font-semibold text-slate-900 dark:text-white">เกณฑ์การตัดคะแนน</h4><div class="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700"><table class="w-full text-left text-xs"><thead class="bg-slate-50 dark:bg-slate-800"><tr><th class="px-3 py-2">เงื่อนไข</th><th class="px-3 py-2">จำนวนที่หัก</th><th class="px-3 py-2">หน่วย</th></tr></thead><tbody><tr v-for="(criteria, index) in selectedLesson.gradingCriteria" :key="index" class="border-t border-slate-100 dark:border-slate-700"><td class="px-3 py-2">{{ criteria.title }}</td><td class="px-3 py-2">{{ criteria.deduction }}</td><td class="px-3 py-2">{{ criteria.unit }}</td></tr></tbody></table></div></div>
          <div v-if="selectedLesson.resources?.length"><h4 class="mb-2 text-sm font-semibold text-slate-900 dark:text-white">เครื่องมือและแหล่งเรียนรู้</h4><div class="space-y-2"><a v-for="resource in selectedLesson.resources" :key="resource.url" :href="resource.url" target="_blank" rel="noreferrer" class="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm hover:border-primary dark:border-slate-700"><span>{{ resource.title }}</span><span class="text-xs text-primary">{{ resource.type }} · เปิดลิงก์</span></a></div></div>
          <div v-if="selectedLesson.tasks?.length"><h4 class="mb-2 text-sm font-semibold text-slate-900 dark:text-white">แบบฝึกหัดท้ายบท</h4><div class="space-y-2"><div v-for="task in selectedLesson.tasks" :key="task.title" class="rounded-lg border border-slate-200 p-3 dark:border-slate-700"><div class="flex items-start justify-between gap-3"><span class="font-medium text-slate-700 dark:text-slate-200">{{ task.title }}</span><span v-if="task.points" class="shrink-0 text-xs text-primary">{{ task.points }} คะแนน</span></div><p v-if="task.description" class="mt-1 text-xs text-slate-500">{{ task.description }}</p><p v-if="task.due || task.submission" class="mt-2 text-[11px] text-slate-400">{{ task.due ? `กำหนดส่ง ${task.due}` : '' }}{{ task.submission ? ` · ${task.submission}` : '' }}</p></div></div></div>
          <div v-if="selectedLesson.attachments?.length"><h4 class="mb-2 text-sm font-semibold text-slate-900 dark:text-white">ไฟล์แนบ</h4><div class="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700"><table class="w-full text-left text-xs"><thead class="bg-slate-50 dark:bg-slate-800"><tr><th class="px-3 py-2">ชื่อไฟล์</th><th class="px-3 py-2">ประเภท</th><th class="px-3 py-2">การทำงาน</th></tr></thead><tbody><tr v-for="file in selectedLesson.attachments" :key="file.name" class="border-t border-slate-100 dark:border-slate-700"><td class="px-3 py-2">{{ file.name }}</td><td class="px-3 py-2 text-slate-500">{{ file.type }}</td><td class="px-3 py-2 text-primary">ดู/ดาวน์โหลด</td></tr></tbody></table></div></div>
        </div>
        <div class="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50"><button class="rounded-lg px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800" @click="showLessonDetailModal = false">ปิด</button><button v-if="auth.isTeacher" class="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white dark:bg-white dark:text-slate-900" @click="showLessonDetailModal = false; editLesson(selectedLesson)">แก้ไขบทเรียน</button></div>
      </div>
    </div>
    
    <!-- Modal: Add Lesson -->
    <div v-if="showAddLessonModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div class="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        <div class="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <h3 class="text-base font-semibold text-slate-900 dark:text-white">{{ editingLessonId ? 'แก้ไขบทเรียน' : 'เพิ่มบทเรียนใหม่' }}</h3>
          <button @click="showAddLessonModal = false" class="text-slate-400 hover:text-slate-900 dark:hover:text-white transition"><Icon icon="solar:close-circle-linear" class="size-6" /></button>
        </div>
        <div class="p-6 overflow-y-auto space-y-5">
          <div>
            <label class="block text-xs font-medium text-slate-500 mb-1.5">ชื่อบทเรียน</label>
            <input v-model="lessonForm.title" type="text" placeholder="เช่น บทที่ 4: ฟังก์ชันและการคืนค่า" class="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:border-slate-900 dark:focus:border-white transition text-sm" />
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-500 mb-1.5">สรุปเนื้อหาบทเรียน</label>
            <textarea v-model="lessonForm.summary" rows="2" placeholder="สรุปสั้น ๆ ว่าบทนี้เรียนเรื่องอะไร" class="w-full resize-y rounded-lg border border-slate-200 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-slate-900 dark:border-slate-700 dark:focus:border-white"></textarea>
          </div>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-xs font-medium text-slate-500">วัตถุประสงค์การเรียนรู้</label>
              <textarea v-model="lessonForm.objectives" rows="4" placeholder="ใส่ทีละข้อขึ้นบรรทัดใหม่ เช่น&#10;เข้าใจแนวคิด Pointer&#10;เขียน Pointer ในภาษา C ได้" class="w-full resize-y rounded-lg border border-slate-200 bg-transparent px-4 py-2.5 text-sm leading-6 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:focus:border-white"></textarea>
            </div>
            <div>
              <label class="mb-1.5 block text-xs font-medium text-slate-500">เครื่องมือและสิ่งที่ต้องเตรียม</label>
              <textarea v-model="lessonForm.requiredTools" rows="4" placeholder="ใส่ทีละรายการขึ้นบรรทัดใหม่ เช่น&#10;Visual Studio Code&#10;GCC Compiler&#10;Node.js 20+" class="w-full resize-y rounded-lg border border-slate-200 bg-transparent px-4 py-2.5 text-sm leading-6 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:focus:border-white"></textarea>
            </div>
          </div>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1.5">ระยะเวลาโดยประมาณ</label>
              <input v-model="lessonForm.duration" type="text" placeholder="เช่น 45 นาที" class="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:border-slate-900 dark:focus:border-white transition text-sm" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1.5">เวลาเผยแพร่</label>
              <input v-model="lessonForm.publishAt" type="datetime-local" class="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:border-slate-900 dark:focus:border-white transition text-sm" />
            </div>
          </div>
          <label class="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm dark:border-slate-700"><input v-model="lessonForm.isHidden" type="checkbox" class="size-4 accent-primary" /><span><span class="block font-medium text-slate-700 dark:text-slate-200">ซ่อนบทเรียนนี้จากผู้เรียน</span><span class="mt-0.5 block text-xs text-slate-500">ผู้สอนยังแก้ไขบทเรียนได้ และสามารถเผยแพร่ภายหลัง</span></span></label>
          <div>
            <label class="block text-xs font-medium text-slate-500 mb-1.5">รายละเอียดบทเรียน</label>
            <div class="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
              <div class="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800/60">
                <button type="button" title="ย้อนกลับ" class="editor-tool" @click="runLessonEditorCommand('undo')"><Icon icon="solar:undo-left-round-linear" class="size-4" /></button>
                <button type="button" title="ทำซ้ำ" class="editor-tool" @click="runLessonEditorCommand('redo')"><Icon icon="solar:undo-right-round-linear" class="size-4" /></button>
                <span class="editor-divider"></span>
                <button type="button" title="ตัวหนา" class="editor-tool font-bold" @click="runLessonEditorCommand('bold')">B</button>
                <button type="button" title="ตัวเอียง" class="editor-tool italic" @click="runLessonEditorCommand('italic')">I</button>
                <button type="button" title="ขีดฆ่า" class="editor-tool line-through" @click="runLessonEditorCommand('strikeThrough')">S</button>
                <button type="button" title="ล้างรูปแบบ" class="editor-tool" @click="runLessonEditorCommand('removeFormat')"><Icon icon="solar:eraser-linear" class="size-4" /></button>
                <span class="editor-divider"></span>
                <button type="button" title="รายการตัวเลข" class="editor-tool" @click="runLessonEditorCommand('insertOrderedList')"><Icon icon="solar:list-1-linear" class="size-4" /></button>
                <button type="button" title="รายการหัวข้อ" class="editor-tool" @click="runLessonEditorCommand('insertUnorderedList')"><Icon icon="solar:list-bold" class="size-4" /></button>
                <button type="button" title="ย่อหน้า" class="editor-tool" @click="runLessonEditorCommand('outdent')"><Icon icon="solar:unread-linear" class="size-4" /></button>
                <button type="button" title="เพิ่มระยะย่อหน้า" class="editor-tool" @click="runLessonEditorCommand('indent')"><Icon icon="solar:read-linear" class="size-4" /></button>
                <span class="editor-divider"></span>
                <select title="รูปแบบข้อความ" class="editor-select" @change="runLessonEditorCommand('formatBlock', ($event.target as HTMLSelectElement).value)"><option value="p">ย่อหน้า</option><option value="h2">หัวข้อใหญ่</option><option value="h3">หัวข้อ</option><option value="blockquote">คำพูด</option><option value="pre">โค้ด</option></select>
                <button type="button" title="โค้ดเฉพาะข้อความที่เลือก" class="editor-tool font-mono text-xs" @click="insertInlineCode">&lt;/&gt;</button>
                <button type="button" title="จัดชิดซ้าย" class="editor-tool" @click="runLessonEditorCommand('justifyLeft')"><Icon icon="solar:text-align-left-linear" class="size-4" /></button>
                <button type="button" title="จัดกึ่งกลาง" class="editor-tool" @click="runLessonEditorCommand('justifyCenter')"><Icon icon="solar:text-align-center-linear" class="size-4" /></button>
                <button type="button" title="จัดชิดขวา" class="editor-tool" @click="runLessonEditorCommand('justifyRight')"><Icon icon="solar:text-align-right-linear" class="size-4" /></button>
                <span class="editor-divider"></span>
                <button type="button" title="แทรกลิงก์" class="editor-tool" @click="createLessonLink"><Icon icon="solar:link-linear" class="size-4" /></button>
                <button type="button" title="แทรกรูปภาพในเนื้อหา" class="editor-tool" @click="lessonInlineImageInput?.click()"><Icon icon="solar:gallery-add-linear" class="size-4" /></button>
                <button type="button" title="แทรกตาราง" class="editor-tool" @click="insertLessonTable"><Icon icon="solar:table-linear" class="size-4" /></button>
                <label title="สีตัวอักษร" class="editor-tool flex cursor-pointer items-center">A<input type="color" class="ml-1 size-4 cursor-pointer border-0 bg-transparent p-0" value="#334155" @input="runLessonEditorCommand('foreColor', ($event.target as HTMLInputElement).value)" /></label>
                <label title="สีไฮไลต์" class="editor-tool flex cursor-pointer items-center">H<input type="color" class="ml-1 size-4 cursor-pointer border-0 bg-transparent p-0" value="#fef08a" @input="runLessonEditorCommand('hiliteColor', ($event.target as HTMLInputElement).value)" /></label>
                <input ref="lessonInlineImageInput" type="file" accept="image/*" class="hidden" @change="insertLessonImage" />
                <button type="button" title="ดู/แก้ HTML" class="editor-tool" @click="toggleLessonHtmlSource"><Icon icon="solar:code-square-linear" class="size-4" /></button>
              </div>
              <textarea v-if="showLessonHtmlSource" :value="lessonForm.descriptionHtml" class="min-h-[260px] w-full resize-y bg-slate-950 p-4 font-mono text-sm leading-6 text-emerald-300 outline-none" @input="updateLessonHtmlSource"></textarea>
              <div v-else ref="lessonEditor" contenteditable="true" class="min-h-[260px] p-5 text-sm leading-7 text-slate-700 outline-none dark:text-slate-200" data-placeholder="เขียนรายละเอียด เนื้อหา หรือวัตถุประสงค์ของบทเรียน..." @input="updateLessonDescription"></div>
            </div>
            <div class="mt-3 flex flex-col gap-2 sm:flex-row"><input v-model="lessonForm.embedVideoUrl" type="url" placeholder="วางลิงก์ YouTube หรือ Vimeo เพื่อฝังในเนื้อหา" class="min-w-0 flex-1 rounded-lg border border-slate-200 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-slate-700" /><button type="button" class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-200" @click="embedLessonVideo"><Icon icon="solar:videocamera-add-linear" class="size-5" /> ฝังคลิป</button></div>
          </div>
          <div>
            <div class="mb-3 flex items-center justify-between"><div><label class="block text-xs font-medium text-slate-500">เกณฑ์การตัดคะแนน</label><p class="mt-1 text-[11px] text-slate-400">กำหนดเงื่อนไขที่ใช้หักคะแนนของบทเรียนหรือแบบฝึกหัด</p></div><button type="button" class="inline-flex items-center gap-1 text-xs font-semibold text-primary" @click="addLessonCriteria"><Icon icon="solar:add-circle-linear" class="size-4" /> เพิ่มเกณฑ์</button></div>
            <div class="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700"><table class="w-full min-w-[540px] text-left text-sm"><thead class="bg-slate-50 text-xs text-slate-500 dark:bg-slate-800"><tr><th class="px-3 py-2 font-medium">เงื่อนไข</th><th class="w-36 px-3 py-2 font-medium">จำนวนที่หัก</th><th class="w-24 px-3 py-2 font-medium">หน่วย</th><th class="w-12 px-3 py-2"></th></tr></thead><tbody><tr v-for="(criteria, index) in lessonCriteria" :key="index" class="border-t border-slate-100 dark:border-slate-700"><td class="px-3 py-2"><input v-model="criteria.title" type="text" placeholder="เช่น ส่งงานล่าช้า" class="w-full rounded-md border border-slate-200 bg-transparent px-2.5 py-2 text-sm outline-none focus:border-primary dark:border-slate-700" /></td><td class="px-3 py-2"><input v-model.number="criteria.deduction" type="number" min="0" class="w-full rounded-md border border-slate-200 bg-transparent px-2.5 py-2 text-sm outline-none focus:border-primary dark:border-slate-700" /></td><td class="px-3 py-2"><select v-model="criteria.unit" class="w-full rounded-md border border-slate-200 bg-transparent px-2 py-2 text-sm outline-none dark:border-slate-700"><option>%</option><option>% ต่อวัน</option><option>คะแนน</option></select></td><td class="px-3 py-2 text-right"><button type="button" class="text-slate-400 hover:text-rose-500" aria-label="ลบเกณฑ์" @click="removeLessonCriteria(index)"><Icon icon="solar:trash-bin-minimalistic-linear" class="size-4" /></button></td></tr></tbody></table></div>
          </div>
          <div>
            <div class="mb-3 flex items-center justify-between"><div><label class="block text-xs font-medium text-slate-500">เครื่องมือและแหล่งเรียนรู้เพิ่มเติม</label><p class="mt-1 text-[11px] text-slate-400">แนบลิงก์ไปยัง Compiler, Documentation, API, เว็บไซต์ หรือซอฟต์แวร์ที่ต้องใช้</p></div><button type="button" class="inline-flex items-center gap-1 text-xs font-semibold text-primary" @click="addLessonResource"><Icon icon="solar:add-circle-linear" class="size-4" /> เพิ่มรายการ</button></div>
            <div class="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700"><table class="w-full min-w-[680px] text-left text-sm"><thead class="bg-slate-50 text-xs text-slate-500 dark:bg-slate-800"><tr><th class="px-3 py-2 font-medium">ชื่อรายการ</th><th class="px-3 py-2 font-medium">ลิงก์</th><th class="w-36 px-3 py-2 font-medium">ประเภท</th><th class="w-12 px-3 py-2"></th></tr></thead><tbody><tr v-for="(resource, index) in lessonResources" :key="index" class="border-t border-slate-100 dark:border-slate-700"><td class="px-3 py-2"><input v-model="resource.title" type="text" placeholder="เช่น Online C Compiler" class="w-full rounded-md border border-slate-200 bg-transparent px-2.5 py-2 text-sm outline-none focus:border-primary dark:border-slate-700" /></td><td class="px-3 py-2"><input v-model="resource.url" type="url" placeholder="https://..." class="w-full rounded-md border border-slate-200 bg-transparent px-2.5 py-2 text-sm outline-none focus:border-primary dark:border-slate-700" /></td><td class="px-3 py-2"><select v-model="resource.type" class="w-full rounded-md border border-slate-200 bg-transparent px-2 py-2 text-sm outline-none dark:border-slate-700"><option>เครื่องมือ</option><option>เอกสาร</option><option>เว็บไซต์</option><option>API</option><option>วิดีโอ</option></select></td><td class="px-3 py-2 text-right"><button type="button" class="text-slate-400 hover:text-rose-500" aria-label="ลบแหล่งเรียนรู้" @click="removeLessonResource(index)"><Icon icon="solar:trash-bin-minimalistic-linear" class="size-4" /></button></td></tr></tbody></table></div>
          </div>
          <div>
            <div class="mb-3 flex items-center justify-between"><div><label class="block text-xs font-medium text-slate-500">งานประจำบท</label><p class="mt-1 text-[11px] text-slate-400">งานที่ผู้เรียนต้องทำหลังเรียนบทนี้ สามารถเพิ่มได้มากกว่าหนึ่งงาน</p></div><button type="button" class="inline-flex items-center gap-1 text-xs font-semibold text-primary" @click="addLessonTask"><Icon icon="solar:add-circle-linear" class="size-4" /> เพิ่มงาน</button></div>
            <div class="space-y-3">
              <div v-for="(task, index) in lessonTasks" :key="index" class="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <div class="grid gap-3 md:grid-cols-[1fr_140px_40px]"><input v-model="task.title" type="text" placeholder="ชื่องาน เช่น แบบฝึกหัด Pointer เบื้องต้น" class="rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-slate-700" /><input v-model.number="task.points" type="number" min="0" placeholder="คะแนน" class="rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-slate-700" /><button type="button" class="justify-self-end text-slate-400 hover:text-rose-500" aria-label="ลบงาน" @click="removeLessonTask(index)"><Icon icon="solar:trash-bin-minimalistic-linear" class="size-5" /></button></div>
                <textarea v-model="task.description" rows="2" placeholder="คำอธิบายงานและสิ่งที่ผู้เรียนต้องส่ง" class="mt-3 w-full resize-y rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-slate-700"></textarea>
                <div class="mt-3 grid gap-3 sm:grid-cols-2"><input v-model="task.due" type="date" class="rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-slate-700" /><select v-model="task.submission" class="rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm outline-none dark:border-slate-700"><option>แนบไฟล์</option><option>เขียนคำตอบ</option><option>แนบไฟล์และเขียนคำตอบ</option><option>ไม่ต้องส่งงาน</option></select></div>
              </div>
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-500 mb-1.5">ไฟล์แนบ</label>
            <input ref="lessonFileInput" type="file" multiple accept="image/*,application/pdf,.zip,.rar,video/*,.c,.h,.cpp,.hpp,.js,.jsx,.ts,.tsx,.py,.java,.json,.sql,.html,.css,.md" class="hidden" @change="handleLessonFiles" />
            <button type="button" class="w-full border border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-8 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition" @click="lessonFileInput?.click()">
              <Icon icon="solar:upload-linear" class="size-6 mb-2" />
              <span class="text-xs">เลือกรูปภาพ, PDF, ไฟล์โค้ด, ZIP หรือวิดีโอ</span>
              <span class="mt-1 text-[11px] text-slate-400">ไฟล์โค้ดเป็นข้อมูลประกอบสำหรับอ่านหรือดาวน์โหลด ไม่ใช่ IDE แก้ไขโค้ด</span>
            </button>
            <div v-if="lessonFiles.length" class="mt-3 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
              <table class="w-full min-w-[520px] text-left text-xs"><thead class="bg-slate-50 text-slate-500 dark:bg-slate-800"><tr><th class="px-3 py-2 font-medium">ไฟล์</th><th class="px-3 py-2 font-medium">ประเภท</th><th class="px-3 py-2 font-medium">ขนาด</th><th class="px-3 py-2"></th></tr></thead><tbody><tr v-for="(file, index) in lessonFiles" :key="`${file.name}-${index}`" class="border-t border-slate-100 dark:border-slate-700"><td class="px-3 py-3"><div class="flex items-center gap-2"><Icon :icon="fileIcon(file)" class="size-5 text-slate-500" /><span class="max-w-[280px] truncate text-slate-700 dark:text-slate-200">{{ file.name }}</span></div></td><td class="px-3 py-3 text-slate-500">{{ file.type || 'ไฟล์ทั่วไป' }}</td><td class="px-3 py-3 text-slate-500">{{ (file.size / 1024 / 1024).toFixed(1) }} MB</td><td class="px-3 py-3 text-right"><button type="button" class="text-slate-400 hover:text-rose-500" aria-label="ลบไฟล์" @click="removeLessonFile(index)"><Icon icon="solar:trash-bin-minimalistic-linear" class="size-4" /></button></td></tr></tbody></table>
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <button @click="showAddLessonModal = false" class="px-5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800 transition">ยกเลิก</button>
          <button class="px-5 py-2 rounded-lg text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 transition" @click="saveLesson">{{ editingLessonId ? 'บันทึกการแก้ไข' : 'บันทึกบทเรียน' }}</button>
        </div>
      </div>
    </div>

    <!-- Modal: Add Assignment -->
    <div v-if="showAddAssignmentModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div class="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div><p class="text-xs font-medium text-pink-500">สร้างงานในคลาส</p><h3 class="mt-1 text-lg font-semibold text-slate-900 dark:text-white">ข้อมูลพื้นฐานและรายละเอียดงาน</h3></div>
          <button @click="showAddAssignmentModal = false" class="text-slate-400 hover:text-slate-900 dark:hover:text-white transition"><Icon icon="solar:close-circle-linear" class="size-6" /></button>
        </div>
        <div class="space-y-8 overflow-y-auto p-6 md:p-8">
          <div>
            <label class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">ชื่อข้อสอบแบบฝึกหัด / ใบงาน</label>
            <input v-model="assignmentForm.title" type="text" placeholder="เช่น ใบงานที่ 5: การฝึกเขียนโปรแกรมครั้งที่สอง" class="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-pink-500 dark:border-slate-700 dark:bg-slate-800/60" />
          </div>
          <div>
            <label class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">รายละเอียดคำสั่งและโจทย์การทดลอง</label>
            <textarea v-model="assignmentForm.description" rows="5" placeholder="อธิบายโจทย์ ขั้นตอนการทำงาน และสิ่งที่ผู้เรียนต้องส่ง..." class="w-full resize-y rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-pink-500 dark:border-slate-700 dark:bg-slate-800/60"></textarea>
          </div>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">วันกำหนดส่ง (Due Date)</label>
              <input v-model="assignmentForm.dueDate" type="date" class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-pink-500 dark:border-slate-700 dark:bg-slate-800/60" />
            </div>
            <div>
              <label class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">เวลาปิดรับส่ง (Due Time)</label>
              <input v-model="assignmentForm.dueTime" type="time" class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-pink-500 dark:border-slate-700 dark:bg-slate-800/60" />
            </div>
            <div><label class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">คะแนนเต็ม (Max Score)</label><input v-model.number="assignmentForm.maxScore" type="number" min="1" class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-pink-500 dark:border-slate-700 dark:bg-slate-800/60" /></div>
          </div>
          <section class="border-t border-slate-200 pt-7 dark:border-slate-800"><h4 class="mb-4 text-lg font-semibold text-slate-800 dark:text-white">รูปแบบการส่งงาน (Submission Method)</h4><div class="grid gap-4 md:grid-cols-3"><button v-for="method in [{ id: 'code', title: 'เขียนโค้ดในระบบ (IDE)', description: 'ตรวจโค้ดอัตโนมัติด้วยชุดทดสอบและคอมไพล์ในระบบ' }, { id: 'file', title: 'อัปโหลดไฟล์แนบ', description: 'อนุญาตให้นักศึกษาส่งไฟล์ เช่น .c, .pdf, .jpg' }, { id: 'hybrid', title: 'แบบผสมผสาน (Hybrid)', description: 'ทั้งส่งไฟล์และเขียนโปรแกรมคำตอบในที่เดียวกัน' }]" :key="method.id" type="button" :class="assignmentForm.submissionMode === method.id ? 'border-pink-500 bg-pink-50/60 dark:bg-pink-950/20' : 'border-slate-200 dark:border-slate-700'" class="rounded-xl border p-4 text-left transition hover:border-pink-300" @click="assignmentForm.submissionMode = method.id as 'code' | 'file' | 'hybrid'"><div class="flex items-start justify-between gap-3"><span class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ method.title }}</span><span :class="assignmentForm.submissionMode === method.id ? 'border-pink-500 bg-pink-500' : 'border-slate-200'" class="mt-0.5 size-3 shrink-0 rounded-full border-2"></span></div><p class="mt-2 text-xs leading-5 text-slate-500">{{ method.description }}</p></button></div></section>
          <section class="border-t border-slate-200 pt-7 dark:border-slate-800"><div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h4 class="text-lg font-semibold text-slate-800 dark:text-white">เกณฑ์การให้คะแนน (Rubrics Criteria)</h4><p class="mt-1 text-xs text-slate-500">กำหนดสัดส่วนคะแนนให้รวมกันครบ 100%</p></div><span :class="rubricTotal === 100 ? 'text-emerald-600' : 'text-rose-500'" class="text-sm font-semibold">รวม {{ rubricTotal }}%</span></div><div class="mt-4 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700"><div class="hidden grid-cols-[1fr_150px_44px] gap-3 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300 sm:grid"><span>หัวข้อเกณฑ์คะแนน</span><span>สัดส่วนคะแนน (%)</span><span></span></div><div v-for="(rubric, index) in assignmentRubrics" :key="index" class="grid grid-cols-1 gap-2 border-t border-slate-100 p-3 first:border-t-0 dark:border-slate-700 sm:grid-cols-[1fr_150px_44px] sm:items-center"><input v-model="rubric.title" type="text" placeholder="เช่น ความถูกต้องของการส่งข้อมูล" class="rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-pink-500 dark:border-slate-700" /><input v-model.number="rubric.percentage" type="number" min="0" max="100" class="rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-pink-500 dark:border-slate-700" /><button type="button" class="justify-self-end text-slate-400 hover:text-rose-500" aria-label="ลบเกณฑ์คะแนน" @click="removeAssignmentRubric(index)"><Icon icon="solar:trash-bin-minimalistic-linear" class="size-5" /></button></div></div><button type="button" class="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-pink-500 hover:text-pink-600" @click="addAssignmentRubric"><Icon icon="solar:add-circle-linear" class="size-5" /> เพิ่มเกณฑ์คะแนนใหม่</button></section>
        </div>
        <div class="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <button @click="showAddAssignmentModal = false" class="px-5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800 transition">ยกเลิก</button>
          <button class="px-5 py-2 rounded-lg text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 transition" @click="saveAssignment">มอบหมายงาน</button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.editor-tool { display: inline-flex; min-width: 30px; height: 30px; align-items: center; justify-content: center; border-radius: 0.375rem; color: rgb(71 85 105); transition: background-color 150ms, color 150ms; }
.editor-tool:hover { background: white; color: rgb(15 23 42); }
.editor-divider { height: 22px; width: 1px; background: rgb(203 213 225); margin: 0 3px; }
.editor-select { height: 30px; max-width: 130px; border: 1px solid rgb(203 213 225); border-radius: 0.375rem; background: transparent; padding: 0 8px; font-size: 12px; color: rgb(71 85 105); outline: none; }
.editor-select:focus { border-color: rgb(15 23 42); }
.lesson-inline-code { border-radius: 0.25rem; background: rgb(241 245 249); padding: 2px 5px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.9em; color: rgb(190 24 93); }
:global(.dark) .lesson-inline-code { background: rgb(30 41 59); color: rgb(249 168 212); }
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>