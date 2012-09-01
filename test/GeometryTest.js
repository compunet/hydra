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