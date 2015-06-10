/**
* Script: main.js
* Written by: mezzoemrys
* Updated: 5/29/2015
**/
RequireSystemScript("mini/miniRT.js");
RequireScript("json2.min.js");
RequireScript("link.js");
RequireScript("enemy.js");
RequireScript("player.js");

var state;

//Game Functions

function game() {
	initializeGameState();
	SetUpdateScript(updateLoop);
	SetRenderScript(renderLoop);
	createPlayer();
	MapEngine("wartornbattlefield.rmp", 60);
}

function updateLoop(){
	state.player.updateState();
	if(GetTime() - state.lastEnemyTime > 1000/ state.map.enemiesPerSecond){
		createEnemy(secondsFromTime(state.score.startTime));
		state.lastEnemyTime = GetTime();
	}
	if(state.map.angle < Math.PI && GetTime() - state.lastAngleIncrement > 1000/ state.map.anglePerSecond){
		state.map.angle += deg2rad(1);
		state.lastAngleIncrement = GetTime();
	}
	if(GetTime() - state.lastEnemyRateIncrement > 1000 * state.map.enemyRateTimesSecond){
		state.map.enemiesPerSecond++;
		state.lastEnemyRateIncrement = GetTime();
	}
	Link(state.enemies).where(function(enemy){return enemy.health <= 0;}).each(function(enemy){ enemy.kill(); });
	var enemiesToAct = Link(state.enemies).where(function(enemy){return enemy.health > 0;});
	enemiesToAct.each(function(enemy){ enemy.act(); });
	state.enemies = enemiesToAct.toArray();
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
		startTime : GetTime(),
	};
	state.player = {
		name : "sonos",
		health : 5,
		x : 320,
		y : 272,
	};
	state.map = {
		angle : deg2rad(20), //0,360 is straight down, increasing going clockwise, in degrees
		enemiesPerSecond : 1,
		enemyRateTimesSecond : 20,
		anglePerSecond : 3,
		left : 0,
		right : 640,
		top : 64, 
		bottom : 480,
	};
	state.enemies = [];
	state.nextId = 0;
	state.lastEnemyTime = state.score.startTime;
	state.lastAngleIncrement = state.score.startTime;
	state.lastEnemyRateIncrement = state.score.startTime;
	state.map.midX = 320;
	state.map.midY = 272;
	state.map.cornerAngle = Math.atan2(state.map.right - state.map.left, state.map.bottom - state.map.top);
	
}

//General Functions

function secondsFromTime(time){
	return Math.floor((GetTime() - time)/1000);
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

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function deg2rad(deg){
	return deg * (Math.PI/180);
}

function rad2deg(rad){
	return rad * (180/ Math.PI);
}



