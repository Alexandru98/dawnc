var id = 1;
var pieces = [];
var sx = 0, sy = 0;



function drawImage(category) {
    
    if (document.getElementById("pick") != null) {
        document.getElementById("pick").remove();
    }
	if(typeof(Storage) !== "undefined") {
		localStorage.setItem("category", JSON.stringify(category));
		var category = localStorage.getItem("category");
    }
	//var img = sessionStorage.getItem("imgPath");
	//document.getElementById("ph").innerHTML = '<img src="' + img + '">/';
    if (category == 1) {
        numOfPieces = 3;
    } else if (category == 2) {
        numOfPieces = 4;
    } else {
        numOfPieces = 5;
    }
	

    for (var i = 1; i <= numOfPieces * numOfPieces; i++) {
        let promise = loadImage(sessionStorage.getItem("imgPath"));

        promise.then(
            image => draw(sessionStorage.getItem("imgPath"), numOfPieces),
            error => alert(`Error: ${error.message}`)
        );
    }
    
}

function loadImage(src) {
    return new Promise(function(resolve, reject) {
        var image = new Image();
        image.src = src;

        image.onload = () => resolve(src);
        image.onerror = () => reject(new Error("Image load error: " + src));
    });
}

function draw(img, numOfPieces) {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    var image = new Image();
    
    image.src = img;
	let w = 900/numOfPieces, h = 600/numOfPieces;

    let x = w/4, y = h/4;
    let top = [];
    let right = [];
    let bottom = [];
    let left = [];

    canvas.width = 2 * x + w/8 * 7 - 5;
    canvas.height = 2 * y + h/8 * 7 - 5;
    canvas.setAttribute("id", id);

    canvas = setPosition(canvas);

    let piece = new Piece(x, y, w, h, id);
    piece.establishMargins();
    top = piece.top;
    right = piece.right;
    bottom = piece.bottom;
    left = piece.left;
    
    context.save();
    context.beginPath();
    context.moveTo(x, y);

    // top
    if (id <= numOfPieces) {
        context.lineTo(x + w, y);
    } else {
        top = pieces[id - numOfPieces - 1].bottom;

        context.lineTo(top[2].x, top[2].y - h);
        context.lineTo(top[1].x, top[1].y - h);
        context.lineTo(top[0].x, top[0].y - h);
        context.lineTo(x + w, y);
    }

    // right
    if (id % numOfPieces == 0) {
        context.lineTo(x + w, y + h);
    } else {
        context.lineTo(right[0].x, right[0].y);
        context.lineTo(right[1].x, right[1].y);
        context.lineTo(right[2].x, right[2].y);
        context.lineTo(x + w, y + h);
    }

    // bottom
    if (id <= numOfPieces * numOfPieces && id > numOfPieces * numOfPieces - numOfPieces) {
        context.lineTo(x, y + h);
    } else {
        context.lineTo(bottom[0].x, bottom[0].y);
        context.lineTo(bottom[1].x, bottom[1].y);
        context.lineTo(bottom[2].x, bottom[2].y);
        context.lineTo(x, y + h);
    }

    // left
    if (id % numOfPieces == 1) {
        context.lineTo(x, y);
    } else {
        left = pieces[id - 2].right;

        context.lineTo(left[2].x - w, left[2].y);
        context.lineTo(left[1].x - w, left[1].y);
        context.lineTo(left[0].x - w, left[0].y);
        context.lineTo(x, y);
    }
    context.closePath();
    context.clip();

	context.drawImage(image, sx, sy, 900, 449, 0, 0, 900, 449);

    context.restore();

    document.getElementById("photo").appendChild(canvas);
	if (numOfPieces == 3)		
	{
		dragAndDropEasy(id);
	}
	else
		if(numOfPieces == 4)
		{
			dragAndDropMedium(id);
		}
		else
		{
			dragAndDropHard(id);
		}
		
    pieces.push(piece);
	
	console.log("piece nr:", id, piece.x, piece.y);

    sx = sx + w;
	if (sx >= 900) {
        sx = 0;
        sy = sy + h;
    }
    id++;
}

class Piece {
    constructor(x, y, w, h, id) {
        this.top = [];
        this.right = [];
        this.bottom = [];
        this.left = [];
        this.w = w;
        this.h = h;
        this.x = x;
        this.y = y;
        this.id = id;
    }

