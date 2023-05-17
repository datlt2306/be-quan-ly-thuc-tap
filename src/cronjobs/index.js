import cron from 'node-cron';
import time_window_check from './time_window_check';

const jobs = [time_window_check];

//Cron jobs handler
class Scheduler {
	constructor(unprocessedJobs) {
		this.unprocessedJobs = unprocessedJobs;
		this.cronJobs = [];
	}

	generateCronJob(schedule, task, config = {}) {
		const job = cron.schedule(schedule, task, {
			scheduled: true,
			timezone: 'Asia/Ho_Chi_Minh',
			...config,
		});
		this.cronJobs.push(job);
		return job;
	}

	execute() {
		this.cronJobs.forEach((job, index) => {
			job.start();
			console.log(`${index + 1} out of ${this.cronJobs.length} Cron jobs started`);
		});
	}
	stop() {
		this.cronJobs.forEach((job) => {
			job.stop();
			console.log('Cron jobs stopped');
		});
	}

	//Khởi tạo và chạy cronjobs
	init() {
		this.unprocessedJobs.forEach((job) => {
			const { schedule, task, config } = job;
			this.generateCronJob(schedule, task, config);
		});
		this.execute();
	}
}

exports.jobScheduler = new Scheduler(jobs);
