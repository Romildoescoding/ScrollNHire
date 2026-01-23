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
import { EmailThread } from "@prisma/client";
import { formatDate } from "@/app/lib/utils";

interface DataTableProps {
  displayFilter: boolean;
  displayActions: boolean;
  displaySelect?: boolean;
  data: EmailThread[];
  selectedEmails: string[];
  setSelectedEmails: (ids: string[]) => void;
  openViewModal: (emailThread: EmailThread) => void;
  openDeleteModal: (emailThread: EmailThread) => void;
  openEditModal: (emailThread: EmailThread) => void;
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

function formatEmailSender(sender: string): string {
  // Extract the part before "<"
  const namePart = sender.split("<")[0].trim();

  // Truncate to max 15 chars
  if (namePart.length > 15) {
    return namePart.slice(0, 15) + "...";
  }

  return namePart;
}

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
  selectedEmails,
  setSelectedEmails,
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

  const columns: ColumnDef<EmailThread>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={selectedEmails.length === data.length && data.length > 0}
          onCheckedChange={() => {
            if (selectedEmails.length === data.length) {
              setSelectedEmails([]);
            } else {
              setSelectedEmails(data.map((row) => row.id));
            }
          }}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedEmails.includes(row.original.id)}
          onCheckedChange={() => {
            const id = row.original.id;
            setSelectedEmails((prev) =>
              prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
            );
          }}
        />
      ),
    },
    {
      accessorKey: "from",
      header: () => <div>From</div>,
      cell: (info) => (
        <h2 className="font-medium">{formatEmailSender(info.getValue())}</h2>
      ),
    },
    // {
    //   accessorKey: "subject",
    //   header: () => <div>Subject</div>,
    //   cell: (info) => info.getValue() || "-",
    // },
    {
      accessorKey: "summary",
      header: () => <div>Email</div>,
      cell: (info) => info.getValue().slice(0, 65) + "..." || "-",
    },
    {
      accessorKey: "isImportant",
      header: () => <div>Priority</div>,
      cell: ({ row }) => (
        <Badge variant={row.original.isImportant ? "default" : "secondary"}>
          {row.original.isImportant ? "Important" : "Irrelevant"}
        </Badge>
      ),
    },
    {
      accessorKey: "receivedAt",
      header: () => <div>Received At</div>,
      cell: ({ row }) => (
        <Badge variant="outline">
          {formatDate(row.original.receivedAt) || "-"}
        </Badge>
      ),
    },
    {
      accessorKey: "actions",
      header: () => <div>Actions</div>,
      cell: ({ row }) => (
        <Button
          variant={"outline"}
          className="p-0 px-2 h-fit"
          disabled={!row.original.actions.length}
          //   variant={row.original.actions.length ? "outline" : "secondary"}
          style={{
            cursor: row.original.actions.length ? "pointer" : "not-allowed",
          }}
        >
          Actions
        </Button>
      ),
    },
    {
      id: "options",
      header: () => <div className="text-right">Options</div>,
      cell: ({ row }) => {
        const contact = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
              <DropdownMenuItem onClick={() => openEditModal(contact)}>
                Original Email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openViewModal(contact)}>
                Reply
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => openDeleteModal(contact)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ].filter((column) => {
    // Remove the "actions" column if displayActions is false
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
        const aSelected = selectedEmails.includes(a.id);
        const bSelected = selectedEmails.includes(b.id);

        if (aSelected === bSelected) return 0;
        return aSelected ? -1 : 1;
      });
    }

    return filtered;
  }, [data, , selectedEmails, sortedViaSelected]);

  const table = useReactTable({
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
        String(val).toLowerCase().includes(filterValue.toLowerCase())
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
              All Emails (
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
                  placeholder="Search emails..."
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
                placeholder="Search emails..."
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
                        header.getContext()
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
