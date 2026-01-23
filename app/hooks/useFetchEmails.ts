import { useState, useEffect } from "react";
import axios from "axios";
// import { useSession } from "next-auth/react";
import { EmailThread } from "@prisma/client";

const useFetchEmails = () => {
  const [emails, setEmails] = useState<EmailThread[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  //   const { data: session } = useSession();

  useEffect(() => {
    const fetchemails = async () => {
      //   const userId = session?.user?.id;
      try {
        const res = await axios.get(
          `/api/mails/fetch?page=${page}&limit=${limit}&search=${search}`
        );
        setEmails(res.data.threads);
        setTotal(res.data.total);
      } catch (err) {
        console.error("Failed to fetch mail insights:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchemails();
  }, [page, limit, search]);

  return {
    emails,
    setEmails,
    total,
    search,
    setSearch,
    page,
    setPage,
    limit,
    setLimit,
    isLoading,
  };
};

export default useFetchEmails;
