import { isHttpError } from 'http-errors';
import HttpStatusCode from '../api/constants/httpStatusCode';
import { JsonWebTokenError } from 'jsonwebtoken';

export class HttpException {
	message;
	statusCode;

	constructor(error) {
		this.message = error.message;
		this.statusCode = isHttpError(error)
			? error.status
			: error instanceof JsonWebTokenError
			? HttpStatusCode.UNAUTHORIZED
			: HttpStatusCode.INTERNAL_SERVER_ERROR;
	}
}
