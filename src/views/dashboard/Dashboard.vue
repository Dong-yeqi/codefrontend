<!-- src/views/Dashboard.vue -->
<template>
  <MainLayout>
    <!-- 顶部统计卡片 -->
    <div class="stats-row">
      <PageCard title="今日新增房源" :value="stats.today" />
      <PageCard title="本周新增" :value="stats.week" />
      <PageCard title="本月新增" :value="stats.month" />
      <PageCard title="累计房源" :value="stats.total" />
    </div>

    <!-- 图表网格 -->
    <div class="chart-grid">
      <div class="card">
        <div class="section-title">区域房源占比</div>
        <AreaPieChart :city="city" />
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
        <RegionBarChart :city="city" />
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';
import PageCard from '@/components/PageCard.vue';
import AreaPieChart from '@/charts/AreaPieChart.vue';
import LayoutPieChart from '@/charts/LayoutPieChart.vue';
import PriceTrendChart from '@/charts/PriceTrendChart.vue';
import RegionBarChart from '@/charts/RegionBarChart.vue';

// 重点：使用新的接口 getOverview（替代 getStats）
import { getOverview } from '@/api/stats';

const stats = ref({
  today: 0,
  week: 0,
  month: 0,
  total: 0,
});

const city = '成都'; // 你可以后续做成下拉框

onMounted(async () => {
  try {
    const data = await getOverview(city);

    if (data) {
      stats.value.today = data.today || 0;
      stats.value.week = data.week || 0;
      stats.value.month = data.month || 0;
      stats.value.total = data.total || 0;
    }
  } catch (e) {
    console.error('获取统计数据失败', e);
  }
});
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
