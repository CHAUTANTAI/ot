'use client';

import React, { useState } from 'react';
import { Button, List, Modal, Form, Input, Card, Space, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useGetFlashcardsByDeckIdQuery, useCreateFlashcardMutation, useUpdateFlashcardMutation, useDeleteFlashcardMutation } from '@/store/api';
import { useParams, useRouter } from 'next/navigation';
import { App } from 'antd';

interface Flashcard {
  id: string;
  label: string;
  value: string;
  deckId: string;
}

interface FlashcardFormProps {
  open: boolean;
  onCancel: () => void;
  onFinish: (values: { label: string; value: string }) => void;
  initialValues?: Omit<Flashcard, 'deckId'>;
}

const FlashcardForm: React.FC<FlashcardFormProps> = ({ open, onCancel, onFinish, initialValues }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues, form]);

  return (
    <Modal
      open={open}
      title={initialValues ? 'Edit Flashcard' : 'Add New Flashcard'}
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
        name="flashcard_form"
        initialValues={initialValues}
      >
        <Form.Item
          name="label"
          label="Label"
          rules={[{ required: true, message: 'Please input the label of the flashcard!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="value"
          label="Value"
          rules={[{ required: true, message: 'Please input the value of the flashcard!' }]}
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default function FlashcardsPage() {
  const router = useRouter();
  const params = useParams();
  const { message, modal } = App.useApp();
  const deckId = params.deckId as string;

  const { data: flashcards, error, isLoading } = useGetFlashcardsByDeckIdQuery(deckId);
  const [createFlashcard] = useCreateFlashcardMutation();
  const [updateFlashcard] = useUpdateFlashcardMutation();
  const [deleteFlashcard] = useDeleteFlashcardMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFlashcard, setEditingFlashcard] = useState<Omit<Flashcard, 'deckId'> | undefined>(undefined);

  const handleAddFlashcard = () => {
    setEditingFlashcard(undefined);
    setIsModalOpen(true);
  };

  const handleEditFlashcard = (flashcard: Omit<Flashcard, 'deckId'>) => {
    setEditingFlashcard(flashcard);
    setIsModalOpen(true);
  };

  const handleDeleteFlashcard = async (id: string) => {
    modal.confirm({
      title: 'Are you sure you want to delete this flashcard?',
      content: 'This action cannot be undone.',
      onOk: async () => {
        try {
          await deleteFlashcard(id).unwrap();
          message.success('Flashcard deleted successfully');
        } catch (err) {
          message.error('Failed to delete flashcard');
          console.error('Failed to delete flashcard:', err);
        }
      },
    });
  };

  const handleFormFinish = async (values: { label: string; value: string }) => {
    try {
      if (editingFlashcard) {
        await updateFlashcard({ id: editingFlashcard.id, ...values, deckId }).unwrap();
        message.success('Flashcard updated successfully');
      } else {
        await createFlashcard({ ...values, deckId }).unwrap();
        message.success('Flashcard created successfully');
      }
      setIsModalOpen(false);
    } catch (err) {
      message.error(`Failed to ${editingFlashcard ? 'update' : 'create'} flashcard`);
      console.error(`Failed to ${editingFlashcard ? 'update' : 'create'} flashcard:`, err);
    }
  };

  if (isLoading) return <div>Loading flashcards...</div>;
  if (error) return <div>Error loading flashcards: {JSON.stringify(error)}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Flashcards for Deck: {deckId}</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddFlashcard}>
          Add New Flashcard
        </Button>
      </div>

      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }}
        dataSource={flashcards}
        renderItem={(flashcard) => (
          <List.Item>
            <Card
              title={flashcard.label}
              actions={[
                <EditOutlined key="edit" onClick={() => handleEditFlashcard(flashcard)} />,
                <DeleteOutlined key="delete" onClick={() => handleDeleteFlashcard(flashcard.id)} />,
              ]}
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
            >
              <p>{flashcard.value}</p>
            </Card>
          </List.Item>
        )}
      />

      <FlashcardForm
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onFinish={handleFormFinish}
        initialValues={editingFlashcard}
      />
    </div>
  );
}
