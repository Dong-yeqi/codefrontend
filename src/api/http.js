// src/api/http.js
import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (res) => res.data,
  (err) => {
    console.error('API Error:', err);
    
    // 处理 HTTP 错误
    if (err.response) {
      const { status, data } = err.response;
      
      // 401 未授权，清除 token 并跳转登录
      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        if (window.location.pathname !== '/admin/login') {
          window.location.href = '/admin/login';
        }
      }
      
      // 显示错误消息
      const errorMsg = data?.message || data?.msg || `请求失败 (${status})`;
      if (err.config?.showError !== false) {
        alert(errorMsg);
      }
    } else if (err.request) {
      // 网络错误
      if (err.config?.showError !== false) {
        alert('网络错误，请检查网络连接');
      }
    } else {
      // 其他错误
      if (err.config?.showError !== false) {
        alert(err.message || '请求失败，请稍后重试');
      }
    }
    
    return Promise.reject(err);
  }
);

export default http;
