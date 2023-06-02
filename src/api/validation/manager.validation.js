import Joi from 'joi';

const updateSchema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().email().required(),
	role: Joi.number().required()
});

const createSchema = Joi.object({
	name: Joi.string().optional(),
	email: Joi.string().email().optional(),
	role: Joi.number().optional()
});

export const validateManagerDataCreate = (data) => createSchema.validate(data);
export const validateManagerDataUpdate = (data) => updateSchema.validate(data);
