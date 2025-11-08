<template>
  <div>
    <!-- Заголовки дней недели -->
    <div class="grid grid-cols-7 gap-2">
      <div
        v-for="weekday in weekNames"
        :key="weekday"
        class="text-center text-[11px] font-medium text-gray-500"
      >
        {{ weekday }}
      </div>
    </div>

    <!-- Дни -->
    <div class="mt-2 grid grid-cols-7 gap-2">
      <DayCell
        v-for="iso in daysList"
        :key="iso"
        :day="days[iso] || { date: iso, kind: 'none', comments: 0 }"
        :active="props.iso === iso"
        @select="onSelect"
        @edit="onEdit"
        @openComments="onOpenComments"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import DayCell from '~/components/DayCell.vue';
import { useCalendar } from '~/composables/useCalendar';
import { parseISO, startOfMonth, startOfWeek, addDays, format } from 'date-fns';

interface Props {
  viewDate: string;
  iso: string | null;
}
const props = defineProps<Props>();

const { days } = useCalendar();

// Заголовки дней недели
const weekNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

// Список дней месяца (6 недель по 7 дней = 42)
const daysList = computed(() => {
  const list: string[] = [];
  const center = parseISO(props.viewDate);
  const start = startOfWeek(startOfMonth(center), { weekStartsOn: 1 });

  for (let i = 0; i < 42; i++) {
    const iso = format(addDays(start, i), 'yyyy-MM-dd');
    if (!days.value[iso]) days.value[iso] = { date: iso, kind: 'none', comments: 0 };
    list.push(iso);
  }

  return list;
});

// События для DayCell
function onSelect(iso: string) {
  window.dispatchEvent(new CustomEvent('select-day', { detail: iso }));
}
function onEdit(iso: string) {
  window.dispatchEvent(new CustomEvent('edit-day', { detail: iso }));
}
function onOpenComments(iso: string) {
  window.dispatchEvent(new CustomEvent('comments-day', { detail: iso }));
}
</script>
