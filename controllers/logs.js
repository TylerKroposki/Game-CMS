const database = require('../config/database');
const sanitizer = require('sanitize')();

module.exports = {
    index: (req, res) => {
        res.render('logs/search', {title: 'Adventure Logs' });
    },

    //POST from form submission to search for a user by userDisplayName
    submitUsername:  async (req, res, next) => {

        let username = req.body.username;
        let sql = "SELECT userRights, userDisplayName, userProfileImg, userIsBanned, userCredits, userSupportRights, userJoinDate FROM users WHERE userDisplayName = ?";

        await database.query(sql, [username], (err, rows) => {
            if(err) {
                res.redirect('/404');
            }
            if (rows.length > 0) {
                if (rows) {
                    res.render('logs/index', { profile: rows[0] });
                } else {
                    res.render('logs/search', { error: "User Not Found."});
                }
            } else {
                res.render('logs/search', { error: "User Not Found."});
            }
        });
    },

    searchUsername: async (req, res, next) => {
        let username = req.params.username;
        let sql = "SELECT userRights, userDisplayName, userProfileImg, userIsBanned, userCredits, userSupportRights, userJoinDate FROM users WHERE userDisplayName = ?";
        await database.query(sql, [username], (err, rows) => {
            if (rows.length > 0) {
                if (rows) {
                    res.render('logs/index', { profile: rows[0] });
                } else {
                    res.render('logs/search', { error: "User Not Found."});
                }
            } else {
                res.render('logs/search', { error: "User Not Found."});
            }
        });
    }

};