const app = require('express').Router();
const authRepo = require('../repository/auth.repository');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const VerifyToken = require('./VerifyToken');

app.post('/login', (req, res) => {
    const user = {
        username: req.body.username,
        password: req.body.password,
    };

    authRepo.login(user, (state) => {
        if (!state) {
            return res.status(400).json({
                status: 400,
                success: false
            })
        }
        let token = jwt.sign({user}, config.server_secret, {});

         return res.status(200).json({
            status: 200,
            success: true,
            token: token
        })
    });
});

app.post('/logon', VerifyToken, function(req, res, next){
    let token = req.body.jwt;

    if (!token) return res.status(200).send({ success: false, message: 'No token provided.' });
    authRepo.getUserData(req.data.user.username, (state, user) => {
        if (state) {
            res.status(200).send({ user: user, success: true});
        } else {
            res.status(200).send({user: null, success: false});
        }
    });

});

app.post('/register', (req, res) => {
    const user = {
        username: req.body.username,
        email: req.body.email,
        firstname: req.body.firstname,
        birthday: req.body.birthday,
        lastname: req.body.lastname,
        password: req.body.password,

    };
    authRepo.register(user, (state) => {
        if (state === true) {
            res.status(200).json({
                message: 'Account created',
                success: true
            });
        } else {
            res.status(200).json({
                message: 'Account couldnt be created',
                success: false
            });
        }
    });
});

module.exports = app;