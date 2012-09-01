/**
 * Contains various utility classes.
 *
 * @module utils
 */

/**
 * Generic utility class.
 *
 * @class Utils
 * @static
 */
var Utils = function(){
    /* Let's extend Array Objects with some utility methods */
    Array.prototype.removeElementAtIndex = function(index){
        if(Array.prototype.removeElementAtIndex == 'undefined'){console.log("Possible conflict over Array.prototype.removeElementAtIndex definition.");}
        return this.splice(index,1)[0];
    };

    Array.prototype.isEmpty = function(){
        if(Array.prototype.isEmpty == 'undefined'){console.log("Possible conflict over Array.prototype.isEmpty definition.");}
        return this.length == 0;
    };

    Array.prototype.removeElement = function(element){
        if(Array.prototype.removeElement == 'undefined'){console.log("Possible conflict over Array.prototype.removeElement definition.");}
        return this.splice(this.indexOf(element),1)[0];
    };

    return {

        /**
         * Generates an ID by ordering and concatenating two input IDs.
         *
         * @method getConcatOrderedIDs
         * @param {Number} id1
         * @param {Number} id2
         * @return {String} resulting ID
         */
        getConcatOrderedIDs: function(id1, id2){

            return id1 < id2 ?
                id1 + "-" + id2 :
                id2 + "-" + id1 ;

        },

        /**
         * Checks if two arrays are equal.
         *
         * @method sameArray
         * @param {Array} array1
         * @param {Array} array2
         * @return {Boolean} true if array1 equals array2, false otherwise
         */
        sameArray: function(array1, array2) {

            var i;

            if(array1.length != array2.length)
                return false;

            for(i = 0; i < array1.length; i++) {
                if(array1[i] != array2[i])
                    return false;
            }

            return true;

        },

        computeHSLColor: function(value, min, max) {

            var colorHue = 120 - 120 * (Math.max(min, Math.min(max, value)) - min) / (max - min);
            var color = "hsl(" + colorHue + ", 100%, 50%)";

            return color;

        },

        computeHSLPercentageColor: function(value, min, max) {

            var colorHueAngle = 120 - 120 * (Math.max(min, Math.min(max, value)) - min) / (max - min);
            var colorHuePerc =  100 * colorHueAngle / 360;


            var color = "hsl(" + colorHuePerc + "%, 100%, 50%)";

            return color;

        },

        computeHSLDecimalHue: function(value, min, max) {

            var colorHueAngle = 120 - 120 * (Math.max(min, Math.min(max, value)) - min) / (max - min);
            var colorHueDecimal =  colorHueAngle / 360;

            return colorHueDecimal;

        }

    };

}();

/**
 * Contains methods for standard geometric computations.
 *
 * @class Geometry
 * @static
 */
var Geometry = function(){

    var innerPointDistance = function(p1, p2) {
        var x1 = p1.x, y1 = p1.y, x2 = p2.x, y2 = p2.y;
        return Math.sqrt(
            Math.pow(x2 - x1,2) +
                Math.pow(y2 - y1,2)
        );
    };

    return {

        /**
         * Returns the distance between two points.
         *
         * @method pointDistance
         * @param {Point} p1 first point
         * @param {Point} p2 second point
         * @return {Number} distance between p1 and p2
         */
        pointDistance: function(p1, p2) {

            return innerPointDistance(p1, p2);

        },

        /**
         * Returns a Point representing the unit vector directed from p1 to p2.
         *
         * @method direction
         * @param {Point} p1 first point
         * @param {Point} p2 second point
         * @param {Number} [distance] distance between p1 and p2
         * @return {Point} direction as unit-vector
         */
        direction: function(p1, p2, distance) {

            distance = distance || innerPointDistance(p1, p2);

            return Point(
                (p2.x - p1.x) / distance,
                (p2.y - p1.y) / distance
            );

        },

        left: function(direction) {
            return Point(
                - direction.y,
                + direction.x
            );
        },

        right: function(direction) {
            return Point(
                + direction.y,
                - direction.x
            );
        },

        /*
         leg = cathethus !
         */
        leg: function(hypotenuse, otherLeg) {

            return Math.sqrt(
                Math.pow(hypotenuse,2) -
                Math.pow(otherLeg,2)
            );
        },

        middlePoint: function(p1, p2) {

            return Point(
                (p1.x + p2.x) / 2,
                (p1.y + p2.y) / 2
            );

        }

    };



}();


