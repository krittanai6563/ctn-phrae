<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { assignmentChapters, studentSubmissions } from '@/views/apps/assignments/assignmentData';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import blogCardGrid from '@/components/apps/blog/blogCardGrid.vue';
import courseCover from '@/assets/images/blog/blog-img1.jpg';
import publicClassCover from '@/assets/images/blog/blog-img2.jpg';
import { useAuthStore } from '@/stores/auth';
import { useSubmissionStore } from '@/stores/submissions';

const router = useRouter();
const auth = useAuthStore();
const submissionStore = useSubmissionStore();
const assignments = computed(() => assignmentChapters.flatMap((chapter) => chapter.assignments.map((assignment) => ({ ...assignment, chapterId: chapter.id, chapterTitle: chapter.title }))));
const allSubmissions = computed(() => Object.values(studentSubmissions).flat());
const submittedCount = computed(() => assignments.value.filter((assignment) => assignment.status === 'ส่งแล้ว').length);
const pendingReviewCount = computed(() => allSubmissions.value.filter((student) => student.status === 'ส่งแล้ว').length);
const notSubmittedCount = computed(() => assignments.value.filter((assignment) => assignment.status === 'ยังไม่ส่ง').length);
const progressPercent = computed(() => Math.round((submittedCount.value / Math.max(assignments.value.length, 1)) * 100));
const totalStudents = computed(() => allSubmissions.value.length ? Math.max(...Object.values(studentSubmissions).map((students) => students.length)) : 0);
const submittedStudents = computed(() => allSubmissions.value.filter((student) => student.status === 'ส่งแล้ว').length);
const studentSubmissionRate = computed(() => Math.round((submittedStudents.value / Math.max(totalStudents.value, 1)) * 100));
const studentsToFollowUp = computed(() => allSubmissions.value.filter((student) => student.status !== 'ส่งแล้ว').length);
const upcomingAssignments = computed(() => assignments.value.filter((assignment) => assignment.status !== 'ส่งแล้ว').slice(0, 3));
const submissionStatus = computed(() => [
  { label: 'ส่งแล้ว', count: allSubmissions.value.filter((student) => student.status === 'ส่งแล้ว').length, color: 'bg-emerald-500', text: 'text-emerald-600' },
  { label: 'ยังไม่ส่ง', count: allSubmissions.value.filter((student) => student.status === 'ยังไม่ส่ง').length, color: 'bg-amber-500', text: 'text-amber-600' },
  { label: 'รอดำเนินการ', count: allSubmissions.value.filter((student) => student.status === 'รอดำเนินการ').length, color: 'bg-slate-400', text: 'text-slate-500' },
]);
const submissionTotal = computed(() => submissionStatus.value.reduce((total, status) => total + status.count, 0));
const submittedStatusPercent = computed(() => Math.round((submissionStatus.value[0].count / Math.max(submissionTotal.value, 1)) * 100));
const pendingStatusPercent = computed(() => Math.round((submissionStatus.value[1].count / Math.max(submissionTotal.value, 1)) * 100));
const maxChapterRate = computed(() => Math.max(...chapterProgress.value.map((chapter) => chapter.percent), 1));
const chapterSubmissionRates = computed(() => assignmentChapters.map((chapter) => {
  const chapterStudents = chapter.assignments.flatMap((assignment) => studentSubmissions[assignment.id] || []);
  const submitted = chapterStudents.filter((student) => student.status === 'ส่งแล้ว').length;
  return { ...chapter, submitted, total: chapterStudents.length, percent: Math.round((submitted / Math.max(chapterStudents.length, 1)) * 100) };
}));
const classes = [
  { id: 'c-year-1', slug: 'garmins-instinct-crossover-is-a-rugged-hybrid-smartwatch', title: 'ภาษา C พื้นฐาน สำหรับ ปวช.1', code: 'C-ปวช.1-2569', level: 'ปวช.1', semester: 'ภาค 1', students: totalStudents.value, progress: 68, color: 'bg-sky-500', icon: 'solar:programming-linear' },
  { id: 'c-year-2', slug: 'c-programming-practical-year-2', title: 'การเขียนโปรแกรมภาษา C สำหรับ ปวช.2', code: 'C-ปวช.2-2569', level: 'ปวช.2', semester: 'ภาค 1', students: 30, progress: 74, color: 'bg-emerald-500', icon: 'solar:programming-linear' },
  { id: 'c-year-3', slug: 'c-data-structures-year-3', title: 'โครงสร้างข้อมูลด้วยภาษา C สำหรับ ปวช.3', code: 'C-ปวช.3-2569', level: 'ปวช.3', semester: 'ภาค 1', students: 28, progress: 56, color: 'bg-amber-500', icon: 'solar:programming-linear' },
  { id: 'c-advanced', slug: 'advanced-c-programming-povs-1', title: 'การพัฒนาโปรแกรมภาษา C ขั้นสูง', code: 'C-ปวส.1-2569', level: 'ปวส.1', semester: 'ภาค 1', students: 24, progress: 42, color: 'bg-rose-500', icon: 'solar:programming-linear' },
];
const recentAssignments = computed(() => assignments.value.slice(0, 4));
const classCards = computed(() => classes.map((course) => ({
  id: course.id,
  slug: course.id,
  route: `/apps/blog/${course.slug}`,
  title: course.title,
  content: `${course.code} · ${course.level} · ${course.semester}`,
  coverImg: courseCover,
  category: course.level,
  view: assignments.value.length,
  share: course.students,
  author: { id: course.id, avatar: courseCover, name: course.level },
})));
const publicClasses = [
  { id: 'public-c-1', slug: 'garmins-instinct-crossover-is-a-rugged-hybrid-smartwatch', title: 'ภาษา C พื้นฐาน สำหรับ ปวช.1', content: 'เปิดให้ผู้เรียนทั่วไปเข้าศึกษาพื้นฐานภาษา C และเริ่มต้นเขียนโปรแกรมอย่างเป็นขั้นตอน', coverImg: courseCover, category: 'เปิดสาธารณะ', view: 12, share: 30, author: { id: 'teacher-c1', avatar: courseCover, name: 'อาจารย์ สมชาย ใจดี' } },
  { id: 'public-c-2', slug: 'c-programming-practical-year-2', title: 'การเขียนโปรแกรมภาษา C สำหรับ ปวช.2', content: 'ฝึกใช้เงื่อนไข ฟังก์ชัน และการทำซ้ำ ผ่านโจทย์ที่นำไปใช้ได้จริง', coverImg: publicClassCover, category: 'เปิดสาธารณะ', view: 9, share: 24, author: { id: 'teacher-c2', avatar: publicClassCover, name: 'อาจารย์สุภาวดี แสงทอง' } },
];
const overdueAssignments = computed(() => assignments.value.flatMap((assignment) => {
  if (auth.isTeacher) return assignment.status === 'ส่งแล้ว' ? [] : [assignment];
  if (!auth.user.assignedAssignmentIds.includes(assignment.id)) return [];
  const submission = (submissionStore.submissions[assignment.id] || []).find((item) => item.id === auth.user.id);
  const status = submission?.status || 'ยังไม่ส่ง';
  return status === 'ส่งแล้ว' ? [] : [{ ...assignment, status }];
}).slice(0, 4));
const chapterProgress = computed(() => assignmentChapters.map((chapter) => {
  const completed = chapter.assignments.filter((assignment) => assignment.status === 'ส่งแล้ว').length;
  return { ...chapter, percent: Math.round((completed / chapter.assignments.length) * 100) };
}));

