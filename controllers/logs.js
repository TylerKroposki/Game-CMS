const database = require('../config/database');

module.exports = {
    index: (req, res) => {
        res.render('logs/search', {title: 'Adventure Logs' });
    },

    //POST from form submission to search for a user by userDisplayName
    submitUsername:  async (req, res, next) => {

        let username = req.body.username;
        let sql = "SELECT userID, userRights, userDisplayName, userProfileImg, userIsBanned, userCredits, userSupportRights, userJoinDate FROM users WHERE userDisplayName = ?";
        let query1 = "SELECT * FROM hiscores WHERE userID = ?";
        let query2 = "SELECT * FROM useractivity WHERE userID = ? LIMIT 8";

        let hsSql = 'SELECT h.overallXP, h.totalLevel, u.userDisplayName FROM hiscores h INNER JOIN users u ON h.userID = u.userID ORDER BY overallXP DESC LIMIT 10';
        let top = await database.query(hsSql);
        for(var i = 0; i < top.length; i++) {
            top[i].rank = i + 1;
        }

        await database.query(sql, [username], async (err, rows) => {
            if(err) {
                res.redirect('/404');
            }
            if (rows.length > 0) {
                if (rows) {
                    let hiscores = await database.query(query1, [rows[0].userID]);
                    let activity = await database.query(query2, [rows[0].userID]);
                    for(var i = 0; i < activity.length; i++) {
                        let actDate = new Date(await activity[i].activityDate);
                        activity[i].activityDate = actDate.toDateString();
                    }
                    const date = new Date(rows[0].userJoinDate);
                    rows[0].userJoinDate = date.toDateString();
                    res.render('logs/index', { profile: rows[0], hs: hiscores[0], act: activity, top: top});
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

        let sql = "SELECT userID, userRights, userDisplayName, userProfileImg, userIsBanned, userCredits, userSupportRights, userJoinDate FROM users WHERE userDisplayName = ?";
        let query1 = "SELECT * FROM hiscores WHERE userID = ?";
        let query2 = "SELECT * FROM useractivity WHERE userID = ? LIMIT 8";
        let hsSql = 'SELECT h.overallXP, h.totalLevel, u.userDisplayName FROM hiscores h INNER JOIN users u ON h.userID = u.userID ORDER BY overallXP DESC LIMIT 10';

        let top = await database.query(hsSql);
        for(var i = 0; i < top.length; i++) {
            top[i].rank = i + 1;
        }

        await database.query(sql, [username], async (err, rows) => {
            if (rows.length > 0) {
                if (rows) {

                    let hiscores = await database.query(query1, [rows[0].userID]);
                    let activity = await database.query(query2, [rows[0].userID]);

                    for(var i = 0; i < activity.length; i++) {
                        let actDate = new Date(await activity[i].activityDate);
                        activity[i].activityDate = actDate.toDateString();
                    }
                    const date = new Date(rows[0].userJoinDate);
                    rows[0].userJoinDate = date.toDateString();
                    res.render('logs/index', { profile: rows[0], act: activity, hs: hiscores[0], top: top });
                } else {
                    res.render('logs/search', { error: "User Not Found."});
                }
            } else {
                res.render('logs/search', { error: "User Not Found."});
            }
        });
    }

};