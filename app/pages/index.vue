<template>
  <div class="min-h-screen bg-white p-4 sm:p-6">
    <header class="flex items-center justify-between">
      <h1 class="text-xl font-bold">Календарь</h1>
      <div class="flex items-center gap-2">
        <USelect v-model="roleLocal" :items="roleItems" />
      </div>
    </header>

    <main class="mt-4">
      <div class="flex items-center gap-2">
        <UButton @click="prev">
          <UIcon name="i-lucide-arrow-left" class="size-5" />
        </UButton>

        <div class="flex-1 text-center">
          <div class="text-sm">{{ monthTitle }}</div>
        </div>
        <UButton @click="next">
          <UIcon name="i-lucide-arrow-right" class="size-5" />
        </UButton>
      </div>

      <div class="mt-4">
        <CalendarGrid :viewDate="viewDate" :iso="editingIso" />
      </div>
    </main>

    <EditDrawer :iso="editingIso" :open="editingOpen" @close="closeEditor" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import CalendarGrid from '~/components/CalendarGrid.vue';
import EditDrawer from '~/components/EditDrawer.vue';
import { useCalendar } from '~/composables/useCalendar';
import { useRole } from '~/composables/useRole';
import { parseISO, addMonths, subMonths, format } from 'date-fns';
import { ru } from 'date-fns/locale';

const { viewDate, setView, editingIso } = useCalendar();
const { role, setRole } = useRole();

const editingOpen = ref(false);

const roleItems = ref([
  {
    label: 'Создатель',
    value: 'creator',
  },
  {
    label: 'Подписчик',
    value: 'subscriber',
  },
]);

onMounted(() => {
  window.addEventListener('edit-day', (e: any) => {
    if (role.value !== 'creator') return;
    editingIso.value = e.detail;
    editingOpen.value = true;
  });
});

function closeEditor() {
  editingOpen.value = false;
  editingIso.value = null;
}

const roleLocal = ref(role.value);
watch(
  () => roleLocal.value,
  (v) => setRole(v as any)
);

function prev() {
  const cur = parseISO(viewDate.value);
  const next = subMonths(cur, 1);
  setView(format(next, 'yyyy-MM-dd'));
}

function next() {
  const cur = parseISO(viewDate.value);
  const next = addMonths(cur, 1);
  setView(format(next, 'yyyy-MM-dd'));
}

const monthTitle = computed(() => {
  const d = parseISO(viewDate.value);
  return format(d, 'LLLL yyyy', { locale: ru });
});
</script>
