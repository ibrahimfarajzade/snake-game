
var target = null ;
var snake = { x: 5, y:5 } ;
var score = 0 ;
var body = [
    { x:5 , y:5},  
    { x:4 , y:5},  
    { x:3 , y:5},  
    { x:3 , y:6},  
    { x:3 , y:7},  
    
] ;

$(function() {
    var arena = createArena();
    $("#score").after(arena) ;
    $("#gamePanel td").click(function() {
        if ( target == null) {
            $("#" + body[0].x + "_" + body[0].y).qtip('disable');
            var id = $(this).attr("id") ;
            var pos = id.split("_") ;
            target = { x : pos[0] , y : pos[1] } ;
            if ( !$(this).hasClass('snake')) {
             showApple();
             $("#" + body[0].x + "_" + body[0].y).qtip('disable');
           } else {
               target = null ;
           }
        }
    }) ;
    
    var timer = setInterval(function(){
        var no ;
        if ( target != null) {
           
            var dirX = (target.x - body[0].x) > 0 ? 1 : -1 ;
            var dirY = (target.y - body[0].y) > 0 ? 1 : -1 ;
            if ( target.x != body[0].x) {
                if ( checkSnake(body[0], dirX, 0)) {
                    if ( body[0].y + dirY < 0 ) {
                        dirY = 1 ;
                    }
                    moveSnake(0, dirY) ;
                } else {
                  moveSnake(dirX,0) ;
               }
            } else if( target.y != body[0].y ) {
                if ( checkSnake(body[0], 0, dirY)) {
                   
                    if ( body[0].x + dirX < 0 ) dirX = 1 ;
                    moveSnake(dirX, 0) ;
                } else {
                  moveSnake(0,dirY) ;
               }
            } else {
                console.log("GAME IS OVER");
                score += 100 ;
                $("#score").html(score).css({ 'font-size' : '20px', opacity : 0})
                        .show()
                        .animate({'font-size' : '160px', opacity: 0.3}, 400)
                        .delay(200)
                        .animate({opacity: 0}, 400 , function(){ $(this).hide();})
                hideSnake(target);
                 target = null;
                 $("#" + body[0].x + "_" + body[0].y).qtip({
        content : {
            text : 'Please some food...',
            title : 'Snake says:'
        }
    }) ;
            }
            showFullSnake();
            
        }
    }, 200) ;
    
    $("#gridBox").change(function(){
        if ( !$(this).is(":checked")) {
            $("#gamePanel td").css("border", "none") ;
            $("#gridState").html("GRID OFF");
        } else {
            $("#gamePanel td").css("border", "1px solid #DDD") ;
            $("#gridState").html("GRID ON");
        }
    });
    
    showFullSnake();
    
    //$("")
    $("#" + body[0].x + "_" + body[0].y).qtip({
        content : {
            text : 'Please some food...',
            title : 'Snake says:'
        }
    }) ;
    
    
});

function moveSnake(dx, dy) {
    for ( var i=0; i<body.length; i++) {
        hideSnake(body[i]);
    }
    
    for ( var i=body.length-1; i>0; i--) {
        body[i].x = body[i-1].x ;
        body[i].y = body[i-1].y ;
    }
    body[0].x += dx ;
    body[0].y += dy ;
}

function checkSnake(pos, dirX, dirY) {
    var p = {} ;
    p.x = pos.x + dirX ;
    p.y = pos.y + dirY ;
    return testSnake(p);
}

function hideSnake(pos) {
    $("td#" + pos.x + "_" + pos.y).css("background", "white").html("").removeClass('snake');
}

function testSnake(pos) {
    return $("td#" + pos.x + "_" + pos.y).hasClass('snake');
}

function showApple() {
    $("td#" + target.x + "_" + target.y).css("background", "url(snake-graphics.png) no-repeat 0px -192px") ;
}

function tile(pos, tileNo) {
    var x = -(tileNo % 5) * 64  + "px" ;
    var y = -1*Math.floor(tileNo / 5 ) * 64 + "px" ;
    $("td#" + pos.x + "_" + pos.y).css("background", "url(snake-graphics.png) no-repeat " + x + " " + y).addClass('snake') ;
}


function findTail() {
   var tailPos= [[0, 14, 0], [19,0,13], [0,18,0] ];
   var last = body[ body.length - 1 ] ;
   var prev = body[ body.length - 2] ;
   var dx = (last.x - prev.x) + 1 ;
   var dy = (last.y - prev.y) + 1 ;
   return tailPos[dx][dy];
}

function findHead() {
    var headPos= [[0, 8, 0], [3,0,9], [0,4,0] ];
    var head = body[0] ;
    var next = body[1] ;
    var dx = (head.x - next.x) + 1 ;
    var dy = (head.y - next.y) + 1 ;
    console.log(dx + " " + dy) ;
    return headPos[dx][dy];
}

function findBody(index) {
    var prev = index + 1 ;
    var next = index - 1 ;
    var bx = body[index].x - body[prev].x ;
    var ax = body[next].x - body[index].x ;
    var dy = body[next].y - body[prev].y ;
    if ( bx == 0 && ax == 0 ) return 7;
    if ( (bx == 1 && ax == 1) || (bx==-1 && ax == -1)) return 1;
    if ( (bx == 1 && ax == 0 && dy == -1) || (bx == 0 && ax == -1 && dy == 1) ) return 12;
    if ( (bx == 1 && ax == 0 && dy ==  1) || (bx == 0 && ax == -1 && dy ==  -1) ) return  2;
    if ( (bx == 0 && ax == 1 && dy ==  1) || (bx == -1 && ax ==0 && dy ==  -1)) return 5;
    
    console.log("Exception") ;
    return 0 ;
}
function showFullSnake() {
    
    var tail = findTail();
    var head = findHead() ;
    tile(body[0], head) ;
    tile(body[body.length-1], tail) ;
    for ( var i=1; i < body.length - 1 ; i++) {
        tile(body[i], findBody(i));
    }
}



function createArena() {
    var html = "<table id='gameArena'>" ;
    for ( var i=0; i<10; i++) {
        html += "<tr>" ;
        for ( var j=0; j<10; j++) {
            html += "<td id='" + j + "_" + i +"'></td>" ;
        }
        html += "</tr>" ;
    }
    html += "</table>" ;
    return html ;
}


