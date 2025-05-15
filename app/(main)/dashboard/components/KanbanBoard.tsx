"use client";

import React, { useState, useEffect, useCallback } from 'react';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'; // Placeholder for later
import KanbanColumn from './KanbanColumn';
import TaskForm from './TaskForm';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string; // 'todo', 'doing', 'done'
  dueDate?: string | null; // ISO string or null
  colorTag?: string | null;
  isRecurring?: boolean;
  recurrenceRule?: string | null;
  order?: number | null;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

export interface TasksByStatus {
  todo: Task[];
  doing: Task[];
  done: Task[];
  [key: string]: Task[]; // Index signature for dynamic access
}

const KanbanBoard: React.FC = () => {
  const [tasksByStatus, setTasksByStatus] = useState<TasksByStatus>({ todo: [], doing: [], done: [] });
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tasks");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const fetchedTasks: Task[] = await response.json();
      
      const groupedTasks: TasksByStatus = { todo: [], doing: [], done: [] };
      fetchedTasks.forEach((task) => {
        if (task.status && groupedTasks[task.status]) {
          groupedTasks[task.status].push(task);
        } else {
          groupedTasks.todo.push({ ...task, status: "todo" }); // Default to 'todo'
        }
      });
      // Sort tasks within each column by 'order' or 'createdAt'
      for (const status in groupedTasks) {
        groupedTasks[status].sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity) || new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());
      }
      setTasksByStatus(groupedTasks);
    } catch (error) {
      console.error("Falha ao buscar tarefas:", error);
      // TODO: Mostrar erro para o usuário
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // TODO: Implement onDragEnd handler for react-beautiful-dnd
  // const onDragEnd = (result: any) => { ... };

  const handleOpenTaskForm = (task?: Task) => {
    setEditingTask(task || null);
    setShowTaskForm(true);
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleSaveTask = async (taskDataFromForm: Omit<Task, 'id' | 'status'> | (Task & { id: string })) => {
    // Ensure status is part of the data being sent if it's a new task or being edited
    const taskPayload = {
        ...taskDataFromForm,
        status: (taskDataFromForm as Task).status || (editingTask?.status) || 'todo',
    };

    try {
      let response;
      if (editingTask && editingTask.id) {
        // Update existing task
        response = await fetch(`/api/tasks/${editingTask.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskPayload),
        });
      } else {
        // Create new task
        const { id, ...newTaskData } = taskPayload as Task; // Remove id if present for new task
        response = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTaskData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      // const savedTask = await response.json();
      fetchTasks(); // Refetch all tasks to update the board
      handleCloseTaskForm();
    } catch (error) {
      console.error("Falha ao salvar tarefa:", error);
      alert(`Erro ao salvar tarefa: ${error instanceof Error ? error.message : String(error)}`);
      // TODO: Mostrar erro para o usuário de forma mais elegante
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return;
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      fetchTasks(); // Refetch all tasks
    } catch (error) {
      console.error("Falha ao excluir tarefa:", error);
      alert(`Erro ao excluir tarefa: ${error instanceof Error ? error.message : String(error)}`);
      // TODO: Mostrar erro para o usuário
    }
  };

  const columns: { id: keyof TasksByStatus; title: string }[] = [
    { id: 'todo', title: 'A Fazer' },
    { id: 'doing', title: 'Fazendo' },
    { id: 'done', title: 'Feito' },
  ];

  if (isLoading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Carregando tarefas...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Quadro Kanban</h1>
        <button 
          onClick={() => handleOpenTaskForm()} 
          style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Nova Tarefa
        </button>
      </div>
      {/* <DragDropContext onDragEnd={onDragEnd}> */}
        <div style={{ display: 'flex', gap: '20px', overflowX: 'auto' }}>
          {columns.map((column) => (
            <KanbanColumn 
              key={column.id} 
              columnId={column.id} 
              title={column.title} 
              tasks={tasksByStatus[column.id] || []} 
              onEditTask={handleOpenTaskForm}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </div>
      {/* </DragDropContext> */}
      {showTaskForm && (
        <TaskForm 
          isOpen={showTaskForm} 
          onClose={handleCloseTaskForm} 
          onSave={handleSaveTask} 
          task={editingTask} 
        />
      )}
    </div>
  );
};

export default KanbanBoard;

