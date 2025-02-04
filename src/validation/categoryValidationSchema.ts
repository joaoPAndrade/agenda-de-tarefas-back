import Joi, { number } from 'joi';

const categorySchema_ = Joi.object({
    id: Joi.number().required().messages({
        'number.base': 'Id should be a number',
        'any.required': 'Id is required',
        'number.empty': 'id cannot be an empty field'
    }),
    name: Joi.string().required().messages({
        'string.base': 'Name should be a type of text',
        'string.empty': 'Name cannot be an empty field',
        'any.required': 'Name is a required field'
    }),
    ownerEmail: Joi.string().email().required().messages({
        'string.base': 'Email should be a type of text',
        'string.email': 'Email must be a valid email',
        'string.empty': 'Email cannot be an empty field',
        'any.required': 'Email is a required field'
    }),
})


const categorySchema = Joi.object({
    name: Joi.string().required().messages({
        'string.base': 'Name should be a type of text',
        'string.empty': 'Name cannot be an empty field',
        'any.required': 'Name is a required field'
    }),
    ownerEmail: Joi.string().email().required().messages({
        'string.base': 'Email should be a type of text',
        'string.email': 'Email must be a valid email',
        'string.empty': 'Email cannot be an empty field',
        'any.required': 'Email is a required field'
    }),
})

export { categorySchema, categorySchema_ }