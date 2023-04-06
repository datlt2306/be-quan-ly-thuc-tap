import Joi from 'joi';

export const validateNarrowSpecializationReqBody = (data) => {
	const schema = Joi.object({
		name: Joi.string().min(3).max(150).required(),
		id_majors: Joi.string().required(),
	});

	return schema.validate(data);
};

export const validateNarrowSpecializationUpdate = (data) => {
	const schema = Joi.object({
		name: Joi.string().min(3).max(150).required().optional(),
		id_majors: Joi.string().required().optional(),
	});

	return schema.validate(data);
};
