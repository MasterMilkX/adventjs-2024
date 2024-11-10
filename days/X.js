// Made by M Charity

function dayXPreload() {

    // Load any assets here (with assets.dayX at the front of the variable name)
    assets.dayXFont = loadFont("../assets/dayX/easvhs.ttf");
    assets.dayXGenList = loadJSON("../assets/dayX/gen-list.json");
    assets.dayXStencils = loadImage("../assets/dayX/stencils.png");

}

class DayX extends Day {

    constructor () {

        super();
        this.canv3d = createGraphics(150, 300, WEBGL); // Set up 3D canvas
        this.loop = true; // Set to true or false

        this.controls = "Click to generate a new board!"; 
        this.credits = "Made by M Charity";

        // Define variables here. Runs once during the sketch holder setup
        
        this.colors = ["#ffffff", "#268f41", "#d01212"];
        this.margin = [50,90];
        this.cur_stats = new this.BoardStats(this.colors, this.margin);
        this.board = new this.BoardModel(this.canv3d);
    }

    prerun() {
        this.canv3d.clear();

        // Initialise/reset variables here. Runs once, every time your day is viewed
        this.cur_stats.newBoard();
        this.board.setBoard();
    }

    update() {

        // Update and draw stuff here. Runs continuously (or only once if this.loop = false), while your day is being viewed. Feel free to delete the example contents below
        background(this.colors[1]);    

        // Display the stats of the skateboard
        //this.cur_stats.showStats(this.margin);
        textAlign(CENTER, CENTER);
        textFont(assets.dayXFont);

        textSize(48);
        fill(this.colors[0]);
        text("Skate Deck the Halls", width/2+20, 40);

        this.cur_stats.showStats(this.margin);
        this.board.showBoard();
        image(this.board.canv3d, this.margin[0]+290, this.margin[1]+30, 200, 400);


    }

    // Below are optional functions for interactivity

    mousePressed() {
        this.reset();
    }

    reset(){
        let lastAngle = this.board.angle;
        this.cur_stats.newBoard();
        this.board = new this.BoardModel(this.canv3d,lastAngle);
        this.board.setBoard();
    }

    // creates stats for the skateboard
    BoardStats = class{
        constructor(colors,margin){
            this.speed = 0;
            this.carving = 0;
            this.roofGrind = 0;
            this.airTime = 0;
            this.tricks = [];
            this.bonus = [];
            this.boardColors = [];


            this.colors = colors;
            this.margin = margin;
            this.statSize = [140, 40];
        }

        // displays the stats of the skateboard
        showStats(margin){
            let mx = margin[0];
            let my = margin[1];

            // create the box
            // A grayscale value.
            strokeWeight(4);
            stroke(this.colors[0]);
            fill(255,255,255,180);
            rect(mx,my, 220, 450);

            // display the stats
            strokeWeight(1);
            stroke(this.colors[0]);
            textSize(32);
            textFont(assets.dayXFont);
            textAlign(CENTER, CENTER);
            fill(this.colors[1]);
            text("Stats", mx+110, my+30);


            let stat_list = ["Speed", "Carving", "Roof Grind", "Air Time"];
            let stat_vals = [this.speed, this.carving, this.roofGrind, this.airTime];
            for (let i = 0; i < stat_list.length; i++){
                this.drawStat(stat_list[i], stat_vals[i], i);
            }

            /*
            text("Speed: " + this.speed, mx+10, my+30);
            text("Carving: " + this.carving, mx+10, my+60);
            text("Roof Grind: " + this.roofGrind, mx+10, my+150);
            text("Air Time: " + this.airTime, mx+10, my+200);
            */

            let numStats = stat_list.length;

            textSize(20);
            textAlign(CENTER);
            text("Special Tricks", mx+110, my+numStats*65+15);
            for (let i = 0; i < this.tricks.length; i++){
                this.drawFeature(this.tricks[i], i);
            }

            strokeWeight(1);
            textSize(20);
            stroke(this.colors[0]);
            fill(this.colors[2]);
            textAlign(CENTER);
            text("Bonus", mx+110, my+(numStats+2)*65+10);
            textAlign(LEFT);
            this.drawFeature(this.bonus, 4);
            


        }

        // draws a stat in the box
        drawStat(statName, value, i){
            let mx = this.margin[0]+20;
            let my = this.margin[1]+55;

            let bw = this.statSize[0];
            let bh = this.statSize[1];

            // draw the outline box for the stat name
            strokeWeight(2);
            stroke(this.colors[0]);
            fill(this.colors[1]);
            rect(mx, my+(bh+10)*i, bw, bh);

            // display the stat name
            strokeWeight(1);
            textSize(20);
            textFont(assets.dayXFont);
            textAlign(CENTER,CENTER);
            fill(this.colors[0]);
            text(statName, mx+bw/2, my+(bh+10)*i+20);

            // show the value of the stat outside the box
            textAlign(LEFT);
            fill(this.colors[1]);
            textSize(32);
            strokeWeight(2);
            text(value, mx+bw+20, my+(bh+10)*i+20);

        }

        drawFeature(feat, i){
            let mx = this.margin[0]+10;
            let my = this.margin[1]+290;

            let bw = 200;
            let bh = 25;

            let y = my+(bh+5)*i;
            if(i == 4){
                y = my+(bh+10)*i-15;
            }

            // draw the outline box for the stat name
            strokeWeight(1);
            stroke(this.colors[0]);
            textFont("monospace");
            if (i == 4){
                textSize(12);
                
                fill(this.colors[2]);
            }else{
                textSize(16);
                
                fill(this.colors[1]);
            }
            rect(mx, y, bw, bh);

            // display the stat name
            strokeWeight(1);
            textAlign(CENTER,CENTER);
            fill(this.colors[0]);
            text(feat, mx+bw/2, y+bh/2+2);
        }

        // creates a new board with random stats
        newBoard(){
            this.speed = parseInt(random(1, 10));
            this.carving = parseInt(random(1, 10));
            this.roofGrind = parseInt(random(1, 10));
            this.airTime = parseInt(random(1, 10));
            this.tricks = []
            let tr = shuffle(assets.dayXGenList.tricks);
            for (let i = 0; i < 3; i++){
                this.tricks.push(tr[i]);
            }
            this.bonus = random(assets.dayXGenList.bonus);
        }
    }

