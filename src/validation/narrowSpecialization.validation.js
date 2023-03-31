import Joi from 'joi';

export const validateNarrowSpecializationReqBody = (data) => {
	const schema = Joi.object({
		name: Joi.string().min(3).max(150).required(),
		major: Joi.string().required(),
	});

	return schema.validate(data);
};

export const validateNarrowSpecializationUpdate = (data) => {
	const schema = Joi.object({
		name: Joi.string().min(3).max(150).required().optional(),
		major: Joi.string().required().optional(),
	});

	return schema.validate(data);
};