    establishMargins() {
        let w = this.w;
        let h = this.h;
        let x = this.x;
        let y = this.y;

        this.top.push(new Point(randomInRange(x + w/4 - 5, x + w/4 + 5), randomInRange(y + h/8 - 5, y + h/8 + 5)));
        this.top.push(new Point(randomInRange(x + w/2 - 5, x + w/2 + 5), randomInRange(y, y + 5)));
        this.top.push(new Point(randomInRange(x + w/4*3 - 5, x + w/4*3 + 5), randomInRange(y + h/8 - 5, y + h/8 + 5)));
        this.right.push(new Point(randomInRange(x + w/8*7 - 5, x + w/8*7 + 5), randomInRange(y + h/4 - 5, y + h/4 + 5)));
        this.right.push(new Point(randomInRange(x + w - 5, x + w), randomInRange(y + h/2 - 5, y + h/2 + 5)));
        this.right.push(new Point(randomInRange(x + w/8*7 - 5, x + w/8*7 + 5), randomInRange(y + h/4*3 - 5, y + h/4*3 + 5)));
        this.bottom.push(new Point(randomInRange(x + w/4*3 - 5, x + w/4*3 + 5), randomInRange(y + h/8*7 - 5, y + h/8*7 + 5)));
        this.bottom.push(new Point(randomInRange(x + w/2 - 5, x + w/2 + 5), randomInRange(y + h - 5, y + h)));
        this.bottom.push(new Point(randomInRange(x + w/4 - 5, x + w/4 + 5), randomInRange(y + h/8*7 - 5, y + h/8*7 + 5)));
        this.left.push(new Point(randomInRange(x + w/8 - 5, x + w/8 + 5), randomInRange(y + h/4*3 - 5, y + h/4*3 + 5)));
        this.left.push(new Point(randomInRange(x, x + 5), randomInRange(y + h/2 - 5, y + h/2 + 5)));
        this.left.push(new Point(randomInRange(x + w/8 - 5, x + w/8 + 5), randomInRange(y + h/4 - 5, y + h/4 + 5)));
    }
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}

function randomInRange(min, max) {
    return(Math.floor((0.7 * (max - min) + 1) + min));      
}

function setPosition(canvas) {
    var div = document.getElementById("photo");

    canvas.style.position = "absolute";
    canvas.style.top = "" + 800 + "px";
    canvas.style.left = "" + 0 + "px";

    return canvas;
}

function dragAndDropEasy(id) {
    var dragItem = document.getElementById(id);
    var container = document.getElementById("photo");

    var active = false;
    var currentX;
    var currentY;
    var initialX;
    var initialY;
    var xOffset = 0;
    var yOffset = 0;

    container.addEventListener("touchstart", dragStart, false);
    container.addEventListener("touchend", dragEnd, false);
    container.addEventListener("touchmove", drag, false);

    container.addEventListener("mousedown", dragStart, false);
    container.addEventListener("mouseup", dragEnd, false);
    container.addEventListener("mousemove", drag, false);

    function dragStart(e) {
      if (e.type === "touchstart") {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
      } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
		console.log("initial piece nr:", id, initialX, initialY);
      }

      if (e.target === dragItem) {
        active = true;
      }
    }

    function dragEnd(e) {
      initialX = currentX;
      initialY = currentY;

      active = false;
    }

    function drag(e) {
      if (active) {
      
        e.preventDefault();
      
        if (e.type === "touchmove") {
          currentX = e.touches[0].clientX - initialX;
          currentY = e.touches[0].clientY - initialY;
        } else {
          currentX = e.clientX - initialX;
          currentY = e.clientY - initialY;
        }

        xOffset = currentX;
        yOffset = currentY;
		
		if( id == "1" && (currentX < 20 || currentX > 20) && (currentY < 20 || currentY > 20))
		{
			setTranslate(0, 0, dragItem); 
		}
		else
			if( id == "2" && (300 - currentX < 20 || currentX - 300 > 20) && (currentY < 20 || currentY > 20))
			{
				setTranslate(300, 0, dragItem);
			}
			else
				if( id == "3" && (600 - currentX < 20 || currentX - 600 > 20) && (currentY < 20 || currentY > 20))
				{
					setTranslate(600, 0, dragItem);
				}
				else
					if( id == "4" && (currentX < 20 || currentX > 20) && (200 - currentY < 20 || currentY - 200 > 20))
					{
						setTranslate(0, 200, dragItem);
					}
					else
						if( id == "5" && (300 - currentX < 20 || currentX - 300 > 20) && (200 - currentY < 20 || currentY - 200 > 20))
						{
							setTranslate(300, 200, dragItem);
						}
						else
							if( id == "6" && (600 - currentX < 20 || currentX - 600 > 20) && (200 - currentY < 20 || currentY - 200 > 20))
							{
								setTranslate(600, 200, dragItem);
							}
							else
								if( id == "7" && (currentX < 20 || currentX > 20) && (400 - currentY < 20 || currentY - 400 > 20))
								{
									setTranslate(0, 400, dragItem);
								}
								else
									if( id == "8" && (300 - currentX < 20 || currentX - 300 > 20) && (400 - currentY < 20 || currentY - 400 > 20))
									{
										setTranslate(300, 400, dragItem);
									}
									else
										if ( id == "9" && ((600 - currentX < 20) || ((currentX - 600 > 10) && (currentX - 600 < 30)))  && (400 - currentY < 20 || currentY - 400 > 20)) 
										{
											setTranslate(600, 400, dragItem);
										}
										else
										{
											setTranslate(currentX, currentY, dragItem);
										}
      }
    }
}

