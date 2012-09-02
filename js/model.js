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
 * Contains the main classes of the domain model.
 *
 * @module model
 */


// used to assign unique IDs to objects of the model
var idCounter = 0;


/**
 * Represents a point in two-dimensional space.
 *
 * @class Point
 * @constructor
 * @param {Number} x x-coordinate
 * @param {Number} y y-coordinate
 */
function Point(x, y) {
    return{
        /**
         * X-coordinate.
         *
         * @property {Number} x
         */
        x: x,

        /**
         * Y-coordinate.
         *
         * @property {Number} y
         */
        y: y
    }
}


/**
 * A generic graphical element.
 *
 * @class GraphicalElement
 * @constructor
 */
function GraphicalElement() {

    var graphics = {};

    /**
     * Returns the graphics associated with this graphical element.
     *
     * @method getGraphics
     * @return {Object} graphics
     */
    this.getGraphics = function() {
        return graphics;
    };

    /**
     * Associates new graphics with this graphical element.
     *
     * @method setGraphics
     * @param {Object} newGraphics the new graphis
     */
    this.setGraphics = function(newGraphics) {
        graphics = newGraphics;
    };

    /**
     * Updates graphics with a new component.
     *
     * @method updateGraphics
     * @param {String} key the key of the new graphical component
     * @param {Object} value the new graphical component
     */
    this.updateGraphics = function(key, value) {
        graphics[key] = value;
    }

}


/**
 * A graphical element with a center and a radius.
 *
 * @class GraphicalBody
 * @constructor
 * @extends GraphicalElement
 */
function GraphicalBody(params) {

    // superclass
    GraphicalElement.apply(this);

    var center = params.center || new Point(0, 0);
    var radius = params.radius || -1;

    /**
     * Returns the radius.
     *
     * @method getRadius
     * @return {Number} radius
     */
    this.getRadius = function(){
        return radius;
    };

    /**
     * Updates the radius.
     *
     * @method setRadius
     * @param {Number} newRadius the new value for the radius
     */
    this.setRadius = function(newRadius) {
        radius = newRadius;
    };

    /**
     * Updates the center.
     *
     * @method setCenter
     * @param {Point} newCenter the new value for the center
     */
    this.setCenter = function(newCenter) {
        center = newCenter;
    };

    /**
     * Returns the center.
     *
     * @method getCenter
     * @return {Point} center
     */
    this.getCenter = function(){
        return center;
    };

}


/**
 * Contains data about an Autonomous System and its visual representation (a circle).
 *
 * @class AS
 * @constructor
 * @param {Object} params
 *   @param {String} params.name the name of the Autonomous System
 *   @param {Integer} params.number the Autonomous System number
 *   @param {Point} params.center the center of the circle
 *   @param {Number} params.radius the radius of the circle
 *   @param {Boolean} [params.target] whether this Autonomous System represents a target (defaults to false)
 *   @param {Boolean} [params.neighbour] whether this Autonomous System is a direct neighbour of the main AS (defaults to false)
 * @extends GraphicalBody
 */
function AS(params){

    // superclass
    GraphicalBody.apply(this, arguments);

    var name = params.name || "";
    var number = params.number || -1;
    var target = params.target || false;
    var neighbour = params.neighbour || false;

    /**
     * UID
     *
     * @property id
     */
    this.id = idCounter++;

    /**
     * Returns the name of this AS.
     *
     * @method getName
     * @return {String} name of this AS
     */
    this.getName = function(){
        return name;
    };

    /**
     * Returns the AS number.
     *
     * @method getNumber
     * @return {Integer} AS number
     */
    this.getNumber = function() {
        return number;
    };

    /**
     * Checks if this AS is a target in the current visualization.
     *
     * @method isTarget
     * @return {Boolean} true if this AS is a target, false otherwise
     */
    this.isTarget = function() {
        return target;
    };

    /**
     * Checks if this AS is a neighbour of the current AS.
     *
     * @method isNeighbour
     * @return {Boolean} true if this AS is a neighbour, false otherwise
     */
    this.isNeighbour = function() {
        return neighbour;
    };

}


/**
 * Represents the source Autonomous System in the visualization,
 * i.e. the one containing both Atlas probes and collector peers.
 * It is represented as a geographical map.
 *
 * @class MainAS
 * @constructor
 * @param {Object} params
 *   @param {String} params.name the name of the Autonomous System
 *   @param {Integer} params.number the Autonomous System number
 *   @param {Point} params.center the center of the circle
 *   @param {Number} params.radius the radius of the circle
 *   @param {String} params.imageURL the URL of the background image
 * @extends AS
 */
