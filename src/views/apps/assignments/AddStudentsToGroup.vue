<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';

const route = useRoute();
const router = useRouter();
const groupId = computed(() => String(route.query.group || 'A'));
const className = computed(() => String(route.query.class || 'ภาษา C · ปวช.2/1'));
const search = ref('');
const selectedIds = ref<string[]>([]);
const students = [
  ['6501001', 'กนกพร มั่นคง'], ['6501002', 'กิตติศักดิ์ บัวทอง'], ['6501003', 'ธนกฤต คงดี'], ['6501004', 'พิมพ์ชนก ใจดี'], ['6501005', 'ณัฐพล แก้วใส'], ['6501006', 'ชลธิชา วัฒนกุล'], ['6501007', 'ภัทรพล ศรีสุข'], ['6501008', 'รินรดา พรหมรักษา'], ['6501009', 'วรากร ทองดี'], ['6501010', 'สุภาวดี คำแสน'], ['6501011', 'ณัฐวุฒิ อินทร์แก้ว'], ['6501012', 'กัญญารัตน์ มีสุข'], ['6501013', 'พีรพัฒน์ จันทร์หอม'], ['6501014', 'อรทัย แสงทอง'], ['6501015', 'ศุภกร บุญช่วย'], ['6501016', 'มินตรา ชูศรี'], ['6501017', 'ธีรภัทร์ วงศ์ดี'], ['6501018', 'ปวีณา รัตนมณี'], ['6501019', 'ศรัณย์ พูลผล'], ['6501020', 'นภัสสร คงมั่น'],
].map(([id, name]) => ({ id, name }));
const filteredStudents = computed(() => students.filter((student) => `${student.name} ${student.id}`.includes(search.value)));
const toggleStudent = (id: string) => { selectedIds.value = selectedIds.value.includes(id) ? selectedIds.value.filter((item) => item !== id) : [...selectedIds.value, id]; };
const selectAll = () => { selectedIds.value = [...new Set([...selectedIds.value, ...filteredStudents.value.map((student) => student.id)])]; };
const clearSelection = () => { selectedIds.value = []; };
const save = () => { alert(`เพิ่มนักเรียน ${selectedIds.value.length} คนเข้ากลุ่ม ${groupId.value} เรียบร้อยแล้ว`); router.push('/apps/class-groups'); };
</script>

<template>
  <BaseBreadcrumb title="เพิ่มนักเรียนเข้ากลุ่ม" :breadcrumbs="[{ text: 'จัดการกลุ่มนักเรียน', href: '/apps/class-groups' }, { text: `กลุ่ม ${groupId}`, href: '#' }]" />
  <div class="mx-auto grid max-w-6xl gap-6 pb-10 lg:grid-cols-[minmax(0,1fr)_280px]">
    <main class="rounded-lg border border-ld bg-card p-6 md:p-8">
      <div class="flex items-start justify-between gap-4 border-b border-border pb-6"><div><p class="text-sm font-medium text-primary">{{ className }}</p><h1 class="mt-1 text-2xl font-semibold text-foreground">เพิ่มนักเรียนเข้ากลุ่ม {{ groupId }}</h1><p class="mt-2 text-sm text-muted-foreground">ค้นหาและเลือกนักเรียนหลายคนเพื่อเพิ่มเข้ากลุ่มพร้อมกัน</p></div><button class="rounded-lg p-2 text-muted-foreground hover:bg-muted" aria-label="กลับ" @click="router.push('/apps/class-groups')"><Icon icon="solar:close-circle-linear" class="size-6" /></button></div>
      <div class="mt-6 flex gap-2 rounded-lg bg-muted p-1"><button class="flex-1 rounded-md bg-card px-4 py-3 text-sm font-medium text-primary shadow-sm">เลือกจากห้องเรียน</button><button class="flex-1 rounded-md px-4 py-3 text-sm font-medium text-muted-foreground" @click="alert('นำเข้า CSV ได้ในขั้นตอนถัดไป')">นำเข้า CSV</button></div>
      <label class="relative mt-5 block"><Icon icon="solar:magnifer-linear" class="absolute left-3 top-3 size-5 text-muted-foreground" /><input v-model="search" type="search" placeholder="ค้นหาด้วยชื่อหรือรหัสนักเรียน" class="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-3 text-sm outline-none focus:border-primary" /></label>
      <div class="mt-4 flex items-center justify-between gap-3"><span class="text-sm text-muted-foreground">พบ {{ filteredStudents.length }} คน · เลือกแล้ว {{ selectedIds.length }} คน</span><div class="flex gap-3"><button class="text-sm font-medium text-primary hover:underline" @click="selectAll">เลือกทั้งหมด</button><button class="text-sm font-medium text-muted-foreground hover:underline" @click="clearSelection">ล้างการเลือก</button></div></div>
      <div class="mt-4 max-h-[55vh] space-y-2 overflow-y-auto pr-1"><label v-for="student in filteredStudents" :key="student.id" class="flex cursor-pointer items-center gap-4 rounded-lg border border-border p-4 transition hover:border-primary/40 hover:bg-muted"><input type="checkbox" :checked="selectedIds.includes(student.id)" class="size-4 accent-primary" @change="toggleStudent(student.id)" /><span class="flex size-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">{{ student.name.charAt(0) }}</span><span><span class="block text-sm font-medium text-foreground">{{ student.name }}</span><span class="mt-1 block text-xs text-muted-foreground">รหัส {{ student.id }}</span></span></label><p v-if="!filteredStudents.length" class="py-12 text-center text-sm text-muted-foreground">ไม่พบนักเรียน</p></div>
    </main>
    <aside class="h-fit rounded-lg border border-ld bg-card p-5 lg:sticky lg:top-6"><div class="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon icon="solar:user-plus-linear" class="size-6" /></div><h2 class="mt-4 font-semibold text-foreground">สรุปการเพิ่มสมาชิก</h2><dl class="mt-5 space-y-4 text-sm"><div class="flex justify-between gap-3"><dt class="text-muted-foreground">ห้องเรียน</dt><dd class="text-right font-medium text-foreground">{{ className }}</dd></div><div class="flex justify-between gap-3"><dt class="text-muted-foreground">กลุ่มปลายทาง</dt><dd class="font-medium text-foreground">กลุ่ม {{ groupId }}</dd></div><div class="flex justify-between gap-3"><dt class="text-muted-foreground">เลือกแล้ว</dt><dd class="font-semibold text-primary">{{ selectedIds.length }} คน</dd></div></dl><button :disabled="!selectedIds.length" class="mt-7 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50" @click="save"><Icon icon="solar:check-circle-linear" class="size-5" /> ยืนยันเพิ่มเข้ากลุ่ม</button><button class="mt-2 w-full rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted" @click="router.push('/apps/class-groups')">ยกเลิก</button></aside>
  </div>
</template>