function dragAndDropMedium(id) {
    var dragItem = document.getElementById(id);
    var container = document.getElementById("photo");

    var active = false;
    var currentX;
    var currentY;
    var initialX;
    var initialY;
    var xOffset = 0;
    var yOffset = 0;

    container.addEventListener("touchstart", dragStart, false);
    container.addEventListener("touchend", dragEnd, false);
    container.addEventListener("touchmove", drag, false);

    container.addEventListener("mousedown", dragStart, false);
    container.addEventListener("mouseup", dragEnd, false);
    container.addEventListener("mousemove", drag, false);

    function dragStart(e) {
      if (e.type === "touchstart") {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
      } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
		console.log("initial piece nr:", id, initialX, initialY);
      }

      if (e.target === dragItem) {
        active = true;
      }
    }

    function dragEnd(e) {
      initialX = currentX;
      initialY = currentY;

      active = false;
    }

    function drag(e) {
      if (active) {
      
        e.preventDefault();
      
        if (e.type === "touchmove") {
          currentX = e.touches[0].clientX - initialX;
          currentY = e.touches[0].clientY - initialY;
        } else {
          currentX = e.clientX - initialX;
          currentY = e.clientY - initialY;
        }

        xOffset = currentX;
        yOffset = currentY;
		
		if( id == "1" && (currentX < 20 || currentX > 20) && (currentY < 20 || currentY > 20))
		{
			setTranslate(0, 0, dragItem); 
		}
		else
		if( id == "2" && (225 - currentX < 20 || currentX - 225 > 20) && (currentY < 20 || currentY > 20))
		{
			setTranslate(225, 0, dragItem);
		}
		else
		if( id == "3" && (450 - currentX < 20 || currentX - 450 > 20) && (currentY < 20 || currentY > 20))
		{
			setTranslate(450, 0, dragItem);
		}
		else
		if( id == "4" && (675 - currentX < 20 || currentX - 675 > 20) && (currentY < 20 || currentY > 20))
		{
			setTranslate(675, 0, dragItem);
		}
		else
		if( id == "5" && (currentX < 20 || currentX > 20) && (150 - currentY < 20 || currentY - 150 > 20))
		{
			setTranslate(0, 150, dragItem);
		}
		else
		if( id == "6" && (225 - currentX < 20 || currentX - 225 > 20) && (150 - currentY < 20 || currentY - 150 > 20))
		{
			setTranslate(225, 150, dragItem);
		}
		else
		if( id == "7" && (450 - currentX < 20 || currentX - 450 > 20) && (150 - currentY < 20 || currentY - 150 > 20))
		{
			setTranslate(450, 150, dragItem);
		}
		else
		if( id == "8" && (675 - currentX < 20 || currentX - 675 > 20) && (150 - currentY < 20 || currentY - 150 > 20))
		{
			setTranslate(675, 150, dragItem);
		}
		else
		if( id == "9" && (currentX < 20 || currentX > 20) && (300 - currentY < 20 || currentY - 300 > 20))
		{
			setTranslate(0, 300, dragItem);
		}
		else
		if( id == "10" && (225 - currentX < 20 || currentX - 225 > 20) && (300 - currentY < 20 || currentY - 300 > 20))
		{
			setTranslate(225, 300, dragItem);
		}
		else
		if( id == "11" && (450 - currentX < 20 || currentX - 450 > 20) && (300 - currentY < 20 || currentY - 300 > 20))
		{
			setTranslate(450, 300, dragItem);
		}
		else
		if( id == "12" && (675 - currentX < 20 || currentX - 675 > 20) && (300 - currentY < 20 || currentY - 300 > 20))
		{
			setTranslate(675, 300, dragItem);
		}
		else
		if( id == "13" && (currentX < 20 || currentX > 20) && (450 - currentY < 20 || currentY - 450 > 20))
		{
			setTranslate(0, 450, dragItem);
		}
		else
		if( id == "14" && (225 - currentX < 20 || currentX - 225> 20) && (450 - currentY < 20 || currentY - 450 > 20))
		{
			setTranslate(225, 450, dragItem);
		}
		else
		if( id == "15" && (450 - currentX < 20 || currentX - 450 > 20) && (450 - currentY < 20 || currentY - 450 > 20))
		{
			setTranslate(450, 450, dragItem);
		}
		else
		if( id == "16" && (675 - currentX < 20 || currentX - 675 > 20) && (450 - currentY < 20 || currentY - 450 > 20))
		{
			setTranslate(675, 450, dragItem);
		}
		else
		{
			setTranslate(currentX, currentY, dragItem);
		}
      }
    }	
}

