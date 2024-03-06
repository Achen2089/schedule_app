// pages/api/bookings/student.ts

import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { studentId } = req.query;
  
    try {
      const bookings = await prisma.booking.findMany({
        where: { studentId: Number(studentId) },
        include: {
          coach: true,
          availabilitySlot: true,
        },
      });
  
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ error: 'Unable to retrieve bookings.' });
    }
  }