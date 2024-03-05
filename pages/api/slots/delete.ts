// pages/api/slots/delete.ts


import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { slotId } = req.body;

    if (!slotId) {
      return res.status(400).json({ message: 'Slot ID is required' });
    }

    try {
      await prisma.availabilitySlot.delete({
        where: {
          id: slotId,
        },
      });

      res.status(200).json({ message: 'Slot successfully deleted' });
    } catch (error) {
      console.error('Failed to delete availability slot:', error);
      return res.status(500).json({ message: 'Failed to delete availability slot' });
    }
  } else {
    // Respond with method not allowed if not a DELETE request
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
