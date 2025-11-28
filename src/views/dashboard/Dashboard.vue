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

    <!-- 控制栏 -->
    <div class="card control-bar">
      <div class="control-group">
        <label>选择城市</label>
        <select v-model="city">
          <option v-for="item in cityOptions" :key="item" :value="item">
            {{ item }}
          </option>
        </select>
      </div>

      <div class="control-group">
        <label>价格区间</label>
        <select v-model="priceRange">
          <option v-for="range in priceRanges" :key="range.value" :value="range.value">
            {{ range.label }}
          </option>
        </select>
      </div>

      <div class="control-group metric-group">
        <label>区域统计</label>
        <div class="metric-toggle">
          <button
            v-for="metric in metricOptions"
            :key="metric.value"
            :class="['metric-btn', metric.value === regionMetric ? 'active' : '']"
            @click="regionMetric = metric.value"
          >
            {{ metric.label }}
          </button>
        </div>
      </div>

      <button class="btn refresh-btn" @click="loadOverview">刷新概览</button>
    </div>

    <!-- 图表网格 -->
    <div class="chart-grid">
      <div class="card span-6">
        <div class="section-title">区域房源占比</div>
        <AreaPieChart :city="city" :metric="regionMetric" />
      </div>
      <div class="card span-6">
        <div class="section-title">户型结构分布</div>
        <LayoutPieChart :city="city" />
      </div>
      <div class="card span-12 tall">
        <div class="section-title">价格走势</div>
        <PriceTrendChart :city="city" :range="priceRange" />
      </div>
      <div class="card span-12 tall">
        <div class="section-title">热门区域{{ regionMetric === 'count' ? '房源数' : '均价' }}</div>
        <RegionBarChart :city="city" :metric="regionMetric" />
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

const cityOptions = ['成都', '北京', '上海', '广州', '深圳', '重庆'];
const priceRanges = [
  { label: '近 1 个月', value: '1m' },
  { label: '近 3 个月', value: '3m' },
  { label: '近 1 年', value: '1y' },
];
const metricOptions = [
  { label: '按房源数', value: 'count' },
  { label: '按均价', value: 'avgPrice' },
];

const city = ref('成都');
const priceRange = ref('3m');
const regionMetric = ref('count');

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

.control-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  align-items: center;
  margin-bottom: 24px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 150px;
}

.control-group label {
  font-size: 13px;
  color: #94a3b8;
}

.control-group select {
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-radius: 8px;
  color: #e2e8f0;
  padding: 6px 10px;
}

.metric-group {
  flex: 1;
  min-width: 200px;
}

.metric-toggle {
  display: inline-flex;
  background: rgba(15, 23, 42, 0.6);
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.4);
  padding: 4px;
  gap: 4px;
}

.metric-btn {
  border: none;
  background: transparent;
  color: #94a3b8;
  padding: 6px 14px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s ease;
}

.metric-btn.active {
  background: linear-gradient(135deg, #3b82f6, #7c3aed);
  color: #fff;
}

.refresh-btn {
  margin-left: auto;
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 22px;
  align-items: stretch;
}

.chart-grid .card {
  min-height: 320px;
  display: flex;
  flex-direction: column;
}

.chart-grid .card.tall {
  min-height: 360px;
}

.span-6 {
  grid-column: span 6;
}

.span-12 {
  grid-column: span 12;
}

@media (max-width: 1100px) {
  .span-6,
  .span-12 {
    grid-column: span 12;
  }
}

.chart-grid .card :deep(.chart-root) {
  flex: 1;
}
</style>
