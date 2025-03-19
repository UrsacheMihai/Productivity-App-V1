import React from 'react';
import { useStore } from '../store/useStore';

function Home() {
  const { timetable, events } = useStore();
  const today = new Date().getDay();
  
  const todaysClasses = timetable
    .filter((entry) => entry.dayOfWeek === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const todaysEvents = events
    .filter((event) => {
      const eventDate = new Date(event.date).toDateString();
      const currentDate = new Date().toDateString();
      return eventDate === currentDate;
    })
    .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Today's Classes */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Today's Classes</h2>
        {todaysClasses.length > 0 ? (
          <div className="space-y-4">
            {todaysClasses.map((entry) => (
              <div
                key={entry.id}
                className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition"
              >
                <div className="font-semibold text-lg">{entry.subject}</div>
                <div className="text-gray-300">
                  Room {entry.room} • {entry.startTime} - {entry.endTime}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No classes scheduled for today</p>
        )}
      </div>

      {/* Today's Events */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Today's Schedule</h2>
        {todaysEvents.length > 0 ? (
          <div className="space-y-4">
            {todaysEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition"
              >
                <div className="font-semibold text-lg">{event.title}</div>
                <div className="text-gray-300">
                  {event.startTime && event.endTime
                    ? `${event.startTime} - ${event.endTime}`
                    : 'All day'}
                </div>
                {event.description && (
                  <div className="text-sm text-gray-400 mt-2">
                    {event.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No events scheduled for today</p>
        )}
      </div>
    </div>
  );
}

export default Home;