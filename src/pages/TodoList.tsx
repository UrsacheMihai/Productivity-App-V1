// TodoList.tsx
import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { ListTodo, Plus, Trash2, CheckCircle2, Circle, Repeat, Clock } from 'lucide-react';

function TodoList() {
  const { tasks, routines, addTask, removeTask, toggleTask, addRoutine, removeRoutine, toggleRoutine } = useStore();

  const [newTask, setNewTask] = useState('');
  const [category, setCategory] = useState<'school' | 'work' | 'personal'>('personal');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');

  const [showRoutineModal, setShowRoutineModal] = useState(false);
  const [newRoutine, setNewRoutine] = useState({
    title: '',
    time: '',
    days: [] as number[],
  });

  // Add Task Handler
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    addTask({
      id: crypto.randomUUID(),
      title: newTask,
      completed: false,
      category,
      priority,
      dueDate: dueDate || undefined,
    });

    setNewTask('');
    setDueDate('');
  };

  // Add Routine Handler
  const handleAddRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoutine.title.trim() || !newRoutine.time || newRoutine.days.length === 0) return;

    addRoutine({
      id: crypto.randomUUID(),
      title: newRoutine.title,
      time: newRoutine.time,
      days: newRoutine.days,
      completed: false,
    });

    setNewRoutine({ title: '', time: '', days: [] });
    setShowRoutineModal(false);
  };

  // Toggle a day for routine repeat
  const toggleDay = (day: number) => {
    setNewRoutine(prev => ({
      ...prev,
      days: prev.days.includes(day) ? prev.days.filter(d => d !== day) : [...prev.days, day].sort((a, b) => a - b)
    }));
  };

  // Calculate progress for tasks
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks ? (completedTasks / totalTasks) * 100 : 0;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-300';
    }
  };

  const getDayName = (day: number) => {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day];
  };

  // Reset routines at start of day if needed
  useEffect(() => {
    routines.forEach(routine => {
      if (routine.completed) {
        const last = new Date(routine.lastCompleted || 0);
        const today = new Date();
        if (
            last.getDate() !== today.getDate() ||
            last.getMonth() !== today.getMonth() ||
            last.getFullYear() !== today.getFullYear()
        ) {
          toggleRoutine(routine.id);
        }
      }
    });
  }, [routines, toggleRoutine]);

  return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Progress and Routines */}
        <div className="md:col-span-1">
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 shadow-xl">
            <div className="flex items-center justify-center mb-6">
              <ListTodo className="w-8 h-8 text-blue-400" />
              <h2 className="text-2xl font-bold ml-2">Task Progress</h2>
            </div>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-blue-500/30 text-blue-200">
                Progress
              </span>
                <span className="text-xs font-semibold inline-block text-blue-200">
                {progressPercentage.toFixed(0)}%
              </span>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
                <div
                    style={{ width: `${progressPercentage}%` }}
                    className="flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
                />
              </div>
            </div>
            <div className="text-center mt-4">
              <p className="text-lg text-blue-100">
                {completedTasks} of {totalTasks} tasks completed
              </p>
            </div>
            {/* Routines Section */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center text-blue-100">
                  <Repeat className="w-5 h-5 mr-2" />
                  Daily Routines
                </h3>
                <button
                    onClick={() => setShowRoutineModal(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg flex items-center space-x-1 transition text-sm shadow-lg hover:shadow-purple-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
              <div className="space-y-3">
                {routines.map(routine => (
                    <div
                        key={routine.id}
                        className={`bg-gray-700/50 rounded-lg p-3 flex items-center justify-between group hover:bg-gray-700/80 transition shadow-lg`}
                    >
                      <div className="flex items-center space-x-3">
                        <button
                            onClick={() => toggleRoutine(routine.id)}
                            className="text-blue-400 hover:text-blue-300 transition"
                        >
                          {routine.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                        </button>
                        <div>
                          <p className={routine.completed ? 'line-through text-gray-400' : 'text-blue-100'}>
                            {routine.title}
                          </p>
                          <div className="flex items-center text-sm text-gray-300 space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{routine.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-xs text-gray-300">
                          {routine.days.map(day => getDayName(day)[0]).join(', ')}
                        </div>
                        <button onClick={() => removeRoutine(routine.id)} className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                ))}
                {routines.length === 0 && (
                    <p className="text-center text-gray-300 py-4">
                      No routines set. Add some daily routines to get started!
                    </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="md:col-span-2">
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-blue-100">Tasks</h2>
            </div>
            {/* Add Task Form */}
            <form onSubmit={handleAddTask} className="mb-6">
              <div className="flex flex-col space-y-4">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a new task..."
                    className="bg-gray-700/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-100 placeholder-gray-400"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="bg-gray-700/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-100"
                  >
                    <option value="personal">Personal</option>
                    <option value="work">Work</option>
                    <option value="school">School</option>
                  </select>
                  <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="bg-gray-700/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-100"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                  <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="bg-gray-700/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-100"
                  />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition shadow-lg hover:shadow-blue-500/20"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Task</span>
                </button>
              </div>
            </form>
            {/* Task List */}
            <div className="space-y-4">
              {tasks.map(task => (
                  <div
                      key={task.id}
                      className="bg-gray-700/50 rounded-lg p-4 flex items-center justify-between group hover:bg-gray-700/80 transition shadow-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <button onClick={() => toggleTask(task.id)} className="text-blue-400 hover:text-blue-300 transition">
                        {task.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                      </button>
                      <div>
                        <p className={`text-lg ${task.completed ? 'line-through text-gray-400' : 'text-blue-100'}`}>
                          {task.title}
                        </p>
                        <div className="flex space-x-4 text-sm">
                          <span className="text-gray-300">{task.category}</span>
                          <span className={getPriorityColor(task.priority)}>{task.priority} priority</span>
                          {task.dueDate && (
                              <span className="text-gray-300">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => removeTask(task.id)} className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
              ))}
              {tasks.length === 0 && (
                  <p className="text-center text-gray-300 py-8">
                    No tasks yet. Add some tasks to get started!
                  </p>
              )}
            </div>
          </div>
        </div>

        {/* Routine Modal */}
        {showRoutineModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-2xl">
                <h3 className="text-xl font-bold mb-4 text-blue-100">Add Daily Routine</h3>
                <form onSubmit={handleAddRoutine} className="space-y-4">
                  <input
                      type="text"
                      value={newRoutine.title}
                      onChange={(e) => setNewRoutine({ ...newRoutine, title: e.target.value })}
                      placeholder="Routine title"
                      className="w-full bg-gray-700/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-100 placeholder-gray-400"
                  />
                  <input
                      type="time"
                      value={newRoutine.time}
                      onChange={(e) => setNewRoutine({ ...newRoutine, time: e.target.value })}
                      className="w-full bg-gray-700/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-100"
                  />
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Repeat on days:</label>
                    <div className="grid grid-cols-7 gap-2">
                      {[0, 1, 2, 3, 4, 5, 6].map(day => (
                          <button
                              key={day}
                              type="button"
                              onClick={() => toggleDay(day)}
                              className={`p-2 rounded-lg text-sm font-medium transition shadow-lg ${
                                  newRoutine.days.includes(day)
                                      ? 'bg-blue-600 text-white shadow-blue-500/20'
                                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700/80'
                              }`}
                          >
                            {getDayName(day)[0]}
                          </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition shadow-lg hover:shadow-blue-500/20">
                      Add Routine
                    </button>
                    <button type="button" onClick={() => setShowRoutineModal(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition shadow-lg">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}
      </div>
  );
}

export default TodoList;
