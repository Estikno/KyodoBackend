import {Request, Response} from 'express';
import RoomType, {IRoomType} from '../models/RoomType';

/**
 * Get only one room type by id 
 * * Gets by the id of the model, not de _id of mongoose
*/
export async function getRoomType(req: Request, res: Response): Promise<Response> {
    const foundRoomType = await RoomType.findOne({id: req.params.id});

    if(foundRoomType){
        return res.json(foundRoomType);
    }

    return res.status(404).json({message: 'Room type not found'});    
}