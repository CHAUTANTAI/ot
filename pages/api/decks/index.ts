import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma'; // Sẽ tạo file này sau

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const decks = await prisma.deck.findMany();
      res.status(200).json(decks);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch decks', error });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, description } = req.body;
      const newDeck = await prisma.deck.create({
        data: { name, description },
      });
      res.status(201).json(newDeck);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create deck', error });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
