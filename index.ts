import express from 'express';
import cors from 'cors';
import 'express-async-errors';

const app = express();
//cors
app.use(express.json());
//rateLimiter

//routers
//handleError
app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on http://localhost:3001');
});