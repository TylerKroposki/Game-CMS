const database = require('../config/database');
const {callback} = require('../config/functions');



module.exports = {

    q: function (query, cb) {
        database.query(query, (err, res) => {
            if(err) {
                throw err;
            } else {
                cb(err, res);
            }
        });
    },

};