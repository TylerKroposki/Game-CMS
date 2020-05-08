module.exports = {
    is_login: (req,res,next) => {
        if(!req.session.is_login) {
            return res.redirect('/login');
        }
        next();
    }
};