export interface Assignment {
  id: string;
  title: string;
  type: string;
  submissionMode: 'code' | 'file' | 'code-and-file';
  description: string;
  due: string;
  points: number;
  status: string;
  instructions: string[];
  deliverables: string[];
}

export interface AssignmentChapter {
  id: string;
  title: string;
  summary: string;
  assignments: Assignment[];
}

export interface AssignmentCourse {
  id: string;
  title: string;
  code: string;
  instructor: string;
  summary: string;
  chapters: AssignmentChapter[];
}

export interface StudentSubmission {
  id: string;
  name: string;
  studentId: string;
  status: 'ส่งแล้ว' | 'ยังไม่ส่ง' | 'รอดำเนินการ';
  submittedAt?: string;
  score?: number;
  fileName?: string;
  note?: string;
}

export const assignmentChapters: AssignmentChapter[] = [
  {
    id: 'chapter-1',
    title: 'บทที่ 1: หลักการเขียนโปรแกรม',
    summary: 'ทำความเข้าใจแนวคิดพื้นฐานและลำดับการทำงานของโปรแกรม',
    assignments: [
      {
        id: 'assignment-1',
        title: 'แบบฝึกหัด 1: การคำนวณพื้นฐาน',
        type: 'แบบฝึกหัด',
        submissionMode: 'code',
        description: 'เขียนโปรแกรมรับตัวเลขสองจำนวน แล้วแสดงผลบวก ลบ คูณ และหาร',
        due: '15 ก.ย. 2569, 23:59 น.',
        points: 20,
        status: 'ยังไม่ส่ง',
        instructions: ['รับค่าตัวเลขจำนวนเต็ม 2 ค่า', 'คำนวณผลลัพธ์ทั้ง 4 รูปแบบ', 'แสดงผลลัพธ์ให้อ่านง่ายและตรวจสอบการหารด้วยศูนย์'],
        deliverables: ['ไฟล์ source code นามสกุล .c', 'ภาพหน้าจอผลลัพธ์การทำงาน']
      }
    ]
  },
  {
    id: 'chapter-2',
    title: 'บทที่ 2: ตัวแปรและชนิดข้อมูล',
    summary: 'ฝึกใช้ตัวแปร ชนิดข้อมูล และการรับค่าจากผู้ใช้',
    assignments: [
      {
        id: 'assignment-2',
        title: 'แบบฝึกหัด 2: โปรแกรมตัดสินใจ',
        type: 'ทดสอบ',
        submissionMode: 'file',
        description: 'สร้างโปรแกรมคำนวณเกรดจากคะแนนสอบ และแสดงผลระดับผลการเรียน',
        due: '22 ก.ย. 2569, 23:59 น.',
        points: 25,
        status: 'ยังไม่ส่ง',
        instructions: ['รับคะแนนระหว่าง 0 ถึง 100', 'ใช้คำสั่ง if หรือ switch เพื่อแบ่งช่วงคะแนน', 'แสดงเกรดและข้อความแนะนำผลการเรียน'],
        deliverables: ['ไฟล์ source code นามสกุล .c', 'สรุปขั้นตอนการทำงานไม่เกิน 1 หน้า']
      },
      {
        id: 'assignment-3',
        title: 'ใบงาน: แปลงหน่วยอุณหภูมิ',
        type: 'ใบงาน',
        submissionMode: 'code-and-file',
        description: 'เขียนโปรแกรมแปลงค่าองศาเซลเซียสเป็นฟาเรนไฮต์และเคลวิน',
        due: '25 ก.ย. 2569, 23:59 น.',
        points: 15,
        status: 'ส่งแล้ว',
        instructions: ['รับค่าอุณหภูมิเป็นทศนิยม', 'ใช้สูตรแปลงหน่วยให้ถูกต้อง', 'จัดรูปแบบทศนิยมให้แสดง 2 ตำแหน่ง'],
        deliverables: ['ไฟล์ source code นามสกุล .c']
      }
    ]
  },
  {
    id: 'chapter-3',
    title: 'บทที่ 3: คำสั่งควบคุมการทำงาน',
    summary: 'ประยุกต์ใช้เงื่อนไขและการทำซ้ำเพื่อแก้โจทย์ปัญหา',
    assignments: [
      {
        id: 'assignment-4',
        title: 'โครงงานย่อย: โปรแกรมคำนวณค่าเฉลี่ย',
        type: 'โปรเจกต์',
        submissionMode: 'code-and-file',
        description: 'สร้างโปรแกรมรับคะแนนหลายรายการและสรุปค่าเฉลี่ย พร้อมบอกคะแนนสูงสุดและต่ำสุด',
        due: '30 ก.ย. 2569, 23:59 น.',
        points: 30,
        status: 'รอทำ',
        instructions: ['รับจำนวนคะแนนที่ต้องการประมวลผล', 'ใช้ loop เพื่อรับคะแนนและคำนวณผลรวม', 'สรุปค่าเฉลี่ย คะแนนสูงสุด และคะแนนต่ำสุด'],
        deliverables: ['ไฟล์ source code นามสกุล .c', 'เอกสารอธิบายแนวคิดและตัวอย่างผลลัพธ์']
      }
    ]
  }
];

