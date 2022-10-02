import Message, {IMessage} from '../models/Message';

export async function createMessage(idUser: string, idRoom: string, idType: string, url: string, message: string): Promise<IMessage> {
    const newMessage = new Message({idUser: idUser, idRoom: idRoom, idType: idType, url: url, message: message});
    await newMessage.save();
    return newMessage;
}