const Joi = require("joi");
const { NotAllowedError } = require("../../core");

const signUpBody = Joi.object({
    fullName: Joi.string().min(3).required(),
    email: Joi.string().email().min(3).max(50).trim().lowercase().required(),
    contactNo: Joi.string()
        .pattern(/^[6-9]\d{9}$/)
        .trim()
        .required(),
    password: Joi.string().min(6).max(50).trim().required(),
    confirmPass: Joi.string().valid(Joi.ref('password')).required()
        .messages({ 'any.only': 'Passwords do not match' }),
});

const loginBody = Joi.object({
    email: Joi.string().email().min(3).max(50).trim().lowercase().required(),
    password: Joi.string().trim().required(),
});

const booksBody = Joi.object({
    bookName: Joi.string().min(3).required(),
    author: Joi.string().min(3).required(),
    description: Joi.string().min(3).required(),
    imagePath: Joi.string().trim().required(),
});

const UpdateBooksBody = Joi.object({
    bookName: Joi.string().min(3).required(),
    author: Joi.string().min(3).required(),
    description: Joi.string().min(3).required(),
    imagePath: Joi.string().trim().required(),
});

const idParamSchema = Joi.object({
    id: Joi.number().integer().positive().required()
});

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);

        if (error) {
            const errorMessage = error.details.map((detail) => detail.message).join(", ");
            throw new NotAllowedError(errorMessage);
        }

        next();
    };
};

const validateIdParam = (req, res, next) => {
    const { error } = idParamSchema.validate(req.params);

    if (error) {
        const errorMessage = error.details.map((detail) => detail.message).join(", ");
        throw new NotAllowedError(errorMessage);
    }

    next();
};

module.exports = {
    signUpBody,
    loginBody,
    booksBody,
    UpdateBooksBody,
    idParamSchema,
    validate,
    validateIdParam
};
