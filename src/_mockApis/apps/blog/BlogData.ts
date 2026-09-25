
import { Chance } from 'chance';
import { random } from 'lodash';
import { sub } from 'date-fns';
import mock from '../../mockAdapter';
import s1 from '@/assets/images/blog/blog-img1.jpg';
import s2 from '@/assets/images/blog/blog-img2.jpg';
import s3 from '@/assets/images/blog/blog-img3.jpg';
import s4 from '@/assets/images/blog/blog-img4.jpg';
import s5 from '@/assets/images/blog/blog-img5.jpg';
import s6 from '@/assets/images/blog/blog-img6.jpg';
import s7 from '@/assets/images/blog/blog-img2.jpg';
import s8 from '@/assets/images/blog/blog-img8.jpg';
import s9 from '@/assets/images/blog/blog-img9.jpg';
import s10 from '@/assets/images/blog/blog-img10.jpg';

import user1 from '@/assets/images/profile/user-6.jpg';
import user2 from '@/assets/images/profile/user-2.jpg';
import user3 from '@/assets/images/profile/user-3.jpg';
import user4 from '@/assets/images/profile/user-4.jpg';
import user5 from '@/assets/images/profile/user-5.jpg';
import user6 from '@/assets/images/profile/user-8.jpg';

import { uniqueId } from 'lodash';

import type { blogType, blogpostType } from '@/types/apps/BlogTypes';

const chance = new Chance();

const BlogComment: blogType[] = [
    {
        id: uniqueId('#comm_'),
        profile: {
            id: chance.integer({ min: 1, max: 2000 }),
            avatar: user2,
            name: chance.name()
        },
        time: chance.date(),
        comment: chance.paragraph({ sentences: 2 }),
        replies: []
    },
    {
        id: uniqueId('#comm_'),
        profile: {
            id: chance.integer({ min: 1, max: 2000 }),
            avatar: user3,
            name: chance.name()
        },
        time: chance.date(),
        comment: chance.paragraph({ sentences: 2 }),
        replies: [
            {
                id: uniqueId('#comm_'),
                profile: {
                    id: chance.integer({ min: 1, max: 2000 }),
                    avatar: user3,
                    name: chance.name()
                },
                time: chance.date(),
                comment: chance.paragraph({ sentences: 2 })
            }
        ]
    },
    {
        id: uniqueId('#comm_'),
        profile: {
            id: chance.integer({ min: 1, max: 2000 }),
            avatar: user5,
            name: chance.name()
        },
        time: chance.date(),
        comment: chance.paragraph({ sentences: 2 }),
        replies: []
    }
];

