// pages/api/reviews/past.ts

import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { coachId } = req.query;

    try {
      const reviews = await prisma.callReview.findMany({
        where: {
          booking: {
            coach: {
              id: Number(coachId),
            },
          },
        },
        include: {
          booking: {
            include: {
              coach: true,
              student: true,
              availabilitySlot: true
            },
          },
        },
      });
      
      if (reviews.length === 0) {
        return res.status(404).json({ message: 'No reviews found for this coach.' });
      }

      res.status(200).json(reviews);
    } catch (error) {
      console.log('Failed to fetch past reviews:', error);
      res.status(500).json({ error: 'Unable to retrieve past reviews.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
