import Joi from 'joi';

const userSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.base': 'Name should be a type of text',
        'string.empty': 'Name cannot be an empty field',
        'any.required': 'Name is a required field'
    }),
    senha: Joi.string().required().messages({
        'string.base': 'Password should be a type of text',
        'string.empty': 'Password cannot be an empty field',
        'any.required': 'Password is a required field'
    }),
    email: Joi.string().email().required().messages({
        'string.base': 'Email should be a type of text',
        'string.email': 'Email must be a valid email',
        'string.empty': 'Email cannot be an empty field',
        'any.required': 'Email is a required field'
    }),
});

const partialUserSchema = Joi.object({
    name: Joi.string().messages({
        'string.base': 'Name should be a type of text',
        'string.empty': 'Name cannot be an empty field'
    }),
    senha: Joi.string().messages({
        'string.base': 'Password should be a type of text',
        'any.required': 'Password is a required field'
    }),
    email: Joi.string().email().messages({
        'string.base': 'Email should be a type of text',
        'string.email': 'Email must be a valid email',
        'string.empty': 'Email cannot be an empty field'
    }),
});

export { userSchema, partialUserSchema };