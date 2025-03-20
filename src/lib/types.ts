export type Task = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  due_date?: string;
  completed: boolean;
  created_at: string;
  priority: 'low' | 'medium' | 'high';
};

export type Routine = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  days_of_week: string[];
  time_of_day: string;
  created_at: string;
  active: boolean;
};

export type Event = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  created_at: string;
  color: string;
};

export type TimetableEntry = {
  id: string;
  user_id: string;
  title: string;
  day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  start_time: string;
  end_time: string;
  room?: string;
  created_at: string;
  color: string;
};