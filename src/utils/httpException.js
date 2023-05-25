import { isHttpError } from 'http-errors';
import HttpStatusCode from '../api/constants/httpStatusCode';

export class HttpException {
	message;
	statusCode;

	constructor(error) {
		this.message = error.message;
		this.statusCode = isHttpError(error) ? error.status : HttpStatusCode.INTERNAL_SERVER_ERROR;
	}
}
