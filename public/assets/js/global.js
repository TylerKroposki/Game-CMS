typeof NeoJS !== "undefined" ? (function($) {

    var news_archive = $.select(".news-archive");

    var hiscores__search = $.select(".hiscores__search");

    if($.isDefined(news_archive)) {

        var select_month = $.select(".news-archive__select-month");

        var select_form = $.select(".news-archive__select-month__expansion");

        var year_buttons = $.select(".news-archive__select-month__expansion__year .news-archive__select-month__expansion__button", "query_all");

        var month_buttons = $.select(".news-archive__select-month__expansion__month .news-archive__select-month__expansion__button", "query_all");

        select_month.bind("click", function(e) {

            e.preventDefault();

            select_month.toggleClass("news-archive__select-month--open");

        });

        select_form.bind("submit", function(e) {

            e.preventDefault();

            var year = select_form.select(".news-archive__select-month__expansion__year input[type=\"radio\"]:checked").value();

            var month = select_form.select(".news-archive__select-month__expansion__month input[type=\"radio\"]:checked").value();

            window.location.href = [ BASE_URL, "news-archive", year, month ].join("/");

        });

        year_buttons.each(function(year_btn) {

            var radio = year_btn.select("input");

            radio.bind("change", function() {

                var selected_year = radio.value();

                var current_year = new Date().getFullYear();

                var current_month = new Date().getMonth() + 1;

                month_buttons.call("css", "visibility", "visible").call("css", "pointer-events", "auto");

                if(selected_year == current_year) {

                    month_buttons.filter(function(node) {
                        return parseInt(node.select("input").value()) > current_month;
                    }).call("css", "visibility", "hidden").call("css", "pointer-events", "none");

                }

            });

        });

    }

    if($.isDefined(hiscores__search)) {

        hiscores__search.bind("submit", function(e) {

            e.preventDefault();

            var username = hiscores__search.select(".input-text").value();

            window.location.href = [ window.location.origin, "hiscores", "search", encodeURI(username) ].join("/");

        });

    }

})(NeoJS) : "";