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

    const sorted = chartData
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    const axis = sorted.map((item) => item.name);
    const seriesData = sorted.map((item) => item.value);

    if (chart) {
      chart.setOption({
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis' },
        grid: { left: 40, right: 20, top: 20, bottom: 30 },
        xAxis: {
          type: 'category',
          axisLine: { lineStyle: { color: '#64748b' } },
          axisLabel: { color: '#cbd5e1', fontSize: 11 },
          data: axis,
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
            data: seriesData,
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
