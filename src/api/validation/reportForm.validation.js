import Joi from 'joi';

export const formSchema = Joi.object({
	nameCompany: Joi.string().required(),
	internshipTime: Joi.string().required(),
	form: Joi.string().uri().required(),
	statusCheck: Joi.number().required(),
});

export const reportSchema = Joi.object({
	attitudePoint: Joi.number().required(),
	endInternShipTime: Joi.date().iso().required(),
	nameCompany: Joi.string().required(),
	resultScore: Joi.number().required(),
	report: Joi.string().uri().required(),
	statusCheck: Joi.number().valid(7).required(),
	signTheContract: Joi.number().required(),
});
