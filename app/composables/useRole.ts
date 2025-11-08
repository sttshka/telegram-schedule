import { ref } from 'vue';

const role = ref<'creator' | 'subscriber'>('creator');

export function useRole() {
  function setRole(newRole: 'creator' | 'subscriber') {
    role.value = newRole;
  }

  return {
    role,
    setRole,
  };
}
