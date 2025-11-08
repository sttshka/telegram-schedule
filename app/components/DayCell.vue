<template>
  <div
    class="relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border text-xs transition-all select-none"
    :class="cellClass"
    @click="onClick"
    @mouseenter="showTooltip = true"
    @mouseleave="showTooltip = false"
  >
    <div class="font-semibold">{{ dayNum }}</div>

    <!-- Рабочее время -->
    <div v-if="day.start && day.end" class="text-[10px] text-gray-600">
      {{ day.start }}–{{ day.end }}
    </div>

    <!-- Комментарии -->
    <div
      v-if="day.comments && day.comments > 0"
      class="absolute right-1 bottom-1 flex items-center gap-1"
    >
      <span class="i-lucide:message-circle text-[14px]"></span>
      <span class="text-[10px]">{{ day.comments }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useRole } from '~/composables/useRole';
import type { DayState } from '~/types/calendar';

interface Props {
  day: DayState;
  active?: boolean;
}
const props = defineProps<Props>();

const { role } = useRole();

const showTooltip = ref(false);

const dateObj = computed(() => parseISO(props.day.date));
const dayNum = computed(() => format(dateObj.value, 'd'));
const isToday = computed(
  () => format(dateObj.value, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
);

const cellClass = computed(() => {
  let string = '';

  if (props.day.kind === 'work') {
    string = 'bg-red-100 border-red-400';
  } else if (props.day.kind === 'off') {
    string = 'bg-green-100 border-green-400';
  } else {
    string = 'bg-white border-gray-200';
  }

  string += isToday.value ? ' !bg-blue-50' : '';
  string += props.active ? ' outline outline-2 outline-blue-500' : '';

  return string;
});

function onClick() {
  if (role.value === 'creator') {
    const ev = new CustomEvent('edit-day', { detail: props.day.date });
    window.dispatchEvent(ev);
  } else {
    const ev = new CustomEvent('select-day', { detail: props.day.date });
    window.dispatchEvent(ev);
  }
}
</script>
