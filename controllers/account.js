const database = require('../config/database');

module.exports = {
    index: async (req, res) => {

        let id = req.session.user.userID;

        //Prepared statements
        let query1 = "SELECT * FROM hiscores WHERE userID = ?";
        let query2 = "SELECT * FROM useractivity WHERE userID = ? LIMIT 8";
        let query3 = "SELECT tranID, userID FROM transactions WHERE userID = ? LIMIT 9";
        let query4 = "SELECT t.tranID, t.prodID, t.tranItemQuantity, p.prodName FROM transactionitems t, storeproducts p WHERE p.prodID = t.prodID and tranID = ?";

        //Execute query with parameters
        let hiscores = await database.query(query1, [id]);
        let activity = await database.query(query2, [id]);
        let transactions = await database.query(query3, [id]);

        let items = [];
        for(var i = 0; i < transactions.length; i++) {
            let transactionitems = await database.query(query4, [transactions[i].tranID]);
            for(var j = 0; j < transactionitems.length; j++) {
                items.push(await transactionitems[i]);
            }
        }
        for(var i = 0; i < activity.length; i++) {

            //Format date to go Day Of Week-Month-Day-Year
            let actDate = new Date(await activity[i].activityDate);
            activity[i].activityDate = actDate.toDateString();
        }

        const date = new Date(req.session.user.userJoinDate);
        req.session.user.userJoinDate = date.toDateString();

        res.render('account/index', {title: "Account", account: req.session.user, hs: hiscores[0], act: activity, purchases: items});
    },

};