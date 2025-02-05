import Joi from 'joi';

const groupSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.base': 'Name should be a type of text',
        'string.empty': 'Name cannot be an empty field',
        'any.required': 'Name is a required field'
    }),
    description: Joi.string().required().messages({
        'string.base': 'Description should be a type of text',
        'string.empty': 'Description cannot be an empty field',
        'any.required': 'Description is a required field'
    }),
    ownerEmail: Joi.string().email().required().messages({
        'string.base': 'Email should be a type of text',
        'string.email': 'Email must be a valid email',
        'string.empty': 'Email cannot be an empty field',
        'any.required': 'Email is a required field'
    }),
});

const partialGroupSchema = Joi.object({
    name: Joi.string().messages({
        'string.base': 'Name should be a type of text',
        'string.empty': 'Name cannot be an empty field',
    }),
    description: Joi.string().messages({
        'string.base': 'Description should be a type of text',
        'string.empty': 'Description cannot be an empty field',
    }),
});

export { groupSchema, partialGroupSchema };