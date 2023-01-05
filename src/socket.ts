import { Server, Socket } from "socket.io";
import User from "./models/User";
import { createMessage, getMessages } from "./utils/message.util";
import { IUserResponse } from "./interfaces/IClientResponse";

export async function io_setup() {
    const io = new Server(5050, { cors: { origin: "*" } });

    const connectedUsers: Map<string, string> = new Map();

    io.on("connection", (socket: Socket) => {
        socket.on("add-user", async (user) => {
            const newUser = await User.findOne({ username: user });

            const allMessages: string[] = (await getMessages()).map(
                (each) => each.message
            );
            socket.emit("all-msg", allMessages.toString());

            if (connectedUsers.get(user)) return;
            if (!newUser) return;

            connectedUsers.set(user, socket.id);

            const newUserResponse: IUserResponse = {
                avatarUrl: newUser.avatarImage.avatarImageUrl,
                email: newUser.email,
                username: newUser.username,
                verified: newUser.verified
            };
            socket.broadcast.emit("new-usr", newUserResponse);
        });

        socket.on("send-msg", async (msg) => {
            const foundUser = await User.findOne({ username: msg.person });

            if (foundUser) {
                await createMessage(foundUser._id, msg.message);
                socket.broadcast.emit("msg", msg.message);
            }
        });
    });
}