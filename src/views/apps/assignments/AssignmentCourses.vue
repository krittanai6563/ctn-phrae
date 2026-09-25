<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import Card from '@/components/ui/card/Card.vue';
import Badge from '@/components/ui/badge/Badge.vue';
import AspectRatio from '@/components/ui/aspect-ratio/AspectRatio.vue';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import courseCover from '@/assets/images/blog/blog-img1.jpg';
import { assignmentCourses } from './assignmentData';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const auth = useAuthStore();
const courses = computed(() => assignmentCourses.map((course) => {
  const assignments = course.chapters.flatMap((chapter) => chapter.assignments);
  return { ...course, assignmentCount: assignments.length, submittedCount: assignments.filter((item) => item.status === 'ส่งแล้ว').length };
}).filter((course) => auth.isTeacher || auth.user.enrolledCourseIds.includes(course.id)));
</script>

<template>
  <BaseBreadcrumb title="งานที่ได้รับมอบหมาย" :breadcrumbs="[{ text: 'งานที่ได้รับมอบหมาย', href: '#' }]" />
  <div class="flex w-full flex-col gap-6 pb-10">
    <section class="grid grid-cols-12 gap-6">
      <div v-for="course in courses" :key="course.id" class="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">
        <Card class="group flex h-full flex-col gap-0 overflow-hidden rounded-md p-0" padding="px-0">
          <button class="text-left" @click="router.push(`/apps/assignments/course/${course.id}`)">
            <AspectRatio :ratio="16 / 9" class="relative overflow-hidden">
              <img :src="courseCover" :alt="course.title" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              <Badge variant="white" class="absolute bottom-3 end-3 rounded-md text-xs">{{ course.code }}</Badge>
              <div class="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/40 px-2 py-1 backdrop-blur-sm">
                <Avatar class="h-8 w-8"><AvatarImage :src="courseCover" alt="ผู้สอน" /><AvatarFallback>{{ course.instructor.charAt(0) }}</AvatarFallback></Avatar>
                <p class="max-w-[120px] truncate text-xs font-semibold text-white">{{ course.instructor }}</p>
              </div>
            </AspectRatio>
          </button>
          <div class="flex flex-grow flex-col gap-3 p-4">
            <h2 class="line-clamp-2 text-base font-semibold leading-tight text-foreground group-hover:text-primary">{{ course.title }}</h2>
            <p class="line-clamp-2 text-sm text-muted-foreground">{{ course.summary }}</p>
            <div class="mt-auto flex justify-between border-t border-border pt-2 text-xs text-darklink">
              <span class="flex items-center gap-1"><Icon icon="tabler:briefcase" class="size-4" />{{ course.assignmentCount }} งาน</span>
              <span class="flex items-center gap-1"><Icon icon="tabler:book-2" class="size-4" />{{ course.chapters.length }} บท</span>
            </div>
          </div>
        </Card>
      </div>
    </section>
  </div>
</template>
