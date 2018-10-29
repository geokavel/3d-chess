const color = "Black";
const pieces = ["N","B","R","Q","K"];
const urls = ["https://image.ibb.co/gyS9Cx/Black_N.png","https://image.ibb.co/dknnzc/Black_B.png","https://image.ibb.co/kb3hXx/Black_R.png","https://image.ibb.co/hGO5kH/Black_Q.png","https://image.ibb.co/jApd5H/Black_K.png"];
var dragPiece;
var size = 3;
var index = 0;
function start() {
Array.prototype.add = function(a) {return [this[0]+a[0],this[1]+a[1],this[2]+a[2]]};

document.getElementById("n").onchange=function() {
	size = parseInt(this.value);
	var s = document.getElementsByClassName("selected");
	var pos;
	if(s.length > 0) {
		pos = s[0].pos;
	}
	document.body.removeChild(document.body.firstChild);
	createBoards();
	if(pos != null && valid(...pos)) {
	cellAt(...pos).click();
	}
};
createBoards();
}

function createBoards() {
var boards = document.createElement("div");
boards.style.counterReset = "board-count "+(size+1);
boards.name=size;
for(var x = 0;x<size;x++) {
var t = document.createElement("table");
for(var i = 0;i<size;i++) {
  var row = document.createElement("tr");
  row.className="row";
  for(var j = 0;j<size;j++) {
  	var cell = document.createElement("td");
    cell.className = (size+i+j)%2 == 1 ? "black" : "white";
    var im = document.createElement("img");
    im.draggable = true;
    im.ondragstart = function(e) {dragPiece = this;e.dataTransfer.setData("piece",this.parentElement.name);
    this.parentElement.classList.add("start");
    this.classList.add("dragged");
    };
    im.ondragend = function(e) {this.parentElement.classList.remove("start");this.classList.remove("dragged");};
    im.hidden = true;
    cell.appendChild(im);
    cell.pos = [j,i,x];
    cell.ondragover = function(e) {e.preventDefault();};
    cell.ondragenter = function(e) {this.classList.add("drag");};
    cell.ondragleave = function(e) {this.classList.remove("drag");};
    cell.ondrop = function(e) { e.preventDefault();this.classList.remove("drag");
    if(this != dragPiece.parentElement && this.firstChild.hidden ){
    dragPiece.hidden=true;
    setPiece(this,e.dataTransfer.getData("piece"));
    }
    
    };
    cell.onclick = function() {
    if(this.firstChild.hidden == false && this.classList.contains("selected")) {
		index++;
    	if(index == pieces.length) index = 0;
    }
     	setPiece(this,pieces[index]);
    };
  
    
    row.appendChild(cell);
  }
  t.appendChild(row);
  }
  boards.appendChild(t);
  }
  document.body.insertBefore(boards,document.body.firstChild);
}



function clearHighlighted() {
	var sel =  document.getElementsByClassName("highlighted");
     while(sel.length > 0) {
     	sel[0].classList.remove("highlighted");
     }
}

function setPiece(cell,piece) {
var s=document.getElementsByClassName("selected");
if(s.length > 0){ s[0].firstChild.hidden=true;s[0].classList.remove("selected");}
cell.classList.add("selected");
cell.firstChild.hidden = false;
cell.name = piece;
     	cell.firstChild.src = urls[index];
     clearHighlighted();
     	showMoves(cell,piece);
}

function showMoves(cell,piece) {
	if(piece=="K") selector(cell,kingTest)
	else if(piece=="N") selector(cell,knightTest);
	else if(piece=="Q") selector(cell,queenTest);
	else if(piece=="R") selector(cell,rookTest);
	else if(piece=="B") selector(cell,bishopTest);
}

function cellAt(col,row,board) {
	return document.body.firstChild.children[board].children[row].children[col];
}

function valid(col,row,board) {
	return 0<=col && col<size && 0<=row && row<size && 0<=board && board<size;
}

function select(cell) {
if(cell != null && cell.firstChild.hidden) cell.classList.add("highlighted");
}



function rookTest(dist) {
	var d = [].concat(dist).sort();
	return d[0] == 0 && d[1] == 0;
}

function knightTest(dist) {
	var d = [].concat(dist).sort();
	return d[0] == 0 && d[1] == 1 && d[2] == 2;
}

function kingTest(dist) {
	return dist[0] <= 1 && dist[1] <= 1 && dist[2] <= 1;
}

function bishopTest(dist) {
	return dist[0]==dist[1] && dist[1]==dist[2];
}

function queenTest(dist) {
	var d = [].concat(dist).sort();
	return rookTest(dist) || bishopTest(dist) || (d[0]==0 && d[1]==d[2]) ;
}

function dist(cell,x,y,z) {
	return [Math.abs(cell.pos[0]-x),Math.abs(cell.pos[1]-y),Math.abs(cell.pos[2]-z)];
}

function selector(cell,test) {
	for(var i = 0;i<size;i++) {
		for(var j = 0;j<size;j++) {
			for(var k = 0;k<size;k++) {
			if(test(dist(cell,k,j,i))) {
				var c = cellAt(k,j,i);
				if(c != cell) select(c);
			}
			}
			}
			}
	
}