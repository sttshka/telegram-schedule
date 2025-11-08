<template>
  <UDrawer
    :open="props.open"
    @close="emit('close')"
    :modal="false"
    title="Редактирование"
    :description="dayTitle"
  >
    <template #content>
      <div class="flex justify-between px-2">
        <h2 class="text-lg font-semibold">{{ dayTitle }}</h2>
        <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="emit('close')" />
      </div>
      <div class="space-y-3 px-2 py-2">
        <!-- Тип дня -->
        <div>
          <div class="flex gap-2">
            <UButton
              v-for="kind in ['work', 'off', 'none']"
              :key="kind"
              size="lg"
              :color="kind === 'work' ? 'error' : kind === 'off' ? 'success' : 'neutral'"
              :icon="
                kind === 'work'
                  ? 'i-lucide-clock'
                  : kind === 'off'
                    ? 'i-lucide-sun'
                    : 'i-lucide-trash'
              "
              class="w-full"
              :variant="!kind ? 'ghost' : 'solid'"
              @click="setKind(kind as any)"
            >
              {{ labelKind(kind) }}
            </UButton>
          </div>
        </div>

        <!-- Время -->
        <div v-if="day.kind === 'work'">
          <div class="mb-1 text-xs text-gray-500">Время работы:</div>
          <div class="flex w-full gap-2 [&>*]:w-full">
            <UInput v-model="day.start" type="time" size="sm" />
            <UInput v-model="day.end" type="time" size="sm" />
          </div>
        </div>

        <div class="border-t pt-3">
          <div class="mb-2 text-xs text-gray-500">Шаблон дня:</div>
          <div class="flex gap-2 [&>*]:w-full">
            <UButton
              v-if="getTemplate()"
              icon="i-lucide-picture-in-picture"
              size="sm"
              color="info"
              @click="applyTemplate"
            >
              Применить шаблон
            </UButton>
            <UButton icon="i-lucide-save" size="sm" @click="saveTemplate">Сохранить шаблон</UButton>
          </div>
        </div>

        <!-- Автоприменение -->
        <div class="border-t pt-3">
          <div class="mb-2 text-xs text-gray-500">Быстрое заполнение:</div>
          <div class="flex gap-2 [&>*]:w-full">
            <UButton @click="fillPattern('5_2')">Пятидневка</UButton>

            <UButton @click="fillPattern('2_2')">2 / 2</UButton>

            <UButton @click="fillPattern('2_2')">Свой шаблон</UButton>
          </div>
        </div>
      </div>
    </template>
  </UDrawer>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useCalendar } from '~/composables/useCalendar';
import type { DayState } from '~/types/calendar';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Props {
  open: boolean;
  iso: string | null;
}
const props = defineProps<Props>();
const emit = defineEmits(['close']);

const { days, updateDay, applyPattern, setTemplate, getTemplate } = useCalendar();

const day = computed<DayState>(() => {
  if (!props.iso) return { date: '', kind: 'none' };
  if (!days.value[props.iso]) days.value[props.iso] = { date: props.iso, kind: 'none' };
  return days.value[props.iso];
});

function labelKind(k: string) {
  if (k === 'work') return 'Рабочий';
  if (k === 'off') return 'Выходной';
  return 'Очистить';
}

function setKind(kind: 'work' | 'off' | 'none') {
  day.value.kind = kind;
  updateDay(day.value);
}

function saveTemplate() {
  setTemplate(day.value);
}
function applyTemplate() {
  const tmpl = getTemplate();
  if (tmpl) updateDay({ ...tmpl, date: day.value.date });
}
function fillPattern(pattern: '5_2' | '2_2') {
  if (props.iso) applyPattern(props.iso, pattern);
}

const dayTitle = computed(() => {
  if (!props.iso) return;

  const d = parseISO(day.value.date);
  return format(d, 'd MMMM', { locale: ru });
});
</script>
