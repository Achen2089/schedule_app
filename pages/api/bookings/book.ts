// pages/api/bookings/book.ts

import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { slotId, studentId } = req.body;

    try {
      // Check if the slot is already booked
      const existingBooking = await prisma.booking.findUnique({
        where: { slotId },
      });

      if (existingBooking) {
        return res.status(400).json({ message: 'This slot is already booked.' });
      }

      // Create the booking
      const booking = await prisma.booking.create({
        data: {
          slotId,
          studentId,
          // Assume the coachId is obtained from the slot itself
          coachId: (await prisma.availabilitySlot.findUnique({ where: { id: slotId } }))?.coachId,
        },
      });

      res.status(200).json(booking);
    } catch (error) {
      res.status(500).json({ error: 'Unable to book the slot.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
