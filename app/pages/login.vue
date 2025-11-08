<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50">
    <div class="w-full max-w-sm space-y-4 rounded-lg bg-white p-6 shadow">
      <h1 class="text-center text-xl font-bold">Вход</h1>

      <button
        @click="telegramLogin"
        class="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
      >
        Войти через Telegram
      </button>

      <p v-if="auth.error" class="text-center text-sm text-red-500">{{ auth.error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

function telegramLogin() {
  console.log(window.Telegram);
  if (!window.Telegram?.WebApp) {
    alert('Telegram Web App не загружен!');
    return;
  }

  console.log(window.Telegram.WebApp.initData);

  const initData = window.Telegram.WebApp.initData || '';
  auth.signInWithTelegram(initData).then(() => {
    if (auth.user) router.push('/');
  });
}
</script>
