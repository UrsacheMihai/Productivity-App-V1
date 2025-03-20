import React, { useState } from 'react';
import { useStore } from '../lib/store';
import type { TimetableEntry } from '../lib/types';

interface TimetableFormProps {
  entry?: TimetableEntry;
  onClose: () => void;
}

const TimetableForm: React.FC<TimetableFormProps> = ({ entry, onClose }) => {
  const { createTimetableEntry, updateTimetableEntry } = useStore();
  const [formData, setFormData] = useState({
    title: entry?.title || '',
    day_of_week: entry?.day_of_week || 'monday',
    start_time: entry?.start_time || '',
    end_time: entry?.end_time || '',
    room: entry?.room || '',
    color: entry?.color || '#3B82F6',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const entryData = {
        title: formData.title,
        day_of_week: formData.day_of_week,
        start_time: formData.start_time,
        end_time: formData.end_time,
        room: formData.room || null,
        color: formData.color,
      };

      if (entry) {
        await updateTimetableEntry(entry.id, entryData);
      } else {
        await createTimetableEntry(entryData);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save timetable entry:', error);
    }
  };

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          Class Name
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="input mt-1"
          required
        />
      </div>

      <div>
        <label htmlFor="day_of_week" className="block text-sm font-medium">
          Day of Week
        </label>
        <select
          id="day_of_week"
          value={formData.day_of_week}
          onChange={(e) => setFormData({ ...formData, day_of_week: e.target.value as TimetableEntry['day_of_week'] })}
          className="input mt-1"
        >
          {daysOfWeek.map((day) => (
            <option key={day} value={day} className="capitalize">
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="start_time" className="block text-sm font-medium">
          Start Time
        </label>
        <input
          type="time"
          id="start_time"
          value={formData.start_time}
          onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
          className="input mt-1"
          required
        />
      </div>

      <div>
        <label htmlFor="end_time" className="block text-sm font-medium">
          End Time
        </label>
        <input
          type="time"
          id="end_time"
          value={formData.end_time}
          onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
          className="input mt-1"
          required
        />
      </div>

      <div>
        <label htmlFor="room" className="block text-sm font-medium">
          Room Number (Optional)
        </label>
        <input
          type="text"
          id="room"
          value={formData.room}
          onChange={(e) => setFormData({ ...formData, room: e.target.value })}
          className="input mt-1"
          placeholder="Add room number..."
        />
      </div>

      <div>
        <label htmlFor="color" className="block text-sm font-medium">
          Color
        </label>
        <input
          type="color"
          id="color"
          value={formData.color}
          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
          className="h-10 w-full rounded-md border border-input p-1 bg-background"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
        >
          {entry ? 'Update Class' : 'Add Class'}
        </button>
      </div>
    </form>
  );
};

export default TimetableForm;