function MainAS(params) {

    AS.apply(this, arguments);

    var imageURL = params.imageURL || null;

    /**
     * UID
     *
     * @property id
     */
    this.id = idCounter++;

    /**
     * Returns the URL of the background image.
     *
     * @method getImageURL
     * @return {String} URL of the background image
     */
    this.getImageURL = function() {
        return imageURL;
    };

}


/**
 * A link between two Autonomous System, represented as a rectangle bridging the two respective circles.
 *
 * @class ASLink
 * @constructor
 * @param {Object} params
 *   @param {AS} params.from first Autonomous System
 *   @param {AS} params.to second Autonomous System
 *   @param {Number} params.width width of the rectangle
 * @extends GraphicalElement
 */
function ASLink(params){

    GraphicalElement.apply(this);

    var as1 = params.from || undefined;
    var as2 = params.to || undefined;
    var width = params.width || 0;
    var sectorWidth = params.sectorWidth || width * 2/3;
    var p1, p2, direction, left, length;
    if(as1 && as2) {
        p1 = as1.getCenter();
        p2 = as2.getCenter();
        length = Geometry.pointDistance(p1, p2);
        direction = Geometry.direction(p1, p2, length);
        left = Geometry.left(direction);
    }


    /**
     * UID
     *
     * @property id
     */
    this.id = Utils.getConcatOrderedIDs(as1.id, as2.id);

    /**
     * Returns the width of this link.
     *
     * @method getWidth
     * @return {Number} the width of this link
     */
    this.getWidth = function() {
        return width;
    };

    /**
     * Updates the width of this link.
     *
     * @method setWidth
     * @param {Number} newWidth the new width of this link
     */
    this.setWidth = function(newWidth) {
        width = newWidth;
    };

    /**
     * Returns the sector width, i.e. the portion of width of this link that can be filled with AS-paths.
     *
     * @method getSectorWidth
     * @return {Number} the sector width of this link
     */
    this.getSectorWidth = function() {
        return sectorWidth;
    };

    /**
     * Updates the sector width.
     *
     * @method setSectorWidth
     * @param {Number} newSectorWidth the new sector width of this link
     */
    this.setSectorWidth = function(newSectorWidth) {
        sectorWidth = newSectorWidth;
    };

    /**
     * Returns the first AS of this link.
     *
     * @method getFirstAS
     * @return {AS} the first AS
     */
    this.getFirstAS = function() {
        return as1;
    };

    /**
     * Returns the second AS of this link.
     *
     * @method getSecondAS
     * @return {AS} the second AS
     */
    this.getSecondAS = function() {
        return as2;
    };

    /**
     * Returns the length of this link.
     *
     * @method getLength
     * @return {Number} the length of this link
     */
    this.getLength = function() {
        return length;
    };

    /**
     * Returns the direction, i.e. a unit vector representing the direction from the first to the second AS.
     *
     * @method getDirection
     * @return {Point} the direction of this link
     */
    this.getDirection = function() {
        return direction;
    };

    /**
     * Returns the left direction of this link, i.e. the unit vector obtained rotating the original direction
     * by 90 degrees to the left.
     *
     * @method getLeftDirection
     * @return {Point} the left direction of this link
     */
    this.getLeftDirection = function() {
        return left;
    };

}


/**
 * A graph composed of Autonomous Systems and links between pairs of them.
 *
 * @class ASGraph
 * @constructor
 */
