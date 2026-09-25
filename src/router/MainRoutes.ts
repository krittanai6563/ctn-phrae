




const MainRoutes = [
    {
        path: '/',
        component: () => import('../layouts/full/FullLayout.vue'),
        children: [
            {
                path: '',
                name: 'Modern',
                component: () => import('../views/dashboards/Modern.vue'),
            },

            {
                name: 'Notes',
                path: '/apps/notes',
                component: () => import('../views/apps/notes/Notes.vue')
            },
            {
                name: 'Tickets',
                path: '/apps/tickets',
                component: () => import('../views/apps/tickets/Tickets.vue')
            },
            {
                name: 'คลาสทั่วไป',
                path: '/apps/blog/all',
                component: () => import('../views/apps/blog/AllClasses.vue')
            },
            {
                name: 'คลาสของฉัน',
                path: '/apps/blog/post',
                component: () => import('../views/apps/blog/Posts.vue')
            },
            {
                name: 'สร้างคลาสใหม่',
                path: '/apps/blog/create-class',
                component: () => import('../views/apps/blog/CreateClassPage.vue'),
                meta: { roles: ['teacher'] },
            },
            {
                name: 'เข้าร่วมคลาส',
                path: '/apps/blog/joined',
                component: () => import('../views/apps/blog/JoinedClasses.vue')
            },
            {
                name: 'งานที่ได้รับมอบหมาย',
                path: '/apps/assignments',
                component: () => import('../views/apps/assignments/AssignmentCourses.vue')
            },
            {
                name: 'งานในรายวิชา',
                path: '/apps/assignments/course/:courseId',
                component: () => import('../views/apps/assignments/CourseAssignments.vue')
            },
            {
                name: 'บุ๊คมาร์ก',
                path: '/apps/bookmarks',
                component: () => import('../views/apps/library/Bookmarks.vue')
            },
            {
                name: 'ประวัติเข้าชม',
                path: '/apps/history',
                component: () => import('../views/apps/library/History.vue')
            },
            {
                name: 'สร้างงานหรือข้อสอบ',
                path: '/apps/assignments/create',
                component: () => import('../views/apps/assignments/CreateAssignment.vue'),
                meta: { roles: ['teacher'] },
            },
            {
                name: 'จัดการกลุ่มนักเรียน',
                path: '/apps/class-groups',
                component: () => import('../views/apps/assignments/ClassGroups.vue'),
                meta: { roles: ['teacher'] },
            },
            {
                name: 'เพิ่มนักเรียนเข้ากลุ่ม',
                path: '/apps/class-groups/add-students',
                component: () => import('../views/apps/assignments/AddStudentsToGroup.vue'),
                meta: { roles: ['teacher'] },
            },
            {
                name: 'สถานะการส่งงานในบท',
                path: '/apps/assignments/chapter/:chapterId',
                component: () => import('../views/apps/assignments/ChapterSubmissions.vue'),
                meta: { roles: ['teacher'] },
            },
            {
                name: 'รายละเอียดงาน',
                path: '/apps/assignments/:id',
                component: () => import('../views/apps/assignments/AssignmentDetail.vue')
            },
            {
                name: 'งานรอตรวจ',
                path: '/apps/assignments/review',
                component: () => import('../views/apps/lms/LmsManagement.vue'),
                meta: { roles: ['teacher'] },
            },
            {
                name: 'นักเรียน',
                path: '/apps/students',
                component: () => import('../views/apps/lms/LmsManagement.vue'),
                meta: { roles: ['teacher'] },
            },
            {
                name: 'บทเรียนและเนื้อหา',
                path: '/apps/lessons',
                component: () => import('../views/apps/lms/LmsManagement.vue'),
                meta: { roles: ['teacher'] },
            },
            {
                name: 'คะแนนและผลการเรียน',
                path: '/apps/gradebook',
                component: () => import('../views/apps/lms/LmsManagement.vue'),
                meta: { roles: ['teacher'] },
            },
            {
                name: 'ประกาศประจำคลาส',
                path: '/apps/announcements',
                component: () => import('../views/apps/lms/LmsManagement.vue'),
                meta: { roles: ['teacher'] },
            },
            {
                name: 'รายงานผล',
                path: '/apps/reports',
                component: () => import('../views/apps/lms/LmsManagement.vue'),
                meta: { roles: ['teacher'] },
            },
            {
                name: 'Blog Details',
                path: '/apps/blog/:slug',
                component: () => import('../views/apps/blog/[id].vue')
            },
            {
                name: 'Icon',
                path: '/icons/solar',
                component: () => import('../views/icons/Solar.vue')
            },
            {
                name: 'Shadcn Table',
                path: '/shadcn-table/basic',
                component: () => import('../views/shadcn-tables/BasicTable.vue')
            },
            {
                name: 'Shadcn Hover Table',
                path: '/shadcn-table/hover',
                component: () => import('../views/shadcn-tables/HoverTable.vue')
            },
            {
                name: 'Form',
                path: '/utilities/form',
                component: () => import('../views/utilities/Form.vue')
            },
            {
                name: 'User Profile',
                path: '/user-profile',
                component: () => import('../views/utilities/UserProfile.vue')
            },
        ],
    },
];



export default MainRoutes;
