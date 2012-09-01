
GeometryTest = TestCase("GeometryTest");

// test point distance function
GeometryTest.prototype.testPointDistance = function() {

    // same x
    var p1 = Point(10, 20),
        p2 = Point(10, 40);
    assertEquals(20, Geometry.pointDistance(p1, p2));

    // general case
    p1 = Point(4, 0);
    p2 = Point(0, 3);
    assertEqualsDelta(5, Geometry.pointDistance(p1, p2), 0.001);

};

// test direction function
GeometryTest.prototype.testDirection = function() {

    // same x
    var p1 = Point(10, 20),
        p2 = Point(10, 40);
    var expectedDirection = Point(0, 1),
        actualDirection = Geometry.direction(p1, p2);
    assertEqualsDelta(
        expectedDirection.x,
        actualDirection.x,
        0.001
    );
    assertEqualsDelta(
        expectedDirection.y,
        actualDirection.y,
        0.001
    );

    // 45 degrees
    p1 = Point(0, 0);
    p2 = Point(0.3, 0.3);
    expectedDirection = Point(Math.sqrt(1/2), Math.sqrt(1/2));
    actualDirection = Geometry.direction(p1, p2);
    assertEqualsDelta(
        expectedDirection.x,
        actualDirection.x,
        0.001
    );
    assertEqualsDelta(
        expectedDirection.y,
        actualDirection.y,
        0.001
    );

};

// test left/right (perpendicular) direction
GeometryTest.prototype.testLeftAndRightDirection = function() {

    var direction = Point(
            + Math.sqrt(1/5),
            + Math.sqrt(4/5)
        ),
        left = Point(
            - Math.sqrt(4/5),
            + Math.sqrt(1/5)
        ),
        right = Point(
            + Math.sqrt(4/5),
            - Math.sqrt(1/5)
        );

    // left
    assertEqualsDelta(
        left,
        Geometry.left(direction),
        0.001
    );

    // right
    assertEqualsDelta(
        right,
        Geometry.right(direction),
        0.001
    );

};

// test right triangle leg function
GeometryTest.prototype.testRightTriangleLeg = function() {

    var hypotenuse = 5,
        otherLeg = 3;
    assertEqualsDelta(4, Geometry.leg(hypotenuse, otherLeg), 0.001);

};