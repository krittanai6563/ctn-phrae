<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import loader from '@monaco-editor/loader';
import * as monaco from 'monaco-editor';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import { allAssignments } from './assignmentData';
import { useAuthStore } from '@/stores/auth';
import { useSubmissionStore } from '@/stores/submissions';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const submissionStore = useSubmissionStore();
const assignment = computed(() => allAssignments.find((item) => item.id === route.params.id));
const selectedStudent = computed(() => {
  const studentId = route.query.studentId;
  if (!auth.isTeacher || typeof studentId !== 'string' || !assignment.value) return undefined;
  return (submissionStore.submissions[assignment.value.id] || []).find((student) => student.id === studentId);
});
const studentSubmission = computed(() => {
  if (!auth.isStudent || !assignment.value) return undefined;
  return (submissionStore.submissions[assignment.value.id] || []).find((submission) => submission.id === auth.user.id);
});
const isTeacherReview = computed(() => auth.isTeacher && typeof route.query.studentId === 'string');
const code = ref('#include <stdio.h>\n\nint main(void) {\n    printf("Hello, C!\\n");\n    return 0;\n}\n');
const stdin = ref('');
const isRunning = ref(false);
const selectedFiles = ref<File[]>([]);
const isReviewingCode = ref(false);
const reviewSubmitted = ref(false);
const aiReview = ref<{ score: number; summary: string; suggestions: string[]; compilePassed: boolean; runtimePassed: boolean; output: string } | null>(null);
const teacherScore = ref<number | null>(null);
const teacherFeedback = ref('');
const editorElement = ref<HTMLElement | null>(null);
const terminalElement = ref<HTMLElement | null>(null);
let editor: monaco.editor.IStandaloneCodeEditor | undefined;
let terminal: Terminal | undefined;
let fitAddon: FitAddon | undefined;
let completionDisposable: monaco.IDisposable | undefined;

const cKeywords = [
  'auto', 'break', 'case', 'const', 'continue', 'default', 'do', 'else', 'enum',
  'extern', 'for', 'goto', 'if', 'register', 'return', 'sizeof', 'static',
  'struct', 'switch', 'typedef', 'union', 'volatile', 'while', 'inline',
  'restrict', '_Bool', '_Complex', '_Imaginary', 'NULL', 'true', 'false',
];
const cTypes = ['void', 'char', 'short', 'int', 'long', 'long long', 'float', 'double', 'signed', 'unsigned'];
const cFunctions = [
  'printf', 'scanf', 'sprintf', 'snprintf', 'puts', 'putchar', 'getchar', 'fgets',
  'fopen', 'fclose', 'fread', 'fwrite', 'fprintf', 'fscanf', 'malloc', 'calloc',
  'realloc', 'free', 'memcpy', 'memset', 'strlen', 'strcpy', 'strncpy', 'strcmp',
  'strcat', 'strstr', 'atoi', 'atof', 'abs', 'rand', 'srand', 'time', 'sqrt',
  'pow', 'ceil', 'floor', 'round', 'sin', 'cos', 'tan', 'exit', 'assert',
];
const cHeaders = ['stdio.h', 'stdlib.h', 'string.h', 'stdbool.h', 'math.h', 'time.h', 'ctype.h', 'assert.h'];

const submissionModeLabel = computed(() => {
  if (assignment.value?.submissionMode === 'code') return 'เขียนโค้ดและแสดงผลรัน';
  if (assignment.value?.submissionMode === 'file') return 'แนบไฟล์';
  return 'เขียนโค้ดและแนบไฟล์';
});

const writeTerminal = (text: string, color = '\x1b[37m') => {
  terminal?.write(`${color}${text.replace(/\n/g, '\r\n')}\x1b[0m\r\n`);
};

