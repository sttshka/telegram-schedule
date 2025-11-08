import { ref, onMounted } from 'vue';
import { parseISO, format, addDays } from 'date-fns';
import type { DayState, DayKind } from '~/types/calendar';
import { useRouter, useRoute } from 'vue-router';

const days = ref<Record<string, DayState>>({});
const template = ref<DayState | null>(null);

export function useCalendar() {
  const router = useRouter();
  const route = useRoute();

  // Инициализация по умолчанию
  const viewDate = ref(format(new Date(), 'yyyy-MM-dd'));

  const editingIso = ref<string | null>(null);

  // Синхронизация с query на клиенте
  onMounted(() => {
    if (route.query.viewDate && typeof route.query.viewDate === 'string') {
      viewDate.value = route.query.viewDate;
    }
  });

  // ——— управление видом ———
  function setView(date: string) {
    viewDate.value = date;
    router.replace({ query: { ...route.query, viewDate: date } });
  }

  // ——— работа с днями ———
  function updateDay(day: DayState) {
    if (day.kind === 'none') {
      delete day.start;
      delete day.end;
    }
    days.value[day.date] = { ...day };
  }

  // ——— шаблон дня ———
  function setTemplate(day: DayState) {
    template.value = { ...day };
  }

  function getTemplate() {
    return template.value;
  }

  // ——— массовое применение паттернов ———
  function applyPattern(startIso: string, pattern: '5_2' | '2_2') {
    const start = parseISO(startIso);
    const cycle = pattern === '5_2' ? [5, 2] : [2, 2];
    let currentKind: DayKind = 'work';
    let workLeft = cycle[0];
    let restLeft = cycle[1];
    let isWork = true;

    for (let i = 0; i < 60; i++) {
      const d = addDays(start, i);
      const iso = format(d, 'yyyy-MM-dd');
      days.value[iso] = {
        date: iso,
        kind: currentKind,
        start: currentKind === 'work' ? (template.value?.start ?? '09:00') : undefined,
        end: currentKind === 'work' ? (template.value?.end ?? '18:00') : undefined,
        comments: 0,
      };

      if (isWork) {
        workLeft--;
        if (workLeft === 0) {
          isWork = false;
          currentKind = 'off';
          workLeft = cycle[0];
        }
      } else {
        restLeft--;

        if (restLeft === 0) {
          isWork = true;
          currentKind = 'work';
          restLeft = cycle[1];
        }
      }
    }
  }

  return {
    viewDate,
    editingIso,
    days,
    setView,
    updateDay,
    setTemplate,
    getTemplate,
    applyPattern,
  };
}
