import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function AvailabilityManagement() {
  const [schedule, setSchedule] = useState([
    { day: 'Monday', active: true, start: '08:00', end: '18:00' },
    { day: 'Tuesday', active: true, start: '08:00', end: '18:00' },
    { day: 'Wednesday', active: true, start: '08:00', end: '18:00' },
    { day: 'Thursday', active: true, start: '08:00', end: '18:00' },
    { day: 'Friday', active: true, start: '08:00', end: '18:00' },
    { day: 'Saturday', active: true, start: '09:00', end: '15:00' },
    { day: 'Sunday', active: false, start: '10:00', end: '14:00' },
  ]);

  const toggleDay = (idx) => {
    const updated = [...schedule];
    updated[idx].active = !updated[idx].active;
    setSchedule(updated);
  };

  const save = () => {
    toast.success("Weekly availability schedule updated successfully!");
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Availability Schedule</h1>
          <p className="text-gray-500">Configure your operating hours for automated customer booking slots.</p>
        </div>
        <Button variant="primary" onClick={save}>Save Schedule</Button>
      </div>

      <Card className="p-6 divide-y divide-gray-100">
        {schedule.map((slot, idx) => (
          <div key={slot.day} className="py-3 flex items-center justify-between">
            <div className="w-32">
              <span className="font-semibold text-gray-900">{slot.day}</span>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={slot.active}
                onChange={() => toggleDay(idx)}
                className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <span className={`text-sm ${slot.active ? 'text-gray-700' : 'text-gray-400'}`}>
                {slot.active ? 'Available' : 'Unavailable'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={slot.start}
                disabled={!slot.active}
                className="border rounded p-1 text-sm disabled:opacity-50"
                readOnly
              />
              <span className="text-gray-400">to</span>
              <input
                type="time"
                value={slot.end}
                disabled={!slot.active}
                className="border rounded p-1 text-sm disabled:opacity-50"
                readOnly
              />
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

