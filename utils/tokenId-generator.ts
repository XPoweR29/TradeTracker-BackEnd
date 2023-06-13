import {v4 as uuid} from 'uuid';
import { UserRecord } from '../records/user.record';

export const generateTokenId = async() => {
    let tokenId: string
    let userWithThisToken = null;

    do {
        tokenId = uuid();
        userWithThisToken = await UserRecord.getByTokenId(tokenId);

   } while (!!userWithThisToken) {
        return tokenId;
   };

}