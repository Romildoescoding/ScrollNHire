import { Ellipsis, Pen, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";
// import useOutsideClick from "../hooks/useOutsideClick";
// import useRenameChat from "../(root)/chat/useRenameChat";
// import Modal from "./Modal";
// import ModalUploadPdf from "./ModalUploadPdf";
// import ModalConfirmDelete from "./ModalConfirmDelete";
// import useDeleteChat from "../(root)/chat/useDeleteChat";

const UserChatButton = ({
  email,
  chat,
  setSelectedChat,
  selectedChat,
  setChatsState,
}) => {
  const [showOptions, setShowOptions] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  //   const { renameChat, isRenaming: isRenamingLoading } = useRenameChat();
  //   const { deleteChat, isDeleting: isDeletingChat } = useDeleteChat();
  const [isHovered, setIsHovered] = useState(false);

  //The chats filtering bug caused due to the title not updating as it was a state...
  useEffect(() => {
    setRenameValue(chat.title);
  }, [chat]);

  // Single ref to handle both rename input and options menu

  // Check for the modal for delete
  //   const containerRef = useOutsideClick(() => {
  //     if (isRenaming) {
  //       handleRenameEnd();
  //     } else if (showOptions === "options") {
  //       setShowOptions("");
  //     }
  //   });

  //   const handleDeleteChat = async () => {
  //     console.log("Deleting chat!!!!");
  //     console.log(await deleteChat(email, chat.chatId));
  //     console.log("Executed the delete function!!");
  //     setChatsState((prevChats) => {
  //       if (!prevChats) return prevChats;
  //       const newChats = [
  //         ...prevChats.filter((chat1) => chat1.chatId !== chat.chatId),
  //       ];
  //       return newChats;
  //     });
  //     setShowOptions("");
  //   };

  //   const handleRenameEnd = () => {
  //     setIsRenaming(false);
  //     if (renameValue !== chat.title && renameValue.length > 0) {
  //       renameChat(email, chat.chatId, renameValue);
  //     }
  //     if (renameValue.length <= 0) {
  //       setRenameValue(chat.title);
  //     }
  //   };

  //   useEffect(() => {
  //     if (isRenaming && containerRef.current) {
  //       containerRef.current.querySelector("input")?.focus();
  //     }
  //   }, [isRenaming, containerRef]);

  return (
    <div
      className="p-2 px-4 hover:bg-zinc-200 outline-none relative rounded-lg flex gap-3 text-xs items-center transition-all cursor-pointer min-w-[131px] max-w-[131px] buttonClass bg-zinc-100"
      onClick={(e) => {
        // This logic checks the if the element clicked cosnists a class called buttonClass and if so, only then it switches to a new chat...
        if (e.target.attributes[0].nodeValue.includes("buttonClass"))
          setSelectedChat(chat.chatId);
        // handleDeleteChat();
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background:
          selectedChat === chat.chatId
            ? "#e4e4e7"
            : isHovered
              ? "#efefef"
              : "#fff",
      }}
    >
      <div
        // ref={containerRef}
        className="relative flex gap-2 items-center buttonClass justify-between w-full chatButton "
      >
        {/* {isRenaming ? (
          <input
            type="text"
            value={renameValue}
            className="w-[80px]"
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleRenameEnd();
              }
            }}
            onBlur={handleRenameEnd}
          />
        ) : //In order to simulate realtime update ><.. gonna have to do this a lot I guess..
        renameValue.length > 11 ? (
          renameValue.slice(0, 10) + ".."
        ) : (
          renameValue
        )} */}
        renameValue
        {/* The options pop-up */}
        {showOptions === "options" && (
          <span className="absolute flex flex-col gap-1 top-[75%] z-[9999] left-[90%] rounded-lg h-fit w-fit p-2 bg-zinc-50 shadow-md shadow-[#ccc]">
            <span
              className="flex gap-2 pointer w-full rounded-md h-fit p-2 hover:bg-zinc-200"
              onClick={(e) => {
                e.stopPropagation();
                setIsRenaming(true);
                setShowOptions("");
              }}
            >
              <Pen size={15} color="#18181b" /> Rename
            </span>
            <button
              className="flex gap-2 pointer w-full rounded-md h-fit p-2 hover:bg-zinc-200 disabled:text-zinc-400 disabled:cursor-not-allowed"
              disabled={email === "romil4business@gmail.com"}
              onClick={(e) => {
                e.stopPropagation();
                setShowOptions("confirm-delete");
              }}
            >
              <Trash2 size={15} /> Delete
            </button>
          </span>
        )}
        {/* {showOptions === "confirm-delete" && (
          // <Modal setShowModal={setShowOptions}>
          <ModalConfirmDelete
            setShowModal={setShowOptions}
            handleDelete={handleDeleteChat}
            isLoading={isDeletingChat}
          />
          // </Modal>
        )} */}
        {!isRenaming && (
          <span
            className="cursor-pointer tooltip"
            onClick={(e) => {
              e.stopPropagation();
              setShowOptions("options");
            }}
          >
            {!showOptions && <span className="tooltiptext">Options</span>}
            <Ellipsis size={15} className="" color="#18181b" />
          </span>
        )}
      </div>
    </div>
  );
};

export default UserChatButton;
