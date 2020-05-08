const database = require('../config/database');
var sanitizeHtml = require('sanitize-html');

module.exports = {

    //Base directory
    index: async (req, res) => {

        //Query database to retrieve categories
        let q1 = "SELECT * FROM forumcategories";
        let q2 = "SELECT * FROM forums WHERE forumCatID = ?";
        let categories = await database.query(q1);
        if(categories.length) {
            for(var i = 0; i < categories.length; i++) {
                let forums = await database.query(q2, [categories[i].forumCatID]);
                categories[i].forums = JSON.parse(JSON.stringify(forums));
            }
        }
        res.render('forums/index', {categories: categories});

    },

    //Get and render threads for a given forum
    getForum: async (req, res) => {
        let id = req.params.id;
        //Query database to retrieve threads for given forum
        if(isNaN(id)) {
            res.render('forums/error', {error: "INVALID INPUT"});
        } else {
            let q1 = "SELECT * FROM threads WHERE forumID = ?";
            let q2 = "SELECT userDisplayName FROM users WHERE userID = ?";
            let q3 = "SELECT forumName FROM forums WHERE forumID = ?";
            let q4 = "SELECT * FROM forumcategories WHERE forumCatID = ?";
            let threads = await database.query(q1, [id]);
            if(threads.length) {
                for(var i = 0; i < threads.length; i++) {
                    let user = await database.query(q2, [threads[i].threadAuthor]);
                    if(user.length && user.length > 0) {
                        threads[i].authorName = await user[0].userDisplayName;
                    }
                }
                let forumName = await database.query(q3, [id]);
                let catName = await database.query(q4, [threads[0].forumID]);
                if(forumName.length && forumName.length > 0 && catName.length && catName.length > 0) {
                    res.render('forums/forum', {threads: threads, forum: forumName[0].forumName, cat: catName[0].forumCatName});
                }
            } else {
                res.render('forums/error', {error: "NO FORUMS FOUND FOR SPECIFIED CATEGORY"});
            }
        }
    },

    //Get and render a thread with its replies
    getThread: async (req, res) => {
        let id = req.params.id;
        if(isNaN(id)) {
            res.render('forums/error', {error: "INVALID INPUT"});
        } else {
            let q1 = "SELECT * FROM threads WHERE threadID = ?";
            let q2 = "SELECT userProfileImg, userRights, userDisplayName, userIsBanned FROM users WHERE userID = ?";
            let q3 = "SELECT * FROM threadreplies WHERE threadID = ?";
            let thread = await database.query(q1, [id]);
            if(thread[0]) {
                let author = await database.query(q2, [thread[0].threadAuthor]);
                let replies = await database.query(q3, [id]);
                thread[0].author = author[0];
                thread[0].replies = replies;
                for(var i = 0; i < thread[0].replies.length; i++) {
                   let repAuthor = await database.query(q2, [thread[0].replies[i].userID]);
                    thread[0].replies[i].repAuthor = await repAuthor[0];
                }
            }
            res.render('forums/thread', {thread: thread[0]});
        }
    },

    submitThreadReply: async (req, res) => {
        let content = req.body.content;
        let id = req.params.id;
        // Allow only a super restricted set of tags and attributes
        let clean = sanitizeHtml(content, {
            disallowedTagsMode: 'script',
            allowedIframeHostnames: ['www.youtube.com']
        });
        if(!isNaN(id)) {
            let sql = "INSERT INTO threadreplies SET userID = ?, threadID = ?, replyContent = ?";
            await database.query(sql, [req.session.user.userID, id, clean], (err, rows) => {
                let link = `/forums/t/${id}`;
                res.redirect(link);
            });
        } else {
            let link = `/forums/t/${id}`;
            res.redirect(link);
        }
    }
};