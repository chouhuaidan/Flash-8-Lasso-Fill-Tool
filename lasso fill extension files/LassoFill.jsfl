var thePath;
var startX;
var startY;
var smoothing=0;

function configureTool(){

    var myTool = fl.tools.activeTool;
	

    myTool.setToolName("LassoFill");
    myTool.setIcon("LassoFill.png");
    myTool.setMenuString("Lasso Fill Tool");
    myTool.setToolTip("Lasso Fill Tool"); 
	myTool.setOptionsFile( "LassoFill.xml" );
	smoothing = fl.tools.activeTool.smoothingThreshold;
}

function activate(){
	fl.tools.activeTool = "LassoFill";
	
}

function notifySettingsChanged()
{
	
	smoothing = fl.tools.activeTool.smoothingThreshold;
	
}


function mouseDown(){

	startX = fl.tools.penLoc.x;
	startY = fl.tools.penLoc.y;
    
	
	

    fl.drawingLayer.beginDraw();
    thePath = fl.drawingLayer.newPath();

    thePath.addPoint(startX, startY);
}



function mouseMove(){

    if(fl.tools.mouseIsDown){

        thePath.addPoint(fl.tools.penLoc.x, fl.tools.penLoc.y);

        fl.drawingLayer.beginFrame();
        fl.drawingLayer.drawPath(thePath);
        fl.drawingLayer.endFrame();
    }
}


function mouseUp(){
	
    var dom = fl.getDocumentDOM();
	if(!fl.tools.altIsDown){
		thePath.addPoint(startX, startY);
	}
	
	
	var timeline = dom.getTimeline();
    var layers = timeline.layers;
	var frame = layers[timeline.currentLayer].frames[timeline.currentFrame];
	var selectedLayer = timeline.getSelectedLayers();
	var curLayer = -1;
	if(selectedLayer.length>0){
		curLayer = selectedLayer[0];
	}
	
	var ogList = [];

    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        
        
        if (!layer.locked) {
            ogList.push(i);
			
        }
		timeline.layers[i].locked = true;
    }
	
	if(curLayer !=-1){
		timeline.layers[curLayer].locked = false;
	}
	

    

	var pressed = fl.tools.shiftIsDown;
	
	
    if(pressed && timeline.layers[curLayer].frames[timeline.currentFrame].elements.length>0){
        // --- SEND TO BACK LOGIC ---

		dom.selectAll();
		fl.getDocumentDOM().group();
		
		thePath.makeShape(false, false);
		
		
		fl.drawingLayer.endDraw();
		
		dom.selectAll();
		
		fl.getDocumentDOM().unGroup();
		dom.selectNone();
		
		
	}else{
		
		
		thePath.makeShape(false, false);
		
		
    	fl.drawingLayer.endDraw();
		
	}
	/*
	if (frame.elements.length > 0 && smoothing != 0) {
			frame.elements[frame.elements.length - 1].selected = true;
			fl.getDocumentDOM().optimizeCurves(smoothing, true);
			//frame.elements[frame.elements.length - 1].selected = false;
		}*/	
	
	for(var i = 0; i<ogList.length; ++i){
	
		timeline.layers[ogList[i]].locked = false;
	}

	
}
