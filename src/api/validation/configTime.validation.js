import Joi from 'joi';

export const TimeWindowSchema = Joi.object({
	typeNumber: Joi.number().required().valid(0, 1, 2, 3, 4),
	typeName: Joi.string().required(),
	startTime: Joi.date().required(),
	endTime: Joi.date().greater(Joi.ref('startTime')).required(),
});

//! DEPRECATED
export const validateConfigTimeCreateData = (data) => {
	try {
		const schema = Joi.object({
			typeNumber: Joi.number().default(1),
			typeName: Joi.string().required(),
			startTime: Joi.date().timestamp().required(),
			endTime: Joi.date().timestamp().greater(Joi.ref('startTime')).required(),
		});

		return schema.validate(data);
	} catch (error) {
		throw error;
	}
};

export const validateConfigTimeUpdateData = (data) => {
	try {
		const schema = Joi.object({
			typeName: Joi.string().required().optional(),
			startTime: Joi.number().required().optional(),
			endTime: Joi.number().required().optional(),
		});

		return schema.validate(data);
	} catch (error) {
		throw error;
	}
};
