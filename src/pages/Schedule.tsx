import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, MapPin, Plus, Pencil, Trash2 } from 'lucide-react';
import { useStore } from '../lib/store';
import type { Event, TimetableEntry } from '../lib/types';
import Modal from '../components/Modal';
import EventForm from '../components/EventForm';
import TimetableForm from '../components/TimetableForm';

const Schedule = () => {
  const [activeView, setActiveView] = useState<'calendar' | 'timetable'>('calendar');
  const {
    events,
    timetable,
    loading,
    error,
    fetchEvents,
    fetchTimetable,
    deleteEvent,
    deleteTimetableEntry
  } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Event | TimetableEntry | null>(null);
  const today = new Date();

  useEffect(() => {
    fetchEvents();
    fetchTimetable();
  }, [fetchEvents, fetchTimetable]);

  const handleDelete = async (id: string) => {
    if (activeView === 'calendar') {
      await deleteEvent(id);
    } else {
      await deleteTimetableEntry(id);
    }
  };

  const handleEdit = (item: Event | TimetableEntry) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>Error loading data. Please try again.</p>
      </div>
    );
  }

  const renderEvents = () => {
    if (loading) {
      return <div className="text-center py-8">Loading events...</div>;
    }

    if (events.length === 0) {
      return (
        <div className="text-center py-8 text-gray-600">
          <p className="mb-4">No events scheduled. Add your first event!</p>
          <button
            onClick={handleAdd}
            className="btn btn-primary flex items-center space-x-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Add Event</span>
          </button>
        </div>
      );
    }

    return events.map((event: Event) => (
      <div
        key={event.id}
        className="p-4 rounded-lg mb-4 transition-all duration-200 hover:shadow-md"
        style={{ backgroundColor: `${event.color}15`, borderLeft: `4px solid ${event.color}` }}
      >
        <div className="flex justify-between items-start">
          <div className="flex-grow">
            <h3 className="font-medium text-gray-900">{event.title}</h3>
            {event.description && (
              <p className="text-sm text-gray-600 mt-1">{event.description}</p>
            )}
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <CalendarIcon className="w-4 h-4 mr-1" />
              <span>{format(new Date(event.start_time), 'MMM d, h:mm a')} - {format(new Date(event.end_time), 'h:mm a')}</span>
            </div>
            {event.location && (
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{event.location}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={() => handleEdit(event)}
              className="p-1.5 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50"
              title="Edit event"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(event.id)}
              className="p-1.5 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50"
              title="Delete event"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    ));
  };

  const renderTimetable = () => {
    if (loading) {
      return <div className="text-center py-8">Loading timetable...</div>;
    }

    if (timetable.length === 0) {
      return (
        <div className="text-center py-8 text-gray-600">
          <p className="mb-4">No classes in your timetable. Add your first class!</p>
          <button
            onClick={handleAdd}
            className="btn btn-primary flex items-center space-x-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Add Class</span>
          </button>
        </div>
      );
    }

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    return days.map(day => {
      const dayClasses = timetable.filter(
        (entry: TimetableEntry) => entry.day_of_week === day
      );

      if (dayClasses.length === 0) return null;

      return (
        <div key={day} className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 capitalize mb-3">
            {day}
          </h3>
          <div className="space-y-3">
            {dayClasses.map((entry: TimetableEntry) => (
              <div
                key={entry.id}
                className="p-4 rounded-lg transition-all duration-200 hover:shadow-md"
                style={{ backgroundColor: `${entry.color}15`, borderLeft: `4px solid ${entry.color}` }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-grow">
                    <h4 className="font-medium text-gray-900">{entry.title}</h4>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{entry.start_time} - {entry.end_time}</span>
                    </div>
                    {entry.room && (
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>Room {entry.room}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(entry)}
                      className="p-1.5 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                      title="Edit class"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-1.5 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50"
                      title="Delete class"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold ">Schedule</h1>
          <div className="text-gray-600 mt-1">
            <CalendarIcon className="w-5 h-5 inline mr-2" />
            {format(today, 'MMMM d, yyyy')}
          </div>
        </div>
        <button
          onClick={handleAdd}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add {activeView === 'calendar' ? 'Event' : 'Class'}</span>
        </button>
      </header>

      <div className="flex space-x-4 border-b border-gray-200">
        <button
          className={`px-4 py-2 font-medium transition-colors duration-200 ${
            activeView === 'calendar'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
          onClick={() => setActiveView('calendar')}
        >
          Calendar
        </button>
        <button
          className={`px-4 py-2 font-medium flex items-center space-x-2 transition-colors duration-200 ${
            activeView === 'timetable'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
          onClick={() => setActiveView('timetable')}
        >
          <Clock className="w-4 h-4" />
          <span>Timetable</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {activeView === 'calendar' ? renderEvents() : renderTimetable()}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
        }}
        title={`${selectedItem ? 'Edit' : 'Add'} ${activeView === 'calendar' ? 'Event' : 'Class'}`}
      >
        {activeView === 'calendar' ? (
          <EventForm
            event={selectedItem as Event}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedItem(null);
            }}
          />
        ) : (
          <TimetableForm
            entry={selectedItem as TimetableEntry}
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

export default Schedule;