<!-- src/charts/RegionBarChart.vue -->
<template>
  <div ref="chartRef" class="chart-root"></div>
</template>

<script setup>
import * as echarts from 'echarts';
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { getRegionCompare } from '@/api/stats';

const props = defineProps({
  city: {
    type: String,
    default: '成都',
  },
});

const chartRef = ref(null);
let chart;

const loadData = async () => {
  try {
    const res = await getRegionCompare(props.city, 'count');
    const data = res?.data || res || [];
    
    // 转换为 ECharts 需要的格式，按数量排序
    const chartData = Array.isArray(data)
      ? data
          .map(item => ({
            name: item.region || item.name || '',
            value: item.count || item.value || 0,
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 10) // 只显示前10个
      : [];
    
    const regions = chartData.map(item => item.name);
    const counts = chartData.map(item => item.value);
    
    if (chart) {
      chart.setOption({
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis' },
        grid: { left: 40, right: 20, top: 20, bottom: 30 },
        xAxis: {
          type: 'category',
          axisLine: { lineStyle: { color: '#64748b' } },
          axisLabel: { color: '#cbd5e1', fontSize: 11 },
          data: regions.length > 0 ? regions : [],
        },
        yAxis: {
          type: 'value',
          axisLine: { show: false },
          splitLine: { lineStyle: { color: 'rgba(148,163,184,0.25)' } },
          axisLabel: { color: '#cbd5e1', fontSize: 11 },
        },
        series: [
          {
            name: '房源数',
            type: 'bar',
            barWidth: 20,
            itemStyle: {
              borderRadius: [8, 8, 0, 0],
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#6366f1' },
                { offset: 1, color: '#0f172a' },
              ]),
            },
            data: counts.length > 0 ? counts : [],
          },
        ],
      });
    }
  } catch (error) {
    console.error('加载区域数据失败:', error);
    // 如果 API 失败，显示空数据
    if (chart) {
      chart.setOption({
        xAxis: { data: [] },
        series: [{ data: [] }],
      });
    }
  }
};

onMounted(() => {
  chart = echarts.init(chartRef.value);
  loadData();
  window.addEventListener('resize', resize);
});

watch(() => props.city, () => {
  loadData();
});

function resize() {
  chart && chart.resize();
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize);
  chart && chart.dispose();
});
</script>

<style scoped>
.chart-root {
  width: 100%;
  height: 100%;
}
</style>
