import React, { useState, useEffect } from 'react';
import { Plus, RotateCcw, CheckCircle2, Circle, Pencil, Trash2, Calendar, Clock } from 'lucide-react';
import { useStore } from '../lib/store';
import type { Task, Routine } from '../lib/types';
import { format } from 'date-fns';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';
import RoutineForm from '../components/RoutineForm';

const TodoList = () => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'routines'>('tasks');
  const { tasks, routines, loading, error, fetchTasks, fetchRoutines, updateTask, deleteTask, deleteRoutine } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Task | Routine | null>(null);

  useEffect(() => {
    fetchTasks();
    fetchRoutines();
  }, [fetchTasks, fetchRoutines]);

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>Error loading data. Please try again.</p>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    if (activeTab === 'tasks') {
      await deleteTask(id);
    } else {
      await deleteRoutine(id);
    }
  };

  const handleEdit = (item: Task | Routine) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const toggleTaskComplete = async (task: Task) => {
    await updateTask(task.id, { completed: !task.completed });
  };

  const renderTasks = () => {
    if (loading) {
      return <div className="text-center py-8">Loading tasks...</div>;
    }

    if (tasks.length === 0) {
      return (
        <div className="text-center py-8 text-gray-600">
          <p className="mb-4">No tasks yet. Create your first task!</p>
          <button
            onClick={handleAdd}
            className="btn btn-primary flex items-center space-x-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Add Task</span>
          </button>
        </div>
      );
    }

    return tasks.map((task: Task) => (
      <div 
        key={task.id} 
        className={`task-card flex items-center justify-between transition-all duration-200 hover:shadow-md ${
          task.completed ? 'bg-gray-50' : ''
        }`}
      >
        <div className="flex items-center space-x-4 flex-grow">
          <button
            onClick={() => toggleTaskComplete(task)}
            className="focus:outline-none"
            title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {task.completed ? (
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            ) : (
              <Circle className="w-6 h-6 text-gray-400 hover:text-gray-600" />
            )}
          </button>
          <div className="flex-grow">
            <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-500'}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            )}
            {task.due_date && (
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Due: {format(new Date(task.due_date), 'MMM d, yyyy')}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            task.priority === 'high' ? 'bg-red-100 text-red-800' :
            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {task.priority}
          </span>
          <button
            onClick={() => handleEdit(task)}
            className="p-1.5 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50"
            title="Edit task"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(task.id)}
            className="p-1.5 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    ));
  };

  const renderRoutines = () => {
    if (loading) {
      return <div className="text-center py-8">Loading routines...</div>;
    }

    if (routines.length === 0) {
      return (
        <div className="text-center py-8 text-gray-600">
          <p className="mb-4">No routines yet. Create your first routine!</p>
          <button
            onClick={handleAdd}
            className="btn btn-primary flex items-center space-x-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Add Routine</span>
          </button>
        </div>
      );
    }

    return routines.map((routine: Routine) => (
      <div key={routine.id} className="task-card transition-all duration-200 hover:shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex-grow">
            <h3 className="font-medium ">{routine.title}</h3>
            {routine.description && (
              <p className="text-sm text-gray-600 mt-1">{routine.description}</p>
            )}
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center text-sm text-gray-500">
                <RotateCcw className="w-4 h-4 mr-1" />
                <span>{routine.frequency.charAt(0).toUpperCase() + routine.frequency.slice(1)}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                <span>{routine.time_of_day}</span>
              </div>
            </div>
            {routine.frequency === 'weekly' && routine.days_of_week.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {routine.days_of_week.map(day => (
                  <span
                    key={day}
                    className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs"
                  >
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              routine.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {routine.active ? 'Active' : 'Inactive'}
            </span>
            <button
              onClick={() => handleEdit(routine)}
              className="p-1.5 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50"
              title="Edit routine"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(routine.id)}
              className="p-1.5 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50"
              title="Delete routine"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tasks & Routines</h1>
        <button
          onClick={handleAdd}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add {activeTab === 'tasks' ? 'Task' : 'Routine'}</span>
        </button>
      </header>

      <div className="flex space-x-4 border-b border-gray-200">
        <button
          className={`px-4 py-2 font-medium transition-colors duration-200 ${
            activeTab === 'tasks'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
          onClick={() => setActiveTab('tasks')}
        >
          Tasks
        </button>
        <button
          className={`px-4 py-2 font-medium flex items-center space-x-2 transition-colors duration-200 ${
            activeTab === 'routines'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
          onClick={() => setActiveTab('routines')}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Routines</span>
        </button>
      </div>

      <div className="grid gap-4">
        {activeTab === 'tasks' ? renderTasks() : renderRoutines()}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
        }}
        title={`${selectedItem ? 'Edit' : 'Create'} ${activeTab === 'tasks' ? 'Task' : 'Routine'}`}
      >
        {activeTab === 'tasks' ? (
          <TaskForm
            task={selectedItem as Task}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedItem(null);
            }}
          />
        ) : (
          <RoutineForm
            routine={selectedItem as Routine}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedItem(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default TodoList;