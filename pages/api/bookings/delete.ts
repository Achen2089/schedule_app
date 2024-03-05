import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { bookingId } = req.body;

    // Convert bookingId to a number and check validity
    const numericBookingId = Number(bookingId);
    if (isNaN(numericBookingId)) {
      return res.status(400).json({ message: 'Invalid bookingId provided.' });
    }

    try {
      // Check if the booking exists
      const booking = await prisma.booking.findUnique({
        where: { id: numericBookingId },
      });

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found.' });
      }

      // Proceed with deleting the booking
      await prisma.booking.delete({
        where: { id: numericBookingId },
      });

      res.status(200).json({ message: 'Booking successfully deleted.' });
    } catch (error) {
      console.error('Failed to delete booking:', error);
      res.status(500).json({ error: 'Unable to delete booking.' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
