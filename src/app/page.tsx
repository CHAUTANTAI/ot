'use client';

import React, { useState } from 'react';
import { Button, List, Modal, Form, Input, Card, Space, message, App } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useGetDecksQuery, useCreateDeckMutation, useUpdateDeckMutation, useDeleteDeckMutation } from '@/store/api';
import { useRouter } from 'next/navigation';

interface Deck {
  id: string;
  name: string;
  description?: string;
}

interface DeckFormProps {
  open: boolean;
  onCancel: () => void;
  onFinish: (values: { name: string; description?: string }) => void;
  initialValues?: Deck;
}

const DeckForm: React.FC<DeckFormProps> = ({ open, onCancel, onFinish, initialValues }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues, form]);

  return (
    <Modal
      open={open}
      title={initialValues ? 'Edit Deck' : 'Add New Deck'}
      onCancel={onCancel}
      onOk={() => {
        form.validateFields()
          .then(values => {
            form.resetFields();
            onFinish(values);
          })
          .catch(info => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="deck_form"
        initialValues={initialValues}
      >
        <Form.Item
          name="name"
          label="Deck Name"
          rules={[{ required: true, message: 'Please input the name of the deck!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default function Home() {
  const router = useRouter();
  const { message, modal } = App.useApp();
  console.log('Ant Design Modal object:', modal);
  const { data: decks, error, isLoading } = useGetDecksQuery();
  const [createDeck] = useCreateDeckMutation();
  const [updateDeck] = useUpdateDeckMutation();
  const [deleteDeck] = useDeleteDeckMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeck, setEditingDeck] = useState<Deck | undefined>(undefined);

  const handleAddDeck = () => {
    setEditingDeck(undefined);
    setIsModalOpen(true);
  };

  const handleEditDeck = (deck: Deck) => {
    setEditingDeck(deck);
    setIsModalOpen(true);
  };

  const handleDeleteDeck = async (id: string) => {
    modal.confirm({
      title: 'Are you sure you want to delete this deck?',
      content: 'This action cannot be undone.',
      onOk: async () => {
        try {
          await deleteDeck(id).unwrap();
          message.success('Deck deleted successfully');
        } catch (err) {
          message.error('Failed to delete deck');
          console.error('Failed to delete deck:', err);
        }
      },
    });
  };

  const handleFormFinish = async (values: { name: string; description?: string }) => {
    try {
      if (editingDeck) {
        await updateDeck({ id: editingDeck.id, ...values }).unwrap();
        message.success('Deck updated successfully');
      } else {
        await createDeck(values).unwrap();
        message.success('Deck created successfully');
      }
      setIsModalOpen(false);
    } catch (err) {
      message.error(`Failed to ${editingDeck ? 'update' : 'create'} deck`);
      console.error(`Failed to ${editingDeck ? 'update' : 'create'} deck:`, err);
    }
  };

  if (isLoading) return <div>Loading decks...</div>;
  if (error) return <div>Error loading decks: {JSON.stringify(error)}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Decks</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddDeck}>
          Add New Deck
        </Button>
      </div>

      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }}
        dataSource={decks}
        renderItem={(deck) => (
          <List.Item>
            <Card
              title={deck.name}
              actions={[
                <EditOutlined key="edit" onClick={() => handleEditDeck(deck)} />,
                <DeleteOutlined key="delete" onClick={() => handleDeleteDeck(deck.id)} />,
              ]}
              onClick={() => router.push(`/flashcards/${deck.id}`)}
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
            >
              <p>{deck.description || 'No description'}</p>
            </Card>
          </List.Item>
        )}
      />

      <DeckForm
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onFinish={handleFormFinish}
        initialValues={editingDeck}
      />
    </div>
  );
}