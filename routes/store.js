const express = require('express');

const router = express.Router();
const controller = require('../controllers/store');

//Verify user is logged in
const { is_login } = require('../middleware/authenticate');

router.all('/*', is_login, (req, res, next) => {
    req.app.locals.layout = 'main';
    next();
});

router.route('/')
    .get(controller.index);

router.route('/c/:id')
    .get(controller.getCategory);

router.route('/cart/add/:id')
    .get(controller.add);

router.route('/cart/remove')
    .get(controller.remove);

router.route('/cart/empty')
    .get(controller.empty);

router.route('/checkout')
    .get(controller.checkout);

router.route('/insufficient')
    .get(controller.insufficient);


module.exports = router;