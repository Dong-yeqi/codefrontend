// src/api/stats.js
import http from './http';

// 总览数据
export function getOverview(city) {
  return http.get('/public/stats/overview', {
    params: { city }
  });
}

// 价格趋势
export function getPriceTrend(city, region = null, range = '3m') {
  return http.get('/public/stats/priceTrend', {
    params: { city, region, range }
  });
}

// 区域对比（默认 avgPrice）
export function getRegionCompare(city, metric = 'avgPrice') {
  return http.get('/public/stats/regionCompare', {
    params: { city, metric }
  });
}

// 面积结构
export function getAreaStructure(city) {
  return http.get('/public/stats/areaStructure', {
    params: { city }
  });
}

// 户型结构
export function getLayoutStructure(city) {
  return http.get('/public/stats/layoutStructure', {
    params: { city }
  });
}
