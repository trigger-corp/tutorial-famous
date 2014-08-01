/* globals require */
require.config({
    paths: {
        "famous": "../lib/famous",
        "requirejs": "../lib/requirejs/require",
        "handlebars": "../lib/handlebars/handlebars"
    }
});
require(["handlebars", "main"]);
