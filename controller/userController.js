const User = require('../model/user');
const { Sequelize } = require('sequelize');
const db = require('../db');
const Op = Sequelize.Op;
const bcrypt = require('bcryptjs');

const getAllUsers = async (req, res) => {
    const users = await db.User.findAll();
    if (!users) return res.status(204).json({ 'message': 'No users found' });
    res.json(users);
}

const deleteUser = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ "message": 'User ID required' });
    const user =  await _getUser(id);
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.body.id} not found` });
    }
    const result = await user.destroy();
    res.json(result);
}

const getUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'User ID required' });
    const user = await _getUser(id);
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.params.id} not found` });
    }
    res.json(user);
}

const createUser = async (req, res) => {
    const { telephone, password, first_name, last_name, role, status } = req.body;

    // check for duplicate usernames in the db
    const duplicate = await db.User.findOne({ where: {telephone: telephone} });
    if (duplicate) return res.sendStatus(409);

    try {
        const hashedPwd = await bcrypt.hash(password, 10);
        const result = await db.User.create({
            telephone, first_name, last_name, role, status,
            "password": hashedPwd
        });

        console.log(result);

        res.status(201).json({ 'success': `New user ${first_name} ${last_name} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

// helper functions

function omitHash(user) {
    const { password, ...userWithoutHash } = user;
    return userWithoutHash;
}

async function _getUser(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw 'User not found';
    return user;
}
module.exports = {
    getAllUsers,
    deleteUser,
    getUser, 
    createUser
}