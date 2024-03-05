// pages/api/coach.ts

import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const coaches = await prisma.user.findMany({
      where: { isCoach: true },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
      },
    });
    res.status(200).json(coaches);
  } catch (error) {
    console.error('Failed to retrieve coaches:', error);
    res.status(500).json({ message: 'Failed to retrieve coaches' });
  }
}
