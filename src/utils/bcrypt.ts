import config from '../config';
import bcrypt from 'bcrypt';

export async function encrypt(value: string): Promise<string>{
    if(!config.BCRYPT_SALT_NUM) throw "Bcrypt num is required";
    
    const salt = await bcrypt.genSalt(parseInt(config.BCRYPT_SALT_NUM, 10));
    const hash = await bcrypt.hash(value, salt);

    return hash;
}