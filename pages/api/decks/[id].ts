import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid Deck ID' });
  }

  if (req.method === 'GET') {
    try {
      const deck = await prisma.deck.findUnique({
        where: { id },
      });
      if (!deck) {
        return res.status(404).json({ message: 'Deck not found' });
      }
      res.status(200).json(deck);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch deck', error });
    }
  } else if (req.method === 'PUT') {
    try {
      const { name, description } = req.body;
      const updatedDeck = await prisma.deck.update({
        where: { id },
        data: { name, description },
      });
      res.status(200).json(updatedDeck);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update deck', error });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.deck.delete({
        where: { id },
      });
      res.status(200).json({ message: 'Deck deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete deck', error });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
