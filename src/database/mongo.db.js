import mongoose from 'mongoose';
import 'dotenv/config';

const connectMongo = async () => {
	try {
		// database
		mongoose.set('strictQuery', false);
		await mongoose.connect(process.env.DATABASE, { connectTimeoutMS: 5000, maxPoolSize: 100 });
		console.log('\x1b[1;42m Success \x1b[0m', 'Connected to database');
	} catch (error) {
		console.log('\x1b[1;41m Error \x1b[0m', 'Failed to connect to Mongo');
	}
};

export default connectMongo;
