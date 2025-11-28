<!-- src/charts/LayoutPieChart.vue -->
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
        color: ['#38bdf8', '#6366f1', '#a855f7', '#f97316'],
        data: [
          { value: 35, name: '两居' },
          { value: 30, name: '三居' },
          { value: 18, name: '一居' },
          { value: 10, name: '四居+' },
        ],
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
