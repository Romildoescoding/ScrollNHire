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

  socket.on("disconnect", () => {
    for (const [userId, id] of onlineUsers.entries()) {
      if (id === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});

server.listen(4000, () => {
  console.log("🚀 Socket server running on port 4000");
});
