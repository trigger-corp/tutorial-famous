/* globals define, forge */
define(function(require, exports, module) {
    var Modifier = require("famous/core/Modifier");
    var Transform = require("famous/core/Transform");
    var View = require("famous/core/View");
    var ContainerSurface = require("famous/surfaces/ContainerSurface");

    var Templates = require("Templates");
    var NativeView = require("views/NativeView");
    var ListView = require("views/ListView");
    var SettingsView = require("views/SettingsView");

    function AppView() {
        View.apply(this, arguments);

        _createNativeView.call(this);
        _createSettingsView.call(this);
        _createListView.call(this);

        _createEvents.call(this);

        this.trigger("clickRefresh");
    }
    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    AppView.DEFAULT_OPTIONS = {
        currentTag: "Popular",
        openPosition: 276,
        transition: {
            duration: 400,
            curve: "easeInOut"
        }
    };

    function _createNativeView() {
        this.nativeView = new NativeView();
        this.subscribe(this.nativeView);
    }

    function _createSettingsView() {
        this.settingsContainer = new ContainerSurface({
            properties: {
                overflow: "hidden",
                backgroundColor: "white"
            }
        });
        this.settingsView = new SettingsView();
        this.subscribe(this.settingsView);
        this.settingsContainer.add(this.settingsView);
        this.add(this.settingsContainer);
    }

    function _createListView() {
        this.listContainer = new ContainerSurface({
            properties: {
                backgroundColor: "#f4f4f4",
                boxShadow: "0 0 20px rgba(0, 0, 0, 0.5)"
            }
        });
        this.listContainer.context.setPerspective(2000);
        this.listModifier = new Modifier({
            transform: Transform.translate(0, 0, 0.1)
        });
        this.listView = new ListView();
        this.listContainer.add(this.listView);
        this.add(this.listModifier).add(this.listContainer);
    }

    function _createEvents() {
        this._eventInput.on("clickBurger", function () {
            _toggleMainView.call(this);
        }.bind(this));
        this._eventInput.on("clickDone", function () {
            _toggleMainView.call(this);
        }.bind(this));
        this._eventInput.on("clickRefresh", function () {
            _refreshListView.call(this);
        }.bind(this));
        this._eventInput.on("clickCamera", function () {
            _takePhotograph.call(this);
        }.bind(this));
        this._eventInput.on("clickTag", function (tag) {
            this.options.currentTag = tag;
            _refreshListView.call(this);
            this.nativeView.trigger("clickDone", tag);
        }.bind(this));
    }

    function _toggleMainView() {
        if (this._toggle) {
            this.listModifier.setTransform(Transform.translate(0, 0, 1.0),
                                           this.options.transition);
        } else {
            this.listModifier.setTransform(Transform.translate(this.options.openPosition, 0, 1.0),
                                           this.options.transition);
        }
        this._toggle = !this._toggle;
        return this._toggle;
    }

    function _refreshListView() {
        var client_id = "e8f3e3e90a0d466484df7fac556c51da";
        var tag = this.options.currentTag.toLowerCase();
        var url;
        if (tag === "popular") {
            url = "https://api.instagram.com/v1/media/popular";
        } else {
            url = "https://api.instagram.com/v1/tags/" + tag + "/media/recent";
        }
        forge.request.ajax({
            url: url + "?client_id=" + client_id,
            dataType: "json"
        }, function (response) {
            response.data.forEach(function (item) {
                this.listView.addItem(Templates.front(item),
                                      Templates.rear(item));
            }.bind(this));
        }.bind(this), function (error) {
            console.error("Request failed: " + JSON.stringify(error));
        });
    }

    function _takePhotograph() {
        forge.file.getImage({
            width: 290,
            source: "camera",
            saveLocation: "file"
        }, function (file) {
            forge.file.URL(file, function (url) {
                var item = {
                    user:    { profile_picture: "img/forge-logo.png",
                               full_name: "Forge" },
                    images:  { low_resolution: { url: url } },
                    caption: { text: "Made with @befamous and @triggercorp" },
                    comments: { data: [
                        { from: { full_name: "antoinevg"  }, text: "feeling excited about #hybrid apps yet?" }
                    ] }
                };
                this.listView.addItem(Templates.front(item),
                                      Templates.rear(item));
            }.bind(this));
        }.bind(this));
    }

    module.exports = AppView;
});
