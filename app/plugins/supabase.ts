import { createClient } from '@supabase/supabase-js';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const supabaseUrl = config.public.supabaseUrl;
  const supabaseKey = config.public.supabasePublishableKey;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase environment variables not found!');
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.info('✅ Supabase client created via plugin');

  // Делаем клиент доступным во всём приложении:
  return {
    provide: {
      supabase,
    },
  };
});
