// pages/api/reviews/add.ts

import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    let { bookingId, satisfaction, notes } = req.body;

    // Convert bookingId to a number if it's not already
    bookingId = Number(bookingId);

    if (!bookingId || isNaN(bookingId)) {
      return res.status(400).json({ message: 'Valid bookingId is required.' });
    }

    try {
      // Ensure the booking exists
      const bookingExists = await prisma.booking.findUnique({
        where: { id: bookingId },
      });

      if (!bookingExists) {
        console.error('Booking not found:', bookingId);
        return res.status(404).json({ message: 'Booking not found.' });
      }

      // Proceed with adding the review
      // console.log('Adding review for booking:', bookingId);
      // console.log('Satisfaction:', satisfaction);
      // console.log('Notes:', notes);
      const review = await prisma.callReview.create({
        data: {
          satisfaction,
          notes,
          bookingId, 
        },
      });

      res.status(200).json(review);
    } catch (error) {
      console.error('Failed to add the call review:', error);
      res.status(500).json({ error: 'Unable to add the call review.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
