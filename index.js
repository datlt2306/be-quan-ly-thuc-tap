import compression from 'compression';
import cors from 'cors';
import express from 'express';
import { readdir, readdirSync } from 'fs';
import morgan from 'morgan';
import swaggerOptions from './src/config/swagger.config';
import path from 'path';
import swaggerUI from 'swagger-ui-express';
import 'dotenv/config';
import connectMongo from './src/database/mongo.db';
const app = express();


// middleware
app.use(morgan('tiny'));
app.use(express.json({ limit: '50mb' }));
app.use(cors());
app.use(compression({ level: 6, threshold: 1 * 1024 })); // compress data if payload is too large
// Route
const routedDir = path.resolve(path.join(__dirname, "./src/api/routes")) 
readdir(routedDir, (err, files) => {
	if (err) {
		console.error('Error reading directory:', err);
		return;
	}

	// Import each file
	files.forEach((file) => {
		// Check if the file is a JavaScript file
		if (file.endsWith('.js')) {
			// Resolve the full file path
			const filePath = path.join(routedDir, file);

			// Import the file
			require(filePath);

		}
	});
});
app.use(express.json());

// swagger
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerOptions));
app.use('*', (req, res) => {
	res.redirect('/api-docs');
});

const port = process.env.PORT || 9998;
app.listen(port, () => console.log('server is listening port: ', port));
connectMongo();
