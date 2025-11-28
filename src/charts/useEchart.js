// src/charts/useEchart.js （可选）
import { onMounted, onBeforeUnmount, ref } from 'vue';
import * as echarts from 'echarts';

export function useEchart(optionGetter) {
  const domRef = ref(null);
  let chart;

  onMounted(() => {
    chart = echarts.init(domRef.value, null, { renderer: 'canvas' });
    const option = optionGetter();
    chart.setOption(option);
    window.addEventListener('resize', resize);
  });

  function resize() {
    chart && chart.resize();
  }

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resize);
    chart && chart.dispose();
  });

  return domRef;
}
