
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
