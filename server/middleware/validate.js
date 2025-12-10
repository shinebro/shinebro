const Joi = require('joi');

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        next();
    };
};

const schemas = {
    signup: Joi.object({
        name: Joi.string().min(2).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        code: Joi.string().length(6).required()
    }),
    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),
    contact: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        message: Joi.string().required()
    }),
    order: Joi.object({
        total: Joi.number().required(),
        paymentMethod: Joi.string().required(),
        customer: Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().email().required(),
            phone: Joi.string().required(),
            address: Joi.string().required(),
            city: Joi.string().required(),
            pincode: Joi.string().required()
        }).required(),
        items: Joi.array().items(Joi.object({
            id: Joi.number().required(),
            name: Joi.string().required(),
            price: Joi.number().required(),
            quantity: Joi.number().required(),
            image: Joi.string().optional(),
            category: Joi.string().optional(),
            rating: Joi.number().optional(),
            reviews: Joi.number().optional(),
            isNew: Joi.boolean().optional(),
            selectedSize: Joi.string().allow('').optional()
        }).unknown(true)).required(),
        date: Joi.string().optional()
    }),
    forgotPassword: Joi.object({
        email: Joi.string().email().required()
    }),
    resetPassword: Joi.object({
        email: Joi.string().email().required(),
        code: Joi.string().length(6).required(),
        newPassword: Joi.string().min(6).required()
    }),
    review: Joi.object({
        productId: Joi.number().required(),
        rating: Joi.number().min(1).max(5).required(),
        text: Joi.string().required(),
        name: Joi.string().required()
    })
};

module.exports = { validate, schemas };
