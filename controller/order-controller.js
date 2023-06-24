const { Sequelize } = require('sequelize');
const db = require('../db');
const Op = Sequelize.Op;

/**
 * Retrieves an order by its ID.
 * @param {number} id - The ID of the order.
 * @returns {Promise} A promise that resolves to the order object.
 * @throws {string} Throws an error if the order is not found.
 */
const getById = async (id) => {
    return await getOrder(id);
}

/**
 * Retrieves all orders.
 * @returns {Promise} A promise that resolves to an array of order objects.
 */
const getAll = async () => {
    return await db.Order.findAll({ include: [db.User, db.Menu_item] });
}

/**
 * Retrieves all orders filtered by restaurant id.
 * @returns {Promise} A promise that resolves to an array of order objects.
 */
const getAllByRestaurantId = async () => {
    return await db.Order.findAll({ where: { restaurant_id: id }, include: [db.User, db.Menu_item] });
}

/**
 * Creates a new order.
 * @param {Object} params - The parameters for creating a new order.
 * @returns {Promise} A promise that resolves when the order is created.
 */
const create = async (params) => {
    return await db.Order.create(params)
}

/**
 * Updates an existing order.
 * @param {number} id - The ID of the order to update.
 * @param {Object} params - The updated parameters for the order.
 * @returns {Promise} A promise that resolves when the order is updated.
 */
const update = async (id, params) => {
    const order = await getOrder(id);
    Object.assign(order, params);
    await order.save();
    return await getOrder(id);
}

/**
 * Deletes an order.
 * @param {number} id - The ID of the order to delete.
 * @returns {Promise} A promise that resolves when the order is deleted.
 */
const _delete = async (id) => {
    const order = await getOrder(id);
    await order.destroy();
}

/**
 * Retrieves an order by its ID.
 * @param {number} id - The ID of the order.
 * @returns {Promise} A promise that resolves to the order object.
 * @throws {string} Throws an error if the order is not found.
 */
const getOrder = async (id) => {
    const order = await db.Order.findByPk(id, { include: [db.User, db.Menu_item] });
    if (!order) throw 'Order not found';
    return order;
}

module.exports = {
    getAllByRestaurantId,
    getAll,     // Function to retrieve all orders
    getById,    // Function to retrieve an order by ID
    create,     // Function to create a new order
    update,     // Function to update an existing order
    delete: _delete,    // Function to delete an order
};
