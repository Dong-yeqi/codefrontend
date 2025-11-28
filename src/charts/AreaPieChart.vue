<!-- src/charts/AreaPieChart.vue -->
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
        color: ['#60a5fa', '#818cf8', '#a855f7', '#22c55e', '#f97316'],
        data: [
          { value: 40, name: '高新区' },
          { value: 32, name: '天府新区' },
          { value: 28, name: '武侯区' },
          { value: 20, name: '成华区' },
          { value: 18, name: '锦江区' },
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