const classCourseMock = {
    id: 9001,
    slug: 'garmins-instinct-crossover-is-a-rugged-hybrid-smartwatch',
    title: 'ภาษา C พื้นฐาน สำหรับ ปวช.1',
    displayTitle: 'ภาษา C พื้นฐาน สำหรับ ปวช.1',
    content: 'เรียนรู้พื้นฐานการเขียนโปรแกรมภาษา C สำหรับนักเรียนชั้น ปวช.1 ตั้งแต่ตัวแปรจนถึงการทำงานแบบวนซ้ำ',
    coverImg: s1,
    createdAt: sub(new Date(), { days: 8, hours: 6, minutes: 20 }),
    view: 4821,
    share: 1398,
    category: 'ภาษา C · ปวช.1',
    featured: false,
    author: {
        id: 9001,
        avatar: user1,
        name: 'อาจารย์ สมชาย ใจดี'
    },
    comments: BlogComment,
    level: 'ปวช.2',
    semester: 'ภาค 1',
    academicYear: '2568',
    accessType: 'open',
    classCode: 'C-2568-01',
    courseSummary: 'เรียนพื้นฐานภาษา C ตั้งแต่ตัวแปร, คำสั่งควบคุม, ฟังก์ชัน, อาร์เรย์ และการแก้ปัญหาด้วยโปรแกรม',
    descriptionHtml: `
      <div class="space-y-4 text-sm text-slate-700 dark:text-slate-200 leading-7">
        <p><strong>รายวิชา:</strong> ภาษา C</p>
        <p>ในการเรียนครั้งนี้ นักศึกษาเรียนรู้การเขียนโปรแกรมเชิงโครงสร้างด้วยภาษา C เพื่อพัฒนาทักษะการคิดวิเคราะห์และแก้ปัญหาได้อย่างเป็นระบบ</p>
        <p><strong>จุดประสงค์:</strong> นักศึกษาจะสามารถเขียนโปรแกรมพื้นฐาน, ใช้คำสั่งควบคุมการทำงาน, จัดการข้อมูลแบบอาร์เรย์ และสร้างฟังก์ชันเพื่อแยกโค้ดให้เป็นระเบียบ</p>
        <h3 class="text-lg font-semibold text-foreground mt-4">หัวข้อหลัก</h3>
        <ul class="list-disc ml-6 mt-2 space-y-1">
          <li>พื้นฐานภาษา C และการตั้งชื่อตัวแปร</li>
          <li>คำสั่ง if / switch / loop</li>
          <li>ฟังก์ชันและการส่งค่าพารามิเตอร์</li>
          <li>อาร์เรย์และสตริง</li>
          <li>โครงสร้างข้อมูลพื้นฐานและการทดสอบโปรแกรม</li>
        </ul>
        <h3 class="text-lg font-semibold text-foreground mt-4">เกณฑ์การประเมิน</h3>
        <p>ทำงานภาคปฏิบัติ, การบ้าน, และสอบปลายภาคตามสัดส่วนที่กำหนดในคลาส</p>
      </div>
    `,
    gradingCriteria: [
      { name: 'งานที่ได้รับมอบหมาย', percentage: 25 },
      { name: 'การเข้าชั้นเรียน', percentage: 15 },
      { name: 'สอบกลางภาค', percentage: 25 },
      { name: 'สอบปลายภาค', percentage: 35 }
    ],
    modules: [
      { id: 1, title: 'บทที่ 1: หลักการเขียนโปรแกรม', duration: '45 นาที', type: 'วิดีโอ', status: 'เรียนแล้ว', progress: 100 },
      { id: 2, title: 'บทที่ 2: ตัวแปรและชนิดข้อมูล', duration: '60 นาที', type: 'บรรยาย', status: 'กำลังเรียน', progress: 70 },
      { id: 3, title: 'บทที่ 3: คำสั่งควบคุมการทำงาน', duration: '50 นาที', type: 'สไลด์', status: 'รอเรียน', progress: 25 },
      { id: 4, title: 'บทที่ 4: ฟังก์ชันและการคืนค่า', duration: '70 นาที', type: 'วิดีโอ', status: 'รอเรียน', progress: 10 }
    ],
    assignments: [
      { id: 1, title: 'แบบฝึกหัด 1: การคำนวณพื้นฐาน', due: '15 ก.ย. 2568', type: 'แบบฝึกหัด', status: 'ส่งแล้ว', points: 20 },
      { id: 2, title: 'แบบฝึกหัด 2: โปรแกรมตัดสินใจ', due: '22 ก.ย. 2568', type: 'ทดสอบ', status: 'ยังไม่ส่ง', points: 25 },
      { id: 3, title: 'โครงงานย่อย: โปรแกรมคำนวณค่าเฉลี่ย', due: '30 ก.ย. 2568', type: 'โปรเจกต์', status: 'รอทำ', points: 30 }
    ],
    members: [
      { id: 1, name: 'นางสาวกนกพร มั่นคง', role: 'นักศึกษา', progress: 92, avatar: user2 },
      { id: 2, name: 'นายกิตติศักดิ์ บัวทอง', role: 'นักศึกษา', progress: 88, avatar: user3 },
      { id: 3, name: 'นายธนกฤต คงดี', role: 'นักศึกษา', progress: 76, avatar: user4 },
      { id: 4, name: 'อาจารย์ สมชาย ใจดี', role: 'ผู้สอน', progress: 100, avatar: user1 }
    ],
    reports: [
      { label: 'นักศึกษาที่เข้าร่วม', value: '32 คน', change: '+8%', trend: 'up' },
      { label: 'อัตราการเรียนผ่าน', value: '86%', change: '+5%', trend: 'up' },
      { label: 'งานที่ยังรอส่ง', value: '7 งาน', change: '-2%', trend: 'down' },
      { label: 'เวลาเรียนเฉลี่ย', value: '4.3 ชม./สัปดาห์', change: '+0.4 ชม.', trend: 'up' }
    ],
    settings: [
      { key: 'สถานะคอร์ส', value: 'เปิด', detail: 'เผยแพร่ให้ทุกคนเข้าดูได้' },
      { key: 'การยืนยันสิทธิ์', value: 'ต้องมีรหัสเข้าร่วม', detail: 'แนะนำใช้สำหรับคลาสปิด' },
      { key: 'การแจ้งเตือน', value: 'เปิด', detail: 'ส่งแจ้งเตือนงานและคาบเรียน' },
      { key: 'การคัดลอกข้อมูล', value: 'ปิด', detail: 'ไม่อนุญาตให้นำเนื้อหาคลาสไปใช้ซ้ำ' }
    ]
};

