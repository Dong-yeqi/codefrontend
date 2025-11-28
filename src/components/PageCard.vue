<!-- src/components/PageCard.vue -->
<template>
  <div class="card page-card">
    <div class="page-card-label">{{ title }}</div>
    <div class="page-card-value">{{ value }}</div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [String, Number],
});
</script>

<style scoped>
.page-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.page-card-label {
  font-size: 13px;
  color: #94a3b8;
  margin-bottom: 6px;
}

.page-card-value {
  font-size: 30px;
  font-weight: 700;
  color: #f9fafb;
  letter-spacing: 0.04em;
}
</style>
