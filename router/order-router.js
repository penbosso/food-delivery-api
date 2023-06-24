const express = require('express');
const router = express.Router();
const Joi = require('joi');
const authorize = require('../middleware/authorize')
const validateRequest = require('../middleware/validate-request');
const orderController = require('../controller/order-controller');


/**
 * Middleware function to validate the request body for the create order endpoint.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const orderSchema = (req, res, next) => {
    const schema = Joi.object({
        status: Joi.string().allow(''),
        quantity: Joi.number(),
        user_id: Joi.number(),
        menu_item_id: Joi.number(),
    });
    validateRequest(req, next, schema);
};

/**
 * Retrieves an order by their ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const createOrder = (req, res, next) => {
    orderController.create(req.body)
        .then(() => res.json({ message: 'Order created successfully' }))
        .catch(next);
}

/**
 * Retrieves an order by their ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const getOrderById = (req, res, next) => {
    orderController.getById(req.params.id)
        .then(order => res.json(order))
        .catch(next);
};

/**
 * Retrieves all order.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const getAllOrder = (req, res, next) => {
    orderController.getAll()
        .then(orders => res.json(orders))
        .catch(next);
}

/**
 * Update an order.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const updateOrder = (req, res, next) => {
    orderController.update(req.params.id, req.body)
        .then(order => res.json(order))
        .catch(next);
}

/**
 * Delete an order.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const deleteOrder = (req, res, next) => {
    orderController.delete(req.params.id)
        .then(() => res.json({ message: 'Order deleted successfully' }))
        .catch(next)
}

// Routes
router.get('/', getAllOrder);
router.post('/', orderSchema, createOrder);
router.put('/:id', updateOrder);
router.get('/:id', getOrderById);
router.put('/:id', orderSchema, updateOrder);
router.delete('/:id', authorize(), deleteOrder);

module.exports = router;

