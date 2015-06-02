/**
* Script: main.js
* Written by: mezzoemrys
* Updated: 5/29/2015
**/
RequireSystemScript("mini/miniRT.js");
RequireScript("json2.min.js");
RequireScript("link.js");

var state;

function game() {
	initializeGameState();
	SetUpdateScript(updateLoop);
	SetRenderScript(renderLoop);
	CreatePerson(state.player.name, "sonos.rss", false);
	AttachCamera(state.player.name);
	AttachInput(state.player.name);
	SetPersonSpeed(state.player.name, 2);
	MapEngine("wartornbattlefield.rmp", 60);
}

function updateLoop(){
	state.player.x = GetPersonX(state.player.name);
	state.player.y = GetPersonY(state.player.name);
	if(state.enemies.length < 1){
		createEnemy(secondsFromTime(state.score.startTime));
	}
	Link(state.enemies).where(function(enemy){return !enemy.enemyInRange();}).each(function(enemy){ enemy.act(); });
}

function renderLoop(){
	//render life meter
	//render kills
	//render time
}

function secondsFromTime(time){
	return Math.floor((GetTime() - time)/1000);
}

function initializeGameState(){
	state = {};
	state.score = {
		kills : 0,
		startTime : GetTime(),
	};
	state.player = {
		name : "sonos",
		health : 5,
		x : 320,
		y : 228,
	};
	state.map = {
		minAngle : 180-30, //0,360 is straight up, increasing going clockwise
		maxAngle : 180+30, //angles in degrees
		enemiesPerSecond : 2,
	};
	state.enemies = [];
	state.nextId = 0;
	state.lastEnemyTime = state.score.startTime;
}

function distance(x1, y1, x2, y2){
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function velCalc(velocity, myX, myY, targetX, targetY){
	var theta = Math.atan2(targetY-myY, targetX-myX);
	return {
		x : velocity * Math.abs(Math.cos(theta)),
		y : velocity * Math.abs(Math.sin(theta))
	};
}

function createEnemy(time){
	var name = "enemy" + state.nextId;
	state.enemies[state.nextId] = new Enemy(name, time);
	state.nextId++;
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
	this.health = Math.floor(1 + secondsFromTime(state.score.startTime)/5);
	this.beingKnockedBack = false;
	this.velocity = 0;
	this.range = 16;
	this.name = name;
	this.x = 0;
	this.y = 0;
}

Enemy.prototype.act = function(){
	this.x = GetPersonX(this.name);
	this.y = GetPersonY(this.name);
	if(this.beingKnockedBack){
		this.knockback();
	} else if(this.enemyInRange()){
		//attack
	} else {
		this.move();
	}
}

Enemy.prototype.enemyInRange = function(){
	var x = distance(this.x, this.y, state.player.x, state.player.y);
	return x < this.range;
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
	ClearPersonCommands(this.name);
	if(state.player.y < this.y){
		QueuePersonCommand(this.name, COMMAND_MOVE_NORTH, true);
	} else if(state.player.y > this.y){
		QueuePersonCommand(this.name, COMMAND_MOVE_SOUTH, true);
	}
	if(state.player.x > this.x){
		QueuePersonCommand(this.name, COMMAND_MOVE_EAST, false);
	} else if(state.player.x < this.x){
		QueuePersonCommand(this.name, COMMAND_MOVE_WEST, false);
	}
}




