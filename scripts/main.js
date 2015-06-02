/**
* Script: main.js
* Written by: mezzoemrys
* Updated: 5/29/2015
**/
RequireSystemScript("mini/miniRT.js");

var state;

function game() {
	initializeGameState();
	SetUpdateScript(updateLoop);
	SetRenderScript(renderLoop);
	MapEngine("wartornbattlefield.rmp", 60);
}

function updateLoop(){
	createEnemy();
	mini.Link(state.enemies).where(function(enemy){return enemy.health > 0;})
		.each(function(enemy){enemy.act()});
}

function renderLoop(){
	//render life meter
	//render kills
	//render time
}

function initializeGameState(){
	state = {};
	state.score = {
		kills : 0,
		startTime : 0,
	};
	state.player = {
		health : 5,
		x : 320,
		y : 228,
	};
	state.map = {
		minAngle : 180-30, //0,360 is straight up, increasing going clockwise
		maxAngle : 180+30, //angles in degrees
		enemiesPerSecond : 2,
	};
	state.enemies = Array();
	state.nextId = 1;
}

function distance(x1, y1, x2, y2){
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function velCalc(velocity, myX, myY, targetX, targetY){
	var theta = Math.atan2(targetY-myY, targetX-myX);
	return {
		x : velocity * cos(theta),
		y : velocity * sin(theta)
	};
}

function createEnemy(time){
	var name = "enemy"+state.nextID++;
	state.enemies[name] = new Enemy(name, time);
	CreatePerson(name, "soldier.rss", true);
	IgnorePersonObstructions(name, true);
	IgnoreTileObstructions(name, true);
	//calculate off to edge;
	var x = 50;
	var y = 50;
	SetPersonX(name, x);
	SetPersonY(name, y);
}

function Enemy(name, time){
	this.health = Math.floor(1 + (time - state.startTime)/2000);
	this.beingKnockedBack = false;
	this.velocity = 0;
	this.range = 16;
	this.name = name;
	this.x = 0;
	this.y = 0;
}

Enemy.prototype.act = function(){
	if(this.beingKnockedBack){
		this.knockback();
	} else if(this.enemyInRange()){
		//attack
	} else {
		this.move();
	}
}

Enemy.prototype.enemyInRange = function(){
	return distance(this.x, this.y, state.player.x, state.player.y) < this.range;
}

Enemy.prototype.onHit = function(){
	this.knockedBack = true;
	this.velocity = 16;
}

Enemy.prototype.knockback = function(){
	this.velocity -= 4;
	var velParts = velCalc(this.velocity, this.x, this.y, state.player.x, state.player.y);
	SetPersonSpeedXY(this.name, velParts.x, velParts.y);
	
}

Enemy.prototype.move = function(){
	this.velocity = this.health * 2;
	var velParts = velCalc(this.velocity, this.x, this.y, state.player.x, state.player.y);
	SetPersonSpeedXY(this.name, velParts.x, velParts.y);
	
}




