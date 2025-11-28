// src/api/auth.js
import http from './http';

export function loginApi(username, password) {
  return http.post('/admin/login', { username, password });
}
