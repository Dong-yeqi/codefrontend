<!-- src/charts/PriceTrendChart.vue -->
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
    grid: { left: 40, right: 20, top: 24, bottom: 26 },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#64748b' } },
      axisLabel: { color: '#cbd5e1', fontSize: 11 },
      data: ['1月','2月','3月','4月','5月','6月'],
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.25)' } },
      axisLabel: { color: '#cbd5e1', fontSize: 11 },
    },
    series: [
      {
        name: '均价（元/㎡）',
        type: 'line',
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 3,
          color: '#60a5fa',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(96,165,250,0.6)' },
            { offset: 1, color: 'rgba(15,23,42,0.1)' },
          ]),
        },
        data: [15000, 15200, 15450, 15300, 15600, 15800],
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
