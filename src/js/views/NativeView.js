/* globals define, forge */
define(function(require, exports, module) {
    var View = require("famous/core/View");

    /**
     * view constructor
     */
    function NativeView() {
        View.apply(this, arguments);
        
        _createTabBar.call(this);
        _showTopBar.call(this);
        _createEvents.call(this);
    }
    NativeView.prototype = Object.create(View.prototype);
    NativeView.prototype.constructor = NativeView;

    /**
     * view state variables
     */
    NativeView.DEFAULT_OPTIONS = {
        currentTag: "Sloths"
    };

    /**
     * create a native tabbar
     */
    function _createTabBar() {
        forge.tabbar.addButton({
            icon: "/img/camera.png"
        }, function (button) {
            button.onPressed.addListener(function () {
                this._eventOutput.emit("clickCamera");
            }.bind(this));
        }.bind(this));
    }

    /**
     * show the default topbar view
     */
    function _showTopBar() {
        forge.topbar.setTitle(this.options.currentTag);
        forge.topbar.removeButtons(function () {
            forge.topbar.addButton({
                icon: "/img/hamburger.png",
                position: "left"
            }, function () {
                _showTopBarBurger.call(this);
                this._eventOutput.emit("clickBurger");
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

    /**
     * show the settings menu topbar view 
     */
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

    /**
     * configure view event handling
     */
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
