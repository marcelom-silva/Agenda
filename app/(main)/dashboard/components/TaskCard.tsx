"use client";

import React from 'react';
import { Task } from './KanbanBoard'; // Assuming Task interface is exported from KanbanBoard

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '3px',
      padding: '10px',
      marginBottom: '8px',
      boxShadow: '0 1px 0 rgba(9,30,66,.25)',
      cursor: 'grab', // Indicate it's draggable, even before DND library is active
      borderLeft: task.colorTag ? `5px solid ${task.colorTag}` : 'none',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>{task.title}</h4>
        <div>
          <button 
            onClick={() => onEdit(task)} 
            style={{ marginRight: '5px', padding: '3px 5px', fontSize: '10px', cursor: 'pointer' }}
          >
            Editar
          </button>
          <button 
            onClick={() => onDelete(task.id)} 
            style={{ padding: '3px 5px', fontSize: '10px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none' }}
          >
            Excluir
          </button>
        </div>
      </div>
      {task.description && <p style={{ fontSize: '12px', color: '#5e6c84', margin: '0 0 5px 0' }}>{task.description}</p>}
      {/* TODO: Display other task details like dueDate if available */}
      {/* {task.dueDate && <p style={{ fontSize: '10px', color: '#7a869a' }}>Vencimento: {new Date(task.dueDate).toLocaleDateString()}</p>} */}
    </div>
  );
};

export default TaskCard;

