const database = require('../config/database');
const dbf = require('../middleware/dbFunctions');

module.exports = {

    //Base directory
    index: async (req, res) => {

        //Query database to retrieve categories
        await dbf.q('SELECT * FROM forumcategories', async (err, rows) => {
            if(err) {
                console.log(err);
            } else {

                //For each category find the forums associated.
                for(let i = 0; i < rows.length; i++) {

                    //Nested query for each category
                    await dbf.q(`SELECT * FROM forums WHERE forumCatID=${rows[i].forumCatID}`, async (error, res) => {
                        if(error) {
                            console.log(error);
                        } else {
                            rows[i].forums = JSON.parse(JSON.stringify(res));
                        }
                    });
                }

                //Pass categories with forum objects to view
                res.render('forums/index', {categories: rows});
            }
        });
    },

    //Get and render threads for a given forum
    getForum: async (req, res) => {
        let id = req.params.id;
        //Query database to retrieve threads for given forum
        if(isNaN(id)) {
            res.render('forums/error', {error: "INVALID INPUT"});
        } else {
            await dbf.q(`SELECT * FROM threads WHERE forumID=${id}`, async (err, rows) => {
                if (err) {
                    console.log(err);
                } else {
                    if (rows.length > 0) {
                        for (let i = 0; i < rows.length; i++) {
                            await dbf.q(`SELECT * FROM users WHERE userID=${rows[0].threadAuthor}`, (userErr, userRes) => {
                                if (err) {
                                    throw err;
                                } else {
                                    rows[i].authorName = userRes[0].userDisplayName;
                                }
                            });
                        }

                        let forumName = await database.query(`SELECT forumName FROM forums WHERE forumID=${id}`);
                        let catName = await database.query(`SELECT * FROM forumcategories WHERE forumCatID = ${rows[0].forumID}`);

                        res.render('forums/forum', {
                            threads: rows,
                            forum: forumName[0].forumName,
                            cat: catName[0].forumCatName
                        });
                    } else {
                        res.render('forums/error', {error: "NO FORUMS FOUND FOR SPECIFIED CATEGORY"});
                    }
                }
            });
        }
    },

    //Get and render a thread with its replies
    getThread: async (req, res) => {
        let id = req.params.id;
        if(isNaN(id)) {
            res.render('forums/error', {error: "INVALID INPUT"});
        } else {
            await dbf.q(`SELECT * FROM threads WHERE threadID = ${id}`, async (err, rows) => {
                if(rows.length > 0) {
                    if (err) {
                        console.log(err);
                    } else {
                        let author = await database.query(`SELECT * FROM users WHERE userID=${rows[0].threadAuthor}`)
                        rows[0].author = author[0];
                        await dbf.q(`SELECT * FROM threadReplies WHERE threadID = ${id}`, async (repErr, repRows) => {
                            if (repRows.length > 0) {
                                rows[0].replies = repRows;
                                for(var i = 0; i < rows[0].replies.length; i++) {
                                    let repAuthor = await database.query(`SELECT * FROM users WHERE userID=${rows[0].replies[i].userID}`);
                                    rows[0].replies[i].repAuthor = repAuthor[0];
                                }
                            }
                        });
                        res.render('forums/thread', {thread: rows[0]});
                    }
                } else {
                    res.render('forums/error', {error: "NO THREAD FOUND"});
                }
            });
        }
    },

    submitThreadReply: (req, res) => {

    }
};