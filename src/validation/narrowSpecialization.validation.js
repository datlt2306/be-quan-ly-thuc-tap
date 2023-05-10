import Joi from 'joi';

export const validateNarrowSpecializationReqBody = (data) => {
	const schema = Joi.object({
		name: Joi.string().min(3).max(150).required(),
		major_id: Joi.string().required(),
	});

	return schema.validate(data);
};

export const validateNarrowSpecializationUpdate = (data) => {
	const schema = Joi.object({
		name: Joi.string().min(3).max(150).required().optional(),
		major_id: Joi.string().required().optional(),
	});

	return schema.validate(data);
};
