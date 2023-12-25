import configTime from '../api/models/timeWindow.model';
import moment from 'moment';

//* Xoá configtime đã hết hạn, chạy mỗi 12 tiếng một ngày
export default {
	schedule: '0 */12 * * *',
	task: async () => {
		try {
			await configTime.removeExpired();

			console.log(`[${moment().format('DD/MM/YYYY HH:mm:ss')}] - Time window check executed`);
		} catch (error) {
			console.error(error);
		}
	}
};
