<!-- src/charts/RegionBarChart.vue -->
<template>
  <div ref="chartRef" class="chart-root"></div>
</template>

<script setup>
import * as echarts from 'echarts';
import { onMounted, onBeforeUnmount, ref } from 'vue';

const chartRef = ref(null);
let chart;

onMounted(() => {
  chart = echarts.init(chartRef.value);
  chart.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 20, top: 20, bottom: 30 },
    xAxis: {
      type: 'category',
      axisLine: { lineStyle: { color: '#64748b' } },
      axisLabel: { color: '#cbd5e1', fontSize: 11 },
      data: ['高新', '天府', '锦江', '武侯', '成华'],
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
        data: [320, 280, 210, 190, 170],
      },
    ],
  });

  window.addEventListener('resize', resize);
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
