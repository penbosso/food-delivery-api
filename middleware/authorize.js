const { expressjwt: jwt } = require('express-jwt');
const db = require('../db');
const ROLES_LIST = require('../config/roles_list');
require('dotenv').config();

const secret = process.env.SECRET;

// authenticate JWT token and attach decoded token to request as req.user
const authorize = () => {
    return [
        jwt({ secret, algorithms: ['HS256'] }),
        async (req, res, next) => {
            const user = await db.User.findByPk(req.auth?.sub);
            if (!user)
                return res.status(401).json({ message: 'Unauthorized' });
            req.user = user.get();
            next();
        }
    ];
}

// authorize hierarchical permission
const authorizeRole = (role) => {
    return (req, res, next) => {
        if (!req?.user?.role) return res.sendStatus(401);
        if (+req.user.role < +role) return res.sendStatus(401);
        next();
    }
}

// authorize resource owner or admin
const authorizeOwner = () => {
    return (req, res, next) => {
        if (req?.user?.user_id != req?.params?.id && req.user.role != ROLES_LIST.Admin) return res.sendStatus(401);
        next();
    }
}
// authorize restaurant owner or admin
const authorizeRestaurantOwner = () => {
    return (req, res, next) => {
        if (req?.user?.role == ROLES_LIST.Admin) return next();
        if (req.baseUrl == '/restaurants') {
            if (req?.user?.restaurant_id !== req?.params?.id) return res.sendStatus(401);
        } else {
            if (req?.user?.restaurant_id !== req?.query.restaurant) return res.sendStatus(401);
        }
        next();
    }
}
module.exports = { authorize, authorizeRole, authorizeOwner, authorizeRestaurantOwner };