const runCode = async () => {
  if (!code.value.trim() || isRunning.value) return;
  isRunning.value = true;
  terminal?.clear();
  terminal?.reset();
  writeTerminal('$ gcc main.c -o main && ./main', '\x1b[90m');
  writeTerminal('กำลังคอมไพล์และประมวลผล...', '\x1b[33m');

  try {
    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: 'c',
        version: '10.2.0',
        files: [{ name: 'main.c', content: code.value }],
        stdin: stdin.value,
      }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    const runResult = result.run || result.compile;
    if (runResult?.stdout) writeTerminal(runResult.stdout, '\x1b[32m');
    if (runResult?.stderr) writeTerminal(runResult.stderr, '\x1b[31m');
    if (result.compile?.stderr) writeTerminal(result.compile.stderr, '\x1b[31m');
    if (!runResult?.stdout && !runResult?.stderr && !result.compile?.stderr) writeTerminal('โปรแกรมทำงานเสร็จสิ้น (ไม่มี output)', '\x1b[32m');
  } catch (error) {
    writeTerminal(`ไม่สามารถรันโค้ดได้: ${error instanceof Error ? error.message : 'เกิดข้อผิดพลาด'}`, '\x1b[31m');
  } finally {
    isRunning.value = false;
  }
};

const setupCodeTools = async () => {
  if (!editorElement.value || !terminalElement.value || (assignment.value?.submissionMode !== 'code' && assignment.value?.submissionMode !== 'code-and-file')) return;
  const monacoInstance = await loader.init();
  editor = monacoInstance.editor.create(editorElement.value, {
    value: code.value,
    language: 'c',
    theme: 'vs-dark',
    readOnly: isTeacherReview.value,
    automaticLayout: true,
    minimap: { enabled: false },
    fontSize: 14,
    tabSize: 4,
    padding: { top: 14, bottom: 14 },
  });
  editor?.onDidChangeModelContent(() => { code.value = editor?.getValue() || ''; });
  completionDisposable = monacoInstance.languages.registerCompletionItemProvider('c', {
    triggerCharacters: ['#', '.', '>', ' '],
    provideCompletionItems: () => {
      const keywordSuggestions = cKeywords.map((label) => ({
        label,
        kind: monacoInstance.languages.CompletionItemKind.Keyword,
        insertText: label,
        detail: 'C keyword',
      }));
      const typeSuggestions = cTypes.map((label) => ({
        label,
        kind: monacoInstance.languages.CompletionItemKind.TypeParameter,
        insertText: label,
        detail: 'C data type',
      }));
      const functionSuggestions = cFunctions.map((label) => ({
        label,
        kind: monacoInstance.languages.CompletionItemKind.Function,
        insertText: label,
        detail: 'C standard library function',
      }));
      const headerSuggestions = cHeaders.map((label) => ({
        label,
        kind: monacoInstance.languages.CompletionItemKind.File,
        insertText: label,
        detail: 'C standard header',
      }));
      const snippets = [
        { label: 'main function', insertText: 'int main(void) {\n\t$0\n}', detail: 'โครงสร้างฟังก์ชัน main' },
        { label: 'if statement', insertText: 'if ($1) {\n\t$0\n}', detail: 'คำสั่งตรวจสอบเงื่อนไข' },
        { label: 'for loop', insertText: 'for (int i = 0; i < $1; i++) {\n\t$0\n}', detail: 'ลูป for' },
        { label: 'while loop', insertText: 'while ($1) {\n\t$0\n}', detail: 'ลูป while' },
        { label: 'printf statement', insertText: 'printf("$1\\n"$0);', detail: 'แสดงผลด้วย printf' },
        { label: 'scanf statement', insertText: 'scanf("$1", &$2);', detail: 'รับค่าด้วย scanf' },
      ].map((snippet) => ({
        ...snippet,
        kind: monacoInstance.languages.CompletionItemKind.Snippet,
        insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      }));
      return { suggestions: [...keywordSuggestions, ...typeSuggestions, ...functionSuggestions, ...headerSuggestions, ...snippets] };
    },
  });
  fitAddon = new FitAddon();
  terminal = new Terminal({ convertEol: true, cursorBlink: false, fontSize: 14, theme: { background: '#020617' } });
  terminal.loadAddon(fitAddon);
  terminal.open(terminalElement.value);
  await nextTick();
  fitAddon.fit();
  writeTerminal('พร้อมรันภาษา C ด้วย sandbox แล้ว', '\x1b[90m');
};

