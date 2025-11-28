// src/api/task.js
import http from './http';

// 获取任务列表
export function listTasks() {
  return http.get('/admin/tasks');
}

// 新建 / 更新任务
export function saveTask(data) {
  return http.post('/admin/tasks', data);
}

// 删除任务
export function deleteTask(id) {
  return http.delete(`/admin/tasks/${id}`);
}

// 手动执行任务
export function runTask(id) {
  return http.post(`/admin/tasks/${id}/run`);
}
