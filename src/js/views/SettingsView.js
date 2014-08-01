/* globals define */
define(function(require, exports, module) {
    var View = require("famous/core/View");
    var Surface = require("famous/core/Surface");
    var Modifier = require("famous/core/Modifier");
    var Transform = require("famous/core/Transform");
    var ContainerSurface = require("famous/surfaces/ContainerSurface");
    var SequentialLayout = require("famous/views/SequentialLayout");

    //var MouseSync = require("famous/inputs/MouseSync");
    //var TouchSync = require("famous/inputs/TouchSync");
    var GenericSync = require("famous/inputs/GenericSync");

    function SettingsView() {
        View.apply(this, arguments);

        this.surfaces = [];
        var sequentialLayout = new SequentialLayout({
            direction: 1
        });
        sequentialLayout.sequenceFrom(this.surfaces);
        this.add(sequentialLayout);

        var self = this;
        _createMenuHeader.call(this, "Tags");
        [ "Popular", "Kittens", "Puppies", "Parrots", "Sloths" ].forEach(function (item) {
            _createMenuItem.call(self, item, false);
        });
        _createMenuItem.call(self, "Olinguito", true);
        _createMenuFooter.call(this);
    }
    SettingsView.prototype = Object.create(View.prototype);
    SettingsView.prototype.constructor = SettingsView;
    SettingsView.DEFAULT_OPTIONS = {
        itemHeight: 45
    };

    function _createMenuHeader(text) {
        var surface = new Surface({
            content: text,
            size: [undefined, this.options.itemHeight + 4],
            properties: {
                overflow: "hidden",
                lineHeight: this.options.itemHeight + "px",
                background: "rgb(239, 239, 245)",
                borderTop: "1px solid rgb(200, 199, 204)",
                borderBottom: "1px solid rgb(200, 199, 204)",
                color: "rgb(119, 119, 119)",
                fontWeight: "bold",
                paddingLeft: "15px",
                textTransform: "uppercase",
                paddingTop: "12px"
            }
        });
        this.surfaces.push(surface);
    }

    function _createMenuFooter() {
        var surface = new Surface({
            properties: {
                background: "rgb(239, 239, 245)",
                borderTop: "1px solid rgb(200, 199, 204)",
                color: "rgb(119, 119, 119)"
            }
        });
        this.surfaces.push(surface);
    }

    function _createMenuItem(tag, last) {
        var container = new ContainerSurface({
            size: [undefined, this.options.itemHeight]
        });
        
        var background = new Surface({
            size: [undefined, this.options.itemHeight],
            properties: {
                background: "white",
                padding: "0px",
                margin: "0px",
                overflow: "hidden",
                lineHeight: this.options.itemHeight + "px"
            }
        });
        container.add(background);

        var surface = new Surface({
            content: "<div class='right-arrow'>" + tag + "</div>",
            size: [undefined, this.options.itemHeight],
            properties: {
                overflow: "hidden",
                lineHeight: this.options.itemHeight + "px",
                borderBottom: last ? "0px" : "1px solid rgb(200, 199, 204)",
                fontWeight: "normal",
                padding: "0px",
                margin: "0px"
            }
        });
        var modifier = new Modifier({
            transform: Transform.translate(15, 0, 0)
        });
        container.add(modifier).add(surface);
        this.surfaces.push(container);

        var self = this;
        var sync = new GenericSync({
            "mouse"  : {},
            "touch"  : {}
        });
        sync.on("start", function () {
            background.setProperties({
                background: "rgb(217, 217, 221)"
            });
        });
        sync.on("end", function () {
            background.setProperties({
                background: "white"
            });
            self._eventOutput.emit("clickTag", tag);
        });
        surface.pipe(sync);
    }

    module.exports = SettingsView;
});

