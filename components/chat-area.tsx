"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { ArrowDown, Copy, Loader2, Send } from "lucide-react";
// import UserMessage from "./UserMessage";
// import AiMessage from "./AiMessage";
// import { getUserClient } from "../_lib/actions";
// import { SessionProvider, useSession } from "next-auth/react";
// import Spinner from "./Spinner";
// import { useCurrentUser } from "../auth/useCurrentUser";
// import useChats from "../(root)/chat/useChats";
// import useSendMessage from "../(root)/chat/useSendMessage";
// import useGeminiAI from "../(root)/chat/useGeminiAI";
// import ChatInputForm from "./ChatInputForm";
// import Modal from "./Modal";
// import ModalUploadPdf from "./ModalUploadPdf";
// import usePdfGeminiAI from "../(root)/chat/usePdfGeminiAI";
// import FileMessage from "./FileMessage";
import { useRouter } from "next/navigation";
import UserMessage from "./receiver-message";
import SenderMessage from "./sender-message";
import ChatInputForm from "./chat-input-form";
import { useUserDetails } from "@/app/hooks/useUserDetails";

//OPTIMIZE IT TO PREVENT RE-RENDERS ON ENTERING THE DATA IN THE TEXTAREA

const ChatArea = ({ chatId, isSidebarOpen }) => {
  const chatAreaRef = useRef(null);
  const { user } = useUserDetails();
  const [chats, setChats] = useState([
    { sender: "ai", content: "Hello" },
    { sender: "user", content: "Nah dude, heyy" },
  ]);
  const [isGeminiLoading, setIsGeminiLoading] = useState(false);
  const [showModal, setShowModal] = useState("");
  //   const { user, status } = useUserDetails();
  //   const { sendMessage, isSending, error } = useSendMessage();
  const [selectedPdfFile, setSelectedPdfFile] = useState(null);
  //   const {
  //     sendMessageAI,
  //     isSending: isSendingAI,
  //     error: errorAI,
  //   } = useGeminiAI();
  const router = useRouter();
  const parentRef = useRef<HTMLDivElement>(null);

  const [isAtBottom, setIsAtBottom] = useState(true);
  //Take to editor feature
  //   const { setNotes } = useNotes();

  //   const {
  //     sendPDfMessageAI,
  //     isSending: isSending2,
  //     error: errorPDF,
  //   } = usePdfGeminiAI();

  //   const handleGenerate = async (markdown: string, id: number) => {
  //     // const results: INote[] = [];

  //     const results = [];
  //     const note = await convertMarkdownToBlocknote(markdown, id);
  //     const rawText = note.candidates[0]?.content?.parts[0]?.text || "";
  //     console.log(rawText);
  //     const cleanJson = rawText.replace(/^```json\s+|\s+```$/g, "").trim();
  //     console.log(cleanJson);

  //     // Ensure there's no trailing characters or syntax issues
  //     const lastIndex = cleanJson.lastIndexOf("]");
  //     const finalJson = cleanJson.substring(0, lastIndex + 1);

  //     const parsedData = JSON.parse(finalJson);
  //     console.log(parsedData);
  //     results.push(parsedData);

  //     console.log(results);
  //     const prevNotes = JSON.parse(localStorage.getItem("notes") || "[[]]");
  //     // This actually works
  //     setNotes([[...prevNotes[0], ...results]]);
  //     // setNotes([[...prevNotes[0], ...results[0]]]);
  //     router.push("/notes/editor");
  //   };

  //Scrolling into the latest message to bottom..
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isGeminiLoading]);

  function scrollToBottom() {
    chatAreaRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const [status, setStatus] = useState(null);

  return (
    // <SessionProvider>
    <>
      {/* {showModal === "select-file" && (
        <Modal setShowModal={setShowModal}>
          <ModalUploadPdf
            chatId={chatId}
            setShowModal={setShowModal}
            setSelectedPdfFile={setSelectedPdfFile}
          />
        </Modal>
      )} */}

      <div
        className={`w-full relative flex justify-center h-fit min-h-[calc(100vh-80px)] pt-4 ${
          selectedPdfFile ? "pb-40" : "pb-28"
        }`}
      >
        <div
          ref={parentRef}
          className="w-full max-w-[95vw] min-[450px]:max-w-[75vw] min-[800px]:max-w-[60vw] h-fit flex flex-col gap-4"
          // Styles to display the loading spinner
          style={{
            alignItems:
              !status || status === "loading" || status === ""
                ? "center"
                : "top",
            justifyContent:
              !status || status === "loading" || status === ""
                ? "center"
                : "start",
          }}
        >
          {!status || status === "loading" || status === "" || !chats ? (
            <Loader2 height={24} width={24} />
          ) : (
            <>
              {chats.map((message, i) =>
                message.sender === "ai" ? (
                  <SenderMessage
                    key={i}
                    user={user}
                    text={message.content}
                    // handleGenerate={handleGenerate}
                    // isProcessing={isProcessing}
                  />
                ) : (
                  // ) : message.document ? (
                  //   <FileMessage
                  //     key={i}
                  //     user={user}
                  //     document={message.document}
                  //   />
                  <UserMessage key={i} user={user} text={message.content} />
                ),
              )}
              {isGeminiLoading && <SenderMessage user={user} text={""} />}
              {/* Scroll to the bottom yk */}
              <div ref={chatAreaRef} /> {/* Scroll target */}
            </>
          )}

          <ChatInputForm
            scrollToBottom={scrollToBottom}
            selectedPDfFile={selectedPdfFile}
            setSelectedPdfFile={setSelectedPdfFile}
            sendPDfMessageAI={() => {}}
            isSidebarOpen={isSidebarOpen}
            sendMessage={() => {}}
            setChats={() => {}}
            setIsGeminiLoading={setIsGeminiLoading}
            sendMessageAI={() => {}}
            chatId={chatId}
            setShowModal={setShowModal}
          />
        </div>
      </div>
    </>
    // </SessionProvider>
  );
};

export default ChatArea;
