"use client";

import React from 'react';
// import { Droppable, Draggable } from 'react-beautiful-dnd'; // Placeholder for later
import TaskCard from './TaskCard'; // Placeholder for TaskCard component
import { Task } from './KanbanBoard'; // Assuming Task interface is exported from KanbanBoard

interface KanbanColumnProps {
  columnId: string;
  title: string;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ columnId, title, tasks, onEditTask, onDeleteTask }) => {
  return (
    <div style={{ 
      backgroundColor: '#f4f5f7',
      borderRadius: '3px',
      width: '300px',
      minHeight: '400px',
      padding: '10px',
      marginRight: '10px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h3 style={{ paddingBottom: '10px', borderBottom: '1px solid #ccc', marginBottom: '10px' }}>{title} ({tasks.length})</h3>
      {/* <Droppable droppableId={columnId} type="TASK">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              flexGrow: 1,
              minHeight: '100px',
              backgroundColor: snapshot.isDraggingOver ? '#e2e4e6' : 'transparent',
              transition: 'background-color 0.2s ease',
            }}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(providedDraggable, snapshotDraggable) => (
                  <div
                    ref={providedDraggable.innerRef}
                    {...providedDraggable.draggableProps}
                    {...providedDraggable.dragHandleProps}
                    style={{
                      userSelect: 'none',
                      marginBottom: '8px',
                      ...providedDraggable.draggableProps.style,
                    }}
                  >
                    <TaskCard task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable> */}
      {/* Placeholder for tasks until DND is implemented */}
      <div style={{ flexGrow: 1, minHeight: '100px' }}>
        {tasks.map((task, index) => (
          <div key={task.id} style={{ marginBottom: '8px' }}>
            <TaskCard task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;

