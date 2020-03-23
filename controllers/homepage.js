const bcrypt = require('bcryptjs');
const database = require('../config/database');

const { check, validationResult } = require('express-validator');

module.exports = {
    index: async (req, res) => {
        let sql = 'SELECT * FROM threads WHERE forumID = 1';
        const news = await database.query(sql, async (err, rows) => {

            for(let i = 0; i < rows.length; i++) {
                let innerSql = `SELECT * FROM users WHERE userID=${rows[i].threadAuthor}`;
                const author = await database.query(innerSql);
                rows[i].author = author[0].userDisplayName;
                rows[i].authorImg = author[0].userProfileImg;
            }
            res.render('main/homepage', {title: 'CMS Homepage', error: req.flash('error'), articles: rows});
        });
    },

    login: (req, res) => {
        res.render('main/login', {title: 'Login', error: req.flash('error')});
    },

    loginSubmit: (req, res, done) => {

        //Input sanitization
        check('username', 'Please fill in your email').notEmpty();
        check('password', 'Please enter your password').notEmpty();
        const errors = validationResult(req);
        if(errors.isEmpty()) {
            //Retrieve current user information
            session = req.session;
            username = req.body.username;
            password = req.body.password;
            database.query(`SELECT * FROM users WHERE userName='${username}'`, function(err,rows) {
                if(!rows) {
                    res.render('main/login', {title: "Login", error: "Invalid Username or Password."});
                }
                if (!err) {
                    if(rows.length > 0) {
                        //Since a user was found, authenticate them.
                        let user = rows[0];
                        bcrypt.compare(req.body.password, user.userPassword, (err, resul) => {
                            if (err) {
                                console.log(err);
                            }
                            if (resul) {
                                //Add user to session
                                req.session.user = user;
                                req.session.is_login = true;

                                if (user.userRights == 2) {
                                    session.is_admin = true;
                                } else {
                                    session.is_admin = false;
                                }
                                res.redirect('/account');
                            } else {
                                res.render('main/login', {title: "Login", error: "Invalid Username or Password."});
                            }
                        })
                    } else {
                        res.render('main/login', {title: "Login", error: "Invalid Username or Password."});
                    }
                } else {
                    res.render('main/login', {title: "Login", error: "Invalid Username or Password."});
                }
            });
        } else {
            res.render('main/login', {title: "Login", error: "Invalid Username or Password."});
        }
    },

    logout: (req, res) => {
        req.session.destroy((err) => {
            if(err) {
                console.log(err);
            } else {
                res.redirect('/');
            }
        });
        res.locals.loggedIn = false;
    },

    register: (req, res) => {
        res.render('main/register', {title: 'Login', error: req.flash('error')});
    },

    registerSubmit: async (req, res) => {
        let username = req.body.username;
        let password1 = req.body.password;
        let password2 = req.body.confirm_password;
        let email = req.body.email;

        if(password1 === password2) {
            var userCheck = await database.query(`SELECT userName FROM users WHERE userName="${username}"`);

            if (userCheck.length > 0) {
                console.log('hi');
                res.render('main/register', {error: "Username already taken, please try again."});
            } else {

                let hash = await bcrypt.hash(password1, 10);
                let userQuery = `INSERT INTO users (userEmail, userProfileImg, userName, userPassword, userRights, userDisplayName, userJoinDate) VALUES("${email}", "avatar.png", "${username}", "${hash}", 0, "${username}", "${new Date().toISOString().slice(0, 10)}")`;
                let hsQuery = `INSERT INTO hiscores (added) VALUES (1)`;

                //Due to database using auto increment on the primary key, and hiscore values being left to the DBMS to set defaults, no additional information needs to be added, not even the user's ID.
                database.query(userQuery);
                database.query(hsQuery);
                res.render('main/registerComplete');
            }
        } else {
            res.render('main/register', {title: 'Register', error: "Passwords do not match, please try again."});
        }

    },

    fourohfour: (req, res) => {
        res.render('main/404');
    }
};