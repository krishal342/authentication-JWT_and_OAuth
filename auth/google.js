import { prisma } from '../lib/prisma.js';

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import config from '../config/config.js';

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.GOOGLE_CALLBACK_URL
},
    async function (accessToken, refreshToken, profile, cb) {

        try {
            const user = await prisma.user.findUnique({ where: { email: profile.emails[0].value } });
            if (user) {
                if (!user.googleId) {
                    const updatedUser = await prisma.user.update({
                        where: { email: profile.emails[0].value },
                        data: { googleId: profile.id }
                    });
                    return cb(null, updatedUser);
                }
                return cb(null, user);
            } else {
                const newUser = await prisma.user.create({
                    data: {
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        email: profile.emails[0].value,
                        googleId: profile.id
                    }
                });
                return cb(null, newUser);
            }

        } catch (err) {
            return cb(err, null);
        }
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser( async function (id, done) {
    try {
        const user = await prisma.user.findUnique({ where: { id: id } });
        done(null, user);

    } catch (err) {
        return done(err, null);
    }
});