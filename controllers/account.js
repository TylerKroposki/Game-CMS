const database = require('../config/database');

module.exports = {
    index: async (req, res) => {
        const hiscores = await database.query(`SELECT * FROM hiscores WHERE userID=${req.session.user.userID}`);
        const activity = await database.query(`SELECT * FROM useractivity WHERE userID=${req.session.user.userID} LIMIT 8`);

        res.render('account/index', {title: "Account", account: req.session.user, hs: hiscores[0], act: activity});
    },

};