import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import session from "express-session";
import config from './configs/config';
import MongoStore from "connect-mongo";
import mongoose from 'mongoose';
import bluebird from 'bluebird';
import helmet from 'helmet';
import CSRF from './configs/tokenize';

/**
 *  Routes
 */
import authRouter from './routes/auth';
import userRouter from './routes/users';
import csrfRouter from './routes/token';

var app = express();

// Connect to MongoDB
const mongoUrl = config.mongo_connection;

// Mangodb connection
mongoose.set('strictQuery', false);
mongoose.Promise = bluebird;

mongoose.connect(mongoUrl)
.then(
    () => { console.log("DB Connection Successfull!") },
).catch(err => {
    console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
    // process.exit();
});

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Secure the app
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: config.key,
    store: MongoStore.create({
        mongoUrl: mongoUrl
      }),
    cookie: {
    maxAge: 60 * 1000 * 5 // 5 min in milliseconds
    }

}));

// Secure the app

app.use(CSRF());
app.use(helmet());

app.use('/api/v1', csrfRouter); // Auth routes [ Login, Register & Logout]
app.use('/api/v1', authRouter); // Auth routes [ Login, Register & Logout]
app.use('/api/v1', userRouter); // User routes 

export default app;