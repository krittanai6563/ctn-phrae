<script setup lang="ts">
import { onMounted, computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useBlogStore } from "@/stores/apps/blog";
import blogCardGrid from "./blogCardGrid.vue";
import Card from "@/components/ui/card/Card.vue";
import { Icon } from "@iconify/vue";
import Tooltip from "@/components/ui/tooltip/Tooltip.vue";

const props = defineProps<{ asPage?: boolean }>();
const router = useRouter();

const store = useBlogStore();
const showCreateModal = ref(false);
const coverImagePreview = ref("");
const classCode = ref("");
const showAccessCodePanel = ref(false);
const copiedCode = ref(false);
const copiedLink = ref(false);
const descriptionEditor = ref<HTMLElement | null>(null);
const customLevel = ref("");
const customSemester = ref("");
const levelOptions = ref(["ปวช.1", "ปวช.2", "ปวช.3", "ปวส.1", "ปวส.2", "ปวส.3"]);
const semesterOptions = ref(["ภาค 1", "ภาค 2", "ภาคพิเศษ"]);
const showLevelPrompt = ref(false);
const showSemesterPrompt = ref(false);
const isCodeAccess = computed(() => formData.value.accessType === 'code');

// Form data
const formData = ref({
  courseName: "",
  level: "ปวช.1",
  semester: "ภาค 1",
  academicYear: String(new Date().getFullYear() + 543),
  description: "",
  gradeScale: 100,
  accessType: "code", // "open" or "code"
  coverImage: null as File | null,
  gradingCriteria: [
    { name: "จิตพิสัย", percentage: 10 },
    { name: "สอบกลางภาค", percentage: 20 },
    { name: "สอบปลายภาค", percentage: 30 },
  ] as Array<{ name: string; percentage: number }>,
});

onMounted(() => {
  store.fetchPosts();
  showCreateModal.value = !!props.asPage;
});

const handleAccessTypeChange = (value: boolean) => {
  formData.value.accessType = value ? 'code' : 'open';
  showAccessCodePanel.value = value;

  if (value) {
    classCode.value = generateClassCode();
  } else {
    classCode.value = "";
  }
};

watch(() => formData.value.courseName, () => {
  if (formData.value.accessType === 'code' && classCode.value) {
    classCode.value = generateClassCode();
  }
});

const getPosts = computed(() => store.blogposts);

const syncDescriptionEditor = () => {
  if (!descriptionEditor.value) return;
  const nextValue = formData.value.description || "";
  if (descriptionEditor.value.innerHTML !== nextValue) {
    descriptionEditor.value.innerHTML = nextValue;
  }
};

const updateDescription = (event: Event) => {
  const target = event.target as HTMLElement;
  formData.value.description = target.innerHTML;
};

const applyTextFormat = (command: string, value?: string) => {
  const editor = descriptionEditor.value;
  if (!editor) return;

  editor.focus();
  document.execCommand(command, false, value ?? undefined);
  formData.value.description = editor.innerHTML;
};

const addCustomLevel = () => {
  const value = customLevel.value.trim();
  if (!value) return;

  const normalized = value.replace(/\s+/g, " ");
  if (!levelOptions.value.includes(normalized)) {
    levelOptions.value.push(normalized);
  }

  formData.value.level = normalized;
  customLevel.value = "";
  showLevelPrompt.value = false;
};

const addCustomSemester = () => {
  const value = customSemester.value.trim();
  if (!value) return;

  const normalized = value.replace(/\s+/g, " ");
  if (!semesterOptions.value.includes(normalized)) {
    semesterOptions.value.push(normalized);
  }

  formData.value.semester = normalized;
  customSemester.value = "";
  showSemesterPrompt.value = false;
};

const handleLevelSelect = (value: string) => {
  if (value === 'เพิ่ม...') {
    showLevelPrompt.value = true;
    customLevel.value = "";
    return;
  }
  formData.value.level = value;
  showLevelPrompt.value = false;
};

