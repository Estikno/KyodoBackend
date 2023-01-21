import Message, { IMessage } from "../models/Message";

export async function createMessage(
    idUser: string,
    message: string,
    username: string
): Promise<IMessage> {
    const newMessage = new Message({
        idUser: idUser,
        username: username,
        message: message,
    });
    await newMessage.save();
    return newMessage;
}

export async function getMessages(): Promise<IMessage[]> {
    return await Message.find();
}
