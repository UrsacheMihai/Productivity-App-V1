// store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getFileContent, getFileSha, updateFileContent, decodeBase64, encodeBase64 } from './githubUtils';

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
    // GitHub sync methods
    loadData: () => void;
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
            addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
            removeTask: (id) =>
                set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) })),
            toggleTask: (id) =>
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === id ? { ...task, completed: !task.completed } : task
                    ),
                })),
            // Timetable methods
            addTimetableEntry: (entry) =>
                set((state) => ({ timetable: [...state.timetable, entry] })),
            removeTimetableEntry: (id) =>
                set((state) => ({ timetable: state.timetable.filter((entry) => entry.id !== id) })),
            updateTimetableEntry: (id, updatedEntry) =>
                set((state) => ({
                    timetable: state.timetable.map((entry) =>
                        entry.id === id ? { ...entry, ...updatedEntry } : entry
                    ),
                })),
            // Event methods
            addEvent: (event) =>
                set((state) => ({ events: [...state.events, event] })),
            removeEvent: (id) =>
                set((state) => ({ events: state.events.filter((event) => event.id !== id) })),
            updateEvent: (id, updatedEvent) =>
                set((state) => ({
                    events: state.events.map((event) =>
                        event.id === id ? { ...event, ...updatedEvent } : event
                    ),
                })),
            // Routine methods
            addRoutine: (routine) =>
                set((state) => ({ routines: [...state.routines, routine] })),
            removeRoutine: (id) =>
                set((state) => ({ routines: state.routines.filter((routine) => routine.id !== id) })),
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
            // Load data from GitHub (data.json)
            loadData: async () => {
                const content = await getFileContent();
                if (content) {
                    try {
                        const decoded = decodeBase64(content);
                        const jsonData = JSON.parse(decoded);
                        set({
                            tasks: jsonData.tasks || [],
                            timetable: jsonData.timetable || [],
                            events: jsonData.events || [],
                            routines: jsonData.routines || [],
                        });
                    } catch (err) {
                        console.error('Error parsing GitHub JSON data:', err);
                    }
                }
            },
            // Sync current state to GitHub (update data.json)
            syncData: async () => {
                const state = get();
                const data = {
                    tasks: state.tasks,
                    timetable: state.timetable,
                    events: state.events,
                    routines: state.routines,
                };
                const encodedContent = encodeBase64(JSON.stringify(data));
                const sha = await getFileSha();
                if (sha) {
                    await updateFileContent(encodedContent, sha);
                } else {
                    console.error('Could not fetch file SHA; sync aborted.');
                }
            },
        }),
        { name: 'productivity-storage' }
    )
);
