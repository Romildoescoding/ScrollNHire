import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { SetStateAction, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
// import { Contact } from "@/types"; // Ensure this matches your Contact type
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  ArrowBigDown,
  ArrowBigUp,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  MoreHorizontal,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
// import formatDate from "../utils/formatDate";
// import { Contact, List, Scope } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { formatDate } from "@/app/lib/utils";
import { HiringStatus, IStudent, Reel, Status } from "@/app/hooks/useStudents";
import axios from "axios";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
interface DataTableProps {
  displayFilter: boolean;
  displayActions: boolean;
  displayFooter?: boolean;
  displaySelect?: boolean;
  handleStartChat?: ({
    studentId,
    hiringProcessId,
  }: {
    studentId: string;
    hiringProcessId: string;
  }) => void;
  updateStatus?: (student: IStudent, status: HiringStatus) => void;
  onClick?: (student: IStudent) => void;

  data: IStudent[];

  selectedStudents: string[];
  setSelectedStudents: React.Dispatch<React.SetStateAction<string[]>>;

  openViewModal: (student: IStudent) => void;
  openDeleteModal: (student: IStudent) => void;
  openEditModal: (student: IStudent) => void;
  // onRowClick: (arg0: unknown) => void;

  sortedViaSelected: boolean;

  pagination: {
    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (limit: number) => void;
  };

  setSearch: React.Dispatch<SetStateAction<string>>;
}

// function formatStudentsender(sender: string): string {
//   // Extract the part before "<"
//   const namePart = sender.split("<")[0].trim();

//   // Truncate to max 15 chars
//   if (namePart.length > 15) {
//     return namePart.slice(0, 15) + "...";
//   }

//   return namePart;
// }

export function DataTable({
  //   lists,
  //   domains,
  onClick = () => {},
  handleStartChat = () => {},
  updateStatus = () => {},
  setSearch,
  displayFooter = true,
  displayFilter = true,
  displayActions = true,
  displaySelect = true,
  data,
  selectedStudents,
  setSelectedStudents,
  openViewModal,
  openDeleteModal,
  openEditModal,
  // onRowClick = () => {},
  sortedViaSelected = false,
  pagination,
}: // listForSorting,
// setListForSorting,
DataTableProps) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const router = useRouter();
  // const [pagination, setPagination] = useState({
  //   pageIndex: 0,
  //   pageSize: 10,
  // });

  const columns: ColumnDef<IStudent>[] = [
    {
      id: "select",
      header: () => (
        <Checkbox
          checked={selectedStudents.length === data.length && data.length > 0}
          onCheckedChange={() => {
            if (selectedStudents.length === data.length) {
              setSelectedStudents([]);
            } else {
              setSelectedStudents(data.map((row) => row.id));
            }
          }}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          onClick={(e) => {
            e.stopPropagation();
            const id = row.original.id;
            setSelectedStudents((prev) =>
              prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
            );
          }}
          checked={selectedStudents.includes(row.original.id)}
          // onCheckedChange={}
        />
      ),
    },

    /* 👤 STUDENT */
    {
      accessorKey: "name",
      header: () => <div>Name</div>,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <img
            src={row.original.image}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <p className="font-medium">{row.original.name}</p>
            {/* <p className="text-xs text-muted-foreground">
              {row.original.email}
            </p> */}
          </div>
        </div>
      ),
    },

    /* 🎓 EDUCATION */
    {
      accessorKey: "degree",
      header: () => <div>Degree</div>,
      cell: ({ row }) => (
        <div className="text-sm">
          <p>
            {row.original.degree || "-"} {row.original.branch || ""}
          </p>
          {/* <p className="text-muted-foreground text-xs">{row.original.branch}</p> */}
        </div>
      ),
    },

    {
      accessorKey: "gender",
      header: () => <div>Gender</div>,
      cell: ({ row }) => (
        <Badge
          className="capitalize"
          variant={
            row.original.gender === "male"
              ? "default"
              : row.original.gender === "female"
                ? "secondary"
                : "outline"
          }
        >
          {row.original.gender}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: () => <div>Status</div>,
      cell: ({ row }) => (
        // e.stopPropagation();
        // <DropdownMenu>
        //   <DropdownMenuTrigger asChild>
        //     <Badge
        //       className={cn(
        //         "capitalize rounded-full",
        //         getStatusBadge(row.original.status),
        //       )}
        //     >
        //       {row.original.status === "interview_scheduled"
        //         ? "Interview Scheduled"
        //         : row.original.status === "interview_completed"
        //           ? "Interview Completed"
        //           : row.original.status === "offer_sent"
        //             ? "Offer Sent"
        //             : row.original.status}
        //     </Badge>
        //   </DropdownMenuTrigger>

        //   <DropdownMenuContent align="end">
        //     <DropdownMenuItem onClick={() => {}}>
        //       <Badge
        //         className={cn(
        //           "capitalize rounded-full",
        //           getStatusBadge(row.original.status),
        //         )}
        //       >
        //         {row.original.status}
        //       </Badge>
        //     </DropdownMenuItem>
        //     <DropdownMenuItem onClick={() => {}}>
        //       <Badge
        //         className={cn(
        //           "capitalize rounded-full",
        //           getStatusBadge("interview_scheduled"),
        //         )}
        //       >
        //         Interview Scheduled
        //       </Badge>
        //     </DropdownMenuItem>
        //     <DropdownMenuItem onClick={() => {}}>
        //       <Badge
        //         className={cn(
        //           "capitalize rounded-full",
        //           getStatusBadge("interview_completed"),
        //         )}
        //       >
        //         Interview Completed
        //       </Badge>
        //     </DropdownMenuItem>
        //     <DropdownMenuItem onClick={() => {}}>
        //       <Badge
        //         className={cn(
        //           "capitalize rounded-full",
        //           getStatusBadge("offer_sent"),
        //         )}
        //       >
        //         Offer Sent
        //       </Badge>
        //     </DropdownMenuItem>
        //     <DropdownMenuItem onClick={() => {}}>
        //       <Badge
        //         className={cn(
        //           "capitalize rounded-full",
        //           getStatusBadge("hired"),
        //         )}
        //       >
        //         Hired
        //       </Badge>
        //     </DropdownMenuItem>

        //     <DropdownMenuSeparator />

        //     <DropdownMenuItem className="text-destructive" onClick={() => {}}>
        //       <Badge
        //         className={cn(
        //           "capitalize rounded-full",
        //           getStatusBadge("rejected"),
        //         )}
        //       >
        //         Rejected
        //       </Badge>
        //     </DropdownMenuItem>
        //   </DropdownMenuContent>
        // </DropdownMenu>
        <Badge
          className={cn(
            "capitalize rounded-full",
            getStatusBadge(row.original.status),
          )}
        >
          {row.original.status === "interview_scheduled"
            ? "Interview Scheduled"
            : row.original.status === "interview_completed"
              ? "Interview Completed"
              : row.original.status === "offer_sent"
                ? "Offer Sent"
                : row.original.status}
        </Badge>
      ),
    },

    /* 📊 CGPA */
    {
      accessorKey: "cgpa",
      header: () => <div>CGPA</div>,
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.cgpa || "-"}</Badge>
      ),
    },

    /* 🧠 SKILLS */
    {
      accessorKey: "skills",
      header: () => <div>Skills</div>,
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {row.original.skills?.slice(0, 2).map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="max-w-[80px] truncate justify-start min-w-0"
            >
              {skill}
            </Badge>
          ))}
          {row.original.skills?.length > 2 && (
            <Badge variant="outline">+{row.original.skills.length - 3}</Badge>
          )}
          {row.original.skills?.length === 0 && (
            <Badge variant="outline">-</Badge>
          )}
        </div>
      ),
    },

    /* 🎬 REELS COUNT */
    {
      id: "reels",
      header: () => <div>Reels</div>,
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {row.original.reels?.slice(0, 1).map((reel: Reel, i) => (
            <div
              key={reel._id || i}
              className="relative h-12 aspect-[2/3] mr-3"
            >
              {/* BACK LAYER (+X) */}
              {row.original.reels.length > 1 && (
                <div className="absolute top-0 left-5 w-full h-full rounded-md border bg-transparent flex items-center justify-end pr-[6px] z-0">
                  +{row.original.reels.length - 1}
                </div>
              )}

              {/* FRONT THUMBNAIL */}
              <div
                key={reel._id || i}
                className="relative z-10 h-full w-full rounded-md bg-slate-200 bg-cover bg-center"
                style={{
                  backgroundImage: `url("${reel?.thumbnailUrl}")`,
                }}
              />
            </div>
          ))}
        </div>
      ),
    },

    /* 📊 STATUS */
    {
      accessorKey: "role",
      header: () => <div>Role</div>,
      cell: ({ row }) => <Badge variant="default">{row.original.role}</Badge>,
    },

    /* ⚙️ OPTIONS */
    {
      id: "options",
      header: () => <div className="text-right">Options</div>,
      cell: ({ row }) => {
        const student: IStudent = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openViewModal(student)}>
                View Profile
              </DropdownMenuItem>

              {student.status === "shortlisted" ? (
                <DropdownMenuItem
                  onClick={() =>
                    handleStartChat({
                      studentId: student.id,
                      hiringProcessId: student.hiringProcessId,
                    })
                  }
                >
                  Start Chat
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => router.push("/chat")}>
                  Chat
                </DropdownMenuItem>
              )}
              {student.status !== "hired" && (
                <DropdownMenuItem
                  className="text-green-600 dark:text-green-500"
                  onClick={() => updateStatus(student, "hired")}
                >
                  Hire Candidate
                </DropdownMenuItem>
              )}

              {student.status !== "rejected" && (
                <>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => updateStatus(student, "rejected")}
                  >
                    Reject Candidate
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ].filter((column) => {
    if (column.id === "options" && !displayActions) return false;
    if (column.id === "select" && !displaySelect) return false;
    return true;
  });

  console.log("RENDERED!!");

  const [selectedDomain, setSelectedDomain] = useState("");

  const sortedData = useMemo(() => {
    const filtered = [...data];

    if (sortedViaSelected) {
      return filtered.sort((a, b) => {
        const aSelected = selectedStudents.includes(a.id);
        const bSelected = selectedStudents.includes(b.id);

        if (aSelected === bSelected) return 0;
        return aSelected ? -1 : 1;
      });
    }

    return filtered;
    // }, [data, selectedStudents, sortedViaSelected]);
  }, [data, selectedStudents, sortedViaSelected]);

  const table = useReactTable<IStudent>({
    data: sortedData,
    columns,
    state: {
      globalFilter,
      sorting,
      columnFilters,
      pagination: {
        pageIndex: pagination.page - 1,
        pageSize: pagination.limit,
      },
    },
    manualPagination: true,
    pageCount: Math.ceil(pagination.total / pagination.limit),
    getPaginationRowModel: getPaginationRowModel(), // optional since it's manual
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const state = updater({
          pageIndex: pagination.page - 1,
          pageSize: pagination.limit,
        });
        pagination.onPageChange(state.pageIndex + 1);
        pagination.onPageSizeChange(state.pageSize);
      } else {
        pagination.onPageChange(updater.pageIndex + 1);
        pagination.onPageSizeChange(updater.pageSize);
      }
    },

    getRowId: (row) => row.id, // 👈 this makes sure row.id === contact.id
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      return Object.values(row.original).some((val) =>
        String(val).toLowerCase().includes(filterValue.toLowerCase()),
      );
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    // onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const [searchQuery, setSearchQuery] = useState("");
  function handleSearch(e) {
    e.preventDefault();
    if (searchQuery === "") return;
    pagination.onPageChange(1); // Reset to page 1 when searching
    setSearch(searchQuery);
  }

  return (
    <div>
      {displayFilter && (
        <div className="flex items-center justify-between w-full p-4 px-0 ">
          <div className="flex gap-14 items-center">
            <div className="">
              Total Students (
              <span className="font-semibold">{pagination.total}</span>)
            </div>
            {/* <div className="flex items-center gap-2">
              <span className="text-sm">Rows per page:</span>
              {[10, 25, 50].map((size) => (
                <Button
                  key={size}
                  size="sm"
                  variant={
                    table.getState().pagination.pageSize === size
                      ? "default"
                      : "outline"
                  }
                  className="rounded-sm"
                  onClick={() => table.setPageSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>{" "} */}
          </div>
          <div className="flex gap-2">
            {setSearch ? (
              <form onSubmit={handleSearch} className="flex gap-2 relative">
                <span className="absolute flex top-1/2 left-2 -translate-y-1/2">
                  <Search className="h-4 w-4" />
                </span>
                {searchQuery && (
                  <Button
                    variant={"ghost"}
                    className="absolute h-6 w-6 flex top-1/2 right-2 -translate-y-1/2"
                    style={{ padding: 0 }}
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <Input
                  placeholder="Search Students..."
                  value={searchQuery}
                  onChange={(event) => {
                    // Reset the search status
                    if (event.target.value === "") {
                      pagination.onPageChange(1);
                      setSearch("");
                    }
                    setSearchQuery(event.target.value);
                  }}
                  className="max-w-md pl-8 pr-9"
                />
              </form>
            ) : (
              <Input
                placeholder="Search Students..."
                value={globalFilter}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="max-w-md"
              />
            )}
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table className="">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    onClick={
                      header.column.getCanSort()
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                    className={
                      header.column.getCanSort()
                        ? "cursor-pointer select-none"
                        : ""
                    }
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {header.column.getCanSort() && (
                        <>
                          {header.column.getIsSorted() === "asc" && (
                            <ArrowUp className="w-4 h-4" />
                          )}
                          {header.column.getIsSorted() === "desc" && (
                            <ArrowDown className="w-4 h-4" />
                          )}
                          {!header.column.getIsSorted() && (
                            <ArrowUpDown className="w-4 h-4 opacity-50" />
                          )}
                        </>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="cursor-pointer"
                onClick={() => onClick(row.original)}
                // onClick={() =>
                //   handleStartChat({
                //     studentId: row.original.id,
                //     hiringProcessId: row.original.hiringProcessId,
                //   })
                // }
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell className="pr-4" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {displayFooter && (
        <div className="flex items-center justify-between px-2 py-4">
          <div className="text-sm text-muted-foreground">
            Page {pagination.page} of{" "}
            {Math.max(1, Math.ceil(pagination.total / pagination.limit))}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={
                pagination.page >=
                Math.ceil(pagination.total / pagination.limit)
              }
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function getStatusBadge(status: Status) {
  switch (status) {
    case "shortlisted":
      return "bg-yellow-700 text-white";
    case "chatting":
      return "bg-blue-500 text-white";
    case "rejected":
      return "bg-red-500 text-white";
    case "interview_scheduled":
      return "bg-cyan-500 text-white";
    case "interview_completed":
      return "bg-violet-500 text-white";
    case "offer_sent":
      return "bg-green-500 text-white";
    case "hired":
      return "bg-green-700 text-white";
    default:
      return "outline";
  }
}
