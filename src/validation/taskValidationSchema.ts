import Joi from 'joi';

const taskSchema = Joi.object({
    title: Joi.string().required().messages({
        'string.base': 'Title should be a type of text',
        'string.empty': 'Title cannot be an empty field',
        'any.required': 'Title is a required field'
    }),
    description: Joi.string().required().messages({
        'string.base': 'Description should be a type of text',
        'string.empty': 'Description cannot be an empty field',
        'any.required': 'Description is a required field'
    }),
    owner: Joi.string().required().messages({
        'string.base': 'Owner should be a type of text',
        'string.empty': 'Owner cannot be an empty field',
        'any.required': 'Owner is a required field'
    }),
    dateTask: Joi.date().required().messages({
        'date.base': 'Task date should be a valid date',
        'any.required': 'Task date is a required field'
    }),
    priority: Joi.string().valid('baixa', 'media', 'alta').required().messages({
        'any.only': 'Priority should be one of "baixa", "media", "alta"',
        'any.required': 'Priority is a required field'
    }),
    status: Joi.string().valid('pendente', 'em andamento', 'concluída').required().messages({
        'any.only': 'Status should be one of "pendente", "em andamento", "concluída"',
        'any.required': 'Status is a required field'
    }),
    isRecurrent: Joi.boolean().optional().messages({
        'boolean.base': 'Recurring should be a type of boolean'
    }),
    dateCreation: Joi.date().optional().messages({
        'date.base': 'Completion date should be a valid date'
    })
});

const partialTaskSchema = Joi.object({
    title: Joi.string().messages({
        'string.base': 'Title should be a type of text',
        'string.empty': 'Title cannot be an empty field'
    }),
    description: Joi.string().messages({
        'string.base': 'Description should be a type of text',
        'string.empty': 'Description cannot be an empty field'
    }),
    owner: Joi.string().messages({
        'string.base': 'Owner should be a type of text',
        'string.empty': 'Owner cannot be an empty field'
    }),
    dateTask: Joi.date().messages({
        'date.base': 'Task date should be a valid date'
    }),
    priority: Joi.string().valid('baixa', 'media', 'alta').messages({
        'any.only': 'Priority should be one of "baixa", "media", "alta"'
    }),
    status: Joi.string().valid('pendente', 'em andamento', 'concluída').messages({
        'any.only': 'Status should be one of "pendente", "em andamento", "concluída"'
    }),
    isRecurrent: Joi.boolean().optional().messages({
        'boolean.base': 'Recurring should be a type of boolean'
    }),
    dateConclusion: Joi.date().messages({
        'date.base': 'Completion date should be a valid date'
    })
});

export { taskSchema, partialTaskSchema };
