<!-- src/views/Dashboard.vue -->
<template>
  <MainLayout>
    <!-- 顶部统计卡片 -->
    <div class="stats-row">
      <PageCard title="当前均价" :value="formatPrice(stats.avgPrice)" />
      <PageCard title="房源数量" :value="formatCount(stats.houseCount)" />
      <PageCard title="最近抓取时间" :value="stats.lastUpdateTime || '--'" />
      <PageCard title="统计城市" :value="city" />
    </div>

    <!-- 图表网格 -->
    <div class="chart-grid">
      <div class="card">
        <div class="section-title">区域房源占比</div>
        <AreaPieChart :city="city" metric="count" />
      </div>
      <div class="card">
        <div class="section-title">户型结构分布</div>
        <LayoutPieChart :city="city" />
      </div>
      <div class="card">
        <div class="section-title">价格走势</div>
        <PriceTrendChart :city="city" />
      </div>
      <div class="card">
        <div class="section-title">热门区域房源数</div>
        <RegionBarChart :city="city" metric="count" />
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';
import PageCard from '@/components/PageCard.vue';
import AreaPieChart from '@/charts/AreaPieChart.vue';
import LayoutPieChart from '@/charts/LayoutPieChart.vue';
import PriceTrendChart from '@/charts/PriceTrendChart.vue';
import RegionBarChart from '@/charts/RegionBarChart.vue';

// 重点：使用新的接口 getOverview（替代 getStats）
import { getOverview } from '@/api/stats';

const stats = ref({
  avgPrice: 0,
  houseCount: 0,
  lastUpdateTime: '--',
});

const city = ref('成都'); // 可扩展为动态选择

const formatPrice = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return '--';
  return `${num.toLocaleString()} 元/㎡`;
};

const formatCount = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num) || num < 0) return '--';
  return num.toLocaleString();
};

const loadOverview = async () => {
  try {
    const res = await getOverview(city.value);
    if (res && res.code === 200 && res.data) {
      stats.value.avgPrice = Number(res.data.avgPrice) || 0;
      stats.value.houseCount = Number(res.data.houseCount) || 0;
      stats.value.lastUpdateTime = res.data.lastUpdateTime || '--';
    }
  } catch (e) {
    console.error('获取统计数据失败', e);
  }
};

onMounted(loadOverview);

watch(city, loadOverview);
</script>

<style scoped>
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
  align-items: stretch;
}

.chart-grid .card {
  height: 320px;
  display: flex;
  flex-direction: column;
}

.chart-grid .card :deep(.chart-root) {
  flex: 1;
}
</style>
