const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../middleware/validate-request');
const { authorize, authorizeOwner } = require('../middleware/authorize')
const userController = require('../controller/user-controller');

/**
 * Middleware function to validate the request body for the authentication endpoint.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const authenticateSchema = (req, res, next) => {
    const schema = Joi.object({
        telephone: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
};

/**
 * Authenticates a user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const authenticate = (req, res, next) => {
    userController.authenticate(req.body)
        .then(user => res.json(user))
        .catch(next);
};

/**
 * Middleware function to validate the request body for the register endpoint.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const addUserSchema = (req, res, next) => {
    const schema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        telephone: Joi.string().required(),
        status: Joi.string().allow(''),
        RestaurantRestaurantId: Joi.number().allow(''),
        refresh_token: Joi.string().allow(''),
        password: Joi.string().min(6)
    });
    validateRequest(req, next, schema);
};

/**
 * Registers a new user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const register = (req, res, next) => {
    userController.createUser(req.body)
        .then(() => res.json({ message: 'Registration successful' }))
        .catch(next);
};

/**
 * Retrieves all users.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const getAll = (req, res, next) => {
    userController.getAll()
        .then(users => res.json(users))
        .catch(next);
};

/**
 * Retrieves a user by their ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const getById = (req, res, next) => {
    userController.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
};

/**
 * Middleware function to validate the request body for the update endpoint.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const updateSchema = (req, res, next) => {
    const schema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        telephone: Joi.string().required(),
        status: Joi.string().allow(''),
        restaurant_id: Joi.number().allow(''),
        refresh_token: Joi.string().allow(''),
        password: Joi.string().min(6).allow('')
    });
    validateRequest(req, next, schema);
};
/**
*@param {Object} req - The request object.
*@param {Object} res - The response object.
*@param {Function} next - The next middleware function.
*/
const update = (req, res, next) => {
    userController.update(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
};
/**

Deletes a user.
@param {Object} req - The request object.
@param {Object} res - The response object.
@param {Function} next - The next middleware function.
*/
const _delete = (req, res, next) => {
    userController.delete(req.params.id)
        .then(() => res.json({ message: 'User deleted successfully' }))
        .catch(next);
};

// Routes
router.post('/authenticate', authenticateSchema, authenticate);
router.post('/register', addUserSchema, register);
router.get('/', getAll);
router.get('/:id', authorize(), authorizeOwner(), getById);
router.put('/:id', authorize(), updateSchema, authorizeOwner(), update);
router.delete('/:id', authorize(), authorizeOwner(), _delete);

module.exports = router;