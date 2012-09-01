
EmstTest = TestCase("EmstTest");

var prb1, prb2, prb3, prb4, prb5, prb6;
var p1, p2, p3, p4, p5, p6;
var probeArray;
var probeEMST;

EmstTest.prototype.setUp = function() {

    var defaultProbeRadius = 30;
    var cp1 = {}, cp2 = {};

    p1 = new Point(20, 0);
    p2 = new Point(20, 50);
    p3 = new Point(40, 50);
    p4 = new Point(61, 50);
    p5 = new Point(40, 70);
    p6 = new Point(60, 75);

    prb1 = new Probe({
        number: 3,
        center: p1,
        radius: defaultProbeRadius,
        rtt: 60,
        cp: cp1
    });
    prb2 = new Probe({
        number: 45,
        center: p2,
        radius: defaultProbeRadius,
        rtt: 160,
        cp: cp2
    });
    prb3 = new Probe({
        number: 99,
        center: p3,
        radius: defaultProbeRadius,
        rtt: 180,
        cp: cp2
    });
    prb4 = new Probe({
        number: 187,
        center: p4,
        radius: defaultProbeRadius,
        rtt: 200,
        cp: cp2
    });
    prb5 = new Probe({
        number: 43,
        center: p5,
        radius: defaultProbeRadius,
        rtt: 45,
        cp: cp1
    });
    prb6 = new Probe({
        number: 77,
        center: p6,
        radius: defaultProbeRadius,
        rtt: 200,
        cp: cp2
    });


    probeArray = [prb1, prb2, prb3, prb4, prb5, prb6];

    probeEMST = EMST.computeEMST(probeArray);

};

EmstTest.prototype.testCreateProbeEMST = function() {

    // root
    assertEquals(prb1, probeEMST);

    // root only has prb2 as neighbor
    assertEquals(1, probeEMST.EMST.neighbours().length);
    assertEquals(prb2, probeEMST.EMST.neighbours()[0]);

    // prb6 is the only neighbor of prb5
    assertEquals(1, prb5.EMST.neighbours().length);
    assertEquals(prb6, prb5.EMST.neighbours()[0]);

};

EmstTest.prototype.testCreateProbeCloud = function() {

    var actualProbeCloud = EMST.computeCloud(probeEMST);

    // populate expected path
    var expectedProbeCloud = new SVGPath();
    expectedProbeCloud.M(p1);
    expectedProbeCloud.L(p2);
    expectedProbeCloud.L(p3);
    expectedProbeCloud.L(p5);
    expectedProbeCloud.L(p6);
    expectedProbeCloud.L(p5);
    expectedProbeCloud.L(p3);
    expectedProbeCloud.L(p4);
    expectedProbeCloud.L(p3);
    expectedProbeCloud.L(p2);
    expectedProbeCloud.L(p1);
    expectedProbeCloud.Z();

    assertEquals(expectedProbeCloud.toSVGPathString(), actualProbeCloud.toSVGPathString());


};