    BoardModel = class{
        constructor(canv3d,angle=0){
            // set random colors for the parts of the board
            this.colorSet = assets.dayXGenList.colors;
            this.canv3d = canv3d;
            
            // all colors
            this.grip = (random() < 0.3 ? this.color() : "#000000");
            this.deck = this.color();
            this.trucks = this.color();
            this.wheels = this.color([this.deck]);
            this.graphic = (random() < 0.4 ? this.color([this.deck]) : this.wheels);

            // index of the graphic to show on the deck
            this.graphic_i = parseInt(random(0,10));

            this.skateboard = null;
            this.angle = angle;
            this.speed = 0.025; // speed to rotate at
        }

        // picks a random color for the board
        color(excl=[]){
            let c = random(this.colorSet);
            while(excl.includes(c)){
                c = random(this.colorSet);
            }
            return c;
        }

        // set the board to be rendered
        setBoard(){
            this.skateboard = this.canv3d.buildGeometry(this.buildBoard.bind(this));
        }
        
        buildBoard(){
            this.canv3d.clear();
            this.canv3d.noStroke();

            // main deck
            this.canv3d.push();
            this.canv3d.fill(this.deck);
            this.canv3d.box(60,180,10);
            this.canv3d.translate(0,-90,0)
            this.canv3d.rotateX(PI/2);
            this.canv3d.cylinder(30,10);
            this.canv3d.translate(0,0,-180)
            this.canv3d.cylinder(30,10);
            this.canv3d.pop();
            
            // grip
            this.canv3d.push();
            this.canv3d.noStroke();
            this.canv3d.fill(this.grip)
            this.canv3d.translate(0,0,7)
            this.canv3d.box(50,170,0.1);
            this.canv3d.translate(0,-90,0)
            this.canv3d.rotateX(PI/2);
            this.canv3d.cylinder(25,0.1);
            this.canv3d.translate(0,0,-180)
            this.canv3d.cylinder(25,0.1);
            this.canv3d.pop();
            
            // trucks
            this.canv3d.push();
            this.canv3d.noStroke();
            this.canv3d.fill(this.trucks);
            this.canv3d.stroke(0);
            this.canv3d.translate(0,-70,-9);
            this.canv3d.box(20,10,20);
            this.canv3d.translate(0,140,0);
            this.canv3d.box(20,10,20);
            this.canv3d.pop();

            // truck screws
            this.canv3d.push();
            this.canv3d.fill(this.trucks);
            this.canv3d.rotateZ(PI/2);
            this.canv3d.rotateX(PI/2);
            this.canv3d.translate(-70,8,10)
            this.canv3d.cylinder(3,2);
            this.canv3d.translate(0,0,-20)
            this.canv3d.cylinder(3,2);
            this.canv3d.translate(140,0,20)
            this.canv3d.cylinder(3,2);
            this.canv3d.translate(0,0,-20)
            this.canv3d.cylinder(3,2);
            this.canv3d.pop();
            
            // wheels
            this.canv3d.push();
            this.canv3d.noStroke();
            this.canv3d.fill(this.wheels);
            this.canv3d.rotateZ(PI/2);
            this.canv3d.translate(-70,-20,-16)
            this.canv3d.cylinder(10,8);
            this.canv3d.translate(140,0,0)
            this.canv3d.cylinder(10,8);
            this.canv3d.translate(0,40,0);
            this.canv3d.cylinder(10,8);
            this.canv3d.translate(-140,0,0)
            this.canv3d.cylinder(10,8);
            this.canv3d.pop();
            
        }

        // render the board in game
        showBoard(){
            this.canv3d.push();
            this.canv3d.clear();
            this.canv3d.background(0,0,0,0)

            // Rotate along the y-axis
            this.canv3d.rotateY(this.angle);
            this.angle += this.speed; // Increment angle for continuous rotation
            this.angle = this.angle % (2*PI);

            this.canv3d.model(this.skateboard);

            // show the graphic on the deck
            let c = this.graphic_i % 5;
            let r = parseInt(this.graphic_i/2) % 2;
            this.canv3d.translate(-30,-30,-5.5)
            this.canv3d.tint(this.graphic);
            this.canv3d.image(assets.dayXStencils,0,0,60,60,144*c,144*r,144,144)
            this.canv3d.pop();


        }
    }
}