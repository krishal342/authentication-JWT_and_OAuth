import express from 'express';

import config from './config/config.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';

import cron from 'node-cron';

import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { prisma } from './lib/prisma.js';


import errorMiddleware from './middleware/error.middleware.js';
import authMiddleware from './middleware/auth.middleware.js';
import authRouter from './routes/auth.router.js';
import homeRouter from './routes/home.router.js'

const app = express();

//middleware for session
app.use(session({
    secret: 'keyboard_cat',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        httpOnly: true, 
        secure: false,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000
    },
    store: new PrismaSessionStore(
        prisma,
        {
            checkPeriod: 2 * 60 * 1000,
            dbRecordIdIsSessionId: true,
        }
    )
}));
app.use(passport.initialize());
app.use(passport.session());

// middleware
app.set('trust proxy', 1);
app.use(cors({
    origin: config.FRONTEND_URL,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// API route
app.use('/auth', authRouter);
app.use('/home', authMiddleware, homeRouter);
app.use(errorMiddleware);

// cleanup expired otp
cron.schedule("*/5 * * * *", async () => {
  await prisma.otp.deleteMany({
    where: { expiresAt: { lt: new Date() } }
  });
});


// Server Listening
app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
})