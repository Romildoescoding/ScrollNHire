"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Grip, User2 } from "lucide-react";
import useUpdateStatus from "@/app/hooks/useUpdateStatus";
import useStudents, { IStudent } from "@/app/hooks/useStudents";
import { Badge } from "./ui/badge";
import ModalProfile from "./modal-student-profile";

const initialData = {
  shortlisted: [],
  hired: [],
  rejected: [],
};

export interface IColumn {
  shortlisted: IStudent[];
  hired: IStudent[];
  rejected: IStudent[];
}

export default function HiringPipeline() {
  const { students, isLoading: isFetchingStudents } = useStudents();
  const [columns, setColumns] = useState<IColumn>(initialData);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const shortlistedStudents = [],
      hiredStudents = [],
      rejectedStudents = [];

    for (const student of students) {
      if (student.status === "hired") {
        hiredStudents.push(student);
      } else if (student.status === "rejected") {
        rejectedStudents.push(student);
      } else shortlistedStudents.push(student);
    }
    setColumns({
      shortlisted: shortlistedStudents,
      hired: hiredStudents,
      rejected: rejectedStudents,
    });
  }, [students]);
  // 🔍 find column of item
  const findColumn = (id) => {
    return Object.keys(columns).find((col) =>
      columns[col].some((item) => item.hiringProcessId === id),
    );
  };

  const getItem = (id) => {
    const col = findColumn(id);
    return columns[col]?.find((item) => item.hiringProcessId === id);
  };

  // 🚀 DRAG START
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const { updateStatus } = useUpdateStatus();

  // 🔥 DRAG END
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const sourceCol = findColumn(active.id);

    const targetCol = Object.keys(columns).includes(over.id)
      ? over.id
      : findColumn(over.id);

    if (!sourceCol || !targetCol) return;

    const item = columns[sourceCol].find(
      (s) => s.hiringProcessId === active.id,
    );

    if (!item) return;

    // 🔥 SAME COLUMN → reorder only (no API call)
    if (sourceCol === targetCol) {
      const oldIndex = columns[sourceCol].findIndex(
        (i) => i.hiringProcessId === active.id,
      );
      const newIndex = columns[sourceCol].findIndex(
        (i) => i.hiringProcessId === over.id,
      );

      setColumns((prev) => ({
        ...prev,
        [sourceCol]: arrayMove(prev[sourceCol], oldIndex, newIndex),
      }));
      return;
    }

    // 🧠 OPTIMISTIC UI UPDATE
    const prevColumns = JSON.parse(JSON.stringify(columns));

    setColumns((prev) => ({
      ...prev,
      [sourceCol]: prev[sourceCol].filter(
        (s) => s.hiringProcessId !== active.id,
      ),
      [targetCol]: [...prev[targetCol], item],
    }));

    try {
      await updateStatus({
        hiringProcessId: item.hiringProcessId,
        status: targetCol,
      });
    } catch (err) {
      console.error("Failed to update status", err);

      // ROLLBACK UI
      setColumns(prevColumns);
    }
  };

  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null);

  return (
    <>
      <ModalProfile
        student={selectedStudent}
        open={open}
        onOpenChange={setOpen}
      />

      <div className="border shadow-sm rounded-lg bg-white dark:bg-zinc-950 p-4">
        <h2 className="text-lg mb-4 font-semibold">Hiring Pipeline Tracker</h2>

        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-3 gap-4 h-[400px]">
            {Object.entries(columns).map(([colId, students]) => (
              <Column
                key={colId}
                id={colId}
                title={colId}
                students={students}
                activeId={activeId}
                setSelectedStudent={setSelectedStudent}
                setOpen={setOpen}
                isFetchingStudents={isFetchingStudents}
              />
            ))}
          </div>

          {/* 👻 DRAG OVERLAY */}
          <DragOverlay>
            {activeId ? <OverlayCard student={getItem(activeId)} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </>
  );
}

// ---

const Column = ({
  id,
  title,
  students,
  activeId,
  setOpen,
  setSelectedStudent,
  isFetchingStudents,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedStudent: Dispatch<SetStateAction<IStudent | null>>;
  isFetchingStudents: boolean;
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  const colorMap = {
    shortlisted: "bg-blue-500",
    hired: "bg-green-500",
    rejected: "bg-red-500",
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col gap-2 p-3 rounded-lg border overflow-y-auto transition
      ${
        isOver
          ? "bg-zinc-100 shadow-sm dark:bg-zinc-800 ring-2 ring-black dark:ring-white"
          : "bg-zinc-50 shadow-sm dark:bg-zinc-900"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${colorMap[id]}`} />
        <h1 className="font-medium capitalize">{title}</h1>
        <span className="text-xs text-muted-foreground">{students.length}</span>
      </div>

      {isFetchingStudents ? (
        <div className="h-full w-full flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="shimmer2 h-[57px] w-full rounded-lg"></div>
          ))}
        </div>
      ) : (
        <SortableContext
          items={students.map((s) => s.hiringProcessId)}
          strategy={verticalListSortingStrategy}
        >
          {students.map((student) => (
            <SortableCard
              key={student.hiringProcessId}
              student={student}
              setOpen={setOpen}
              setSelectedStudent={setSelectedStudent}
            />
          ))}
        </SortableContext>
      )}
    </div>
  );
};

// ---

const SortableCard = ({
  student,
  setOpen,
  setSelectedStudent,
}: {
  student: IStudent;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedStudent: Dispatch<SetStateAction<IStudent | null>>;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: student.hiringProcessId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white cursor-pointer dark:bg-zinc-950 rounded-lg p-2 flex items-center justify-between border shadow-sm"
      onClick={() => {
        setSelectedStudent(student);
        setOpen(true);
      }}
    >
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={student.image ?? undefined} />
            <AvatarFallback>
              <User2 size={20} />
            </AvatarFallback>
          </Avatar>

          <div className="text-xs">
            <div className="font-medium">{student.name}</div>
            <div className="text-muted-foreground">
              {student.degree} {student.branch}
            </div>
          </div>
        </div>
        {student.skills.length > 0 && (
          <div className="flex gap-2">
            {student.skills.slice(0, 4).map((skill, i) => (
              <Badge key={i} className="rounded-full text-[10px]">
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing bg-zinc-100 dark:bg-zinc-900 h-8 w-8 border rounded-md flex items-center justify-center"
      >
        <Grip size={18} />
      </div>
    </div>
  );
};

// ---

/* 👻 OVERLAY CARD */
const OverlayCard = ({ student }: { student: IStudent }) => {
  if (!student) return null;

  return (
    <div className="bg-white dark:bg-zinc-950 rounded-lg p-2 flex items-center justify-between border shadow-sm">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={student.image ?? undefined} />
            <AvatarFallback>
              <User2 size={20} />
            </AvatarFallback>
          </Avatar>

          <div className="text-xs">
            <div className="font-medium">{student.name}</div>
            <div className="text-muted-foreground">
              {student.degree} {student.branch}
            </div>
          </div>
        </div>
        {student.skills.length > 0 && (
          <div className="flex gap-2">
            {student.skills.slice(0, 4).map((skill, i) => (
              <Badge key={i} className="rounded-full text-[10px]">
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
