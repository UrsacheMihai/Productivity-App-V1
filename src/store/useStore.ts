import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, TimeTableEntry, Event, DailyRoutine } from '../types';

interface Store {
  tasks: Task[];
  timetable: TimeTableEntry[];
  events: Event[];
  routines: DailyRoutine[];
  addTask: (task: Task) => void;
  removeTask: (id: string) => void;
  toggleTask: (id: string) => void;
  addTimetableEntry: (entry: TimeTableEntry) => void;
  removeTimetableEntry: (id: string) => void;
  updateTimetableEntry: (id: string, entry: Partial<TimeTableEntry>) => void;
  addEvent: (event: Event) => void;
  removeEvent: (id: string) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  addRoutine: (routine: DailyRoutine) => void;
  removeRoutine: (id: string) => void;
  toggleRoutine: (id: string) => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      tasks: [],
      timetable: [],
      events: [],
      routines: [],
      
      addTask: (task) =>
        set((state) => ({ tasks: [...state.tasks, task] })),
      
      removeTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        })),
      
      addTimetableEntry: (entry) =>
        set((state) => ({
          timetable: [...state.timetable, entry],
        })),
      
      removeTimetableEntry: (id) =>
        set((state) => ({
          timetable: state.timetable.filter((entry) => entry.id !== id),
        })),
      
      updateTimetableEntry: (id, updatedEntry) =>
        set((state) => ({
          timetable: state.timetable.map((entry) =>
            entry.id === id ? { ...entry, ...updatedEntry } : entry
          ),
        })),
      
      addEvent: (event) =>
        set((state) => ({ events: [...state.events, event] })),
      
      removeEvent: (id) =>
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
        })),
      
      updateEvent: (id, updatedEvent) =>
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id ? { ...event, ...updatedEvent } : event
          ),
        })),

      addRoutine: (routine) =>
        set((state) => ({ routines: [...state.routines, routine] })),

      removeRoutine: (id) =>
        set((state) => ({
          routines: state.routines.filter((routine) => routine.id !== id),
        })),

      toggleRoutine: (id) =>
        set((state) => ({
          routines: state.routines.map((routine) =>
            routine.id === id
              ? {
                  ...routine,
                  completed: !routine.completed,
                  lastCompleted: !routine.completed ? new Date().toISOString() : routine.lastCompleted,
                }
              : routine
          ),
        })),
    }),
    {
      name: 'productivity-storage',
    }
  )
);