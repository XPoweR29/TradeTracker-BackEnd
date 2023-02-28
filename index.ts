import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { config } from './config/config';
import { handleError, ValidationError } from './utils/errors';

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
app.use(handleError);

app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on http://localhost:3001');
});