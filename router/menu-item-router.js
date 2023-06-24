const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { authorize, authorizeRestaurantOwner } = require('../middleware/authorize')
const validateRequest = require('../middleware/validate-request');
const menu_itemController = require('../controller/menu-item-controller');


/**
 * Middleware function to validate the request body for the create menu_item endpoint.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const menu_itemSchema = (req, res, next) => {
    const schema = Joi.object({
        menu_item_name: Joi.string().required(),
        status: Joi.string().allow(''),
        description: Joi.string().allow(''),
        image_url: Joi.string().allow(''),
        restaurant_id: Joi.number(),
        cost: Joi.number(),
    });
    validateRequest(req, next, schema);
};

/**
 * Retrieves a menu_item by their ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const createMenu_item = (req, res, next) => {
    menu_itemController.create(req.body)
        .then(() => res.json({ message: 'Menu_item created successfully' }))
        .catch(next);
}

/**
 * Retrieves a menu_item by their ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const getMenu_itemById = (req, res, next) => {
    menu_itemController.getById(req.params.id)
        .then(menu_item => res.json(menu_item))
        .catch(next);
};

/**
 * Retrieves all menu_items
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const getAllMenu_item = (req, res, next) => {
    menu_itemController.getAll()
        .then(menu_items => res.json(menu_items))
        .catch(next);
}

/**
 * update a menu_item or filter by restaurant id.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const updateMenu_item = (req, res, next) => {
    if (req.query.restaurant) {
        return menu_itemController.getAllByRestaurantId(req.query.restaurant)
            .then(menu_items => res.json(menu_items))
            .catch(next);
    }
    menu_itemController.update(req.params.id, req.body)
        .then(menu_items => res.json(menu_items))
        .catch(next);
}

/**
 * Delete a menu_item.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const deleteMenu_item = (req, res, next) => {
    menu_itemController.delete(req.params.id)
        .then(() => res.json({ message: 'Menu_item deleted successfully' }))
        .catch(next)
}

// Routes
router.get('/', getAllMenu_item);
router.post('/', menu_itemSchema, createMenu_item);
router.get('/:id', getMenu_itemById);
router.put('/:id', menu_itemSchema, authorizeRestaurantOwner(), updateMenu_item);
router.delete('/:id', authorize(), authorizeRestaurantOwner(), deleteMenu_item);

module.exports = router;

