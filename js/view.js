/**
 * Contains the class(es) responsible for the view.
 *
 * @module view
 */

/**
 * Abstract graphics engine for the visualization.
 * Relies on an external adapter for specific calls to drawing libraries.
 *
 * @class AtlasBgpEngine
 * @static
 */
var AtlasBgpEngine = function() {

    var asGraph, cps, probes, events;



    var processEvent = function(event, callback) {

        var type = event.getType(), data = event.getData();

        if(!type || !data) {
            throw new Error("event is missing key attributes.");
        }

        if(type == Event.BGP) {
            return processBGPEvent(data, callback);
        }

        if(type == Event.CORRELATION) {
            return processCorrelationEvent(data, callback);
        }

        if(type == Event.RTT) {
            return processRttEvent(data, callback);
        }

        throw new Error("unknown event type: " + type);

    };

    /*
     data = {
        cpID1: {
            type: "A" || "W"
            asPath: [AS, AS, ...] || []
        },
        cpID2: ...,
        ...
     }
     */

    /**
     * Processes the input BGP event animating the visualization.
     *
     * @method processBGPEvent
     * @private
     * @param data {Object} key-value object as follows:
     *     @param data.cpData {Object} object related to a collector peer, indexed by its ID
     *         @param data.cpData.type {String} type of BGP update (either "A" or "W")
     *         @param data.cpData.asPath {Array} array of ASPath objects
     * @param callback {Function} function invoked at the end of the animation
     */
    var processBGPEvent = function(data, callback) {

        console.log("bgp event data", data);

        var cpID;
        var params = {
            asGraph: asGraph,
            cps: cps,
            newASPaths: {}
        };
        var changedPaths = {};

        for(cpID in cps) {

            if(!data[cpID]) {
                params.newASPaths[cpID] = cps[cpID].getASPath().getASes();
                changedPaths[cpID] = false;
            }
            else {
                params.newASPaths[cpID] = data[cpID].asPath;
                changedPaths[cpID] = true;
            }

        }

        console.log("creating new as paths for animation", params.newASPaths);

        var asPathsForAnimation = Animation.computeASPathsForBGPEvent(params);

        console.log(asPathsForAnimation);

        Canvas.animateBGPPaths({
            paths: asPathsForAnimation,
            changed: changedPaths,
            newPathArrays: data
        }, callback);

    };

    /*
     data = {
        probeID1: cpID,
        probeID2: ...,
        ...
     }
     */
    var processCorrelationEvent = function(data, callback) {

        var changed = {},
            before = {},
            after = {};

        var cpID, probeID, oldCpID, newCpID;

        // init arrays
        for(cpID in cps) {
            before[cpID] = [];
            after[cpID] = [];
        }

        // populate arrays
        for(probeID in probes) {

            if(!probes[probeID].getCollectorPeer()) {
                continue;
            }

            oldCpID = probes[probeID].getCollectorPeer().id;
            newCpID = data[probeID];

            console.log("correlation for probe", probeID, ": old cp", oldCpID, ", new cp: ", newCpID);

            if(oldCpID) {
                before[oldCpID].push(probes[probeID]);
            }
            if(newCpID) {
                after[newCpID].push(probes[probeID]);
            }
            else {
                after[oldCpID].push(probes[probeID]);
            }
        }

        // now cps with no events will have EXACTLY the same arrays
        // in 'before' and 'after'
        for(cpID in before) {
            changed[cpID] = !Utils.sameArray(before[cpID], after[cpID]);
        }

        Canvas.animateCorrelations({
            cps: cps,
            changed: changed,
            before: before,
            after: after,
            probeCPs: data
        }, callback);

    };

    /*
     data = {
        probes: {
            probeID1: number,
            probeID2: ...,
            ...
        },
        cps: {
            cpID1: number,
            cpID2: ...,
            ...
        }
     }
     */
    var processRttEvent = function(data, callback) {

        var changed = {};
        var cpID, probeID;

        for(cpID in cps) {

            if(data.cps[cpID])
                changed[cpID] = true;
            else
                changed[cpID] = false;

        }

        for(probeID in probes) {

            if(data.probes[probeID])
                changed[probeID] = true;
            else
                changed[probeID] = false;

        }

        console.log("rtt event data", data);

        data.changed = changed;

        Canvas.animateRTTs(data, callback);

    };

    var moveCursor = function(event, callback) {

        return Canvas.moveCursor(event, callback);

    };


    var playEvent = function(index) {

        if(index >= events.length) {
            return;
        }

        moveCursor(events[index], function() {

            processEvent(events[index], function() {

                playEvent( index + 1 );

            })

        });

    };

    var play = function() {

        playEvent(0);

    };


    return {

        /*
         AtlasBgpEngine
         params = {
            asGraph: ASGraph,
            probes: {
                probeID1: Probe,
                probeID2: ...,
                ...
            },
            cps: {
                cpID1: CollectorPeer,
                cpID2: ...,
                ...
            },
            events: [
                e1, e2, ...
            ]
            canvas: SVGWrapper
         }
         */
        init: function(params) {

            console.log("init atlas bgp engine params", params);

            asGraph = params.asGraph;
            probes = params.probes;
            cps = params.cps;
            events = params.events;

            Canvas.init(params);

        },

        /*
         event = {
            type: "bgp" || "correlation" || "rtt",
            data: {...}, // type-specific
            timestamp: number
         }
         */
        processEvent: function(event, callback) {

            processEvent(event, callback);

        },


        moveCursor: function(event, callback) {

            moveCursor(event, callback);

        },

        play: function() {

            play();

        }

    };

}();