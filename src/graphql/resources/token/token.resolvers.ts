import * as jwt from 'jsonwebtoken'

import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { UserInstance } from "../../../models/UserModel"
import { JWT_SECRET } from '../../../utils/utils'

export const tokenResolvers = {
    Mutation: {
        createToken: (parent, { email, passwd}, {db}: {db: DbConnection}) => {
            return db.User.findOne({
                where: { email: email },
                attributes: ['id', 'passwd']
            }).then((user: UserInstance) => {
                if(!user || !user.isPasswd(user.get('passwd'), passwd)) {
                    throw new Error('Unauthorized, wrong email or password')
                }

                const payload = {sub: user.get('id')}

                return {
                    token: jwt.sign(payload, JWT_SECRET)
                }
            })
        }
    }
}