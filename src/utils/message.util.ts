import Message, {IMessage} from '../models/Message';

export async function createMessage(idUser: string, message: string): Promise<IMessage> {
    const newMessage = new Message({idUser: idUser, message: message});
    await newMessage.save();
    return newMessage;
}

export async function getMessages(): Promise<IMessage[]> {
    return await Message.find();
}