typeof NeoJS !== "undefined" ? (function($) {

    var enter_user = $.select(".vote__enter-user");

    var enter_user_form = enter_user.select("form");

    var username_block = $.select(".vote__username-block");

    var username_block_not_voting = username_block.select(".vote__username-block__not-voting");

    var username_block_voting_as = username_block.select(".vote__username-block__voting-as");

    var vote = $.select(".vote");

    enter_user_form.bind("submit", function(e) {

        e.preventDefault();

        var input = enter_user_form.select("input[type=\"text\"]");

        var username = input.value();

        if(username.length <= 0) {
            alert("Please, enter a valid username.");
            return false;
        }

        username_block_voting_as.select("p > span:first-of-type").inner(username);

        username_block_not_voting.addClass("hidden");
        username_block_voting_as.removeClass("hidden");
        vote.removeClass("vote--disabled");
        enter_user.addClass("hidden");

    });

    username_block_voting_as.select(".btn").bind("click", function(e) {

        e.preventDefault();

        var input = enter_user.select("input[type=\"text\"]");

        input.value("");

        username_block_not_voting.removeClass("hidden");
        username_block_voting_as.addClass("hidden");
        vote.addClass("vote--disabled");
        enter_user.removeClass("hidden");

        input.origin.focus();

    });

})(NeoJS) : "";