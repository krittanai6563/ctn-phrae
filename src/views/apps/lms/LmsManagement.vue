<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { assignmentChapters, studentSubmissions } from '@/views/apps/assignments/assignmentData';

interface LmsRow { id: string; title: string; detail: string; status: string; }
interface PageConfig { title: string; subtitle: string; icon: string; action: string; sectionTitle: string; rows: LmsRow[]; totalLabel: string; completedLabel: string; attentionLabel: string; }

const route = useRoute();
const router = useRouter();
const search = ref('');
const assignments = assignmentChapters.flatMap((chapter) => chapter.assignments);
const reviewRows: LmsRow[] = Object.entries(studentSubmissions).flatMap(([assignmentId, submissions]) => {
  const assignment = assignments.find((item) => item.id === assignmentId);
  return submissions.filter((student) => student.status === 'ส่งแล้ว').map((student) => ({
    id: `${assignmentId}-${student.id}`,
    title: student.name,
    detail: assignment?.title || 'งานที่ส่ง',
    status: student.score === undefined ? 'รอตรวจ' : `ได้ ${student.score}/${assignment?.points || 0} คะแนน`,
  }));
});
const studentRows: LmsRow[] = Array.from(new Map(Object.values(studentSubmissions).flat().map((student) => [student.id, student])).values()).map((student) => ({ id: student.id, title: student.name, detail: student.studentId, status: student.status }));

