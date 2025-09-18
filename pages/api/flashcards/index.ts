import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { label, value, deckId } = req.body;
      const newFlashcard = await prisma.flashcard.create({
        data: { label, value, deckId },
      });
      res.status(201).json(newFlashcard);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create flashcard', error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
