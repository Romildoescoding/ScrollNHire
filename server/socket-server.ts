import { Server } from "socket.io";
import http from "http";

const server = http.createServer();

const io = new Server(server, {
  cors: {
    origin: "*", // change in production
  },
});

const onlineUsers = new Map<string, string>();
// userId -> socketId

io.on("connection", (socket) => {
  socket.on("register", (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.broadcast.emit("user_online", userId);
  });

  socket.on("join_conversation", (conversationId) => {
    socket.join(conversationId);
  });

  socket.on("leave_conversation", (conversationId) => {
    socket.leave(conversationId);
  });

  socket.on("send_message", ({ conversationId, message, receiverId }) => {
    // 🟢 1. Real-time chat (only if in same room)
    socket.to(conversationId).emit("receive_message", message);

    // 🟢 2. Sidebar update (ALWAYS)
    const receiverSocketId = onlineUsers.get(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("conversation_updated", {
        conversationId,
        message,
      });
    }
  });

  //   socket.on("conversation_created", ({ conversationId }) => {
  //     socket.to(conversationId).emit("conversation_created", {
  //       conversationId,
  //     });
  //   });

  socket.on("create_conversation", ({ studentId, conversationId }) => {
    const studentSocketId = onlineUsers.get(studentId);

    if (studentSocketId) {
      io.to(studentSocketId).emit("conversation_created", {
        conversationId,
      });
    }
  });

  socket.on("interview_updated", ({ conversationId, message, receiverId }) => {
    socket.to(conversationId).emit("receive_interview_update", message);

    const receiverSocketId = onlineUsers.get(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("conversation_updated", {
        conversationId,
        message,
      });
    }
  });

  socket.on("messages_seen", ({ conversationId, messageIds, senderId }) => {
    const senderSocketId = onlineUsers.get(senderId);

    if (senderSocketId) {
      io.to(senderSocketId).emit("messages_seen_update", {
        conversationId,
        messageIds,
      });
    }
  });

  socket.on("get_online_users", () => {
    socket.emit("online_users_list", Array.from(onlineUsers.keys()));
  });

  socket.on("disconnect", () => {
    for (const [userId, id] of onlineUsers.entries()) {
      if (id === socket.id) {
        onlineUsers.delete(userId);

        // 🔥 tell everyone this user is offline
        socket.broadcast.emit("user_offline", userId);

        break;
      }
    }
  });
});

server.listen(4000, () => {
  console.log("🚀 Socket server running on port 4000");
});
