"use client";

import useFetchEmails from "@/app/hooks/useFetchEmails";
import { DataTable } from "@/components/email-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { EmailThread } from "@prisma/client";
import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const {
    emails,
    setEmails,
    total,
    page,
    setPage,
    limit,
    setLimit,
    isLoading,
    setSearch,
  } = useFetchEmails();
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  useEffect(() => {
    console.log(emails);
  }, [emails]);
  return (
    <div className="h-full w-full flex flex-col gap-4">
      <Card className="dark:bg-neutral-950 border-none shadow-none p-0">
        <CardHeader className="flex flex-row items-center p-0 justify-between">
          {/* <CardTitle className="text-xl">All Emails ({total})</CardTitle> */}
          <div className="flex items-center gap-2"></div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border rounded-sm">
            <DataTable
              pagination={{
                page,
                limit,
                total,
                onPageChange: (newPage) => setPage(newPage),
                onPageSizeChange: (newSize) => {
                  setLimit(newSize);
                  setPage(1); // reset to first page
                },
              }}
              setSearch={setSearch}
              openViewModal={() => {}}
              openDeleteModal={() => {}}
              openEditModal={() => {}}
              data={emails}
              selectedEmails={selectedEmails}
              setSelectedEmails={setSelectedEmails}
              displayActions={true}
              displayFilter={true}
              displaySelect={true}
              sortedViaSelected={false}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
