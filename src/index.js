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

// middleware
app.use(cors());
app.use(morgan('tiny'));
app.use(compression({ level: 6, threshold: 1024 })); // compress data if payload is too large
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// Swagger
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerOptions));

// Routes
app.use('/api', rootRouter);

// Run server
const PORT = process.env.PORT || 9998;
app.listen(PORT, () => {
	console.log('[SUCCESS] Server is listening on port: ', PORT);
});

app.get('/', (req, res) =>
	res.json({
		message: 'Connected to server !',
		status: 200
	})
);

// Connect database
connectMongo();

export default app;
