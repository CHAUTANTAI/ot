import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { deckId } = req.query;

  if (!deckId || typeof deckId !== 'string') {
    return res.status(400).json({ message: 'Invalid Deck ID' });
  }

  if (req.method === 'GET') {
    try {
      const flashcards = await prisma.flashcard.findMany({
        where: { deckId },
      });
      res.status(200).json(flashcards);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch flashcards', error });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