const handleSemesterSelect = (value: string) => {
  if (value === 'เพิ่ม...') {
    showSemesterPrompt.value = true;
    customSemester.value = "";
    return;
  }
  formData.value.semester = value;
  showSemesterPrompt.value = false;
};

const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    formData.value.coverImage = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      coverImagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const goToCreatePage = () => {
  router.push('/apps/blog/create-class');
};

const handleCreateClass = () => {
  if (!formData.value.courseName.trim()) {
    alert("กรุณากรอกชื่อคอร์ส");
    return;
  }
  
  const totalPercentage = formData.value.gradingCriteria.reduce((sum, g) => sum + g.percentage, 0);
  if (totalPercentage !== 100) {
    alert(`เกณฑ์การให้คะแนนรวมต้องเท่ากับ 100% (ปัจจุบัน: ${totalPercentage}%)`);
    return;
  }

  if (formData.value.accessType === 'code') {
    classCode.value = classCode.value || generateClassCode();
  }
  
  alert(`สร้างคลาส: ${formData.value.courseName}`);
  resetForm();
};

const resetForm = () => {
  formData.value = {
    courseName: "",
    level: "ปวช.1",
    semester: "ภาค 1",
    academicYear: String(new Date().getFullYear() + 543),
    description: "",
    gradeScale: 100,
    accessType: "code",
    coverImage: null,
    gradingCriteria: [
      { name: "จิตพิสัย", percentage: 10 },
      { name: "สอบกลางภาค", percentage: 20 },
      { name: "สอบปลายภาค", percentage: 30 },
    ],
  };
  coverImagePreview.value = "";
  classCode.value = "";
  showAccessCodePanel.value = false;
  showCreateModal.value = false;
};

const closeCreateModal = () => {
  resetForm();
  if (props.asPage) {
    router.push('/apps/blog/post');
  }
};

const addGradingCriteria = () => {
  formData.value.gradingCriteria.push({ name: "", percentage: 0 });
};

const removeGradingCriteria = (index: number) => {
  formData.value.gradingCriteria.splice(index, 1);
};

const getTotalPercentage = () => {
  return formData.value.gradingCriteria.reduce((sum, g) => sum + g.percentage, 0);
};

