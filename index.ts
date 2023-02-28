import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import rateLImit, { rateLimit } from 'express-rate-limit';
import { config } from './config/config';

const app = express();

app.use(cors({
    origin: config.crosOrigin,
}))
app.use(express.json());

app.use(rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
}));

//routers
//handleError
app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on http://localhost:3001');
});