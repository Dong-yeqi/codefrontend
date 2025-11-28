<!-- src/charts/LayoutPieChart.vue -->
<template>
  <div ref="chartRef" class="chart-root"></div>
</template>

<script setup>
import * as echarts from 'echarts';
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { getLayoutStructure } from '@/api/stats';

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
    const res = await getLayoutStructure(props.city);
    const data = res?.data || res || [];
    
    // 转换为 ECharts 需要的格式
    const chartData = Array.isArray(data)
      ? data.map(item => ({
          value: item.count || item.value || 0,
          name: item.layout || item.name || '',
        }))
      : [];
    
    if (chart && chartData.length > 0) {
      chart.setOption({
        backgroundColor: 'transparent',
        tooltip: { trigger: 'item' },
        legend: {
          bottom: 0,
          textStyle: { color: '#e5e7eb', fontSize: 11 },
        },
        series: [
          {
            type: 'pie',
            radius: ['30%', '70%'],
            center: ['50%', '45%'],
            itemStyle: { borderRadius: 6, borderColor: '#020617', borderWidth: 1 },
            label: { color: '#cbd5e1', fontSize: 11 },
            color: ['#38bdf8', '#6366f1', '#a855f7', '#f97316', '#ec4899', '#14b8a6'],
            data: chartData,
          },
        ],
      });
    }
  } catch (error) {
    console.error('加载户型数据失败:', error);
    // 如果 API 失败，显示空数据
    if (chart) {
      chart.setOption({
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
