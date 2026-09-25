<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { assignmentChapters } from './assignmentData';

const router = useRouter();
const openChapters = ref<string[]>(assignmentChapters.map((chapter) => chapter.id));
const activeTab = ref<'all' | 'not-submitted' | 'submitted' | 'pending'>('all');

const tabs = [
  { id: 'all', label: 'ทั้งหมด', icon: 'solar:layers-linear' },
  { id: 'not-submitted', label: 'ยังไม่ได้ส่ง', icon: 'solar:clock-circle-linear' },
  { id: 'submitted', label: 'ส่งแล้ว', icon: 'solar:check-circle-linear' },
  { id: 'pending', label: 'รอดำเนินการ', icon: 'solar:pause-circle-linear' },
] as const;

const totalAssignments = computed(() => assignmentChapters.reduce((total, chapter) => total + chapter.assignments.length, 0));
const submittedAssignments = computed(() => assignmentChapters.reduce(
  (total, chapter) => total + chapter.assignments.filter((assignment) => assignment.status === 'ส่งแล้ว').length,
  0
));

const getTabCount = (tabId: typeof activeTab.value) => assignmentChapters.reduce((total, chapter) => total + chapter.assignments.filter((assignment) => {
  if (tabId === 'all') return true;
  if (tabId === 'not-submitted') return assignment.status === 'ยังไม่ส่ง';
  if (tabId === 'submitted') return assignment.status === 'ส่งแล้ว';
  return assignment.status === 'รอทำ';
}).length, 0);

const filteredChapters = computed(() => assignmentChapters
  .map((chapter) => ({
    ...chapter,
    assignments: chapter.assignments.filter((assignment) => {
      if (activeTab.value === 'all') return true;
      if (activeTab.value === 'not-submitted') return assignment.status === 'ยังไม่ส่ง';
      if (activeTab.value === 'submitted') return assignment.status === 'ส่งแล้ว';
      return assignment.status === 'รอทำ';
    }),
  }))
  .filter((chapter) => chapter.assignments.length > 0));

const isChapterOpen = (chapterId: string) => openChapters.value.includes(chapterId);
const toggleChapter = (chapterId: string) => {
  openChapters.value = isChapterOpen(chapterId)
    ? openChapters.value.filter((id) => id !== chapterId)
    : [...openChapters.value, chapterId];
};
const openAssignment = (chapterId: string) => router.push(`/apps/assignments/chapter/${chapterId}`);
const createAssignment = () => router.push('/apps/assignments/create');
</script>

<template>
  <BaseBreadcrumb
    title="งานที่ได้รับมอบหมาย"
    :breadcrumbs="[{ text: 'งานที่ได้รับมอบหมาย', href: '#' }]"
  />

  <div class="mx-auto flex max-w-6xl flex-col gap-6 pb-10">
    <section class="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 md:p-8">
      <div class="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p class="mb-2 text-sm font-medium text-primary">รายวิชา ภาษา C</p>
          <h1 class="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-3xl">งานที่ได้รับมอบหมาย</h1>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">เลือกบทเรียนเพื่อดูงานในบทนั้น แล้วคลิกชื่องานเพื่อดูโจทย์และรายละเอียดการส่งงาน</p>
        </div>
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white transition hover:opacity-90" @click="createAssignment"><Icon icon="solar:add-circle-linear" class="size-5" /> สร้างงาน / ข้อสอบ</button>
          <div class="grid grid-cols-2 gap-3 text-center">
          <div class="min-w-28 rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
            <p class="text-2xl font-semibold text-slate-900 dark:text-white">{{ totalAssignments }}</p>
            <p class="text-xs text-slate-500">งานทั้งหมด</p>
          </div>
          <div class="min-w-28 rounded-xl bg-emerald-50 px-4 py-3 dark:bg-emerald-950/30">
            <p class="text-2xl font-semibold text-emerald-600">{{ submittedAssignments }}</p>
            <p class="text-xs text-slate-500">ส่งแล้ว</p>
          </div>
          </div>
        </div>
      </div>
    </section>

    <nav class="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900" aria-label="กรองงานตามสถานะ">
      <div class="flex min-w-max gap-1">
        <button v-for="tab in tabs" :key="tab.id" :class="activeTab === tab.id ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white'" class="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition" @click="activeTab = tab.id">
          <Icon :icon="tab.icon" class="size-5" />
          <span>{{ tab.label }}</span>
          <span :class="activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'" class="rounded-full px-2 py-0.5 text-xs">{{ getTabCount(tab.id) }}</span>
        </button>
      </div>
    </nav>

    <section class="space-y-4">
      <article v-for="chapter in filteredChapters" :key="chapter.id" class="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <button class="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/60 md:p-6" @click="toggleChapter(chapter.id)">
          <span class="flex min-w-0 items-center gap-4">
            <span class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon icon="solar:book-2-linear" class="size-6" /></span>
            <span class="min-w-0">
              <span class="block text-base font-semibold text-slate-900 dark:text-white">{{ chapter.title }}</span>
              <span class="mt-1 block text-sm text-slate-500">{{ chapter.summary }}</span>
            </span>
          </span>
          <span class="flex shrink-0 items-center gap-3 text-sm text-slate-500">
            <span class="hidden sm:inline">{{ chapter.assignments.length }} งาน</span>
            <Icon :icon="isChapterOpen(chapter.id) ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'" class="size-5" />
          </span>
        </button>

        <div v-if="isChapterOpen(chapter.id)" class="border-t border-slate-100 p-4 dark:border-slate-800 md:p-5">
          <button v-for="assignment in chapter.assignments" :key="assignment.id" class="group flex w-full items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-primary/50 hover:bg-primary/[0.03] dark:border-slate-700 dark:hover:bg-primary/10" @click="openAssignment(chapter.id)">
            <span class="flex min-w-0 items-start gap-3">
              <span class="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800"><Icon icon="solar:clipboard-text-linear" class="size-5" /></span>
              <span class="min-w-0">
                <span class="block truncate font-medium text-slate-800 group-hover:text-primary dark:text-slate-100">{{ assignment.title }}</span>
                <span class="mt-1 block text-xs text-slate-500">{{ assignment.type }} · {{ assignment.points }} คะแนน · ส่งภายใน {{ assignment.due }}</span>
              </span>
            </span>
            <span class="flex shrink-0 items-center gap-2">
              <span :class="assignment.status === 'ส่งแล้ว' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'" class="hidden rounded-full px-3 py-1 text-xs font-medium sm:inline-block">{{ assignment.status }}</span>
              <Icon icon="solar:arrow-right-linear" class="size-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-primary" />
            </span>
          </button>
        </div>
      </article>

      <div v-if="filteredChapters.length === 0" class="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900">
        <Icon icon="solar:clipboard-remove-linear" class="mx-auto size-12 text-slate-300 dark:text-slate-600" />
        <h2 class="mt-4 text-base font-semibold text-slate-800 dark:text-slate-100">ยังไม่มีงานในสถานะนี้</h2>
        <p class="mt-1 text-sm text-slate-500">เมื่อมีการอัปเดตงาน รายการจะแสดงที่แท็บนี้</p>
      </div>
    </section>
  </div>
</template>
