import mongoose from 'mongoose';
import 'dotenv/config';
import { jobScheduler } from '../cronjobs';
const connectMongo = async () => {
	try {
		// database
		mongoose.set('strictQuery', false);
		await mongoose.connect(process.env.DATABASE);
		jobScheduler.init();
		console.log('[SUCCESS] Connected to database');
	} catch (error) {
		console.log('[Error]: Failed to connect to Mongo');
	}
};

export default connectMongo;
