<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import Card from '@/components/ui/card/Card.vue';
import Badge from '@/components/ui/badge/Badge.vue';
import AspectRatio from '@/components/ui/aspect-ratio/AspectRatio.vue';
import historyCoverOne from '@/assets/images/blog/blog-img3.jpg';
import historyCoverTwo from '@/assets/images/blog/blog-img4.jpg';
import historyCoverThree from '@/assets/images/blog/blog-img8.jpg';
import historyCoverFour from '@/assets/images/blog/blog-img9.jpg';

const historyItems = ref([
  { id: 1, title: 'บทที่ 3: คำสั่งควบคุมการทำงาน', course: 'ภาษา C', type: 'บทเรียน', viewedAt: 'วันนี้ 10:20 น.', coverImg: historyCoverOne, content: 'เรียนรู้การใช้เงื่อนไขและการทำซ้ำเพื่อแก้โจทย์ปัญหา', activity: 'อ่านเนื้อหาและเปิดไฟล์ CheatSheet_Components.pdf', progress: 72, status: 'กำลังเรียน', to: '/apps/blog/garmins-instinct-crossover-is-a-rugged-hybrid-smartwatch' },
  { id: 2, title: 'แบบฝึกหัด 1: การคำนวณพื้นฐาน', course: 'ภาษา C', type: 'งานที่ได้รับมอบหมาย', viewedAt: 'เมื่อวาน 16:40 น.', coverImg: historyCoverTwo, content: 'ฝึกเขียนโปรแกรมรับตัวเลขและคำนวณผลลัพธ์', activity: 'เปิดโจทย์และเตรียมไฟล์ assignment-1-6501001.c', progress: 45, status: 'ยังไม่ส่ง', to: '/apps/assignments/assignment-1' },
  { id: 3, title: 'ภาพรวมคอร์ส Composition API', course: 'การพัฒนา Web Application ด้วย Vue 3', type: 'คลาส', viewedAt: '2 ก.ย. 2569', coverImg: historyCoverThree, content: 'ทบทวนภาพรวมเนื้อหาและโครงสร้างของรายวิชา', activity: 'ดูภาพรวมคอร์สและเกณฑ์การประเมินผล', progress: 100, status: 'ดูครบแล้ว', to: '/apps/blog/garmins-instinct-crossover-is-a-rugged-hybrid-smartwatch' },
  { id: 4, title: 'บทที่ 2: Reactivity & Composition API', course: 'การพัฒนา Web Application ด้วย Vue 3', type: 'บทเรียน', viewedAt: '1 ก.ย. 2569', coverImg: historyCoverFour, content: 'ทบทวนการใช้ ref, computed และ watch เพื่อจัดการข้อมูล', activity: 'อ่านเอกสารและดูวิดีโอประกอบบทเรียน', progress: 45, status: 'กำลังเรียน', to: '/apps/blog/garmins-instinct-crossover-is-a-rugged-hybrid-smartwatch' },
]);
const removeHistory = (id: number) => { historyItems.value = historyItems.value.filter((item) => item.id !== id); };
const clearHistory = () => { historyItems.value = []; };
</script>

<template>
  <BaseBreadcrumb title="ประวัติเข้าชม" :breadcrumbs="[{ text: 'เมนูหลัก', href: '#' }, { text: 'ประวัติเข้าชม', href: '#' }]" />
  <div class="flex w-full flex-col gap-6 pb-10">
    <section class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p class="text-sm text-muted-foreground">รายการล่าสุด {{ historyItems.length }} รายการ</p></div><button v-if="historyItems.length" class="inline-flex items-center gap-2 self-start rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition hover:border-rose-300 hover:text-rose-600 sm:self-auto" @click="clearHistory"><Icon icon="solar:trash-bin-minimalistic-linear" class="size-4" /> ล้างประวัติทั้งหมด</button></section>
    <section v-if="historyItems.length" class="grid grid-cols-12 gap-6">
      <div v-for="item in historyItems" :key="item.id" class="col-span-12 sm:col-span-6 md:col-span-3">
        <Card class="group flex h-full flex-col gap-0 overflow-hidden rounded-md p-0" padding="px-0">
          <RouterLink :to="item.to"><AspectRatio :ratio="16 / 9" class="relative overflow-hidden"><img :src="item.coverImg" :alt="item.title" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" /><Badge variant="white" class="absolute bottom-3 end-3 rounded-md text-xs">{{ item.type }}</Badge><span class="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm"><Icon icon="solar:history-linear" class="size-3.5" />{{ item.viewedAt }}</span></AspectRatio></RouterLink>
          <div class="flex flex-1 flex-col gap-3 p-4"><div><p class="text-xs font-medium text-primary">{{ item.course }}</p><h2 class="mt-1 line-clamp-2 text-base font-semibold leading-tight text-foreground group-hover:text-primary">{{ item.title }}</h2></div><p class="line-clamp-2 text-sm text-muted-foreground">{{ item.content }}</p><div class="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60"><div class="flex items-center justify-between gap-3 text-xs"><span class="font-medium text-slate-600 dark:text-slate-300">สิ่งที่ทำล่าสุด</span><span class="font-medium text-primary">{{ item.status }}</span></div><p class="mt-1 line-clamp-2 text-xs text-slate-500">{{ item.activity }}</p><div class="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"><div class="h-full rounded-full bg-primary" :style="{ width: `${item.progress}%` }"></div></div><p class="mt-1 text-right text-[11px] text-slate-400">ความคืบหน้า {{ item.progress }}%</p></div><div class="mt-auto flex items-center justify-between border-t border-border pt-3"><RouterLink :to="item.to" class="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">เปิดดูต่อ <Icon icon="solar:arrow-right-linear" class="size-4" /></RouterLink><button class="text-muted-foreground transition hover:text-rose-500" :aria-label="`ลบ ${item.title} จากประวัติ`" @click="removeHistory(item.id)"><Icon icon="solar:trash-bin-minimalistic-linear" class="size-4" /></button></div></div>
        </Card>
      </div>
    </section>
    <section v-else class="rounded-lg border border-dashed border-ld bg-card px-6 py-16 text-center"><Icon icon="solar:history-linear" class="mx-auto size-12 text-muted-foreground" /><h2 class="mt-4 text-lg font-semibold text-foreground">ยังไม่มีประวัติการเข้าชม</h2><p class="mt-2 text-sm text-muted-foreground">บทเรียนและคลาสที่เปิดดูล่าสุดจะแสดงที่นี่</p>
    </section>
  </div>
</template>
