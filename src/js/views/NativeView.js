/* globals define, forge */
define(function(require, exports, module) {

    var View = require("famous/core/View");

    function NativeView() {
        View.apply(this, arguments);
        
        _createTabBar.call(this);
        _showTopBar.call(this);
        _createEvents.call(this);
    }
    NativeView.prototype = Object.create(View.prototype);
    NativeView.prototype.constructor = NativeView;

    function _createTabBar() {
        var self = this;
        forge.tabbar.addButton({
            icon: "/img/camera.png"
        }, function (button) {
            button.onPressed.addListener(function () {
                self._eventOutput.emit("clickCamera");
            });
        });
    }

    function _showTopBar() {
        var self = this;
        forge.topbar.setTitle("Timeline"); // TODO tag
        forge.topbar.removeButtons(function () {
            forge.topbar.addButton({
                icon: "/img/hamburger.png",
                position: "left"
            }, function () {
                self._eventOutput.emit("clickBurger");
                _showTopBarBurger.call(self);
            });
            forge.topbar.addButton({
                icon: "/img/refresh.png",
                position: "right"
            }, function () {
                self._eventOutput.emit("clickRefresh");
            });
        });
        forge.tabbar.show();
    }

    function _showTopBarBurger() {
        var self = this;
        forge.topbar.setTitle("Burger");
        forge.topbar.removeButtons(function () {
            forge.topbar.addButton({
                text: "Done",
                style: "done",
                position: "right"
            }, function () {
                _showTopBar.call(self);
                self._eventOutput.emit("clickDone");
            });
        });
        forge.tabbar.hide();
    }

    function _createEvents() {
        var self = this;
        this._eventInput.on("clickDone", function () {
            _showTopBar.call(self);
            self._eventOutput.emit("clickDone");
        });
    }

    module.exports = NativeView;
});
