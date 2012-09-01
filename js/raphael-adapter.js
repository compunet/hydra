/*
 * BGPdeco
 * A BGP and Round-Trip Delay Correlation Tool
 *
 * Copyright (C) 2012 Computer Networks Research Lab, Roma Tre University
 * Contact: squarcel@dia.uniroma3.it
 *
 * This file is part of BGPdeco.
 *
 * BGPdeco is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * BGPdeco is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Adapter for Raphael visualization library.
 *
 * @module raphael-adapter
 */



var Timeline = function() {

    var R, x, y, w, h, cps, probes, events, visible;

    // graphical elements
    var graphics;
    //var timelineFrameRectangle;
    var timelineCursorRectangle;

    var iconGraphics = {};

    var minTimestamp, maxTimestamp, timestampToPixelFactor;

    const defaultRectangleRounding = 10;
    const defaultTimelineFrameXPadding = 40;
    const defaultTimelineFrameYPadding = 20;
    const defaultTimelineEventXPadding = 60;
    const defaultTimelineCursorPadding = 10;
    const defaultTimelineCursorWidth = 50;
    const defaultAnimationTime = 800;


    const timelineFrameRectangleDefaultStyle = {
        "stroke": "rgb(136, 158, 181)",
        "stroke-width": 5,
        "stroke-opacity": 1.0,
        "fill": "rgb(166, 192, 219)"
    };
    const timelineInnerFrameRectangleDefaultStyle = {
        "stroke-opacity": 0,
        "fill": "White",
        "fill-opacity": 0.8
    };
    const timelineCursorRectangleDefaultStyle = {
        "stroke-opacity": 0.8,
        "stroke": "Grey",
        "stroke-width": 3,
        "fill": "Grey",
        "fill-opacity": 0.4
    };

    // icon paths
    const eventIcons = {};
    eventIcons[Event.BGP] = "M21.786,20.654c-0.618-0.195-1.407-0.703-2.291-1.587c-0.757-0.742-1.539-1.698-2.34-2.741c-0.191,0.256-0.382,0.51-0.574,0.77c-0.524,0.709-1.059,1.424-1.604,2.127c1.904,2.31,3.88,4.578,6.809,4.952v2.701l7.556-4.362l-7.556-4.362V20.654zM9.192,11.933c0.756,0.741,1.538,1.697,2.339,2.739c0.195-0.262,0.39-0.521,0.587-0.788c0.52-0.703,1.051-1.412,1.592-2.11c-2.032-2.463-4.133-4.907-7.396-5.025h-3.5v3.5h3.5C6.969,10.223,7.996,10.735,9.192,11.933zM21.786,10.341v2.535l7.556-4.363l-7.556-4.363v2.647c-1.904,0.219-3.425,1.348-4.751,2.644c-2.196,2.183-4.116,5.167-6.011,7.538c-1.867,2.438-3.741,3.888-4.712,3.771h-3.5v3.5h3.5c2.185-0.029,3.879-1.266,5.34-2.693c2.194-2.184,4.116-5.167,6.009-7.538C19.205,12.003,20.746,10.679,21.786,10.341z";
    eventIcons[Event.RTT] = "M27.216,18.533c0-3.636-1.655-6.883-4.253-9.032l0.733-0.998l0.482,0.354c0.198,0.146,0.481,0.104,0.628-0.097l0.442-0.604c0.146-0.198,0.103-0.482-0.097-0.628l-2.052-1.506c-0.199-0.146-0.481-0.103-0.628,0.097L22.03,6.724c-0.146,0.199-0.104,0.482,0.096,0.628l0.483,0.354l-0.736,1.003c-1.28-0.834-2.734-1.419-4.296-1.699c0.847-0.635,1.402-1.638,1.403-2.778h-0.002c0-1.922-1.557-3.48-3.479-3.48c-1.925,0-3.48,1.559-3.48,3.48c0,1.141,0.556,2.144,1.401,2.778c-1.549,0.277-2.99,0.857-4.265,1.68L8.424,7.684l0.484-0.353c0.198-0.145,0.245-0.428,0.098-0.628l-0.44-0.604C8.42,5.899,8.136,5.855,7.937,6.001L5.881,7.5c-0.2,0.146-0.243,0.428-0.099,0.628l0.442,0.604c0.145,0.2,0.428,0.244,0.627,0.099l0.483-0.354l0.729,0.999c-2.615,2.149-4.282,5.407-4.282,9.057c0,6.471,5.245,11.716,11.718,11.716c6.47,0,11.716-5.243,11.718-11.716H27.216zM12.918,4.231c0.002-1.425,1.155-2.58,2.582-2.582c1.426,0.002,2.579,1.157,2.581,2.582c-0.002,1.192-0.812,2.184-1.908,2.482v-1.77h0.6c0.246,0,0.449-0.203,0.449-0.449V3.746c0-0.247-0.203-0.449-0.449-0.449h-2.545c-0.247,0-0.449,0.202-0.449,0.449v0.749c0,0.246,0.202,0.449,0.449,0.449h0.599v1.77C13.729,6.415,12.919,5.424,12.918,4.231zM15.5,27.554c-4.983-0.008-9.015-4.038-9.022-9.021c0.008-4.982,4.039-9.013,9.022-9.022c4.981,0.01,9.013,4.04,9.021,9.022C24.513,23.514,20.481,27.546,15.5,27.554zM15.5,12.138c0.476,0,0.861-0.385,0.861-0.86s-0.386-0.861-0.861-0.861s-0.861,0.386-0.861,0.861S15.024,12.138,15.5,12.138zM15.5,24.927c-0.476,0-0.861,0.386-0.861,0.861s0.386,0.861,0.861,0.861s0.861-0.386,0.861-0.861S15.976,24.927,15.5,24.927zM12.618,11.818c-0.237-0.412-0.764-0.553-1.176-0.315c-0.412,0.238-0.554,0.765-0.315,1.177l2.867,6.722c0.481,0.831,1.543,1.116,2.375,0.637c0.829-0.479,1.114-1.543,0.635-2.374L12.618,11.818zM18.698,24.07c-0.412,0.237-0.555,0.765-0.316,1.176c0.237,0.412,0.764,0.554,1.176,0.315c0.413-0.238,0.553-0.765,0.316-1.176C19.635,23.974,19.108,23.832,18.698,24.07zM8.787,15.65c0.412,0.238,0.938,0.097,1.176-0.315c0.237-0.413,0.097-0.938-0.314-1.176c-0.412-0.239-0.938-0.098-1.177,0.313C8.234,14.886,8.375,15.412,8.787,15.65zM22.215,21.413c-0.412-0.236-0.938-0.096-1.176,0.316c-0.238,0.412-0.099,0.938,0.314,1.176c0.41,0.238,0.937,0.098,1.176-0.314C22.768,22.178,22.625,21.652,22.215,21.413zM9.107,18.531c-0.002-0.476-0.387-0.86-0.861-0.86c-0.477,0-0.862,0.385-0.862,0.86c0.001,0.476,0.386,0.86,0.861,0.861C8.722,19.393,9.106,19.008,9.107,18.531zM21.896,18.531c0,0.477,0.384,0.862,0.859,0.86c0.476,0.002,0.862-0.382,0.862-0.859s-0.387-0.86-0.862-0.862C22.279,17.671,21.896,18.056,21.896,18.531zM8.787,21.413c-0.412,0.238-0.554,0.765-0.316,1.176c0.239,0.412,0.765,0.553,1.177,0.316c0.413-0.239,0.553-0.765,0.315-1.178C9.725,21.317,9.198,21.176,8.787,21.413zM21.352,14.157c-0.411,0.238-0.551,0.764-0.312,1.176c0.237,0.413,0.764,0.555,1.174,0.315c0.412-0.236,0.555-0.762,0.316-1.176C22.29,14.06,21.766,13.921,21.352,14.157zM12.304,24.067c-0.413-0.235-0.939-0.096-1.176,0.315c-0.238,0.413-0.098,0.939,0.312,1.178c0.413,0.236,0.939,0.096,1.178-0.315C12.857,24.832,12.715,24.308,12.304,24.067zM18.698,12.992c0.41,0.238,0.938,0.099,1.174-0.313c0.238-0.411,0.1-0.938-0.314-1.177c-0.414-0.238-0.937-0.097-1.177,0.315C18.144,12.229,18.286,12.755,18.698,12.992z";
    eventIcons[Event.CORRELATION] = "M16.45,18.085l-2.47,2.471c0.054,1.023-0.297,2.062-1.078,2.846c-1.465,1.459-3.837,1.459-5.302-0.002c-1.461-1.465-1.46-3.836-0.001-5.301c0.783-0.781,1.824-1.131,2.847-1.078l2.469-2.469c-2.463-1.057-5.425-0.586-7.438,1.426c-2.634,2.637-2.636,6.907,0,9.545c2.638,2.637,6.909,2.635,9.545,0l0.001,0.002C17.033,23.511,17.506,20.548,16.45,18.085zM14.552,12.915l2.467-2.469c-0.053-1.023,0.297-2.062,1.078-2.848C19.564,6.139,21.934,6.137,23.4,7.6c1.462,1.465,1.462,3.837,0,5.301c-0.783,0.783-1.822,1.132-2.846,1.079l-2.469,2.468c2.463,1.057,5.424,0.584,7.438-1.424c2.634-2.639,2.633-6.91,0-9.546c-2.639-2.636-6.91-2.637-9.545-0.001C13.967,7.489,13.495,10.451,14.552,12.915zM18.152,10.727l-7.424,7.426c-0.585,0.584-0.587,1.535,0,2.121c0.585,0.584,1.536,0.584,2.121-0.002l7.425-7.424c0.584-0.586,0.584-1.535,0-2.121C19.687,10.141,18.736,10.142,18.152,10.727z";

    var previousTimestamp;
    var initGraphics = function() {

        var i, event, icon, iconBbox, iconXTranslation;

        var netWidth = (w - 2 * defaultTimelineEventXPadding);

        var timelineSet = R.set();

        var frameRectangle = R.rect(
            0, 0, w, h, defaultRectangleRounding
        ).attr(timelineFrameRectangleDefaultStyle);

        var innerFrameRectangle = R.rect(
            defaultTimelineFrameXPadding, defaultTimelineFrameYPadding,
            w - 2* defaultTimelineFrameXPadding,
            h - 2 * defaultTimelineFrameYPadding,
            defaultRectangleRounding
        ).attr(timelineInnerFrameRectangleDefaultStyle);


        timelineSet.push(frameRectangle);
        timelineSet.push(innerFrameRectangle);



        // set min, max, timestamp factor
        minTimestamp = events[0].getTimestamp();
        maxTimestamp = events[events.length - 1].getTimestamp();
        timestampToPixelFactor = netWidth / (maxTimestamp - minTimestamp);

        console.log("net width", netWidth, "min timestamp", minTimestamp,
                "max timestamp", maxTimestamp, "factor", timestampToPixelFactor);

        for(i = 0; i < events.length; i++) {


            event = events[i];


            icon = R.path(eventIcons[event.getType()]);

            icon.attr(
                {
                    "fill": "Grey",
                    "stroke": "#444444"
                });

            iconBbox = icon.getBBox();

            iconXTranslation = x + defaultTimelineEventXPadding + (event.getTimestamp() - minTimestamp) * timestampToPixelFactor;


            icon.translate(iconXTranslation - x - iconBbox.width / 2, (h - iconBbox.height) / 2);


            iconGraphics[event.id] = {
                icon: icon,
                xTranslation: iconXTranslation
            };

            timelineSet.push(icon);


        }

        timelineSet.translate(x, y);



        // cursor
        timelineCursorRectangle = R.rect(

            x + defaultTimelineFrameXPadding - defaultTimelineCursorWidth/2,
            y + defaultTimelineCursorPadding,
            defaultTimelineCursorWidth,
            h - 2 * defaultTimelineCursorPadding,
            defaultRectangleRounding

        ).attr(timelineCursorRectangleDefaultStyle);



        graphics = {

        };

    };

    return {

        init: function(params) {

            R = params.canvas;
            x = params.x;
            y = params.y;
            w = params.w;
            h = params.h;
            visible = params.visible;

            cps = params.cps;
            probes = params.probes;
            events = params.events;

            previousTimestamp = events[0].getTimestamp() - 1;

            if(params.visible)
                initGraphics();

        },

        animateCursor: function(event, callback) {

            var timeframe = Math.pow(Math.abs(event.getTimestamp() - previousTimestamp) * defaultAnimationTime * 10, 0.5);


            timeframe = Math.abs(event.getTimestamp() - previousTimestamp) * defaultAnimationTime;


            if(visible) {

                var xTranslation = iconGraphics[event.id].xTranslation - defaultTimelineCursorWidth / 2;

                timelineCursorRectangle.animate({
                    x: xTranslation
                }, timeframe , "linear", callback);

            }
            else {

                setTimeout(callback, timeframe);

            }

            previousTimestamp = event.getTimestamp();

        }


    }

};


