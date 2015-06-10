function createPlayer(){
	state.player = new Player(state.player.name);
	CreatePerson(state.player.name, "sonos.rss", false);
	AttachCamera(state.player.name);
	AttachInput(state.player.name);
	SetPersonSpeed(state.player.name, 2);
	SetPersonX(state.player.name, state.player.x);
	SetPersonY(state.player.name, state.player.y);
}

function Player(name){
	this.name = state.player.name;
	this.health = state.player.health;
	this.x = state.player.x;
	this.y = state.player.y;
}

Player.prototype.updateState = function(){
	state.player.x = GetPersonX(state.player.name);
	state.player.y = GetPersonY(state.player.name);
}

Player.prototype.onHit = function(){
	
}