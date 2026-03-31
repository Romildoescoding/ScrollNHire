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
import { useState } from "react";
import useFetchEmails from "@/app/hooks/useShortlistedStudents";
import useShortlistedStudents from "@/app/hooks/useShortlistedStudents";

export function ModalAddChat() {
  const {
    students: shortlistedStudents,
    setStudents: setShortlistedStudents,
    setSearch,
    page,
    limit,
    total,
  } = useShortlistedStudents();

  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          {/* BUTTON TO TRIGGER THE DIALOG */}
          <Button
            className="rounded-full h-7 w-7 p-0 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800"
            variant={"outline"}
          >
            <Plus size={16} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Start Conversation</DialogTitle>
            <DialogDescription>
              Select any of the student to begin conversation.
            </DialogDescription>
          </DialogHeader>
          <DataTable
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
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
