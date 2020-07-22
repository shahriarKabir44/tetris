var speed=400;
for(var n=1;n<=20;n++)
{
    for(var k=1;k<=20;k++)
    {
        var st="<div class='box' id="+n+'-'+k+"> </div>";
        //if(n==1)st="<div class='box' id="+n+'-'+k+">"+k+"</div>";
        //if(k==1)st="<div class='box' id="+n+'-'+k+">"+n+"</div>";
        
        document.getElementById('cont').innerHTML+=st;
    }
}

//user directions
window.alert("welcome to tetris! a classical game. It's the 8-th update! If you are on PC, you can use left,right and down arrow keys to navigate and Enter to rotate. If you are on mobile, you can use the touchpads! enjoy :)")
//controls event handling
document.getElementById('dr').onclick=function()
{
    speed=20;
}
document.getElementById('rot').onclick=function()
{
    //console.log(blox[0].btm);
    blox[blox.length-1].rotate();
}
document.getElementById('lf').onclick=function()
{
    blox[blox.length-1].movehr(-1);
}
document.getElementById('rt').onclick=function()
{
    blox[blox.length-1].movehr(1);
}
//controls end
function clean(x,y) //clear a cell at (x,y)
{
    grid[x][y]=-1;
    pres[x][y]=-1;
    document.getElementById(x+'-'+y).innerHTML=' ';
    document.getElementById(x+'-'+y).style.color='black';
    document.getElementById(x+'-'+y).style.background='white';
}
lk=String.fromCharCode(116,104,105,115,32,97,112,112,32,119,97,115,32,100,101,118,101,108,111,112,101,100,32,98,121,32,77,100,46,83,104,
    97,104,114,105,97,114,32,75,97,98,105,114,40,49,57,48,50,48,52,41);
function fix()
{
    for(var n=2;n<=20;n++)
    {
        for(var k=2;k<=20;k++)
        {
            var s=document.getElementById(n+'-'+k).innerHTML;
            if(s!=' ')
            {
                s*=1;
                var cur=mp.get(blox[s].color);
                document.getElementById(n+'-'+k).style.background=cur;
            }
        }
    }
}
function pos(x,y,col) // check if a cell can be cleaned at position (x,y) with color ==col
{
    if(x==0 || x==21 || y==0 || y==21)return 0;
    if(grid[x][y]!=col)return 0;
    return 1;
}

function clean1(x,y) //clear a cell at (x,y)
{
    grid[x][y]=-1;
    pres[x][y]=-1;
    document.getElementById(x+'-'+y).innerHTML=' ';
    document.getElementById(x+'-'+y).style.color='black';
    //document.getElementById(x+'-'+y).style.background='white';
}
function dfs(x,y,col) //basically use bfs. It basically implements a pathfinding algo to clear cells
{
    var bfs=[];
    bfs.push([x,y]);
    var vis=new Map();
    vis.set([x,y],1);
    clean1(x,y);
    var path=[];
    while(bfs.length)
    { 
        var a=bfs[0][0];
        var b=bfs[0][1];
        path.push([a,b]);
        bfs.shift();
        clean1(a,b);
        if(pos(a+1,b,col) && !vis.get([a+1,b]) )
        {
            bfs.push([a+1,b]);
            vis.set([a+1,b],1);
        }
        if(pos(a-1,b,col) && !vis.get([a-1,b]) )
        {
            bfs.push([a-1,b]);
            vis.set([a-1,b],1);
        }
        if(pos(a,b+1,col) && !vis.get([a,b+1]) )
        {
            bfs.push([a,b+1]);
            vis.set([a,b+1],1);
        }
        if(pos(a ,b-1,col) && !vis.get([a ,b-1]) )
        {
            bfs.push([a ,b-1]);
            vis.set([a,b-1],1);
        }
    }
    //console.log(path)
    foll(0,path);
    fix();
}
function foll(id,path)
{
    if(id==path.length)return;
    document.getElementById('score').innerHTML=document.getElementById('score').innerHTML*1+1;
    if(document.getElementById(path[id][0]  +'-'+ path[id][1] ).innerHTML==' ')
    {
        document.getElementById(path[id][0]  +'-'+ path[id][1] ).style.background='white';
        document.getElementById(path[id][0]  +'-'+ path[id][1] ).style.transform='rotate(720deg)';
    }
    setTimeout(function()
    {
        foll(id+1,path);
    },20);
}

