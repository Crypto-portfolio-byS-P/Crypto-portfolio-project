const session = require('express-session');

const MongoStore = require('connect-mongo');

const mongoose = require('mongoose');

module.exports = (app) => {
    app.use(
        session({
            secret: process.env.SECRET,
            resave: true,
            saveUninitialized: false,
            cookie: {
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24,
            },
            // store: MongoStore.create({
            //     mongoUrl: process.env.MONGODB_URI || 'mongodb://127.0.0.1/',
            // }),
        }),
    );

    app.set('trust proxy', 1);
    app.use((req, res, next) => {
        res.locals.session = req.session;
        next();
    });
};
