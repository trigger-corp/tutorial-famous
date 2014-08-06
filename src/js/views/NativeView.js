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

    NativeView.DEFAULT_OPTIONS = {
        openPosition: 276,
        transition: {
            duration: 400,
            curve: "easeInOut"
        },
        currentTag: "Popular"
    };

    function _createTabBar() {
        forge.tabbar.addButton({
            icon: "/img/camera.png"
        }, function (button) {
            button.onPressed.addListener(function () {
                this._eventOutput.emit("clickCamera");
            }.bind(this));
        }.bind(this));
    }

    function _showTopBar() {
        forge.topbar.setTitle(this.options.currentTag);
        forge.topbar.removeButtons(function () {
            forge.topbar.addButton({
                icon: "/img/hamburger.png",
                position: "left"
            }, function () {
                this._eventOutput.emit("clickBurger");
                _showTopBarBurger.call(this);
            }.bind(this));
            forge.topbar.addButton({
                icon: "/img/refresh.png",
                position: "right"
            }, function () {
                this._eventOutput.emit("clickRefresh");
            }.bind(this));
        }.bind(this));
        forge.tabbar.show();
    }

    function _showTopBarBurger() {
        forge.topbar.setTitle("Burger");
        forge.topbar.removeButtons(function () {
            forge.topbar.addButton({
                text: "Done",
                style: "done",
                position: "right"
            }, function () {
                _showTopBar.call(this);
                this._eventOutput.emit("clickDone");
            }.bind(this));
        }.bind(this));
        forge.tabbar.hide();
    }

    function _createEvents() {
        this._eventInput.on("clickDone", function (currentTag) {
            if (currentTag) {
                this.options.currentTag = currentTag;
            }
            _showTopBar.call(this);
            this._eventOutput.emit("clickDone");
        }.bind(this));
    }

    module.exports = NativeView;
});
