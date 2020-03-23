typeof NeoJS !== "undefined" ? (function($) {

    var products = $.select("store__product", "class");

    var basket = $.select(".store__basket");

    var basket_empty = $.select(".store__basket__empty");

    var basket_footer = $.select(".store__basket__footer");

    var basket_clear = $.select("store__basket__footer__clear", "class");

    var basket_checkout = $.select(".store__basket__footer__checkout .btn--primary");

    var categories = $.select("store__category", "class");

    var category_buttons = $.select("link-buttons__item", "class");

    var get_more_btn = $.select(".store__credits .secondary-btn");

    function update_total() {

        var total = 0;

        basket.select("tr", "tag").filter(function(item) {
            return item.hasAttribute("data-id");
        }).each(function(item) {
            total += parseInt(item.select(".store__basket__price").inner());
        });

        basket_footer.select(".store__basket__footer__total strong span").inner(total);

    }

    function adjust_quantity(e) {

        var node = e.node;

        var less = node.hasClass("quantity-btn--min");

        var item = node.parent("tr");

        var basket_amount = item.select(".quantity-btn__outer > span");

        var basket_price = item.select(".store__basket__price");

        var new_amount = (parseInt(basket_amount.inner().replace(/^\D+/g, '')) + (less ? -1 : 1));

        if(new_amount <= 0) {
            return;
        }

        basket_amount.inner(new_amount+"x");
        basket_price.inner(parseInt(item.data("credits")) * new_amount);

        update_total();

    }

    products.each(function(product) {

        var id = product.data("id");

        var name = product.select(".store__product__info h3");

        var credits = product.select(".store__product__credits strong");

        var button = product.select(".store__product__btn a");

        button.bind("click", function(e) {

            var target = $.select(e.target);

            if($.isDefined(target.parent(".store__category[data-category=\"credits\"]"))) {
                return false;
            }

            e.preventDefault();

            var item = basket.select("tr", "tag").filter(function(node) {
                return node.data("id") == id;
            }).first();

            if($.isDefined(item)) {

                var basket_amount = item.select(".quantity-btn__outer > span");

                var basket_price = item.select(".store__basket__price");

                var new_amount = (parseInt(basket_amount.inner().replace(/^\D+/g, '')) + 1);

                basket_amount.inner(new_amount+"x");
                basket_price.inner(parseInt(item.data("credits")) * new_amount);

            } else {

                item = $.create("tr", { "data-id": id, "data-credits": credits.inner() });

                item.append(
                    $.create("td", { class: "store__basket__amount" })
                        .append($.create("div", { class: "quantity-btn__outer" })
                            .append($.create("div", { class: "quantity-btn quantity-btn--min" }).bind("click", adjust_quantity)
                                .append($.create("span", { inner: "-" })))
                            .append($.create("span", { inner: "1x" }))
                            .append($.create("div", { class: "quantity-btn quantity-btn--plus" }).bind("click", adjust_quantity)
                                .append($.create("span", { inner: "+" }))))
                );

                item.append(
                    $.create("td", { class: "store__basket__product", inner: name.inner() })
                );

                item.append(
                    $.create("td", { class: "store__basket__price", inner: credits.inner() })
                );

                basket.select("tbody").append(item);
                basket.removeClass("hidden");
                basket_footer.removeClass("hidden");
                basket_empty.addClass("hidden");

            }

            update_total();

        });

    });

    basket_clear.bind("click", function(e) {

        var items = basket.select("tr", "tag").filter(function(item) {
            return item.hasAttribute("data-id");
        }).call("remove");

        update_total();

        if(basket.select("tr", "tag").size() <= 1) {
            basket.addClass("hidden");
            basket_footer.addClass("hidden");
            basket_empty.removeClass("hidden");
        }

    });

    category_buttons.bind("click", function(e) {

        e.preventDefault();

        var anchor = e.node.attribute("href").substring(1);

        categories.addClass("hidden");
        categories.filter(function(node) {
            return node.data("category") == anchor;
        }).first().removeClass("hidden");

        category_buttons.removeClass("link-buttons__item--active");
        e.node.addClass("link-buttons__item--active");

    });

    get_more_btn.bind("click", function(e) {

        e.preventDefault();

        category_buttons.filter(function(node) {
            return node.attribute("href") == e.node.attribute("href");
        }).first().trigger("click");

    });

    basket_checkout.bind("click", function(e) {

        e.preventDefault();

        var total = 0;

        basket.select("tr", "tag").filter(function(item) {
            return item.hasAttribute("data-id");
        }).each(function(item) {
            total += parseInt(item.select(".store__basket__price").inner());
        });

        if(total > CREDITS) {
            alert("You do not have enough credits to buy this many products. Please, purchase more credits.");
            return false;
        }

        var data = {};

        basket.select("tr", "tag").filter(function(item) {
            return item.hasAttribute("data-id");
        }).each(function(item) {
            data[item.data("id")] = parseInt(item.select(".store__basket__amount div + span").inner().replace(/^\D+/g, ''));
        });

        var url = [ window.location.origin, "store", "buy" ].join("/");

        $.ajax().call(url+"?data="+encodeURIComponent(JSON.stringify(data)), function(request, text) {

            console.log(text);

        });

    });

})(NeoJS) : "";