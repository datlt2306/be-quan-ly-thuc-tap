import compression from 'compression';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import swaggerUI from 'swagger-ui-express';
import rootRouter from './api/routes';
import swaggerOptions from './config/swagger.config';
import connectMongo from './database/mongo.db';
import { jobSchedule } from './cronjobs';
import { readdirSync } from 'fs';
import path from 'path';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));
app.use(express.json({ limit: '50mb' }));
app.use(compression({ level: 6, threshold: 1024 })); // compress data if payload is too large

// Swagger
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerOptions));

// Routes
// app.use('/api', rootRouter);
const ROUTES_DIR = path.resolve(path.join(__dirname, './api/routes'))
readdirSync(ROUTES_DIR).forEach((file) =>
	import(path.resolve(path.join(ROUTES_DIR,file)))
		.then((module) => app.use('/api', module.default))
		.catch((error) => console.log(error.message))
);

// Run server
const PORT = process.env.PORT || 9998;
app.listen(PORT, () => {
	console.log('[SUCCESS] Server is listening on port: ', PORT);
	jobSchedule.init();
});


// Default route
app.get('/', (req, res) =>
	res.json({
		message: 'Connected to server !',
		status: 200,
	})
);

// Connect database
connectMongo();

export default app;