const BlogPost: blogpostType[] = [
    {
        ...classCourseMock,
        title: classCourseMock.title,
        displayTitle: classCourseMock.displayTitle,
        content: classCourseMock.content,
        coverImg: classCourseMock.coverImg,
        createdAt: classCourseMock.createdAt,
        view: classCourseMock.view,
        share: classCourseMock.share,
        category: classCourseMock.category,
        featured: classCourseMock.featured,
        author: classCourseMock.author,
        comments: classCourseMock.comments,
        level: classCourseMock.level,
        semester: classCourseMock.semester,
        academicYear: classCourseMock.academicYear,
        accessType: classCourseMock.accessType,
        classCode: classCourseMock.classCode,
        courseSummary: classCourseMock.courseSummary,
        descriptionHtml: classCourseMock.descriptionHtml,
        gradingCriteria: classCourseMock.gradingCriteria,
    },
    {
        id: chance.integer({ min: 1, max: 2000 }),
        title: 'After Twitter Staff Cuts, Survivors Face ‘Radio Silence',
        content: chance.paragraph({ sentences: 2 }),
        coverImg: s2,
        createdAt: sub(new Date(), { days: 7, hours: 3, minutes: 20 }),
        view: random(9999),
        share: random(9999),
        category: 'Lifestyle',
        featured: false,
        author: {
            id: chance.integer({ min: 1, max: 2000 }),
            avatar: user2,
            name: chance.name()
        },
        comments: BlogComment
    },
    {
        id: chance.integer({ min: 1, max: 2000 }),
        title: 'Apple is apparently working on a new ‘streamlined’ accessibility',
        content: chance.paragraph({ sentences: 2 }),
        coverImg: s3,
        createdAt: sub(new Date(), { days: 5, hours: 2, minutes: 20 }),
        view: random(9999),
        share: random(9999),
        category: 'Design',
        featured: false,
        author: {
            id: chance.integer({ min: 1, max: 2000 }),
            avatar: user3,
            name: chance.name()
        },
        comments: BlogComment
    },
    {
        id: chance.integer({ min: 1, max: 2000 }),
        title: 'Why Figma is selling to Adobe for $20 billion',
        content: chance.paragraph({ sentences: 2 }),
        coverImg: s4,
        createdAt: sub(new Date(), { days: 7, hours: 6, minutes: 20 }),
        view: random(9999),
        share: random(9999),
        category: 'Design',
        featured: false,
        author: {
            id: chance.integer({ min: 1, max: 2000 }),
            avatar: user4,
            name: chance.name()
        },
        comments: BlogComment
    },
    {
        id: chance.integer({ min: 1, max: 2000 }),
        title: 'Streaming video way before it was cool, go dark tomorrow',
        content: chance.paragraph({ sentences: 2 }),
        coverImg: s5,
        createdAt: sub(new Date(), { days: 4, hours: 6, minutes: 20 }),
        view: random(9999),
        share: random(9999),
        category: 'Lifestyle',
        featured: false,
        author: {
            id: chance.integer({ min: 1, max: 2000 }),
            avatar: user5,
            name: chance.name()
        },
        comments: BlogComment
    },
    {
        id: chance.integer({ min: 1, max: 2000 }),
        title: 'As yen tumbles, gadget-loving Japan goes for secondhand',
        content: chance.paragraph({ sentences: 2 }),
        coverImg: s6,
        createdAt: sub(new Date(), { days: 2, hours: 6, minutes: 20 }),
        view: random(9999),
        share: random(9999),
        category: 'Gadget',
        featured: false,
        author: {
            id: chance.integer({ min: 1, max: 2000 }),
            avatar: user6,
            name: chance.name()
        },
        comments: BlogComment
    },
    {
        id: chance.integer({ min: 1, max: 2000 }),
        title: 'Intel loses bid to revive antitrust case against patent foe Fortress',
        content: chance.paragraph({ sentences: 2 }),
        coverImg: s7,
        createdAt: sub(new Date(), { days: 3, hours: 6, minutes: 20 }),
        view: random(9999),
        share: random(9999),
        category: 'Social',
        featured: false,
        author: {
            id: chance.integer({ min: 1, max: 2000 }),
            avatar: user2,
            name: chance.name()
        },
        comments: BlogComment
    },
    {
        id: chance.integer({ min: 1, max: 2000 }),
        title: 'COVID outbreak deepens as more lockdowns loom in China',
        content: chance.paragraph({ sentences: 2 }),
        coverImg: s8,
        createdAt: sub(new Date(), { days: 4, hours: 6, minutes: 20 }),
        view: random(9999),
        share: random(9999),
        category: 'Health',
        featured: false,
        author: {
            id: chance.integer({ min: 1, max: 2000 }),
            avatar: user3,
            name: chance.name()
        },
        comments: BlogComment
    },
    {
        id: chance.integer({ min: 1, max: 2000 }),
        title: 'Early Black Friday Amazon deals: cheap TVs, headphones',
        content: chance.paragraph({ sentences: 2 }),
        coverImg: s9,
        createdAt: sub(new Date(), { days: 5, hours: 3, minutes: 20 }),
        view: random(9999),
        share: random(9999),
        category: 'Gadget',
        featured: true,
        author: {
            id: chance.integer({ min: 1, max: 2000 }),
            avatar: user4,
            name: chance.name()
        },
        comments: BlogComment
    },
    {
        id: chance.integer({ min: 1, max: 2000 }),
        title: 'Presented by Max Rushden with Barry Glendenning, Philippe',
        content: chance.paragraph({ sentences: 2 }),
        coverImg: s10,
        createdAt: sub(new Date(), { days: 0, hours: 1, minutes: 20 }),
        view: random(9999),
        share: random(9999),
        category: 'Health',
        featured: true,
        author: {
            id: chance.integer({ min: 1, max: 2000 }),
            avatar: user5,
            name: chance.name()
        },
        comments: BlogComment
    }
];

