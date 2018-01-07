// Copyright 2010 William Malone (www.williammalone.com)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var colorPurple = "#cb3594";
var colorGreen = "#659b41";
var colorYellow = "#ffcf33";
var colorBrown = "#986928";

/****************************************************************************** Simple Canvas With Sizes */

var clickX = new Array();
var clickY = new Array();

var clickDrag = new Array();
var clickColor = new Array();
var clickSize = new Array();

var paint  = false;
var canvas;
var context;
var curColor = colorPurple;
var curSize = "normal";

var canvasHeight;
var canvasWidth;

var canvasOffsetHeight;
var canvasOffsetWidth;


var socket = io();



var img = new Image;
img.onload = function(){
  redraw();
};
var url = location.search.replace('?img=','');
img.src = '/img/uploads/'+ url;



function prepareCanvas() {

	// Create the canvas (Neccessary for IE because it doesn't know what a canvas element is)
	var canvas = document.getElementById('canvas');
	var c = $(canvas) 

	canvasHeight = c.height();
	canvasWidth = c.width();

	canvasOffsetHeight = c.position().top;
	canvasOffsetWidth = c.position().left;

	canvas.setAttribute('width', canvasWidth);
	canvas.setAttribute('height', canvasHeight);

	context = canvas.getContext("2d"); 



	// Grab the 2d canvas context
	// Note: The above code is a workaround for IE 8 and lower. Otherwise we could have used:
	//     context = document.getElementById('canvas').getContext("2d");
	
	// Add mouse events
	// ----------------
	$(canvas).mousedown(function(e) {
		// Mouse down location
		var mouseX = e.pageX - canvasOffsetWidth;
		var mouseY = e.pageY - canvasOffsetHeight;
		
		paint = true;
		addClick(mouseX, mouseY, false);
	});
	
	$(canvas).mousemove(function(e){
		if(paint){
			addClick(e.pageX - canvasOffsetWidth, e.pageY - canvasOffsetHeight, true);
			
		}
	});
	
	$(canvas).mouseup(function(e){
		paint = false;
	  	redraw();
	});
	
	$(canvas).mouseleave(function(e){
		paint = false;
	});
	
	$('#choosePurple').mousedown(function(e){
		curColor = colorPurple;
	});
	$('#chooseGreen').mousedown(function(e){
		curColor = colorGreen;
	});
	$('#chooseYellow').mousedown(function(e){
		curColor = colorYellow;
	});
	$('#chooseBrown').mousedown(function(e){
		curColor = colorBrown;
	});	
	$('#chooseSmall').mousedown(function(e){
		curSize = "small";
	});
	$('#chooseNormal').mousedown(function(e){
		curSize = "normal";
	});
	$('#chooseLarge').mousedown(function(e){
		curSize = "large";
	});
	$('#chooseHuge').mousedown(function(e){
		curSize = "huge";
	});
	
	$('#clearCanvas').mousedown(function(e)
	{
		clickX = new Array();
		clickY = new Array();
		clickDrag = new Array();
		clickColor = new Array();
		clickSize = new Array();
		clearCanvas();

		socket.emit('CLEAR');

	});
}

function addClick(x, y, dragging) {
	
	// clickX.push(x);
	// clickY.push(y);
	// clickDrag.push(dragging);
	// clickColor.push(curColor);
	// clickSize.push(curSize);
   
    socket.emit('NEW_CLICK', {
    	x:x,
    	y:y,
    	dragging:dragging,
    	curColor:curColor,
    	curSize:curSize
    });

    redraw();
}




function addClickSocket(x, y, dragging, curColor, curSize) {
	
	clickX.push(x);
	clickY.push(y);
	clickDrag.push(dragging);
	clickColor.push(curColor);
	clickSize.push(curSize);

	redraw();
}

socket.on('NEW_CLICK', function(dataClick){
  addClickSocket(dataClick.x, dataClick.y, dataClick.dragging, dataClick.curColor, dataClick.curSize);
}); 


socket.emit('DRAW', {
	clickX: clickX,
	clickY: clickY,
	clickDrag: clickDrag,
	clickColor: clickColor,
	clickSize: clickSize
});



socket.on('DRAW', function(draw){

	clickX = clickX.concat( draw.clickX);
	clickY = clickY.concat( draw.clickY);
	clickDrag = clickDrag.concat( draw.clickDrag);
	clickColor = clickColor.concat( draw.clickColor);
	clickSize = clickSize.concat( draw.clickSize);
	redraw();
});

socket.on('CLEAR', function(draw){

	clickX = [];
	clickY = [];
	clickDrag = [];
	clickColor = [];
	clickSize = [];
	redraw();
});


function clearCanvas() {
	context.clearRect(0, 0, canvasWidth, canvasHeight);
}

function redraw() {
	clearCanvas();

	context.drawImage(img,0,0); // Or at whatever offset you like
	
	var radius;
	context.lineJoin = "round";
	
			
	for(var i=0; i < clickX.length; i++) {

		if(clickSize[i] == "small"){
			radius = 2;
		}else if(clickSize[i] == "normal"){
			radius = 5;
		}else if(clickSize[i] == "large"){
			radius = 10;
		}else if(clickSize[i] == "huge"){
			radius = 20;
		}
	
		context.beginPath();
		if(clickDrag[i] && i){
			context.moveTo(clickX[i-1], clickY[i-1]);
		}else{
			context.moveTo(clickX[i], clickY[i]);
		}
		context.lineTo(clickX[i], clickY[i]);
		context.lineWidth = radius;
		context.strokeStyle = clickColor[i];
		context.closePath();
		context.stroke();
	}
}

prepareCanvas();




  var username = "Escribe tu nombre!";
  if (username != null) {
    socket.emit('NEW_USER', username);
  }

  $('#form').submit(function(event){

    socket.emit('chat message', { usuario : usuario, mensaje : $('#message').val() });
    $('#message').val('');
    return false;
  });

    socket.on('chat message', function(msg){
        
        $('#cuerpo-chat').append($('<li>').html('<strong>'+msg.usuario+'</strong>: '+msg.mensaje));
    });

    socket.on('new user', function(usuarios){
        $('#cuerpo-online').html('');
        $.each(usuarios, function(i, usuario){
            $('#cuerpo-online').append($('<li>').text(usuario));
        });
    }); 