const generateClassCode = (): string => {
  const prefix = formData.value.courseName.substring(0, 3).toUpperCase().replace(/[^A-Z0-9]/g, "") || "CLS";
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}${random}`;
};

const classLink = computed(() => {
  return `${window.location.origin}?joinCode=${classCode.value}`;
});

const accessCodePreview = computed(() => {
  if (formData.value.accessType !== 'code') return null;
  return {
    courseName: formData.value.courseName.trim() || 'คลาสใหม่',
    code: classCode.value || generateClassCode(),
    link: `${window.location.origin}?joinCode=${classCode.value || generateClassCode()}`,
  };
});

const copyToClipboard = (text: string, type: 'code' | 'link') => {
  navigator.clipboard.writeText(text).then(() => {
    if (type === 'code') {
      copiedCode.value = true;
      setTimeout(() => { copiedCode.value = false; }, 2000);
    } else {
      copiedLink.value = true;
      setTimeout(() => { copiedLink.value = false; }, 2000);
    }
  });
};
</script>

<template>
  <div v-if="!props.asPage" class="grid grid-cols-12 gap-6">
    <div class="col-span-12 lg:col-span-3 md:col-span-4 sm:col-span-6">
      <Card class="p-0 rounded-2xl overflow-hidden h-full flex items-center justify-center cursor-pointer group border-2 border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 hover:border-primary hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
        @click="goToCreatePage">
        <div class="text-center py-12 px-6">
          <div class="bg-white dark:bg-slate-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
            <Icon icon="tabler:plus" class="size-8 text-primary"></Icon>
          </div>
          <h5 class="text-lg font-bold text-slate-800 dark:text-slate-100">สร้างคลาสใหม่</h5>
          <p class="text-sm text-slate-500 mt-1">เพิ่มรายวิชาหรือหลักสูตร</p>
        </div>
      </Card>
    </div>

    <template v-for="(post) in getPosts" :key="post.id">
      <blogCardGrid :post="post" />
    </template>
  </div>

  <div v-if="showCreateModal || props.asPage" :class="props.asPage ? 'block w-full py-4' : 'fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center z-50 p-4 overflow-hidden pt-6 sm:pt-10'"
    @click.self="closeCreateModal">
    <Card :class="props.asPage ? 'w-full max-w-5xl mx-auto border-0 shadow-none rounded-none bg-transparent overflow-visible' : 'w-full max-w-5xl h-fit max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl bg-white dark:bg-slate-900'">
      
      <div class="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        <div class="lg:col-span-7 xl:col-span-8 space-y-6">
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">ชื่อรายวิชา <span class="text-red-500">*</span></label>
              <input 
                v-model="formData.courseName"
                type="text" 
                placeholder="เช่น การเขียนโปรแกรมบนอินเทอร์เน็ต"
                class="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">ระดับชั้น</label>
                <select
                  :value="formData.level"
                  @change="handleLevelSelect(($event.target as HTMLSelectElement).value)"
                  class="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                >
                  <option v-for="level in [...levelOptions, 'เพิ่ม...']" :key="level" :value="level">{{ level }}</option>
                </select>
                <div v-if="showLevelPrompt" class="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-sm animate-in fade-in zoom-in-95">
                  <input v-model="customLevel" type="text" placeholder="ระบุระดับชั้น..." class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mb-2" />
                  <button type="button" @click="addCustomLevel" class="w-full py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition text-xs font-semibold">เพิ่มข้อมูล</button>
                </div>
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">ภาคเรียน</label>
                <select
                  :value="formData.semester"
                  @change="handleSemesterSelect(($event.target as HTMLSelectElement).value)"
                  class="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                >
                  <option v-for="semester in [...semesterOptions, 'เพิ่ม...']" :key="semester" :value="semester">{{ semester }}</option>
                </select>
                <div v-if="showSemesterPrompt" class="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-sm animate-in fade-in zoom-in-95">
                  <input v-model="customSemester" type="text" placeholder="ระบุภาคเรียน..." class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mb-2" />
                  <button type="button" @click="addCustomSemester" class="w-full py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition text-xs font-semibold">เพิ่มข้อมูล</button>
                </div>
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">ปีการศึกษา</label>
                <input v-model="formData.academicYear" type="text" placeholder="2568" class="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm" />
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">คำอธิบายรายวิชา (Syllabus)</label>
            <div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
              <div class="flex flex-wrap items-center gap-1 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-3 py-2">
                <button type="button" @click="applyTextFormat('bold')" class="rounded-lg p-1 text-slate-500 hover:bg-slate-200 transition" title="หนา"><Icon icon="tabler:bold" class="size-4" /></button>
                <button type="button" @click="applyTextFormat('italic')" class="rounded-lg p-1 text-slate-500 hover:bg-slate-200 transition" title="เอียง"><Icon icon="tabler:italic" class="size-4" /></button>
                <button type="button" @click="applyTextFormat('underline')" class="rounded-lg p-1 text-slate-500 hover:bg-slate-200 transition" title="ขีดเส้นใต้"><Icon icon="tabler:underline" class="size-4" /></button>
                <div class="w-px h-4 bg-slate-300 mx-1"></div>
                <button type="button" @click="applyTextFormat('insertUnorderedList')" class="rounded-lg p-1 text-slate-500 hover:bg-slate-200 transition"><Icon icon="tabler:list" class="size-4" /></button>
                <button type="button" @click="applyTextFormat('insertOrderedList')" class="rounded-lg p-1 text-slate-500 hover:bg-slate-200 transition"><Icon icon="tabler:list-numbers" class="size-4" /></button>
              </div>
              <div
                ref="descriptionEditor"
                contenteditable="true"
                class="min-h-[80px] w-full px-4 py-3 text-sm text-slate-700 dark:text-slate-200 outline-none"
                :data-placeholder="'รายละเอียดการสอน หรือจุดประสงค์รายวิชา...'"
                @input="updateDescription"
                @blur="syncDescriptionEditor"
                @focus="syncDescriptionEditor"
              ></div>
            </div>
          </div>

          <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20">
            <div class="flex items-center justify-between mb-3">
              <div>
                <h4 class="text-sm font-semibold text-slate-800 dark:text-slate-100">สัดส่วนการให้คะแนน</h4>
              </div>
              <span class="text-xs font-bold px-3 py-1 rounded-full shadow-sm" :class="getTotalPercentage() === 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'">
                รวม {{ getTotalPercentage() }}%
              </span>
            </div>

            <div class="space-y-2">
              <div v-for="(criteria, index) in formData.gradingCriteria" :key="index" class="flex items-center gap-2 bg-white dark:bg-slate-800 p-1.5 pl-2 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:border-slate-300">
                <Icon icon="tabler:grip-vertical" class="size-4 text-slate-300 cursor-grab"></Icon>
                <input 
                  v-model="criteria.name"
                  type="text" 
                  placeholder="ชื่อรายการประเมิน"
                  class="flex-1 bg-transparent text-sm text-slate-800 dark:text-slate-100 outline-none placeholder-slate-400 px-1"
                />
                <div class="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                  <input 
                    v-model.number="criteria.percentage"
                    type="number" 
                    min="0" max="100"
                    class="w-10 text-center text-sm font-semibold bg-transparent outline-none text-primary"
                  />
                  <span class="text-xs text-slate-500">%</span>
                </div>
                <button 
                  @click="removeGradingCriteria(index)"
                  v-if="formData.gradingCriteria.length > 1"
                  type="button"
                  class="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-colors"
                >
                  <Icon icon="tabler:trash" class="size-4"></Icon>
                </button>
              </div>
            </div>
            
            <div class="mt-3 flex justify-start">
              <button 
                @click="addGradingCriteria"
                type="button"
                class="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg"
              >
                <Icon icon="tabler:plus" class="size-4"></Icon> เพิ่มเกณฑ์ประเมิน
              </button>
            </div>
          </div>
          
        </div>

        <div class="lg:col-span-5 xl:col-span-4 space-y-6">
          
          <div>
            <label class="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">ภาพปกรายวิชา</label>
            <div class="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer overflow-hidden group" 
              @click="$refs.imageInput?.click()">
              <div v-if="!coverImagePreview" class="py-6 px-4">
                <div class="bg-white dark:bg-slate-700 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2 shadow-sm group-hover:scale-110 transition-transform">
                  <Icon icon="tabler:photo-up" class="size-5 text-primary"></Icon>
                </div>
                <p class="text-xs font-medium text-slate-700 dark:text-slate-200">คลิกเพื่ออัปโหลดภาพ</p>
              </div>
              <div v-else class="relative w-full aspect-video group">
                <img :src="coverImagePreview" alt="preview" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button @click.stop="() => { formData.coverImage = null; coverImagePreview = ''; }" 
                    class="bg-white/20 hover:bg-red-500 backdrop-blur-sm text-white rounded-full p-2 transition-colors shadow-lg">
                    <Icon icon="tabler:trash" class="size-4"></Icon>
                  </button>
                </div>
              </div>
            </div>
            <input ref="imageInput" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
          </div>

          <div>
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                สิทธิ์การเข้าถึง
              </h4>
              <div class="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <button type="button" @click="handleAccessTypeChange(false)" 
                  class="px-3 py-1 text-[11px] font-semibold rounded-md transition-all duration-200"
                  :class="formData.accessType === 'open' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'">
                  สาธารณะ
                </button>
                <button type="button" @click="handleAccessTypeChange(true)" 
                  class="px-3 py-1 text-[11px] font-semibold rounded-md transition-all duration-200"
                  :class="formData.accessType === 'code' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'">
                  แบบปิด
                </button>
              </div>
            </div>

            <div class="transition-all duration-300">
              <div v-if="formData.accessType === 'open'" class="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/30 dark:bg-emerald-900/10 flex gap-3">
                <Icon icon="tabler:world" class="size-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p class="text-xs font-bold text-emerald-800 dark:text-emerald-400 mb-1">Public Class</p>
                  <p class="text-[11px] text-emerald-700/80 dark:text-emerald-300/80 leading-relaxed">
                    บุคคลทั่วไปสามารถค้นพบและคลิกเข้าสู่บทเรียนเพื่อเริ่มเรียนได้ทันที 
                  </p>
                </div>
              </div>

              <div v-else class="rounded-xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-900/30 dark:bg-indigo-900/10">
                <div class="flex gap-3 mb-3">
                  <Icon icon="tabler:lock-check" class="size-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <p class="text-xs font-bold text-indigo-800 dark:text-indigo-400 mb-1">Private Class</p>
                    <p class="text-[11px] text-indigo-700/80 dark:text-indigo-300/80 leading-relaxed">
                      สงวนสิทธิ์เฉพาะผู้ที่มีรหัสหรือลิงก์เชิญเท่านั้น
                    </p>
                  </div>
                </div>
                
                <div class="grid grid-cols-2 gap-2 mt-3 border-t border-indigo-100 dark:border-indigo-800/50 pt-3">
                  <div>
                    <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">รหัส (Code)</p>
                    <div class="bg-white dark:bg-slate-800 px-2 py-1.5 rounded border border-indigo-100 flex flex-col items-start justify-between h-[50px]">
                      <span class="font-mono text-sm font-bold tracking-widest text-slate-800 truncate w-full">{{ classCode || accessCodePreview?.code }}</span>
                      <button @click="copyToClipboard(classCode || accessCodePreview?.code || '', 'code')" class="text-[10px] font-semibold text-primary hover:text-indigo-700 flex items-center gap-1 w-full mt-1">
                        <Icon :icon="copiedCode ? 'tabler:check' : 'tabler:copy'" class="size-3" /> {{ copiedCode ? 'คัดลอกแล้ว' : 'คัดลอก' }}
                      </button>
                    </div>
                  </div>
                  <div>
                    <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">ลิงก์เชิญ (Link)</p>
                    <div class="bg-white dark:bg-slate-800 px-2 py-1.5 rounded border border-indigo-100 flex flex-col items-start justify-between h-[50px]">
                      <span class="font-mono text-[10px] text-slate-500 truncate w-full" :title="classLink">{{ classLink }}</span>
                      <button @click="copyToClipboard(classLink, 'link')" class="text-[10px] font-semibold text-primary hover:text-indigo-700 flex items-center gap-1 w-full mt-1">
                        <Icon :icon="copiedLink ? 'tabler:check' : 'tabler:link'" class="size-3" /> {{ copiedLink ? 'คัดลอกแล้ว' : 'คัดลอก' }}
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          
        </div>
      </div>

      <div class="sticky bottom-0 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 rounded-b-2xl">
        <button @click="closeCreateModal" class="px-5 py-2 rounded-xl font-semibold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition-colors">
          ยกเลิก
        </button>
        <button @click="handleCreateClass" class="px-6 py-2 rounded-xl font-semibold text-sm text-white bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all flex items-center gap-2">
          <Icon icon="tabler:device-floppy" class="size-4" /> สร้างรายวิชา
        </button>
      </div>

    </Card>
  </div>
</template>

<style scoped>
/* ทำให้ Editor ดูเป็นธรรมชาติเหมือน Textarea */
[contenteditable=true]:empty:before {
  content: attr(data-placeholder);
  color: #94a3b8;
  pointer-events: none;
  display: block; /* For Firefox */
}
</style>