const thaiCourseMetadata = [
    { title: 'ภาษา C พื้นฐาน สำหรับ ปวช.1', content: 'เริ่มต้นเขียนโปรแกรมด้วยตัวแปร ชนิดข้อมูล การรับค่า และการแสดงผล', category: 'ภาษา C · ปวช.1', instructor: 'อาจารย์ สมชาย ใจดี', slug: 'garmins-instinct-crossover-is-a-rugged-hybrid-smartwatch' },
    { title: 'การเขียนโปรแกรมภาษา C สำหรับ ปวช.2', content: 'ฝึกใช้เงื่อนไข การทำซ้ำ ฟังก์ชัน และการแก้โจทย์ปัญหาอย่างเป็นขั้นตอน', category: 'ภาษา C · ปวช.2', instructor: 'อาจารย์สุภาวดี แสงทอง', slug: 'c-programming-practical-year-2' },
    { title: 'โครงสร้างข้อมูลด้วยภาษา C สำหรับ ปวช.3', content: 'เรียนรู้ Array, Pointer, Struct และการจัดการข้อมูลสำหรับโปรแกรมขนาดใหญ่ขึ้น', category: 'ภาษา C · ปวช.3', instructor: 'อาจารย์กิตติศักดิ์ วัฒนกุล', slug: 'c-data-structures-year-3' },
    { title: 'การพัฒนาโปรแกรมภาษา C ขั้นสูง สำหรับ ปวส.1', content: 'ประยุกต์ใช้ File I/O, Pointer และการแบ่งโมดูลเพื่อพัฒนาโปรแกรมใช้งานจริง', category: 'ภาษา C · ปวส.1', instructor: 'อาจารย์วิภา แสงมณี', slug: 'advanced-c-programming-povs-1' },
];

const ThaiBlogPosts: blogpostType[] = BlogPost.slice(0, 4).map((post, index) => {
    const course = thaiCourseMetadata[index % thaiCourseMetadata.length];
    return {
        ...post,
        title: course.title,
        displayTitle: course.title,
        content: course.content,
        category: course.category,
        slug: course.slug,
        author: { ...post.author, name: course.instructor },
    };
});

mock.onGet('/api/data/blog/BlogPosts').reply(() => {
    return [200, ThaiBlogPosts];
});

// ----------------------------------------------------------------------
mock.onPost('/api/data/blog/post').reply((config: string | any) => {
    try {
        const { title } = JSON.parse(config.data);

        const paramCase = (t: string) =>
            t
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '');

        if (title === 'garmins-instinct-crossover-is-a-rugged-hybrid-smartwatch') {
            return [200, { post: { ...classCourseMock, title: classCourseMock.title, displayTitle: classCourseMock.displayTitle } }];
        }

        const post = ThaiBlogPosts.find((_post: blogpostType | string | any) => paramCase(_post.title || '') === title || _post.slug === title);

        if (!post) {
            return [404, { message: 'Post not found' }];
        }

        return [200, { post }];
    } catch (error) {
        console.error(error);
        return [500, { message: 'Internal server error' }];
    }
});

mock.onPost('/api/data/blog/post/add').reply((config: string | any) => {
    try {
        const { postId, comment } = JSON.parse(config.data);
        const postIndex = BlogPost.findIndex((x) => x.id === postId);
        const post = BlogPost[postIndex];
        if (!post) {
            return [404, { message: 'Post not found' }];
        }
        const cComments = post.comments || [];
        post.comments = [comment, ...cComments];
        return [200, { posts: [...BlogPost] }];
    } catch (err) {
        console.error(err);
        return [500, { message: 'Internal server error' }];
    }
});