/**
 * Canvas responsible for drawings and animations.
 *
 * @class Canvas
 * @static
 */

var Canvas = function() {

    var R, asGraph, cps, mainAS, probes, events;
    var popup;

    var timeline;
    var auxGraphics = {};

    var minRtt = 50, maxRtt = 300;

    const defaultSaturation = 1.0, defaultLightness = 0.45, defaultValue = 1.0;

    // animation
    const animationTimeDefault = 5000;
    const animationPrepareTime = 0.1 * animationTimeDefault;
    const animationMainTime = 0.8 * animationTimeDefault;
    const animationEndTime = 0.1 * animationTimeDefault;


    // styles
    const peeringBackgroundRectangleStyleDefault = {
        "stroke": "#555555",
        fill: "#808080",
        "stroke-dasharray": "- ",
        "stroke-width": 8
    };
    const mainASCircleStyleDefault = {
        stroke: "Grey",
        "stroke-width": 5,
        "stroke-opacity": 0
    };
    const mainASUpperCircleStyleDefault = {
        stroke: "Black",
        fill: "LightGrey",
        "stroke-width": 5,
        "stroke-opacity": 0.6,
        "fill-opacity": 0.25
    };
    const mainASTextStyleDefault = {
        fill: "White",
        stroke: "LightGrey",
        "stroke-opacity": 0.9,
        "fill-opacity": 0.9,
        "font-size": 20
    };
    const probeCloudPathStyleDefault = {
        "fill-opacity": 0,
        "stroke-opacity": 0.5,
        "stroke-width": 80,
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
    };
    const probeCloudPathStyleUnchangedBeginAnimation = {
        "fill-opacity": 0,
        "stroke-opacity": 0.3,
        "stroke-width": 40,
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
    };
    const probeCloudPathStyleChangedBeginAnimation = {
        "fill-opacity": 0,
        "stroke-opacity": 0.8,
        "stroke-width": 120,
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
    };
    const probeTriangleStyleDefault = {
        "stroke-width": 4,
        "stroke-opacity": 1,
        "fill-opacity": 1
    };
    const probeTriangleStyleUnchangedBeginAnimation = {
        "stroke-width": 1,
        "stroke-opacity": 0.6,
        "fill-opacity": 0.6
    };
    const probeTriangleStyleChangedBeginAnimation = {
        "stroke-width": 6
    };
    const asCircleStyleDefault = {
        fill: "#444444",
        stroke: "Black",
        "stroke-width": 0,
        "stroke-opacity": 0
    };
    const asUpperCircleStyleDefault = {
        fill: "#444444",
        stroke: "Black",
        opacity: 0.5,
        "stroke-width": 5,
        "stroke-opacity": 0.6
    };
    const targetASUpperCircleStyleDefault = {
        fill: "Blue",
        stroke: "Black",
        opacity: 0.5,
        "stroke-width": 5,
        "stroke-opacity": 0.6
    };
    const asTextStyleDefault = {
        fill: "White",
        stroke: "White",
        "font-size": 20
    };
    const asLinkStyleDefault = {
        fill: "#444444",
        stroke: "Black",
        "stroke-width": 5,
        "stroke-opacity": 0.2
    };
    const collectorPeerRectStyleDefault = {
        stroke: "Black",
        "stroke-width": 5,
        "stroke-opacity": 0
    };
    const collectorPeerUpperRectStyleDefault = {
        stroke: "Black",
        "stroke-width": 5,
        "stroke-opacity": 0.2,
        "fill-opacity": 0.6
    };
    const collectorPeerTextStyleDefault = {
        fill: "#FFFFFF",
        stroke: "#FFFFFF",
        "font-size": 20
    };
    const asPathLineStyleDefault = {
        "stroke-opacity": 1,
        "stroke-width": 20,
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "fill-opacity": 0
    };
    const asPathStartEndCircleStyleDefault = {
        r: 20,
        "stroke-opacity": 0,
        "fill-opacity": 1
    };
    const asPathLineStyleUnchangedBeginAnimation = {
        "stroke-width": 15,
        "stroke-opacity": 0.5,
        "fill-opacity": 0
    };
    const asPathLineStyleChangedBeginAnimation = {
        "stroke-width": 40,
        "fill-opacity": 0
    };
    const asPathStartEndCircleStyleUnchangedBeginAnimation = {
        r: 15,
        "stroke-opacity": 0,
        "fill-opacity": 0.5
    };
    const asPathStartEndCircleStyleChangedBeginAnimation = {
        r: 40,
        "stroke-opacity": 0
    };



    var animateCursor = function(event, callback) {

        timeline.animateCursor(event, callback);

    }

    var createAnimationCoordinator = function() {

        var coordinator = R.path();
        return coordinator;

    };

    var createASLinkPath = function(as1, as2, width) {

        var c1 = as1.getCenter(),
            c2 = as2.getCenter();

        var left = Geometry.left(Geometry.direction(c1, c2));

        return " M " + (c1.x + left.x * width / 2) + ", " + (c1.y + left.y * width / 2) +
            " L " + (c2.x + left.x * width / 2) + ", " + (c2.y + left.y * width / 2) +
            " L " + (c2.x - left.x * width / 2) + ", " + (c2.y - left.y * width / 2) +
            " L " + (c1.x - left.x * width / 2) + ", " + (c1.y - left.y * width / 2) + " z";

    };

    var createProbeTrianglePath = function(center, radius) {

        return " M " + (center.x - radius) + " " + (center.y - radius) +
            " L " + (center.x + radius) + " " + (center.y - radius) +
            " L " + (center.x) + " " + (center.y + radius) + " z ";

    }


    var initASLinkGraphics = function() {

        var asLink, asLinkID;
        var link;

        // add graphics to AS links
        for(asLinkID in asGraph.getASLinks()) {

            asLink = asGraph.getASLinks()[asLinkID];

            link = R.path(createASLinkPath(
                asLink.getFirstAS(),
                asLink.getSecondAS(),
                asLink.getWidth()
            )).attr(asLinkStyleDefault);

            asLink.setGraphics({
                link: link
            });

        }

    };

    var initPeeringBackground = function() {

        var minX = 100000, minY = 10000000, maxX = 0, maxY = 0;

        var cpID, asID, center, radius;
        // TODO
        for(cpID in cps) {

            center = cps[cpID].getCenter();
            radius = cps[cpID].getRadius();

            minX = Math.min(minX, center.x - radius);
            minY = Math.min(minY, center.y - radius);
            maxX = Math.max(maxX, center.x + radius);
            maxY = Math.max(maxY, center.y + radius);

        }
        for(asID in asGraph.getASes()) {

            if(!asGraph.getASes()[asID].isNeighbour())
                continue;

            center = asGraph.getASes()[asID].getCenter();
            radius = asGraph.getASes()[asID].getRadius();

            minX = Math.min(minX, center.x - radius);
            minY = Math.min(minY, center.y - radius);
            maxX = Math.max(maxX, center.x + radius);
            maxY = Math.max(maxY, center.y + radius);

        }


        var peeringBackgroundRectangle = R.rect(
            minX - 10, minY - 10, (maxX - minX) + 20, (maxY - minY) + 20, 10
        ).attr(peeringBackgroundRectangleStyleDefault);

    };

    var initASGraphics = function() {

        var AS, asID;
        var asCircle, asUpperCircle, asText;

        // add graphics to ASes
        for(asID in asGraph.getASes()) {

            AS = asGraph.getASes()[asID];

            asCircle = R.circle(
                AS.getCenter().x,
                AS.getCenter().y,
                AS.getRadius()
            ).attr(asCircleStyleDefault);

            asUpperCircle = R.circle(
                AS.getCenter().x,
                AS.getCenter().y,
                AS.getRadius()
            ).attr(AS.isTarget() ? targetASUpperCircleStyleDefault : asUpperCircleStyleDefault);

            asText = R.text(
                AS.getCenter().x,
                AS.getCenter().y,
                AS.getName()
            ).attr(
                asTextStyleDefault
            ).attr("font-size", AS.getRadius()*0.8);

            AS.setGraphics({
                circle: asCircle,
                upperCircle: asUpperCircle,
                text: asText
            });

        }

    };

    var initMainASGraphics = function() {

        var center = mainAS.getCenter(),
            radius = mainAS.getRadius();

        var mainASCircle = R.circle(
            center.x,
            center.y,
            radius
        ).attr(
            mainASCircleStyleDefault
        ).attr({
            fill: "url('" + mainAS.getImageURL() + "')"
        });

        var mainASUpperCircle = R.circle(
            center.x,
            center.y,
            radius
        ).attr(
            mainASUpperCircleStyleDefault
        );

        var mainASText = R.text(
            mainAS.getCenter().x,
            mainAS.getCenter().y,
            mainAS.getName()
        ).attr(
            mainASTextStyleDefault
        ).attr("font-size", mainAS.getRadius() * 0.8);

        mainAS.setGraphics({
            circle: mainASCircle,
            upperCircle: mainASUpperCircle,
            text: mainASText
        });

    };

    var initProbeCloudGraphics = function() {

        var cpID, probeID;
        var cloudPaths, probeCloudPath;

        var probeClusters = {};

        // populate probe clusters
        for(cpID in cps) {
            probeClusters[cpID] = [];
        }
        for(probeID in probes) {
            if(probes[probeID].getCollectorPeer())
                probeClusters[probes[probeID].getCollectorPeer().id].push(probes[probeID]);
        }

        // compute cloud paths
        cloudPaths = Animation.initProbeClouds({
            cps: cps,
            clusters: probeClusters
        });

        // draw cloud paths
        for(cpID in cloudPaths) {

            probeCloudPath = R.path(
                cloudPaths[cpID].toSVGPathString()
            ).attr(
                probeCloudPathStyleDefault
            ).attr({
                fill: cps[cpID].getColor(),
                stroke: cps[cpID].getColor()
            });

            cps[cpID].updateGraphics("probeCloudPath", probeCloudPath);

        }

    };

    var initProbeGraphics = function() {

        var probeID;
        var probeTriangle;

        for(probeID in probes) {

            if(probes.hasOwnProperty(probeID)) {

                probeTriangle = R.path(
                    createProbeTrianglePath(probes[probeID].getCenter(), probes[probeID].getRadius())
                ).attr(
                    probeTriangleStyleDefault
                ).attr({
                        "fill": "hsb(" + Utils.computeHSLDecimalHue(probes[probeID].getRtt(), minRtt, maxRtt)
                            + ", " + defaultSaturation + ", " + defaultValue +  ")",
                        "stroke": "hsb(" + Utils.computeHSLDecimalHue(probes[probeID].getRtt(), minRtt, maxRtt)
                            + ", " + defaultSaturation + ", " + (defaultValue/2) +  ")"
                    });
                probeTriangle.number = probes[probeID].getNumber();
                probeTriangle.probeID = probeID;

                probeTriangle.hover(
                    function() {

                        var probeID = this.probeID;

                        var number = probes[probeID].getNumber(),
                            latitude = probes[probeID].getLatitude(),
                            longitude = probes[probeID].getLongitude(),
                            rtt = probes[probeID].getRtt(),
                            ipPrefix = probes[probeID].getIpPrefix();


                        var bbox = this.getBBox();
                        popup.attr({
                            text:
                                "probe id: " + number +
                                    "\nmin rtt: " + rtt +
                                    "\nlatitude: " + latitude +
                                    "\nlongitude: " + longitude +
                                    "\nIP prefix: " + ipPrefix
                        }).update(bbox.x, bbox.y + bbox.height/2, bbox.width).
                            toFront().show();
                        popup.attr({"fill-opacity":0,"stroke-opacity":0});
                        popup.animate({"fill-opacity":1.0,"stroke-opacity":1.0}, 100);

                    },
                    function() {
                        popup.animate({"fill-opacity":0,"stroke-opacity":0}, 100, function(){
                            this.toBack();
                        });
                    }
                );

                probes[probeID].setGraphics({
                    triangle: probeTriangle
                });

            }

        }

    };

    var initCollectorPeerGraphics = function() {

        var cpID, cp;
        var cpRect, upperCpRect, cpText;
        var radius;

        for(cpID in cps) {

            cp = cps[cpID];
            radius = cp.getRadius();

            cpRect = R.rect(
                cp.getCenter().x - radius,
                cp.getCenter().y - radius,
                2 * radius,
                2 * radius,
                10
            ).attr(
                collectorPeerRectStyleDefault
            ).attr(
                "fill", cp.getColor()
            );

            upperCpRect = R.rect(
                cp.getCenter().x - radius,
                cp.getCenter().y - radius,
                2 * radius,
                2 * radius,
                10
            ).attr(
                collectorPeerUpperRectStyleDefault
            ).attr(
                "fill", cp.getColor()
            );

            cpText = R.text(
                cp.getCenter().x,
                cp.getCenter().y,
                cp.getName()
            ).attr(
                collectorPeerTextStyleDefault
            ).attr("font-size", radius * 0.8);

            cp.updateGraphics("rectangle", cpRect);
            cp.updateGraphics("upperRectangle", upperCpRect);
            cp.updateGraphics("text", cpText);

            upperCpRect.cpID = cpID;
            upperCpRect.hover(
                function() {
                    var cp = cps[this.cpID];

                    var ip = cp.getIP(),
                        rtt = cp.getASPath().getRtt();

                    var bbox = this.getBBox();
                    popup.attr({
                        text:
                            "IP: " + ip +
                                "\nmin rtt: " + rtt
                    }).update(bbox.x, bbox.y + bbox.height/2, bbox.width).
                        toFront().show();
                    popup.attr({"fill-opacity":0,"stroke-opacity":0});
                    popup.animate({"fill-opacity":1.0,"stroke-opacity":1.0}, 100);

                },
                function() {
                    popup.animate({"fill-opacity":0,"stroke-opacity":0}, 100, function(){
                        this.toBack();
                    });
                });

        }

    };

    var initASPathGraphics = function() {

        var cpID, cp, asPath, rtt, asArray, i, as;
        var color;
        var asPathLine, asPathStartCircle, asPathEndCircle;

        for(cpID in cps) {

            cp = cps[cpID];

            asPath = cp.getASPath();
            asArray = asPath.getASes();
            rtt = asPath.getRtt();

            color = "hsb(" + Utils.computeHSLDecimalHue(rtt, minRtt, maxRtt)
                + ", " + defaultSaturation + ", " + defaultValue +  ")";

            asPathLine = R.path(
                asPath.getSVGPath().toSVGPathString()
            ).attr(
                asPathLineStyleDefault
            ).attr(
                "stroke", color
            );

            asPathStartCircle = R.circle(
                asPath.getSVGPath().firstPoint().x,
                asPath.getSVGPath().firstPoint().y,
                0
            ).attr(
                asPathStartEndCircleStyleDefault
            ).attr(
                "fill", color
            );

            asPathEndCircle = R.circle(
                asPath.getSVGPath().lastPoint().x,
                asPath.getSVGPath().lastPoint().y,
                0
            ).attr(
                asPathStartEndCircleStyleDefault
            ).attr(
                "fill", color
            );

            cp.getGraphics().upperRectangle.insertAfter(asPathEndCircle);
            cp.getGraphics().text.insertAfter(cp.getGraphics().upperRectangle);

            for(i in asGraph.getASes()) {

                as = asGraph.getASes()[i];

                as.getGraphics().upperCircle.insertAfter(asPathEndCircle);
                as.getGraphics().text.insertAfter(as.getGraphics().upperCircle);

            }



            asPath.setGraphics({
                line: asPathLine,
                startCircle: asPathStartCircle,
                endCircle: asPathEndCircle
            });

        }

    };

    var prepareAnimationForProbes = function(changed) {

        var triangleAnimationParams;
        var probeTriangle;
        var probeID;

        for(probeID in probes) {

            triangleAnimationParams =
                changed[probeID] ?
                    probeTriangleStyleChangedBeginAnimation :
                    probeTriangleStyleUnchangedBeginAnimation;

            probeTriangle = probes[probeID].getGraphics().triangle;

            probeTriangle.animate(
                triangleAnimationParams,
                animationPrepareTime
            );
            if(changed[probeID]) {
                probeTriangle.animate(
                    {path: createProbeTrianglePath(probes[probeID].getCenter(), probes[probeID].getRadius() * 2)},
                    animationPrepareTime
                );
            }

        }

    };

    var prepareAnimationForASPaths = function(changed, paths) {

        var lineAnimationParams, startEndCircleAnimationParams;
        var asPathLine, asPathStartCircle, asPathEndCircle;
        var cp;

        for(cp in cps) {

            lineAnimationParams =
                changed[cp] ?
                    asPathLineStyleChangedBeginAnimation :
                    asPathLineStyleUnchangedBeginAnimation;
            startEndCircleAnimationParams =
                changed[cp] ?
                    asPathStartEndCircleStyleChangedBeginAnimation :
                    asPathStartEndCircleStyleUnchangedBeginAnimation;

            asPathLine = cps[cp].getASPath().getGraphics().line;
            asPathStartCircle = cps[cp].getASPath().getGraphics().startCircle;
            asPathEndCircle = cps[cp].getASPath().getGraphics().endCircle;

            // replace appropriate paths
            if(changed[cp] && paths) {
                asPathLine.attr(
                    "path",
                    paths[cp].modifyInitialPath.toSVGPathString()
                );
            }

            // animate
            asPathLine.animate(
                lineAnimationParams,
                animationPrepareTime
            );
            asPathStartCircle.animate(
                startEndCircleAnimationParams,
                animationPrepareTime
            );
            asPathEndCircle.animate(
                startEndCircleAnimationParams,
                animationPrepareTime
            );

        }

    };

    var endAnimationForProbes= function(changed) {

        var probeID;
        var probeTriangle;

        for(probeID in probes) {

            probeTriangle = probes[probeID].getGraphics().triangle;

            probeTriangle.animate(
                probeTriangleStyleDefault,
                animationEndTime
            );

            if(changed && changed[probeID]) {
                probeTriangle.animate(
                    {path: createProbeTrianglePath(probes[probeID].getCenter(), probes[probeID].getRadius())},
                    animationEndTime
                );
            }

        }

    };

    var endAnimationForASPaths = function(changed, paths) {

        var asPathLine, asPathStartCircle, asPathEndCircle;
        var cpID;

        for(cpID in cps) {

            asPathLine = cps[cpID].getASPath().getGraphics().line;
            asPathStartCircle = cps[cpID].getASPath().getGraphics().startCircle;
            asPathEndCircle = cps[cpID].getASPath().getGraphics().endCircle;

            if(changed && changed[cpID] && paths) {
                asPathLine.attr(
                    "path",
                    paths[cpID].modifyFinalPath.toSVGPathString()
                );
            }

            asPathLine.animate(asPathLineStyleDefault, animationEndTime);
            asPathStartCircle.animate(asPathStartEndCircleStyleDefault, animationEndTime);
            asPathEndCircle.animate(asPathStartEndCircleStyleDefault, animationEndTime);

        }

    };


    var initTimeline = function(params) {

        timeline = new Timeline();
        timeline.init({
            canvas: R,
            cps: cps,
            probes: probes,
            events: events,
            visible: params.withTimeline,
            x: 10,
            y: params.height - params.timelineHeight + 10,
            w: params.width - 10,
            h: params.timelineHeight - 10
        });

    };

    return {

        init: function(params) {

            R = params.canvas;
            asGraph = params.asGraph;
            cps = params.cps;
            mainAS = params.mainAS;
            probes = params.probes;
            events = params.events;

            popup = R.popup(10, 10, "", 5, 30).attr({
                "fill-opacity" : 0,
                "stroke-opacity": 0
            });

            initTimeline(params);

            initPeeringBackground();

            initASLinkGraphics();

            initASGraphics();

            initMainASGraphics();

            initProbeCloudGraphics();

            initCollectorPeerGraphics();

            initProbeGraphics();

            initASPathGraphics();

        },

        adjustRttScale: function(newMinRtt, newMaxRtt) {
            minRtt = newMinRtt;
            maxRtt = newMaxRtt;
        },

        /**
         * Animates the visualization to show the new correlation between Atlas probes
         * and collector peers.
         *
         * @method animateCorrelations
         * @param params {Object}
         *     @param params.changed {Object} a key-value object where keys are collector peer IDs
         *                                    and values are booleans saying whether the correlation
         *                                    changed for the collector peer
         *     @param params.before {Object} a key-value object where keys are collector peer IDs
         *                                   and values are arrays of Probes
         *     @param params.after {Object} a key-value object where keys are collector peer IDs
         *                                   and values are arrays of Probes
         * @param callback {Function} function invoked at the end of the animation
         */
        animateCorrelations: function(params, callback) {


            console.log("animate correlations", params);

            var newProbeClouds = Animation.computeProbeCloudsForCorrelationEvent(params);

            var probeCloudPathStyle;

            callback = callback || function(){}; // replace with empty function if null

            var probeCloudPath, cpID, probeID, probe;

            var coordinator = createAnimationCoordinator();

            // prepare
            coordinator.animate(
                {stroke: "Black"},
                animationPrepareTime,
                // morph
                function() {

                    var newSVGPathString;

                    coordinator.animate(
                        {stroke: "Black"},
                        animationMainTime,
                        // end
                        function() {

                            coordinator.animate(
                                {stroke: "Black"},
                                animationEndTime,
                                function() {
                                    coordinator.remove();
                                    callback();
                                }
                            );

                            // TODO end cloud animation
                            for(cpID in cps) {

                                probeCloudPath = cps[cpID].getGraphics().probeCloudPath;

                                probeCloudPath.attr(
                                    "path", newProbeClouds[cpID].modifyFinalPath.toSVGPathString()
                                );

                                probeCloudPath.animate(
                                    probeCloudPathStyleDefault,
                                    animationEndTime
                                );

                                cps[cpID].setProbeCloud(newProbeClouds[cpID].modifyFinalPath);

                            }
                            for(probeID in probes) {

                                probe = probes[probeID];

                                if(params.probeCPs[probeID] != undefined) {
                                    cpID = params.probeCPs[probeID];
                                    console.log("updating probe", probeID, "cp", params.probeCPs[probeID]);
                                    probe.setCollectorPeer(cps[cpID]);
                                }


                            }



                        }
                    );

                    for(cpID in cps) {

                        probeCloudPath = cps[cpID].getGraphics().probeCloudPath;

                        probeCloudPath.animate({
                            path: newProbeClouds[cpID].animatePath.toSVGPathString()
                        }, animationMainTime, "<>");

                    }

                }
            );

            // TODO prepare cloud animation
            for(cpID in cps) {

                probeCloudPath = cps[cpID].getGraphics().probeCloudPath;

                probeCloudPath.attr(
                    "path", newProbeClouds[cpID].modifyInitialPath.toSVGPathString()
                );

                probeCloudPathStyle =
                    params.changed[cpID] ?
                        probeCloudPathStyleChangedBeginAnimation :
                        probeCloudPathStyleUnchangedBeginAnimation;

                probeCloudPath.animate(
                    probeCloudPathStyle,
                    animationPrepareTime
                );

            }

        },

        animateBGPPaths: function(params, callback) {


            var paths = params.paths,
                changed = params.changed,
                newPathArrays = params.newPathArrays;

            var cpID, asPathLine, asPathStartCircle, asPathEndCircle;

            var coordinator = createAnimationCoordinator();

            callback = callback || function(){}; // replace with empty function if null

            // prepare
            coordinator.animate(
                {stroke: "Black"},
                animationPrepareTime,
                // morph
                function() {

                    var newSVGPathString;

                    coordinator.animate(
                        {stroke: "Black"},
                        animationMainTime,
                        // end
                        function() {

                            coordinator.animate(
                                {stroke: "Black"},
                                animationEndTime,
                                function() {
                                    coordinator.remove();
                                    callback();
                                }
                            );

                            // end all paths
                            endAnimationForASPaths(changed, paths);


                            console.log("now setting up new ases for as paths", newPathArrays);

                            // set new as paths
                            for(cpID in paths) {
                                if(changed[cpID]) {
                                    cps[cpID].getASPath().setASes(newPathArrays[cpID].asPath);
                                }
                                cps[cpID].getASPath().setSVGPath(paths[cpID].modifyFinalPath);
                            }

                        }
                    );

                    // animate all paths
                    for(cpID in paths) {

                        newSVGPathString = paths[cpID].animatePath.toSVGPathString();

                        asPathLine = cps[cpID].getASPath().getGraphics().line;
                        asPathStartCircle = cps[cpID].getASPath().getGraphics().startCircle;
                        asPathEndCircle = cps[cpID].getASPath().getGraphics().endCircle;

                        // animate
                        asPathLine.animate({
                            path: newSVGPathString
                        }, animationMainTime, "<>");
                        asPathStartCircle.animate({
                            cx: paths[cpID].animatePath.firstPoint().x,
                            cy: paths[cpID].animatePath.firstPoint().y
                        }, animationMainTime, "<>");
                        asPathEndCircle.animate({
                            cx: paths[cpID].animatePath.lastPoint().x,
                            cy: paths[cpID].animatePath.lastPoint().y
                        }, animationMainTime, "<>");

                    }

                }
            );

            // prepare all paths
            prepareAnimationForASPaths(changed, paths);


            console.log("who-hoo", params);



        },

        animateRTTs: function(params, callback) {

            var probeRtt = params.probes;
            var cpRtt = params.cps;
            var changed = params.changed;


            var rtt, color, strokeColor;
            var probeID, cpID;
            var probeTriangle;
            var asPathLine, asPathStartCircle, asPathEndCircle;

            callback = callback || function(){}; // replace with empty function if null

            var coordinator = createAnimationCoordinator();

            // prepare
            coordinator.animate(
                {stroke: "Black"},
                animationPrepareTime,
                // change color
                function() {

                    coordinator.animate(
                        {stroke: "Black"},
                        animationMainTime,
                        // end
                        function() {

                            coordinator.animate(
                                {stroke: "Black"},
                                animationEndTime,
                                function() {
                                    coordinator.remove();
                                    callback();
                                }
                            );

                            // end all paths
                            endAnimationForASPaths();

                            // end all probes
                            endAnimationForProbes(changed);

                            // set new RTTs
                            for(cpID in cpRtt) {
                                cps[cpID].getASPath().setRtt(cpRtt[cpID]);
                            }
                            for(probeID in probeRtt) {
                                probes[probeID].setRtt(probeRtt[probeID]);
                            }

                        }
                    );

                    // change color for selected probes
                    for(probeID in probeRtt) {

                        if(changed[probeID]) {

                            probeTriangle = probes[probeID].getGraphics().triangle;

                            rtt = probeRtt[probeID];

                            color = "hsb(" + Utils.computeHSLDecimalHue(rtt, minRtt, maxRtt)
                                + ", " + defaultSaturation + ", " + defaultValue +  ")";

                            strokeColor = "hsb(" + Utils.computeHSLDecimalHue(rtt, minRtt, maxRtt)
                                + ", " + defaultSaturation + ", " + (defaultValue/2) +  ")";

                            probeTriangle.animate({
                                fill: color,
                                stroke: strokeColor
                            }, animationMainTime);

                        }

                    }

                    // change color to selected paths
                    for(cpID in cpRtt) {

                        asPathLine = cps[cpID].getASPath().getGraphics().line;
                        asPathStartCircle = cps[cpID].getASPath().getGraphics().startCircle;
                        asPathEndCircle = cps[cpID].getASPath().getGraphics().endCircle;

                        rtt = cpRtt[cpID];

                        color = "hsb(" + Utils.computeHSLDecimalHue(rtt, minRtt, maxRtt)
                            + ", " + defaultSaturation + ", " + defaultValue +  ")";

                        // animate
                        asPathLine.animate({
                            stroke: color
                        }, animationMainTime, "<>");
                        asPathStartCircle.animate({
                            fill: color
                        }, animationMainTime, "<>");
                        asPathEndCircle.animate({
                            fill: color
                        }, animationMainTime, "<>");

                    }

                }
            );

            // prepare all probes
            prepareAnimationForProbes(changed);

            // prepare all paths
            prepareAnimationForASPaths(changed);


        },

        moveCursor: function(event, callback) {

            animateCursor(event, callback);

        }

    };

}();