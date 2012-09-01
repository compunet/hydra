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

var EMST = function(){

    function euclideanMinDistancePoints(S, notS){
        var edge = {indexS: 0, indexNotS: 0, distance: 99999};

        for(var i = 0; i < S.length; i++){
            for(var j = 0; j < notS.length; j++){
                var newDistance = Geometry.pointDistance(S[i].getCenter(), notS[j].getCenter());
                if(newDistance < edge.distance){
                    edge = {indexS: i, indexNotS: j, distance: newDistance};
                }
            }
        }
        return edge;
    };

    function tree(){
        var parent = null;
        var neighbours = new Array();
        var angle = 0;
        return {
            parent: function(){
                return parent;
            },
            getAngle: function(){
                return angle;
            },
            setAngle: function(a){
                angle = a;
            },
            neighbours: function(){
                return neighbours
            },
            setParent : function(el){
                parent = el;
            },
            addNeighbour: function(el){
                neighbours.push(el);
            },
            sortAngles: function(){
                neighbours.sort(
                    function(n1,n2){
                        if(n1.EMST.angle>=n2.EMST.angle){
                            return 1;
                        }else{
                            return -1;
                        }
                    }
                );
            }
        }
    };


    return {
        computeEMST : function(points){
            if(points == null || points.length == 0){
                throw new Error("EMST: input error");
            }

            var S = new Array();
            var notS = new Array().concat(points);


            /* Add EMST variable to any point */
            for(var i = 0; i < notS.length; i++){
                notS[i].EMST = tree();
            }

            /*Just pick a starting root element
             * Note: S will contains the EMST at the end of the procedure
             * */
            S.push(notS.removeElementAtIndex(0));


            while(!notS.isEmpty()){
                edge = euclideanMinDistancePoints(S,notS); //[pointIndexInS, pointIndexInNotS]
                //console.log(edge);

                elS = S[edge.indexS];
                elNotS = notS[edge.indexNotS];

                elS.EMST.addNeighbour(elNotS);
                elNotS.EMST.setParent(elS);


                S.push(notS.removeElementAtIndex(edge.indexNotS));

            }


/*            console.log("Tree: ");
            for(var i = 0; i < S.length; i++){
                //console.log("Parent: " +S[i].emst.parent());
                console.log(i);
                console.log(S[i].EMST.parent());
                console.log(S[i].getCenter().x + " " + S[i].getCenter().y);
                console.log(S[i].EMST.neighbours());
            }*/

            /*This is the root of the EMST*/
            return S[0];
        },
        computeCloud : function (root){

            root.EMST.setParent({center: {x: root.getCenter().x, y: root.getCenter().y - 10}}); /*Fake parent of the root...to be removed*/


            var angleBetweenPoints  = function (p1,c,p2){
                var m1 = (p1.x-c.x)/(p1.y-c.y);
                var m2 = (p2.x-c.x)/(p2.y-c.y);
                return Math.atan((m2-m1)/(1+m1*m2));
            };

            var reorderClockwise = function (node, referNode){
                if(node.EMST.neighbours().isEmpty()){
                    return;
                }else{
                    for(var i = 0; i<node.EMST.neighbours(); i++){



                        //TO DO
                        //TO DO
                        //TO DO


                        neighbour = node.neighbours()[i];
                        neighbour.EMST.setAngle(
                            angleBetweenPoints(node.EMST.getParent().getCenter(),node.getCenter(),neighbour.getCenter())
                        );

                        reorderClockwise(neighbour, node);
                    }
                    node.EMST.sortAngles();
                }
            };


            reorderClockwise(root, root.EMST.parent());
            root.EMST.setParent(null);                                                      /*Fake parent removal*/



            var getBorder = function(node, command, svgPath){
                //var base = node.getCenter().x + " " + node.getCenter().y+ " ";
                //var path = command + base;
                if(command == 'm'){
                    svgPath.M(node.getCenter());
                }else if(command == 'l'){
                    svgPath.L(node.getCenter());
                }else{
                    console.error("Command not found in function getBorder");
                }
                for(var i = 0; i<node.EMST.neighbours().length; i++){
                    neighbour = node.EMST.neighbours()[i];
                    //path = path + getBorder(neighbour, "l") + "l "+ base;
                    getBorder(neighbour, "l", svgPath);
                    svgPath.L(node.getCenter());
                }

                return svgPath;
            };

            var svgp = SVGPath()
            getBorder(root, "m", svgp).Z();
            return svgp;
        }
    }
}();


