const con = require('../database/connection');
const crypto = require('crypto');

var authRepo = {
    register: function (user, callback) {

        const sql = "INSERT INTO user(username, email, password, salt, firstname, lastname, birthday) VALUES ?";

        const salt = crypto.randomBytes(32).toString('hex');

        let hashedPassword = crypto.createHash('sha256').update(user.password);
        hashedPassword.update(salt);
        hashedPassword = hashedPassword.digest('hex');

        const values = [
            [user.username, user.email, hashedPassword, salt, user.firstname, user.lastname, user.birthday]
        ];
        con.query(sql, [values], function (err, result) {
            if (err == undefined) {
                callback(true);
            } else {
                callback(false);
            }
        });
    },
    login: function (user, callback) {
        const selectStatement = "SELECT * from user where username = ?";
        con.query(selectStatement, user.username, function (err, result) {
            if (!err && result[0] !== undefined) {
                let hashedPassword = crypto.createHash('sha256').update(user.password);
                hashedPassword.update(result[0].salt);
                hashedPassword = hashedPassword.digest('hex');
                if (hashedPassword === result[0].password) {
                    callback(true);
                } else {
                    callback(false);
                }
            } else {
                callback(false);
            }
        })
    },
    getUserData: function (username, callback) {
        const sql = "SELECT user_id, username, email, birthday, firstname, lastname FROM user WHERE username = ?";
        con.query(sql, username, function (err, result) {
            if (!err && result[0] !== undefined && result.length === 1) {
                callback(true, result[0])
            } else {
                callback(false, null)
            }
        });


    },
};

module.exports = authRepo;