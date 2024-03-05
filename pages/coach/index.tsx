// pages/coach/index.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CoachDashboard = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const coachId = 1; // Placeholder coachId

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const [availableResponse, bookedResponse] = await Promise.all([
        axios.get('/api/slots/available'),
        axios.get('/api/slots/upcoming', { params: { coachId } }),
      ]);
      setAvailableSlots(availableResponse.data);
      setBookedSlots(bookedResponse.data.filter(slot => slot.booking));
      setMessage('');
    } catch (error) {
      console.error('Error fetching slots:', error);
      setMessage('Failed to fetch slots.');
    } finally {
      setLoading(false);
    }
  };

  const addSlot = async (e) => {
    e.preventDefault();
    setLoading(true);
    const startTime = new Date(`${date}T${time}`).toISOString();
  
    // Validation: Prevent adding slots at 11:00 PM
    if (time.startsWith('23')) {
      setMessage('Cannot add slots starting at 11:00 PM.');
      setLoading(false);
      return;
    }
  
    // Calculate the end time based on the start time + 2 hours
    const endTime = new Date(new Date(startTime).getTime() + 2 * 60 * 60 * 1000).toISOString();
  
    // Combine available and booked slots for comprehensive overlap checking
    const combinedSlots = [...availableSlots, ...bookedSlots];
  
    // Check for overlap
    const isOverlap = combinedSlots.some(slot => {
      const existingStart = new Date(slot.startTime).getTime();
      const existingEnd = new Date(slot.endTime).getTime();
      const newStart = new Date(startTime).getTime();
      const newEnd = new Date(endTime).getTime();
  
      // Check if new slot starts or ends during an existing slot
      const startsDuringExisting = newStart >= existingStart && newStart < existingEnd;
      const endsDuringExisting = newEnd > existingStart && newEnd <= existingEnd;
  
      // Check if an existing slot starts or ends during the new slot
      const existingStartsDuringNew = existingStart >= newStart && existingStart < newEnd;
      const existingEndsDuringNew = existingEnd > newStart && existingEnd <= newEnd;
  
      return startsDuringExisting || endsDuringExisting || existingStartsDuringNew || existingEndsDuringNew;
    });
  
    if (isOverlap) {
      setMessage('Slot overlaps with an existing slot.');
      setLoading(false);
      return;
    }
  
    // Proceed with adding the slot if there's no overlap
    try {
      await axios.post('/api/slots/add', { coachId, startTime, endTime });
      fetchSlots(); // Refresh the slots lists
      setMessage('Slot successfully added.');
    } catch (error) {
      console.error('Error adding slot:', error);
      setMessage('Failed to add slot.');
    } finally {
      setLoading(false);
    }
  };

  const deleteSlot = async (slotId) => {
    setLoading(true);
    try {
      await axios.delete(`/api/slots/delete`, { data: { slotId } }); // Sending slotId as part of the request body
      fetchSlots(); // Refresh the slots lists after deletion
      setMessage('Slot successfully deleted.');
    } catch (error) {
      console.error('Error deleting slot:', error);
      setMessage('Failed to delete slot.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Coach Dashboard</h1>
      {loading && <p>Loading...</p>}
      {message && <p>{message}</p>}
      <form onSubmit={addSlot}>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        <button type="submit" disabled={loading}>Add Slot</button>
      </form>
      <h2>Available Slots</h2>
      <ul>
        {availableSlots.map(slot => (
          <li key={slot.id}>
            ({new Date(slot.startTime).toLocaleDateString()}) - 
            {new Date(slot.startTime).toLocaleTimeString()} ---  
            {new Date(slot.endTime).toLocaleTimeString()} --
            <button onClick={() => deleteSlot(slot.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <h2>Booked Slots</h2>
      <ul>
        {bookedSlots.map(slot => (
          <li key={slot.id}>
            {new Date(slot.startTime).toLocaleDateString()} - 
            {new Date(slot.startTime).toLocaleTimeString()} to 
            {new Date(slot.endTime).toLocaleTimeString()} - 
            Booked by {slot.booking.student.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CoachDashboard;