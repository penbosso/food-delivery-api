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