const openAssignments = () => router.push('/apps/assignments');
const openChapter = (chapterId: string) => router.push(`/apps/assignments/chapter/${chapterId}`);
</script>

<template>
  <BaseBreadcrumb title="ภาพรวมชั้นเรียน" :breadcrumbs="[{ text: 'แดชบอร์ด', href: '#' }, { text: 'ภาพรวมชั้นเรียน', href: '#' }]" />

  <div class="flex w-full flex-col gap-6 pb-8">
    <template v-if="false">
    <section class="rounded-lg border border-ld bg-card p-6 md:p-8"><div class="flex flex-wrap items-start justify-between gap-4"><div><p class="text-sm font-medium text-primary">Google Analytics 4</p><h2 class="mt-1 text-lg font-semibold text-slate-900 dark:text-white">สถิติผู้เข้าชมเว็บไซต์</h2><p class="mt-1 text-sm text-slate-500">ข้อมูลล่าสุดจาก n8n webhook</p></div><button class="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline" :disabled="ga4Loading" @click="loadGa4Data"><Icon icon="solar:refresh-linear" class="size-4" :class="ga4Loading ? 'animate-spin' : ''" />{{ ga4Loading ? 'กำลังโหลด...' : 'รีเฟรชข้อมูล' }}</button></div><div v-if="ga4Loading && !ga4Rows.length" class="mt-6 text-sm text-slate-500">กำลังโหลดข้อมูล GA4...</div><div v-else-if="ga4Error" class="mt-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">ไม่สามารถโหลดข้อมูล GA4 ได้: {{ ga4Error }}</div><template v-else><div class="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4"><div class="rounded-lg border border-ld p-4"><p class="text-xs text-slate-500">ผู้ใช้งาน</p><p class="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{{ ga4Summary.users.toLocaleString() }}</p></div><div class="rounded-lg border border-ld p-4"><p class="text-xs text-slate-500">Sessions</p><p class="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{{ ga4Summary.sessions.toLocaleString() }}</p></div><div class="rounded-lg border border-ld p-4"><p class="text-xs text-slate-500">Page views</p><p class="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{{ ga4Summary.pageViews.toLocaleString() }}</p></div><div class="rounded-lg border border-ld p-4"><p class="text-xs text-slate-500">เวลาใช้งานรวม</p><p class="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{{ ga4Summary.engagement.toLocaleString() }}<span class="ml-1 text-xs font-normal text-slate-500">วินาที</span></p></div></div><div class="mt-6"><div class="mb-3 flex items-center justify-between"><h3 class="text-sm font-semibold text-slate-900 dark:text-white">หน้าที่มีผู้เข้าชมสูงสุด</h3><span class="text-xs text-slate-500">{{ ga4Rows.length }} รายการ</span></div><div v-if="ga4TopPages.length" class="space-y-2"><div v-for="page in ga4TopPages" :key="page.page" class="flex items-center justify-between gap-4 rounded-lg bg-slate-50 px-3 py-2.5 dark:bg-slate-800/60"><span class="min-w-0 truncate text-sm text-slate-600 dark:text-slate-300" :title="page.page">{{ page.page }}</span><span class="shrink-0 text-sm font-semibold text-primary">{{ page.views.toLocaleString() }}</span></div></div><p v-else class="text-sm text-slate-500">ยังไม่มีข้อมูลหน้าเว็บ</p></div></template></section>

    </template>
    <section class="space-y-5"><div class="flex items-center justify-between gap-4"><div><p class="text-sm font-medium text-primary">สำหรับผู้เรียนทั่วไป</p><h2 class="mt-1 text-lg font-semibold text-slate-900 dark:text-white">Public Classes</h2><p class="mt-1 text-sm text-slate-500">คลาสสาธารณะที่ผู้ใช้ทั่วไปสามารถเปิดดูและเข้าร่วมได้</p></div><button class="text-sm font-medium text-primary hover:underline" @click="router.push('/apps/blog/all')">ดูเพิ่มเติม</button></div><div class="grid grid-cols-12 gap-6"><blogCardGrid v-for="course in publicClasses" :key="course.id" :post="course" /></div></section>

    <section v-if="overdueAssignments.length" class="overflow-hidden rounded-lg border border-amber-200 bg-amber-50/50 p-6 dark:border-amber-900/40 dark:bg-amber-950/10"><div class="flex items-center justify-between gap-4"><div><h2 class="flex items-center gap-2 text-lg font-semibold text-amber-800 dark:text-amber-300"><Icon icon="solar:alarm-linear" class="size-5" />งานที่ต้องติดตาม</h2><p class="mt-1 text-sm text-amber-700/80 dark:text-amber-400/80">งานที่ยังไม่ส่งหรือยังรอดำเนินการ</p></div><button class="text-sm font-medium text-amber-700 hover:underline dark:text-amber-300" @click="openAssignments">ดูงานทั้งหมด</button></div><div class="mt-5 overflow-x-auto rounded-lg border border-amber-200 dark:border-amber-900/40"><table class="w-full min-w-[680px] text-left text-sm"><thead class="bg-amber-100/60 text-xs text-amber-800 dark:bg-amber-950/30 dark:text-amber-300"><tr><th class="px-4 py-3 font-semibold">งาน</th><th class="px-4 py-3 font-semibold">บทเรียน</th><th class="px-4 py-3 font-semibold">กำหนดส่ง</th><th class="px-4 py-3 font-semibold">สถานะ</th><th class="px-4 py-3 text-right font-semibold">การดำเนินการ</th></tr></thead><tbody><tr v-for="assignment in overdueAssignments" :key="assignment.id" class="border-t border-amber-200/70 bg-white/70 dark:border-amber-900/40 dark:bg-slate-900/50"><td class="px-4 py-4"><div class="flex items-center gap-3"><span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"><Icon icon="solar:clipboard-remove-linear" class="size-5" /></span><span class="font-medium text-slate-800 dark:text-slate-100">{{ assignment.title }}</span></div></td><td class="px-4 py-4 text-xs text-slate-500">{{ assignment.chapterTitle }}</td><td class="px-4 py-4 text-xs text-slate-500">{{ assignment.due }}</td><td class="px-4 py-4"><span class="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">{{ assignment.status }}</span></td><td class="px-4 py-4 text-right"><button class="text-xs font-medium text-amber-700 hover:underline dark:text-amber-300" @click="openAssignments">ดูงาน</button></td></tr></tbody></table></div></section>
    <div v-if="false" class="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
      <section class="rounded-lg border border-ld bg-card p-6 md:p-8">
        <div class="flex items-start justify-between gap-4"><div><h2 class="text-lg font-semibold text-slate-900 dark:text-white">อัตราการส่งงานรายบท</h2><p class="mt-1 text-sm text-slate-500">ดูบทที่นักเรียนส่งงานครบหรือควรติดตามเพิ่มเติม</p></div><Icon icon="solar:chart-2-linear" class="size-6 text-primary" /></div>
        <div class="mt-7 space-y-5">
          <button v-for="chapter in chapterSubmissionRates" :key="chapter.id" class="w-full text-left" @click="openChapter(chapter.id)">
            <div class="flex items-center justify-between gap-4 text-sm"><span class="truncate font-medium text-slate-700 dark:text-slate-200">{{ chapter.title }}</span><span class="shrink-0 font-semibold text-primary">{{ chapter.percent }}%</span></div>
            <div class="mt-2 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div class="h-full rounded-full bg-primary transition-all" :style="{ width: `${(chapter.percent / maxChapterRate) * 100}%` }" /></div>
            <p class="mt-1 text-xs text-slate-500">ส่งแล้ว {{ chapter.submitted }} จาก {{ chapter.total }} รายการ</p>
          </button>
        </div>
      </section>

      <section class="rounded-lg border border-ld bg-card p-6 md:p-8">
        <div class="flex items-start justify-between gap-4"><div><h2 class="text-lg font-semibold text-slate-900 dark:text-white">สถานะการส่งงาน</h2><p class="mt-1 text-sm text-slate-500">ภาพรวมทุกใบงาน</p></div><Icon icon="solar:pie-chart-2-linear" class="size-6 text-primary" /></div>
        <div class="mt-7 flex items-center justify-center"><div class="relative flex size-36 items-center justify-center rounded-full" :style="{ background: `conic-gradient(#10b981 ${submittedStatusPercent}%, #f59e0b ${submittedStatusPercent}% ${submittedStatusPercent + pendingStatusPercent}%, #94a3b8 ${submittedStatusPercent + pendingStatusPercent}% 100%)` }"><div class="flex size-24 flex-col items-center justify-center rounded-full bg-white dark:bg-slate-900"><span class="text-2xl font-semibold text-slate-900 dark:text-white">{{ submittedStatusPercent }}%</span><span class="text-[10px] text-slate-500">ส่งแล้ว</span></div></div></div>
        <div class="mt-6 space-y-3"><div v-for="status in submissionStatus" :key="status.label" class="flex items-center justify-between text-sm"><span class="flex items-center gap-2 text-slate-600 dark:text-slate-300"><span :class="status.color" class="size-2.5 rounded-full" />{{ status.label }}</span><span :class="status.text" class="font-semibold">{{ status.count }}</span></div></div>
      </section>
    </div>

    <div v-if="false" class="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
      <section class="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 md:p-8">
        <div class="flex items-center justify-between gap-4"><div><h2 class="text-lg font-semibold text-slate-900 dark:text-white">งานล่าสุด</h2><p class="mt-1 text-sm text-slate-500">เลือกงานเพื่อดูสถานะนักเรียนในบทนั้น</p></div><button class="text-sm font-medium text-primary hover:underline" @click="openAssignments">ดูทั้งหมด</button></div>
        <div class="mt-6 space-y-3"><button v-for="assignment in recentAssignments" :key="assignment.id" class="group flex w-full items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-primary/40 hover:bg-primary/[0.03] dark:border-slate-700 dark:hover:bg-primary/10" @click="openChapter(assignment.chapterId)"><span class="flex min-w-0 items-center gap-3"><span class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800"><Icon icon="solar:document-text-linear" class="size-5" /></span><span class="min-w-0"><span class="block truncate text-sm font-medium text-slate-800 dark:text-slate-100">{{ assignment.title }}</span><span class="mt-1 block truncate text-xs text-slate-500">{{ assignment.chapterTitle }} · {{ assignment.points }} คะแนน</span></span></span><span :class="assignment.status === 'ส่งแล้ว' ? 'text-emerald-600' : assignment.status === 'ยังไม่ส่ง' ? 'text-amber-600' : 'text-slate-500'" class="shrink-0 text-xs font-medium">{{ assignment.status }}</span></button></div>
      </section>

      <section class="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 md:p-8"><div class="flex items-center justify-between"><div><h2 class="text-lg font-semibold text-slate-900 dark:text-white">ความคืบหน้ารายบท</h2><p class="mt-1 text-sm text-slate-500">งานที่ส่งแล้วของแต่ละบท</p></div><span class="text-2xl font-semibold text-primary">{{ progressPercent }}%</span></div><div class="mt-6 space-y-5"><button v-for="chapter in chapterProgress" :key="chapter.id" class="w-full text-left" @click="openChapter(chapter.id)"><div class="flex items-center justify-between gap-3 text-xs"><span class="truncate font-medium text-slate-700 dark:text-slate-200">{{ chapter.title }}</span><span class="shrink-0 text-slate-500">{{ chapter.percent }}%</span></div><div class="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div class="h-full rounded-full bg-primary transition-all" :style="{ width: `${chapter.percent}%` }" /></div></button></div></section>
      <section class="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 md:p-8"><div class="flex items-center justify-between"><div><h2 class="text-lg font-semibold text-slate-900 dark:text-white">งานที่ต้องดำเนินการ</h2><p class="mt-1 text-sm text-slate-500">งานที่ยังมีรายการค้างอยู่</p></div><Icon icon="solar:alarm-linear" class="size-6 text-amber-500" /></div><div class="mt-6 space-y-3"><button v-for="assignment in upcomingAssignments" :key="assignment.id" class="flex w-full items-center gap-3 rounded-xl bg-slate-50 p-3 text-left transition hover:bg-primary/[0.05] dark:bg-slate-800/60 dark:hover:bg-primary/10" @click="openChapter(assignment.chapterId)"><span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950/40"><Icon icon="solar:clipboard-remove-linear" class="size-5" /></span><span class="min-w-0"><span class="block truncate text-sm font-medium text-slate-800 dark:text-slate-100">{{ assignment.title }}</span><span class="mt-1 block text-xs text-slate-500">กำหนดส่ง {{ assignment.due }}</span></span></button></div></section>
    </div>
  </div>
