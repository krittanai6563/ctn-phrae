<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { assignmentCourses } from './assignmentData';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const course = computed(() => assignmentCourses.find((item) => item.id === route.params.courseId && (auth.isTeacher || auth.user.enrolledCourseIds.includes(item.id))));
const visibleChapters = computed(() => course.value?.chapters.map((chapter) => ({
  ...chapter,
  assignments: chapter.assignments.filter((assignment) => auth.isTeacher || auth.user.assignedAssignmentIds.includes(assignment.id)),
})).filter((chapter) => chapter.assignments.length));
const openChapters = ref<string[]>([]);
const toggleChapter = (chapterId: string) => { openChapters.value = openChapters.value.includes(chapterId) ? openChapters.value.filter((id) => id !== chapterId) : [...openChapters.value, chapterId]; };
const openAssignment = (assignmentId: string) => router.push(`/apps/assignments/${assignmentId}`);
</script>

<template>
  <BaseBreadcrumb title="งานในรายวิชา" :breadcrumbs="[{ text: 'งานที่ได้รับมอบหมาย', href: '/apps/assignments' }, { text: course?.title || 'รายวิชา', href: '#' }]" />
  <div v-if="course" class="mx-auto flex max-w-6xl flex-col gap-6 pb-10">
    <section class="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 md:p-8"><button class="mb-5 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary" @click="router.push('/apps/assignments')"><Icon icon="solar:arrow-left-linear" class="size-5" /> กลับไปรายวิชา</button><p class="text-sm font-medium text-primary">{{ course.code }} · {{ course.instructor }}</p><h1 class="mt-2 text-2xl font-semibold text-slate-900 dark:text-white md:text-3xl">{{ course.title }}</h1><p class="mt-2 text-sm text-slate-500">{{ course.summary }}</p></section>
    <section class="space-y-4"><article v-for="chapter in visibleChapters" :key="chapter.id" class="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"><button class="flex w-full items-center justify-between gap-4 p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60" @click="toggleChapter(chapter.id)"><span class="flex items-center gap-4"><span class="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon icon="solar:book-2-linear" class="size-6" /></span><span><span class="block font-semibold text-slate-900 dark:text-white">{{ chapter.title }}</span><span class="mt-1 block text-sm text-slate-500">{{ chapter.summary }}</span></span></span><span class="flex items-center gap-3 text-sm text-slate-500">{{ chapter.assignments.length }} งาน <Icon :icon="openChapters.includes(chapter.id) ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'" class="size-5" /></span></button><div v-if="openChapters.includes(chapter.id)" class="space-y-3 border-t border-slate-100 p-4 dark:border-slate-800 md:p-5"><button v-for="assignment in chapter.assignments" :key="assignment.id" class="group flex w-full items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 text-left hover:border-primary/50 dark:border-slate-700" @click="openAssignment(assignment.id)"><span class="flex min-w-0 items-start gap-3"><span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800"><Icon icon="solar:clipboard-text-linear" class="size-5" /></span><span class="min-w-0"><span class="block font-medium text-slate-800 dark:text-slate-100">{{ assignment.title }}</span><span class="mt-1 block text-xs text-slate-500">{{ assignment.type }} · {{ assignment.points }} คะแนน · ส่งภายใน {{ assignment.due }}</span></span></span><Icon icon="solar:arrow-right-linear" class="size-5 text-slate-400 group-hover:text-primary" /></button></div></article></section>
  </div>
  <div v-else class="p-10 text-center text-slate-500">ไม่พบรายวิชา</div>
</template>
