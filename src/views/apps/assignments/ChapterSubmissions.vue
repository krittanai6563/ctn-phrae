<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { assignmentChapters, studentSubmissions } from './assignmentData';

type StatusFilter = 'all' | 'ส่งแล้ว' | 'ยังไม่ส่ง' | 'รอดำเนินการ';
const route = useRoute();
const router = useRouter();
const activeFilter = ref<StatusFilter>('all');

const chapter = computed(() => assignmentChapters.find((item) => item.id === route.params.chapterId));
const selectedAssignmentId = ref('');
const selectedAssignment = computed(() => chapter.value?.assignments.find((item) => item.id === selectedAssignmentId.value) || chapter.value?.assignments[0]);
const submissions = computed(() => selectedAssignment.value ? studentSubmissions[selectedAssignment.value.id] || [] : []);
const filteredSubmissions = computed(() => activeFilter.value === 'all'
  ? submissions.value
  : submissions.value.filter((student) => student.status === activeFilter.value));
const countByStatus = (status: StatusFilter) => status === 'all'
  ? submissions.value.length
  : submissions.value.filter((student) => student.status === status).length;
const openStudentDetails = (studentId: string) => {
  if (selectedAssignment.value) {
    router.push({ path: `/apps/assignments/${selectedAssignment.value.id}`, query: { studentId } });
  }
};
</script>

<template>
  <BaseBreadcrumb
    title="สถานะการส่งงาน"
    :breadcrumbs="[
      { text: 'งานที่ได้รับมอบหมาย', href: '/apps/assignments' },
      { text: chapter?.title || 'บทเรียน', href: '#' }
    ]"
  />

  <div v-if="chapter" class="mx-auto flex max-w-7xl flex-col gap-6 pb-10">
    <section class="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 md:p-8">
      <button class="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary" @click="router.push('/apps/assignments')"><Icon icon="solar:arrow-left-linear" class="size-5" /> กลับไปงานที่ได้รับมอบหมาย</button>
      <div class="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p class="text-sm font-medium text-primary">สรุปการส่งงานรายบท</p>
          <h1 class="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-3xl">{{ chapter.title }}</h1>
          <p class="mt-2 text-sm leading-6 text-slate-500">ตรวจสอบว่านักเรียนส่งงานแล้วหรือยัง ก่อนเปิดดูรายละเอียดงาน</p>
        </div>
        <div class="grid grid-cols-3 gap-3 text-center">
          <div class="rounded-xl bg-emerald-50 px-4 py-3 dark:bg-emerald-950/30"><p class="text-xl font-semibold text-emerald-600">{{ countByStatus('ส่งแล้ว') }}</p><p class="text-xs text-slate-500">ส่งแล้ว</p></div>
          <div class="rounded-xl bg-amber-50 px-4 py-3 dark:bg-amber-950/30"><p class="text-xl font-semibold text-amber-600">{{ countByStatus('ยังไม่ส่ง') }}</p><p class="text-xs text-slate-500">ยังไม่ส่ง</p></div>
          <div class="rounded-xl bg-slate-100 px-4 py-3 dark:bg-slate-800"><p class="text-xl font-semibold text-slate-600 dark:text-slate-300">{{ countByStatus('รอดำเนินการ') }}</p><p class="text-xs text-slate-500">รอดำเนินการ</p></div>
        </div>
      </div>
    </section>

    <div class="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
      <aside class="h-fit rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 class="px-2 pb-3 text-sm font-semibold text-slate-900 dark:text-white">งานในบทนี้</h2>
        <div class="space-y-2">
          <button v-for="assignment in chapter.assignments" :key="assignment.id" :class="selectedAssignment?.id === assignment.id ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-transparent hover:border-slate-200 hover:bg-slate-50 dark:hover:border-slate-700 dark:hover:bg-slate-800'" class="w-full rounded-xl border p-3 text-left transition" @click="selectedAssignmentId = assignment.id; activeFilter = 'all'">
            <span class="block text-sm font-medium text-slate-800 dark:text-slate-100">{{ assignment.title }}</span>
            <span class="mt-1 block text-xs text-slate-500">{{ assignment.points }} คะแนน · {{ assignment.due }}</span>
          </button>
        </div>
      </aside>

      <main class="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 md:p-6">
        <div class="flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-800 sm:flex-row sm:items-center">
          <div>
            <p class="text-xs font-medium text-primary">งานที่เลือก</p>
            <h2 class="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{{ selectedAssignment?.title }}</h2>
          </div>
        </div>

        <div class="mt-5 flex gap-2 overflow-x-auto border-b border-slate-100 pb-3 dark:border-slate-800">
          <button v-for="filter in (['all', 'ส่งแล้ว', 'ยังไม่ส่ง', 'รอดำเนินการ'] as StatusFilter[])" :key="filter" :class="activeFilter === filter ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'" class="whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium" @click="activeFilter = filter">{{ filter === 'all' ? 'นักเรียนทั้งหมด' : filter }} ({{ countByStatus(filter) }})</button>
        </div>

        <div class="mt-5 overflow-x-auto">
          <table class="w-full min-w-[620px] text-left">
            <thead><tr class="border-b border-slate-100 text-xs text-slate-500 dark:border-slate-800"><th class="px-3 py-3 font-medium">นักเรียน</th><th class="px-3 py-3 font-medium">รหัสนักเรียน</th><th class="px-3 py-3 font-medium">สถานะ</th><th class="px-3 py-3 font-medium">เวลาส่ง / คะแนน</th></tr></thead>
            <tbody>
              <tr v-for="student in filteredSubmissions" :key="student.id" class="group cursor-pointer border-b border-slate-50 transition hover:bg-primary/[0.03] last:border-0 dark:border-slate-800/60 dark:hover:bg-primary/10" tabindex="0" @click="openStudentDetails(student.id)" @keydown.enter="openStudentDetails(student.id)">
                <td class="px-3 py-4"><div class="flex items-center gap-3"><span class="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">{{ student.name.charAt(0) }}</span><span class="text-sm font-medium text-slate-800 dark:text-slate-100">{{ student.name }}</span></div></td>
                <td class="px-3 py-4 text-sm text-slate-500">{{ student.studentId }}</td>
                <td class="px-3 py-4"><span :class="student.status === 'ส่งแล้ว' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : student.status === 'ยังไม่ส่ง' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'" class="rounded-full px-3 py-1 text-xs font-medium">{{ student.status }}</span></td>
                <td class="px-3 py-4 text-sm text-slate-500">{{ student.submittedAt || '-' }} <span v-if="student.score !== undefined" class="font-medium text-slate-700 dark:text-slate-200">· {{ student.score }}/{{ selectedAssignment?.points }}</span><Icon icon="solar:arrow-right-linear" class="ml-2 inline size-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-primary" /></td>
              </tr>
            </tbody>
          </table>
          <div v-if="filteredSubmissions.length === 0" class="py-12 text-center text-sm text-slate-500">ไม่มีนักเรียนในสถานะนี้</div>
        </div>
      </main>
    </div>
  </div>

  <div v-else class="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900"><Icon icon="solar:document-broken-linear" class="mx-auto size-12 text-slate-400" /><h1 class="mt-4 text-xl font-semibold text-slate-900 dark:text-white">ไม่พบบทเรียน</h1><button class="mt-5 text-sm font-medium text-primary hover:underline" @click="router.push('/apps/assignments')">กลับไปดูงานทั้งหมด</button></div>
</template>
