const { Sequelize } = require('sequelize');
const db = require('../db');
const Op = Sequelize.Op;

/**
 * Retrieves a restaurant by its ID.
 * @param {number} id - The ID of the restaurant.
 * @returns {Promise} A promise that resolves to the restaurant object.
 * @throws {string} Throws an error if the restaurant is not found.
 */
const getById = async (id) => {
    return await getRestaurant(id);
}

/**
 * Retrieves all restaurants.
 * @returns {Promise} A promise that resolves to an array of restaurant objects.
 */
const getAll = async () => {
    return await db.Restaurant.findAll();
}

/**
 * Creates a new restaurant.
 * @param {Object} params - The parameters for creating a new restaurant.
 * @returns {Promise} A promise that resolves when the restaurant is created.
 */
const create = async (params) => {
    await db.Restaurant.create(params)
}

/**
 * Updates an existing restaurant.
 * @param {number} id - The ID of the restaurant to update.
 * @param {Object} params - The updated parameters for the restaurant.
 * @returns {Promise} A promise that resolves when the restaurant is updated.
 */
const update = async (id, params) => {
    const restaurant = await getRestaurant(id);
    Object.assign(restaurant, params);
    await restaurant.save();
    return restaurant;
}

/**
 * Deletes a restaurant.
 * @param {number} id - The ID of the restaurant to delete.
 * @returns {Promise} A promise that resolves when the restaurant is deleted.
 */
const _delete = async (id) => {
    const restaurant = await getRestaurant(id);
    await restaurant.destroy();
}

/**
 * Retrieves a restaurant by its ID.
 * @param {number} id - The ID of the restaurant.
 * @returns {Promise} A promise that resolves to the restaurant object.
 * @throws {string} Throws an error if the restaurant is not found.
 */
const getRestaurant = async (id) => {
    const restaurant = await db.Restaurant.findByPk(id);
    if (!restaurant) throw 'Restaurant not found';
    return restaurant;
}

module.exports = {
    getAll,     // Function to retrieve all restaurants
    getById,    // Function to retrieve a restaurant by ID
    create,     // Function to create a new restaurant
    update,     // Function to update an existing restaurant
    delete: _delete,    // Function to delete a restaurant
};
