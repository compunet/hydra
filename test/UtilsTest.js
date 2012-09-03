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

UtilsTest = TestCase("UtilsTest");

// test for function that generates IDs for AS links
UtilsTest.prototype.testIDCreation = function() {

    var idAS1 = "as1", idAS2 = "as2";
    var idASLink12 = "as1-as2";

    assertEquals(Utils.getConcatOrderedIDs(idAS1, idAS2), idASLink12);

};




// test array equality
UtilsTest.prototype.testSameArray = function() {

    var array1 = [1, 2, 3],
        array2 = [1, 2, 3],
        array3 = [4, 5, 6];

    assertEquals(array1, array2);
    assertNotEquals(array1, array3);

}
