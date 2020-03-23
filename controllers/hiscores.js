module.exports = {
    index: (req, res) => {
        res.render('hiscores/index', {title: 'Hiscores', error: req.flash('error')});
    },
};