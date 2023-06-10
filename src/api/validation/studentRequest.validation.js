import Joi from 'joi';

const schema = Joi.object({
	userId: Joi.string()
		.required()
		.pattern(/^[0-9a-fA-F]{24}$/),
	description: Joi.string().required(),
	type: Joi.string().required(),
	status: Joi.number().integer().default(0)
});

export const studentRequestValidation = (data) => schema.validate(data);
