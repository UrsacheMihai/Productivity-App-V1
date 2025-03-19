import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { syncDataToGitHub } from './githubUtils';

// --- Type Definitions ---
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
    days: number[]; // Days of week as numbers (0 for Sunday ... 6 for Saturday)
    completed: boolean;
    lastCompleted?: string;
}

interface Store {
    tasks: Task[];
    timetable: TimeTableEntry[];
    events: Event[];
    routines: DailyRoutine[];

    // Task actions
    addTask: (task: Task) => void;
    removeTask: (id: string) => void;
    toggleTask: (id: string) => void;

    // Timetable actions
    addTimetableEntry: (entry: TimeTableEntry) => void;
    removeTimetableEntry: (id: string) => void;
    updateTimetableEntry: (id: string, entry: Partial<TimeTableEntry>) => void;

    // Event actions
    addEvent: (event: Event) => void;
    removeEvent: (id: string) => void;
    updateEvent: (id: string, event: Partial<Event>) => void;

    // Routine actions
    addRoutine: (routine: DailyRoutine) => void;
    removeRoutine: (id: string) => void;
    toggleRoutine: (id: string) => void;

    // Sync data with GitHub
    syncData: () => void;
}

export const useStore = create<Store>()(
    persist(
        (set, get) => ({
            tasks: [],
            timetable: [],
            events: [],
            routines: [],

            // Task methods
            addTask: (task) => {
                set((state) => ({ tasks: [...state.tasks, task] }));
                get().syncData(); // Sync data after adding task
            },
            removeTask: (id) => {
                set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) }));
                get().syncData(); // Sync data after removing task
            },
            toggleTask: (id) => {
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === id ? { ...task, completed: !task.completed } : task
                    ),
                }));
                get().syncData(); // Sync data after toggling task
            },

            // Timetable methods
            addTimetableEntry: (entry) => {
                set((state) => ({ timetable: [...state.timetable, entry] }));
                get().syncData(); // Sync data after adding timetable entry
            },
            removeTimetableEntry: (id) => {
                set((state) => ({ timetable: state.timetable.filter((entry) => entry.id !== id) }));
                get().syncData(); // Sync data after removing timetable entry
            },
            updateTimetableEntry: (id, updatedEntry) => {
                set((state) => ({
                    timetable: state.timetable.map((entry) =>
                        entry.id === id ? { ...entry, ...updatedEntry } : entry
                    ),
                }));
                get().syncData(); // Sync data after updating timetable entry
            },

            // Event methods
            addEvent: (event) => {
                set((state) => ({ events: [...state.events, event] }));
                get().syncData(); // Sync data after adding event
            },
            removeEvent: (id) => {
                set((state) => ({ events: state.events.filter((event) => event.id !== id) }));
                get().syncData(); // Sync data after removing event
            },
            updateEvent: (id, updatedEvent) => {
                set((state) => ({
                    events: state.events.map((event) =>
                        event.id === id ? { ...event, ...updatedEvent } : event
                    ),
                }));
                get().syncData(); // Sync data after updating event
            },

            // Routine methods
            addRoutine: (routine) => {
                set((state) => ({ routines: [...state.routines, routine] }));
                get().syncData(); // Sync data after adding routine
            },
            removeRoutine: (id) => {
                set((state) => ({ routines: state.routines.filter((routine) => routine.id !== id) }));
                get().syncData(); // Sync data after removing routine
            },
            toggleRoutine: (id) => {
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
                }));
                get().syncData(); // Sync data after toggling routine
            },

            // GitHub sync method
            syncData: async () => {
                const state = get();
                const data = {
                    tasks: state.tasks,
                    timetable: state.timetable,
                    events: state.events,
                    routines: state.routines,
                };

                // Sync the data with GitHub
                await syncDataToGitHub(data);
            },
        }),
        { name: 'productivity-storage' }
    )
);
