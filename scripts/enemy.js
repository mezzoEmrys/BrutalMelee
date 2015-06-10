function createEnemy(time){
	var name = "enemy" + state.nextId;
	state.enemies[state.nextId] = new Enemy(name, time);
	state.nextId++;
	CreatePerson(name, "soldier.rss", true);
	IgnorePersonObstructions(name, true);
	IgnoreTileObstructions(name, true);
	//calculate off to edge;
	var absAng = getRandomArbitrary(0, state.map.angle);
	var isPos = (Math.round(Math.random()) == 1)?true:false;
	var signAng = (isPos)?1:-1;
	
	var x = 50;
	var y = 50;
	if(absAng < state.map.cornerAngle){
		y = state.map.bottom;
		x = (state.map.midY) * Math.tan(absAng) * signAng + state.map.midX;
	}else if(absAng == state.map.cornerAngle){
		y = state.map.bottom;
		x = whichSide(isPos);
	}else if(absAng > state.map.cornerAngle && absAng < state.map.cornerAngle + Math.PI/2){
		x = whichSide(isPos);
		if(absAng == Math.PI/2){ absAng = Math.PI/2 + .000001 };
		y = (state.map.midX / Math.tan(absAng)) + state.map.midY;
	}else if(absAng == state.map.cornerAngle+Math.PI/2){
		y = state.map.top;
		x = whichSide(isPos);
	}else if(absAng > state.map.cornerAngle+Math.PI/2){
		y = state.map.top;
		x = (state.map.midY) * Math.tan(absAng) * signAng + state.map.midX;
	}
	SetPersonX(name, x);
	SetPersonY(name, y);
}

function whichSide(isPos){
	if(isPos){
		return state.map.right;
	} else {
		return state.map.left;
	}
}

function Enemy(name, time){
	this.health = Math.floor(1 + secondsFromTime(state.score.startTime)/5);
	this.knockbackVars = {
		is : false,
		vel : 0,
	};
	this.range = 40;
	this.name = name;
	this.x = 0;
	this.y = 0;
}

Enemy.prototype.act = function(){
	this.x = GetPersonX(this.name);
	this.y = GetPersonY(this.name);
	if(this.knockbackVars.is){
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
	this.knockbackVars.is = true;
	this.knockbackVars.vel = 16;
	this.health -= 1;
}

Enemy.prototype.knockback = function(){
	this.knockbackVars.vel -= 4;
	var velParts = velCalc(this.knockbackVars.vel, this.x, this.y, state.player.x, state.player.y);
	SetPersonSpeedXY(this.name, velParts.x, velParts.y);
	//function to move away from player
}

Enemy.prototype.move = function(){
	var velocity = this.health/10;
	velocity = velocity > 1 ? velocity : 1;
	var velParts = velCalc(velocity, this.x, this.y, state.player.x, state.player.y);
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

Enemy.prototype.kill = function(){
	
}
