const database = require('../config/database');

module.exports = {
    index: async (req, res) => {
        let id = req.session.user.userID;

        let query1 = "SELECT * FROM hiscores WHERE userID = ?";
        let query2 = "SELECT * FROM useractivity WHERE userID = ? LIMIT 8";

        let hiscores = await database.query(query1, [id]);
        let activity = await database.query(query2, [id]);
        const date = new Date(req.session.user.userJoinDate);
        req.session.user.userJoinDate = date.toDateString();

        res.render('account/index', {title: "Account", account: req.session.user, hs: hiscores[0], act: activity});
    },

};