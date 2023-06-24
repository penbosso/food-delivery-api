const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { authorize, authorizeRestaurantOwner } = require('../middleware/authorize')
const validateRequest = require('../middleware/validate-request');
const restaurantController = require('../controller/restaurant-controller');


/**
 * Middleware function to validate the request body for the create restaurant endpoint.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const restaurantSchema = (req, res, next) => {
    const schema = Joi.object({
        restaurant_name: Joi.string().required(),
        status: Joi.string().allow(''),
        image_url: Joi.string().allow(''),
        location: Joi.string().allow(''),
    });
    validateRequest(req, next, schema);
};

/**
 * Retrieves a restaurant by their ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const createRestaurant = (req, res, next) => {
    restaurantController.create(req.body)
        .then((restaurant) => res.status(201).json(restaurant))
        .catch(next);
}

/**
 * Retrieves a restaurant by their ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const getRestaurantById = (req, res, next) => {
    restaurantController.getById(req.params.id)
        .then(restaurant => res.json(restaurant))
        .catch(next);
};

const getAllRestaurant = (req, res, next) => {
    console.log('*********', req)
    restaurantController.getAll()
        .then(restaurants => res.json(restaurants))
        .catch(next);
}

const updateRestaurant = (req, res, next) => {
    restaurantController.update(req.params.id, req.body)
        .then(restaurant => res.json(restaurant))
        .catch(next);
}

const deleteRestaurant = (req, res, next) => {
    restaurantController.delete(req.params.id)
        .then(() => res.status(204).json({ message: 'Restaurant deleted successfully' }))
        .catch(next)
}

// Routes
router.get('/', getAllRestaurant);
router.post('/', restaurantSchema, createRestaurant);
router.get('/:id', getRestaurantById);
router.put('/:id', restaurantSchema, authorize(), authorizeRestaurantOwner(), updateRestaurant);
router.delete('/:id', authorize(), authorizeRestaurantOwner(), deleteRestaurant);

module.exports = router;

