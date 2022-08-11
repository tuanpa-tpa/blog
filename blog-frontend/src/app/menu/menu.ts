import { CoreMenu } from '@core/types';
import { Role } from 'app/auth/models';
const superadmin = JSON.parse(localStorage.getItem('currentUser'))?.role.includes(Role.SuperAdmin);
const admin = JSON.parse(localStorage.getItem('currentUser'))?.role.includes(Role.Admin);
console.log("djshdjhsạdhjshdjhạdhạhdjáhdháda");

console.log(superadmin, admin);

export const menu: CoreMenu[] = [
  {
    id: 'user',
    title: 'Quản lý users',
    type: 'section',
    disabled: !admin,
    hidden: !admin,
    children: [
      {
        id: 'user-profile-management',
        title: 'Users',
        translate: 'MENU.SUBSCRIPTION_MANAGEMENT.CREATE_NEW_SUBSCRIPTIONS',
        type: 'item',
        icon: 'user',
        url: '/apps/ip/profiles/profile-list',
        disabled: !admin,
      },
    ],
  },
  {
    id: 'blog',
    title: 'Blog',
    type: 'section',
    children: [
      {
        id: 'Blog-management',
        title: 'Blog',
        translate: 'MENU.SUBSCRIPTION_MANAGEMENT.CREATE_NEW_SUBSCRIPTIONS',
        type: 'item',
        icon: 'check-square',
        url: '/pages/blogs/blog-list',
        
      },
    ],
  },
  {
    id: 'post',
    title: 'Đăng bài',
    type: 'section',
    disabled: !admin,
    hidden: !admin,
    children: [
      {
        id: 'Blog-post',
        title: 'Đăng bài',
        translate: 'MENU.SUBSCRIPTION_MANAGEMENT.CREATE_NEW_SUBSCRIPTIONS',
        type: 'item',
        icon: 'upload',
        url: '/pages/blogs/blog-create',
        disabled: !admin,
      },
    ],
  },
  {
    id: 'category',
    title: 'Quản lý category',
    type: 'section',
    disabled: !superadmin,
    hidden: !superadmin,
    children: [
      {
        id: 'Blog-post',
        title: 'Thêm category',
        translate: 'MENU.SUBSCRIPTION_MANAGEMENT.CREATE_NEW_SUBSCRIPTIONS',
        type: 'item',
        icon: 'credit-card',
        url: '/pages/category/category-create',
        disabled: !superadmin,
      },
    ],
  },
  {
    id: 'Account',
    title: 'Thay đổi thông tin tài khoản',
    translate: 'MENU.SUBSCRIPTION_MANAGEMENT.CREATE_NEW_SUBSCRIPTIONS',
    type: 'item',
    icon: 'user',
    url: '/pages/account/account-settings',
  },
];
