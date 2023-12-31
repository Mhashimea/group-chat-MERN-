import { Server } from "socket.io";

let io: any = null;
export default class SocketConnection {
  socketConnection(http: any) {
    io = new Server(http, {
      cors: {
        origin: "*",
      },
    });

    io.on("connection", (socket: any) => {
      // join to the group
      socket.on("joinGroup", (id: number) => {
        console.log("joinGroup", id);
        socket.join("group-" + id);
      });

      // broadcast message to group
      socket.on("groupMessage", (id: number, message: any) => {
        socket.to("group-" + id).emit("groupMessage-" + id, message);
      });

      // broadcast action to group
      socket.on("groupAction", (id: number, message: any) => {
        console.log("groupAction", id, message);
        socket.to("group-" + id).emit("groupAction-" + id, message);
      });

      // leave from the group
      socket.on("leaveGroup", (id: number) => {
        console.log("leaveGroup", id);
        socket.leave("group-" + id);
      });
    });
  }

  // send message to group
  sendMessageToGroup(id: number, message: any) {
    io.to("group-" + id).emit("groupMessage-" + id, message);
  }

  // send action to group
  sendActionToGroup(id: number, message: any) {
    io.to("group-" + id).emit("groupAction-" + id, message);
  }
}
