<!-- src/views/Login.vue -->
<template>
  <div class="login-wrapper">
    <div class="login-glow" />
    <div class="login-card">
      <h1 class="login-title">Real Estate Tracker</h1>
      <p class="login-subtitle">房产数据跟踪系统 · 管理后台</p>

      <div class="login-form">
        <input
          v-model="username"
          class="input"
          placeholder="用户名"
          autocomplete="username"
        />
        <input
          v-model="password"
          type="password"
          class="input"
          placeholder="密码"
          autocomplete="current-password"
        />
        <button class="btn" @click="onSubmit" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { loginApi } from '@/api/auth';

const router = useRouter();
const username = ref('');
const password = ref('');
const loading = ref(false);

async function onSubmit() {
  if (!username.value || !password.value) {
    alert('请输入用户名和密码');
    return;
  }
  loading.value = true;
  try {
    const res = await loginApi(username.value, password.value);
    // 根据你后端返回结构调整
    const token = res.data?.token || res.token || '';
    if (!token) {
      throw new Error('登录失败：未返回 token');
    }
    localStorage.setItem('token', token);
    localStorage.setItem('username', username.value);
    router.push('/admin/dashboard');
  } catch (e) {
    console.error(e);
    alert('登录失败，请检查账号密码');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-wrapper {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-glow {
  position: absolute;
  width: 520px;
  height: 520px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.28), transparent 60%);
  filter: blur(4px);
  transform: translate(-80px, -60px);
}

.login-card {
  position: relative;
  width: 360px;
  padding: 34px 30px 28px;
  border-radius: 24px;
  background: linear-gradient(
    145deg,
    rgba(15, 23, 42, 0.96),
    rgba(30, 64, 175, 0.88)
  );
  box-shadow: 0px 18px 60px rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(148, 163, 184, 0.55);
  backdrop-filter: blur(20px);
}

.login-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 6px;
  color: #f9fafb;
  text-align: center;
}

.login-subtitle {
  margin: 0 0 18px;
  font-size: 13px;
  text-align: center;
  color: #94a3b8;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
