import { Server, Socket } from "socket.io";
import User from "./models/User";
import { createMessage, getMessages } from "./utils/message.util";
import { createToken } from "./utils/jwt";
import { IUserResponse } from "./interfaces/IClientResponse";
import { Schema } from "mongoose";
import { getUsersGraphql } from "./controllers/user.controller";

interface ISendMessage {
    message: string;
    username: string;
    id_room: string;
    id_message: string;
}

interface IRecieveMessage {
    person: string;
    message: string;
    username_to: string;
    id_room: string;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Sets up the required functionality for the socket connections needed for the chat
 * @param io the io server to use
 */
export async function io_setup(io: Server) {
    const connectedUsers: Map<string, string> = new Map();

    io.on("connection", (socket: Socket) => {
        socket.on("add-user", async (user) => {
            const newUser = await User.findOne({ username: user });

            const allMessages: ISendMessage[] = (await getMessages()).map(
                (each) => {
                    return {
                        message: each.message,
                        username: each.username,
                        id_room: each.idRoom.toString(),
                        id_message: each._id,
                    } as ISendMessage;
                }
            );

            socket.emit("all-msg", allMessages);

            /*if (connectedUsers.get(user)) return;
            if (!newUser) return;

            connectedUsers.set(user, socket.id);

            const newUserResponse: IUserResponse = {
                avatarUrl: newUser.avatarImage.avatarImageUrl,
                email: newUser.email,
                username: newUser.username,
                verified: newUser.email_verified,
            };
            socket.broadcast.emit("new-usr", newUserResponse);*/
        });

        socket.on("send-msg", async (msg: IRecieveMessage) => {
            const foundUser = await User.findOne({ username: msg.person });

            if (foundUser) {
                const message = await createMessage(
                    foundUser._id,
                    msg.message,
                    foundUser.username,
                    msg.username_to,
                    msg.id_room
                );

                if (message) {
                    io.emit("msg", {
                        message: msg.message,
                        username: msg.person,
                        id_room: message.idRoom.toString(),
                        id_message: message.id,
                        update: message.idRoom.toString() !== msg.id_room,
                    } as ISendMessage);

                    if (message.idRoom.toString() !== msg.id_room) {
                        const foundUser2 = await User.findOne({
                            username: msg.username_to,
                        });

                        if (!foundUser2) return console.log("not found user");

                        const users = await getUsersGraphql(
                            createToken(foundUser.id)
                        );
                        const users2 = await getUsersGraphql(
                            createToken(foundUser2.id)
                        );

                        io.emit("update", {
                            user1: foundUser.username,
                            user2: foundUser2.username,
                            users1: users.user,
                            users2: users2.user,
                        });
                    }
                }
            }
        });
    });
}
