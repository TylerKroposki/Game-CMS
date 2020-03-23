const { is_login, is_user_logged_in} = require('../middleware/authenticate');

module.exports = {

    selectOption : function (status, options) {
        return options.fn(this).replace(new RegExp('value=\"'+status+'\"'), '$&selected="selected"');
    },

    if_eq: function(v1, v2, options) {
        if(v1 === v2) {
            return options.fn(this);
        }
        return options.inverse(this);
        },

    formatMoney: (val) => {
        return '$' + parseFloat(val, 10).toFixed(2);
    },

    getDate: (req, res) => {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = yyyy + '-' + mm + '-' + dd;
        return today;
    }

};