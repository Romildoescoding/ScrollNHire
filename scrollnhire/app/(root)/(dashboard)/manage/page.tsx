"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { FormEvent, useState } from "react";
import axios from "axios";
import useStudents, { IStudent } from "@/app/hooks/useStudents";
import { IConversation } from "@/app/hooks/useConversations";
import { socket } from "@/app/_lib/socket";
import { DataTable } from "@/components/manage-students-table";
import { useRouter } from "next/navigation";
import ModalProfile from "@/components/modal-student-profile";

export default function ManageStudents() {
  const {
    students: shortlistedStudents,
    setStudents: setShortlistedStudents,
    setSearch,
    page,
    limit,
    total,
    setStudentStatus,
  } = useStudents();

  // async function handleStartChat({
  //   studentId,
  // }: {
  //   studentId: string;
  //   hiringProcessId: string;
  // }) {
  //   try {
  //     const res = await axios.post("/api/conversations/create", {
  //       studentId,
  //       hiringProcessId,
  //     });

  //     const convo = res.data?.data;

  //     // 👉 you can redirect to chat page here
  //     console.log("Conversation:", convo);
  //     setShortlistedStudents((students) =>
  //       students.filter((stu) => stu.id !== studentId),
  //     );
  //     refetchConversations();

  //     // 🔥 instantly update UI
  //     setConversations((prev) => {
  //       if (prev.some((c) => c._id === convo._id)) return prev;
  //       return [convo, ...prev];
  //     });

  //     socket.emit("conversation_created", {
  //       conversationId: convo._id,
  //     });

  //     socket.emit("create_conversation", {
  //       studentId,
  //       conversationId: convo._id,
  //     });

  //     setOpen(false);

  //     // example:
  //     // router.push(`/chat/${convo._id}`);
  //   } catch (err) {
  //     console.error("Error starting chat:", err);
  //   }
  // }

  const router = useRouter();
  function routeToProfile({ studentId }) {
    router.push(`/profile/${studentId}`);
  }

  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const [open, setOpen] = useState(false);
  const [clickedStudent, setClickedStudent] = useState<IStudent | null>(null);

  // function handleOpenProfile() {}

  return (
    <>
      <div className="pb-6 px-4">
        <h1 className="font-playfair text-slate-900 dark:text-slate-100 text-4xl italic leading-tight mb-2">
          Manage Students
        </h1>
        <DataTable
          onClick={(student: IStudent) => {
            setClickedStudent(student);
            setOpen(true);
          }}
          handleStartChat={() => {}}
          // handleStartChat={handleStartChat}
          displayFooter={true}
          setSearch={setSearch}
          displayFilter={true}
          displayActions={true}
          displaySelect={true}
          data={shortlistedStudents}
          selectedStudents={selectedStudents}
          setSelectedStudents={setSelectedStudents}
          openViewModal={() => {}}
          openDeleteModal={() => {}}
          openEditModal={() => {}}
          sortedViaSelected={false}
          pagination={{
            page,
            limit,
            total,
            onPageChange: (page: number) => {},
            onPageSizeChange: (limit: number) => {},
          }}
        />
      </div>

      {/* MODAL PROFILE */}
      <ModalProfile
        student={clickedStudent}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
