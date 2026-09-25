<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';

const router = useRouter();
const selectedClass = ref('ภาษา C · ปวช.2/1');
const search = ref('');
const groups = ref([
  { id: 'A', name: 'กลุ่ม A', color: 'bg-sky-500', students: ['กนกพร มั่นคง', 'กิตติศักดิ์ บัวทอง', 'ธนกฤต คงดี', 'พิมพ์ชนก ใจดี'] },
  { id: 'B', name: 'กลุ่ม B', color: 'bg-emerald-500', students: ['ณัฐพล แก้วใส', 'ชลธิชา วัฒนกุล', 'ภัทรพล ศรีสุข', 'รินรดา พรหมรักษา'] },
  { id: 'C', name: 'กลุ่ม C', color: 'bg-amber-500', students: ['วรากร ทองดี', 'สุภาวดี คำแสน', 'ณัฐวุฒิ อินทร์แก้ว', 'กัญญารัตน์ มีสุข'] },
]);
const filteredGroups = computed(() => groups.value.map((group) => ({ ...group, students: group.students.filter((student) => student.includes(search.value)) })));
const addGroup = () => groups.value.push({ id: String.fromCharCode(65 + groups.value.length), name: `กลุ่ม ${String.fromCharCode(65 + groups.value.length)}`, color: 'bg-violet-500', students: [] });
const removeStudent = (groupId: string, student: string) => {
  const group = groups.value.find((item) => item.id === groupId);
  if (group) group.students = group.students.filter((item) => item !== student);
};
const openAddStudent = (groupId: string) => router.push({ path: '/apps/class-groups/add-students', query: { group: groupId, class: selectedClass.value } });
</script>

<template>
  <BaseBreadcrumb title="จัดการกลุ่มนักเรียน" :breadcrumbs="[{ text: 'งานที่ได้รับมอบหมาย', href: '/apps/assignments' }, { text: 'จัดการกลุ่มนักเรียน', href: '#' }]" />
  <div class="mx-auto flex max-w-6xl flex-col gap-6 pb-10">
    <section class="rounded-lg border border-ld bg-card p-6 md:p-8"><div class="flex flex-col justify-between gap-4 md:flex-row md:items-center"><div><p class="text-sm font-medium text-primary">การแบ่งกลุ่มสำหรับการมอบหมายงาน</p><h1 class="mt-1 text-2xl font-semibold text-foreground">กลุ่มนักเรียน</h1><p class="mt-2 text-sm text-muted-foreground">จัดกลุ่มเพื่อมอบหมายงานเฉพาะกลุ่ม หรือใช้เป็นเงื่อนไขสุ่มชุดข้อสอบ</p></div><button class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white hover:opacity-90" @click="addGroup"><Icon icon="solar:add-circle-linear" class="size-5" /> เพิ่มกลุ่ม</button></div><div class="mt-6 grid gap-4 sm:grid-cols-2"><label class="block"><span class="mb-2 block text-xs font-medium text-foreground">ห้องเรียน</span><select v-model="selectedClass" class="w-full rounded-lg border border-input bg-background px-3 py-3 text-sm outline-none focus:border-primary"><option>ภาษา C · ปวช.2/1</option><option>การพัฒนา Web Application · ปี 3</option></select></label><label class="block"><span class="mb-2 block text-xs font-medium text-foreground">ค้นหานักเรียน</span><div class="relative"><Icon icon="solar:magnifer-linear" class="absolute left-3 top-3 size-5 text-muted-foreground" /><input v-model="search" type="search" placeholder="ชื่อ-นามสกุล" class="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-3 text-sm outline-none focus:border-primary" /></div></label></div></section>

    <section class="grid gap-6 md:grid-cols-3"><article v-for="group in filteredGroups" :key="group.id" class="rounded-lg border border-ld bg-card p-5"><div class="flex items-center justify-between gap-3"><div class="flex items-center gap-3"><span :class="group.color" class="flex size-10 items-center justify-center rounded-lg text-lg font-semibold text-white">{{ group.id }}</span><div><h2 class="font-semibold text-foreground">{{ group.name }}</h2><p class="text-xs text-muted-foreground">{{ group.students.length }} คน</p></div></div><button class="rounded-md p-1.5 text-muted-foreground hover:bg-muted" aria-label="ตั้งค่ากลุ่ม"><Icon icon="solar:settings-linear" class="size-5" /></button></div><div class="mt-5 space-y-2"><div v-for="student in group.students" :key="student" class="flex items-center justify-between gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm text-foreground"><span class="flex min-w-0 items-center gap-2"><span class="flex size-7 shrink-0 items-center justify-center rounded-full bg-card text-xs font-medium text-primary">{{ student.charAt(0) }}</span><span class="truncate">{{ student }}</span></span><button class="text-muted-foreground hover:text-rose-500" aria-label="นำออกจากกลุ่ม" @click="removeStudent(group.id, student)"><Icon icon="solar:close-circle-linear" class="size-4" /></button></div><p v-if="!group.students.length" class="rounded-lg border border-dashed border-border py-6 text-center text-xs text-muted-foreground">ยังไม่มีนักเรียนในกลุ่ม</p></div><button class="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline" @click="openAddStudent(group.id)"><Icon icon="solar:user-plus-linear" class="size-4" /> เพิ่มนักเรียนเข้ากลุ่ม</button></article></section>

    <section class="rounded-lg border border-primary/20 bg-primary/5 p-5 dark:bg-primary/10"><div class="flex gap-3"><Icon icon="solar:info-circle-linear" class="mt-0.5 size-5 shrink-0 text-primary" /><div><h2 class="text-sm font-semibold text-foreground">การสุ่มชุดข้อสอบ</h2><p class="mt-1 text-xs leading-5 text-muted-foreground">เมื่อเลือก “สุ่มชุดโจทย์” ในหน้าสร้างงาน ระบบจะสุ่มชุดตามจำนวนนักเรียนในห้อง และบันทึกว่าผู้เรียนแต่ละคนได้รับชุดใด เพื่อให้อาจารย์ตรวจสอบย้อนหลังได้</p></div></div></section>
  </div>

</template>
