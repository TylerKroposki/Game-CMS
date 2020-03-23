const express = require('express');

const router = express.Router();
const controller = require('../controllers/logs');
const database = require('../config/database');
const { check, validationResult } = require('express-validator');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'main';
    next();
});

router.route('/')
    .get(controller.index);

router.post('/search', async (req, res) => {
    check('username').notEmpty();
    const errors = validationResult(req);
    if(errors.isEmpty()) {
        let username = req.body.username;
        await database.query(`SELECT userRights, userDisplayName, userIsBanned, userCredits, userSupportRights, userJoinDate FROM users WHERE userDisplayName="${username}"`, (err, rows) => {
            if (rows.length > 0) {
                if (rows) {
                    res.render('logs/index');
                }
            } else {
                res.render('logs/search', { error: true});
            }
        });
    } else {
        res.redirect('/logs/')
    }
});


module.exports = router;