function dragAndDropHard(id) {
    var dragItem = document.getElementById(id);
    var container = document.getElementById("photo");

    var active = false;
    var currentX;
    var currentY;
    var initialX;
    var initialY;
    var xOffset = 0;
    var yOffset = 0;

    container.addEventListener("touchstart", dragStart, false);
    container.addEventListener("touchend", dragEnd, false);
    container.addEventListener("touchmove", drag, false);

    container.addEventListener("mousedown", dragStart, false);
    container.addEventListener("mouseup", dragEnd, false);
    container.addEventListener("mousemove", drag, false);

    function dragStart(e) {
      if (e.type === "touchstart") {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
      } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
		console.log("initial piece nr:", id, initialX, initialY);
      }

      if (e.target === dragItem) {
        active = true;
      }
    }

    function dragEnd(e) {
      initialX = currentX;
      initialY = currentY;

      active = false;
    }

    function drag(e) {
      if (active) {
      
        e.preventDefault();
      
        if (e.type === "touchmove") {
          currentX = e.touches[0].clientX - initialX;
          currentY = e.touches[0].clientY - initialY;
        } else {
          currentX = e.clientX - initialX;
          currentY = e.clientY - initialY;
        }

        xOffset = currentX;
        yOffset = currentY;
		
		if( id == "1" && (currentX < 20 || currentX > 20) && (currentY < 20 || currentY > 20))
		{
			setTranslate(0, 0, dragItem); 
		}
		else
		if( id == "2" && (180 - currentX < 20 || currentX - 180 > 20) && (currentY < 20 || currentY > 20))
		{
			setTranslate(180, 0, dragItem);
		}
		else
		if( id == "3" && (360 - currentX < 20 || currentX - 360 > 20) && (currentY < 20 || currentY > 20))
		{
			setTranslate(360, 0, dragItem);
		}
		else
		if( id == "4" && (540 - currentX < 20 || currentX - 540 > 20) && (currentY < 20 || currentY > 20))
		{
			setTranslate(540, 0, dragItem);
		}
		else
		if( id == "5" && (720 - currentX < 20 || currentX - 720 > 20) && (currentY < 20 || currentY > 20))
		{
			setTranslate(720, 0, dragItem);
		}
		else
		if( id == "6" && (currentX < 20 || currentX > 20) && (120 - currentY < 20 || currentY - 120 > 20))
		{
			setTranslate(0, 120, dragItem);
		}
		else
		if( id == "7" && (180 - currentX < 20 || currentX - 180 > 20) && (120 - currentY < 20 || currentY - 120 > 20))
		{
			setTranslate(180, 120, dragItem);
		}
		else
		if( id == "8" && (360 - currentX < 20 || currentX - 360 > 20) && (120 - currentY < 20 || currentY - 120 > 20))
		{
			setTranslate(360, 120, dragItem);
		}
		else
		if( id == "9" && (540 - currentX < 20 || currentX - 540 > 20) && (120 - currentY < 20 || currentY - 120 > 20))
		{
			setTranslate(540, 120, dragItem);
		}
		else
		if( id == "10" && (720 - currentX < 20 || currentX - 720 > 20) && (120 - currentY < 20 || currentY - 120 > 20))
		{
			setTranslate(720, 120, dragItem);
		}
		else
		if( id == "11" && (currentX < 20 || currentX > 20) && (240 - currentY < 20 || currentY - 240 > 20))
		{
			setTranslate(0, 240, dragItem);
		}
		else
		if( id == "12" && (180 - currentX < 20 || currentX - 180 > 20) && (240 - currentY < 20 || currentY - 240 > 20))
		{
			setTranslate(180, 240, dragItem);
		}
		else
		if( id == "13" && (360 - currentX < 20 || currentX - 360 > 20) && (240 - currentY < 20 || currentY - 240 > 20))
		{
			setTranslate(360, 240, dragItem);
		}
		else
		if( id == "14" && (540 - currentX < 20 || currentX - 540 > 20) && (240 - currentY < 20 || currentY - 240 > 20))
		{
			setTranslate(540, 240, dragItem);
		}
		else
		if( id == "15" && (720 - currentX < 20 || currentX - 720 > 20) && (240 - currentY < 20 || currentY - 240 > 20))
		{
			setTranslate(720, 240, dragItem);
		}
		else
		if( id == "16" && (currentX < 20 || currentX > 20) && (360 - currentY < 20 || currentY - 360 > 20))
		{
			setTranslate(0, 360, dragItem);
		}
		else
		if( id == "17" && (180 - currentX < 20 || currentX - 180 > 20) && (360 - currentY < 20 || currentY - 360 > 20))
		{
			setTranslate(180, 360, dragItem);
		}
		else
		if( id == "18" && (360 - currentX < 20 || currentX - 360 > 20) && (360 - currentY < 20 || currentY - 360 > 20))
		{
			setTranslate(360, 360, dragItem);
		}
		else
		if( id == "19" && (540 - currentX < 20 || currentX - 540 > 20) && (360 - currentY < 20 || currentY - 360 > 20))
		{
			setTranslate(540, 360, dragItem);
		}
		else
		if( id == "20" && (720 - currentX < 20 || currentX - 720 > 20) && (360 - currentY < 20 || currentY - 360 > 20))
		{
			setTranslate(720, 360, dragItem);
		}
		else
		if( id == "21" && (currentX < 20 || currentX > 20) && (480 - currentY < 20 || currentY - 480 > 20))
		{
			setTranslate(0, 480, dragItem);
		}
		else
		if( id == "22" && (180 - currentX < 20 || currentX - 180 > 20) && (480 - currentY < 20 || currentY - 480 > 20))
		{
			setTranslate(180, 480, dragItem);
		}
		else
		if( id == "23" && (360 - currentX < 20 || currentX - 360 > 20) && (480 - currentY < 20 || currentY - 480 > 20))
		{
			setTranslate(360, 480, dragItem);
		}
		else
		if( id == "24" && (540 - currentX < 20 || currentX - 540 > 20) && (480 - currentY < 20 || currentY - 480 > 20))
		{
			setTranslate(540, 480, dragItem);
		}
		else
		if( id == "25" && (720 - currentX < 20 || currentX - 720 > 20) && (480 - currentY < 20 || currentY - 480 > 20))
		{
			setTranslate(720, 480, dragItem);
		}
		else
		{
			setTranslate(currentX, currentY, dragItem);
		}
      }
    }
}
 function setTranslate(xPos, yPos, el) {
	 if(typeof(Storage) != "undefined"){
		 console.log("storageee");
	  save(xPos, yPos, el);
	  load();
      el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
	 console.log("drag piece nr:", id, xPos, yPos);}
}
function save(xPos, yPos, el) {
  localStorage.setItem('xPos', JSON.stringify(xPos));
  localStorage.setItem('yPos', JSON.stringify(yPos));
  localStorage.setItem('el', JSON.stringify(el));
}

function load() {
  xPos = JSON.parse(localStorage.getItem('xPos'));
  yPos = JSON.parse(localStorage.getItem('yPos'));
  el = JSON.parse(localStorage.getItem('el'));
}
