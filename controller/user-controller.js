const jwt = require('jsonwebtoken');
const { Sequelize } = require('sequelize');
const db = require('../db');
const Op = Sequelize.Op;
const bcrypt = require('bcryptjs');
require('dotenv').config();

const secret = process.env.SECRET;

/**
 * Authenticates a user based on telephone number and password.
 * @param {Object} credentials - The user's telephone number and password.
 * @returns {Promise} A promise that resolves to an object containing the user's information and a JWT token.
 * @throws {string} Throws an error if the telephone number or password is incorrect or the user account is not active.
 */
const authenticate = async ({ telephone, password }) => {
    const foundUser = await db.User.scope('withPassword').findOne({ where: { telephone: telephone } });

    if (!foundUser || !(await bcrypt.compare(password, foundUser.password)))
        throw 'Telephone number or password is incorrect';
    if (foundUser?.status.toLowerCase() !== 'active')
        throw 'User account is not active';

    // authentication successful
    const token = jwt.sign({ sub: foundUser.user_id, username: foundUser.username }, secret, { expiresIn: '7d' });
    return { ...omitHash(foundUser.get()), token };
};

/**
 * Retrieves all users.
 * @returns {Promise} A promise that resolves to an array of user objects.
 */
const getAll = async () => {
    return await db.User.findAll();
};

/**
 * Retrieves all orders filtered by restaurant id.
 * @returns {Promise} A promise that resolves to an array of order objects.
 */
const getAllByRestaurantId = async () => {
    return await db.User.findAll({ where: { restaurant_id: id } });
}

/**
 * Retrieves a user by their ID.
 * @param {number} id - The ID of the user.
 * @returns {Promise} A promise that resolves to the user object.
 * @throws {string} Throws an error if the user is not found.
 */
const getById = async (id) => {
    return await getUser(id);
};

/**
 * Creates a new user.
 * @param {Object} params - The parameters for creating a new user.
 * @returns {Promise} A promise that resolves when the user is created.
 * @throws {string} Throws an error if the telephone number is already taken.
 */
const createUser = async (params) => {
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
};

/**
 * Updates an existing user.
 * @param {number} id - The ID of the user to update.
 * @param {Object} params - The updated parameters for the user.
 * @returns {Promise} A promise that resolves when the user is updated.
 * @throws {string} Throws an error if the telephone number is already taken.
 */
const update = async (id, params) => {
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
};

/**
 * Deletes a user.
 * @param {number} id - The ID of the user to delete.
 * @returns {Promise} A promise that resolves when the user is deleted.
 */
const _delete = async (id) => {
    const user = await getUser(id);
    await user.destroy();
};

/**
 * Retrieves a user by their ID.
 * @param {number} id - The ID of the user.
 * @returns {Promise} A promise that resolves to the user object.
 * @throws {string} Throws an error if the user is not found.
 */
const getUser = async (id) => {
    const user = await db.User.findByPk(id);
    if (!user) throw 'User not found';
    return user;
};

/**
 * Omit the password field from the user object.
 * @param {Object} user - The user object.
 * @returns {Object} The user object without the password field.
 */
const omitHash = (user) => {
    const { password, ...userWithoutHash } = user;
    return userWithoutHash;
}

module.exports = {
    getAllByRestaurantId,
    authenticate, // authenticate user
    getAll, // retrieve all users
    getById, // retrieve a user by id
    createUser, // create new user
    update, // update a user record
    delete: _delete, // delete a user
};