import React, { useState } from 'react';
import { useStore } from '../lib/store';
import type { Routine } from '../lib/types';

interface RoutineFormProps {
  routine?: Routine;
  onClose: () => void;
}

const RoutineForm: React.FC<RoutineFormProps> = ({ routine, onClose }) => {
  const { createRoutine, updateRoutine } = useStore();
  const [formData, setFormData] = useState({
    title: routine?.title || '',
    description: routine?.description || '',
    frequency: routine?.frequency || 'daily',
    days_of_week: routine?.days_of_week || [],
    time_of_day: routine?.time_of_day || '',
    active: routine?.active ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const routineData = {
        title: formData.title,
        description: formData.description || null,
        frequency: formData.frequency,
        days_of_week: formData.frequency === 'weekly' ? formData.days_of_week : [],
        time_of_day: formData.time_of_day,
        active: formData.active,
      };

      if (routine) {
        await updateRoutine(routine.id, routineData);
      } else {
        await createRoutine(routineData);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save routine:', error);
    }
  };

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          Title
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
        <label htmlFor="description" className="block text-sm font-medium">
          Description (Optional)
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="input mt-1"
          rows={3}
          placeholder="Add details about your routine..."
        />
      </div>

      <div>
        <label htmlFor="frequency" className="block text-sm font-medium">
          Frequency
        </label>
        <select
          id="frequency"
          value={formData.frequency}
          onChange={(e) => setFormData({ ...formData, frequency: e.target.value as Routine['frequency'] })}
          className="input mt-1"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {formData.frequency === 'weekly' && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Days of Week
          </label>
          <div className="space-y-2">
            {daysOfWeek.map((day) => (
              <label key={day} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.days_of_week.includes(day)}
                  onChange={(e) => {
                    const newDays = e.target.checked
                      ? [...formData.days_of_week, day]
                      : formData.days_of_week.filter((d) => d !== day);
                    setFormData({ ...formData, days_of_week: newDays });
                  }}
                  className="h-4 w-4 text-primary rounded border-input"
                />
                <span className="ml-2 text-sm capitalize">{day}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <label htmlFor="time_of_day" className="block text-sm font-medium">
          Time of Day
        </label>
        <input
          type="time"
          id="time_of_day"
          value={formData.time_of_day}
          onChange={(e) => setFormData({ ...formData, time_of_day: e.target.value })}
          className="input mt-1"
          required
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="active"
          checked={formData.active}
          onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
          className="h-4 w-4 text-primary rounded border-input"
        />
        <label htmlFor="active" className="ml-2 text-sm">
          Active
        </label>
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
          {routine ? 'Update Routine' : 'Create Routine'}
        </button>
      </div>
    </form>
  );
};

export default RoutineForm;