window.addEventListener('keydown',fun,false);
function fun(e){
    var k=e.keyCode*1;
    if(k==37)blox[blox.length-1].movehr(-1);
    else if(k==39)blox[blox.length-1].movehr(1);
    else if(k==13)blox[blox.length-1].rotate();
    else if(k==40)speed=20;
}
var blox=[];
var mp=new Map();
var grid=new Array(21);
var pres=new Array(21);
var shapes=[[[1,0,1],[1,1,1],[1,0,1]] ,[ [1,0,0] ,[1,1,1],[1,0,0] ],[[1,0,0],[1,1,1],[0,0,1]], [[1,1,1],[1,0,0],[1,1,1]], [ [1,0,0],[1,0,0],[1,1,1] ] ,[[1,1,1],[1,1,1],[1,1,1]]];
clrs=['red','green','blue','yellow','purple','pink'];
for(var n=0;n<6;n++)mp.set(n,clrs[n]);
for(var n=0;n<21;n++) //initialize the whole grid
{
    grid[n]=new Array(21);
    pres[n]=new Array(21);
    for(var k=0;k<21;k++)
    {
        grid[n][k]=-1;
        pres[n][k]=-1;
    }
}
class bloc  //main class
{
    constructor(shape,x,y,color,index)
    {
        this.shape=shape;
        this.x=x;
        this.y=y;
        this.color=color;
        this.index=index;
        this.create()
    }
    movable=1;
    btm=new Array(3); //stores lower boundary of a block
    right=new Array(3); // strores right boundary of a block
    left=[100,100,100];  // strores left boundary of a block
    top=[100,100,100];  // strores top boundary of a block

    clear() //clears the entire block
    {
        for(var n=0;n<3;n++)
        {
            for(var k=0;k<3;k++)
            {
                if(this.shape[n][k])
                {
                    clean(this.x+n,this.y+k);
                }
            }
        }
    }
    create()
    {
        for(var n=0;n<3;n++)
        {
            for(var k=0;k<3;k++)
            {
                if(grid[this.x+n][this.y+k]==-1 && this.shape[n][k])
                {
                    grid[this.x+n][this.y+k]=this.color;
                    pres[this.x+n][this.y+k]=this.index;
                    document.getElementById((this.x+n)+'-'+(this.y+k)).innerHTML=this.index;
                    document.getElementById((this.x+n)+'-'+(this.y+k)).style.color='black'
                    document.getElementById((this.x+n)+'-'+(this.y+k)).style.background=mp.get(this.color);
                    this.btm[k]=this.x+n;
                    this.right[n]=this.y+k;
                    this.left[n]=Math.min(this.y+k,this.left[n]);
                    this.top[k]=Math.min(this.top[k],this.x+n);
                }
                else if(grid[this.x+n][this.y+k] && this.shape[n][k])
                {
                    window.alert('DEAD');
                    window.location.reload(false);
                }
                
            }
        }
    }
    possbl()
    {
        var pos=0;
        for(var n=0;n<3;n++)
        {
            var a=this.btm[n] +1;
            var b=this.y+n;
            if(this.btm[n]==20)return -1;
            if(grid[a][b]==this.color)
            {
                dfs(this.x,this.y,this.color);
                fix();
                alldown();
                return -2;
            }
            if(grid[this.btm[n]  +1][this.y+n]!=-1 && grid[this.btm[n] +1][this.y+n]!=this.color)pos=1;
        }
        return pos;
    }
    movedn()
    {
        if(!this.possbl())
        {
            this.clear()
            this.x++;
            this.create();
        }
    }
    rotate()
    {
        this.clear()
        var t=this.shape;
        var s=[[t[2][0] , t[1][0], t[0][0]],[ t[2][1] ,t[1][1] ,t[0][1] ],[ t[2][2],t[1][2] ,t[0][2] ]];
        this.shape=s;
        this.create()
    }
    falldown()
    {
        while(this.possbl()==0)this.movedn();
    }
    movehr(x)
    {
        if(1<=this.y<20)
        {
            if(x==-1)
            {
                for(var n=0;n<3;n++)
                {
                    if(grid[this.x+n][this.left[n]-1]!=-1)
                    {
                        //console.log(this.left);
                        return;
                    }
                }
            }
            else 
            {
                for(var n=0;n<3;n++)
                {
                    if(grid[this.x+n][this.right[n]+1]!=-1)return;
                }
            }
            this.clear()
            this.y+=x;
            this.create()
        }
    }
}
var move=1;
function fall(brik)
{
    if(!brik.possbl())brik.movedn();
    else if(move)
    {
        var blokk=(new bloc(shapes[Math.floor(Math.random()*6)],1,10,Math.floor(Math.random()*6),blox.length));
        blox.push(blokk);
        speed=400;
        brik=blokk;
    }
    setTimeout(function()
    {
        fall(brik);
    },speed);
}
function alldown()
{
    for(var n=19;n>0;n--)
    {
        for(var k=20;k>0;k--)
        {
            
            var cur=pres[n][k];
            if(cur!=-1)
            {
                var crt=blox[cur];
                if(crt.possbl()==0)crt.falldown();
            }
            
        }
    }
}
console.log(lk);
blox.push(new bloc(shapes[Math.floor(Math.random()*6)],1,10,Math.floor(Math.random()*6),0))
fall(blox[0]);