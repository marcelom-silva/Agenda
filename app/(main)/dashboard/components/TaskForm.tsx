"use client";

import React, { useState, useEffect } from 'react';
import { Task } from './KanbanBoard'; // Assuming Task interface is exported

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'id'> | Task) => void;
  task?: Task | null; // Task to edit, if any
}

const TaskForm: React.FC<TaskFormProps> = ({ isOpen, onClose, onSave, task }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo'); // Default status
  // TODO: Add fields for dueDate, colorTag, isRecurring, recurrenceRule

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status || 'todo');
      // TODO: Set other fields from task for editing
    } else {
      // Reset form for new task
      setTitle('');
      setDescription('');
      setStatus('todo');
    }
  }, [task, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('O título é obrigatório.');
      return;
    }
    const taskData = {
      ...(task || {}),
      title,
      description,
      status,
      // TODO: Add other fields to taskData
    };
    // If it's a new task, don't include 'id'. API will generate it.
    // If it's an existing task, 'id' will be part of 'task' spread.
    if (!task?.id) {
      const { id, ...newTaskData } = taskData as Task; // Type assertion and remove id if it exists by mistake
      onSave(newTaskData as Omit<Task, 'id'>);
    } else {
      onSave(taskData as Task);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', 
      justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px', width: '400px' }}>
        <h2>{task ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="title">Título:</label>
            <input 
              type="text" 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              required 
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="description">Descrição:</label>
            <textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              style={{ width: '100%', padding: '8px', minHeight: '80px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="status">Status:</label>
            <select 
              id="status" 
              value={status} 
              onChange={(e) => setStatus(e.target.value)} 
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            >
              <option value="todo">A Fazer</option>
              <option value="doing">Fazendo</option>
              <option value="done">Feito</option>
            </select>
          </div>
          {/* TODO: Add inputs for dueDate, colorTag, recurrence options */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 15px' }}>Cancelar</button>
            <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none' }}>Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;

