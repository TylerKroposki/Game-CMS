let database = require('../config/database');
const { findTotal } = require('../config/functions');

module.exports = {


    index: (req, res) => {
        res.redirect('/store/c/1');
    },

    //Retrieve all products for specified category
    getCategory: async (req, res) => {
        let id = req.params.id;
        let sql = `SELECT * FROM storeproducts WHERE catID = ${id}`;
        let products = await database.query(sql);

        res.render('store/category', {products: products});
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
        req.session.user.cart.splice(filtered, 1);
        res.redirect('/store/cart')
    },

    //Empty user's cart
    empty: (req, res) => {
        if(req.session.user.cart.length > 0) {
            req.session.user.cart = [];
        }
        res.redirect('/store');
    }


};