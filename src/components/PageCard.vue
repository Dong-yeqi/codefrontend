<!-- src/components/PageCard.vue -->
<template>
  <div class="card page-card">
    <div class="page-card-header">
      <div class="page-card-label">{{ title }}</div>
      <div v-if="$slots.extra" class="page-card-extra">
        <slot name="extra" />
      </div>
    </div>
    <div v-if="$slots.default" class="page-card-slot">
      <slot />
    </div>
    <div v-else class="page-card-value">{{ value }}</div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
  value: {
    type: [String, Number],
    default: '',
  },
});
</script>

<style scoped>
.page-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.page-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.page-card-label {
  font-size: 13px;
  color: #94a3b8;
}

.page-card-extra :deep(button) {
  font-size: 13px;
  padding: 6px 12px;
}

.page-card-value {
  font-size: 30px;
  font-weight: 700;
  color: #f9fafb;
  letter-spacing: 0.04em;
}

.page-card-slot {
  flex: 1;
}
</style>
