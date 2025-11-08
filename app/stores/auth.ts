import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function signInWithTelegram(initData: string) {
    loading.value = true;
    error.value = null;

    const { $supabase } = useNuxtApp();

    if (!$supabase) {
      error.value = 'Supabase не подключен';
      loading.value = false;
      return;
    }

    try {
      const { data, error: err } = await $supabase.auth.signInWithOAuth({
        provider: 'telegram',
        options: { queryParams: { initData } },
      });

      loading.value = false;

      if (err) {
        error.value = err.message;
      } else {
        user.value = data.user;
      }
    } catch (e: any) {
      error.value = e.message;
      loading.value = false;
    }
  }

  async function signOut() {
    const { $supabase } = useNuxtApp();
    if ($supabase) await $supabase.auth.signOut();
    user.value = null;
  }

  return { user, loading, error, signInWithTelegram, signOut };
});
