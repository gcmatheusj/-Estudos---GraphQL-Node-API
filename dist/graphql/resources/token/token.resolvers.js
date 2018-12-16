"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const utils_1 = require("../../../utils/utils");
exports.tokenResolvers = {
    Mutation: {
        createToken: (parent, { email, passwd }, { db }) => {
            return db.User.findOne({
                where: { email: email },
                attributes: ['id', 'passwd']
            }).then((user) => {
                if (!user || !user.isPasswd(user.get('passwd'), passwd)) {
                    throw new Error('Unauthorized, wrong email or password');
                }
                const payload = { sub: user.get('id') };
                return {
                    token: jwt.sign(payload, utils_1.JWT_SECRET)
                };
            });
        }
    }
};
