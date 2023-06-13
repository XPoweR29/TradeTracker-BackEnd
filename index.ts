import express, { Router } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { config } from './config/config';
import { handleError} from './utils/errors';
import { userRouter } from './routers/user.router';
import { positionsRouter } from './routers/position.router';
import cookieParser from 'cookie-parser';
import { authMiddleware } from './middleware/authMiddleware';
import { authRouter } from './routers/auth.router';
 'cookie-parser';

const app = express();

app.use(cors({
    origin: config.crosOrigin,
}))
app.use(express.json());
app.use(cookieParser());

app.use(rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
}));

const sufixRouter = Router();

app.use('/api', sufixRouter);

sufixRouter.use('/auth', authRouter);
sufixRouter.use('/user', authMiddleware, userRouter);
sufixRouter.use('/positions', authMiddleware, positionsRouter);


app.use(handleError);

app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on http://localhost:3001');
});