const pageConfig = computed<PageConfig>(() => {
  const configs: Record<string, PageConfig> = {
    '/apps/assignments/review': { title: 'งานรอตรวจ', subtitle: 'ตรวจงานและส่งคะแนนพร้อม Feedback ให้นักเรียน', icon: 'solar:clipboard-check-linear', action: 'ไปงานทั้งหมด', sectionTitle: 'รายการที่ส่งเข้าม', rows: reviewRows, totalLabel: 'งานที่ส่งแล้ว', completedLabel: 'มีคะแนนแล้ว', attentionLabel: 'รอตรวจ' },
    '/apps/students': { title: 'รายชื่อนักเรียน', subtitle: 'ดูสมาชิก ความคืบหน้า และกลุ่มของนักเรียนในห้องเรียน', icon: 'solar:users-group-rounded-linear', action: 'จัดการกลุ่ม', sectionTitle: 'นักเรียนในห้องเรียน', rows: studentRows, totalLabel: 'นักเรียนทั้งหมด', completedLabel: 'ส่งงานแล้ว', attentionLabel: 'ต้องติดตาม' },
    '/apps/lessons': { title: 'บทเรียนและเนื้อหา', subtitle: 'จัดลำดับบทเรียน เอกสาร และเนื้อหาสำหรับแต่ละคลาส', icon: 'solar:book-2-linear', action: 'เพิ่มบทเรียน', sectionTitle: 'รายการบทเรียน', rows: [{ id: 'lesson-1', title: 'บทที่ 1: หลักการเขียนโปรแกรม', detail: 'วิดีโอ · 45 นาที · 3 เอกสาร', status: 'เผยแพร่แล้ว' }, { id: 'lesson-2', title: 'บทที่ 2: ตัวแปรและชนิดข้อมูล', detail: 'เอกสาร · 60 นาที · 2 เอกสาร', status: 'เผยแพร่แล้ว' }, { id: 'lesson-3', title: 'บทที่ 3: คำสั่งควบคุมการทำงาน', detail: 'วิดีโอ · 50 นาที · 1 เอกสาร', status: 'ฉบับร่าง' }], totalLabel: 'บทเรียนทั้งหมด', completedLabel: 'เผยแพร่แล้ว', attentionLabel: 'ฉบับร่าง' },
    '/apps/gradebook': { title: 'คะแนนและผลการเรียน', subtitle: 'ภาพรวมคะแนน รายงาน และผลการเรียนของนักเรียน', icon: 'solar:chart-2-linear', action: 'ส่งออกคะแนน', sectionTitle: 'สรุปผลคะแนน', rows: [{ id: 'grade-1', title: 'แบบฝึกหัด 1: การคำนวณพื้นฐาน', detail: 'ส่งแล้ว 2/30 คน · คะแนนเต็ม 20', status: 'เฉลี่ย 18/20' }, { id: 'grade-2', title: 'แบบฝึกหัด 2: โปรแกรมตัดสินใจ', detail: 'ส่งแล้ว 1/30 คน · คะแนนเต็ม 25', status: 'เฉลี่ย 23/25' }, { id: 'grade-3', title: 'ใบงาน: แปลงหน่วยอุณหภูมิ', detail: 'ส่งแล้ว 30/30 คน · คะแนนเต็ม 15', status: 'เฉลี่ย 14/15' }], totalLabel: 'รายการประเมิน', completedLabel: 'มีคะแนนแล้ว', attentionLabel: 'ยังไม่สรุป' },
    '/apps/announcements': { title: 'ประกาศประจำคลาส', subtitle: 'สื่อสารข่าวสารและแจ้งเตือนสำคัญให้ผู้เรียน', icon: 'solar:megaphone-linear', action: 'สร้างประกาศ', sectionTitle: 'ประกาศล่าสุด', rows: [{ id: 'announcement-1', title: 'แจ้งกำหนดส่งแบบฝึกหัดบทที่ 2', detail: 'ประกาศเมื่อ 5 ก.ย. 2569 · ผู้เรียนทั้งหมด', status: 'เผยแพร่แล้ว' }, { id: 'announcement-2', title: 'เตรียมตัวสอบกลางภาค', detail: 'ประกาศเมื่อ 1 ก.ย. 2569 · ผู้เรียนทั้งหมด', status: 'เผยแพร่แล้ว' }, { id: 'announcement-3', title: 'เปลี่ยนห้องเรียนสัปดาห์หน้า', detail: 'กำหนดเผยแพร่ 10 ก.ย. 2569', status: 'ฉบับร่าง' }], totalLabel: 'ประกาศทั้งหมด', completedLabel: 'เผยแพร่แล้ว', attentionLabel: 'ฉบับร่าง' },
    '/apps/reports': { title: 'รายงานผล', subtitle: 'วิเคราะห์การส่งงาน ความคืบหน้า และนักเรียนที่ต้องติดตาม', icon: 'solar:pie-chart-2-linear', action: 'ส่งออกรายงาน', sectionTitle: 'ภาพรวมการเรียนรู้', rows: [{ id: 'report-1', title: 'ความคืบหน้าการเรียนเฉลี่ย', detail: 'วัดจากบทเรียนทั้งหมดของคลาส', status: '68%' }, { id: 'report-2', title: 'อัตราการส่งงาน', detail: 'เปรียบเทียบงานที่มอบหมายกับงานที่ส่งแล้ว', status: '82%' }, { id: 'report-3', title: 'นักเรียนที่ต้องติดตาม', detail: 'ยังไม่ส่งงานหรือล่าช้ากว่ากำหนด', status: '3 คน' }], totalLabel: 'ตัวชี้วัดทั้งหมด', completedLabel: 'อยู่ในเกณฑ์ดี', attentionLabel: 'ต้องติดตาม' },
  };
  return configs[route.path] || { title: 'LMS', subtitle: 'จัดการการเรียนการสอนในห้องเรียน', icon: 'solar:widget-4-linear', action: 'ดำเนินการ', sectionTitle: 'รายการล่าสุด', rows: [], totalLabel: 'รายการทั้งหมด', completedLabel: 'ดำเนินการแล้ว', attentionLabel: 'ต้องติดตาม' };
});
const filteredRows = computed(() => pageConfig.value.rows.filter((row) => `${row.title} ${row.detail} ${row.status}`.includes(search.value)));
const completedCount = computed(() => pageConfig.value.rows.filter((row) => /เผยแพร่แล้ว|มีคะแนนแล้ว|ส่งงานแล้ว|อยู่ในเกณฑ์ดี|ได้/.test(row.status)).length);
const attentionCount = computed(() => pageConfig.value.rows.length - completedCount.value);
const action = () => { if (route.path === '/apps/assignments/review') router.push('/apps/assignments'); else if (route.path === '/apps/students') router.push('/apps/class-groups'); else alert(`เปิดพื้นที่${pageConfig.value.title}`); };
</script>

