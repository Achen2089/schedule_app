// pages/api/slots/add.ts

import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { coachId, startTime, endTime } = req.body;

    // Basic validation
    if (!coachId || !startTime || !endTime) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      const slot = await prisma.availabilitySlot.create({
        data: {
          coachId,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
        },
      });

      return res.status(200).json(slot);
    } catch (error) {
      console.error('Failed to add availability slot:', error);
      return res.status(500).json({ message: 'Failed to add availability slot' });
    }
  } else {
    // Respond with method not allowed if not a POST request
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
