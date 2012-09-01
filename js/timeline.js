

const timelineContainerStyleDefault = {
    stroke: "Grey",
    fill: "LightBlue",
    "stroke-width": 1,
    "stroke-opacity": 1,
    "fill-opacity": 0.3
};
const timelineLinesStyleDefauls = {
    stroke: "Grey",
    fill: "LightGrey",
    "stroke-width": 2,
    "stroke-opacity": 1
};
const timelineTStyleDefauls = {
    stroke: "Grey",
    fill: "LightPink",
    "stroke-width": 2,
    "stroke-opacity": 1,
    "fill-opacity": 0.3
};




var windowWith, currentWindowCenterX, timelineContainerWidth, timelineContainerHeight, timelineHeight, timelineWidth, upperLineY,  bottomLineY;
var TElement;

var timeStampToYCoordinate = function(timestamp){
    var paddingpixels = 40;
    var timeframe = events[events.length-1].timestamp - events[0].timestamp;
    return paddingpixels+((timelineWidth-2*paddingpixels)*timestamp/timeframe);
}

var animateTElement = function(event){
    console.log(currentWindowCenterX);
    currentWindowCenterX = timeStampToYCoordinate(event.timestamp);
    TElement.animate({path: createTPath(currentWindowCenterX).toSVGPathString()},2000);
    console.log(currentWindowCenterX);
}

var createTPath = function(currentWindowCenterX){
    var TPath = SVGPath();

    TPath.M({x: 20, y: 20});
    TPath.L({x: timelineContainerWidth-20, y: 20});
    TPath.L({x: timelineContainerWidth-20, y: timelineHeight-20});
    TPath.L({x: Math.min(timelineContainerWidth-20, currentWindowCenterX+windowWith*0.5), y: timelineHeight-20});
    TPath.L({x: Math.min(timelineContainerWidth-20, currentWindowCenterX+windowWith*0.5), y: 2*timelineHeight-20});
    TPath.L({x: Math.max(20, currentWindowCenterX-windowWith*0.5), y: 2*timelineHeight-20});
    TPath.L({x: Math.max(20, currentWindowCenterX-windowWith*0.5), y: timelineHeight-20});
    TPath.L({x: 20, y: timelineHeight-20});
    TPath.Z();

    return TPath;
}

var initTimeline = function(){
    var RWidth = R.width;
    var RHeight = R.height;
    timelineContainerWidth = RWidth;
    timelineContainerHeight = 200;
    timelineHeight = timelineContainerHeight*0.5;
    timelineWidth = timelineContainerWidth*0.9;
    upperLineY = timelineHeight*0.5;
    bottomLineY = timelineHeight*1.5;

    windowWith = 100;
    currentWindowCenterX = timeStampToYCoordinate(50);



    var TIMELINEELEMENT = R.set();


    var timelineContainerElement = R.rect(
        0,
        0,
        timelineContainerWidth,
        timelineContainerHeight,
        20
    ).attr(
        timelineContainerStyleDefault
    );

    TIMELINEELEMENT.push(timelineContainerElement);


    var upperLinePath = SVGPath();
    upperLinePath.M({x: (timelineContainerWidth-timelineWidth)*0.5, y: upperLineY});
    upperLinePath.L({x: (timelineContainerWidth-timelineWidth)*0.5+timelineWidth, y: upperLineY});
    upperLinePath.Z();
    var upperLineElement = R.path(upperLinePath.toSVGPathString()).attr(timelineLinesStyleDefauls);

    TIMELINEELEMENT.push(upperLineElement);


    var bottomLinePath = SVGPath();
    bottomLinePath.M({x: (timelineContainerWidth-timelineWidth)*0.5, y: bottomLineY});
    bottomLinePath.L({x: (timelineContainerWidth-timelineWidth)*0.5+timelineWidth, y: bottomLineY});
    bottomLinePath.Z();
    var bottomLineElement = R.path(bottomLinePath.toSVGPathString()).attr(timelineLinesStyleDefauls);
    TIMELINEELEMENT.push(bottomLineElement);


    var TPath = createTPath(currentWindowCenterX);
    TElement = R.path(TPath.toSVGPathString()).attr(timelineTStyleDefauls);
    TIMELINEELEMENT.push(TElement);



    TIMELINEELEMENT.translate(0,RHeight-timelineContainerHeight);
};
