export interface menu {
  header?: string;
  title?: string;
  icon?: any;
  to?: string;
  chip?: string;
  chipBgColor?: string;
  chipColor?: string;
  chipVariant?: string;
  chipIcon?: string;
  children?: menu[];
  disabled?: boolean;
  type?: string;
  subCaption?: string;
  isPro?: boolean;
}

const sidebarItem: menu[] = [
  { header: 'เมนูหลัก' },
  { title: 'หน้าแรก', icon: 'home-smile-linear', to: '/', isPro: false },
  {
    title: 'คลาส',
    icon: 'sort-by-alphabet-linear',
    to: '/apps/blog/post',
    children: [
      { title: 'คลาสของฉัน', to: '/apps/blog/post', isPro: false },
      { title: 'คลาสทั่วไป', to: '/apps/blog/all', isPro: false },
      { title: 'เข้าร่วมคลาส', to: '/apps/blog/joined', isPro: false },
    ],
  },
  { title: 'งานที่ได้รับมอบหมาย', icon: 'clipboard-list-linear', to: '/apps/assignments', isPro: false },
  { title: 'บุ๊คมาร์ก', icon: 'bookmark-linear', to: '/apps/bookmarks', isPro: false },
  { title: 'ประวัติเข้าชม', icon: 'history-linear', to: '/apps/history', isPro: false },
];

export default sidebarItem;
