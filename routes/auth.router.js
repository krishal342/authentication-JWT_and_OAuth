import express from 'express';
import passport from 'passport';


import { signup, login, logout } from '../controllers/auth.controller.js';

import '../auth/google.js';
import '../auth/github.js';

import config from '../config/config.js';

const authRouter = express.Router();



// API route
authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.get('/logout', logout);

// for google authentication
authRouter.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);
authRouter.get('/google/callback',
    passport.authenticate('google', { failureRedirect: `${config.FRONTEND_URL}/auth/login` }),
    function (req, res) {
        res.redirect(`${config.FRONTEND_URL}/`);
    }
);


// for github authentication
authRouter.get('/github',
    passport.authenticate('github', { scope: ['user:email'] }));

authRouter.get('/github/callback',
    passport.authenticate('github', { failureRedirect: `${config.FRONTEND_URL}/auth/login` }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect(`${config.FRONTEND_URL}/`);
    });

export default authRouter;