function ASGraph(){

    var ASes = {};
    var ASLinks = {};

    return {

        /**
         * Returns a key-value map where keys are AS IDs and values are ASes.
         * @method getASes
         * @return {Object} a key-value AS map
         */
        getASes: function(){
            return ASes;
        },

        /**
         * Returns the AS with this ID.
         * @method getAS
         * @param {String} asID the ID of the AS
         * @return {AS} the AS, or undefined if it does not exist
         */
        getAS: function(asID) {
            return ASes[asID];
        },

        /**
         * Returns a key-value map where keys are ASLink IDs and values are ASLinks.
         * @method getASLinks
         * @return {Object} a key-value ASLink map
         */
        getASLinks: function(){
            return ASLinks;
        },

        /**
         * Returns the ASLink connecting the two input ASes.
         * @method getASLink
         * @param {AS} as1 the first AS
         * @param {AS} as2 the second AS
         * @return {ASLink} the link between the two ASes
         */
        getASLink: function(as1, as2){
            return ASLinks[Utils.getConcatOrderedIDs(as1.id, as2.id)];
        },

        /**
         * Adds an AS to the graph and returns the updated AS map.
         * @method addAS
         * @param {AS} as the AS
         * @return {Object} the updated AS map
         */
        addAS: function(as){
            ASes[as.id] = as;
            return ASes;
        },

        /**
         * Adds an ASLink to the graph and returns the updated ASLink map.
         * @method addASLink
         * @param {ASLink} aslink the ASLink
         * @return {Object} the updated ASLink map
         */
        addASLink: function(aslink){
            ASLinks[aslink.id] = aslink;
            return ASLinks;
        }

    };
}


/**
 * An AS-path from a source AS to a target AS.
 * It is represented with a curve that traverses the AS graph.
 *
 * @class ASPath
 * @constructor
 * @param {Object} params
 *   @param {Array} params.asArray the array of ASes composing the path
 *   @param {Number} params.rtt the round-trip time associated with the AS-path
 *   @param {SVGPath} params.svgPath the SVGPath representing the curve
 * @extends GraphicalElement
 */
function ASPath(params){  // Observe ASes must be an Array

    // superclass
    GraphicalElement.apply(this);

    var asArray = params.asArray || [];
    var rtt = params.rtt || -1;
    var svgPath = params.svgPath || null;

    /**
     * UID
     *
     * @property id
     */
    this.id = idCounter++;

    /**
     * Returns the round-trip delay associated with this AS-path.
     *
     * @method getRtt
     * @return {Number} the round-trip delay
     */
    this.getRtt = function(){
        return rtt;
    };

    /**
     * Associates a new round-trip delay with this AS-path.
     *
     * @method setRtt
     * @param {Number} newRtt the new round-trip delay
     */
    this.setRtt = function(newRtt){
        rtt = newRtt;
    };

    /**
     * Returns the array of ASes that compose the path.
     *
     * @method getASes
     * @return {Array} the AS array
     */
    this.getASes = function(){
        return asArray;
    };

    /**
     * Associates a new array of ASes with the path.
     *
     * @method setASes
     * @param {Array} newASes the new AS array
     */
    this.setASes = function(newASes){
        asArray = newASes;
    };

    /**
     * Returns the length of the AS-path.
     *
     * @method getLength
     * @return {Number} the length
     */
    this.getLength = function() {
        return asArray.length;
    };

    /**
     * Returns the SVG path associated with this AS-path.
     *
     * @method getSVGPath
     * @return {SVGPath} the SVG path
     */
    this.getSVGPath = function() {
        return svgPath;
    };

    /**
     * Associates a new SVG path with this AS-path.
     *
     * @method setSVGPath
     * @param {SVGPath} newSVGPath the new SVG path
     */
    this.setSVGPath = function(newSVGPath) {
        svgPath = newSVGPath;
    };

}

/**
 * An Atlas probe belonging to the source AS.
 * It is represented with a shape (circle or triangle) on the geographical map.
 *
 * @class Probe
 * @constructor
 * @param {Object} params
 *   @param {Integer} params.number the number of the probe
 *   @param {Point} params.center the center of the circle
 *   @param {Number} params.radius the radius of the circle
 *   @param {Number} params.number the round-trip time measured by this probe
 *   @param {Number} params.latitude the latitude
 *   @param {Number} params.longitude the longitude
 *   @param {String} params.ipPrefix the IP prefix of the probe
 *   @param {CollectorPeer} params.cp the collector peer that routes traffic
 *                                    originating from this probe (if any)
 */
function Probe(params) {
    var id = idCounter++;
    var latitude = params.latitude || -1;
    var longitude = params.longitude || -1;
    var ipPrefix = params.ipPrefix || -1;
    var number = params.number || -1;
    var center = params.center || {x: 0, y: 0};
    var radius = params.radius || 0;
    var rtt = params.rtt || -1;
    var cp = params.cp || null;
    var graphics;
    return {
        id: id,
        getNumber: function() {
            return number;
        },
        getRadius: function(){ // returns a number
            return radius;
        },
        getCenter: function(){ // returns an object as {x:10,y:20};
            return center;
        },
        getLatitude: function() {
            return latitude;
        },
        getLongitude: function() {
            return longitude;
        },
        getIpPrefix: function() {
            return ipPrefix;
        },
        setRadius: function(newRadius) {
            radius = newRadius;
        },

        setCenter: function(newCenter) {
            center = newCenter;
        },

        getRtt: function() { // number
            return rtt;
        },
        setRtt: function(newRtt) {
            rtt = newRtt;
        },
        getCollectorPeer: function() {
            return cp;
        },
        setCollectorPeer: function(newCp) {
            cp = newCp;
        },
        getGraphics: function() {
            return graphics;
        },
        setGraphics: function(newGraphics) {
            graphics = newGraphics;
        }
    };
}

