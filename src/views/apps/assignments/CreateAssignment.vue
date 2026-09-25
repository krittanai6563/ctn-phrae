<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';

const router = useRouter();
const contentType = ref<'assignment' | 'quiz'>('assignment');
const submissionMode = ref<'code' | 'file' | 'code-and-file'>('code');
const title = ref('');
const chapter = ref('บทที่ 1: หลักการเขียนโปรแกรม');
const dueDate = ref('');
const points = ref(20);
const description = ref('');
const selectedGroups = ref(['ปวช.2/1']);
const audienceMode = ref<'all' | 'groups' | 'randomized'>('all');
const variantCount = ref(3);
const groups = ['กลุ่ม A', 'กลุ่ม B', 'กลุ่ม C'];
const publishNow = ref(true);
const publishMode = ref<'now' | 'scheduled'>('now');
const publishAt = ref('');
const hideAfterDue = ref(false);
const allowLateSubmission = ref(true);
const questions = ref([
  { text: '', points: 5, options: ['', '', '', ''], answer: 0 },
]);

const isQuiz = computed(() => contentType.value === 'quiz');
const typeLabel = computed(() => isQuiz.value ? 'ข้อสอบ / แบบทดสอบ' : 'งานที่ได้รับมอบหมาย');

const addQuestion = () => questions.value.push({ text: '', points: 5, options: ['', '', '', ''], answer: 0 });
const removeQuestion = (index: number) => {
  if (questions.value.length > 1) questions.value.splice(index, 1);
};
const toggleGroup = (group: string) => {
  selectedGroups.value = selectedGroups.value.includes(group)
    ? selectedGroups.value.filter((item) => item !== group)
    : [...selectedGroups.value, group];
};
const manageGroups = () => router.push('/apps/class-groups');
const saveContent = () => {
  if (!title.value.trim()) {
    alert(`กรุณากรอกชื่อ${isQuiz.value ? 'ข้อสอบ' : 'งาน'}`);
    return;
  }
  if (publishMode.value === 'scheduled' && !publishAt.value) {
    alert('กรุณากำหนดเวลาเผยแพร่');
    return;
  }
  alert(`${publishMode.value === 'scheduled' ? 'ตั้งเวลาเผยแพร่' : publishNow.value ? 'เผยแพร่' : 'บันทึกร่าง'}${typeLabel.value}เรียบร้อยแล้ว`);
  router.push('/apps/assignments');
};
</script>

