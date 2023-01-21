import { Server, Socket } from "socket.io";
import User from "./models/User";
import { createMessage, getMessages } from "./utils/message.util";
import { IUserResponse } from "./interfaces/IClientResponse";

interface sendMessage {
    message: string;
    username: string;
}

export async function io_setup(io: Server) {
    const connectedUsers: Map<string, string> = new Map();

    io.on("connection", (socket: Socket) => {
        socket.on("add-user", async (user) => {
            const newUser = await User.findOne({ username: user });

            const allMessages: sendMessage[] = (await getMessages()).map(
                (each) => {
                    return {
                        message: each.message,
                        username: each.username,
                    } as sendMessage;
                }
            );
            socket.emit("all-msg", allMessages);

            if (connectedUsers.get(user)) return;
            if (!newUser) return;

            connectedUsers.set(user, socket.id);

            const newUserResponse: IUserResponse = {
                avatarUrl: newUser.avatarImage.avatarImageUrl,
                email: newUser.email,
                username: newUser.username,
                verified: newUser.verified,
            };
            socket.broadcast.emit("new-usr", newUserResponse);
        });

        socket.on("send-msg", async (msg) => {
            const foundUser = await User.findOne({ username: msg.person });

            if (foundUser) {
                await createMessage(
                    foundUser._id,
                    msg.message,
                    foundUser.username
                );
                io.emit("msg", { message: msg.message, username: msg.person });
            }
        });
    });
}
