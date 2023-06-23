const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../middleware/validate-request');
const authorize = require('../middleware/authorize')
const userController = require('../controller/userController');

// routes
router.post('/authenticate', authenticateSchema, authenticate);
router.post('/register', addUserSchema, register);
router.get('/', getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);


module.exports = router;

function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        telephone: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
    userController.authenticate(req.body)
        .then(user => res.json(user))
        .catch(next);
}

function addUserSchema(req, res, next) {
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
}

function register(req, res, next) {
    userController.createUser(req.body)
        .then(() => res.json({ message: 'Registration successful' })
        )
        .catch(next);
}


function getAll(req, res, next) {
    userController.getAll()
        .then(users => res.json(users))
        .catch(next);
}


function getById(req, res, next) {
    userController.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        telephone: Joi.string().required(),
        status: Joi.string().allow(''),
        RestaurantRestaurantId: Joi.number().allow(''),
        refresh_token: Joi.string().allow(''),
        password: Joi.string().min(6).allow('')
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    userController.update(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}

function _delete(req, res, next) {
    userController.delete(req.params.id)
        .then(() => res.json({ message: 'User deleted successfully' }))
        .catch(next);
}