onMounted(() => { setupCodeTools(); });
onBeforeUnmount(() => {
  completionDisposable?.dispose();
  editor?.dispose();
  terminal?.dispose();
});

const handleFiles = (event: Event) => {
  const input = event.target as HTMLInputElement;
  selectedFiles.value = input.files ? Array.from(input.files) : [];
};

const reviewCodeWithAi = async () => {
  if (!code.value.trim() || isReviewingCode.value) return;
  isReviewingCode.value = true;
  let compilePassed = true;
  let runtimePassed = true;
  let executionOutput = '';
  const suggestions: string[] = [];
  let score = 100;
  try {
    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: 'c', version: '10.2.0', files: [{ name: 'main.c', content: code.value }], stdin: stdin.value }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    const compileError = result.compile?.stderr || '';
    const runtimeError = result.run?.stderr || '';
    executionOutput = result.run?.stdout || '';
    compilePassed = !compileError;
    runtimePassed = !runtimeError;
    if (compileError) { suggestions.push(`พบ compile error: ${compileError.split('\n')[0]}`); score -= 45; }
    if (runtimeError) { suggestions.push(`พบ runtime error: ${runtimeError.split('\n')[0]}`); score -= 25; }
  } catch {
    suggestions.push('ไม่สามารถเรียก sandbox เพื่อตรวจการทำงานจริงได้ ระบบจะวิเคราะห์จาก source code ต่อ');
    score -= 10;
  }
  if (!code.value.includes('#include <stdio.h>')) { suggestions.push('ควร include stdio.h สำหรับ printf หรือ scanf'); score -= 15; }
  if (!/int\s+main\s*\(/.test(code.value)) { suggestions.push('ยังไม่พบฟังก์ชัน main ซึ่งเป็นจุดเริ่มต้นของโปรแกรม C'); score -= 35; }
  if (code.value.includes('scanf(') && !code.value.includes('&')) { suggestions.push('ตรวจสอบการส่ง address ของตัวแปรให้ scanf เช่น scanf("%d", &number)'); score -= 15; }
  if (!code.value.includes('return 0;')) { suggestions.push('แนะนำให้คืนค่า 0 จาก main เมื่อโปรแกรมทำงานสำเร็จ'); score -= 5; }
  if (code.value.split('\n').length < 3) { suggestions.push('โค้ดสั้นมาก ควรตรวจว่าครบตามโจทย์และกรณีขอบเขตหรือไม่'); score -= 10; }
  if (!suggestions.length) suggestions.push('โค้ด compile และทำงานได้เบื้องต้น ควรทดสอบกรณีขอบเขตเพิ่มเติม');
  aiReview.value = {
    score: Math.max(0, Math.min(100, score)),
    summary: compilePassed && runtimePassed ? 'โค้ดผ่านการ compile และ run เบื้องต้น' : 'พบประเด็นที่ควรตรวจสอบก่อนให้คะแนน',
    suggestions,
    compilePassed,
    runtimePassed,
    output: executionOutput || 'ไม่มี output',
  };
  isReviewingCode.value = false;
};

const saveReview = () => {
  if (!assignment.value || !selectedStudent.value || !auth.isTeacher) return;
  submissionStore.reviewSubmission(assignment.value.id, selectedStudent.value.id, teacherScore.value, teacherFeedback.value);
  reviewSubmitted.value = true;
  alert(`ส่งคะแนน ${teacherScore.value ?? '-'} และ feedback ให้นักศึกษาเรียบร้อยแล้ว`);
};

const useAiScore = () => {
  if (aiReview.value && assignment.value) {
    teacherScore.value = Math.round((aiReview.value.score / 100) * assignment.value.points);
  }
};

