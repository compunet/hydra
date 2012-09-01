
AnimationTest = TestCase("AnimationTest");

// four ASes
var as1, as1name = "AS1", as1number = 1, as1centerX = 0, as1centerY = 200, as1radius = 10;
var as2, as2name = "AS2", as2number = 2, as2centerX = 50, as2centerY = 150, as2radius = 10;
var as3, as3name = "AS3", as3number = 3, as3centerX = 0, as3centerY = 100, as3radius = 10;
var as4, as4name = "AS4", as4number = 4, as4centerX = 0, as4centerY = 0, as4radius = 10;
// four AS links
var asLink12, asLink12width = 10;
var asLink13, asLink13width = 10;
var asLink23, asLink23width = 10;
var asLink34, asLink34width = 10;
// an AS graph
var asGraph;
// two AS paths
var asPath134, asPath134rtt = 10;
var asPath1234, asPath1234rtt = 20;
// two collector peers
var collectorPeer1, cp1center = new Point(0, 300), cp1radius = 10;
var collectorPeer2, cp2center = new Point(50, 350), cp2radius = 10;

//initialization for tests
AnimationTest.prototype.setUp=function() {


    // initialize ASes
    as1 = new AS({
        name: as1name,
        number: as1number,
        center: {x: as1centerX, y: as1centerY},
        radius: as1radius
    });
    as2 = new AS({
        name: as2name,
        number: as2number,
        center: {x: as2centerX, y: as2centerY},
        radius: as2radius
    });
    as3 = new AS({
        name: as3name,
        number: as3number,
        center: {x: as3centerX, y: as3centerY},
        radius: as3radius
    });
    as4 = new AS({
        name: as4name,
        number: as4number,
        center: {x: as4centerX, y: as4centerY},
        radius: as4radius
    });

    // initialize AS links
    asLink12 = new ASLink({
        from: as1,
        to: as2,
        width: asLink12width,
        sectorWidth: asLink12width
    });
    asLink13 = new ASLink({
        from: as1,
        to: as3,
        width: asLink13width,
        sectorWidth: asLink13width
    });
    asLink23 = new ASLink({
        from: as2,
        to: as3,
        width: asLink23width,
        sectorWidth: asLink23width
    });
    asLink34 = new ASLink({
        from: as3,
        to: as4,
        width: asLink34width,
        sectorWidth: asLink34width
    });

    // initialize AS graph
    asGraph = new ASGraph();
    asGraph.addAS(as1);
    asGraph.addAS(as2);
    asGraph.addAS(as3);
    asGraph.addAS(as4);
    asGraph.addASLink(asLink12);
    asGraph.addASLink(asLink13);
    asGraph.addASLink(asLink23);
    asGraph.addASLink(asLink34);

    // initialize AS paths
    asPath134 = new ASPath({
        asArray: [as1, as3, as4],
        rtt: asPath134rtt
    });
    asPath1234 = new ASPath({
        asArray: [as1, as2, as3, as4],
        rtt: asPath1234rtt
    });

    // initialize collector peers
    collectorPeer1 = new CollectorPeer({
        center: cp1center,
        radius: cp1radius
    });
    collectorPeer2 = new CollectorPeer({
        center: cp2center,
        radius: cp2radius
    });

};


// test initialization of AS paths
AnimationTest.prototype.testInitASPaths = function() {

    var cpID1 = collectorPeer1.id,
        cpID2 = collectorPeer2.id;

    var params = {

        asGraph: asGraph,

        cps: {},

        newASPaths: {}

    };

    params.cps[cpID1] = collectorPeer1;
    params.newASPaths[cpID1] = [as1, as3, as4];

    params.cps[cpID2] = collectorPeer2;
    params.newASPaths[cpID2] = [as1, as2, as3, as4];

    // building expected SVG paths (only for CP1 for simplicity)
    var expectedSVGPaths = {};
    expectedSVGPaths[cpID1] = new SVGPath();

    expectedSVGPaths[cpID1].M({x: 0, y: 290});
    expectedSVGPaths[cpID1].L({x: 0, y: 210});
    expectedSVGPaths[cpID1].Q({x: 0, y: 205}, {x: 0, y: 200});
    expectedSVGPaths[cpID1].Q({x: 0, y: 195}, {x: 0, y: 190});
    expectedSVGPaths[cpID1].L({x: 0, y: 110});
    expectedSVGPaths[cpID1].Q({x: 0, y: 105},
        Geometry.middlePoint({x: 0, y: 105}, {x: -5, y: 100 - 2.5 * Math.sqrt(3)}));
    expectedSVGPaths[cpID1].Q({x: -5, y: 100 - 2.5 * Math.sqrt(3)}, {x: -5, y: 100 - 5 * Math.sqrt(3)});
    expectedSVGPaths[cpID1].L({x: -5, y: 5 * Math.sqrt(3)});
    expectedSVGPaths[cpID1].L({x: -5, y: 2.5 * Math.sqrt(3)});

    // computing actual SVG paths
    var actualSVGPaths = Animation.initASPaths(params);

    // testing path length
    assertEquals(expectedSVGPaths[cpID1].size(), actualSVGPaths[cpID1].size());
    //assertEquals(13, actualSVGPaths[cpID2].size());

    // comparing actual path points
    assertEqualsDelta(expectedSVGPaths[cpID1].points(), actualSVGPaths[cpID1].points(), 0.001);

};