export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: 'school' | 'work' | 'personal';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export interface TimeTableEntry {
  id: string;
  subject: string;
  room: string;
  startTime: string;
  endTime: string;
  dayOfWeek: number;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  type: 'exam' | 'deadline' | 'meeting' | 'other';
  description?: string;
}

export interface DailyRoutine {
  id: string;
  title: string;
  time: string;
  days: number[];
  completed: boolean;
  lastCompleted?: string;
}