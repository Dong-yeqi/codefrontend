<!-- src/layouts/MainLayout.vue -->
<template>
  <div class="app-shell">
    <!-- 侧边栏 -->
    <aside class="sidebar">
      <div class="sidebar-logo">
        <div class="sidebar-logo-icon" />
        <span>Real Estate Tracker</span>
      </div>

      <nav class="sidebar-nav">
        <!-- 数据大屏 -->
        <div
          class="sidebar-nav-item"
          :class="{ active: route.name === 'Dashboard' }"
          @click="go('/admin/dashboard')"
        >
          <div class="sidebar-nav-item-icon" />
          <span>数据大屏</span>
        </div>

        <!-- 任务管理 -->
        <div
          class="sidebar-nav-item"
          :class="{ active: route.name === 'TaskList' }"
          @click="go('/admin/tasks')"
        >
          <div class="sidebar-nav-item-icon" />
          <span>任务管理</span>
        </div>
      </nav>
    </aside>

    <!-- 右侧主体 -->
    <div class="main-area">
      <header class="topbar">
        <div class="topbar-title">{{ title }}</div>

        <div class="topbar-right">
          <span>欢迎你，{{ username }}</span>
          <!-- 退出登录 -->
          <button class="btn-ghost" @click="logout">退出</button>
        </div>
      </header>

      <main class="main-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const title = computed(() => route.meta.title || 'Real Estate Tracker');
const username = computed(() => localStorage.getItem('username') || '管理员');

function go(path) {
  if (route.path !== path) router.push(path);
}

function logout() {
  localStorage.removeItem('token');
  router.push('/admin/login'); // 修复
}
</script>
