<!-- src/charts/PriceTrendChart.vue -->
<template>
  <div ref="chartRef" class="chart-root"></div>
</template>

<script setup>
import * as echarts from 'echarts';
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { getPriceTrend } from '@/api/stats';

const props = defineProps({
  city: {
    type: String,
    default: '成都',
  },
  region: {
    type: String,
    default: null,
  },
  range: {
    type: String,
    default: '3m',
  },
});

const chartRef = ref(null);
let chart;

const loadData = async () => {
  try {
    const res = await getPriceTrend(props.city, props.region, props.range);
    const payload = res && res.code === 200 ? res.data : null;

    const dates = Array.isArray(payload?.dates) ? payload.dates : [];
    const prices = Array.isArray(payload?.avgPrices) ? payload.avgPrices : [];
    const normalizedPrices = prices.map((item) => Number(item) || 0);

    if (chart) {
      chart.setOption({
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis' },
        grid: { left: 40, right: 20, top: 24, bottom: 26 },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: { lineStyle: { color: '#64748b' } },
          axisLabel: { color: '#cbd5e1', fontSize: 11 },
          data: dates.length > 0 ? dates : [],
        },
        yAxis: {
          type: 'value',
          axisLine: { show: false },
          splitLine: { lineStyle: { color: 'rgba(148,163,184,0.25)' } },
          axisLabel: { 
            color: '#cbd5e1', 
            fontSize: 11,
            formatter: (value) => value >= 10000 ? `${(value / 10000).toFixed(1)}万` : value,
          },
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
            data: normalizedPrices,
          },
        ],
      });
    }
  } catch (error) {
    console.error('加载价格趋势数据失败:', error);
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

watch([() => props.city, () => props.region, () => props.range], () => {
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