const useAiFeedback = () => {
  if (aiReview.value) {
    teacherFeedback.value = `ผลตรวจ AI: ${aiReview.value.summary}\n- ${aiReview.value.suggestions.join('\n- ')}`;
  }
};

const submitAssignment = () => {
  if (!assignment.value || !auth.isStudent) return;
  submissionStore.saveStudentSubmission(assignment.value.id, auth.user.id, {
    code: code.value,
    fileNames: selectedFiles.value.map((file) => file.name),
  });
  alert('บันทึกข้อมูลการส่งงานเรียบร้อยแล้ว');
};

const goBack = () => router.push('/apps/assignments');
</script>

<template>
  <BaseBreadcrumb
    title="รายละเอียดงาน"
    :breadcrumbs="[
      { text: 'งานที่ได้รับมอบหมาย', href: '/apps/assignments' },
      { text: assignment?.title || 'รายละเอียดงาน', href: '#' }
    ]"
  />

  <div v-if="assignment" class="mx-auto grid max-w-7xl gap-6 pb-10 lg:grid-cols-2">
    <main class="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div class="border-b border-slate-100 bg-slate-50/70 p-6 dark:border-slate-800 dark:bg-slate-900/80 md:p-8">
        <button class="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-primary" @click="goBack">
          <Icon icon="solar:arrow-left-linear" class="size-5" /> กลับไปงานที่ได้รับมอบหมาย
        </button>
        <div class="flex flex-wrap items-center gap-3">
          <span class="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{{ assignment.type }}</span>
          <span class="text-sm text-slate-500">{{ assignment.chapterTitle }}</span>
        </div>
        <h1 class="mt-4 max-w-3xl text-2xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-3xl">{{ assignment.title }}</h1>
        <p class="mt-4 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">{{ assignment.description }}</p>
        <div v-if="selectedStudent" class="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-primary/20 bg-primary/[0.05] px-4 py-3 dark:bg-primary/10">
          <div class="flex items-center gap-2"><span class="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">{{ selectedStudent.name.charAt(0) }}</span><span class="text-sm font-medium text-slate-800 dark:text-slate-100">ใบงานของ {{ selectedStudent.name }}</span><span class="text-xs text-slate-500">{{ selectedStudent.studentId }}</span></div>
          <span :class="selectedStudent.status === 'ส่งแล้ว' ? 'text-emerald-600' : selectedStudent.status === 'ยังไม่ส่ง' ? 'text-amber-600' : 'text-slate-500'" class="text-xs font-medium">{{ selectedStudent.status }}</span>
          <span v-if="selectedStudent.score !== undefined" class="text-xs text-slate-500">คะแนน {{ selectedStudent.score }}/{{ assignment.points }}</span>
        </div>
        <div v-if="studentSubmission && !isTeacherReview" class="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/[0.05] px-4 py-3 dark:bg-primary/10"><div><p class="text-xs text-slate-500">สถานะการส่งงานของฉัน</p><p class="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">{{ studentSubmission.status }}<span v-if="studentSubmission.submittedAt" class="ml-2 text-xs font-normal text-slate-500">{{ studentSubmission.submittedAt }}</span></p><p v-if="studentSubmission.note" class="mt-1 text-xs text-slate-500">Feedback: {{ studentSubmission.note }}</p></div><span v-if="studentSubmission.score !== undefined" class="text-sm font-semibold text-primary">{{ studentSubmission.score }}/{{ assignment.points }} คะแนน</span></div>
        <div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div class="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800/70">
            <p class="text-xs text-slate-500">กำหนดส่ง</p>
            <p class="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">{{ assignment.due }}</p>
          </div>
          <div class="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800/70">
            <p class="text-xs text-slate-500">คะแนนเต็ม</p>
            <p class="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">{{ assignment.points }} คะแนน</p>
          </div>
          <div class="col-span-2 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800/70 sm:col-span-1">
            <p class="text-xs text-slate-500">รูปแบบการส่ง</p>
            <p class="mt-1 truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{{ submissionModeLabel }}</p>
          </div>
        </div>
      </div>

      <div class="p-6 md:p-8">

      <section>
        <h2 class="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white"><Icon icon="solar:list-check-linear" class="size-5 text-primary" /> สิ่งที่ต้องทำ</h2>
        <ol class="mt-4 space-y-3">
          <li v-for="(instruction, index) in assignment.instructions" :key="instruction" class="flex gap-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            <span class="flex size-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{{ index + 1 }}</span>
            {{ instruction }}
          </li>
        </ol>
      </section>

      <section class="mt-8">
        <h2 class="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white"><Icon icon="solar:folder-with-files-linear" class="size-5 text-primary" /> ไฟล์ที่ต้องส่ง</h2>
        <ul class="mt-4 space-y-3">
          <li v-for="deliverable in assignment.deliverables" :key="deliverable" class="flex items-center gap-3 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
            <Icon icon="solar:check-circle-linear" class="size-5 text-emerald-500" /> {{ deliverable }}
          </li>
        </ul>
      </section>

      <section v-if="assignment.submissionMode === 'code' || assignment.submissionMode === 'code-and-file'" class="mt-8 rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-800/40">
        <h2 class="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white"><Icon icon="solar:flask-linear" class="size-5 text-primary" /> ข้อมูลทดสอบ (Test case)</h2>
        <p class="mt-1 text-xs leading-5 text-slate-500">กรอกค่าที่ต้องการส่งเข้าโปรแกรม โดยแต่ละบรรทัดจะถูกส่งให้โปรแกรมผ่าน stdin</p>
        <textarea id="program-input" v-model="stdin" rows="4" spellcheck="false" placeholder="เช่น\n10 20" class="mt-3 w-full resize-y rounded-lg border border-slate-300 bg-white p-3 font-mono text-sm text-slate-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
      </section>

      </div>
    </main>

    <section class="h-fit lg:sticky lg:top-6">
      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="border-b border-slate-100 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-900/80">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div class="flex items-center gap-2"><p class="text-xs font-medium uppercase tracking-wide text-primary">{{ isTeacherReview ? 'Review workspace' : 'Workspace' }}</p><span v-if="isTeacherReview" class="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">อาจารย์</span></div>
            <h2 class="mt-1 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white"><Icon :icon="isTeacherReview ? 'solar:checklist-minimalistic-linear' : 'solar:pen-new-square-linear'" class="size-5 text-primary" /> {{ isTeacherReview ? 'ตรวจและประเมินงาน' : 'พื้นที่ทำแบบฝึกหัด' }}</h2>
            <p class="mt-1 text-xs text-slate-500">{{ isTeacherReview ? 'โค้ดอยู่ในโหมดอ่านอย่างเดียว แก้ไขได้เฉพาะคะแนนและ Feedback' : 'เขียนโค้ด ทดลองรัน และเตรียมไฟล์ส่งงาน' }}</p>
          </div>
          <span class="rounded-full bg-white px-3 py-1 text-xs font-medium text-primary shadow-sm dark:bg-slate-900">{{ assignment.submissionMode === 'code' ? 'Code' : assignment.submissionMode === 'file' ? 'File' : 'Code + File' }}</span>
        </div>
        </div>

        <div class="p-4 md:p-5">
        <div v-if="assignment.submissionMode === 'code' || assignment.submissionMode === 'code-and-file'" class="space-y-4">
            <div>
              <label for="code-editor" class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">พื้นที่เขียนโค้ด</label>
              <div id="code-editor" ref="editorElement" class="h-[310px] overflow-hidden rounded-xl border border-slate-700 shadow-sm" />
            </div>
            <div>
              <div class="mb-2 flex items-center justify-between">
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-200">ผลการรันโค้ด</label>
                <button :disabled="isRunning" class="inline-flex items-center gap-1.5 rounded-md bg-slate-800 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60" @click="runCode"><Icon icon="solar:play-linear" class="size-4" /> {{ isRunning ? 'กำลังรัน...' : 'รันโค้ด' }}</button>
              </div>
              <div ref="terminalElement" class="h-[310px] overflow-hidden rounded-xl bg-slate-950 p-2 shadow-sm" />
            </div>
        </div>

        <div v-if="!isTeacherReview && (assignment.submissionMode === 'file' || assignment.submissionMode === 'code-and-file')" class="mt-5 rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-700 dark:bg-slate-800/40">
          <div class="mb-3 flex items-center justify-between gap-3">
            <div>
              <label for="assignment-files" class="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200"><Icon icon="solar:paperclip-2-linear" class="size-5 text-primary" /> ไฟล์ประกอบการส่งงาน</label>
              <p class="mt-1 text-xs text-slate-500">PDF, Word, รูปภาพ และวิดีโอ</p>
            </div>
            <span class="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-500 shadow-sm dark:bg-slate-900">{{ selectedFiles.length }} ไฟล์</span>
          </div>
          <label for="assignment-files" class="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-white px-6 py-7 text-center transition hover:border-primary hover:bg-primary/[0.03] dark:border-slate-700 dark:bg-slate-900/70">
            <span class="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary"><Icon icon="solar:cloud-upload-linear" class="size-6" /></span>
            <span class="mt-3 text-sm font-medium text-slate-700 dark:text-slate-200">คลิกเพื่อเลือกไฟล์</span>
            <span class="mt-1 text-xs text-slate-500">เลือกได้หลายไฟล์ สูงสุดตามที่กำหนด</span>
            <input id="assignment-files" type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4,.mov,.webm" class="hidden" @change="handleFiles" />
          </label>
          <ul v-if="selectedFiles.length" class="mt-3 space-y-2">
            <li v-for="file in selectedFiles" :key="file.name" class="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              <span class="flex min-w-0 items-center gap-2"><Icon icon="solar:file-text-linear" class="size-4 shrink-0 text-primary" /><span class="truncate">{{ file.name }}</span></span>
              <span class="shrink-0 text-xs text-slate-400">{{ Math.max(1, Math.round(file.size / 1024)) }} KB</span>
            </li>
          </ul>
        </div>

        <section class="mt-5 rounded-xl border border-primary/20 bg-primary/[0.04] p-4 dark:bg-primary/10">
          <div class="flex flex-col gap-4">
            <div>
              <div class="flex items-center justify-between gap-3"><h3 class="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white"><Icon icon="solar:stars-minimalistic-linear" class="size-5 text-primary" /> AI ตรวจสอบโค้ด</h3><span class="text-[11px] text-slate-500">ช่วยวิเคราะห์ ไม่แทนการตัดสินของอาจารย์</span></div>
              <p class="mt-1 text-xs leading-5 text-slate-500">วิเคราะห์โครงสร้างเบื้องต้นเพื่อช่วยตรวจงานก่อนให้คะแนน</p>
            </div>
            <button v-if="assignment.submissionMode === 'code' || assignment.submissionMode === 'code-and-file'" :disabled="isReviewingCode" class="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-xs font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit" @click="reviewCodeWithAi"><Icon icon="solar:magic-stick-3-linear" class="size-4" /> {{ isReviewingCode ? 'กำลังตรวจ...' : 'ตรวจโค้ดด้วย AI' }}</button>
            <span v-else class="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-500 dark:bg-slate-800">ใช้ AI ตรวจไฟล์ได้ภายหลัง</span>
          </div>

          <div v-if="aiReview" class="mt-4 rounded-lg border border-white/70 bg-white/80 p-3 dark:border-slate-700 dark:bg-slate-900/60">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0"><p class="text-sm font-medium text-slate-800 dark:text-slate-100">{{ aiReview.summary }}</p><div class="mt-2 flex flex-wrap gap-2 text-[11px]"><span :class="aiReview.compilePassed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'" class="rounded-full px-2 py-1">Compile {{ aiReview.compilePassed ? 'ผ่าน' : 'ไม่ผ่าน' }}</span><span :class="aiReview.runtimePassed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'" class="rounded-full px-2 py-1">Run {{ aiReview.runtimePassed ? 'ผ่าน' : 'มีปัญหา' }}</span></div><ul class="mt-2 space-y-1"><li v-for="suggestion in aiReview.suggestions" :key="suggestion" class="flex gap-2 text-xs leading-5 text-slate-500"><Icon icon="solar:lightbulb-linear" class="mt-0.5 size-4 shrink-0 text-amber-500" />{{ suggestion }}</li></ul><pre class="mt-3 max-h-24 overflow-auto rounded-lg bg-slate-950 p-2 text-[11px] leading-5 text-emerald-300">{{ aiReview.output }}</pre></div>
              <div class="flex shrink-0 flex-col items-center gap-2"><span class="rounded-lg bg-emerald-100 px-3 py-2 text-center dark:bg-emerald-950/40"><strong class="block text-lg text-emerald-600">{{ Math.round((aiReview.score / 100) * assignment.points) }}/{{ assignment.points }}</strong><span class="text-[10px] text-emerald-700 dark:text-emerald-300">คะแนนแนะนำ</span></span><button v-if="isTeacherReview" class="text-[11px] font-medium text-primary hover:underline" @click="useAiScore">ใช้คะแนนนี้</button></div>
            </div>
          </div>

          <div v-if="isTeacherReview" class="mt-4 rounded-lg border border-slate-200 bg-white/70 p-3 dark:border-slate-700 dark:bg-slate-900/50">
            <p class="mb-3 text-xs font-medium text-primary">โหมดตรวจงานอาจารย์</p>
            <div class="grid gap-3 sm:grid-cols-[120px_minmax(0,1fr)]">
            <label class="block"><span class="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">คะแนนผู้สอน</span><div class="relative"><input v-model.number="teacherScore" type="number" min="0" :max="assignment.points" placeholder="-" class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-12 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" /><span class="pointer-events-none absolute right-3 top-2.5 text-xs text-slate-400">/{{ assignment.points }}</span></div></label>
            <label class="block"><span class="mb-1.5 flex items-center justify-between gap-2 text-xs font-medium text-slate-600 dark:text-slate-300"><span>Feedback</span><button v-if="aiReview" type="button" class="font-medium text-primary hover:underline" @click="useAiFeedback">ใช้คำแนะนำ AI</button></span><textarea v-model="teacherFeedback" rows="3" placeholder="เขียนข้อเสนอแนะให้นักศึกษา..." class="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" /></label>
            </div>
            <button class="mt-3 inline-flex items-center gap-2 rounded-lg border border-primary/30 px-3 py-2 text-xs font-medium text-primary transition hover:bg-primary/10" @click="saveReview"><Icon icon="solar:notes-linear" class="size-4" /> {{ reviewSubmitted ? 'ส่งคะแนนและ Feedback แล้ว' : 'ส่งคะแนนและ Feedback' }}</button>
          </div>
        </section>

          <template v-if="!isTeacherReview">
            <button class="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white transition hover:opacity-90" @click="submitAssignment"><Icon icon="solar:check-circle-linear" class="size-5" /> บันทึกและส่งงาน</button>
            <p class="mt-3 text-center text-xs leading-5 text-slate-500">สามารถแก้ไขและส่งงานใหม่ได้ก่อนถึงกำหนดส่ง</p>
          </template>
          <p v-else class="mt-5 text-center text-xs leading-5 text-slate-500">อาจารย์สามารถแก้ไขคะแนนและส่ง Feedback ได้เท่านั้น</p>
        </div>
      </div>
    </section>
  </div>

  <div v-else class="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
    <Icon icon="solar:document-broken-linear" class="mx-auto size-12 text-slate-400" />
    <h1 class="mt-4 text-xl font-semibold text-slate-900 dark:text-white">ไม่พบงานที่ต้องการ</h1>
    <button class="mt-5 text-sm font-medium text-primary hover:underline" @click="goBack">กลับไปดูงานทั้งหมด</button>
  </div>
</template>