/**
 * A collector peer belonging to the source AS.
 * It is represented as a circle.
 *
 * @class CollectorPeer
 * @constructor
 * @param {Object} params
 *   @param {String} params.ip the IP address
 *   @param {Integer} params.asNumber the number of the AS containing this collector peer
 *   @param {String} params.rrc the id of the route collector peering with this collector peer
 *   @param {Point} params.center the center of the circle
 *   @param {Number} params.radius the radius of the circle
 *   @param {String} params.color the color identifying the collector peer
 *   @param {ASPath} params.asPath the AS-path announced by the collector peer
 *   @param {SVGPath} params.probeCloud the SVGPath containing the set of probes
 *                                      whose traffic goes through this collector peer (if any)
 */
function CollectorPeer(params) {
    var id = idCounter++;
    var ip = params.ip || "";
    var asNumber = params.asNumber || -1;
    var rrc = params.rrc || "";
    var name = params.name || "";
    var center = params.center || {x: 0, y: 0};
    var radius = params.radius || 0;
    var color = params.color || "Green";
    var asPath = params.asPath || null;
    var probeCloud = params.probeCloud || null;
    var graphics = {};
    return {
        id: id,
        getIP: function() { // string
            return ip;
        },
        getASNumber: function() { // as number (string)
            return asNumber;
        },
        getRRC: function() {
            return rrc;
        },
        getRadius: function(){ // returns a number
            return radius;
        },
        getCenter: function(){ // returns an object as {x:10,y:20};
            return center;
        },
        getName: function () {
            return name;
        },
        setRadius: function(newRadius) {
            radius = newRadius;
        },

        setCenter: function(newCenter) {
            center = newCenter;
        },

        getColor: function() {
            return color;
        },
        getProbeCloud: function() {
            return probeCloud;
        },
        setProbeCloud: function(newProbeCloud) {
            probeCloud = newProbeCloud;
        },
        getASPath: function() { // ASPath
            return asPath;
        },
        setASPath: function(newASPath) {
            asPath = newASPath;
        },
        getGraphics: function() {
            return graphics;
        },
        setGraphics: function(newGraphics) {
            graphics = newGraphics;
        },
        updateGraphics: function(key, value) {
            graphics[key] = value;
            console.log("update graphics", graphics);
        }
    };
}

/**
 * An abstraction for an SVG path.
 *
 * @class SVGPath
 * @constructor
 */
