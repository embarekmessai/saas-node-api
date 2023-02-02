import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import authRouter from './routes/auth';

var app = express();

// app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/api/v1', authRouter); // Auth route [ Login, Register & Logout]

export default app;