<template>
  <BaseBreadcrumb
    :title="`สร้าง${typeLabel}`"
    :breadcrumbs="[
      { text: 'งานที่ได้รับมอบหมาย', href: '/apps/assignments' },
      { text: `สร้าง${typeLabel}`, href: '#' }
    ]"
  />

  <div class="mx-auto grid max-w-6xl gap-6 pb-10 lg:grid-cols-[minmax(0,1fr)_300px]">
    <main class="rounded-lg border border-ld bg-card p-6 md:p-8">
      <div class="flex items-start justify-between gap-4 border-b border-border pb-6">
        <div><p class="text-sm font-medium text-primary">สร้างเนื้อหาใหม่</p><h1 class="mt-1 text-2xl font-semibold text-foreground">{{ typeLabel }}</h1><p class="mt-2 text-sm text-muted-foreground">กำหนดรายละเอียดและผู้เรียนที่จะได้รับเนื้อหานี้</p></div>
        <button class="rounded-lg p-2 text-muted-foreground hover:bg-muted" aria-label="ปิด" @click="router.push('/apps/assignments')"><Icon icon="solar:close-circle-linear" class="size-6" /></button>
      </div>

      <div class="mt-6 grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
        <button :class="contentType === 'assignment' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground'" class="rounded-md px-4 py-3 text-sm font-medium transition" @click="contentType = 'assignment'">งานที่ได้รับมอบหมาย</button>
        <button :class="contentType === 'quiz' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground'" class="rounded-md px-4 py-3 text-sm font-medium transition" @click="contentType = 'quiz'">ข้อสอบ / แบบทดสอบ</button>
      </div>

      <div class="mt-6 space-y-5">
        <label class="block"><span class="mb-2 block text-sm font-medium text-foreground">ชื่อ{{ isQuiz ? 'ข้อสอบ' : 'งาน' }} <span class="text-rose-500">*</span></span><input v-model="title" type="text" :placeholder="isQuiz ? 'เช่น แบบทดสอบบทที่ 1' : 'เช่น แบบฝึกหัดการคำนวณพื้นฐาน'" class="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>
        <label class="block"><span class="mb-2 block text-sm font-medium text-foreground">คำอธิบาย</span><textarea v-model="description" rows="4" placeholder="อธิบายโจทย์ จุดประสงค์ หรือคำแนะนำให้นักเรียน" class="w-full resize-y rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>
        <div class="grid gap-4 sm:grid-cols-3">
          <label class="block"><span class="mb-2 block text-sm font-medium text-foreground">บทเรียน</span><select v-model="chapter" class="w-full rounded-lg border border-input bg-background px-3 py-3 text-sm outline-none focus:border-primary"><option>บทที่ 1: หลักการเขียนโปรแกรม</option><option>บทที่ 2: ตัวแปรและชนิดข้อมูล</option><option>บทที่ 3: คำสั่งควบคุมการทำงาน</option></select></label>
          <label class="block"><span class="mb-2 block text-sm font-medium text-foreground">กำหนดส่ง</span><input v-model="dueDate" type="datetime-local" class="w-full rounded-lg border border-input bg-background px-3 py-3 text-sm outline-none focus:border-primary" /></label>
          <label class="block"><span class="mb-2 block text-sm font-medium text-foreground">คะแนนเต็ม</span><input v-model.number="points" type="number" min="1" class="w-full rounded-lg border border-input bg-background px-3 py-3 text-sm outline-none focus:border-primary" /></label>
        </div>

        <section v-if="!isQuiz" class="rounded-lg border border-border bg-muted/40 p-4"><h2 class="text-sm font-semibold text-foreground">รูปแบบการส่งงาน</h2><div class="mt-3 grid gap-2 sm:grid-cols-3"><button v-for="mode in [{ id: 'code', label: 'เขียนโค้ด + รัน' }, { id: 'file', label: 'แนบไฟล์' }, { id: 'code-and-file', label: 'โค้ด + ไฟล์' }]" :key="mode.id" :class="submissionMode === mode.id ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground'" class="rounded-lg border p-3 text-left text-xs font-medium" @click="submissionMode = mode.id as typeof submissionMode">{{ mode.label }}</button></div></section>

        <section v-else class="rounded-lg border border-border bg-muted/40 p-4"><div class="flex items-center justify-between gap-3"><div><h2 class="text-sm font-semibold text-foreground">คำถามในข้อสอบ</h2><p class="mt-1 text-xs text-muted-foreground">เพิ่มคำถามแบบเลือกตอบและกำหนดคำตอบที่ถูกต้อง</p></div><button class="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline" @click="addQuestion"><Icon icon="solar:add-circle-linear" class="size-4" /> เพิ่มคำถาม</button></div><div class="mt-4 space-y-4"><article v-for="(question, index) in questions" :key="index" class="rounded-lg border border-border bg-card p-4"><div class="flex items-center justify-between gap-3"><span class="text-xs font-semibold text-primary">คำถามที่ {{ index + 1 }}</span><button v-if="questions.length > 1" class="text-xs text-rose-500 hover:underline" @click="removeQuestion(index)">ลบคำถาม</button></div><textarea v-model="question.text" rows="2" placeholder="พิมพ์คำถาม" class="mt-3 w-full resize-y rounded-lg border border-input bg-background p-3 text-sm outline-none focus:border-primary" /><div class="mt-3 grid gap-2 sm:grid-cols-2"><label v-for="(_, optionIndex) in question.options" :key="optionIndex" class="flex items-center gap-2 rounded-lg border border-input bg-background p-2"><input v-model="question.answer" type="radio" :name="`answer-${index}`" :value="optionIndex" class="accent-primary" /><input v-model="question.options[optionIndex]" type="text" :placeholder="`ตัวเลือก ${optionIndex + 1}`" class="min-w-0 flex-1 bg-transparent text-sm outline-none" /></label></div></article></div></section>
      </div>
    </main>

    <aside class="h-fit space-y-4 lg:sticky lg:top-6">
      <section class="rounded-lg border border-ld bg-card p-5">
        <div class="flex items-start justify-between gap-3"><div><h2 class="text-sm font-semibold text-foreground">มอบหมายให้</h2><p class="mt-1 text-xs text-muted-foreground">กำหนดผู้รับ{{ isQuiz ? 'ข้อสอบ' : 'งาน' }}และรูปแบบชุดข้อมูล</p></div><button class="text-xs font-medium text-primary hover:underline" @click="manageGroups">จัดการกลุ่ม</button></div>
        <div class="mt-4 space-y-2">
          <label :class="audienceMode === 'all' ? 'border-primary bg-primary/5' : 'border-border'" class="flex cursor-pointer items-start gap-3 rounded-lg border p-3"><input v-model="audienceMode" value="all" type="radio" class="mt-0.5 size-4 accent-primary" /><span><span class="block text-sm font-medium text-foreground">ทั้งห้อง</span><span class="mt-1 block text-xs text-muted-foreground">นักเรียนทุกคนได้รับโจทย์หรือข้อสอบเหมือนกัน</span></span></label>
          <label :class="audienceMode === 'groups' ? 'border-primary bg-primary/5' : 'border-border'" class="flex cursor-pointer items-start gap-3 rounded-lg border p-3"><input v-model="audienceMode" value="groups" type="radio" class="mt-0.5 size-4 accent-primary" /><span><span class="block text-sm font-medium text-foreground">เลือกตามกลุ่ม</span><span class="mt-1 block text-xs text-muted-foreground">มอบหมายให้เฉพาะกลุ่ม A, B หรือ C</span></span></label>
          <label :class="audienceMode === 'randomized' ? 'border-primary bg-primary/5' : 'border-border'" class="flex cursor-pointer items-start gap-3 rounded-lg border p-3"><input v-model="audienceMode" value="randomized" type="radio" class="mt-0.5 size-4 accent-primary" /><span><span class="block text-sm font-medium text-foreground">สุ่มชุดโจทย์</span><span class="mt-1 block text-xs text-muted-foreground">นักเรียนแต่ละคนจะได้รับชุดข้อสอบหรือข้อมูลต่างกัน</span></span></label>
        </div>
        <div v-if="audienceMode === 'groups'" class="mt-3 space-y-2 border-t border-border pt-3"><label v-for="group in groups" :key="group" class="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 text-sm text-foreground"><input type="checkbox" :checked="selectedGroups.includes(group)" class="size-4 accent-primary" @change="toggleGroup(group)" />{{ group }}<span class="ml-auto text-xs text-muted-foreground">10 คน</span></label></div>
        <div v-if="audienceMode === 'randomized'" class="mt-3 rounded-lg border border-primary/20 bg-primary/5 p-3"><label class="block text-xs font-medium text-foreground">จำนวนชุดโจทย์</label><input v-model.number="variantCount" type="number" min="2" max="20" class="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" /><p class="mt-2 text-xs leading-5 text-muted-foreground">ระบบจะกระจายชุดโจทย์ให้ผู้เรียนอัตโนมัติ โดยแต่ละคนจะเห็นเพียงชุดของตัวเอง</p></div>
      </section>
      <section class="rounded-lg border border-ld bg-card p-5">
        <h2 class="text-sm font-semibold text-foreground">การมองเห็นและเวลา</h2>
        <div class="mt-4 space-y-2">
          <label :class="publishMode === 'now' ? 'border-primary bg-primary/5' : 'border-border'" class="flex cursor-pointer items-start gap-3 rounded-lg border p-3"><input v-model="publishMode" value="now" type="radio" class="mt-0.5 size-4 accent-primary" /><span><span class="block text-sm font-medium text-foreground">เผยแพร่ทันที</span><span class="mt-1 block text-xs leading-5 text-muted-foreground">นักเรียนเห็นงานทันทีหลังเผยแพร่</span></span></label>
          <label :class="publishMode === 'scheduled' ? 'border-primary bg-primary/5' : 'border-border'" class="flex cursor-pointer items-start gap-3 rounded-lg border p-3"><input v-model="publishMode" value="scheduled" type="radio" class="mt-0.5 size-4 accent-primary" /><span><span class="block text-sm font-medium text-foreground">ตั้งเวลาเผยแพร่</span><span class="mt-1 block text-xs leading-5 text-muted-foreground">งานจะแสดงให้นักเรียนเห็นตามเวลาที่กำหนด</span></span></label>
        </div>
        <label v-if="publishMode === 'scheduled'" class="mt-4 block"><span class="mb-2 block text-xs font-medium text-foreground">เริ่มเผยแพร่วันที่และเวลา</span><input v-model="publishAt" type="datetime-local" class="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" /></label>
        <div class="mt-4 space-y-3 border-t border-border pt-4"><label class="flex items-start gap-3"><input v-model="hideAfterDue" type="checkbox" class="mt-0.5 size-4 accent-primary" /><span><span class="block text-sm font-medium text-foreground">ซ่อนงานหลังหมดกำหนดส่ง</span><span class="mt-1 block text-xs leading-5 text-muted-foreground">นักเรียนจะไม่เห็นงานหลังวันเวลาที่กำหนด</span></span></label><label class="flex items-start gap-3"><input v-model="allowLateSubmission" type="checkbox" class="mt-0.5 size-4 accent-primary" /><span><span class="block text-sm font-medium text-foreground">อนุญาตให้ส่งล่าช้า</span><span class="mt-1 block text-xs leading-5 text-muted-foreground">ระบบจะแสดงสถานะส่งล่าช้าให้อาจารย์ตรวจสอบ</span></span></label></div>
        <button class="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white hover:opacity-90" @click="saveContent"><Icon icon="solar:diskette-linear" class="size-5" /> {{ publishMode === 'scheduled' ? 'ตั้งเวลาและบันทึก' : publishNow ? 'สร้างและเผยแพร่' : 'บันทึกเป็นร่าง' }}</button><button class="mt-2 w-full rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted" @click="router.push('/apps/assignments')">ยกเลิก</button>
      </section>
    </aside>
  </div>
</template>