</template>

<style scoped>
section[class*="bg-amber-50/50"] {
  border-color: var(--color-border) !important;
  background-color: var(--color-card) !important;
}

section[class*="bg-amber-50/50"] h2 {
  color: var(--color-dark) !important;
}

section[class*="bg-amber-50/50"] h2 + p {
  color: var(--color-bodytext) !important;
}

section[class*="bg-amber-50/50"] > div:nth-child(2) {
  border-color: var(--color-border) !important;
}

section[class*="bg-amber-50/50"] thead {
  background-color: var(--color-lightgray) !important;
  color: var(--color-bodytext) !important;
  display: none;
}

section[class*="bg-amber-50/50"] table {
  min-width: 0 !important;
  border-collapse: separate;
  border-spacing: 0;
}

section[class*="bg-amber-50/50"] tbody {
  display: grid;
  gap: 0.75rem;
}

section[class*="bg-amber-50/50"] tbody tr {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.45rem 1rem;
  padding: 1rem;
  border-color: var(--color-border) !important;
  background-color: var(--color-card) !important;
  border-width: 1px !important;
  border-radius: 0.75rem;
}

section[class*="bg-amber-50/50"] tbody td {
  padding: 0 !important;
}

section[class*="bg-amber-50/50"] tbody td:first-child {
  grid-column: 1 / -1;
  padding-bottom: 0.35rem !important;
}

section[class*="bg-amber-50/50"] tbody td:nth-child(2)::before {
  content: "บทเรียน: ";
  color: var(--color-muted);
}

section[class*="bg-amber-50/50"] tbody td:nth-child(3)::before {
  content: "กำหนดส่ง: ";
  color: var(--color-muted);
}

section[class*="bg-amber-50/50"] tbody td:nth-child(4) {
  grid-column: 2;
  grid-row: 2;
  justify-self: end;
}

section[class*="bg-amber-50/50"] tbody td:nth-child(5) {
  grid-column: 2;
  grid-row: 3;
  justify-self: end;
}

section[class*="bg-amber-50/50"] > div:first-child button,
section[class*="bg-amber-50/50"] td button {
  color: var(--color-primary) !important;
}

.dark section[class*="bg-amber-50/50"] h2 {
  color: var(--color-white) !important;
}
</style>
