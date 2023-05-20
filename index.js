import compression from 'compression';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { readdirSync } from 'fs';
import morgan from 'morgan';
import swaggerUI from 'swagger-ui-express';
import swaggerOptions from './src/config/swagger.config';
import connectMongo from './src/database/mongo.db';

const app = express();

// Route
const ROUTES_DIR = './src/api/routes/';
const appRouteModules = readdirSync(ROUTES_DIR).map((route) => import(ROUTES_DIR + route));
Promise.all(appRouteModules)
	.then((routes) => routes.forEach((route) => app.use('/api', route.default)))
	.catch((error) => console.log(error.message));

// middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(express.json({ limit: '50mb' }));
app.use(cors({
   origin: "*",
   methods:['GET','POST','PUT','PATCH','DELETE']
}));
app.use(compression({ level: 6, threshold: 1 * 1024 })); // compress data if payload is too large

// swagger
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerOptions));
// Run server
const PORT = process.env.PORT || 9998;
app.listen(PORT, () => console.log('[Success] Server is listening on port: ', PORT));

app.get('/', (req, res) => res.json({
   message: 'Connected to server !',
   status: 200
}))

// Connect database
connectMongo();

export default app;
