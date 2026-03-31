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
import { IStudent } from "@/app/hooks/useShortlistedStudents";

interface DataTableProps {
  displayFilter: boolean;
  displayActions: boolean;
  displaySelect?: boolean;

  data: IStudent[];

  selectedStudents: string[];
  setSelectedStudents: React.Dispatch<React.SetStateAction<string[]>>;

  openViewModal: (student: IStudent) => void;
  openDeleteModal: (student: IStudent) => void;
  openEditModal: (student: IStudent) => void;

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
  setSearch,
  //   selectedList,
  //   setSelectedList,
  displayFilter = true,
  displayActions = true,
  displaySelect = true,
  data,
  selectedStudents,
  setSelectedStudents,
  openViewModal,
  openDeleteModal,
  openEditModal,
  sortedViaSelected = false,
  pagination,
}: // listForSorting,
// setListForSorting,
DataTableProps) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
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
          checked={selectedStudents.includes(row.original.id)}
          onCheckedChange={() => {
            const id = row.original.id;
            setSelectedStudents((prev) =>
              prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
            );
          }}
        />
      ),
    },

    /* 👤 STUDENT */
    {
      accessorKey: "name",
      header: () => <div>Student</div>,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <img
            src={row.original.image}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">
              {row.original.email}
            </p>
          </div>
        </div>
      ),
    },

    /* 🎓 EDUCATION */
    {
      accessorKey: "degree",
      header: () => <div>Education</div>,
      cell: ({ row }) => (
        <div className="text-sm">
          <p>{row.original.degree || "-"}</p>
          <p className="text-muted-foreground text-xs">{row.original.branch}</p>
        </div>
      ),
    },

    /* 📊 CGPA */
    {
      accessorKey: "cgpa",
      header: () => <div>CGPA</div>,
      cell: ({ row }) => row.original.cgpa || "-",
    },

    /* 🧠 SKILLS */
    {
      accessorKey: "skills",
      header: () => <div>Skills</div>,
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {row.original.skills?.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
          {row.original.skills?.length > 3 && (
            <Badge variant="outline">+{row.original.skills.length - 3}</Badge>
          )}
        </div>
      ),
    },

    /* 🎬 REELS COUNT */
    {
      id: "reels",
      header: () => <div>Reels</div>,
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.reels?.length || 0}</Badge>
      ),
    },

    /* 📊 STATUS */
    {
      accessorKey: "status",
      header: () => <div>Status</div>,
      cell: ({ row }) => <Badge variant="default">{row.original.status}</Badge>,
    },

    /* ⚙️ OPTIONS */
    {
      id: "options",
      header: () => <div className="text-right">Options</div>,
      cell: ({ row }) => {
        const student = row.original;

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

              <DropdownMenuItem onClick={() => openEditModal(student)}>
                Start Chat
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-destructive"
                onClick={() => openDeleteModal(student)}
              >
                Remove
              </DropdownMenuItem>
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
        <div className="flex items-center justify-between w-full p-4 ">
          <div className="flex gap-14 items-center">
            <div className="">
              All Students (
              <span className="font-semibold">{pagination.total}</span>)
            </div>
            <div className="flex items-center gap-2">
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
            </div>{" "}
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

      <div className="rounded-none border">
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
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
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
              pagination.page >= Math.ceil(pagination.total / pagination.limit)
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

function getAvailabilityBadge(availability: string) {
  switch (availability) {
    case "Available":
      return "success";
    case "Unsubscribed":
      return "secondary";
    case "Bounced":
      return "destructive";
    default:
      return "outline";
  }
}
