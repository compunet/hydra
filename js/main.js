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

var Main = function() {

    const defaultCollectorPeerRadius = 30;
    const defaultASRadius = 40;
    const defaultTargetASRadius = 60;
    const defaultProbeRadius = 10;
    const defaultASLinkWidth = 40;

    const mainASBackroundImageURL = "img/germany-openstreetmap.png";

    var as1, as2, as3, as4, as5;
    var cp1, cp2, cp3;
    var prb1, prb2, prb3, prb4, prb5, prb6, prb7, prb8, prb9, prb10, prb11;

    var asGraph, cps, probes, mainAS, events;

    var initASGraph = function() {

        as1 = new AS({
            name: "AS1",
            number: 1,
            center: {x: 650, y: 320},
            radius: defaultASRadius,
            neighbour: true
        });
        as2 = new AS({
            name: "AS2",
            number: 2,
            center: {x: 650, y: 120},
            radius: defaultASRadius,
            neighbour: true
        });
        as3 = new AS({
            name: "AS3",
            number: 3,
            center: {x: 850, y: 320},
            radius: defaultASRadius
        });
        as4 = new AS({
            name: "AS4",
            number: 4,
            center: {x: 850, y: 120},
            radius: defaultASRadius
        });
        as5 = new AS({
            name: "AS5",
            number: 5,
            center: {x: 1050, y: 220},
            radius: defaultTargetASRadius,
            target: true
        });
        var asLink13 = new ASLink({
                from: as1,
                to: as3,
                width: defaultASLinkWidth
            }),
            asLink23 = new ASLink({
                from: as2,
                to: as3,
                width: defaultASLinkWidth
            }),
            asLink24 = new ASLink({
                from: as2,
                to: as4,
                width: defaultASLinkWidth
            }),
            asLink35 = new ASLink({
                from: as3,
                to: as5,
                width: defaultASLinkWidth
            }),
            asLink45 = new ASLink({
                from: as4,
                to: as5,
                width: defaultASLinkWidth
            });

        var asGraph = new ASGraph();
        asGraph.addAS(as1);
        asGraph.addAS(as2);
        asGraph.addAS(as3);
        asGraph.addAS(as4);
        asGraph.addAS(as5);
        asGraph.addASLink(asLink13);
        asGraph.addASLink(asLink23);
        asGraph.addASLink(asLink24);
        asGraph.addASLink(asLink35);
        asGraph.addASLink(asLink45);

        return asGraph;

    };

    var initAtlasProbes = function() {

        var probes = {};

        prb1 = new Probe({
            number: 1,
            center: new Point(150, 310),
            radius: defaultProbeRadius,
            rtt: 190,
            cp: cp1,
            latitude: 50.26,
            longitude: 9.84,
            ipPrefix: "10.0.0.0/24"
        });
        prb2 = new Probe({
            number: 2,
            center: new Point(280, 350),
            radius: defaultProbeRadius,
            rtt: 160,
            cp: cp1,
            latitude: 49.80,
            longitude: 7.52,
            ipPrefix: "10.0.0.0/24"
        });
        prb3 = new Probe({
            number: 3,
            center: new Point(400, 320),
            radius: defaultProbeRadius,
            rtt: 180,
            cp: cp1,
            latitude: 49.73,
            longitude: 8.94,
            ipPrefix: "10.0.0.0/24"
        });
        prb4 = new Probe({
            number: 4,
            center: new Point(110, 230),
            radius: defaultProbeRadius,
            rtt: 100,
            cp: cp3,
            latitude: 49.80,
            longitude: 7.52,
            ipPrefix: "10.0.1.0/24"
        });
        prb5 = new Probe({
            number: 5,
            center: new Point(280, 220),
            radius: defaultProbeRadius,
            rtt: 45,
            cp: cp3,
            latitude: 49.13,
            longitude: 10.16,
            ipPrefix: "10.0.1.0/24"
        });
        prb6 = new Probe({
            number: 6,
            center: new Point(420, 240),
            radius: defaultProbeRadius,
            rtt: 55,
            cp: cp2,
            latitude: 50.00,
            longitude: 9.38,
            ipPrefix: "10.0.1.0/24"
        });
        prb7 = new Probe({
            number: 7,
            center: new Point(280, 50),
            radius: defaultProbeRadius,
            rtt: 210,
            cp: null,
            latitude: 49.41,
            longitude: 10.96,
            ipPrefix: "10.0.1.0/24"
        });
        prb8 = new Probe({
            number: 8,
            center: new Point(190, 110),
            radius: defaultProbeRadius,
            rtt: 55,
            cp: cp3,
            latitude: 48.95,
            longitude: 10.78,
            ipPrefix: "10.0.1.0/24"
        });
        prb9 = new Probe({
            number: 9,
            center: new Point(320, 130),
            radius: defaultProbeRadius,
            rtt: 55,
            cp: cp3,
            latitude: 49.60,
            longitude: 9.65,
            ipPrefix: "10.0.2.0/24"
        });
        prb10 = new Probe({
            number: 10,
            center: new Point(390, 120),
            radius: defaultProbeRadius,
            rtt: 55,
            cp: cp3,
            latitude: 50.47,
            longitude: 9.16,
            ipPrefix: "10.0.2.0/24"
        });
        prb11 = new Probe({
            number: 11,
            center: new Point(400, 180),
            radius: defaultProbeRadius,
            rtt: 70,
            cp: cp2,
            latitude: 50.28,
            longitude: 10.55,
            ipPrefix: "10.0.2.0/24"
        });

        probes[prb1.id] = prb1;
        probes[prb2.id] = prb2;
        probes[prb3.id] = prb3;
        probes[prb4.id] = prb4;
        probes[prb5.id] = prb5;
        probes[prb6.id] = prb6;
        probes[prb7.id] = prb7;
        probes[prb8.id] = prb8;
        probes[prb9.id] = prb9;
        probes[prb10.id] = prb10;
        probes[prb11.id] = prb11;

        return probes;

    };

    var initMainAS = function() {

        return new MainAS({
            number: 4,
            name: "AS0",
            center: new Point(280, 220),
            radius: 220,
            imageURL: mainASBackroundImageURL
        });

    };

    var initEvents = function(){

        var bgpData = {};
        bgpData[cp3.id] = {
            type: "A",
            asPath: [as2, as3, as5]
        };


        var rttData = {};
        rttData.cps = {};
        rttData.cps[cp2.id] = 280;
        rttData.probes = {};
        rttData.probes[prb6.id] = 240;
        rttData.probes[prb11.id] = 290;


        var correlationData2 = {};
        correlationData2[prb1.id] = cp3.id;


        var rttData2 = {};
        rttData2.cps = {};
        rttData2.probes = {};
        rttData2.probes[prb1.id] = 80;

        var bgpData2 = {};
        bgpData2[cp2.id] = {
            "type": "A",
            asPath: [as2, as4, as5]
        };

        var rttData3 = {};
        rttData3.cps = {};
        rttData3.cps[cp2.id] = 200;
        rttData3.probes = {};
        rttData3.probes[prb6.id] = 190;
        rttData3.probes[prb11.id] = 210;

        var correlationData3 = {};
        correlationData3[prb11.id] = cp3.id;


        var rttData4 = {};
        rttData4.cps = {};
        rttData4.cps[cp1.id] = 290;
        rttData4.probes = {};
        rttData4.probes[prb3.id] = 300;
        rttData4.probes[prb2.id] = 280;

        var bgpData3 = {};
        bgpData3[cp1.id] = {
            "type": "A",
            asPath: [as2, as4, as5]
        };

        var correlationData4 = {};
        correlationData4[prb1.id] = cp1.id;
        correlationData4[prb4.id] = cp1.id;

        var rttData5 = {};
        rttData5.cps = {};
        rttData5.probes = {};
        rttData5.probes[prb1.id] = 300;
        rttData5.probes[prb4.id] = 280;

        return [
            Event({
                type: "bgp",
                data: bgpData,
                timestamp: 0
            }),
            Event({
                type: "rtt",
                data: rttData,
                timestamp: 10
            }),
            Event({
                type: "correlation",
                data: correlationData2,
                timestamp: 20
            }),
            Event({
                type: "rtt",
                data: rttData2,
                timestamp: 22
            }),
            Event({
                type: "bgp",
                data: bgpData2,
                timestamp: 30
            }),
            Event({
                type: "rtt",
                data: rttData3,
                timestamp: 32
            }),
            Event({
                type: "correlation",
                data: correlationData3,
                timestamp: 34
            }) ,
            Event({
                type: "rtt",
                data: rttData4,
                timestamp: 36
            }),
            Event({
                type: "bgp",
                data: bgpData3,
                timestamp: 38
            }),
            Event({
                type: "correlation",
                data: correlationData4,
                timestamp: 40
            }),
            Event({
                type: "rtt",
                data: rttData5,
                timestamp: 42
            })
        ];
    };

    var initCollectorPeers = function(asGraph) {

        //var asPathArray1 = [as1, as2, as3],
        //    asPathArray2 = [as1, as2, as3];

        var probeCloud1 = new SVGPath(),
            probeCloud2 = new SVGPath(),
            probeCloud3 = new SVGPath();

        cp1 = new CollectorPeer({
                name: "BG1",
                center: new Point(480, 320),
                radius: defaultCollectorPeerRadius,
                color: "Purple",
                probeCloud: probeCloud1,
                ip: "10.0.4.1"
            });
        cp2 = new CollectorPeer({
                name: "BG2",
                center: new Point(510, 220),
                radius: defaultCollectorPeerRadius,
                color: "Blue",
                probeCloud: probeCloud2,
                ip: "10.0.4.2"
            });
        cp3 = new CollectorPeer({
            name: "BG3",
            center: new Point(480, 120),
            radius: defaultCollectorPeerRadius,
            color: "DarkGoldenRod",
            probeCloud: probeCloud3,
            ip: "10.0.4.3"
        });

        //var svgPaths, asPath1, asPath2;
        var cps;
/*
        var svgPathsParams = {
            asGraph: asGraph,
            cps: {},
            newASPaths: {}
        };
        svgPathsParams.cps[cp1.id] = cp1;
        svgPathsParams.cps[cp2.id] = cp2;
        svgPathsParams.newASPaths[cp1.id] = asPathArray1;
        svgPathsParams.newASPaths[cp2.id] = asPathArray2;

        svgPaths = Animation.initASPaths(svgPathsParams);

        asPath1 = new ASPath({
                asArray: asPathArray1,
                rtt: 120,
                svgPath: svgPaths[cp1.id]
            });
        asPath2 = new ASPath({
                asArray: asPathArray2,
                rtt: 160,
                svgPath: svgPaths[cp2.id]
            });

        cp1.setASPath(asPath1);
        cp2.setASPath(asPath2);*/

        cps = {};
        cps[cp1.id] = cp1;
        cps[cp2.id] = cp2;
        cps[cp3.id] = cp3;

        return cps;

    };

    var initProbeClouds = function(cps) {


        var probeCloudPaths;

        var probeCloudPathsParams = {
            cps: cps,
            clusters: {}
        };
        probeCloudPathsParams.clusters[cp1.id] = [prb1, prb2, prb3];
        probeCloudPathsParams.clusters[cp2.id] = [prb6, prb11];
        probeCloudPathsParams.clusters[cp3.id] = [prb4, prb5, prb8, prb9, prb10];

        probeCloudPaths = Animation.initProbeClouds(probeCloudPathsParams);

        cp1.setProbeCloud(probeCloudPaths[cp1.id]);
        cp2.setProbeCloud(probeCloudPaths[cp2.id]);
        cp3.setProbeCloud(probeCloudPaths[cp3.id]);

    };

    var initASPaths = function(cps) {

        var asPathArray1 = [as1, as3, as5],
            asPathArray2 = [as1, as3, as5],
            asPathArray3 = [as2, as4, as5];

        var svgPaths, asPath1, asPath2, asPath3;

        var svgPathsParams = {
            asGraph: asGraph,
            cps: cps,
            newASPaths: {}
        };
        svgPathsParams.newASPaths[cp1.id] = asPathArray1;
        svgPathsParams.newASPaths[cp2.id] = asPathArray2;
        svgPathsParams.newASPaths[cp3.id] = asPathArray3;

        svgPaths = Animation.initASPaths(svgPathsParams);

        asPath1 = new ASPath({
            asArray: asPathArray1,
            rtt: 170,
            svgPath: svgPaths[cp1.id]
        });
        asPath2 = new ASPath({
            asArray: asPathArray2,
            rtt: 40,
            svgPath: svgPaths[cp2.id]
        });
        asPath3 = new ASPath({
            asArray: asPathArray3,
            rtt: 80,
            svgPath: svgPaths[cp3.id]
        });

        cp1.setASPath(asPath1);
        cp2.setASPath(asPath2);
        cp3.setASPath(asPath3);


    };

    var traslateAndScaleObjects = function(objects, scale, xT, yT, margin, yDelta) {

        var id, object;

        for(id in objects) {

            object = objects[id];

            object.setRadius(object.getRadius() * scale);

            object.setCenter(
                new Point(
                    (object.getCenter().x + xT) * scale + margin,
                    yDelta ?
                        (yDelta - object.getCenter().y + yT) * scale + margin :
                        (object.getCenter().y + yT) * scale + margin
                )
            );

        }

    }

    var initData = function(width, height, margin) {

        asGraph = initASGraph();
        cps = initCollectorPeers(asGraph);
        probes = initAtlasProbes();
        //initProbeClouds(cps);
        mainAS = initMainAS();
        events = initEvents();


        var asID, as, cpID, cp, probeID, probe;
        var linkID, link;
        // rescale and translate objects
        var minX = mainAS.getCenter().x - mainAS.getRadius(),
            minY = mainAS.getCenter().y - mainAS.getRadius(),
            maxX = mainAS.getCenter().x + mainAS.getRadius(),
            maxY = mainAS.getCenter().y + mainAS.getRadius();

        var xT, yT, scale;

        for(asID in asGraph.getASes()) {

            as = asGraph.getASes()[asID];

            minX = Math.min(minX, as.getCenter().x - as.getRadius());
            minY = Math.min(minY, as.getCenter().y - as.getRadius());
            maxX = Math.max(maxX, as.getCenter().x + as.getRadius());
            maxY = Math.max(maxY, as.getCenter().y + as.getRadius());

        }

        // now that we have the current bounding box, compare the two
        // and change data
        xT = - minX;
        yT = - minY;
        scale = Math.min(
            (width - 2 * margin) / (maxX - minX),
            (height - 2 * margin) / (maxY - minY)
        );

        traslateAndScaleObjects({"bla": mainAS}, scale, xT, yT, margin);//, maxY - minY);
        traslateAndScaleObjects(asGraph.getASes(), scale, xT, yT, margin);//, maxY - minY);
        traslateAndScaleObjects(cps, scale, xT, yT, margin);//, maxY - minY);
        traslateAndScaleObjects(probes, scale, xT, yT, margin);//, maxY - minY);

        for(linkID in asGraph.getASLinks()) {

            link = asGraph.getASLinks()[linkID];
            link.setWidth(link.getWidth() * scale);
            link.setSectorWidth(link.getSectorWidth() * scale);

        }


        initProbeClouds(cps);
        initASPaths(cps);

        // return the actual size of the drawing
        return {
            width: 2 * margin + scale * (maxX - minX),
            height: 2 * margin + scale * (maxY - minY)
        };

    };


    var initAtlasBGPEngine = function(svgWrapper, params) {

        AtlasBgpEngine.init({
            asGraph: asGraph,
            probes: probes,
            cps: cps,
            mainAS: mainAS,
            events: events,
            canvas: svgWrapper,
            width: params.width,
            height: params.height,
            withTimeline: params.showTimeline,
            timelineHeight: params.timelineHeight
        });

    };


    return {

        preprocess: function(params) {

            var width = params.width,
                height = params.height,
                showTimeline = params.showTimeline,
                timelineHeight = params.timelineHeight,
                vizHeight = showTimeline ? height - timelineHeight : height;

            var actualBBox = initData(width, vizHeight, 10);

            return {

                width: actualBBox.width,
                height: actualBBox.height + (showTimeline ? timelineHeight : 0)

            };

        },

        init: function(svg, params) {

            console.log("main init params",params);

            initAtlasBGPEngine(svg, params);

            setTimeout(AtlasBgpEngine.play, 15000);
        }

    };

}();



// GO!
$(function() {

    var width = 2400, height = 1500, showTimeline = false;
    var timelineHeight = 200;

    // TODO calculate bounding box for objects
    var actualSize = Main.preprocess({
        width: width,
        height: height,
        showTimeline: showTimeline,
        timelineHeight: timelineHeight
    });

    var paper = new Raphael("atlasbgp", actualSize.width, actualSize.height);

    Main.init(paper, {
        width: actualSize.width,
        height: actualSize.height,
        showTimeline: showTimeline,
        timelineHeight: timelineHeight
    });

});


