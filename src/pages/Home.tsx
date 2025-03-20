import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../lib/store';
import { Calendar, CheckSquare, Clock, BarChart2, ArrowRight, Circle, CheckCircle2, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';
import type { Task } from '../lib/types';

const Home = () => {
  const { tasks, routines, events, updateTask } = useStore();
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const today = new Date();

  // Calculate task completion rate
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Get today's events
  const todayEvents = events.filter(event => {
    const eventDate = new Date(event.start_time);
    return format(eventDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
  });

  // Get active routines
  const activeRoutines = routines.filter(routine => routine.active);

  const handleTaskComplete = async (task: Task) => {
    await updateTask(task.id, { completed: !task.completed });
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Welcome Back!</h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          {format(today, 'EEEE, MMMM d, yyyy')}
        </p>
      </header>

      {/* Progress Overview */}
      <section className="bg-card rounded-xl p-4 sm:p-6 shadow-sm border">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
          <BarChart2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-primary" />
          Task Progress
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span>{completedTasks} of {totalTasks} tasks completed</span>
            <span className="font-medium">{Math.round(completionRate)}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Events */}
        <section className="bg-card rounded-xl p-4 sm:p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold flex items-center">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-primary" />
              Today's Events
            </h2>
            <Link 
              to="/schedule" 
              className="text-primary hover:text-primary/80 p-2 hover:bg-primary/10 rounded-full"
              aria-label="View all events"
            >
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="space-y-3">
            {todayEvents.length === 0 ? (
              <p className="text-muted-foreground">No events scheduled for today</p>
            ) : (
              todayEvents.map(event => (
                <div
                  key={event.id}
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: `${event.color}15`, borderLeft: `4px solid ${event.color}` }}
                >
                  <h3 className="font-medium">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(event.start_time), 'h:mm a')} - 
                    {format(new Date(event.end_time), 'h:mm a')}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Active Routines */}
        <section className="bg-card rounded-xl p-4 sm:p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold flex items-center">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-primary" />
              Active Routines
            </h2>
            <Link 
              to="/todos" 
              className="text-primary hover:text-primary/80 p-2 hover:bg-primary/10 rounded-full"
              aria-label="View all routines"
            >
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="space-y-3">
            {activeRoutines.length === 0 ? (
              <p className="text-muted-foreground">No active routines</p>
            ) : (
              activeRoutines.map(routine => (
                <div key={routine.id} className="p-3 rounded-lg bg-secondary/50">
                  <h3 className="font-medium">{routine.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{routine.time_of_day}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Pending Tasks */}
        <section className="bg-card rounded-xl p-4 sm:p-6 shadow-sm border md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold flex items-center">
              <CheckSquare className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-primary" />
              Tasks
            </h2>
            <Link 
              to="/todos" 
              className="text-primary hover:text-primary/80 p-2 hover:bg-primary/10 rounded-full"
              aria-label="View all tasks"
            >
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <p className="text-muted-foreground">No tasks</p>
            ) : (
              tasks
                .slice(0, 5)
                .map(task => (
                  <div 
                    key={task.id} 
                    className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                      task.completed ? 'bg-secondary/30' : 'bg-secondary/50'
                    }`}
                  >
                    <div className="flex items-center min-w-0 flex-1 gap-3">
                      <button
                        onClick={() => handleTaskComplete(task)}
                        className="flex-shrink-0 focus:outline-none"
                        title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground hover:text-primary" />
                        )}
                      </button>
                      <div className="min-w-0 flex-1">
                        <h3 className={`font-medium truncate ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </h3>
                        {task.due_date && (
                          <p className="text-sm text-muted-foreground truncate">
                            Due: {format(new Date(task.due_date), 'MMM d')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="p-1.5 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10"
                        title="Edit task"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))
            )}
          </div>
        </section>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        title="Edit Task"
      >
        <TaskForm
          task={selectedTask!}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTask(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default Home;