// pages/api/reviews/add.ts

import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { bookingId, satisfaction, notes } = req.body;

    try {
      // Ensure the booking exists
      const bookingExists = await prisma.booking.findUnique({
        where: { id: Number(bookingId) },
      });

      if (!bookingExists) {
        return res.status(404).json({ message: 'Booking not found.' });
      }

      // Add the call review
      const review = await prisma.callReview.create({
        data: {
          bookingId: Number(bookingId),
          satisfaction,
          notes,
        },
      });

      res.status(200).json(review);
    } catch (error) {
      res.status(500).json({ error: 'Unable to add the call review.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