/**
 * Contains utility methods to animate the visualizations in this project.
 *
 * @class Animation
 * @static
 */
var Animation = function() {

    var createRelativePositionsOfGatesByASPath = function(newASPaths) {

        var sortedCollectorPeerIDs = [];
        var asLinkPathQueue = {}, i, k, as1, as2, asLink12ID, asPathArray;
        var gateRelativePositions = {};
        var asLink;
        var cpID;

        // sort collector peers
        for(cpID in newASPaths) {
            sortedCollectorPeerIDs.push(cpID);
        }
        sortedCollectorPeerIDs.sort();

        console.log("new as paths", newASPaths);

        // add AS paths to AS link queues
        for(k = 0; k < sortedCollectorPeerIDs.length; k++) {

            cpID = sortedCollectorPeerIDs[k];

            asPathArray = newASPaths[cpID];
            for(i = 0; i < asPathArray.length - 1; i++) {
                as1 = asPathArray[i];
                as2 = asPathArray[i + 1];
                asLink12ID = Utils.getConcatOrderedIDs(as1.id, as2.id);
                if(!asLinkPathQueue[asLink12ID]) {
                    asLinkPathQueue[asLink12ID] = [];
                }
                asLinkPathQueue[asLink12ID].push(cpID);
            }

        }

        // convert arrays to objects pointing to relative position
        for(asLink in asLinkPathQueue) {

            gateRelativePositions[asLink] = {};

            for(i = 0; i < asLinkPathQueue[asLink].length; i++) {
                gateRelativePositions[asLink][asLinkPathQueue[asLink][i]] =
                    asLinkPathQueue[asLink].length == 1 ?
                        0.5 :
                        i / (asLinkPathQueue[asLink].length - 1);
            }

        }

        return gateRelativePositions;

    };

    var createSVGPathForCollectorPeer = function(collectorPeer, asGraph, asPathArray, gatePositions) {

        var svgPath = new SVGPath();
        var i, node1, node2, edge12;
        var direction, left, availableWidth, gate;
        var deviationFromLinkCenter;
        var centerSidePoint1, centerSidePoint2;
        var controlPoint1, controlPoint2;
        var gatePoint1, gatePoint2;

        var asPathIncludingCollectorPeer = [collectorPeer].concat(asPathArray);

        // calculate relevant points for each AS link
        var pathPoints = [];
        for(i = 0; i < asPathIncludingCollectorPeer.length - 1; i++) {

            node1 = asPathIncludingCollectorPeer[i];
            node2 = asPathIncludingCollectorPeer[i + 1];

            // if the first element is a collector peer
            if(i === 0) {
                edge12 = {
                    id: Utils.getConcatOrderedIDs(node1.id, node2.id)
                }
                direction = Geometry.direction(node1.getCenter(), node2.getCenter());
                left = Geometry.left(direction);
                deviationFromLinkCenter = 0;
            }
            else {
                edge12 = asGraph.getASLink(node1, node2);

                direction = edge12.getDirection();
                left = edge12.getLeftDirection();
                availableWidth = edge12.getSectorWidth();
                gate = gatePositions[edge12.id][collectorPeer.id];

                // this is where on the AS link we will place the AS path
                // (relative to its sector width, where the center of the link has value 0)
                deviationFromLinkCenter = (gate - 0.5) * availableWidth;
            }



            // these two points are the intersections between straight lines representing the AS link
            // and perpendicular lines passing through the centers of the two ASes
            centerSidePoint1 = {
                x: node1.getCenter().x + left.x * deviationFromLinkCenter,
                y: node1.getCenter().y + left.y * deviationFromLinkCenter
            };
            centerSidePoint2 = {
                x: node2.getCenter().x + left.x * deviationFromLinkCenter,
                y: node2.getCenter().y + left.y * deviationFromLinkCenter
            };

            // these are the control points inside the ASes for Bezier curves
            controlPoint1 = {
                x: centerSidePoint1.x + 0.5 * direction.x * Geometry.leg(node1.getRadius(), deviationFromLinkCenter),
                y: centerSidePoint1.y + 0.5 * direction.y * Geometry.leg(node1.getRadius(), deviationFromLinkCenter)
            };
            controlPoint2 = {
                x: centerSidePoint2.x - 0.5 * direction.x * Geometry.leg(node2.getRadius(), deviationFromLinkCenter),
                y: centerSidePoint2.y - 0.5 * direction.y * Geometry.leg(node2.getRadius(), deviationFromLinkCenter)
            };

            // these are the actual points on the gate
            gatePoint1 = {
                x: centerSidePoint1.x + direction.x * Geometry.leg(node1.getRadius(), deviationFromLinkCenter),
                y: centerSidePoint1.y + direction.y * Geometry.leg(node1.getRadius(), deviationFromLinkCenter)
            };
            gatePoint2 = {
                x: centerSidePoint2.x - direction.x * Geometry.leg(node2.getRadius(), deviationFromLinkCenter),
                y: centerSidePoint2.y - direction.y * Geometry.leg(node2.getRadius(), deviationFromLinkCenter)
            };

            pathPoints.push({
                asLink: edge12.id,
                points: [controlPoint1, gatePoint1, gatePoint2, controlPoint2]
            });

        }

        // populate SVG path
        for(i = 0; i < pathPoints.length; i++) {
            if(i == 0) {
                svgPath.M(pathPoints[i].points[1]); // first gate point
            }
            else {
                svgPath.Q(pathPoints[i].points[0], pathPoints[i].points[1]); // second bezier inside circle
            }
            svgPath.L(pathPoints[i].points[2]); // line on as link
            if(i == pathPoints.length - 1) {
                svgPath.L(pathPoints[i].points[3]); // last segment inside last as
            }
            else {
                svgPath.Q(
                    pathPoints[i].points[3],
                    Geometry.middlePoint(
                        pathPoints[i].points[3],
                        pathPoints[i + 1].points[0]
                    )
                ); // first bezier inside circle
            }
        }

        return svgPath;

    };

    /*
     params = {
        asGraph: ASGraph,
        cps: {
            cpID1: CollectorPeer,
            cpID2: ...,
            ...
        },
        newASPaths: {
            cpID1: [AS, AS, ...],
            cpID2: ...,
            ...
        }
     }
     gatePositions = {
        asLinkID1: {
            cpID1: number, // percentage of 1
            cpID2: ...,
            ...
        },
        asLinkID2: ...,
        ...
     }
    */
    var createSVGPathsForBGPEvent = function(params, gatePositions) {

        var newSVGPaths = {};

        for(var cp in params.newASPaths) {

            newSVGPaths[cp] = createSVGPathForCollectorPeer(
                params.cps[cp],
                params.asGraph,
                params.newASPaths[cp],
                gatePositions
            );

        }

        return newSVGPaths;

    };

    var computeProbeClouds = function(params) {

        var cps = params.cps,
            clusters = params.clusters || params.after;

        var cpID;
        var i;
        var cpNodeArray;

        var clouds = {};

        for(cpID in cps) {

            cpNodeArray = [cps[cpID]];
            for(i = 0; i < clusters[cpID].length; i++) {
                cpNodeArray.push(clusters[cpID][i]);
            }

            clouds[cpID] = EMST.computeCloud(EMST.computeEMST(cpNodeArray));

        }

        return clouds;

    };

    return {

        /*
         params = {
            asGraph: ASGraph,
            cps: {
                cpID1: CollectorPeer,
                cpID2: ...,
                ...
            },
            newASPaths: {
                cpID1: [AS, AS, ...],
                cpID2: ...,
                ...
            }
         }

         output = {
            cpID1: SVGPath,
            cpID2: ...,
            ...
         }
         */
        initASPaths: function(params) {

            // get relative positions of gates for each AS-path on each AS-link
            var gateRelativePositions = createRelativePositionsOfGatesByASPath(params.newASPaths);

            // create new paths
            var svgPaths = createSVGPathsForBGPEvent(params, gateRelativePositions);

            return svgPaths;

        },

        /*
         params = {
            asGraph: ASGraph,
            cps: {
                cpID1: CollectorPeer,
                cpID2: ...,
                ...
            },
            newASPaths: {
                cpID1: [AS, AS, ...],
                cpID2: ...,
                ...
            }
         }

         output = {
            cpID1: {
                modifyInitialPath: SVGPath,
                animatePath: SVGPath,
                modifyFinalPath: SVGPath
            },
            cpID2: ...,
            ...
         }
         */
        computeASPathsForBGPEvent: function(params) {

            var cp;

            var output = {};

            // get relative positions of gates for each AS-path on each AS-link
            var gateRelativePositions = createRelativePositionsOfGatesByASPath(params.newASPaths);

            // create new paths
            var newSVGPaths = createSVGPathsForBGPEvent(params, gateRelativePositions);

            var newCpPath, oldCpPath, pointDiff;

            // check number of points and add fake points where needed
            for(cp in newSVGPaths) {

                oldCpPath = params.cps[cp].getASPath().getSVGPath().clone();
                newCpPath = newSVGPaths[cp].clone();

                output[cp] = {
                    modifyFinalPath: newSVGPaths[cp]
                };

                if(oldCpPath.size() < newCpPath.size()) {
                    pointDiff = newCpPath.size() - oldCpPath.size();
                    oldCpPath.addFakePoints(pointDiff);
                    output[cp].modifyInitialPath = oldCpPath;
                    output[cp].animatePath = newSVGPaths[cp];
                }
                else if(oldCpPath.size() > newCpPath.size()) {
                    pointDiff = - newCpPath.size() + oldCpPath.size();
                    newCpPath.addFakePoints(pointDiff);
                    output[cp].modifyInitialPath = oldCpPath;
                    output[cp].modifyFinalPath = newSVGPaths[cp];
                    output[cp].animatePath = newCpPath;
                }
                else {
                    output[cp].modifyInitialPath = oldCpPath;
                    output[cp].animatePath = newSVGPaths[cp];
                }

            }

            return output;

        },

        /*
         params = {
            cps: {
                cpID1: CollectorPeer,
                cpID2: ...,
                ...
            }
            before: {
                cpID1: [Probe, Probe, ...],
                cpID2: ...,
                ...
            },
            after: {
                cpID1: [Probe, Probe, ...],
                cpID2: ...,
                ...
            }
         }

         output = {
            cpID1: {
                modifyInitialPath: SVGPath,
                animatePath: SVGPath,
                modifyFinalPath: SVGPath
            },
            cpID2: ...,
            ...
         }
         */
        computeProbeCloudsForCorrelationEvent: function(params) {
            // TODO

            var cp;
            var output = {};

            var clouds = computeProbeClouds(params);

            var newCpPath, oldCpPath, pointDiff;

            // check number of points and add fake points where needed
            for(cp in clouds) {

                oldCpPath = params.cps[cp].getProbeCloud();
                newCpPath = clouds[cp].clone();

                output[cp] = {
                    modifyFinalPath: clouds[cp]
                };

                if(oldCpPath.size() < newCpPath.size()) {
                    pointDiff = newCpPath.size() - oldCpPath.size();
                    oldCpPath.addFakePoints(pointDiff);
                    output[cp].modifyInitialPath = oldCpPath;
                    output[cp].animatePath = clouds[cp];
                }
                else if(oldCpPath.size() > newCpPath.size()) {
                    pointDiff = - newCpPath.size() + oldCpPath.size();
                    newCpPath.addFakePoints(pointDiff);
                    output[cp].modifyInitialPath = oldCpPath;
                    output[cp].animatePath = newCpPath;
                    output[cp].modifyFinalPath = clouds[cp];
                }
                else {
                    output[cp].modifyInitialPath = oldCpPath;
                    output[cp].animatePath = clouds[cp];
                }

            }

            console.log("new clouds", output);

            return output;

        },

        /**
         * Returns the SVG paths that identify the clouds of probes
         * routing their traffic through each collector peer.
         *
         * @method initProbeClouds
         * @param params {Object}
         *     @param params.cps {Object} key-value object with collector peers indexed by their ID
         *     @param params.clusters {Object} key-value object with arrays of Probes indexed by
         *                                   the ID of the collector peer that routes their traffic
         * @return {Object} a key-value object with an SVGPath for each collector peer,
         *                  indexed by collector peer ID
         */
        initProbeClouds: function(params) {

            return computeProbeClouds(params);

        }

    };

}();
