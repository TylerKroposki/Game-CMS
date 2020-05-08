let database = require('../config/database');
const { findTotal, getDate } = require('../config/functions');

module.exports = {


    index: (req, res) => {
        res.redirect('/store/c/1');
    },

    //Retrieve all products for specified category
    getCategory: async (req, res) => {
        let id = req.params.id;
        let q1 = "SELECT * FROM storeproducts WHERE catID = ?";
        let q2 = "SELECT prodCatName FROM productcategory WHERE prodCatID = ?";

        let products = await database.query(q1, [id]);
        let cat = await database.query(q2, [id]);
        res.render('store/category', {products: products, cat: cat[0].prodCatName});
    },

    //Add product given product ID to user's cart
    add: async (req, res) => {
        let id = req.params.id;

        if(Number(id)) {
            let newItem = 1;
            if(req.session.user.cart.length > 0) {
                for (var i = 0; i < req.session.user.cart.length; i++) {
                    if (req.session.user.cart[i].prodID = id) {
                        req.session.user.cart[i].quantity = 1 + parseInt(req.session.user.cart[i].quantity, 10);
                        req.session.user.cart[i].total = req.session.user.cart[i].prodPrice * req.session.user.cart[i].quantity;
                        newItem = 0;
                    }
                }
            }
            if(newItem === 1) {
                const result = await database.query('SELECT * FROM storeproducts WHERE prodID = ?', [id]);
                result[0].quantity = 1;
                result[0].total = result[0].prodPrice;
                req.session.user.cart.push(result[0]);
            }

        } else {
            //Number invalid
            res.redirect('/store');
        }
        res.redirect('/store');
    },

    //Remove product given product ID from user's cart
    remove: (req, res) => {
        let id = req.params.id;
        var filtered;
        for(var i = 0; i < req.session.user.cart.length; i++) {
            if(req.session.user.cart[i].id == id) {
                filtered = i;
            }
        }
        //Removes element
        req.session.user.cart.splice(filtered, 1);
        res.redirect('/store/cart')
    },

    //Empty user's cart
    empty: (req, res) => {
        if(req.session.user.cart.length > 0) {
            req.session.user.cart = [];
        }
        res.redirect('/store');
    },

    checkout: async (req, res) => {
        let userID = req.session.user.userID;
        let cart = req.session.user.cart;
        let total = findTotal(cart);
        let date = getDate();

        if(cart.length > 0) {
            if(req.session.user.userCredits >= total) {

                req.session.user.userCredits = req.session.user.userCredits - total;
                let q1 = "INSERT INTO transactions(userID, tranTotal, tranDate, tranStatus) VALUES(?, ?, ?, ?)";
                let q2 = "INSERT INTO transactionitems(tranID, prodID, tranItemQuantity) VALUES(?, ?, ?)";
                let q3 = "UPDATE users SET userCredits = ? WHERE userID = ?";

                //Insert new transaction
                database.query(q1, [userID, total, date, 1], (err, res) => {
                    if (err) throw err;

                    //Insert each individual item from the transaction
                    for (var i = 0; i < cart.length; i++) {
                        database.query(q2, [res.insertId, cart[i].prodID, cart[i].quantity]);
                    }
                });

                database.query(q3, [req.session.user.userCredits, userID]);

                //Empty user's cart
                req.session.user.cart = [];
                res.redirect('/');
            } else {
                res.redirect('/store/insufficient');
            }

        } else {
            res.redirect('/store')
        }
    },

    insufficient: (req, res) => {
        res.render('store/insufficient');
    }


};