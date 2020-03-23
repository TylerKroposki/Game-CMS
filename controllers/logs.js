module.exports = {
    index: (req, res) => {
        res.render('logs/search', {title: 'Adventure Logs', error: req.flash('error')});
    },

};