export const assignmentCourses: AssignmentCourse[] = [
  {
    id: 'course-c-year-1',
    title: 'ภาษา C พื้นฐาน สำหรับ ปวช.1',
    code: 'C-ปวช.1-2569',
    instructor: 'อาจารย์ สมชาย ใจดี',
    summary: 'เรียนรู้พื้นฐานภาษา C ตัวแปร ชนิดข้อมูล การรับค่า และการแสดงผล เหมาะสำหรับผู้เริ่มต้น',
    chapters: assignmentChapters,
  },
  {
    id: 'course-c-year-2',
    title: 'การเขียนโปรแกรมภาษา C สำหรับ ปวช.2',
    code: 'C-ปวช.2-2569',
    instructor: 'อาจารย์สุภาวดี แสงทอง',
    summary: 'ฝึกใช้เงื่อนไข การทำซ้ำ ฟังก์ชัน และการแก้โจทย์ปัญหาด้วยภาษา C',
    chapters: assignmentChapters,
  },
  {
    id: 'course-c-year-3',
    title: 'โครงสร้างข้อมูลด้วยภาษา C สำหรับ ปวช.3',
    code: 'C-ปวช.3-2569',
    instructor: 'อาจารย์กิตติศักดิ์ วัฒนกุล',
    summary: 'ประยุกต์ใช้ Array, Pointer, Struct และการจัดการข้อมูลเพื่อสร้างโปรแกรมที่เป็นระบบ',
    chapters: assignmentChapters,
  },
  {
    id: 'course-c-advanced',
    title: 'การพัฒนาโปรแกรมภาษา C ขั้นสูง',
    code: 'C-ปวส.1-2569',
    instructor: 'อาจารย์วิภา แสงมณี',
    summary: 'พัฒนาโปรแกรมภาษา C ขั้นสูงด้วย Pointer, File I/O และการแบ่งโมดูลของโปรแกรม',
    chapters: assignmentChapters,
  },
];

export const allAssignments = assignmentChapters.flatMap((chapter) =>
  chapter.assignments.map((assignment) => ({ ...assignment, chapterTitle: chapter.title }))
);

const students = [
  ['student-1', 'กนกพร มั่นคง', '6501001'],
  ['student-2', 'กิตติศักดิ์ บัวทอง', '6501002'],
  ['student-3', 'ธนกฤต คงดี', '6501003'],
  ['student-4', 'พิมพ์ชนก ใจดี', '6501004'],
  ['student-5', 'ณัฐพล แก้วใส', '6501005'],
  ['student-6', 'ชลธิชา วัฒนกุล', '6501006'],
  ['student-7', 'ภัทรพล ศรีสุข', '6501007'],
  ['student-8', 'รินรดา พรหมรักษา', '6501008'],
  ['student-9', 'วรากร ทองดี', '6501009'],
  ['student-10', 'สุภาวดี คำแสน', '6501010'],
  ['student-11', 'ณัฐวุฒิ อินทร์แก้ว', '6501011'],
  ['student-12', 'กัญญารัตน์ มีสุข', '6501012'],
  ['student-13', 'พีรพัฒน์ จันทร์หอม', '6501013'],
  ['student-14', 'อรทัย แสงทอง', '6501014'],
  ['student-15', 'ศุภกร บุญช่วย', '6501015'],
  ['student-16', 'มินตรา ชูศรี', '6501016'],
  ['student-17', 'ธีรภัทร์ วงศ์ดี', '6501017'],
  ['student-18', 'ปวีณา รัตนมณี', '6501018'],
  ['student-19', 'ศรัณย์ พูลผล', '6501019'],
  ['student-20', 'นภัสสร คงมั่น', '6501020'],
  ['student-21', 'ชัยวัฒน์ แก้วมณี', '6501021'],
  ['student-22', 'สิริกานต์ ทองอยู่', '6501022'],
  ['student-23', 'ภาคภูมิ นาคะ', '6501023'],
  ['student-24', 'เบญจพร ใจงาม', '6501024'],
  ['student-25', 'ธนภัทร สุวรรณ', '6501025'],
  ['student-26', 'ลลิตา พิทักษ์วงศ์', '6501026'],
  ['student-27', 'เอกภพ คำดี', '6501027'],
  ['student-28', 'ชญานิศ วงศ์สว่าง', '6501028'],
  ['student-29', 'กฤตเมธ พงษ์ไพร', '6501029'],
  ['student-30', 'เมธาวี สุขใจ', '6501030'],
] as const;

export const studentSubmissions: Record<string, StudentSubmission[]> = {
  'assignment-1': students.map(([id, name, studentId], index) => ({
    id, name, studentId,
    status: index < 2 ? 'ส่งแล้ว' : index === 2 ? 'รอดำเนินการ' : 'ยังไม่ส่ง',
    submittedAt: index < 2 ? 'วันนี้ 10:2' + index + ' น.' : undefined,
    score: index < 2 ? 18 - index : undefined,
    fileName: index < 2 ? `assignment-1-${studentId}.c` : undefined,
    note: index === 2 ? 'กำลังตรวจสอบความถูกต้องของไฟล์' : undefined,
  })),
  'assignment-2': students.map(([id, name, studentId], index) => ({
    id, name, studentId,
    status: index === 0 ? 'ส่งแล้ว' : index === 1 ? 'รอดำเนินการ' : 'ยังไม่ส่ง',
    submittedAt: index === 0 ? 'เมื่อวาน 16:40 น.' : undefined,
    score: index === 0 ? 23 : undefined,
    fileName: index === 0 ? `assignment-2-${studentId}.pdf` : undefined,
  })),
  'assignment-3': students.map(([id, name, studentId]) => ({
    id, name, studentId, status: 'ส่งแล้ว', submittedAt: '2 ก.ย. 2569', score: 14,
    fileName: `assignment-3-${studentId}.zip`,
  })),
  'assignment-4': students.map(([id, name, studentId], index) => ({
    id, name, studentId, status: index === 0 ? 'รอดำเนินการ' : 'ยังไม่ส่ง',
  })),
};
