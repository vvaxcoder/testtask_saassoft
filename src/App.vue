<template>
  <div class="container">
    <div class="header">
      <h1>Учетные записи</h1>
      <el-button type="primary" :icon="Plus" @click="addAccount" />
    </div>

    <el-alert
      title="Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;"
      type="info"
      show-icon
      class="mb-4 custom-alert"
    />

    <el-table 
        :data="accounts"
        height="400px"
        class="no-row-borders">
      <el-table-column prop="labels" label="Метки">
        <template #default="{ $index }">
          <el-input
            maxlength="50"
            v-model="labelInputs[$index]"
            placeholder="Метки через ;"
            show-word-limit
            @blur="onLabelBlur($index)"
          />
        </template>
      </el-table-column>

      <el-table-column prop="type" label="Тип записи">
        <template #default="{ row, $index }">
          <el-select v-model="row.type" placeholder="Тип записи" @change="onTypeChange($index)">
            <el-option label="LDAP" value="LDAP" />
            <el-option label="Локальная" value="Local" />
          </el-select>
        </template>
      </el-table-column>

      <el-table-column prop="login" label="Логин">
        <template #default="{ row, $index }">
          <el-input
            v-model="row.login"
            placeholder="Логин"
            @blur="validateLogin($index)"
            :error="errors[$index]"
        />
        </template>
      </el-table-column>

      <el-table-column prop="password" label="Пароль">
        <template #default="{ row, $index }">
          <el-input
            v-if="row.type === 'Local'"
            type="password"
            v-model="row.password"
            placeholder="Пароль"
            show-password
            @blur="validatePassword($index)"
            :error="errors[$index]"
          />
        </template>
      </el-table-column>

      <el-table-column label="" width="50" align="right">
        <template #default="{ $index }">
          <el-button link @click="deleteAccount($index)">
            <el-icon><Delete /></el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useAccountsStore, type Account } from '@/stores/account';
import { Delete, Plus } from '@element-plus/icons-vue';

const userStore = useAccountsStore();
userStore.loadFromStorage();
const { accounts } = storeToRefs(userStore);

const labelInputs = ref<string[]>([]);
const errors = ref([]);

const addAccount = () => {
  userStore.addAccount();
  labelInputs.value.push('');
};

const deleteAccount = (index: number) => {
  userStore.deleteAccount(index);
  labelInputs.value.splice(index, 1);
};

function updateAccount(index: number, data: Partial<Account>) {
  userStore.updateAccount(index, data);
}

function onLabelBlur(index: number) {
  const parsed = labelInputs.value[index]
    .split(';')
    .map((text) => ({ text: text.trim() }))
    .filter((x) => x.text);

  updateAccount(index, { labels: parsed });
}

function onTypeChange(index: number) {
  const account = accounts.value[index];
  const type = account.type;
  const password = type === 'LDAP' ? null : '';

  updateAccount(index, { type, password });
}

function validateLogin(index: number) {
  const account = accounts.value[index];
   const login = account.login;

  if (!login || login.length > 100) {
    alert('Логин обязателен и должен быть меньше 100 символов.');
  }
}

function validatePassword(index: number) {
  const account = accounts.value[index];

  if (account.type === 'Local' && (!account.password || account.password.length > 100)) {
    alert('Пароль обязателен и должен быть меньше 100 символов.');
  }
}

onMounted(() => {
  userStore.loadFromStorage();

  labelInputs.value = userStore.accounts.map((acc) => acc.labels.map((l) => l.text).join(';'));
});
</script>

<style scoped>
.container {
  min-height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  width: 100%;
}

.mb-4 {
  width: 100%;

  margin-bottom: 16px;
}

.el-table {
  width: 100%;
}

.custom-alert span {
  font-size: 11px;
}

.no-row-borders :deep(.el-table__row) {
  border-top: none !important;
  border-bottom: none !important;
}

.del-btn {
  width: 40px !important;
}
</style>
