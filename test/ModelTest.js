
ModelTest = TestCase("ModelTest");
// three ASes
var as1, as1name = "AS1", as1number = 1, as1centerX = 10, as1centerY = 20, as1radius = 20;
var as2, as2name = "AS2", as2number = 2, as2centerX = 30, as2centerY = 10, as2radius = 10;
var as3, as3name = "AS3", as3number = 3, as3centerX = 20, as3centerY = 40, as3radius = 15;
// two AS links
var asLink12, asLink12width = 10;
var asLink13, asLink13width = 10;
// an AS graph
var asGraph;
// two AS paths
var asPath12, asPath12rtt = 10;
var asPath123, asPath123rtt = 20;
// an SVG path
var svgPath;
var svgPathP1 = {x: 10, y: 10},
    svgPathP2 = {x: 20, y: 20},
    svgPathP3 = {x: 20, y: 30},
    svgPathP4 = {x: 30, y: 30};


//initialization
ModelTest.prototype.setUp=function(){

    // initialize ASes
    as1 = AS({
        name: as1name,
        number: as1number,
        center: {x: as1centerX, y: as1centerY},
        radius: as1radius
    });
    as2 = AS({
        name: as2name,
        number: as2number,
        center: {x: as2centerX, y: as2centerY},
        radius: as2radius
    });
    as3 = AS({
        name: as3name,
        number: as3number,
        center: {x: as3centerX, y: as3centerY},
        radius: as3radius
    });

    // initialize AS links
    asLink12 = ASLink({
        from: as1,
        to: as2,
        width: asLink12width
    });
    asLink13 = ASLink({
        from: as1,
        to: as3,
        width: asLink13width
    });

    // initialize AS graph
    asGraph = ASGraph();
    asGraph.addAS(as1);
    asGraph.addAS(as2);
    asGraph.addAS(as3);
    asGraph.addASLink(asLink12);
    asGraph.addASLink(asLink13);

    // initialize AS paths
    asPath12 = ASPath({
        asArray: [as1, as2],
        rtt: asPath12rtt
    });
    asPath123 = ASPath({
        asArray: [as1, as2, as3],
        rtt: asPath123rtt
    });

    // initialize SVG path
    svgPath = SVGPath();
    svgPath.M(svgPathP1);
    svgPath.L(svgPathP2);
    svgPath.Q(svgPathP3, svgPathP4);
    svgPath.Z();

};

// various tests on correct graph creation and initialization
ModelTest.prototype.testIfGraphIsCorrectlyPopulated = function() {

    var graphASes = asGraph.getASes(), graphASLinks = asGraph.getASLinks();
    var asCounter = 0, asLinkCounter = 0;

    // 1. there should be 3 ASes
    for(graphAs in graphASes) {
        asCounter++;
    }
    assertEquals(asCounter, 3);

    // 2. they should be exactly equal to as1, as2, as3
    assertEquals(as1, graphASes[as1.id]);
    assertEquals(as2, graphASes[as2.id]);
    assertEquals(as3, graphASes[as3.id]);

    // 3. there should be 2 links
    for(graphASLink in graphASLinks) {
        asLinkCounter++;
    }

    // 4. they should be exactly equal to asLink12, asLink13
    assertEquals(asLink12, graphASLinks[asLink12.id]);
    assertEquals(asLink13, graphASLinks[asLink13.id]);

    // 5. ASes should be retrievable by ID
    assertEquals(as1, asGraph.getAS(as1.id));
    assertEquals(as2, asGraph.getAS(as2.id));
    assertEquals(as3, asGraph.getAS(as3.id));

    // 6. AS Links should be retrievable given the two related ASes, no matter the order
    assertEquals(asLink12, asGraph.getASLink(as1, as2));
    assertEquals(asLink12, asGraph.getASLink(as2, as1));
    assertEquals(asLink13, asGraph.getASLink(as1, as3));
    assertEquals(asLink13, asGraph.getASLink(as3, as1));

};


// test for basic properties of AS paths
ModelTest.prototype.testASPathProperties = function() {

    // values should be the same
    assertEquals(asPath12rtt, asPath12.getRtt());
    assertEquals([as1, as2], asPath12.getASes());
    assertEquals(asPath123rtt, asPath123.getRtt());
    assertEquals([as1, as2, as3],asPath123.getASes());

    // lengths should be consistent
    assertEquals(2, asPath12.getLength());
    assertEquals(3, asPath123.getLength());

};

// test basic properties of SVGPath
ModelTest.prototype.testSVGPathProperties = function() {

    assertEquals(4, svgPath.size());
    assertEquals([svgPathP1, svgPathP2, svgPathP3, svgPathP4], svgPath.points());
    assertEquals(svgPathP1, svgPath.firstPoint());
    assertEquals(svgPathP4, svgPath.lastPoint());

};

// test fake points in SVGPath
ModelTest.prototype.testSVGPathFakePoints = function() {

    var initialPoints = svgPath.points();

    svgPath.addFakePoints(3);
    assertEquals(7, svgPath.size());

    svgPath.removeFakePoints();
    assertEquals(4, svgPath.size());

    assertEquals(initialPoints, svgPath.points());

}
