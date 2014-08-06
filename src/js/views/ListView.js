/* globals define */

define(function(require, exports, module) {
    var Surface = require("famous/core/Surface");
    var Transform = require("famous/core/Transform");
    var View = require("famous/core/View");

    var Easing = require("famous/transitions/Easing");
    var TweenTransition = require("famous/transitions/TweenTransition");
    var Transitionable = require("famous/transitions/Transitionable");
    Transitionable.registerMethod("tween", TweenTransition);

    var ContainerSurface = require("famous/surfaces/ContainerSurface");
    var RenderController = require("famous/views/RenderController");
    var Scrollview = require("famous/views/Scrollview");

    function ListView() {
        View.apply(this, arguments);
        _createList.call(this);
    }

    ListView.prototype = Object.create(View.prototype);
    ListView.prototype.constructor = ListView;

    ListView.DEFAULT_OPTIONS = {
        itemHeight: 310
    };

    function _createList() {
        this.surfaces = [];
        this.scrollview = new Scrollview({
            speedLimit: 2.5,
            edgeGrip: 0.05
        });
        this.scrollview.sequenceFrom(this.surfaces);
        this.add(this.scrollview);
    }

    ListView.prototype.addItem = function (content_front, content_rear) {
        var controller = new RenderController({
            inTransition:  { method: "tween", curve: "easeInOut", duration: 750 },
            outTransition: { method: "tween", curve: "easeInOut", duration: 750 },
            overlap: true
        });
        controller.inOriginFrom(function () {
            return [0.5, 0.5];
        });
        controller.outOriginFrom(function () {
            return [0.5, 0.5];
        });
        controller.inTransformFrom(function(progress) {
            return Transform.rotateY(Math.PI + (progress * Math.PI));
        });
        controller.outTransformFrom(function(progress) {
            return Transform.rotateY(Math.PI - (progress * Math.PI));
        });

        var front = new Surface({
            content: content_front
        });
        var rear = new Surface({
            content: content_rear
        });

        front.pipe(this.scrollview);
        rear.pipe(this.scrollview);

        front.on("click", function () {
            controller.show(rear);
        });
        rear.on("click", function () {
            controller.show(front);
        });

        controller.show(front);

        // animate item entrance
        var container = new ContainerSurface({
            size: [window.innerWidth, 0]
        });
        container.context.setPerspective(2000);
        container.add(controller);
        var height = new Transitionable(0);
        container.getSize = function() {
            return [undefined, height.get()];
        };
        front.getSize = function() {
            return [undefined, height.get()];
        };
        rear.getSize = function() {
            return [undefined, height.get()];
        };
        height.set(this.options.itemHeight, {
            duration: 1000,
            curve: Easing.outCirc
        }, function () {
            front.setSize([undefined, this.options.itemHeight]);
            rear.setSize([undefined, this.options.itemHeight]);
            container.setSize([undefined, this.options.itemHeight]);
        }.bind(this));

        this.surfaces.unshift(container);
    };

    module.exports = ListView;
});
