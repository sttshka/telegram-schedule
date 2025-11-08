import { ref, onMounted } from 'vue';
import { supabase } from '~/utils/supabase';

const profile = ref<any>(null);

export function useProfile() {
  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();

    profile.value = data;
  }

  async function setRole(role: 'creator' | 'subscriber') {
    if (!profile.value) return;
    await supabase.from('profiles').update({ role }).eq('id', profile.value.id);
    profile.value.role = role;
  }

  onMounted(loadProfile);

  return { profile, loadProfile, setRole };
}
