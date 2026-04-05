import { ArrowDown, CalendarPlus, File, FileText, Send, X } from "lucide-react";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
// import { deleteFileFromSupabase } from "../(root)/notes/upload/uploadFile";
// import { useSidebar } from "../context/SidebarContext";
import { motion } from "motion/react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";

const ChatInputForm = ({
  // scrollToBottom,
  // isSidebarOpen,
  // sendMessage,
  // setChats,
  // setIsGeminiLoading,
  sendMessage,
  setOpenInterviewModal,
  // conversationId,
  // setShowModal,
  // selectedPDfFile,
  // setSelectedPdfFile,
  // sendPDfMessageAI,
}: {
  sendMessage: (message: string) => void;
  setOpenInterviewModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const [message, setMessage] = useState("");
  //   const { collapsed } = useSidebar();
  // console.log(selectedPDfFile);

  // const pdfUrlToBUffer = async (pdfUrl) => {
  //   try {
  //     const pdfResponse = await fetch(pdfUrl);
  //     const pdfBuffer = await pdfResponse.arrayBuffer();
  //     return pdfBuffer;
  //   } catch (err) {
  //     console.error("Error fetching or processing PDF:", err);
  //   }
  // };

  // const handleSendMessage = async (
  //   e: React.FormEvent | React.KeyboardEvent,
  // ) => {
  //   console.log("Selected Pdf file is-->");
  //   console.log(selectedPDfFile);
  //   e.preventDefault();

  //   if (!message.trim()) return;

  //   //Remeber, i need to create another table to store the chatIs mapped to userids to fetch the previous cahts okay!!??
  //   try {
  //     setMessage("");
  //     const sender = "user";
  //     let fileMessage;
  //     console.log(selectedPDfFile);
  //     console.log(chatId === selectedPDfFile?.chatId);
  //     console.log({
  //       chatId,
  //       sender,
  //       content: "",
  //       document: selectedPDfFile?.title,
  //     });
  //     if (selectedPDfFile && chatId === selectedPDfFile?.chatId) {
  //       fileMessage = await sendMessage({
  //         chatId,
  //         sender,
  //         content: "",
  //         document: selectedPDfFile.title,
  //       });
  //     }
  //     const newMessage = await sendMessage({
  //       chatId,
  //       sender,
  //       content: message.trim(),
  //     });

  //     console.log("USER MESSAGE-------------------------------------");
  //     //Simulate realtime updates
  //     console.log(newMessage);
  //     console.log("USER MESSAGE-------------------------------------");
  //     setChats((chats) => {
  //       return fileMessage
  //         ? [...chats, fileMessage.data, newMessage.data]
  //         : [...chats, newMessage.data];
  //     });

  //     //Set gemini to loading
  //     setIsGeminiLoading(true);

  //     console.log("GOING TO AI");
  //     let data;
  //     console.log(selectedPDfFile);
  //     if (selectedPDfFile) {
  //       console.log("The file has been attache dude!!!");
  //       const pdfBuffer = await pdfUrlToBUffer(selectedPDfFile.fileUrl);
  //       data = await sendPDfMessageAI(pdfBuffer, message.trim());
  //     } else {
  //       data = await sendMessageAI(message.trim());
  //     }
  //     console.log("GONE TO AI");
  //     console.log(data);
  //     const aiContent = data.candidates[0].content.parts[0].text;
  //     const message1 = await sendMessage({
  //       chatId,
  //       sender: "ai",
  //       content: aiContent,
  //     });

  //     //Set gemini to idle
  //     setIsGeminiLoading(false);
  //     console.log("AI REPLY-------------------------------------");
  //     console.log(message1);
  //     console.log("AI REPLY-------------------------------------");
  //     //Simulate realtime updates
  //     setChats((chats) => [...chats, message1.data]);
  //   } catch (err) {
  //     console.error("Failed to send message:", err);
  //   }
  // };

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!message.length) return;
        sendMessage(message);
        setMessage("");
      }}
      style={{
        transition: "all 0.3s",
      }}
      // 60vw
      className={`w-full items-end gap-2 flex p-4 pt-2 rounded-t-xl`}
    >
      {/* Dispaly the selected pdf only in the chat session it was selected in yk.. */}
      {/* {selectedPDfFile && chatId === selectedPDfFile.chatId && (
        <div className=" w-full flex justify-end">
          <div className="relative bg-zinc-200 mt-2 ml-2 h-12 gap-2 flex items-center justify-start pl-[6px] w-fit pr-6 rounded-md">
            <div className=" h-fit w-fit p-1 py-2 bg-zinc-900 rounded-md">
              <FileText size={20} className="text-white" />
            </div>
            <span className=" text-sm">
              {selectedPDfFile.title.length > 14
                ? selectedPDfFile.title.slice(0, 15) + "..."
                : selectedPDfFile.title}
            </span>
            <button
              onClick={async (e) => {
                e.preventDefault();
                //It means the file had to be uploaded to supabase for this shit like why did you even select that file in first place dude...
                if (!selectedPDfFile.isNote) {
                  // The selectedPDfFile object would look like ... { fileUrl :"https://-----", title:"The File Name", isNote:false, chatId: "3ejfibd2y8ehnd"}
                  //So, i bet it would need the use of fileUrl to delete right....
                  //   await deleteFileFromSupabase(selectedPDfFile.fileUrl);
                }
                setSelectedPdfFile(null);
              }}
              className="absolute rounded-full  right-2 top-2"
            >
              <X
                size={16}
                className="hover:text-zinc-950 transition-all text-zinc-600"
              />
            </button>
          </div>
        </div>
      )} */}

      <textarea
        ref={inputRef}
        placeholder="Enter Message.."
        className=" flex-1 w-full h-auto max-h-[150px] bg-zinc-200 dark:bg-zinc-800 outline-none resize-none overflow-y-auto text-foreground rounded-lg pl-3 p-2 scrollbar-thin scrollbar-thumb-black scrollbar-track-transparent"
        rows={1}
        value={message}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Prevents a new line from being added
            if (!message.length) return;
            sendMessage(message); // Calls the form submission function
            setMessage("");
          }
        }}
        onChange={(e) => setMessage(e.target.value)}
        //Resize to max-150px on inputs just like ChatGPT does ><
        onInput={(e) => {
          e.target.style.height = "auto";
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
      />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="min-w-fit h-9 w-9 p-0 rounded-full bg-foreground text-background flex items-center justify-center"
            onClick={(e) => {
              e.preventDefault();
              setOpenInterviewModal(true);
            }}
            style={{ padding: 0 }}
          >
            <CalendarPlus size={15} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Schedule Interview</p>
        </TooltipContent>
      </Tooltip>

      <Button
        className="min-w-fit h-9 w-9 p-0 rounded-full bg-foreground text-background flex items-center justify-center"
        type="submit"
        style={{ padding: 0 }}
      >
        <Send size={15} />
      </Button>

      <div className="relative"></div>

      <motion.button
        // onClick={scrollToBottom}
        className="p-2 text-zinc-950 absolute top-[-50px] left-1/2 -translate-x-1/2 z-[998] rounded-full flex items-center justify-center bg-zinc-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <ArrowDown size={18} />
      </motion.button>

      {/* <button
        className="p-1 flex items-center justify-center absolute bottom-2 left-2"
        onClick={(e) => {
          e.preventDefault();
          setShowModal("select-file");
        }}
      >
        <span className="w-fit h-fit relative tooltip">
          <span
            className="tooltiptext"
            style={{
              top: "0%",
              right: "-70px",
              left: "unset",
              minWidth: "64px",
              display: "flex",
            }}
          >
            Upload File
          </span>
          <File size={20} color="black" />
        </span>
      </button> */}
    </form>
  );
};

export default ChatInputForm;
