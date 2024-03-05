// pages/api/slots/available.ts

import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const availableSlots = await prisma.availabilitySlot.findMany({
      where: {
        booking: null, // Filters slots not linked to a booking
      },
      include: {
        coach: true, // Optionally include coach details
      },
    });

    res.status(200).json(availableSlots);
  } catch (error) {
    console.error("Failed to retrieve available slots: ", error);
    res.status(500).json({ error: "Failed to retrieve available slots" });
  }
}
