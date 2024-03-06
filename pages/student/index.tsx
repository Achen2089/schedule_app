import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const studentId = '3'; // This should be dynamically fetched based on the authenticated user
  const studentName = 'Lee'
  
  useEffect(() => {
    fetchCoaches();
    fetchStudentBookings();
  }, []);

  const fetchCoaches = async () => {
    try {
      const { data } = await axios.get('/api/coaches');
      setCoaches(data);
    } catch (error) {
      console.error('Error fetching coaches:', error);
    }
  };

  const fetchStudentBookings = async () => {
    try {
      const { data } = await axios.get(`/api/bookings/student`, { params: { studentId}});
      setBookings(data);
    } catch (error) {
      console.error('Error fetching student bookings:', error);
    }
  };

  useEffect(() => {
    if (selectedCoach) {
      fetchAvailableSlots(selectedCoach);
    }
  }, [selectedCoach]);

  const fetchAvailableSlots = async (coachId) => {
    try {
      const { data } = await axios.get(`/api/slots/available?coachId=${coachId}`);
      setAvailableSlots(data);
    } catch (error) {
      console.error('Error fetching available slots:', error);
    }
  };

  const createBooking = async () => {
    try {
      await axios.post('/api/bookings/book', {
        slotId: selectedSlot,
        studentId,
      });
      alert('Booking successful!');
      fetchStudentBookings(); // Refresh the student's bookings list
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking.');
    }
  };

  return (
    <div>
      <h1>Student Dashboard</h1>
      <h2>Your Bookings</h2>
      <ul>
        {bookings.map(({ id, availabilitySlot, coach }) => (
          <li key={id}>
            Date: {new Date(availabilitySlot.startTime).toLocaleString()}, Coach: {coach.name} ({coach.phoneNumber})
          </li>
        ))}
      </ul>
      <h2>Book a New Slot</h2>
      <div>
        <select value={selectedCoach} onChange={e => setSelectedCoach(e.target.value)}>
          <option value="">Select a Coach</option>
          {coaches.map(({ id, name }) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>
        <select value={selectedSlot} onChange={e => setSelectedSlot(e.target.value)} disabled={!selectedCoach}>
          <option value="">Select a Slot</option>
          {availableSlots.map(({ id, startTime }) => (
            <option key={id} value={id}>{new Date(startTime).toLocaleString()}</option>
          ))}
        </select>
        <button onClick={createBooking} disabled={!selectedSlot}>Book Slot</button>
      </div>
    </div>
  );
};

export default StudentDashboard;
