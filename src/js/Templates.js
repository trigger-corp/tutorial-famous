/* globals define, Handlebars */
define(function(require, exports, module) {
    "use strict";

    // Template helper to Twittify a comment
    Handlebars.registerHelper("pretty", function (text) {
        if (!text) {
            return "";
        }
        var html = text.split(" ").map(function (word) {
            if (word.indexOf("@") === 0) {
                word = "<span class='usertag'>" + word + "</span>";
            } else if (word.indexOf("#") === 0) {
                word = "<span class='hashtag'>" + word + "</span>";
            } else if (word.indexOf("http") === 0) {
                word = "<a href='" + word + "'>" + word + "</a>";
            }
            return word;
        }).join(" ");
        return new Handlebars.SafeString(html);
    });

    // Template helper to slice a list
    Handlebars.registerHelper("slice", function (from, to, context, options) {
        return context.slice(from, to).map(options.fn).join("");
    });

    // Compile templates
    module.exports.front = Handlebars.compile(document.getElementById("template-front").innerHTML);
    module.exports.rear = Handlebars.compile(document.getElementById("template-rear").innerHTML);
});
