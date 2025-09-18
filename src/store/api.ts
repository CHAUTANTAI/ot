import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithErrorHandler } from './endpoint-config';

interface Deck {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface Flashcard {
  id: string;
  label: string;
  value: string;
  deckId: string;
  createdAt: string;
  updatedAt: string;
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithErrorHandler,
  tagTypes: ['Deck', 'Flashcard'],
  endpoints: (builder) => ({
    getDecks: builder.query<Deck[], void>({
      query: () => 'decks',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Deck' as const, id })),
              { type: 'Deck', id: 'LIST' },
            ]
          : [{ type: 'Deck', id: 'LIST' }],
    }),
    createDeck: builder.mutation<Deck, Partial<Deck>>({
      query: (newDeck) => ({
        url: 'decks',
        method: 'POST',
        body: newDeck,
      }),
      invalidatesTags: [{ type: 'Deck', id: 'LIST' }],
    }),
    updateDeck: builder.mutation<Deck, Partial<Deck>>({
      query: ({ id, ...patch }) => ({
        url: `decks/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Deck', id }],
    }),
    deleteDeck: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `decks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Deck', id }],
    }),
    getFlashcardsByDeckId: builder.query<Flashcard[], string>({
      query: (deckId) => `flashcards/deck/${deckId}`,
      providesTags: (result, error, deckId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Flashcard' as const, id })),
              { type: 'Flashcard', id: 'LIST' },
              { type: 'Flashcard', id: `DECK-${deckId}` },
            ]
          : [
              { type: 'Flashcard', id: 'LIST' },
              { type: 'Flashcard', id: `DECK-${deckId}` },
            ],
    }),
    createFlashcard: builder.mutation<Flashcard, Partial<Flashcard>>({
      query: (newFlashcard) => ({
        url: 'flashcards',
        method: 'POST',
        body: newFlashcard,
      }),
      invalidatesTags: (result, error, { deckId }) => [
        { type: 'Flashcard', id: 'LIST' },
        { type: 'Flashcard', id: `DECK-${deckId}` },
      ],
    }),
    updateFlashcard: builder.mutation<Flashcard, Partial<Flashcard>>({
      query: ({ id, ...patch }) => ({
        url: `flashcards/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id, deckId }) => [
        { type: 'Flashcard', id },
        { type: 'Flashcard', id: `DECK-${deckId}` },
      ],
    }),
    deleteFlashcard: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `flashcards/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{
        type: 'Flashcard', id
      }],
    }),
  }),
});

export const {
  useGetDecksQuery,
  useCreateDeckMutation,
  useUpdateDeckMutation,
  useDeleteDeckMutation,
  useGetFlashcardsByDeckIdQuery,
  useCreateFlashcardMutation,
  useUpdateFlashcardMutation,
  useDeleteFlashcardMutation,
} = api;
