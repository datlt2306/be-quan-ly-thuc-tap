import moment from 'moment';
import semester from '../models/semester';

//* Tạo kỳ học mới mỗi năm
export default {
	schedule: '0 0 1 1 *',
	task: () => {
		const year = moment().year();
		const semesters = [
			{ name: `spring ${year}` },
			{ name: `summer ${year}` },
			{ name: `fall ${year}` },
			{ name: `winter ${year}` },
		];

		semesters.forEach((data) => {
			semester.save(data);
		});

		console.log(`[${moment().format('DD/MM/YYYY HH:mm:ss')}] - Generate semester executed`);
	},
};
