// Scheduler.tsx
import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Calendar, Clock, Trash2, BookOpen } from 'lucide-react';

function Scheduler() {
  const { events, timetable, addEvent, removeEvent, addTimetableEntry, removeTimetableEntry, loadData } = useStore();

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  const [showTimetableModal, setShowTimetableModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);

  // Event form state
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    type: 'other' as const,
    description: '',
  });

  // Timetable entry form state
  const [newEntry, setNewEntry] = useState({
    subject: '',
    room: '',
    startTime: '',
    endTime: '',
    dayOfWeek: 1,
  });

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return;

    addEvent({
      id: crypto.randomUUID(),
      ...newEvent,
    });

    setNewEvent({
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      type: 'other',
      description: '',
    });
    setShowEventModal(false);
  };

  const handleAddTimetableEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.subject || !newEntry.room) return;

    addTimetableEntry({
      id: crypto.randomUUID(),
      ...newEntry,
    });

    setNewEntry({
      subject: '',
      room: '',
      startTime: '',
      endTime: '',
      dayOfWeek: 1,
    });
    setShowTimetableModal(false);
  };

  const getDayName = (day: number) => {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day];
  };

  const sortedTimetable = [...timetable].sort((a, b) => {
    if (a.dayOfWeek === b.dayOfWeek) {
      return a.startTime.localeCompare(b.startTime);
    }
    return a.dayOfWeek - b.dayOfWeek;
  });

  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
      <div className="bg-gray-900 min-h-screen p-4">
        {/* Action Buttons */}
        <div className="flex space-x-4 mb-8">
          <button
              onClick={() => setShowEventModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition"
          >
            <Calendar className="w-5 h-5" />
            <span>Add Event</span>
          </button>
          <button
              onClick={() => setShowTimetableModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition"
          >
            <BookOpen className="w-5 h-5" />
            <span>Edit Timetable</span>
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Timetable Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
              <Clock className="w-6 h-6 mr-2" />
              Weekly Timetable
            </h2>
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((day) => (
                  <div key={day} className="space-y-2">
                    <h3 className="text-lg font-semibold text-blue-400">{getDayName(day)}</h3>
                    {sortedTimetable
                        .filter((entry) => entry.dayOfWeek === day)
                        .map((entry) => (
                            <div
                                key={entry.id}
                                className="bg-white/5 rounded-lg p-4 flex items-center justify-between group hover:bg-white/10 transition"
                            >
                              <div>
                                <p className="font-semibold text-white">{entry.subject}</p>
                                <p className="text-sm text-gray-400">
                                  Room {entry.room} • {entry.startTime} - {entry.endTime}
                                </p>
                              </div>
                              <button
                                  onClick={() => removeTimetableEntry(entry.id)}
                                  className="text-red-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                        ))}
                  </div>
              ))}
            </div>
          </div>

          {/* Events Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
              <Calendar className="w-6 h-6 mr-2" />
              Upcoming Events
            </h2>
            <div className="space-y-4">
              {sortedEvents.map((event) => (
                  <div
                      key={event.id}
                      className="bg-white/5 rounded-lg p-4 flex items-center justify-between group hover:bg-white/10 transition"
                  >
                    <div>
                      <p className="font-semibold text-white">{event.title}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(event.date).toLocaleDateString()} •{' '}
                        {event.startTime && event.endTime ? `${event.startTime} - ${event.endTime}` : 'All day'}
                      </p>
                      {event.description && (
                          <p className="text-sm text-gray-400 mt-1">{event.description}</p>
                      )}
                    </div>
                    <button
                        onClick={() => removeEvent(event.id)}
                        className="text-red-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
              ))}
              {events.length === 0 && (
                  <p className="text-center text-gray-400 py-8">
                    No events scheduled. Add some events to get started!
                  </p>
              )}
            </div>
          </div>
        </div>

        {/* Add Event Modal */}
        {showEventModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <h3 className="text-xl font-bold mb-4 text-white">Add New Event</h3>
                <form onSubmit={handleAddEvent} className="space-y-4">
                  <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      placeholder="Event title"
                      className="w-full bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                  <input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="w-full bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                        type="time"
                        value={newEvent.startTime}
                        onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                        className="w-full bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    />
                    <input
                        type="time"
                        value={newEvent.endTime}
                        onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                        className="w-full bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    />
                  </div>
                  <select
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })}
                      className="w-full bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  >
                    <option value="exam">Exam</option>
                    <option value="deadline">Deadline</option>
                    <option value="meeting">Meeting</option>
                    <option value="other">Other</option>
                  </select>
                  <textarea
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      placeholder="Description (optional)"
                      className="w-full bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                  <div className="flex space-x-4">
                    <button
                        type="submit"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                    >
                      Add Event
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowEventModal(false)}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}

        {/* Add Timetable Entry Modal */}
        {showTimetableModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <h3 className="text-xl font-bold mb-4 text-white">Add Class to Timetable</h3>
                <form onSubmit={handleAddTimetableEntry} className="space-y-4">
                  <input
                      type="text"
                      value={newEntry.subject}
                      onChange={(e) => setNewEntry({ ...newEntry, subject: e.target.value })}
                      placeholder="Subject name"
                      className="w-full bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                  <input
                      type="text"
                      value={newEntry.room}
                      onChange={(e) => setNewEntry({ ...newEntry, room: e.target.value })}
                      placeholder="Room number"
                      className="w-full bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                  <select
                      value={newEntry.dayOfWeek}
                      onChange={(e) => setNewEntry({ ...newEntry, dayOfWeek: parseInt(e.target.value) })}
                      className="w-full bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  >
                    <option value={1}>Monday</option>
                    <option value={2}>Tuesday</option>
                    <option value={3}>Wednesday</option>
                    <option value={4}>Thursday</option>
                    <option value={5}>Friday</option>
                  </select>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                        type="time"
                        value={newEntry.startTime}
                        onChange={(e) => setNewEntry({ ...newEntry, startTime: e.target.value })}
                        className="w-full bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    />
                    <input
                        type="time"
                        value={newEntry.endTime}
                        onChange={(e) => setNewEntry({ ...newEntry, endTime: e.target.value })}
                        className="w-full bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                        type="submit"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                    >
                      Add to Timetable
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowTimetableModal(false)}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
                    >
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

export default Scheduler;
