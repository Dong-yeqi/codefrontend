<!-- src/charts/AreaPieChart.vue -->
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
  metric: {
    type: String,
    default: 'count',
  },
});

const chartRef = ref(null);
let chart;

const loadData = async () => {
  try {
    const res = await getRegionCompare(props.city, props.metric);
    const payload = res && res.code === 200 ? res.data : null;

    const regions = Array.isArray(payload?.regions) ? payload.regions : [];
    const values = Array.isArray(payload?.values) ? payload.values : [];

    const chartData = regions.map((name, index) => ({
      name,
      value: Number(values[index]) || 0,
    }));

    if (chart) {
      chart.setOption({
        backgroundColor: 'transparent',
        tooltip: { trigger: 'item' },
        legend: {
          top: 0,
          textStyle: { color: '#e5e7eb', fontSize: 11 },
        },
        series: [
          {
            name: '区域占比',
            type: 'pie',
            radius: ['35%', '65%'],
            center: ['50%', '55%'],
            roseType: 'radius',
            itemStyle: {
              borderRadius: 8,
              borderColor: '#020617',
              borderWidth: 1,
            },
            label: {
              color: '#cbd5e1',
              fontSize: 11,
            },
            color: ['#60a5fa', '#818cf8', '#a855f7', '#22c55e', '#f97316', '#ec4899', '#14b8a6'],
            data: chartData,
          },
        ],
      });
    }
  } catch (error) {
    console.error('加载区域数据失败:', error);
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

watch(
  () => [props.city, props.metric],
  () => {
    loadData();
  }
);

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
