export type DayKind = 'work' | 'off' | 'none';

export interface DayState {
  /** Дата в формате ISO (например, '2025-11-02') */
  date: string;

  /** Тип дня — рабочий, выходной или очищенный */
  kind: DayKind;

  /** Время начала работы (например, '09:00') */
  start?: string;

  /** Время окончания работы (например, '18:00') */
  end?: string;

  /** Количество комментариев к этому дню */
  comments?: number;
}
