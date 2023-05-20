import compression from 'compression';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import swaggerUI from 'swagger-ui-express';
import rootRouter from './api/routes';
import swaggerOptions from './config/swagger.config';
import connectMongo from './database/mongo.db';

const app = express();

// Route
app.use('/api', rootRouter);

// middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(express.json({ limit: '50mb' }));
app.use(
	cors({
		origin: [process.env.FE_DEV_DOMAIN],
		methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
	})
);
app.use(compression({ level: 6, threshold: 1024 })); // compress data if payload is too large
app.use((_req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
	next();
});
// swagger
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerOptions));

// Run server
const PORT = process.env.PORT || 9998;
app.listen(PORT, () => console.log('[Success] Server is listening on port: ', PORT));

app.get('/', (req, res) =>
	res.json({
		message: 'Connected to server !',
		status: 200,
	})
);

// Connect database
connectMongo();

export default app;
