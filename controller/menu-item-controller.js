const { Sequelize } = require('sequelize');
const db = require('../db');
const Op = Sequelize.Op;

/**
 * Retrieves a menu_item by its ID.
 * @param {number} id - The ID of the menu_item.
 * @returns {Promise} A promise that resolves to the menu_item object.
 * @throws {string} Throws an error if the menu_item is not found.
 */
const getById = async (id) => {
    return await getMenu_item(id);
}

/**
 * Retrieves all menu_items filtered by restaurant id
 * @returns {Promise} A promise that resolves to an array of menu_item objects.
 */
const getAllByRestaurantId = async (id) => {
    return await db.Menu_item.findAll({where:{restaurant_id: id}});
}

/**
 * Retrieves all menu_items.
 * @returns {Promise} A promise that resolves to an array of menu_item objects.
 */
const getAll = async () => {
    return await db.Menu_item.findAll();
}
/**
 * Creates a new menu_item.
 * @param {Object} params - The parameters for creating a new menu_item.
 * @returns {Promise} A promise that resolves when the menu_item is created.
 */
const create = async (params) => {
    return await db.Menu_item.create(params)
}

/**
 * Updates an existing menu_item.
 * @param {number} id - The ID of the menu_item to update.
 * @param {Object} params - The updated parameters for the menu_item.
 * @returns {Promise} A promise that resolves when the menu_item is updated.
 */
const update = async (id, params) => {
    const menu_item = await getMenu_item(id);
    Object.assign(menu_item, params);
    await menu_item.save();
    return menu_item;
}

/**
 * Deletes a menu_item.
 * @param {number} id - The ID of the menu_item to delete.
 * @returns {Promise} A promise that resolves when the menu_item is deleted.
 */
const _delete = async (id) => {
    const menu_item = await getMenu_item(id);
    await menu_item.destroy();
}

/**
 * Retrieves a menu_item by its ID.
 * @param {number} id - The ID of the menu_item.
 * @returns {Promise} A promise that resolves to the menu_item object.
 * @throws {string} Throws an error if the menu_item is not found.
 */
const getMenu_item = async (id) => {
    const menu_item = await db.Menu_item.findByPk(id);
    if (!menu_item) throw 'Menu_item not found';
    return menu_item;
}

module.exports = {
    getAllByRestaurantId,
    getAll,     // Function to retrieve all menu_items
    getById,    // Function to retrieve a menu_item by ID
    create,     // Function to create a new menu_item
    update,     // Function to update an existing menu_item
    delete: _delete,    // Function to delete a menu_item
};