function SVGPath() {

    var points = [];
    var path = [];

    var update = function(svgCommand, type, pointArray) {

        // update path
        path.push({
            cmd: svgCommand,
            type: type,
            points: pointArray});

        // add points
        points = points.concat(pointArray);

    };

    var reset = function() {
        path = [];
        points = [];
    };


    return {

        /**
         * Appends a new portion of SVG path to this object.
         *
         * @method update
         * @param cmd {String} one-character SVG type of path portion
         * @param type {String} extended description of the type of path portion
         * @param points {Array} array of Points in the new portion of path
         */
        update: function(cmd, type, points) {
            update(cmd, type, points);
        },

        /**
         * Moves the path to the specified point.
         *
         * @method M
         * @param point {Point} input point
         */
        M: function(point) {
            update("M", "move", [point]);
        },

        /**
         * Draws a line to the specified point.
         *
         * @method L
         * @param point {Point} input point
         */
        L: function(point) {
            update("L", "line", [point]);
        },

        /**
         * Draws a quadratic Bezier curve through the two specified points.
         *
         * @method Q
         * @param control {Point} control point
         * @param point {Point} end point
         */
        Q: function(control, point) {
            update("Q", "curveQ", [control, point]);
        },

        /**
         * Closes the path.
         *
         * @method Z
         */
        Z: function() {
            update("z", "close", []);
        },

        /**
         * Returns the array of points in the SVG path.
         *
         * @method points
         * @return {Array} array of points
         */
        points: function() {
            return points;
        },

        /**
         * Returns the number of points in the SVG path.
         *
         * @method size
         * @return {Integer} number of points
         */
        size: function() {
            return points.length;
        },

        /**
         * Builds and returns a clone of this SVGPath.
         *
         * @method clone
         * @return {SVGPath} clone of this path
         */
        clone: function() {

            var cloneSVGPath = SVGPath();
            var i;

            for(i = 0; i < path.length; i++) {
                cloneSVGPath.update(path[i].cmd, path[i].type, path[i].points);
            }

            return cloneSVGPath;

        },

        /**
         * Populates an SVG path as defined in the jQuery plugin for SVG drawing.
         *
         * @method popupate
         * @param jQuerySVGPath {Object} the jQuery SVG path
         */
        popupate: function(jQuerySVGPath) {

            var i;
            var func, points;

            for(i = 0; i < path.length; i++) {
                func = path[i].type;
                points = path[i].points;
                if(func == "move" || func == "line") {
                    jQuerySVGPath[func](points[0].x, points[0].y);
                }
                if(func == "curveQ") {
                    jQuerySVGPath[func](points[0].x, points[0].y, points[1].x, points[1].y);
                }
                if(func == "close") {
                    jQuerySVGPath[func]();
                }
            }

            return jQuerySVGPath;

        },

        /**
         * Populates this path with additional points that do not change its visual appearence.
         * Needed for smooth morphing between paths of different size.
         *
         * @method addFakePoints
         * @param number {Integer} number of fake points to add
         * @param position {Integer} position in the path where to add fake points
         */
        addFakePoints: function(number, position) {

            var oldPath = path;
            var i, j, segmentPoints, lastPoint;
            position = position || oldPath.length / 2;
            number = number || 0;

            // reset the SVG path and start from scratch
            reset();

            for(i = 0; i < oldPath.length; i++) {

                // use old piece of path
                segmentPoints = oldPath[i].points;

                update(oldPath[i].cmd, oldPath[i].type, segmentPoints);

                if(segmentPoints.length > 0) {

                    lastPoint = segmentPoints[segmentPoints.length - 1];

                    // add fake points
                    if(i === position) {
                        for(j = 0; j < number; j++) {
                            update("L", "line", [lastPoint]);
                        }

                    }

                }

            }

        },

        /**
         * Removes all fake points from this path.
         *
         * @method removeFakePoints
         */
        removeFakePoints: function() {

            var oldPath = path;

            var i, segmentPoints, lastPoint;

            // reset the SVG path and start from scratch
            reset();

            for(i = 0; i < oldPath.length; i++) {

                segmentPoints = oldPath[i].points;

                // only add piece of path if it is not a fake point
                if(
                    oldPath[i].type != "line" ||
                    !Utils.sameArray(oldPath[i].points, [lastPoint])
                    ) {
                    update(oldPath[i].type.cmd, oldPath[i].type, segmentPoints);
                }

                lastPoint = segmentPoints[segmentPoints.length - 1];

            }

        },

        /**
         * Returns the first point in this path.
         *
         * @method firstPoint
         * @return {Point} first point
         */
        firstPoint: function() {
            return points[0];
        },

        /**
         * Returns the last point in this path.
         *
         * @method lastPoint
         * @return {Point} last point
         */
        lastPoint: function() {
            return points[points.length - 1];
        },

        /**
         * Output the SVG path string corresponding to this object.
         *
         * @method toSVGPathString
         * @return {String} SVG path string
         */
        toSVGPathString: function() {

            var i, j;
            var cmd, points;
            var output = "";

            for(i = 0; i < path.length; i++) {

                cmd = path[i].cmd;
                points = path[i].points;

                output += " " + cmd + " ";

                for(j = 0; j < points.length; j++) {
                    output += " " +points[j].x + " " + points[j].y + " ";
                }

            }

            return output;

        }

    };

}



function Event(params) {

    var id = idCounter++;
    var type = params.type || "";
    var timestamp = params.timestamp || -1;
    var data = params.data || {};

    return {


        id: id,
        getType: function(){
            return type;
        },
        getTimestamp: function() {
            return timestamp;
        },
        getData: function() {
            return data;
        }

    };

};

Event.BGP = "bgp";
Event.RTT = "rtt";
Event.CORRELATION = "correlation";