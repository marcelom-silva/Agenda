"use client"

import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { getCurrentWeekDates } from "../utils/date";

const initialTasks = {
  segunda: [],
  terca: [],
  quarta: [],
  quinta: [],
  sexta: [],
  sabado: [],
  domingo: [],
};

const columns = ["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"];

export default function Kanban() {
  const [tasks, setTasks] = useState<{ [key: string]: string[] }>(initialTasks);
  const [weekDates, setWeekDates] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setWeekDates(getCurrentWeekDates());
  }, []);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    const sourceTasks = [...tasks[sourceCol]];
    const [removed] = sourceTasks.splice(source.index, 1);
    const destTasks = [...tasks[destCol]];
    destTasks.splice(destination.index, 0, removed);

    setTasks(prev => ({
      ...prev,
      [sourceCol]: sourceTasks,
      [destCol]: destTasks,
    }));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {columns.map(col => (
          <div key={col} className="bg-white p-2 rounded shadow">
            <h2 className="text-xl font-semibold capitalize mb-2">
              {col} {weekDates[col] ? `(${weekDates[col]})` : ""}
            </h2>
            <Droppable droppableId={col}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="min-h-[100px]"
                >
                  {tasks[col].map((task, index) => (
                    <Draggable key={task} draggableId={task} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-2 mb-2 bg-blue-100 rounded"
                        >
                          {task}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
