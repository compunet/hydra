/*
 * Hydra
 * A BGP and Round-Trip Delay Correlation Tool
 *
 * Copyright (C) 2012 Computer Networks Research Lab, Roma Tre University
 * Contact: squarcel@dia.uniroma3.it
 *
 * This file is part of Hydra.
 *
 * Hydra is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Hydra is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var Canvas = function() {

    const minRtt = 50, maxRtt = 300;

    // styles
    const asCircleStyleDefault = {
        fill: "Grey",
        stroke: "Black",
        strokeWidth: 0,
        strokeOpacity: 0
    };
    const asUpperCircleStyleDefault = {
        fill: "Grey",
        stroke: "Black",
        opacity: 0.6,
        strokeWidth: 5,
        strokeOpacity: 1.0
    };
    const targetASUpperCircleStyleDefault = {
        fill: "Red",
        stroke: "Black",
        opacity: 0.6,
        strokeWidth: 5
    };
    const asTextStyleDefault = {
        fill: "White",
        stroke: "White",
        fontSize: 20
    };
    const asLinkStyleDefault = {
        fill: "Grey",
        stroke: "Black",
        strokeWidth: 5,
        strokeOpacity: 0.2
    };
    const collectorPeerCircleStyleDefault = {
        fill: "Pink",
        stroke: "Black",
        strokeWidth: 5,
        strokeOpacity: 0.2
    };
    const asPathLineStyleDefault = {
        strokeWidth: 10,
        strokeLineCap: "round",
        fill: "none"
    };

    var svg;
    var asGraph;
    var cps;

    var createASLinkPolygon = function(as1, as2, width) {

        var c1 = as1.getCenter(),
            c2 = as2.getCenter();

        var left = Geometry.left(Geometry.direction(c1, c2));

        var asLinkPolygon = [
            [ // left of first center
                c1.x + left.x * width/2,
                c1.y + left.y * width/2
            ],
            [ // left of second center
                c2.x + left.x * width/2,
                c2.y + left.y * width/2
            ],
            [ // right of second center
                c2.x - left.x * width/2,
                c2.y - left.y * width/2
            ],
            [ // right of first center
                c1.x - left.x * width/2,
                c1.y - left.y * width/2
            ]
        ];

        return asLinkPolygon;

    };

    var initASLinkGraphics = function() {

        var asLink, asLinkID;
        var link;

        // add graphics to AS links
        for(asLinkID in asGraph.getASLinks()) {

            asLink = asGraph.getASLinks()[asLinkID];

            link = svg.polygon(
                createASLinkPolygon(
                    asLink.getFirstAS(),
                    asLink.getSecondAS(),
                    asLink.getWidth()),
                asLinkStyleDefault);

            asLink.setGraphics({
                link: link
            });

        }

    };

    var initASGraphics = function() {

        var AS, asID;
        var asCircle, asUpperCircle, asText, asTextBBox;

        // add graphics to ASes
        for(asID in asGraph.getASes()) {

            AS = asGraph.getASes()[asID];

            asCircle = svg.circle(
                AS.getCenter().x,
                AS.getCenter().y,
                AS.getRadius(),
                asCircleStyleDefault
            );

            asUpperCircle = svg.circle(
                AS.getCenter().x,
                AS.getCenter().y,
                AS.getRadius(),
                AS.isTarget()? targetASUpperCircleStyleDefault : asUpperCircleStyleDefault
            );

            asText = svg.text(
                AS.getCenter().x,
                AS.getCenter().y,
                AS.getName(),
                asTextStyleDefault
            );
            $(asText).attr({
                "font-size": AS.getRadius()*0.8
            });

            asTextBBox = asText.getBoundingClientRect();
            $(asText).attr({
                transform: "translate(-" + asTextBBox.width/2 + "," + asTextBBox.height*7/20 + ")"
            });

            AS.setGraphics({
                circle: asCircle,
                upperCircle: asUpperCircle,
                text: asText
            });

        }

    };

    var initCollectorPeerGraphics = function() {

        var cpID, cp;
        var cpCircle;

        for(cpID in cps) {

            cp = cps[cpID];

            cpCircle = svg.circle(
                cp.getCenter().x,
                cp.getCenter().y,
                cp.getRadius(),
                collectorPeerCircleStyleDefault
            );

            cp.setGraphics({
                circle: cpCircle
            });

        }

    };

    var initASPathGraphics = function() {

        var cpID, asPath, rtt, asArray, i, as;
        var asPathLine, asPathObject;

        for(cpID in cps) {

            asPath = cps[cpID].getASPath();
            asArray = asPath.getASes();
            rtt = asPath.getRtt();

            asPathLine = svg.createPath();
            asPath.getSVGPath().popupate(asPathLine);

            asPathObject = svg.path(asPathLine,
                asPathLineStyleDefault);
            $(asPathObject).attr({
                stroke: Utils.computeHSLColor(rtt, minRtt, maxRtt)
            });

            for(i = 0; i < asArray.length; i++) {

                as = asArray[i];

                $(as.getGraphics().upperCircle).insertAfter(asPathObject);
                $(as.getGraphics().text).insertAfter(as.getGraphics().upperCircle);
                //$(asPathObject).insertBefore(as.getGraphics().upperCircle);

            }

            console.log(asPathLine, asPathObject);

        }

    };

    return {

        init: function(params) {

            svg = params.canvas;
            asGraph = params.asGraph;
            cps = params.cps;

            initASLinkGraphics();

            initASGraphics();

            initCollectorPeerGraphics();

            initASPathGraphics();

            // TODO add final graphics

        }

    };

}();