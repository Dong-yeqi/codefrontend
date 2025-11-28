// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

// 注意：login.vue 是小写 !!!
import Login from '@/views/admin/login.vue';

// dashboard 路径结构正确
import Dashboard from '@/views/dashboard/Dashboard.vue';

// TaskList 文件是 TaskList.vue，但 URL 必须小写 /admin/tasks
import TaskList from '@/views/admin/TaskList.vue';

const routes = [
  // 登录
  {
    path: '/admin/login',
    name: 'Login',
    component: Login,
    meta: { public: true }
  },

  // 首页 → 自动跳 Dashboard
  { path: '/', redirect: '/admin/dashboard' },

  // 大屏首页
  {
    path: '/admin/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },

  // 任务管理（URL 必须小写！！！）
  {
    path: '/admin/tasks',
    name: 'TaskList',
    component: TaskList
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 登录校验
router.beforeEach((to, from, next) => {
  if (!to.meta.public) {
    const token = localStorage.getItem('token');
    if (!token) return next('/admin/login');
  }
  next();
});

export default router;
