import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid Flashcard ID' });
  }

  if (req.method === 'GET') {
    try {
      const flashcard = await prisma.flashcard.findUnique({
        where: { id },
      });
      if (!flashcard) {
        return res.status(404).json({ message: 'Flashcard not found' });
      }
      res.status(200).json(flashcard);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch flashcard', error });
    }
  } else if (req.method === 'PUT') {
    try {
      const { label, value } = req.body;
      const updatedFlashcard = await prisma.flashcard.update({
        where: { id },
        data: { label, value },
      });
      res.status(200).json(updatedFlashcard);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update flashcard', error });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.flashcard.delete({
        where: { id },
      });
      res.status(200).json({ message: 'Flashcard deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete flashcard', error });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
