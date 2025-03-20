import { create } from 'zustand';
import { supabase } from './supabase';
import type { Task, Routine, Event, TimetableEntry } from './types';
import toast from 'react-hot-toast';

interface AppState {
  user: any;
  tasks: Task[];
  routines: Routine[];
  events: Event[];
  timetable: TimetableEntry[];
  loading: boolean;
  error: string | null;
  initAuth: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  fetchTasks: () => Promise<void>;
  fetchRoutines: () => Promise<void>;
  fetchEvents: () => Promise<void>;
  fetchTimetable: () => Promise<void>;
  createTask: (task: Omit<Task, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  createRoutine: (routine: Omit<Routine, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  updateRoutine: (id: string, routine: Partial<Routine>) => Promise<void>;
  deleteRoutine: (id: string) => Promise<void>;
  createEvent: (event: Omit<Event, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  createTimetableEntry: (entry: Omit<TimetableEntry, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  updateTimetableEntry: (id: string, entry: Partial<TimetableEntry>) => Promise<void>;
  deleteTimetableEntry: (id: string) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  tasks: [],
  routines: [],
  events: [],
  timetable: [],
  loading: false,
  error: null,

  initAuth: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      set({ user });

      // Set up auth state change listener
      supabase.auth.onAuthStateChange((_event, session) => {
        set({ user: session?.user || null });
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true });
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Signed in successfully');
    } catch (error) {
      toast.error('Failed to sign in');
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (email: string, password: string) => {
    try {
      set({ loading: true });
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      toast.success('Account created successfully');
    } catch (error) {
      toast.error('Failed to create account');
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      set({ loading: true });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, tasks: [], routines: [], events: [], timetable: [] });
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  fetchTasks: async () => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ tasks: data || [], error: null });
    } catch (error) {
      set({ error: (error as Error).message });
      toast.error('Failed to fetch tasks');
    } finally {
      set({ loading: false });
    }
  },

  fetchRoutines: async () => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from('routines')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ routines: data || [], error: null });
    } catch (error) {
      set({ error: (error as Error).message });
      toast.error('Failed to fetch routines');
    } finally {
      set({ loading: false });
    }
  },

  fetchEvents: async () => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_time', { ascending: true });

      if (error) throw error;
      set({ events: data || [], error: null });
    } catch (error) {
      set({ error: (error as Error).message });
      toast.error('Failed to fetch events');
    } finally {
      set({ loading: false });
    }
  },

  fetchTimetable: async () => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from('timetable')
        .select('*')
        .order('day_of_week', { ascending: true });

      if (error) throw error;
      set({ timetable: data || [], error: null });
    } catch (error) {
      set({ error: (error as Error).message });
      toast.error('Failed to fetch timetable');
    } finally {
      set({ loading: false });
    }
  },

  createTask: async (task) => {
    const { user } = get();
    if (!user) {
      toast.error('Please sign in to create tasks');
      return;
    }

    try {
      set({ loading: true });
      const { error } = await supabase.from('tasks').insert([{
        ...task,
        user_id: user.id
      }]);
      if (error) throw error;
      get().fetchTasks();
      toast.success('Task created successfully');
    } catch (error) {
      toast.error('Failed to create task');
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  updateTask: async (id, task) => {
    const { user } = get();
    if (!user) {
      toast.error('Please sign in to update tasks');
      return;
    }

    try {
      set({ loading: true });
      const { error } = await supabase
        .from('tasks')
        .update(task)
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) throw error;
      get().fetchTasks();
      toast.success('Task updated successfully');
    } catch (error) {
      toast.error('Failed to update task');
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  deleteTask: async (id) => {
    const { user } = get();
    if (!user) {
      toast.error('Please sign in to delete tasks');
      return;
    }

    try {
      set({ loading: true });
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) throw error;
      get().fetchTasks();
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  createRoutine: async (routine) => {
    const { user } = get();
    if (!user) {
      toast.error('Please sign in to create routines');
      return;
    }

    try {
      set({ loading: true });
      const { error } = await supabase.from('routines').insert([{
        ...routine,
        user_id: user.id
      }]);
      if (error) throw error;
      get().fetchRoutines();
      toast.success('Routine created successfully');
    } catch (error) {
      toast.error('Failed to create routine');
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  updateRoutine: async (id, routine) => {
    const { user } = get();
    if (!user) {
      toast.error('Please sign in to update routines');
      return;
    }

    try {
      set({ loading: true });
      const { error } = await supabase
        .from('routines')
        .update(routine)
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) throw error;
      get().fetchRoutines();
      toast.success('Routine updated successfully');
    } catch (error) {
      toast.error('Failed to update routine');
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  deleteRoutine: async (id) => {
    const { user } = get();
    if (!user) {
      toast.error('Please sign in to delete routines');
      return;
    }

    try {
      set({ loading: true });
      const { error } = await supabase
        .from('routines')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) throw error;
      get().fetchRoutines();
      toast.success('Routine deleted successfully');
    } catch (error) {
      toast.error('Failed to delete routine');
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  createEvent: async (event) => {
    const { user } = get();
    if (!user) {
      toast.error('Please sign in to create events');
      return;
    }

    try {
      set({ loading: true });
      const { error } = await supabase.from('events').insert([{
        ...event,
        user_id: user.id
      }]);
      if (error) throw error;
      get().fetchEvents();
      toast.success('Event created successfully');
    } catch (error) {
      toast.error('Failed to create event');
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  updateEvent: async (id, event) => {
    const { user } = get();
    if (!user) {
      toast.error('Please sign in to update events');
      return;
    }

    try {
      set({ loading: true });
      const { error } = await supabase
        .from('events')
        .update(event)
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) throw error;
      get().fetchEvents();
      toast.success('Event updated successfully');
    } catch (error) {
      toast.error('Failed to update event');
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  deleteEvent: async (id) => {
    const { user } = get();
    if (!user) {
      toast.error('Please sign in to delete events');
      return;
    }

    try {
      set({ loading: true });
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) throw error;
      get().fetchEvents();
      toast.success('Event deleted successfully');
    } catch (error) {
      toast.error('Failed to delete event');
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  createTimetableEntry: async (entry) => {
    const { user } = get();
    if (!user) {
      toast.error('Please sign in to create timetable entries');
      return;
    }

    try {
      set({ loading: true });
      const { error } = await supabase.from('timetable').insert([{
        ...entry,
        user_id: user.id
      }]);
      if (error) throw error;
      get().fetchTimetable();
      toast.success('Timetable entry created successfully');
    } catch (error) {
      toast.error('Failed to create timetable entry');
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  updateTimetableEntry: async (id, entry) => {
    const { user } = get();
    if (!user) {
      toast.error('Please sign in to update timetable entries');
      return;
    }

    try {
      set({ loading: true });
      const { error } = await supabase
        .from('timetable')
        .update(entry)
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) throw error;
      get().fetchTimetable();
      toast.success('Timetable entry updated successfully');
    } catch (error) {
      toast.error('Failed to update timetable entry');
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  deleteTimetableEntry: async (id) => {
    const { user } = get();
    if (!user) {
      toast.error('Please sign in to delete timetable entries');
      return;
    }

    try {
      set({ loading: true });
      const { error } = await supabase
        .from('timetable')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) throw error;
      get().fetchTimetable();
      toast.success('Timetable entry deleted successfully');
    } catch (error) {
      toast.error('Failed to delete timetable entry');
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
}));