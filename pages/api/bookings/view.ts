// pages/api/bookings/view.ts

import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { bookingId } = req.query;

    try {
      const booking = await prisma.booking.findUnique({
        where: { id: Number(bookingId) },
        include: {
          student: true, // Include student details
          coach: true,   // Include coach details
          availabilitySlot: true, // Include slot details
        },
      });

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found.' });
      }

      res.status(200).json(booking);
    } catch (error) {
      res.status(500).json({ error: 'Unable to retrieve the booking details.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