<template>
  <BaseBreadcrumb :title="pageConfig.title" :breadcrumbs="[{ text: 'LMS', href: '#' }, { text: pageConfig.title, href: '#' }]" />
  <div class="mx-auto flex max-w-7xl flex-col gap-6 pb-10">
    <section class="rounded-lg border border-ld bg-card p-6 md:p-8"><div class="flex flex-col justify-between gap-5 md:flex-row md:items-center"><div class="flex items-start gap-4"><span class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon :icon="pageConfig.icon" class="size-6" /></span><div><p class="text-sm font-medium text-primary">LMS · ภาษา C · ปวช.2/1</p><h1 class="mt-1 text-2xl font-semibold text-foreground">{{ pageConfig.title }}</h1><p class="mt-2 text-sm text-muted-foreground">{{ pageConfig.subtitle }}</p></div></div><button class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white hover:opacity-90" @click="action"><Icon icon="solar:add-circle-linear" class="size-5" /> {{ pageConfig.action }}</button></div></section>
    <div class="grid gap-6 md:grid-cols-3"><div class="rounded-lg border border-ld bg-card p-5"><p class="text-sm text-muted-foreground">{{ pageConfig.totalLabel }}</p><p class="mt-2 text-3xl font-semibold text-foreground">{{ pageConfig.rows.length }}</p></div><div class="rounded-lg border border-ld bg-card p-5"><p class="text-sm text-muted-foreground">{{ pageConfig.completedLabel }}</p><p class="mt-2 text-3xl font-semibold text-emerald-600">{{ completedCount }}</p></div><div class="rounded-lg border border-ld bg-card p-5"><p class="text-sm text-muted-foreground">{{ pageConfig.attentionLabel }}</p><p class="mt-2 text-3xl font-semibold text-amber-600">{{ attentionCount }}</p></div></div>
    <section class="rounded-lg border border-ld bg-card p-6"><div class="flex flex-col justify-between gap-4 border-b border-border pb-5 sm:flex-row sm:items-center"><div><h2 class="text-lg font-semibold text-foreground">{{ pageConfig.sectionTitle }}</h2><p class="mt-1 text-sm text-muted-foreground">ข้อมูลเฉพาะของเมนูนี้ ไม่รวมกับเมนูอื่น</p></div><label class="relative block w-full sm:w-72"><Icon icon="solar:magnifer-linear" class="absolute left-3 top-3 size-5 text-muted-foreground" /><input v-model="search" type="search" placeholder="ค้นหา" class="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary" /></label></div><div class="mt-5 overflow-x-auto"><table class="w-full min-w-[620px] text-left"><thead><tr class="border-b border-border text-xs text-muted-foreground"><th class="px-3 py-3 font-medium">รายการ</th><th class="px-3 py-3 font-medium">รายละเอียด</th><th class="px-3 py-3 font-medium">สถานะ</th><th class="px-3 py-3 font-medium">การดำเนินการ</th></tr></thead><tbody><tr v-for="row in filteredRows" :key="row.id" class="border-b border-border last:border-0"><td class="px-3 py-4 text-sm font-medium text-foreground">{{ row.title }}</td><td class="px-3 py-4 text-sm text-muted-foreground">{{ row.detail }}</td><td class="px-3 py-4"><span class="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{{ row.status }}</span></td><td class="px-3 py-4"><button class="text-xs font-medium text-primary hover:underline" @click="action">ดูรายละเอียด</button></td></tr><tr v-if="filteredRows.length === 0"><td colspan="4" class="px-3 py-10 text-center text-sm text-muted-foreground">ไม่พบข้อมูล</td></tr></tbody></table></div></section>
  </div>
</template>