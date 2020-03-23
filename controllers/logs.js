const database = require('../config/database');

module.exports = {
    index: (req, res) => {
        res.render('logs/search', {title: 'Adventure Logs' });
    },

    submitUsername: async (req, res, next) => {
        let username = req.body.username;
        await database.query(`SELECT userRights, userDisplayName, userProfileImg, userIsBanned, userCredits, userSupportRights, userJoinDate FROM users WHERE userDisplayName="${username}"`, (err, rows) => {
            if (rows.length > 0) {
                if (rows) {
                    console.log(rows);
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
        await database.query(`SELECT userRights, userDisplayName, userProfileImg, userIsBanned, userCredits, userSupportRights, userJoinDate FROM users WHERE userDisplayName="${username}"`, (err, rows) => {
            if (rows.length > 0) {
                if (rows) {
                    console.log(rows);
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