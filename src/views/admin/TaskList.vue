<template>
  <div class="task-page">
    <PageCard title="爬虫任务管理">
      <template #extra>
        <button @click="openCreate">新增任务</button>
      </template>

      <table class="task-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>任务名称</th>
            <th>站点</th>
            <th>城市</th>
            <th>区域</th>
            <th>最大页数</th>
            <th>启用</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="tasks.length === 0">
            <td colspan="9" class="empty">暂无任务</td>
          </tr>

          <tr v-for="task in tasks" :key="task.id">
            <td>{{ task.id }}</td>
            <td>{{ task.taskName }}</td>
            <td>{{ task.targetSite }}</td>
            <td>{{ task.city }}</td>
            <td>{{ task.region }}</td>
            <td>{{ task.maxPage }}</td>
            <td>{{ task.enabled === 1 ? '是' : '否' }}</td>
            <td>{{ task.createTime || '-' }}</td>
            <td>
              <button @click="openEdit(task)">编辑</button>
              <button class="danger" @click="onDelete(task.id)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </PageCard>

    <!-- 简单弹窗表单 -->
    <div v-if="showDialog" class="dialog-mask">
      <div class="dialog">
        <h3>{{ form.id ? '编辑任务' : '新增任务' }}</h3>

        <div class="form-row">
          <label>任务名称：</label>
          <input v-model="form.taskName" placeholder="如：成都二手房（贝壳）" />
        </div>

        <div class="form-row">
          <label>站点：</label>
          <select v-model="form.targetSite">
            <option value="beike">贝壳</option>
            <option value="anjuke">安居客</option>
          </select>
        </div>

        <div class="form-row">
          <label>城市：</label>
          <input v-model="form.city" placeholder="如：成都" />
        </div>

        <div class="form-row">
          <label>区域：</label>
          <input v-model="form.region" placeholder="可选" />
        </div>

        <div class="form-row">
          <label>最大页数：</label>
          <input type="number" v-model.number="form.maxPage" min="1" />
        </div>

        <div class="form-row">
          <label>是否启用：</label>
          <select v-model.number="form.enabled">
            <option :value="1">启用</option>
            <option :value="0">禁用</option>
          </select>
        </div>

        <div class="dialog-actions">
          <button @click="onSave">保存</button>
          <button @click="closeDialog">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import PageCard from '../../components/PageCard.vue';

// ⭐ 修复：使用实际存在的 API（listTasks），删除 fetchTasks
import { listTasks, saveTask, deleteTask } from '../../api/task';

const tasks = ref([]);

const showDialog = ref(false);

// 表单字段与后端实体一致
const form = reactive({
  id: null,
  taskName: '',
  targetSite: 'beike',
  city: '',
  region: '',
  maxPage: 5,
  enabled: 1,
});

// 重置表单
const resetForm = () => {
  form.id = null;
  form.taskName = '';
  form.targetSite = 'beike';
  form.city = '';
  form.region = '';
  form.maxPage = 5;
  form.enabled = 1;
};

// ⭐ 修复：使用 listTasks() 加载任务
const loadTasks = async () => {
  const res = await listTasks();
  if (res.data && res.data.code === 200) {
    tasks.value = res.data.data || [];
  }
};

const openCreate = () => {
  resetForm();
  showDialog.value = true;
};

const openEdit = (task) => {
  form.id = task.id;
  form.taskName = task.taskName;
  form.targetSite = task.targetSite;
  form.city = task.city;
  form.region = task.region;
  form.maxPage = task.maxPage;
  form.enabled = task.enabled;
  showDialog.value = true;
};

const closeDialog = () => {
  showDialog.value = false;
};

// 保存任务
const onSave = async () => {
  if (!form.taskName.trim() || !form.city.trim()) {
    alert('任务名称和城市必填');
    return;
  }
  await saveTask({ ...form });
  showDialog.value = false;
  await loadTasks();
};

// 删除任务
const onDelete = async (id) => {
  if (!confirm('确定删除该任务？')) return;
  await deleteTask(id);
  await loadTasks();
};

onMounted(loadTasks);
</script>

<style scoped>
.task-page {
  max-width: 1100px;
  margin: 0 auto;
}

.task-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.task-table th,
.task-table td {
  border: 1px solid rgba(148, 163, 184, 0.4);
  padding: 6px 8px;
  text-align: center;
}

.task-table th {
  background: rgba(15, 23, 42, 0.9);
}

.empty {
  text-align: center;
  padding: 16px 0;
}

button {
  padding: 3px 8px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  margin: 0 3px;
  background: #38bdf8;
  color: #020617;
}

button.danger {
  background: #f97373;
  color: #111827;
}

.dialog-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog {
  background: #020617;
  padding: 16px;
  border-radius: 8px;
  min-width: 340px;
  border: 1px solid #4b5563;
}

.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.form-row label {
  width: 90px;
  font-size: 14px;
}

.form-row input,
.form-row select {
  flex: 1;
  padding: 4px 6px;
  background: #020617;
  border: 1px solid #4b5563;
  border-radius: 4px;
  color: #e5e7eb;
}

.dialog-actions {
  text-align: right;
  margin-top: 12px;
}
</style>
