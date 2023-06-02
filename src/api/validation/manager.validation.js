import Joi from 'joi';

const createSchema = Joi.object({
	campus_id: Joi.string().optional(),
	name: Joi.string().required(),
	email: Joi.string().email().required(),
	role: Joi.number().required()
});

const updateSchema = Joi.object({
	campus_id: Joi.string().optional(),
	name: Joi.string().optional(),
	email: Joi.string().email().optional(),
	role: Joi.number().optional()
});

export const validateManagerDataCreate = (data) => createSchema.validate(data);
export const validateManagerDataUpdate = (data) => updateSchema.validate(data);
