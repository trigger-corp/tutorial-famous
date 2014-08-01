/* globals define */
define(function(require, exports, module) {
    var View = require("famous/core/View");
    var Surface = require("famous/core/Surface");
    var Modifier = require("famous/core/Modifier");
    var SequentialLayout = require("famous/views/SequentialLayout");
    var ContainerSurface = require("famous/surfaces/ContainerSurface");

    function SettingsView() {
        View.apply(this, arguments);

        _createMenu.call(this);
    }
    SettingsView.prototype = Object.create(View.prototype);
    SettingsView.prototype.constructor = SettingsView;
    SettingsView.DEFAULT_OPTIONS = {};

    function _createMenu() {
        this.surfaces = [];
        var sequentialLayout = new SequentialLayout({
            direction: 1
        });
        sequentialLayout.sequenceFrom(this.surfaces);

        var container = new ContainerSurface({
            size: [200, 250],
            properties: {
                //overflow: "hidden",
                //backgroundColor: "white",
                border: "1px solid grey",
                borderRadius: "8px"
            }
        });
        container.add(sequentialLayout);
        this.add(container);

        var self = this;
        [ "Popular", "Kittens", "Puppies", "Parrots", "Sloths" ].forEach(function (item) {
            _createMenuItem.call(self, item);
        });
    }

    function _createMenuItem(tag) {
        var content = "";
        content += "<div class='menu-item'>";
        content += tag;
        content += "</div>";
        var surface = new Surface({
            //size: [150, 40],
            size: [undefined, 50],
            content: content,
            properties: {
                //border: "1px solid green"
                borderBottom: "1px solid grey"
                /*borderBottomLeftRadius: "8px",
                borderBottomRightRadius: "8px"*/
            },
            classes: ["backfaceVisibility"]
        });

        var self = this;
        surface.on("click", function () {
            self._eventOutput.emit("clickTag", tag.toLowerCase());
        });
        this.surfaces.push(surface);
    }

    module.exports = SettingsView;
});

