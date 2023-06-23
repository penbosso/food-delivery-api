const User = require('../model/user');
const jwt = require('jsonwebtoken');
const { Sequelize } = require('sequelize');
const db = require('../db');
const Op = Sequelize.Op;
const bcrypt = require('bcryptjs');
require('dotenv').config();

const secret = process.env.SECRET;

module.exports = {
    authenticate,
    getAll,
    getById,
    createUser,
    update,
    delete: _delete,
};
async function resetPassword({ user_id }) {
    let user = await db.User.findByPk(user_id);
    user.password = '$2a$10$SdmcPgDlqall8LzKAblUdO3pYnTaCeTl57MQNiJ3.bGr1iz11PgBi';
    user.password_reset = true;
    await user.save();
}

async function changePassword({ userId, currentPassword, newPassword }) {
    let user = await db.User.scope('withPassword').findByPk(userId);
    if (!user || !(await bcrypt.compare(currentPassword, user.password)))
        throw 'Current password entered is incorrect';

    user.password = await bcrypt.hash(newPassword, 10);
    user.password_reset = true;
    await user.save();
}

async function authenticate({ telephone, password }) {
    const foundUser = await db.User.scope('withPassword').findOne({ where: { telephone: telephone } });


    if (!foundUser || !(await bcrypt.compare(password, foundUser.password)))
        throw 'Telephone number or password is incorrect';
    if (foundUser?.status.toLowerCase() !== 'active')
        throw 'User account is not active'

    // authentication successful
    const token = jwt.sign({ sub: foundUser.user_id, username: foundUser.username }, secret, { expiresIn: '7d' });
    return { ...omitHash(foundUser.get()), token };
}

async function getAll() {
    return await db.User.findAll();
}

async function getAllByPersonnelType(type, status) {
    if(!status) {
        return await db.User.findAll({
            where: {
                    personnel_type: {
                        [Op.eq]: type
                    }
                
            }
        });

    }
    return await db.User.findAll({
        where: {
            [Op.and]: [{
                personnel_type: {
                    [Op.eq]: type
                }
            }, {
                status: { [Op.eq]: active }
            }]
        }
    });
}

async function getAllIn(list) {
    return await db.User.findAll({
        where: {
            [Op.and]: {
                user_id: {
                    [Op.in]: list
                },
                status: { [Op.eq]: 'active' }
            }
        }
    });
}

async function getAllInByType(list, type) {
    return await db.User.findAll({
        where: {
            [Op.and]: {
                user_id: { [Op.in]: list },
                personnel_type: type,
                status: { [Op.eq]: 'active' }
            }
        }
    });
}

async function getAllNotIn(list) {
    return await db.User.findAll({
        where: {
            [Op.and]: {
                user_id: {
                    [Op.notIn]: list
                },
                status: { [Op.eq]: 'active' }
            }
        }
    });
}
async function getAllNotInByType(list, type) {
    return await db.User.findAll({
        where: {
            [Op.and]: {
                user_id: { [Op.notIn]: list },
                personnel_type: type,
                status: { [Op.eq]: 'active' }

            }
        }
    });
}

async function getById(id) {
    return await getUser(id);
}

async function createUser(params) {
    // validate
    if (params.telephone != "" && await db.User.findOne({ where: { telephone: params.telephone } })) {
        throw 'Telephone number "' + params.telephone + '" is already taken';
    }

    // hash password
    if (params.password) {
        params.password = await bcrypt.hash(params.password, 10);
    }

    // save user
    await db.User.create(params);
}

async function createVisitor(params) {
    const timeStamp = new Date();
    // save user
    await db.User.create({ username: params.username, createdAt: timeStamp });
    const newUser = await db.User.findOne({
        where: {
            [Op.and]: { username: params.username, createdAt: timeStamp }
        }
    })
    return newUser.user_id;
}

async function update(id, params) {
    const user = await getUser(id);

    // validate
    const telephoneChanged = params.telephone && user.telephone !== params.telephone;
    if (telephoneChanged && await db.User.findOne({ where: { telephone: params.telephone } })) {
        throw 'Telephone number "' + params.telephone + '" is already taken';
    }

    // hash password if it was entered
    if (params.password) {
        params.password = await bcrypt.hash(params.password, 10);
    }
    // copy params to user and save
    Object.assign(user, params);
    await user.save();

    return omitHash(user.get());
}

async function _delete(id) {
    const user = await getUser(id);
    await user.destroy();
}

// helper functions

async function getUser(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw 'User not found';
    return user;
}

function omitHash(user) {
    const { password, ...userWithoutHash } = user;
    return userWithoutHash;
}
