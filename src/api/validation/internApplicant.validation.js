const Joi = require('joi');

const sharedSchema = {
	phoneNumber: Joi.string().required(),
	address: Joi.string().required(),
	dream: Joi.string().required(),
	statusCheck: Joi.number(),
	support: Joi.number().optional()
};

const requestSupportSchema = Joi.object({
	...sharedSchema,
	business: Joi.string().required(),
	CV: Joi.string().required()
});

export const requestSupportValidate = (data) => requestSupportSchema.validate(data);

const selfFindSchema = Joi.object({
	...sharedSchema,
	position: Joi.string().required(),
	taxCode: Joi.string().required(),
	nameCompany: Joi.string().required(),
	employer: Joi.string().required(),
	addressCompany: Joi.string().required(),
	phoneNumberCompany: Joi.string().required(),
	emailEnterprise: Joi.string().email().required()
});

export const selfFindValidate = (data) => selfFindSchema.validate(data);
