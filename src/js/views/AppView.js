/* globals define, forge */
define(function(require, exports, module) {
    var Modifier = require("famous/core/Modifier");
    var Transform = require("famous/core/Transform");
    var View = require("famous/core/View");
    var ContainerSurface = require("famous/surfaces/ContainerSurface");

    var NativeView = require("views/NativeView");
    var ListView = require("views/ListView");
    var SettingsView = require("views/SettingsView");
    var Templates = require("views/Templates");

    function AppView() {
        View.apply(this, arguments);

        _createNativeView.call(this);
        _createSettingsView.call(this);
        _createListContainerView.call(this);
        _createEvents.call(this);

        this.onClickRefresh();
    }
    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    AppView.DEFAULT_OPTIONS = {
        openPosition: 276,
        transition: {
            duration: 400,
            curve: "easeInOut"
        },
        currentTag: "Popular"
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

    function _createListContainerView() {
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

    function _createEvents () {
        var self = this;
        this._eventInput.on("clickBurger", function () {
            self.toggleMainView();
        });
        this._eventInput.on("clickDone", function () {
            self.toggleMainView();
        });
        this._eventInput.on("clickRefresh", function () {
            self.onClickRefresh();
        });
        this._eventInput.on("clickCamera", function () {
            self.onClickCamera();
        });
        this._eventInput.on("clickTag", function (tag) {
            self.options.currentTag = tag;
            self.onClickRefresh();
            self.nativeView.trigger("clickDone", tag);
        });

        // none of this works!?!
        //this.add(this.nativeView);
        //this._eventInput.pipe(this.nativeView);
        //this.nativeView.pipe(this);
        //this.nativeView.subscribe(this);
    }

    AppView.prototype.toggleMainView = function () {
        if (this._toggle) {
            this.listModifier.setTransform(Transform.translate(0, 0, 1.0),
                                           this.options.transition);
        } else {
            this.listModifier.setTransform(Transform.translate(this.options.openPosition, 0, 1.0),
                                           this.options.transition);
        }
        this._toggle = !this._toggle;
        return this._toggle;
    };

    AppView.prototype.onClickRefresh = function () {
        var client_id = "e8f3e3e90a0d466484df7fac556c51da";
        var tag = this.options.currentTag.toLowerCase();
        var url;
        if (tag === "popular") {
            url = "https://api.instagram.com/v1/media/popular";
        } else {
            url = "https://api.instagram.com/v1/tags/" + tag + "/media/recent";
        }
        var self = this;
        forge.request.ajax({
            url: url + "?client_id=" + client_id,
            dataType: "json"
        }, function (response) {
            response.data.forEach(function (item) {
                self.listView.addItem(Templates.front(item),
                                      Templates.rear(item));
            });
        }, function (error) {
            console.error("Request failed: " + JSON.stringify(error));
        });
    };

    AppView.prototype.onClickCamera = function () {
        var self = this;
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
                self.listView.addItem(Templates.front(item),
                                      Templates.rear(item));
            });
        });
    };

    module.exports = AppView;
});
