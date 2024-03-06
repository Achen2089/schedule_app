// pages/api/slots/upcoming.ts

import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { coachId } = req.query;

  if (!coachId) {
    return res.status(400).json({ error: "A coachId must be provided" });
  }

  try {
    const upcomingSlots = await prisma.availabilitySlot.findMany({
      where: {
        coachId: Number(coachId),
        startTime: {
          gt: new Date(),
        },
      },
      include: {
        booking: {
          include: {
            student: true, // Assuming 'student' is the relation name in your Booking model to User model
            callReview: true
          },
        },
      },
    });

    res.status(200).json(upcomingSlots);
  } catch (error) {
    console.error("Failed to retrieve upcoming slots: ", error);
    res.status(500).json({ error: "Failed to retrieve upcoming slots" });
  }
}
