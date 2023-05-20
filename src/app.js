import compression from 'compression';
import cors from 'cors';
import express from 'express';
import { readdirSync } from 'fs';
import morgan from 'morgan';
import swaggerOptions from './config/swagger.config';
import path from 'path';
import swaggerUI from 'swagger-ui-express';
import 'dotenv/config';
import connectMongo from './database/mongo.db';

const app = express();

// middleware
app.use(morgan('tiny'));
app.use(express.json({ limit: '50mb' }));
app.use(cors());
app.use(compression({ level: 6, threshold: 1 * 1024 })); // compress data if payload is too large
// Route
readdirSync(path.resolve(path.join(__dirname, "./api/routes"))).map((route) => app.use('/api', require(`./api/routes/${route}`)));

app.use(express.json());

// swagger
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerOptions));
app.use('*', (req, res) => {
	res.redirect('/api-docs');
});

const port = process.env.PORT || 9998;
app.listen(port, () => console.log('server is listening port: ', port));
connectMongo()
