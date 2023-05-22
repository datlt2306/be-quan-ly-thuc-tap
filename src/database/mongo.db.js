import mongoose from 'mongoose';
import 'dotenv/config';

const connectMongo = async () => {
	try {
		// database
		mongoose.set('strictQuery', false);
		await mongoose.connect(process.env.DATABASE);
		console.log('[SUCCESS] Connected to database');
	} catch (error) {
		console.log('[Error]: Failed to connect to Mongo');
	}
};

export default connectMongo;
