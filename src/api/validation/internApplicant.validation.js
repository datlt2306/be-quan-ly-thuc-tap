const Joi = require('joi');

const sharedSchema = {
	phoneNumber: Joi.string().required(),
	address: Joi.string().required(),
	dream: Joi.string().required(),
	majorCode: Joi.string().required(),
	email: Joi.string().email().required(),
	statusCheck: Joi.number(),
	support: Joi.number().optional(),
	CV: Joi.alternatives().try(Joi.string().valid('NO-CV'), Joi.string().uri()).required(),
};

export const requestSupportSchema = Joi.object({
	...sharedSchema,
	business: Joi.string().required(),
});

export const selfFindSchema = Joi.object({
	...sharedSchema,
	position: Joi.string().required(),
	taxCode: Joi.string().required(),
	nameCompany: Joi.string().required(),
	addressCompany: Joi.string().required(),
	phoneNumberCompany: Joi.string().required(),
	emailEnterprise: Joi.string().email().required(),
});
