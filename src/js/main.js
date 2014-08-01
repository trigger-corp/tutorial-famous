/* globals define, forge */
define(function(require, exports, module) {
    "use strict";
    var Engine = require("famous/core/Engine");
    var FastClick = require("famous/inputs/FastClick");

    // Create Main application view
    var AppView = require("views/AppView");
    var context = Engine.createContext();
	context.setPerspective(2000);
    var appView = new AppView();
    context.add(appView);
});
