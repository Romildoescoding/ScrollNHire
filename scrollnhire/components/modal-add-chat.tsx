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
import { DataTable } from "./email-table";
import { FormEvent, useState } from "react";
import axios from "axios";
import useStudents from "@/app/hooks/useStudents";
import { IConversation } from "@/app/hooks/useConversations";
import { socket } from "@/app/_lib/socket";

export function ModalAddChat({
  refetch: refetchConversations,
  setConversations,
}: {
  refetch: () => Promise<void>;
  setConversations: React.Dispatch<React.SetStateAction<IConversation[]>>;
}) {
  const {
    students: shortlistedStudents,
    setStudents: setShortlistedStudents,
    setSearch,
    page,
    limit,
    total,
  } = useStudents("shortlisted");

  async function handleStartChat({
    studentId,
    hiringProcessId,
  }: {
    studentId: string;
    hiringProcessId: string;
  }) {
    try {
      const res = await axios.post("/api/conversations/create", {
        studentId,
        hiringProcessId,
      });

      const convo = res.data?.data;

      // 👉 you can redirect to chat page here
      console.log("Conversation:", convo);
      setShortlistedStudents((students) =>
        students.filter((stu) => stu.id !== studentId),
      );
      refetchConversations();

      // 🔥 instantly update UI
      setConversations((prev) => {
        if (prev.some((c) => c._id === convo._id)) return prev;
        return [convo, ...prev];
      });

      socket.emit("conversation_created", {
        conversationId: convo._id,
      });

      socket.emit("create_conversation", {
        studentId,
        conversationId: convo._id,
      });

      setOpen(false);

      // example:
      // router.push(`/chat/${convo._id}`);
    } catch (err) {
      console.error("Error starting chat:", err);
    }
  }

  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        {/* <form onSubmit={handleStartChat}> */}
        <DialogTrigger asChild>
          {/* BUTTON TO TRIGGER THE DIALOG */}
          <Button
            className="rounded-full h-7 w-7 p-0 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800"
            variant={"outline"}
          >
            <Plus size={16} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Start Conversation</DialogTitle>
            <DialogDescription>
              Select any of the student to begin conversation.
            </DialogDescription>
          </DialogHeader>
          <div className="max-w-[80vw] max-h-[50vh] md:max-w-full overflow-auto">
            <DataTable
              handleStartChat={handleStartChat}
              displayFooter={false}
              setSearch={setSearch}
              displayFilter={true}
              displayActions={false}
              displaySelect={false}
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
          {/* <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Start Chat</Button>
          </DialogFooter> */}
        </DialogContent>
      </form>
    </Dialog>
  );
}
