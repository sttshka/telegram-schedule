import { ref } from 'vue';
import { supabase } from '~/utils/supabase';
import type { DayState } from '~/types/calendar';

export function useEvents(scheduleId: string) {
  const events = ref<Record<string, DayState>>({});

  async function loadMonth(year: number, month: number) {
    const start = `${year}-${String(month).padStart(2, '0')}-01`;
    const end = `${year}-${String(month + 1).padStart(2, '0')}-01`;

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('schedule_id', scheduleId)
      .gte('date', start)
      .lt('date', end);

    if (!error && data) {
      for (const e of data) {
        events.value[e.date] = {
          date: e.date,
          kind: e.kind,
          start: e.start_time || undefined,
          end: e.end_time || undefined,
          comments: 0, // потом обновим из comments
        };
      }
    }
  }

  async function saveEvent(day: DayState) {
    await supabase.from('events').upsert({
      schedule_id: scheduleId,
      date: day.date,
      kind: day.kind,
      start_time: day.start,
      end_time: day.end,
    });
  }

  return { events, loadMonth, saveEvent };
}
