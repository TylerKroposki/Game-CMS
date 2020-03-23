module.exports = {
    is_login: (req,res,next) => {
        if(!req.session.is_login) {
            return res.redirect('/');
        }
        next();
    },
    is_user_logged_in: (req, res, next) => {
        if(req.session) {
            return true;
        } else {
            return false;
        }
        next();
    },

    is_admin: (req, res,next) => {
        if(!req.session.is_login) {
            return res.redirect('/');
        }
        if(req.session.user.userRights == 2) {
            next()
        } else {
            return res.redirect('/order');
        }
    }

};