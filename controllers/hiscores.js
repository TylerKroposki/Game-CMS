let database = require('../config/database');
const { SKILLS, SKILL_DB_LEVEL, SKILL_DB_XP } = require('../config/config');

var totalRec = 0,
    pageSize  = 26,
    pageCount = 0;
var start = 0;
var currentPage = 1;

module.exports = {
    index: (req, res) => {
        res.redirect('/hiscores/p/1');
    },

    ironmanIndex: (req, res) => {
        res.redirect('/hiscores/ironman/p/1');
    },

    ironmanPage: async (req, res) => {
        let page = req.params.page;
        let output = "";
        if(!isNaN(page)) {
            currentPage = req.params.page;
            if(currentPage < 1) {
                res.redirect('/hiscores/ironman/p/1');
            } else {
                let offset = (parseInt(currentPage) - 1) * 26;
                let q1 = `SELECT h.userID, u.ironStatus, h.overallXP AS xp, h.totalLevel AS lvl, u.userDisplayName FROM hiscores h INNER JOIN users u ON h.userID = u.userID WHERE u.ironStatus > 0 ORDER BY overallXP DESC LIMIT 26 OFFSET ${offset}`;
                let countQuery = `SELECT COUNT(users.userID) AS count FROM hiscores INNER JOIN users WHERE hiscores.userID = users.userID AND users.ironStatus > 0`;
                let countRes = await database.query(countQuery);
                let count = parseInt(countRes[0].count);
                let rows = await database.query(q1);
                pageCount = Math.ceil(count / parseInt(pageSize));
                for (var i = 0; i < rows.length; i++) {
                    rows[i].rank = i + 1;
                }
                for (var i = 0; i < pageCount; i++) {
                    output += `<a href=\"/hiscores/ironman/p/${i + 1}\">${i + 1}</a>`;
                }
                if (parseInt(pageCount) > 1) {
                    res.render('hiscores/ironman', {
                        rows: rows,
                        output: output,
                        next: parseInt(currentPage) + 1,
                        prev: parseInt(currentPage) - 1
                    });
                } else {
                    res.render('hiscores/ironman', {rows: rows, output: output});
                }
            }
        } else {
            res.redirect('/hiscores/ironman/p/1');
        }
    },

    ironmanSkillPage: async (req, res) => {
        let id = req.params.id;
        let output = "";
        if(!isNaN(id) && id < 26 && id > -1) {
            currentPage = req.params.page;
            if(currentPage < 1) {
                res.redirect('/hiscores/hcim/p/1');
            } else {
                let offset = (parseInt(currentPage) - 1) * 26;
                let q1 = `SELECT h.userID, u.ironStatus, h.${SKILL_DB_XP[id]} AS xp, h.${SKILL_DB_LEVEL[id]} AS lvl, u.userDisplayName FROM hiscores h INNER JOIN users u ON h.userID = u.userID WHERE u.ironStatus > 0 ORDER BY ${SKILL_DB_XP[id]} DESC LIMIT 26 OFFSET ${offset}`;
                let countQuery = `SELECT COUNT(users.userID) AS count FROM hiscores INNER JOIN users WHERE hiscores.userID = users.userID AND users.ironStatus > 0`;
                let countRes = await database.query(countQuery);
                let count = parseInt(countRes[0].count);
                let rows = await database.query(q1);
                pageCount = Math.ceil(count / parseInt(pageSize));
                for (var i = 0; i < rows.length; i++) {
                    rows[i].rank = i + 1;
                }
                for (var i = 0; i < pageCount; i++) {
                    output += `<a href=\"/hiscores/ironman/s/${id}/p/${i + 1}\">${i + 1}</a>`;
                }
                if (parseInt(pageCount) > 1) {
                    res.render('hiscores/ironskill', {
                        rows: rows,
                        id: id,
                        output: output,
                        skillName: SKILLS[id],
                        next: parseInt(currentPage) + 1,
                        prev: parseInt(currentPage) - 1
                    });
                } else {
                    res.render('hiscores/ironskill', {rows: rows, id: id, output: output, skillName: SKILLS[id]});
                }
            }
        } else {
            res.redirect('/hiscores/hcim/p/1');
        }
    },

    hcimIndex: async (req, res) => {
        res.redirect('/hiscores/hcim/1');
    },
    hcimPage: async (req, res) => {
        let page = req.params.page;
        let output = "";
        if(!isNaN(page)) {
            currentPage = req.params.page;
            if(currentPage < 1) {
                res.redirect('/hiscores/hcim/p/1');
            } else {

                let offset = (parseInt(currentPage) - 1) * 26;
                let q1 = `SELECT h.userID, u.ironStatus, h.overallXP AS xp, h.totalLevel AS lvl, u.userDisplayName FROM hiscores h INNER JOIN users u ON h.userID = u.userID WHERE u.ironStatus > 1 ORDER BY overallXP DESC LIMIT 26 OFFSET ${offset}`;
                let countQuery = `SELECT COUNT(users.userID) AS count FROM hiscores INNER JOIN users WHERE hiscores.userID = users.userID AND users.ironStatus > 0`;
                let countRes = await database.query(countQuery);
                let count = parseInt(countRes[0].count);
                let rows = await database.query(q1);
                pageCount = Math.ceil(count / parseInt(pageSize));
                for (var i = 0; i < rows.length; i++) {
                    rows[i].rank = i + 1;
                }
                for (var i = 0; i < pageCount; i++) {
                    output += `<a href=\"/hiscores/hcim/p/${i + 1}\">${i + 1}</a>`;
                }
                if (parseInt(pageCount) > 1) {
                    res.render('hiscores/hcim', {
                        rows: rows,
                        output: output,
                        next: parseInt(currentPage) + 1,
                        prev: parseInt(currentPage) - 1
                    });
                } else {
                    res.render('hiscores/hcim', {rows: rows, output: output});
                }
            }
        } else {
            res.redirect('/hiscores/hcim/p/1');
        }
    },

    hcimSkillPage: async (req, res) => {
        let id = req.params.id;
        let output = "";
        if(!isNaN(id) && id < 26 && id > -1) {
            currentPage = req.params.page;
            let offset = (parseInt(currentPage) - 1) * 26;
            let q1 = `SELECT h.userID, u.ironStatus, h.${SKILL_DB_XP[id]} AS xp, h.${SKILL_DB_LEVEL[id]} AS lvl, u.userDisplayName FROM hiscores h INNER JOIN users u ON h.userID = u.userID WHERE u.ironStatus > 1 ORDER BY ${SKILL_DB_XP[id]} DESC LIMIT 26 OFFSET ${offset}`;
            let countQuery =  `SELECT COUNT(users.userID) AS count FROM hiscores INNER JOIN users WHERE hiscores.userID = users.userID AND users.ironStatus > 0`;
            let countRes = await database.query(countQuery);
            let count = parseInt(countRes[0].count);
            let rows = await database.query(q1);
            pageCount = Math.ceil(count/parseInt(pageSize));
            for(var i = 0; i < rows.length; i++) {
                rows[i].rank = i + 1;
            }
            for(var i = 0; i < pageCount; i++) {
                output += `<a href=\"/hiscores/hcim/s/${id}/p/${i + 1}\">${i + 1}</a>`;
            }
            if(parseInt(pageCount) > 1) {
                res.render('hiscores/hcimskill', {rows: rows, id: id, output: output, skillName: SKILLS[id], next: parseInt(currentPage) + 1, prev: parseInt(currentPage) - 1});
            } else {
                res.render('hiscores/hcimskill', {rows: rows, id: id, output: output, skillName: SKILLS[id]});
            }
        } else {
            res.redirect('/hiscores/ironman/p/1');
        }
    },

    regularGetPage: async (req, res) => {

        let q1 = `SELECT COUNT(userID) AS count FROM hiscores`;
        let q2 = `SELECT * FROM hiscores ORDER BY overallXP DESC LIMIT 26`;
        let q3 = `SELECT userDisplayName FROM users WHERE userID = ?`;

        let output = "";

        currentPage = req.params.page;
        if(currentPage < 1) {
            res.redirect('/hiscores/p/1');
        } else {
            let count = await database.query(q1);
            pageCount = Math.ceil(parseInt(count[0].count) / parseInt(pageSize));
            let offset = (parseInt(currentPage) - 1) * 26;
            if (parseInt(pageCount) > 1) {
                q2 = `SELECT * FROM hiscores ORDER BY overallXP DESC LIMIT 26 OFFSET ${offset}`;
                let rows = await database.query(q2);
                for (var i = 0; i < pageCount; i++) {
                    output += `<a href=\"/hiscores/p/${i + 1}\">${i + 1}</a>`;
                }
                for (var i = 0; i < rows.length; i++) {
                    let username = await database.query(q3, [rows[i].userID]);
                    rows[i].userName = username[0].userDisplayName;
                    rows[i].rank = i + 1;
                }
                res.render('hiscores/index', {
                    output: output,
                    next: parseInt(currentPage) + 1,
                    prev: parseInt(currentPage) - 1,
                    rows: rows
                });
            } else {
                let rows = await database.query(q2);
                for (var i = 0; i < rows.length; i++) {
                    let username = await database.query(q3, [rows[i].userID]);
                    rows[i].userName = username[0].userDisplayName;
                    rows[i].rank = i + 1;
                }
                res.render('hiscores/index', {first: true, rows: rows});
            }
        }
    },

    getRegSkillPage: async (req, res) => {
        let id = req.params.id;
        let output = "";
        if(!isNaN(id) && id < 26 && id > -1) {
            currentPage = req.params.page;
            let offset = (parseInt(currentPage) - 1) * 26;
            let q1 = `SELECT h.userID, h.${SKILL_DB_XP[id]} AS xp, h.${SKILL_DB_LEVEL[id]} AS lvl, u.userDisplayName FROM hiscores h INNER JOIN users u ON h.userID = u.userID ORDER BY ${SKILL_DB_XP[id]} DESC LIMIT 26 OFFSET ${offset}`;
            let countQuery =  `SELECT COUNT(userID) AS count FROM hiscores`;
            let countRes = await database.query(countQuery);
            let count = parseInt(countRes[0].count);
            let rows = await database.query(q1);
            pageCount = Math.ceil(count/parseInt(pageSize));
            for(var i = 0; i < rows.length; i++) {
                rows[i].rank = i + 1;
            }
            for(var i = 0; i < pageCount; i++) {
                output += `<a href=\"/hiscores/s/${id}/p/${i + 1}\">${i + 1}</a>`;
            }
            if(parseInt(pageCount) > 1) {
                res.render('hiscores/regskill', {rows: rows, id: id, output: output, skillName: SKILLS[id], next: parseInt(currentPage) + 1, prev: parseInt(currentPage) - 1});
            } else {
                res.render('hiscores/regskill', {rows: rows, id: id, output: output, skillName: SKILLS[id]});
            }
        } else {
            res.redirect('/hiscores/p/1');
        }
    }
};