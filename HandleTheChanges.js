/*
	"Handle The Changes" est un jeu créé en novembre 2013 par Aurélien Picolet.
	"Handle The Changes" is a game created in November 2013 by Aurélien Picolet for the GitHub Game Off II game jam.
*/

(function() {

// MENU AND INIT VARIABLES

var canvas = document.getElementById("canvasJeu");
var stage = new createjs.Stage("canvasJeu");
stage.mouseEventsEnabled = true;

var assetsPath = "assets/";
var manifest = 	[
					{src:"img/clock.png", id:"clock"},
					{src:"img/right.png", id:"right"},
					{src:"img/wrong.png", id:"wrong"},
					{src:"img/crosshair.png", id:"crosshair"},
					{src:"img/player.png", id:"player"},
					{src:"img/inputs.png", id:"inputs"},
					{src:"img/questionMark.png", id:"questionMark"},
					{src:"img/push.png", id:"push"},
					{src:"img/inverse.png", id:"inverse"},
					{src:"img/sonOn.png", id:"sonOn"},
					{src:"img/sonOff.png", id:"sonOff"},
					{src:"img/boutonRetour.png", id:"boutonRetour"},
					{src:"img/hud_p1.png", id:"HUDP1"},
					{src:"img/hud_p2.png", id:"HUDP2"},
					{src:"img/grassMid4.png", id:"grassMid"},
					{src:"img/p1_spritesheet.png", id:"p1SpriteSheet"},
					{src:"img/p2_spritesheet.png", id:"p2SpriteSheet"},
					{src:"img/bloc_rouge_2_20x20.png", id:"blocRouge2"},
					{src:"img/bloc_vert_1_20x20.png", id:"blocVert"},
					{src:"img/barreGauche.png", id:"barreGauche"},
					{src:"img/barreDroite.png", id:"barreDroite"},
					{src:"img/choixErreurs.png", id:"choixErreurs"},
					{src:"img/joueurJaune.png", id:"joueurJaune"},
					{src:"img/joueurNoir.png", id:"joueurNoir"},
					{src:"img/startButton.png", id:"startButton"},
					{src:"img/fondTitre.png", id:"fondTitre"},
					{src:"img/fondMenu.png", id:"fondMenu"},
					{src:"img/fondJeu1.png", id:"fondJeu1"},
					{src:"img/fondJeu2.png", id:"fondJeu2"},
					{src:"img/panneau2.png", id:"panneau1"},
					{src:"sounds/sonCAR.ogg|sounds/sonCAR.mp3|sounds/sonCAR.wav", id:"sonCAR"},
					{src:"sounds/sonPower.ogg|sounds/sonPower.mp3|sounds/sonPower.wav", id:"sonPower"},
					{src:"sounds/sonClickMenu.ogg|sounds/sonClickMenu.mp3|sounds/sonClickMenu.wav", id:"sonClickMenu"},
					{src:"sounds/musiqueDrifting.ogg|sounds/musiqueDrifting.mp3|sounds/musiqueDrifting.wav", id:"musiqueMenu"},
					{src:"sounds/musiqueSummer.ogg|sounds/musiqueSummer.mp3|sounds/musiqueSummer.wav", id:"musiqueIG"}
				];
var images = {};

var pourcentageCharg;
var barreTitre = new createjs.Container();

var menu = new createjs.Container();
var star, fondMenu, fondMenuTrans;
var panneau1 = new createjs.Container();
var choisirPlayer = new createjs.Container(),
	choisirPlayer1 = new createjs.Container(),
	choisirPlayer2 = new createjs.Container();
var	choisirNbErreurs = new createjs.Container(),
	choisirNbErreurs1 = new createjs.Container(),
	choisirNbErreurs2 = new createjs.Container(),
	choisirNbErreurs3 = new createjs.Container();	
var	startButton = new createjs.Container();
var hauteurBoutons, largeurBoutonPlayer1, largeurBoutonPlayer2, largeurBoutonErreurs; // ou utiliser getBounds et setBounds

var options = 	{
					player : 2,
					erreurs : 10
				}

var player1XOffset,
	player2XOffset = 400,
	terrainXOffset = 190; // largeur : 200
	terrainYOffset = 140; // hauteur : 310
	solYOffset = 420;

var shadowP = new createjs.Shadow("#454", 2, 0, 0);

var musiqueMenu, musiqueIG;
var sonMute = false;

var boutonRetour;

// GAME VARIABLES

var timeBeginGL;
var prochaineSec;
	
var vitesseX = 3,
	vitesseY = 2;

var possibleTargets =	{
							colors	: ["blocRouge2", "blocVert"]
						};
var lettresInputs = ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P", "Q", "S", "D", "F", "G", "H", "J", "K", "L", "M", "W", "X", "C", "V", "B", "N",];

var createdThisSec,
	nextChangeAt;
var changementsAFaire = new Array();
var changementsAFaireP1 = new Array();
var changementsAFaireP2 = new Array();
var calcErrors = false;
						
var player1 = 	{
					erreurs	: 0,
					powers	: 0,
					position : 3,
					action : "stand",
					getChange : false,
					fire : false
				},
	player2 = 	{
					erreurs	: 0,
					powers	: 0,
					position : 3,
					action : "stand",
					getChange : false,
					fire : false
				};
				
var P1InputsDone = new Array();
var P1CollisionTargetTerrain = new Array();
var P1CollisionTargetJoueur = new Array();	
var player1Animation;
var p1Targets = new createjs.Container();
var p1ErreursText = new createjs.Text("", "25px monofett, mercado one, Limelight, trebuchet ms");
var p1PowersText = new createjs.Text("", "25px monofett, mercado one, Limelight, trebuchet ms");

var P2InputsDone = new Array();
var P2CollisionTargetTerrain = new Array();
var P2CollisionTargetJoueur = new Array();	
var player2Animation;
var p2Targets = new createjs.Container();
var p2ErreursText = new createjs.Text("", "25px monofett, mercado one, Limelight, trebuchet ms");
var p2PowersText = new createjs.Text("", "25px monofett, mercado one, Limelight, trebuchet ms");
			

var timer = new createjs.Text("", "30px lucida console, courrier new, monospace", "rgba(255,255,255,1)");
var timerOutline = new createjs.Text("", "30px lucida console, courrier new, monospace", "rgba(0,0,0,1)");
timerOutline.outline = 1;
				
var regles =	{
					target	: [],
					take	: true,
					inputs	: ["Q", "W", "R", "U", "I", "P"],
					inverse	: false,
					pushes	: 1,
					playerI	: false,
					erreursMax	: 0,
					difficulte	: 0,
					finDuJeu	: false
				},
				
	reglesP1 = 	{
					target	: [],
					take	: true,
					inputs	: ["Q", "W", "R"],
					inverse	: false,
					pushes	: 1,
					changedInverse	: false
				},
				
	reglesP2 = 	{
					target	: [],
					take	: true,
					inputs	: ["U", "R", "I"],
					inverse	: false,
					pushes	: 1,
					changedInverse	: false
				};
				

var p1Rule1 = new createjs.Container(), p1Rule2 = new createjs.Container(), p1Rule3 = new createjs.Container(), p1Rule4 = new createjs.Container(), p1Rule5 = new createjs.Container(), p1Rule6 = new createjs.Container();
var p2Rule1 = new createjs.Container(), p2Rule2 = new createjs.Container(), p2Rule3 = new createjs.Container(), p2Rule4 = new createjs.Container(), p2Rule5 = new createjs.Container(), p2Rule6 = new createjs.Container();
var p1TimerRule1, p1TimerRule2, p1TimerRule3, p1TimerRule4, p1TimerRule5, p1TimerRule6;
var p2TimerRule1, p2TimerRule2, p2TimerRule3, p2TimerRule4, p2TimerRule5, p2TimerRule6;

// PRELOAD
			
var init = function () {
	
	pourcentageCharg = new createjs.Text("", "20px monofett, limelight, Trebuchet MS, Bangers", "black");
	pourcentageCharg.textAlign = "center";
	pourcentageCharg.x = canvas.width/2;
	pourcentageCharg.y = canvas.height/2;
	pourcentageCharg.textBaseline = "alphabetic";
	stage.addChild(pourcentageCharg);
	
	var preload = new createjs.LoadQueue(false);
	preload.installPlugin(createjs.Sound);
	preload.addEventListener("progress", handleProgress);
	preload.addEventListener("fileload", handleFileLoad);
	preload.addEventListener("complete", handleComplete);
	preload.loadManifest(manifest, true, assetsPath);
	
};

var handleProgress = function (event) {
	pourcentageCharg.text = "Loading : " + Math.round(event.progress * 100) + "%";
};

var handleFileLoad = function (event) {
	switch (event.item.type) {
		case createjs.LoadQueue.IMAGE:
			images[event.item.id] = event.result;
		break;
	}
};

var handleComplete = function () {
	pourcentageCharg.text = "Loading complete : 100% !";
	createjs.Tween.get(pourcentageCharg).to({x:200, alpha:0, visible:false}, 1000).call(initMenu);
};


// MENU

var initMenu = function() {
	stage.removeChild(pourcentageCharg);
	musiqueMenu = createjs.Sound.play("musiqueMenu", {loop:-1, volume:0.4});
	// Titre
	var titre = new createjs.Text("Handle The Changes !", "30px Bangers, Trebuchet MS", "rgba(255,255,255,1)");
	titre.textAlign = "center";
	titre.x = canvas.width/2;
	titre.y = 30;
	titre.textBaseline = "alphabetic";
	var titreOutline = new createjs.Text("Handle The Changes !", "30px Bangers, Trebuchet MS");
	titreOutline.textAlign = "center";
	titreOutline.outline = 2;
	titreOutline.x = canvas.width/2;
	titreOutline.y = 30;
	titreOutline.textBaseline = "alphabetic";
	
	var fondTitre = new createjs.Bitmap(images["fondTitre"]);
	
	var sonHitArea = new createjs.Shape()
	sonHitArea.graphics.beginFill("white").drawRect(0, 0, 26, 32);
	var sonOn = new createjs.Bitmap(images["sonOn"]);
	sonOn.x = 60;
	sonOn.y = 4;
	sonOn.hitArea = sonHitArea;
	sonOn.addEventListener("click", handleSound);
	var sonOff = new createjs.Bitmap(images["sonOff"]);
	sonOff.x = 60;
	sonOff.y = 4;
	sonOff.hitArea = sonHitArea;
	sonOff.addEventListener("click", handleSound);
	
	if (sonMute) {
		sonOn.visible = false;
		sonOff.visible = true;
	} else {
		sonOn.visible = true;
		sonOff.visible = false;
	}
	
	barreTitre.addChild(fondTitre, titreOutline, titre, sonOn, sonOff);
	barreTitre.x = -800;
	stage.addChild(barreTitre);
	
	createjs.Tween.get(barreTitre).to({x:0}, 1000, createjs.Ease.cubicOut);
	
	// Fond
	fondMenuTrans = new createjs.Bitmap(images["fondMenu"]);
	fondMenuTrans.y = 40;
	fondMenuTrans.alpha = 0.4;
	star = new createjs.Shape();
	star.x = 400;
	star.y = 260;
	star.graphics.beginStroke("black").setStrokeStyle(5).drawPolyStar(0,0,220,5,0.4, -90);
	fondMenu = new createjs.Bitmap(images["fondMenu"]);
	fondMenu.y = 40;
	fondMenu.mask = star;
	
	createjs.Tween.get(star, {loop:true})	.to({rotation:180, scaleX:2, scaleY:2}, 2000)
											.to({rotation:360, scaleX:1, scaleY:1}, 2000)
											.to({rotation:540, scaleX:0.5, scaleY:0.5}, 2000)
											.to({rotation:720, scaleX:1, scaleY:1}, 2000);
	
	// Panneau
	var panneau1Img = new createjs.Bitmap(images["panneau1"]);
	var panneau1Text = new createjs.Text("   The real challenge is the two-player versus mode.\n   The single-player mode is more like a training for the versus mode.", "18px limelight, trebuchet ms", "#E5E5E5"); //AC3232 524B24 E5E5E5
	panneau1Text.textBaseline = "alphabetic";
	panneau1Text.x = 10;
	panneau1Text.y = 60;
	panneau1Text.lineWidth = 250;
	panneau1Text.lineHeight = 20;
	panneau1.addChild(panneau1Img, panneau1Text);
	panneau1.x = -286;
	panneau1.y = 55;
	panneau1.skewX = 10;
	
	createjs.Tween.get(panneau1).wait(2000).to({x:30}, 400, createjs.Ease.linear).to({skewX:0}, 800, createjs.Ease.getElasticOut(2,0.5));
	
	
	// bouton 1 PLAYER
	var choisirPlayer1Text = new createjs.Text("1 PLAYER");
	choisirPlayer1Text.font = "21px monofett, Trebuchet MS"; 
	choisirPlayer1Text.x = 38;
	choisirPlayer1Text.y = 25;
	choisirPlayer1Text.textBaseline = "alphabetic";
	
	hauteurBoutons = choisirPlayer1Text.getMeasuredHeight()+10;
	largeurBoutonPlayer1 = choisirPlayer1Text.getMeasuredWidth()+10;
	
	var choisirPlayer1Bg = new createjs.Bitmap();
	
	choisirPlayer1.addChild(choisirPlayer1Bg, choisirPlayer1Text);
	choisirPlayer1.x = 15;
	choisirPlayer1.y = 1;
	choisirPlayer1.mouseChildren = false;
	choisirPlayer1.id = "player1";
	
	// bouton 2 PLAYERS
	var choisirPlayer2Text = new createjs.Text("2 PLAYERS");
	choisirPlayer2Text.font = "21px monofett, Trebuchet MS";
	choisirPlayer2Text.x = 32;
	choisirPlayer2Text.y = 25;
	choisirPlayer2Text.textBaseline = "alphabetic";
	
	largeurBoutonPlayer2 = choisirPlayer2Text.getMeasuredWidth()+10;
	
	var choisirPlayer2Bg = new createjs.Bitmap();
	
	choisirPlayer2.addChild(choisirPlayer2Bg, choisirPlayer2Text);
	choisirPlayer2.x = 195;
	choisirPlayer2.y = 1;
	choisirPlayer2.mouseChildren = false;
	choisirPlayer2.id = "player2";
	
	if (options.player === 1) {
		choisirPlayer1Bg.image = images["joueurJaune"];
		choisirPlayer2Bg.image = images["joueurNoir"];
	} else {
		choisirPlayer2Bg.image = images["joueurJaune"];
		choisirPlayer1Bg.image = images["joueurNoir"];
	}
	
	// barre pour choisir nombre de joueurs
	var choisirPlayerBg = new createjs.Bitmap();
	choisirPlayerBg.image = images["barreGauche"];

	choisirPlayer.addChild(choisirPlayerBg, choisirPlayer1, choisirPlayer2);
	choisirPlayer.x = -410;
	choisirPlayer.y = 220;
	
	// texte 1 erreurs
	var choisirNbErreursText1 = new createjs.Text("Game ends at", "21px monofett, Trebuchet MS");
	choisirNbErreursText1.x = 27;
	choisirNbErreursText1.y = 26;
	choisirNbErreursText1.textBaseline = "alphabetic";
	
	var largeurText2 = choisirNbErreursText1.getMeasuredWidth() + choisirNbErreursText1.x +25;
	
	// barre pour choisir nombre d'erreurs
	var choisirNbErreursBg = new createjs.Bitmap();
	choisirNbErreursBg.image = images["barreDroite"];
	
	var choisirNbErreursBg2 = new createjs.Bitmap();
	choisirNbErreursBg2.image = images["choixErreurs"];
	choisirNbErreursBg2.x = largeurText2 -23;
	choisirNbErreursBg2.y = 1;
	
	// bouton 1 erreurs
	var choisirNbErreurs1Text = new createjs.Text("10", "21px monofett, Trebuchet MS");
	choisirNbErreurs1Text.x = 5;
	choisirNbErreurs1Text.y = 26;
	choisirNbErreurs1Text.textBaseline = "alphabetic";
	
	
	var choisirNbErreurs1Bg = new createjs.Shape();
	choisirNbErreurs1Bg.x = 3;
	choisirNbErreurs1Bg.y = 8;
	
	choisirNbErreurs1.addChild(choisirNbErreurs1Bg, choisirNbErreurs1Text);
	choisirNbErreurs1.x = choisirNbErreursBg2.x + 20;
	choisirNbErreurs1.mouseChildren = false;
	choisirNbErreurs1.id = "erreurs1";
	
	// bouton 2 erreurs
	var choisirNbErreurs2Text = new createjs.Text("20", "21px monofett, Trebuchet MS");
	choisirNbErreurs2Text.x = 5;
	choisirNbErreurs2Text.y = 26;
	choisirNbErreurs2Text.textBaseline = "alphabetic";
	
	var choisirNbErreurs2Bg = new createjs.Shape();
	choisirNbErreurs2Bg.x = 3;
	choisirNbErreurs2Bg.y = 8;
	
	choisirNbErreurs2.addChild(choisirNbErreurs2Bg, choisirNbErreurs2Text);
	choisirNbErreurs2.x = choisirNbErreursBg2.x + 20 + 47;
	choisirNbErreurs2.mouseChildren = false;
	choisirNbErreurs2.id = "erreurs2";
	
	// bouton 3 erreurs
	var choisirNbErreurs3Text = new createjs.Text("50", "21px monofett, Trebuchet MS");
	choisirNbErreurs3Text.x = 5;
	choisirNbErreurs3Text.y = 26;
	choisirNbErreurs3Text.textBaseline = "alphabetic";
	
	var choisirNbErreurs3Bg = new createjs.Shape();
	choisirNbErreurs3Bg.x = 3;
	choisirNbErreurs3Bg.y = 8;
	
	choisirNbErreurs3.addChild(choisirNbErreurs3Bg, choisirNbErreurs3Text);
	choisirNbErreurs3.x = choisirNbErreursBg2.x + 20 + 2*47;
	choisirNbErreurs3.mouseChildren = false;
	choisirNbErreurs3.id = "erreurs3";
	
	if (options.erreurs === 10) {
		choisirNbErreurs1Bg.graphics.beginFill("rgba(210,146,36,1)").drawRoundRect(0, 0, 29, 22, 2);
		choisirNbErreurs2Bg.graphics.clear().beginFill("rgba(210,146,36,0.1)").drawRoundRect(0, 0, 29, 22, 2);
		choisirNbErreurs3Bg.graphics.clear().beginFill("rgba(210,146,36,0.1)").drawRoundRect(0, 0, 29, 22, 2);
	} else if (options.erreurs === 20) {
		choisirNbErreurs1Bg.graphics.clear().beginFill("rgba(210,146,36,0.1)").drawRoundRect(0, 0, 29, 22, 2);
		choisirNbErreurs1Bg.graphics.beginFill("rgba(210,146,36,1)").drawRoundRect(0, 0, 29, 22, 2);
		choisirNbErreurs3Bg.graphics.clear().beginFill("rgba(210,146,36,0.1)").drawRoundRect(0, 0, 29, 22, 2);
	} else {
		choisirNbErreurs1Bg.graphics.clear().beginFill("rgba(210,146,36,0.1)").drawRoundRect(0, 0, 29, 22, 2);
		choisirNbErreurs2Bg.graphics.clear().beginFill("rgba(210,146,36,0.1)").drawRoundRect(0, 0, 29, 22, 2);
		choisirNbErreurs1Bg.graphics.beginFill("rgba(210,146,36,1)").drawRoundRect(0, 0, 29, 22, 2);
	}
	
	
	// texte 2 erreurs
	var choisirNbErreursText2 = new createjs.Text("errors", "21px monofett, Trebuchet MS");
	choisirNbErreursText2.x = choisirNbErreursBg2.x + 170;
	choisirNbErreursText2.y = 26;
	choisirNbErreursText2.textBaseline = "alphabetic";

	choisirNbErreurs.addChild(choisirNbErreursBg, choisirNbErreursBg2, choisirNbErreursText1, choisirNbErreursText2, choisirNbErreurs1, choisirNbErreurs2, choisirNbErreurs3);
	choisirNbErreurs.x = 805;
	choisirNbErreurs.y = 220;	

	// bouton Start
	startButton = new createjs.Bitmap(images["startButton"]);
	startButton.x = 320;
	startButton.y = 485;

	menu.addChild(fondMenuTrans, fondMenu, panneau1, choisirPlayer, choisirNbErreurs, startButton);
	stage.addChild(menu);
	
	createjs.Tween.get(choisirPlayer).to({x:-5}, 1000, createjs.Ease.cubicOut);
	createjs.Tween.get(choisirNbErreurs).wait(500).to({x:400}, 1000, createjs.Ease.cubicOut);
	createjs.Tween.get(startButton).wait(1000).to({y:385}, 1000, createjs.Ease.cubicOut);
	
	choisirPlayer1.addEventListener("click", handleClickMenu);
	choisirPlayer2.addEventListener("click", handleClickMenu);
	choisirNbErreurs1.addEventListener("click", handleClickMenu);
	choisirNbErreurs2.addEventListener("click", handleClickMenu);
	choisirNbErreurs3.addEventListener("click", handleClickMenu);
	startButton.addEventListener("click", tweenMenu);
	
};

var handleSound = function(event) {
	if (sonMute) {
		createjs.Sound.setMute(false)
		sonMute = false;
		barreTitre.getChildAt(3).visible = true;
		barreTitre.getChildAt(4).visible = false;
	} else {
		createjs.Sound.setMute(true)
		sonMute = true;
		barreTitre.getChildAt(3).visible = false;
		barreTitre.getChildAt(4).visible = true;
	}
};

var handleClickMenu = function (event) {
	switch (event.target.id) {
		case "player1":
			if (options.player === 2) {
				event.target.getChildAt(0).image = images["joueurJaune"];
				event.target.parent.getChildAt(2).getChildAt(0).image = images["joueurNoir"];
			}
			options.player = 1;
			createjs.Sound.play("sonClickMenu");
		break;
		
		case "player2":
			if (options.player === 1) {
				event.target.getChildAt(0).image = images["joueurJaune"];
				event.target.parent.getChildAt(1).getChildAt(0).image = images["joueurNoir"];
			}
			options.player = 2;
			createjs.Sound.play("sonClickMenu");
		break;
		
		case "erreurs1":
			if (options.erreurs !== 10) {
				event.target.getChildAt(0).graphics.clear().beginFill("rgba(210,146,36,1)").drawRoundRect(0, 0, 29, 22, 2);
				event.target.parent.getChildAt(5).getChildAt(0).graphics.clear().beginFill("rgba(210,146,36,0.1)").drawRoundRect(0, 0, 29, 22, 2);
				event.target.parent.getChildAt(6).getChildAt(0).graphics.clear().beginFill("rgba(210,146,36,0.1)").drawRoundRect(0, 0, 29, 22, 2);
			}
			options.erreurs = 10;
			createjs.Sound.play("sonClickMenu");
		break;
		
		case "erreurs2":
			if (options.erreurs !== 20) {
				event.target.getChildAt(0).graphics.clear().beginFill("rgba(210,146,36,1)").drawRoundRect(0, 0, 29, 22, 2);
				event.target.parent.getChildAt(4).getChildAt(0).graphics.clear().beginFill("rgba(210,146,36,0.1)").drawRoundRect(0, 0, 29, 22, 2);
				event.target.parent.getChildAt(6).getChildAt(0).graphics.clear().beginFill("rgba(210,146,36,0.1)").drawRoundRect(0, 0, 29, 22, 2);
			}
			options.erreurs = 20;
			createjs.Sound.play("sonClickMenu");
		break;
		
		case "erreurs3":
			if (options.erreurs !== 50) {
				event.target.getChildAt(0).graphics.clear().beginFill("rgba(210,146,36,1)").drawRoundRect(0, 0, 29, 22, 2);
				event.target.parent.getChildAt(4).getChildAt(0).graphics.clear().beginFill("rgba(210,146,36,0.1)").drawRoundRect(0, 0, 29, 22, 2);
				event.target.parent.getChildAt(5).getChildAt(0).graphics.clear().beginFill("rgba(210,146,36,0.1)").drawRoundRect(0, 0, 29, 22, 2);
			}
			options.erreurs = 50;
			createjs.Sound.play("sonClickMenu");
		break;
	}
	
};

var tweenMenu = function() {
	createjs.Sound.play("sonPower");
	musiqueMenu.stop();
	createjs.Tween.get(choisirPlayer).to({x:-405}, 1000, createjs.Ease.cubicOut);
	createjs.Tween.get(choisirNbErreurs).to({x:805}, 1000, createjs.Ease.cubicOut);
	createjs.Tween.get(star, {override:true}).to({scaleX:3, scaleY:3}, 1000, createjs.Ease.cubicOut);
	createjs.Tween.get(fondMenu).to({alpha:0}, 1000, createjs.Ease.cubicOut);
	createjs.Tween.get(fondMenuTrans).to({alpha:0}, 1000, createjs.Ease.cubicOut);
	createjs.Tween.get(startButton).to({y:485}, 1000, createjs.Ease.cubicOut).call(initGame);
	createjs.Tween.get(panneau1, {override:true}).to({x:830, skewX:10}, 500, createjs.Ease.linear);
};

// GAME

var initGame = function () {
	menu.removeAllEventListeners();
	stage.removeChild(menu);
	
	p1Targets.removeAllChildren();
	p1Rule1.removeAllChildren();
	p1Rule2.removeAllChildren();
	p1Rule3.removeAllChildren();
	p1Rule4.removeAllChildren();
	p1Rule5.removeAllChildren();
	p1Rule6.removeAllChildren();
	
	prochaineSec = 10;
	nextChangeAt = 20;
	createdThisSec = false;
	changementsAFaire.length = 0;
	changementsAFaireP1.length = 0;
	changementsAFaireP2.length = 0;
	P1InputsDone.length = 0;
	P1CollisionTargetTerrain.length = 0;
	P1CollisionTargetJoueur.length = 0;
	
	player1 = 	{
					erreurs	: 0,
					powers	: 0,
					position : 3,
					action : "stand",
					getChange : false,
					fire : false
				};
	
	regles =	{
					target	: [],
					take	: true,
					inputs	: ["Q", "W", "R", "U", "I", "P"],
					inverse	: false,
					pushes	: 1,
					playerI	: false,
					erreursMax	: options.erreurs,
					difficulte	: 0,
					finDuJeu	: false
				},
				
	reglesP1 = 	{
					target	: [],
					take	: true,
					inputs	: ["Q", "W", "R"],
					inverse	: false,
					pushes	: 1,
					changedInverse	: false
				};
		// FOND JEU
		
	var fondJeuTrans = new createjs.Bitmap(images["fondMenu"]);
	fondJeuTrans.y = 40;
	fondJeuTrans.alpha = 0.1;
	fondJeuTrans.cache(0,0,800,440);
	stage.addChild(fondJeuTrans);
	
		// FOND HUD
	
	var fondHUD = new createjs.Container();
	
	// var p1Screen = new createjs.Shape();
	// p1Screen.graphics.setStrokeStyle(2).beginStroke("black").drawRoundRect(190, 50, 200, 400, 5)			// largeur : 390 à 590 = 200 / hauteur : 50 à 450 = 400
															// .moveTo(190, 80).lineTo(390, 80)				// menu hauteur 90 / largeur 200
															// .moveTo(190, 110).lineTo(390, 110)
															// .moveTo(190, 140).lineTo(390, 140);
	var p1Screen = new createjs.Bitmap(images["fondJeu1"]);
	p1Screen.x = 185;
	p1Screen.y = 45;
	
	var p1Bg = new createjs.Shape();
	p1Bg.graphics	.beginFill("#90FFFF").drawRect(190, 140, 200, 285);										// terrain de jeu de : hauteur : 140 à 450 = 310 (-sol = 280)
					// .beginFill("#BCBCBC").drawRoundRect(190, 50, 200, 90, 5);
	var p1BgSol = new createjs.Bitmap(images["grassMid"]);
	p1BgSol.x = 190;
	p1BgSol.y = 416;				// sol à 420
	
	var p1Text = new createjs.Text("Player\nErrors\nPowers", "25px monofett, mercado one, Limelight, trebuchet ms");
	p1Text.lineWidth = 100;
	p1Text.lineHeight = 30;
	p1Text.textBaseline = "alphabetic";
	p1Text.x = 200;
	p1Text.y = 72;
	
	// var p1RulesBg = new createjs.Shape();
	// p1RulesBg.graphics	.beginFill("#BCBCBC").drawRoundRect(20, 50, 160, 32, 5)
						// .beginFill("#D035C1").drawRect(20, 82, 120, 32)
						// .beginFill("#F68BBD").drawRoundRect(140, 82, 40, 368, 5).beginFill()
						// .setStrokeStyle(2).beginStroke("black")	.drawRoundRect(20, 50, 160, 400, 5)
																// .moveTo(20, 82).lineTo(180, 82)
																// .moveTo(20, 114).lineTo(180, 114)
																// .moveTo(20, 114+56).lineTo(180, 114+56)
																// .moveTo(20, 114+2*56).lineTo(180, 114+2*56)
																// .moveTo(20, 114+3*56).lineTo(180, 114+3*56)
																// .moveTo(20, 114+4*56).lineTo(180, 114+4*56)
																// .moveTo(20, 114+5*56).lineTo(180, 114+5*56)
																// .moveTo(140, 82).lineTo(140, 450);
	
	var p1RulesBg = new createjs.Bitmap(images["fondJeu2"]);
	p1RulesBg.x = 15;
	p1RulesBg.y = 45;
	
	var p1RulesText = new createjs.Text("Player\n   Rules", "25px monofett, mercado one, Limelight, trebuchet ms");
	p1RulesText.lineWidth = 100;
	p1RulesText.lineHeight = 32;
	p1RulesText.textBaseline = "alphabetic";
	p1RulesText.x = 30;
	p1RulesText.y = 73;
	
	var imgClock = new createjs.Bitmap(images["clock"]);
	imgClock.x = 148;
	imgClock.y = 80;
	
	fondHUD.addChild(p1Bg, p1BgSol, p1Screen, p1Text, p1RulesBg, p1RulesText, imgClock);
	
		// HORS FOND HUD
	
	// Rule 1
	var imgCrosshair = new createjs.Bitmap(images["crosshair"]);
	imgCrosshair.x = 10;
	imgCrosshair.y = 1;
	var ruleRed = new createjs.Shape();
	ruleRed.graphics.beginBitmapFill(images[possibleTargets.colors[0]]).drawRect(0, 0, 20, 20);
	ruleRed.x = 68;
	ruleRed.y = 15;
	var ruleBlue = new createjs.Shape();
	ruleBlue.graphics.beginBitmapFill(images[possibleTargets.colors[1]]).drawRect(0, 0, 20, 20);
	ruleBlue.x = 68;
	ruleBlue.y = 15;
	p1Rule1.addChild(ruleRed, ruleBlue, imgCrosshair);
	
	var couleurInitiale = possibleTargets.colors[Math.floor(Math.random()*2)];
	regles.target[0] = couleurInitiale;
	reglesP1.target[0] = couleurInitiale;
	
	// Rule 2
	var imgRight = new createjs.Bitmap(images["right"]),
		imgWrong = new createjs.Bitmap(images["wrong"]);
	imgRight.x = 10;
	imgRight.y = 2;
	imgWrong.x = 10;
	imgWrong.y = 2;
	var ruleRight = new createjs.Text("Take", "13px trebuchet ms, sans-serif", "black");
	var ruleWrong = new createjs.Text("Take\nALL\nEXCEPT", "13px trebuchet ms, sans-serif", "black");
	ruleRight.lineHeight = 14;
	ruleRight.textBaseline = "alphabetic";
	ruleRight.x = 58;
	ruleRight.y = 29;
	ruleWrong.lineHeight = 14;
	ruleWrong.textBaseline = "alphabetic";
	ruleWrong.x = 58;
	ruleWrong.y = 15;
	p1Rule2.addChild(imgRight, imgWrong, ruleRight, ruleWrong);

	// Rule 3
	var imgInputs = new createjs.Bitmap(images["inputs"]);
	imgInputs.x = 5;
	imgInputs.y = 2;
	var ruleInputs = new createjs.Text("Left:\nRight:\nPower:", "12px trebuchet ms, sans-serif", "black");
	ruleInputs.lineWidth = 60;
	ruleInputs.lineHeight = 14;
	ruleInputs.textBaseline = "alphabetic";
	ruleInputs.x = 58;
	ruleInputs.y = 15;
	p1Rule3.addChild(imgInputs, ruleInputs);
	
	// Rule 4
	var imgInverse = new createjs.Bitmap(images["inverse"]);
	imgInverse.x = 10;
	imgInverse.y = 2;
	var imgCross = new createjs.Shape();
	imgCross.graphics.setStrokeStyle(2, "round").beginStroke("black").moveTo(6, 6).lineTo(50, 50).moveTo(50, 6).lineTo(6, 50);
	var ruleInverted = new createjs.Text("Inverted\ncontrols", "13px trebuchet ms, sans-serif", "black");
	ruleInverted.lineWidth = 55;
	ruleInverted.lineHeight = 14;
	ruleInverted.maxWidth = 55;
	ruleInverted.x = 58;
	ruleInverted.y = 21;
	ruleInverted.textBaseline = "alphabetic";
	var ruleNonInverted = new createjs.Text("Non-\nInverted\ncontrols", "13px trebuchet ms, sans-serif", "black");
	ruleNonInverted.lineWidth = 55;
	ruleNonInverted.lineHeight = 14;
	ruleNonInverted.maxWidth = 55;
	ruleNonInverted.x = 58;
	ruleNonInverted.y = 16;
	ruleNonInverted.textBaseline = "alphabetic";
	p1Rule4.addChild(imgInverse, imgCross, ruleInverted, ruleNonInverted);
	
	// Rule 5
	var imgPush = new createjs.Bitmap(images["push"]);
	imgPush.x = 10;
	imgPush.y = 2;
	var rulePush = new createjs.Text("Presses\nnecessary:\n", "12px trebuchet ms, sans-serif", "black");
	rulePush.lineWidth = 55;
	rulePush.lineHeight = 14;
	rulePush.maxWidth = 55;
	rulePush.x = 58;
	rulePush.y = 16;
	rulePush.textBaseline = "alphabetic";
	p1Rule5.addChild(imgPush, rulePush);
	
	// Rule 6
	var imgPlayer = new createjs.Bitmap(images["player"]);
	imgPlayer.x = 10;
	imgPlayer.y = 2;
	var rulePlayer = new createjs.Text("You play:\n", "12px trebuchet ms, sans-serif", "black");
	rulePlayer.lineWidth = 55;
	rulePlayer.lineHeight = 14;
	rulePlayer.maxWidth = 55;
	rulePlayer.x = 58;
	rulePlayer.y = 19;
	rulePlayer.textBaseline = "alphabetic";
	p1Rule6.addChild(imgPlayer, rulePlayer);
	
	// Timers des règles
	p1TimerRule1 = new createjs.Text("", "30px bangers, courrier new", "#E5E5E5");
	p1TimerRule2 = new createjs.Text("", "30px bangers, courrier new", "#E5E5E5");
	p1TimerRule3 = new createjs.Text("", "30px bangers, courrier new", "#E5E5E5");
	p1TimerRule4 = new createjs.Text("", "30px bangers, courrier new", "#E5E5E5");
	p1TimerRule5 = new createjs.Text("", "30px bangers, courrier new", "#E5E5E5");
	p1TimerRule6 = new createjs.Text("", "30px bangers, courrier new", "#E5E5E5");
	
	// Sprite joueur
	var dataSpriteSheet1 = 	{
								framerate	: 60,
								images		: [images["p1SpriteSheet"]],
								frames		: 	[
													[0, 0, 72, 97, 0, 36, 48],
													[73, 0, 72, 97, 0, 36, 48],
													[146, 0, 72, 97, 0, 36, 48],
													[0, 98, 72, 97, 0, 36, 48],
													[73, 98, 72, 97, 0, 36, 48],
													[146, 98, 72, 97, 0, 36, 48],
													[219, 0, 72, 97, 0, 36, 48],
													[292, 0, 72, 97, 0, 36, 48],
													[219, 98, 72, 97, 0, 36, 48],
													[365, 0, 72, 97, 0, 36, 48],
													[292, 98, 72, 97, 0, 36, 48]
												],
								animations	: 	{
													run	: [0, 10],
													stand : 0
												}
							};
	var player1SpriteSheet = new createjs.SpriteSheet(dataSpriteSheet1);
	player1Animation = new createjs.Sprite(player1SpriteSheet);
	player1Animation.gotoAndPlay("stand");
	
	// Compte à rebours
	var p1TimerCAR3 = new createjs.Text("3", "100px bangers, courrier new", "red");
	var p1TimerCAR2 = new createjs.Text("2", "100px bangers, courrier new", "red");
	var p1TimerCAR1 = new createjs.Text("1", "100px bangers, courrier new", "red");
	p1TimerCAR1.regX = 25;
	p1TimerCAR1.regY = 50;
	p1TimerCAR1.textBaseline = "alphabetic";
	p1TimerCAR1.visible = false;
	p1TimerCAR2.regX = 25;
	p1TimerCAR2.regY = 50;
	p1TimerCAR2.textBaseline = "alphabetic";
	p1TimerCAR2.visible = false;
	p1TimerCAR3.regX = 25;
	p1TimerCAR3.regY = 50;
	p1TimerCAR3.textBaseline = "alphabetic";
	p1TimerCAR3.visible = false;
	
	// Timer
	timer.y = 30;
	timer.x = 760;
	timer.lineWidth = 150;
	timer.textAlign = "right";
	timer.textBaseline = "alphabetic";
	timer.text = "00:00.00";	
	timerOutline.y = 30;
	timerOutline.x = 760;
	timerOutline.lineWidth = 150;
	timerOutline.textAlign = "right";
	timerOutline.textBaseline = "alphabetic";
	timerOutline.text = "00:00.00";
	
	// EN FONCTION NOMBRE PLAYER
	
	if (options.player === 1) {
	
		player1XOffset = 200;
		
		var barrerPowerRule3 = new createjs.Shape();
		barrerPowerRule3.graphics.beginStroke("black").moveTo(56, 40).lineTo(110, 40);
		p1Rule3.addChild(barrerPowerRule3);
		
		var barrerPowerHUD = new createjs.Shape();
		barrerPowerHUD.graphics.setStrokeStyle(3, "round").beginStroke("black").moveTo(198, 122).lineTo(317, 122);
		
	} else {
		player1XOffset = 0;
		
		p2Targets.removeAllChildren();
		p2Rule1.removeAllChildren();
		p2Rule2.removeAllChildren();
		p2Rule3.removeAllChildren();
		p2Rule4.removeAllChildren();
		p2Rule5.removeAllChildren();
		p2Rule6.removeAllChildren();
		
		P2InputsDone.length = 0;
		P2CollisionTargetTerrain.length = 0;
		P2CollisionTargetJoueur.length = 0;
		
		player2 = 	{
						erreurs	: 0,
						powers	: 0,
						position : 3,
						action : "stand",
						getChange : false,
						fire : false
					};
		
		reglesP2 = 	{
						target	: [],
						take	: true,
						inputs	: ["U", "I", "P"],
						inverse	: false,
						pushes	: 1,
						changedInverse	: false
					};
					
		var P2fondHUD = fondHUD.clone(true);
		
				// HORS FOND HUD
	
		// Rule 1
		p2Rule1 = p1Rule1.clone(true);
		reglesP2.target[0] = couleurInitiale;
		
		// Rule 2
		p2Rule2 = p1Rule2.clone(true);

		// Rule 3
		p2Rule3 = p1Rule3.clone(true);
		
		// Rule 4
		p2Rule4 = p1Rule4.clone(true);
		
		// Rule 5
		p2Rule5 = p1Rule5.clone(true);
		
		// Rule 6
		p2Rule6 = p1Rule6.clone(true);
		
		// Timers des règles
		p2TimerRule1 = new createjs.Text("", "30px bangers, courrier new", "#E5E5E5");
		p2TimerRule2 = new createjs.Text("", "30px bangers, courrier new", "#E5E5E5");
		p2TimerRule3 = new createjs.Text("", "30px bangers, courrier new", "#E5E5E5");
		p2TimerRule4 = new createjs.Text("", "30px bangers, courrier new", "#E5E5E5");
		p2TimerRule5 = new createjs.Text("", "30px bangers, courrier new", "#E5E5E5");
		p2TimerRule6 = new createjs.Text("", "30px bangers, courrier new", "#E5E5E5");
		
		// Sprite joueur 2
		var dataSpriteSheet2 = 	{
									framerate	: 60,
									images		: [images["p2SpriteSheet"]],
									frames		: 	[
														[0, 0, 72, 97, 0, 36, 48],
														[73, 0, 72, 97, 0, 36, 48],
														[146, 0, 72, 97, 0, 36, 48],
														[0, 98, 72, 97, 0, 36, 48],
														[73, 98, 72, 97, 0, 36, 48],
														[146, 98, 72, 97, 0, 36, 48],
														[219, 0, 72, 97, 0, 36, 48],
														[292, 0, 72, 97, 0, 36, 48],
														[219, 98, 72, 97, 0, 36, 48],
														[365, 0, 72, 97, 0, 36, 48],
														[292, 98, 72, 97, 0, 36, 48]
													],
									animations	: 	{
														run	: [0, 10],
														stand : 0
													}
								};
		var player2SpriteSheet = new createjs.SpriteSheet(dataSpriteSheet2);
		player2Animation = new createjs.Sprite(player2SpriteSheet);
		player2Animation.gotoAndPlay("stand");
		
		// Compte à rebours
		var p2TimerCAR3 = p1TimerCAR3.clone(true);
		var p2TimerCAR2 = p1TimerCAR2.clone(true);
		var p2TimerCAR1 = p1TimerCAR1.clone(true);
		
		// Placement des éléments en fonction offset
		p2Rule1.x = player2XOffset + 20;
		p2Rule1.y = 114;
		
		p2Rule2.x = player2XOffset + 20;
		p2Rule2.y = 114+56;
		
		p2Rule3.x = player2XOffset + 20;
		p2Rule3.y = 114+2*56;
		
		p2Rule4.x = player2XOffset + 20;
		p2Rule4.y = 114+3*56;
		p2Rule4.alpha = 0.2;
		
		p2Rule5.x = player2XOffset + 20;
		p2Rule5.y = 114+4*56;
		p2Rule5.alpha = 0.2;
		
		p2Rule6.x = player2XOffset + 20;
		p2Rule6.y = 114+5*56;
		p2Rule6.alpha = 0.2;
		
		p2TimerRule1.x = player2XOffset + 153;
		p2TimerRule1.y = 123;
		p2TimerRule1.visible = false;
		
		p2TimerRule2.x = player2XOffset + 153;
		p2TimerRule2.y = 123+56;
		p2TimerRule2.visible = false;
		
		p2TimerRule3.x = player2XOffset + 153;
		p2TimerRule3.y = 123+2*56;
		p2TimerRule3.visible = false;
		
		p2TimerRule4.x = player2XOffset + 153;
		p2TimerRule4.y = 123+3*56;
		p2TimerRule4.visible = false;
		
		p2TimerRule5.x = player2XOffset + 153;
		p2TimerRule5.y = 123+4*56;
		p2TimerRule5.visible = false;
		
		p2TimerRule6.x = player2XOffset + 153;
		p2TimerRule6.y = 123+5*56;
		p2TimerRule6.visible = false;
		
		
		player2Animation.x = player2XOffset + terrainXOffset + 40 * player2.position - 20;
		player2Animation.y = solYOffset - 22;
		player2Animation.scaleX = 0.5;
		player2Animation.scaleY = 0.5;
		player2Animation.shadow = shadowP;

		
		p2Targets.x = player2XOffset + terrainXOffset;
		p2Targets.y = terrainYOffset;
		
		p2TimerCAR3.x = player2XOffset + terrainXOffset + 100;
		p2TimerCAR3.y = 140 + 230;
		p2TimerCAR2.x = player2XOffset + terrainXOffset + 100;
		p2TimerCAR2.y = 140 + 230;
		p2TimerCAR1.x = player2XOffset + terrainXOffset + 100;
		p2TimerCAR1.y = 140 + 230;
		
		// affichage rule 1 initiale
		if (couleurInitiale === possibleTargets.colors[0]) {	
			p2Rule1.getChildAt(0).visible = true;
			p2Rule1.getChildAt(1).visible = false;
		} else if (couleurInitiale === possibleTargets.colors[1]) {
			p2Rule1.getChildAt(1).visible = true;
			p2Rule1.getChildAt(0).visible = false;
		}
		
		// affichage rule 2 initale
		p2Rule2.getChildAt(0).visible = true;
		p2Rule2.getChildAt(2).visible = true;
		p2Rule2.getChildAt(1).visible = false;
		p2Rule2.getChildAt(3).visible = false;
		
		// affichage rule 3 initiale
		p2Rule3.getChildAt(1).text = "Left: " + reglesP2.inputs[0] + "\nRight: " + reglesP2.inputs[1] + "\nPower: " + reglesP2.inputs[2];
		
		// affichage rule 4 initiale
		p2Rule4.getChildAt(0).visible = true;
		p2Rule4.getChildAt(1).visible = true;
		p2Rule4.getChildAt(2).visible = false;
		p2Rule4.getChildAt(3).visible = true;
		
		// affichage rule 5 initiale
		p2Rule5.getChildAt(1).text = "Presses\nnecessary:\n" + reglesP2.pushes;
		
		// affichage rule 6 initiale
		p2Rule6.getChildAt(1).text = "You play:\n" + "yourself";
		
		// affichage num player (en fonction de fondHUD)
		var num1Player2 = new createjs.Text("2", "25px monofett, mercado one, Limelight, trebuchet ms");
		num1Player2.lineHeight = 30;
		num1Player2.x = 300;
		num1Player2.y = 72;
		num1Player2.textBaseline = "alphabetic";
		var num2Player2 = new createjs.Text("2", "25px monofett, mercado one, Limelight, trebuchet ms");
		num2Player2.lineHeight = 32;
		num2Player2.x = 130;
		num2Player2.y = 73; 
		num2Player2.textBaseline = "alphabetic";
		var imgHUD1Player2 = new createjs.Bitmap(images["HUDP2"]);
		imgHUD1Player2.scaleX = 0.5;
		imgHUD1Player2.scaleY = 0.5;
		imgHUD1Player2.x = 318;
		imgHUD1Player2.y = 50;
		var imgHUD2Player2 = new createjs.Bitmap(images["HUDP2"]);
		imgHUD2Player2.scaleX = 0.5;
		imgHUD2Player2.scaleY = 0.5;
		imgHUD2Player2.x = 148;
		imgHUD2Player2.y = 51;
		
		// affichage erreurs
		p2ErreursText.text = player2.erreurs + " / " + regles.erreursMax;
		p2ErreursText.lineHeight = 30;
		p2ErreursText.x = player2XOffset + 300;
		p2ErreursText.y = 102;
		p2ErreursText.textBaseline = "alphabetic";
		
		// affichage powers
		p2PowersText.text = player2.powers;
		p2PowersText.lineHeight = 30;
		p2PowersText.x = player2XOffset + 300;
		p2PowersText.y = 132;
		p2PowersText.textBaseline = "alphabetic";
		
		P2fondHUD.addChild(num1Player2, num2Player2, imgHUD1Player2, imgHUD2Player2);
		P2fondHUD.x = player2XOffset;
		P2fondHUD.cache(0, 0, 400, 480);
		stage.addChild(P2fondHUD);
		
		// compte à rebours
		createjs.Tween.get(p2TimerCAR3).to({visible:true}).to({alpha:0, scaleX:1.5, scaleY:1.5}, 800, createjs.Ease.cubicOut);
		createjs.Tween.get(p2TimerCAR2).wait(1000).to({visible:true}).to({alpha:0, scaleX:1.5, scaleY:1.5}, 800, createjs.Ease.cubicOut);
		createjs.Tween.get(p2TimerCAR1).wait(2000).to({visible:true}).to({alpha:0, scaleX:1.5, scaleY:1.5}, 800, createjs.Ease.cubicOut);
		
	}
		
	p1Rule1.x = player1XOffset + 20;
	p1Rule1.y = 114;
	
	p1Rule2.x = player1XOffset + 20;
	p1Rule2.y = 114+56;
	
	p1Rule3.x = player1XOffset + 20;
	p1Rule3.y = 114+2*56;
	
	p1Rule4.x = player1XOffset + 20;
	p1Rule4.y = 114+3*56;
	p1Rule4.alpha = 0.2;
	
	p1Rule5.x = player1XOffset + 20;
	p1Rule5.y = 114+4*56;
	p1Rule5.alpha = 0.2;
	
	p1Rule6.x = player1XOffset + 20;
	p1Rule6.y = 114+5*56;
	p1Rule6.alpha = 0.2;
	
	p1TimerRule1.x = player1XOffset + 153;
	p1TimerRule1.y = 123;
	p1TimerRule1.visible = false;
	
	p1TimerRule2.x = player1XOffset + 153;
	p1TimerRule2.y = 123+56;
	p1TimerRule2.visible = false;
	
	p1TimerRule3.x = player1XOffset + 153;
	p1TimerRule3.y = 123+2*56;
	p1TimerRule3.visible = false;
	
	p1TimerRule4.x = player1XOffset + 153;
	p1TimerRule4.y = 123+3*56;
	p1TimerRule4.visible = false;
	
	p1TimerRule5.x = player1XOffset + 153;
	p1TimerRule5.y = 123+4*56;
	p1TimerRule5.visible = false;
	
	p1TimerRule6.x = player1XOffset + 153;
	p1TimerRule6.y = 123+5*56;
	p1TimerRule6.visible = false;
	
	
	player1Animation.x = player1XOffset + terrainXOffset + 40 * player1.position - 20;
	player1Animation.y = solYOffset - 22;
	player1Animation.scaleX = 0.5;
	player1Animation.scaleY = 0.5;
	player1Animation.shadow = shadowP;

	
	p1Targets.x = player1XOffset + terrainXOffset;
	p1Targets.y = terrainYOffset;
	
	p1TimerCAR3.x = player1XOffset + terrainXOffset + 100;
	p1TimerCAR3.y = 140 + 230;
	p1TimerCAR2.x = player1XOffset + terrainXOffset + 100;
	p1TimerCAR2.y = 140 + 230;
	p1TimerCAR1.x = player1XOffset + terrainXOffset + 100;
	p1TimerCAR1.y = 140 + 230;
	
	// affichage rule 1 initiale
	if (couleurInitiale === possibleTargets.colors[0]) {	
		p1Rule1.getChildAt(0).visible = true;
		p1Rule1.getChildAt(1).visible = false;
	} else if (couleurInitiale === possibleTargets.colors[1]) {
		p1Rule1.getChildAt(1).visible = true;
		p1Rule1.getChildAt(0).visible = false;
	}
	
	// affichage rule 2 initale
	p1Rule2.getChildAt(0).visible = true;
	p1Rule2.getChildAt(2).visible = true;
	p1Rule2.getChildAt(1).visible = false;
	p1Rule2.getChildAt(3).visible = false;
	
	// affichage rule 3 initiale
	p1Rule3.getChildAt(1).text = "Left: " + reglesP1.inputs[0] + "\nRight: " + reglesP1.inputs[1] + "\nPower: " + reglesP1.inputs[2];
	
	// affichage rule 4 initiale
	p1Rule4.getChildAt(0).visible = true;
	p1Rule4.getChildAt(1).visible = true;
	p1Rule4.getChildAt(2).visible = false;
	p1Rule4.getChildAt(3).visible = true;
	
	// affichage rule 5 initiale
	p1Rule5.getChildAt(1).text = "Presses necessary : " + reglesP1.pushes;
	
	// affichage rule 6 initiale
	p1Rule6.getChildAt(1).text = "You play:\n" + "yourself";
	
	// affichage num player (en fonction de fondHUD)
	var num1Player = new createjs.Text("1", "25px monofett, mercado one, Limelight, trebuchet ms");
	num1Player.lineHeight = 30;
	num1Player.x = 300;
	num1Player.y = 72;
	num1Player.textBaseline = "alphabetic";
	var num2Player = new createjs.Text("1", "25px monofett, mercado one, Limelight, trebuchet ms");
	num2Player.lineHeight = 32;
	num2Player.x = 130;
	num2Player.y = 73; 
	num2Player.textBaseline = "alphabetic";
	var imgHUD1Player = new createjs.Bitmap(images["HUDP1"]);
	imgHUD1Player.scaleX = 0.5;
	imgHUD1Player.scaleY = 0.5;
	imgHUD1Player.x = 318;
	imgHUD1Player.y = 50;
	var imgHUD2Player = new createjs.Bitmap(images["HUDP1"]);
	imgHUD2Player.scaleX = 0.5;
	imgHUD2Player.scaleY = 0.5;
	imgHUD2Player.x = 148;
	imgHUD2Player.y = 51;
	
	// affichage erreurs
	p1ErreursText.text = player1.erreurs + " / " + regles.erreursMax;
	p1ErreursText.lineHeight = 30;
	p1ErreursText.x = player1XOffset + 300;
	p1ErreursText.y = 102;
	p1ErreursText.textBaseline = "alphabetic";
	
	// affichage powers
	p1PowersText.text = player1.powers;
	p1PowersText.lineHeight = 30;
	p1PowersText.x = player1XOffset + 300;
	p1PowersText.y = 132;
	p1PowersText.textBaseline = "alphabetic";
	
	fondHUD.addChild(num1Player, num2Player, imgHUD1Player, imgHUD2Player, barrerPowerHUD);
	fondHUD.x = player1XOffset;
	fondHUD.cache(0, 0, 400, 480);
	stage.addChild(fondHUD);
	
	// compte à rebours
	createjs.Tween.get(p1TimerCAR3).to({visible:true}).to({alpha:0, scaleX:1.5, scaleY:1.5}, 800, createjs.Ease.cubicOut);
	createjs.Tween.get(p1TimerCAR2).wait(1000).to({visible:true}).to({alpha:0, scaleX:1.5, scaleY:1.5}, 800, createjs.Ease.cubicOut);
	createjs.Tween.get(p1TimerCAR1).wait(2000).to({visible:true}).to({alpha:0, scaleX:1.5, scaleY:1.5}, 800, createjs.Ease.cubicOut).call(preGameLoop);
	createjs.Sound.play("sonCAR", {loop:2});
	
	stage.addChild(p1Rule1, p1Rule2, p1Rule3, p1Rule4, p1Rule5, p1Rule6, p1TimerRule1, p1TimerRule2, p1TimerRule3, p1TimerRule4, p1TimerRule5, p1TimerRule6, p1ErreursText, p1PowersText, player1Animation, timerOutline, timer, p1Targets);

	if (options.player === 2) {
		stage.addChild(p2Rule1, p2Rule2, p2Rule3, p2Rule4, p2Rule5, p2Rule6, p2TimerRule1, p2TimerRule2, p2TimerRule3, p2TimerRule4, p2TimerRule5, p2TimerRule6, p2ErreursText, p2PowersText, player2Animation, p2Targets, p2TimerCAR3, p2TimerCAR2, p2TimerCAR1);
	}
	
	stage.addChild(p1TimerCAR3, p1TimerCAR2, p1TimerCAR1);
};

var rulePresses = function () {
	var animEnCoursP1 = player1Animation.currentAnimation;
	if (P1InputsDone[0] && (animEnCoursP1 !== "run" || (animEnCoursP1 === "run" && P1InputsDone[0] === "power"))) {
		switch(reglesP1.pushes) {
			case 1 :
				if (P1InputsDone[0]) {
					switch(P1InputsDone[0]) {
						case "left" :
							player1.action = "goLeft";
							reglesP1.changedInverse = false;
						break;
						
						case "right" :
							player1.action = "goRight";
							reglesP1.changedInverse = false;
						break;
						
						case "power" :
							player1.fire = true;
						break;
					}
					P1InputsDone.length = 0;
				}
			break;
			
			case 2 :
				if (P1InputsDone[0] && P1InputsDone[1] && P1InputsDone[0] === P1InputsDone[1]) {
					switch(P1InputsDone[0]) {
						case "left" :
							player1.action = "goLeft";
							reglesP1.changedInverse = false;
						break;
						
						case "right" :
							player1.action = "goRight";
							reglesP1.changedInverse = false;
						break;
						
						case "power" :
							player1.fire = true;
						break;
					}
					P1InputsDone.length = 0;
				}
			break;
			
			case 3 :
				if (P1InputsDone[0] && P1InputsDone[1] && P1InputsDone[2] && P1InputsDone[0] === P1InputsDone[1] && P1InputsDone[1] === P1InputsDone[2]) {
					switch(P1InputsDone[0]) {
						case "left" :
							player1.action = "goLeft";
							reglesP1.changedInverse = false;
						break;
						
						case "right" :
							player1.action = "goRight";
							reglesP1.changedInverse = false;
						break;
						
						case "power" :
							player1.fire = true;
						break;
					}
					P1InputsDone.length = 0;
				}
			break;
		}
	} else {
		P1InputsDone.length = 0;
	}
	
	if (options.player === 2) {
		var animEnCoursP2 = player2Animation.currentAnimation;
		if (P2InputsDone[0] && (animEnCoursP2 !== "run" || (animEnCoursP2 === "run" && P2InputsDone[0] === "power"))) {
			switch(reglesP2.pushes) {
				case 1 :
					if (P2InputsDone[0]) {
						switch(P2InputsDone[0]) {
							case "left" :
								player2.action = "goLeft";
								reglesP2.changedInverse = false;
							break;
							
							case "right" :
								player2.action = "goRight";
								reglesP2.changedInverse = false;
							break;
							
							case "power" :
								player2.fire = true;
							break;
						}
						P2InputsDone.length = 0;
					}
				break;
				
				case 2 :
					if (P2InputsDone[0] && P2InputsDone[1] && P2InputsDone[0] === P2InputsDone[1]) {
						switch(P2InputsDone[0]) {
							case "left" :
								player2.action = "goLeft";
								reglesP2.changedInverse = false;
							break;
							
							case "right" :
								player2.action = "goRight";
								reglesP2.changedInverse = false;
							break;
							
							case "power" :
								player2.fire = true;
							break;
						}
						P2InputsDone.length = 0;
					}
				break;
				
				case 3 :
					if (P2InputsDone[0] && P2InputsDone[1] && P2InputsDone[2] && P2InputsDone[0] === P2InputsDone[1] && P2InputsDone[1] === P2InputsDone[2]) {
						switch(P2InputsDone[0]) {
							case "left" :
								player2.action = "goLeft";
								reglesP2.changedInverse = false;
							break;
							
							case "right" :
								player2.action = "goRight";
								reglesP2.changedInverse = false;
							break;
							
							case "power" :
								player2.fire = true;
							break;
						}
						P2InputsDone.length = 0;
					}
				break;
			}
		} else {
			P2InputsDone.length = 0;
		}
	}
};

var action = function() {
	var animEnCoursP1 = player1Animation.currentAnimation;
	
	if (!reglesP1.changedInverse && reglesP1.inverse && player1.action === "goLeft") {
		player1.action = "goRight";
		reglesP1.changedInverse = true;
	} else if (!reglesP1.changedInverse && reglesP1.inverse && player1.action === "goRight") {
		player1.action = "goLeft";
		reglesP1.changedInverse = true;
	}
	
	switch(player1.action) {
		case "stand" :
			if (animEnCoursP1 !== "stand") {
				player1Animation.gotoAndPlay("stand");
			}
		break;
		
		case "goLeft" :
			if (animEnCoursP1 !== "run") {
				if (player1.position !== 1) {
					player1.position--;
					player1Animation.scaleX = -0.5;
					player1Animation.gotoAndPlay("run");
				}
			}
		break;
		
		case "goRight" :
			if (animEnCoursP1 !== "run") {
				if (player1.position !== 5) {
					player1.position++;
					player1Animation.scaleX = 0.5;
					player1Animation.gotoAndPlay("run");
				}
			}
		break;
	}
	if (player1.fire && options.player === 2) {
		if (player1.powers > 0) {
			player2.getChange = true;
			player1.fire = false;
		}
	}

	if (options.player === 2) {
		var animEnCoursP2 = player2Animation.currentAnimation;
	
		if (!reglesP2.changedInverse && reglesP2.inverse && player2.action === "goLeft") {
			player2.action = "goRight";
			reglesP2.changedInverse = true;
		} else if (!reglesP2.changedInverse && reglesP2.inverse && player2.action === "goRight") {
			player2.action = "goLeft";
			reglesP2.changedInverse = true;
		}
		
		switch(player2.action) {
			case "stand" :
				if (animEnCoursP2 !== "stand") {
					player2Animation.gotoAndPlay("stand");
				}
			break;
			
			case "goLeft" :
				if (animEnCoursP2 !== "run") {
					if (player2.position !== 1) {
						player2.position--;
						player2Animation.scaleX = -0.5;
						player2Animation.gotoAndPlay("run");
					}
				}
			break;
			
			case "goRight" :
				if (animEnCoursP2 !== "run") {
					if (player2.position !== 5) {
						player2.position++;
						player2Animation.scaleX = 0.5;
						player2Animation.gotoAndPlay("run");
					}
				}
			break;
		}
		if (player2.fire) {
			if (player2.powers > 0) {
				player1.getChange = true;
				player2.fire = false;
			}
		}
	}
};

var deplacements = function() {
	// PLAYER 1
	var animEnCoursP1 = player1Animation.currentAnimation;
	if (animEnCoursP1 === "run") {
	 if (player1.action === "goLeft") {
		if (player1Animation.x > player1XOffset + terrainXOffset + 40 * player1.position - 20) {
			player1Animation.x -= vitesseX;
		} else {
			player1Animation.x = player1XOffset + terrainXOffset + 40 * player1.position - 20;
			player1.action = "stand";
			player1Animation.gotoAndPlay("stand");
		}
	 } else if (player1.action === "goRight") {
		if (player1Animation.x < player1XOffset + terrainXOffset + 40 * player1.position - 20) {
			player1Animation.x += vitesseX;
		} else {
			player1Animation.x = player1XOffset + terrainXOffset + 40 * player1.position - 20;
			player1.action = "stand";
			player1Animation.gotoAndPlay("stand");
		}
	 }
	};
	
	// TARGETS 1
	var nbTargetsP1 = p1Targets.getNumChildren();
	var toRemoveP1 = [];
	for (var i = 0; i < nbTargetsP1; i++) {
		var currentTarget = p1Targets.getChildAt(i);
		if (currentTarget.alpha === 0) {
			toRemoveP1.push(currentTarget);
		} else if (currentTarget.name !== "nomore"){
			currentTarget.y += vitesseY;
		}
	}
	for (var i = 0; i < toRemoveP1.length; i++) {
		p1Targets.removeChild(toRemoveP1[i]);
	}
	toRemoveP1.length = 0;
	
	if (options.player === 2) {
		// PLAYER 2
		var animEnCoursP2 = player2Animation.currentAnimation;
		if (animEnCoursP2 === "run") {
		 if (player2.action === "goLeft") {
			if (player2Animation.x > player2XOffset + terrainXOffset + 40 * player2.position - 20) {
				player2Animation.x -= vitesseX;
			} else {
				player2Animation.x = player2XOffset + terrainXOffset + 40 * player2.position - 20;
				player2.action = "stand";
				player2Animation.gotoAndPlay("stand");
			}
		 } else if (player2.action === "goRight") {
			if (player2Animation.x < player2XOffset + terrainXOffset + 40 * player2.position - 20) {
				player2Animation.x += vitesseX;
			} else {
				player2Animation.x = player2XOffset + terrainXOffset + 40 * player2.position - 20;
				player2.action = "stand";
				player2Animation.gotoAndPlay("stand");
			}
		 }
		};
		
		// TARGETS 2
		var nbTargetsP2 = p2Targets.getNumChildren();
		var toRemoveP2 = [];
		for (var i = 0; i < nbTargetsP2; i++) {
			var currentTarget = p2Targets.getChildAt(i);
			if (currentTarget.alpha === 0) {
				toRemoveP2.push(currentTarget);
			} else if (currentTarget.name !== "nomore"){
				currentTarget.y += vitesseY;
			}
		}
		for (var i = 0; i < toRemoveP2.length; i++) {
			p2Targets.removeChild(toRemoveP2[i]);
		}
		toRemoveP2.length = 0;
	}
};

var checkErrors = function() {
	for (var i = 0; i < P1CollisionTargetTerrain.length; i++) {
		var currentTarget = p1Targets.getChildAt(P1CollisionTargetTerrain[i]);
		if ((currentTarget.name === reglesP1.target[0] && reglesP1.take === true) || (currentTarget.name !== reglesP1.target[0] && currentTarget.name !== "power" && reglesP1.take === false)) {
			player1.erreurs++;
			currentTarget.name = "nomore";
			createjs.Tween.get(currentTarget).to({scaleX:0, scaleY:0, y:310, alpha:0, rotation:360}, 1000, createjs.Ease.linear);
			if (player1.erreurs >= regles.erreursMax) {
				regles.finDuJeu = true;
			}
		} else if (options.player === 2 && currentTarget.name === "power") {
			currentTarget.name = "nomore";
			createjs.Tween.get(currentTarget).to({scaleX:0, scaleY:0, y:310, alpha:0, rotation:360}, 1000, createjs.Ease.linear);
		} else {
			currentTarget.name = "nomore";
			createjs.Tween.get(currentTarget).to({scaleX:1.4, scaleY:1.4, y:currentTarget.y-30, alpha:0}, 1000, createjs.Ease.linear);
		}
	}
	P1CollisionTargetTerrain.length = 0;
	
	for (var i = 0; i < P1CollisionTargetJoueur.length; i++) {
		var currentTarget = p1Targets.getChildAt(P1CollisionTargetJoueur[i]);
		if ((currentTarget.name === reglesP1.target[0] && reglesP1.take === false) || (currentTarget.name !== reglesP1.target[0] && currentTarget.name !== "power" && reglesP1.take === true)) {
			player1.erreurs++;
			currentTarget.name = "nomore";
			createjs.Tween.get(currentTarget).to({scaleX:0, scaleY:0, y:310, alpha:0, rotation:360}, 1000, createjs.Ease.linear);
			if (player1.erreurs >= regles.erreursMax) {
				regles.finDuJeu = true;
			}
		} else if (options.player === 2 && currentTarget.name === "power") {
			player1.powers++;
			currentTarget.name = "nomore";
			createjs.Tween.get(currentTarget).to({scaleX:1.4, scaleY:1.4, y:currentTarget.y-30, alpha:0}, 1000, createjs.Ease.linear);
		} else {
			currentTarget.name = "nomore";
			createjs.Tween.get(currentTarget).to({scaleX:1.4, scaleY:1.4, y:currentTarget.y-30, alpha:0}, 1000, createjs.Ease.linear);
		}
	}
	P1CollisionTargetJoueur.length = 0;
	
	calcErrors = false;
	
	if (options.player === 2) {
		for (var i = 0; i < P2CollisionTargetTerrain.length; i++) {
			var currentTarget = p2Targets.getChildAt(P2CollisionTargetTerrain[i]);
			if ((currentTarget.name === reglesP2.target[0] && reglesP2.take === true) || (currentTarget.name !== reglesP2.target[0] && currentTarget.name !== "power" && reglesP2.take === false)) {
				player2.erreurs++;
				currentTarget.name = "nomore";
				createjs.Tween.get(currentTarget).to({scaleX:0, scaleY:0, y:310, alpha:0, rotation:360}, 1000, createjs.Ease.linear);
				if (player2.erreurs >= regles.erreursMax) {
					regles.finDuJeu = true;
				}
			} else if (currentTarget.name === "power") {
				currentTarget.name = "nomore";
				createjs.Tween.get(currentTarget).to({scaleX:0, scaleY:0, y:310, alpha:0, rotation:360}, 1000, createjs.Ease.linear);
			} else {
				currentTarget.name = "nomore";
				createjs.Tween.get(currentTarget).to({scaleX:1.4, scaleY:1.4, y:currentTarget.y-30, alpha:0}, 1000, createjs.Ease.linear);
			}
		}
		P2CollisionTargetTerrain.length = 0;
	
		for (var i = 0; i < P2CollisionTargetJoueur.length; i++) {
			var currentTarget = p2Targets.getChildAt(P2CollisionTargetJoueur[i]);
			if ((currentTarget.name === reglesP2.target[0] && reglesP2.take === false) || (currentTarget.name !== reglesP2.target[0] && currentTarget.name !== "power" && reglesP2.take === true)) {
				player2.erreurs++;
				currentTarget.name = "nomore";
				createjs.Tween.get(currentTarget).to({scaleX:0, scaleY:0, y:310, alpha:0, rotation:360}, 1000, createjs.Ease.linear);
				if (player2.erreurs >= regles.erreursMax) {
					regles.finDuJeu = true;
				}
			} else if (currentTarget.name === "power") {
				player2.powers++;
				currentTarget.name = "nomore";
				createjs.Tween.get(currentTarget).to({scaleX:1.4, scaleY:1.4, y:currentTarget.y-30, alpha:0}, 1000, createjs.Ease.linear);
			} else {
				currentTarget.name = "nomore";
				createjs.Tween.get(currentTarget).to({scaleX:1.4, scaleY:1.4, y:currentTarget.y-30, alpha:0}, 1000, createjs.Ease.linear);
			}
		}
		P2CollisionTargetJoueur.length = 0;
	}
};

var difficulte = function(timeElapsedInCSec) {
	var timeElapsedInSec = timeElapsedInCSec/100;
	if (timeElapsedInSec >= 140) {
		regles.difficulte = 7;
	} else if (timeElapsedInSec >= 120) {
		regles.difficulte = 6;
	} else if (timeElapsedInSec >= 100) {
		regles.difficulte = 5;
	} else if (timeElapsedInSec >= 80) {
		regles.difficulte = 4;
	} else if (timeElapsedInSec >= 60) {
		regles.difficulte = 3;
	} else if (timeElapsedInSec >= 40) {
		regles.difficulte = 2;
	} else if (timeElapsedInSec >= 20) {
		regles.difficulte = 1;
	}else {
		regles.difficulte = 0;
	}
};

var createTargets = function(timeElapsedInCSec) {
	var moduloToCreate = Math.round((timeElapsedInCSec/100)) % 4;
	if (moduloToCreate === 0 || moduloToCreate === 2) {
		if (!createdThisSec) {
			if ( regles.difficulte < 7 && moduloToCreate === 0) {
				var couleurNewTarget = possibleTargets.colors[Math.floor(Math.random()*2)];
				var newTarget = new createjs.Shape();
				newTarget.graphics.beginBitmapFill(images[couleurNewTarget]).drawRect(0, 0, 20, 20);
				newTarget.x = 2 + Math.round(Math.random()*176);
				newTarget.y = 2;
				newTarget.name = couleurNewTarget;
				p1Targets.addChild(newTarget);
				if (options.player === 2) {
					var newTargetClone = newTarget.clone();
					p2Targets.addChild(newTargetClone);
				}
				createdThisSec = true;
			} else if (regles.difficulte >= 7) {
				var couleurNewTarget = possibleTargets.colors[Math.floor(Math.random()*2)];
				var newTarget = new createjs.Shape();
				newTarget.graphics.beginBitmapFill(images[couleurNewTarget]).drawRect(0, 0, 20, 20);
				newTarget.x = 2 + Math.round(Math.random()*176);
				newTarget.y = 2;
				newTarget.name = couleurNewTarget;
				p1Targets.addChild(newTarget);
				if (options.player === 2) {
					var newTargetClone = newTarget.clone();
					p2Targets.addChild(newTargetClone);
				}
				createdThisSec = true;
			}
			
			if (options.player === 2) {
				if (Math.floor(Math.random()*10) === 0) {
					var newPower = new createjs.Shape();
					newPower.graphics.beginBitmapFill(images["questionMark"]).drawRect(0, 0, 20, 20);
					newPower.x = 2 + Math.round(Math.random()*176);
					newPower.y = 2;
					newPower.name = "power";
					p1Targets.addChild(newPower);
					var newPowerClone = newPower.clone();
					p2Targets.addChild(newPowerClone);
				}
				createdThisSec = true;
			}
		}
	} else {
		createdThisSec = false;
	}
};

var collision = function() {
	var nbTargets = p1Targets.getNumChildren();
	for (var i = 0; i < nbTargets; i++) {
		var currentTarget = p1Targets.getChildAt(i);
		
		var currentTargetGlobalX = currentTarget.x + p1Targets.x -1;
		var currentTargetGlobalY = currentTarget.y + p1Targets.y -1;
		
		if (currentTarget.name !== "nomore" && ((currentTargetGlobalX+20 >= player1Animation.x-18 && currentTargetGlobalX <= player1Animation.x+18) && (currentTargetGlobalY+20 >= player1Animation.y-24 && currentTargetGlobalY <= player1Animation.y+24))) {
			P1CollisionTargetJoueur.push(i);
			calcErrors = true;
			continue;
		}
		
		if (currentTarget.name !== "nomore" && currentTarget.y+20 >= 282) {
			P1CollisionTargetTerrain.push(i);
			calcErrors = true;
			continue;
		}
		
	}
	
	if (options.player === 2) {
		var nbTargetsP2 = p2Targets.getNumChildren();
		for (var i = 0; i < nbTargetsP2; i++) {
			var currentTarget = p2Targets.getChildAt(i);
			
			var currentTargetGlobalX = currentTarget.x + p2Targets.x -1;
			var currentTargetGlobalY = currentTarget.y + p2Targets.y -1;
			
			if (currentTarget.name !== "nomore" && ((currentTargetGlobalX+20 >= player2Animation.x-18 && currentTargetGlobalX <= player2Animation.x+18) && (currentTargetGlobalY+20 >= player2Animation.y-24 && currentTargetGlobalY <= player2Animation.y+24))) {
				P2CollisionTargetJoueur.push(i);
				calcErrors = true;
				continue;
			}
			
			if (currentTarget.name !== "nomore" && currentTarget.y+20 >= 282) {
				P2CollisionTargetTerrain.push(i);
				calcErrors = true;
				continue;
			}
			
		}
	}
	
};

var affichageHUD = function (timeElapsedInCSec) {
	p1ErreursText.text = player1.erreurs + " / " + regles.erreursMax;
	p1PowersText.text = player1.powers;
	if (options.player === 2) {
		p2PowersText.text = player2.powers;
		p2ErreursText.text = player2.erreurs + " / " + regles.erreursMax;
	}
	
	var cSec = timeElapsedInCSec % 100,
		sec = Math.floor(timeElapsedInCSec/100) % 60,
		min = Math.floor(timeElapsedInCSec/6000);
	if (cSec < 10) { cSec = "0" + cSec;}
	if (sec < 10) { sec = "0" + sec;}
	if (min < 10) { min = "0" + min;}
	timer.text = min + ":" + sec + "." + cSec;
	timerOutline.text = min + ":" + sec + "." + cSec;
};

var changementRegles = function () {
	var changP1 = new Array();
	var changP2 = new Array();
	
	for (i = 0; i < changementsAFaireP1.length; i++) {
		if (changP1.indexOf(changementsAFaireP1[i][1]) === -1) {
			changP1.push(changementsAFaireP1[i][1]);
		}
	}
	
	for (i = 0; i < changementsAFaireP2.length; i++) {
		if (changP2.indexOf(changementsAFaireP2[i][1]) === -1) {
			changP2.push(changementsAFaireP2[i][1]);
		}
	}
	
	// REGLE 1
	if (regles.difficulte >= 1) {
		if (Math.floor(Math.random()*regles.difficulte)+1 === 1) {
			if (changP1.indexOf(1) === -1 && changP2.indexOf(1) === -1) {
				changementsAFaire.push([1, 5]);
			} else if (changP1.indexOf(1) === -1) {
				changementsAFaireP1.push([1, 5]);
			} else if (changP2.indexOf(1) === -1) {
				changementsAFaireP2.push([1, 5]);
			}
		}
		// REGLE 2
		if (regles.difficulte >= 2) {
			if (Math.floor(Math.random()*(regles.difficulte-1))+1 === 1) {
				if (changP1.indexOf(2) === -1 && changP2.indexOf(2) === -1) {
					changementsAFaire.push([2, 5]);
				} else if (changP1.indexOf(2) === -1) {
					changementsAFaireP1.push([2, 5]);
				} else if (changP2.indexOf(2) === -1) {
					changementsAFaireP2.push([2, 5]);
				}
			}
			// REGLE 3
			if (regles.difficulte >= 3) {
				if (Math.floor(Math.random()*(regles.difficulte-2))+1 === 1) {
					if (changP1.indexOf(3) === -1 && changP2.indexOf(3) === -1) {
						changementsAFaire.push([3, 5]);
					} else if (changP1.indexOf(3) === -1) {
						changementsAFaireP1.push([3, 5]);
					} else if (changP2.indexOf(3) === -1) {
						changementsAFaireP2.push([3, 5]);
					}
				}
				// REGLE 4
				if (regles.difficulte >= 4) {
					p1Rule4.alpha = 1;
					if (options.player === 2) {
						p2Rule4.alpha = 1;
					}
					if (Math.floor(Math.random()*(regles.difficulte-3))+1 === 1) {
						if (changP1.indexOf(4) === -1 && changP2.indexOf(4) === -1) {
							changementsAFaire.push([4, 5]);
						} else if (changP1.indexOf(4) === -1) {
							changementsAFaireP1.push([4, 5]);
						} else if (changP2.indexOf(4) === -1) {
							changementsAFaireP2.push([4, 5]);
						}
					}
					// REGLE 5
					if (regles.difficulte >= 5) {
						p1Rule5.alpha = 1;
						if (options.player === 2) {
							p2Rule5.alpha = 1;
						}
						if (Math.floor(Math.random()*(regles.difficulte-4))+1 === 1) {
							if (changP1.indexOf(5) === -1 && changP2.indexOf(5) === -1) {
								changementsAFaire.push([5, 5]);
							} else if (changP1.indexOf(5) === -1) {
								changementsAFaireP1.push([5, 5]);
							} else if (changP2.indexOf(5) === -1) {
								changementsAFaireP2.push([5, 5]);
							}
						}
						// REGLE 6
						if (regles.difficulte >= 6 && options.player === 2) {
							p1Rule6.alpha = 1;
							p2Rule6.alpha = 1;
							if (Math.floor(Math.random()*(regles.difficulte-5))+1 === 1) {
								changementsAFaire.push([6, 5]);
							}
						}
					}
				}
			}
		}
		
	}
	
	nextChangeAt += 5+Math.round(Math.random()*10);
};

var appliquerChangements = function () {
	var changementsFaitsASuppr = [];
	for (var i = 0; i < changementsAFaire.length; i++) {
		changementsAFaire[i][1]--;
		if (changementsAFaire[i][1] === 0) {
			switch(changementsAFaire[i][0]) {
				case 1 :
					changementsFaitsASuppr.push(changementsAFaire[i]);
					
					p1TimerRule1.visible = false;
					
					var nombreRandom = Math.round(Math.random()*(possibleTargets.colors.length-1));
					var nouvelleCouleurP1 = possibleTargets.colors[nombreRandom];
					var	nouvelleCouleurP2 = nouvelleCouleurP1;
					
					if (nouvelleCouleurP1 === reglesP1.target[0]) {
						nouvelleCouleurP1 = possibleTargets.colors[(nombreRandom+1) % possibleTargets.colors.length];
						nouvelleCouleurP2 = nouvelleCouleurP1;
					}
					if (options.player === 2 && reglesP1.target[0] !== reglesP2.target[0]) {
						if (nouvelleCouleurP2 === reglesP2.target[0]) {
							nouvelleCouleurP2 = possibleTargets.colors[(nombreRandom+1) % possibleTargets.colors.length];
						}
					}
					
					// regles.target[0] = nouvelleCouleurP1;
					
					if (options.player === 2) {
						p2TimerRule1.visible = false;
						reglesP2.target[0] = nouvelleCouleurP2;
						
						if (nouvelleCouleurP2 === possibleTargets.colors[0]) {	
							p2Rule1.getChildAt(0).visible = true;
							p2Rule1.getChildAt(1).visible = false;
						} else if (nouvelleCouleurP2 === possibleTargets.colors[1]) {
							p2Rule1.getChildAt(1).visible = true;
							p2Rule1.getChildAt(0).visible = false;
						}
					}
					
					reglesP1.target[0] = nouvelleCouleurP1;
					if (nouvelleCouleurP1 === possibleTargets.colors[0]) {	
						p1Rule1.getChildAt(0).visible = true;
						p1Rule1.getChildAt(1).visible = false;
					} else if (nouvelleCouleurP1 === possibleTargets.colors[1]) {
						p1Rule1.getChildAt(1).visible = true;
						p1Rule1.getChildAt(0).visible = false;
					}
				break;
				
				case 2 :
					changementsFaitsASuppr.push(changementsAFaire[i]);
					
					p1TimerRule2.visible = false;
					
					if (reglesP1.take) {
						reglesP1.take = false;
					} else {
						reglesP1.take = true;
					}
					
					// reglesP1.take = regles.take;
					if (!reglesP1.take) {
						p1Rule2.getChildAt(0).visible = false;
						p1Rule2.getChildAt(2).visible = false;
						p1Rule2.getChildAt(1).visible = true;
						p1Rule2.getChildAt(3).visible = true;
					} else {
						p1Rule2.getChildAt(0).visible = true;
						p1Rule2.getChildAt(2).visible = true;
						p1Rule2.getChildAt(1).visible = false;
						p1Rule2.getChildAt(3).visible = false;
					}
					
					if (options.player === 2) {
						p2TimerRule2.visible = false;
						if (reglesP2.take) {
							reglesP2.take = false;
						} else {
							reglesP2.take = true;
						}
						// reglesP2.take = regles.take;
						if (!reglesP2.take) {
							p2Rule2.getChildAt(0).visible = false;
							p2Rule2.getChildAt(2).visible = false;
							p2Rule2.getChildAt(1).visible = true;
							p2Rule2.getChildAt(3).visible = true;
						} else {
							p2Rule2.getChildAt(0).visible = true;
							p2Rule2.getChildAt(2).visible = true;
							p2Rule2.getChildAt(1).visible = false;
							p2Rule2.getChildAt(3).visible = false;
						}
					}
				break;
				
				case 3 :
					changementsFaitsASuppr.push(changementsAFaire[i]);
					
					p1TimerRule3.visible = false;
					
					for (var i = 0; i < 6; i++) {
						var letterRd = Math.floor(Math.random()*26);
						while (regles.inputs.indexOf(lettresInputs[letterRd]) >= 0) {
							letterRd = Math.floor(Math.random()*26)
						}
						regles.inputs[i] = lettresInputs[letterRd];
					}
					for (var i = 0; i < 3; i++) {
						if (!regles.playerI) {
							reglesP1.inputs[i] = regles.inputs[i];
							if (options.player === 2) {
								reglesP2.inputs[i] = regles.inputs[i+3];
							}
						} else {
							reglesP1.inputs[i] = regles.inputs[i+3];
							if (options.player === 2) {
								reglesP2.inputs[i] = regles.inputs[i];
							}
						}
					}
					p1Rule3.getChildAt(1).text = "Left: " + reglesP1.inputs[0] + "\nRight: " + reglesP1.inputs[1] + "\nPower: " + reglesP1.inputs[2];
					if (options.player === 2) {
						p2TimerRule3.visible = false;
						p2Rule3.getChildAt(1).text = "Left: " + reglesP2.inputs[0] + "\nRight: " + reglesP2.inputs[1] + "\nPower: " + reglesP2.inputs[2];

					}
				break;
				
				case 4 :
					changementsFaitsASuppr.push(changementsAFaire[i]);
					
					p1TimerRule4.visible = false;
					
					if (reglesP1.inverse) {
						reglesP1.inverse = false;
					} else {
						reglesP1.inverse = true;
					};
					
					// reglesP1.inverse = regles.inverse;
					if (!reglesP1.inverse) {
						p1Rule4.getChildAt(1).visible = true;
						p1Rule4.getChildAt(2).visible = false;
						p1Rule4.getChildAt(3).visible = true;
					} else {
						p1Rule4.getChildAt(1).visible = false;
						p1Rule4.getChildAt(2).visible = true;
						p1Rule4.getChildAt(3).visible = false;
					}
					
					if (options.player === 2) {
						p2TimerRule4.visible = false;
						if (reglesP2.inverse) {
							reglesP2.inverse = false;
						} else {
							reglesP2.inverse = true;
						};
						// reglesP2.inverse = regles.inverse;
						if (!reglesP2.inverse) {
							p2Rule4.getChildAt(1).visible = true;
							p2Rule4.getChildAt(2).visible = false;
							p2Rule4.getChildAt(3).visible = true;
						} else {
							p2Rule4.getChildAt(1).visible = false;
							p2Rule4.getChildAt(2).visible = true;
							p2Rule4.getChildAt(3).visible = false;
						}
					}
				break;

				case 5 :
					changementsFaitsASuppr.push(changementsAFaire[i]);
					
					p1TimerRule5.visible = false;
					
					var pressesRd = Math.floor(Math.random()*2)+1;
					if (pressesRd === reglesP1.pushes) {
						pressesRd = (pressesRd%3)+1;
						if (options.player === 2 && pressesRd === reglesP2.pushes) {
							pressesRd = (pressesRd%3)+1;
						}
					}
					if (options.player === 2) {
						p2TimerRule5.visible = false;
						if (pressesRd === reglesP2.pushes) {
							pressesRd = (pressesRd%3)+1;
							if (pressesRd === reglesP1.pushes) {
								pressesRd = (pressesRd%3)+1;
							}
						}
						reglesP2.pushes = pressesRd;
						// reglesP2.pushes = regles.pushes;
						p2Rule5.getChildAt(1).text = "Presses necessary : " + reglesP2.pushes;
					}
					reglesP1.pushes = pressesRd;
					// reglesP1.pushes = regles.pushes;
					p1Rule5.getChildAt(1).text = "Presses necessary : " + reglesP1.pushes;	
				break;
				
				case 6 :
					changementsFaitsASuppr.push(changementsAFaire[i]);
					p1TimerRule6.visible = false;
					p2TimerRule6.visible = false;
					
					var playerPlayed;
					if (regles.playerI) {
						regles.playerI = false;
						playerPlayed = "yourself";
					} else {
						regles.playerI = true;
						playerPlayed = "your opponent";
					}
					p1Rule6.getChildAt(1).text = "You play:\n" + playerPlayed;
					p2Rule6.getChildAt(1).text = "You play:\n" + playerPlayed;
					
					for (var i =0; i < 3; i++) {
						regles.inputs[i] = reglesP2.inputs[i];
						regles.inputs[i+3] = reglesP1.inputs[i];
						reglesP2.inputs[i] = regles.inputs[i+3];
						reglesP1.inputs[i] = regles.inputs[i];
					}
					
					p1Rule3.getChildAt(1).text = "Left: " + reglesP1.inputs[0] + "\nRight: " + reglesP1.inputs[1] + "\nPower: " + reglesP1.inputs[2];
					p2Rule3.getChildAt(1).text = "Left: " + reglesP2.inputs[0] + "\nRight: " + reglesP2.inputs[1] + "\nPower: " + reglesP2.inputs[2];

				break;
			}
		} else {
			switch(changementsAFaire[i][0]) {
				case 1 :
					p1TimerRule1.text = changementsAFaire[i][1];
					p1TimerRule1.visible = true;
					if (options.player === 2) {
						p2TimerRule1.text = changementsAFaire[i][1];
						p2TimerRule1.visible = true;
					}
				break;
				
				case 2 :
					p1TimerRule2.text = changementsAFaire[i][1]
					p1TimerRule2.visible = true;
					if (options.player === 2) {
						p2TimerRule2.text = changementsAFaire[i][1]
						p2TimerRule2.visible = true;	
					}
				break;
				
				case 3 :
					p1TimerRule3.text = changementsAFaire[i][1]
					p1TimerRule3.visible = true;
					if (options.player === 2) {
						p2TimerRule3.text = changementsAFaire[i][1]
						p2TimerRule3.visible = true;
					}
				break;
				
				case 4 :
					p1TimerRule4.text = changementsAFaire[i][1]
					p1TimerRule4.visible = true;
					if (options.player === 2) {
						p2TimerRule4.text = changementsAFaire[i][1]
						p2TimerRule4.visible = true;
					}
				break;

				case 5 :
					p1TimerRule5.text = changementsAFaire[i][1]
					p1TimerRule5.visible = true;
					if (options.player === 2) {
						p2TimerRule5.text = changementsAFaire[i][1]
						p2TimerRule5.visible = true;
					}
				break;
				
				case 6 :
					p1TimerRule6.text = changementsAFaire[i][1]
					p1TimerRule6.visible = true;
					p2TimerRule6.text = changementsAFaire[i][1]
					p2TimerRule6.visible = true;
				break;
			}
		}
	}
	
	for (i = 0; i < changementsFaitsASuppr.length; i++) {
		var indexASuppr = changementsAFaire.indexOf(changementsFaitsASuppr[i]);
		changementsAFaire.splice(indexASuppr, 1);
	}
	changementsFaitsASuppr.length = 0;

	
	if (options.player === 2) {
		// CHANGEMENTS A FAIRE P1
		var changementsFaitsASupprP1 = [];
		for (var i = 0; i < changementsAFaireP1.length; i++) {
			changementsAFaireP1[i][1]--;
			if (changementsAFaireP1[i][1] === 0) {
				switch(changementsAFaireP1[i][0]) {
					case 1 :
						changementsFaitsASupprP1.push(changementsAFaireP1[i]);
						
						p1TimerRule1.visible = false;
						
						var nombreRandom = Math.round(Math.random()*(possibleTargets.colors.length-1));
						var nouvelleCouleur = possibleTargets.colors[nombreRandom];
						if (nouvelleCouleur === reglesP1.target[0]) {
							nouvelleCouleur = possibleTargets.colors[(nombreRandom+1) % possibleTargets.colors.length];
						}

						reglesP1.target[0] = nouvelleCouleur;
						
						if (nouvelleCouleur === possibleTargets.colors[0]) {	
							p1Rule1.getChildAt(0).visible = true;
							p1Rule1.getChildAt(1).visible = false;
						} else if (nouvelleCouleur === possibleTargets.colors[1]) {
							p1Rule1.getChildAt(1).visible = true;
							p1Rule1.getChildAt(0).visible = false;
						}
					break;
					
					case 2 :
						changementsFaitsASupprP1.push(changementsAFaireP1[i]);
						
						p1TimerRule2.visible = false;
						
						if (reglesP1.take) {
							reglesP1.take = false;
						} else {
							reglesP1.take = true;
						}
						
						if (!reglesP1.take) {
							p1Rule2.getChildAt(0).visible = false;
							p1Rule2.getChildAt(2).visible = false;
							p1Rule2.getChildAt(1).visible = true;
							p1Rule2.getChildAt(3).visible = true;
						} else {
							p1Rule2.getChildAt(0).visible = true;
							p1Rule2.getChildAt(2).visible = true;
							p1Rule2.getChildAt(1).visible = false;
							p1Rule2.getChildAt(3).visible = false;
						}
					break;
					
					case 3 :
						changementsFaitsASupprP1.push(changementsAFaireP1[i]);
						
						p1TimerRule3.visible = false;
						
						for (var i = 0; i < 3; i++) {
							var letterRd = Math.floor(Math.random()*26);
							while (regles.inputs.indexOf(lettresInputs[letterRd]) >= 0) {
								letterRd = Math.floor(Math.random()*26)
							}
							reglesP1.inputs[i] = lettresInputs[letterRd];
							regles.inputs[i] = lettresInputs[letterRd];
						}

						p1Rule3.getChildAt(1).text = "Left: " + reglesP1.inputs[0] + "\nRight: " + reglesP1.inputs[1] + "\nPower: " + reglesP1.inputs[2];
					break;
					
					case 4 :
						changementsFaitsASupprP1.push(changementsAFaireP1[i]);
						
						p1TimerRule4.visible = false;
						
						if (reglesP1.inverse) {
							reglesP1.inverse = false;
						} else {
							reglesP1.inverse = true;
						};
						
						if (!reglesP1.inverse) {
							p1Rule4.getChildAt(1).visible = true;
							p1Rule4.getChildAt(2).visible = false;
							p1Rule4.getChildAt(3).visible = true;
						} else {
							p1Rule4.getChildAt(1).visible = false;
							p1Rule4.getChildAt(2).visible = true;
							p1Rule4.getChildAt(3).visible = false;
						}
					break;

					case 5 :
						changementsFaitsASupprP1.push(changementsAFaireP1[i]);
						
						p1TimerRule5.visible = false;
						
						var pressesRd = Math.floor(Math.random()*2)+1;
						if (pressesRd !== reglesP1.pushes) {
							reglesP1.pushes = pressesRd;
						} else {
							reglesP1.pushes = (pressesRd%3)+1;
						}

						p1Rule5.getChildAt(1).text = "Presses\nnecessary:\n" + reglesP1.pushes;
					break;
				}
			} else {
				switch(changementsAFaireP1[i][0]) {
					case 1 :
						p1TimerRule1.text = changementsAFaireP1[i][1];
						p1TimerRule1.visible = true;
					break;
					
					case 2 :
						p1TimerRule2.text = changementsAFaireP1[i][1]
						p1TimerRule2.visible = true;
					break;
					
					case 3 :
						p1TimerRule3.text = changementsAFaireP1[i][1]
						p1TimerRule3.visible = true;
					break;
					
					case 4 :
						p1TimerRule4.text = changementsAFaireP1[i][1]
						p1TimerRule4.visible = true;
					break;

					case 5 :
						p1TimerRule5.text = changementsAFaireP1[i][1]
						p1TimerRule5.visible = true;
					break;
				}
			}
		}
		
		for (i = 0; i < changementsFaitsASupprP1.length; i++) {
			var indexASuppr = changementsAFaireP1.indexOf(changementsFaitsASupprP1[i]);
			changementsAFaireP1.splice(indexASuppr, 1);
		}
		changementsFaitsASupprP1.length = 0;
		
		// CHANGEMENTS A FAIRE P2
		var changementsFaitsASupprP2 = [];
		for (var i = 0; i < changementsAFaireP2.length; i++) {
			changementsAFaireP2[i][1]--;
			if (changementsAFaireP2[i][1] === 0) {
				switch(changementsAFaireP2[i][0]) {
					case 1 :
						changementsFaitsASupprP2.push(changementsAFaireP2[i]);
						
						p2TimerRule1.visible = false;
						
						var nombreRandom = Math.round(Math.random()*(possibleTargets.colors.length-1));
						var nouvelleCouleur = possibleTargets.colors[nombreRandom];
						if (nouvelleCouleur === reglesP2.target[0]) {
							nouvelleCouleur = possibleTargets.colors[(nombreRandom+1) % possibleTargets.colors.length];
						}

						reglesP2.target[0] = nouvelleCouleur;
						
						if (nouvelleCouleur === possibleTargets.colors[0]) {	
							p2Rule1.getChildAt(0).visible = true;
							p2Rule1.getChildAt(1).visible = false;
						} else if (nouvelleCouleur === possibleTargets.colors[1]) {
							p2Rule1.getChildAt(1).visible = true;
							p2Rule1.getChildAt(0).visible = false;
						}
					break;
					
					case 2 :
						changementsFaitsASupprP2.push(changementsAFaireP2[i]);
						
						p2TimerRule2.visible = false;
						
						if (reglesP2.take) {
							reglesP2.take = false;
						} else {
							reglesP2.take = true;
						}
						
						if (!reglesP2.take) {
							p2Rule2.getChildAt(0).visible = false;
							p2Rule2.getChildAt(2).visible = false;
							p2Rule2.getChildAt(1).visible = true;
							p2Rule2.getChildAt(3).visible = true;
						} else {
							p2Rule2.getChildAt(0).visible = true;
							p2Rule2.getChildAt(2).visible = true;
							p2Rule2.getChildAt(1).visible = false;
							p2Rule2.getChildAt(3).visible = false;
						}
					break;
					
					case 3 :
						changementsFaitsASupprP2.push(changementsAFaireP2[i]);
						
						p2TimerRule3.visible = false;
						
						for (var i = 0; i < 3; i++) {
							var letterRd = Math.round(Math.floor()*26);
							while (regles.inputs.indexOf(lettresInputs[letterRd]) >= 0) {
								letterRd = Math.round(Math.floor()*26)
							}
							reglesP2.inputs[i] = lettresInputs[letterRd];
							regles.inputs[i+3] = lettresInputs[letterRd];
						}

						p2Rule3.getChildAt(1).text = "Left: " + reglesP2.inputs[0] + "\nRight: " + reglesP2.inputs[1] + "\nPower: " + reglesP2.inputs[2];
					break;
					
					case 4 :
						changementsFaitsASupprP2.push(changementsAFaireP2[i]);
						
						p2TimerRule4.visible = false;
						
						if (reglesP2.inverse) {
							reglesP2.inverse = false;
						} else {
							reglesP2.inverse = true;
						};
						
						if (!reglesP2.inverse) {
							p2Rule4.getChildAt(1).visible = true;
							p2Rule4.getChildAt(2).visible = false;
							p2Rule4.getChildAt(3).visible = true;
						} else {
							p2Rule4.getChildAt(1).visible = false;
							p2Rule4.getChildAt(2).visible = true;
							p2Rule4.getChildAt(3).visible = false;
						}
					break;

					case 5 :
						changementsFaitsASupprP2.push(changementsAFaireP2[i]);
						
						p2TimerRule5.visible = false;
						
						var pressesRd = Math.floor(Math.random()*2)+1;
						if (pressesRd !== reglesP2.pushes) {
							reglesP2.pushes = pressesRd;
						} else {
							reglesP2.pushes = (pressesRd%3)+1;;
						}

						p2Rule5.getChildAt(1).text = "Presses\nnecessary:\n" + reglesP2.pushes;
					break;
				}
			} else {
				switch(changementsAFaireP2[i][0]) {
					case 1 :
						p2TimerRule1.text = changementsAFaireP2[i][1];
						p2TimerRule1.visible = true;
					break;
					
					case 2 :
						p2TimerRule2.text = changementsAFaireP2[i][1]
						p2TimerRule2.visible = true;
					break;
					
					case 3 :
						p2TimerRule3.text = changementsAFaireP2[i][1]
						p2TimerRule3.visible = true;
					break;
					
					case 4 :
						p2TimerRule4.text = changementsAFaireP2[i][1]
						p2TimerRule4.visible = true;
					break;

					case 5 :
						p2TimerRule5.text = changementsAFaireP2[i][1]
						p2TimerRule5.visible = true;
					break;
				}
			}
		}
		
		for (i = 0; i < changementsFaitsASupprP2.length; i++) {
			var indexASuppr = changementsAFaireP2.indexOf(changementsFaitsASupprP2[i]);
			changementsAFaireP2.splice(indexASuppr, 1);
		}
		changementsFaitsASupprP2.length = 0;
	}
};

var usePower = function () {
	if (player1.getChange) {
		var changeToAddP1 = [1, 2, 3, 4, 5];
		for (var i = 0; i < changementsAFaire.length; i++) {
			if (changeToAddP1.indexOf(changementsAFaire[i][0]) > -1) {
				changeToAddP1.splice(changeToAddP1.indexOf(changementsAFaire[i][0]), 1);
			}
		}
		for (var i = 0; i < changementsAFaireP1.length; i++) {
			if (changeToAddP1.indexOf(changementsAFaireP1[i][0]) > -1) {
				changeToAddP1.splice(changeToAddP1.indexOf(changementsAFaireP1[i][0]), 1);
			}
		}
		
		if (regles.difficulte === 0) {
			for (var i = 1; i < 5; i++) {
				if (changeToAddP1.indexOf(i+1) > -1) {
					changeToAddP1.splice(changeToAddP1.indexOf(i+1), 1);
				}
			}
		} else if (regles.difficulte < 5) {
			for (var i = regles.difficulte; i < 5; i++) {
				if (changeToAddP1.indexOf(i+1) > -1) {
					changeToAddP1.splice(changeToAddP1.indexOf(i+1), 1);
				}
			}
		}

		var powersRestants = player2.powers - changeToAddP1.length;
		if (powersRestants >= 0) {
			player2.powers = powersRestants;
		} else if (powersRestants < 0) {
			var changesToRemove = changeToAddP1.length - player2.powers;
			for (var i = changesToRemove; i > 0; i--) {
				var indexToRemove = Math.floor(Math.random()*changeToAddP1.length);
				changeToAddP1.splice(indexToRemove, 1);
			}
			player2.powers -= changeToAddP1.length;
		}
		
		for (var i = 0; i < changeToAddP1.length; i++) {
			changementsAFaireP1.push([changeToAddP1[i], 5]);
		}

		if (changementsAFaireP1.length > 0) {
			createjs.Sound.play("sonPower", {pan:-1});
		}
		
		player1.getChange = false;
	}
	
	if (player2.getChange) {
		var changeToAddP2 = [1, 2, 3, 4, 5];
		for (var i = 0; i < changementsAFaire.length; i++) {
			if (changeToAddP2.indexOf(changementsAFaire[i][0]) > -1) {
				changeToAddP2.splice(changeToAddP2.indexOf(changementsAFaire[i][0]), 1);
			}
		}
		for (var i = 0; i < changementsAFaireP2.length; i++) {
			if (changeToAddP2.indexOf(changementsAFaireP2[i][0]) > -1) {
				changeToAddP2.splice(changeToAddP2.indexOf(changementsAFaireP2[i][0]), 1);
			}
		}
		
		if (regles.difficulte === 0) {
			for (var i = 1; i < 5; i++) {
				if (changeToAddP2.indexOf(i+1) > -1) {
					changeToAddP2.splice(changeToAddP2.indexOf(i+1), 1);
				}
			}
		} else if (regles.difficulte < 5) {
			for (var i = regles.difficulte; i < 5; i++) {
				if (changeToAddP2.indexOf(i+1) > -1) {
					changeToAddP2.splice(changeToAddP2.indexOf(i+1), 1);
				}
			}
		}

		var powersRestants = player1.powers - changeToAddP2.length;
		if (powersRestants >= 0) {
			player1.powers = powersRestants;
		} else if (powersRestants < 0) {
			var changesToRemove = changeToAddP2.length - player1.powers;
			for (var i = changesToRemove; i > 0; i--) {
				var indexToRemove = Math.floor(Math.random()*changeToAddP2.length);
				changeToAddP2.splice(indexToRemove, 1);
			}
			player1.powers -= changeToAddP2.length;
		}
		
		for (var i = 0; i < changeToAddP2.length; i++) {
			changementsAFaireP2.push([changeToAddP2[i], 5]);
		}

		if (changementsAFaireP2.length > 0) {
			createjs.Sound.play("sonPower", {pan:1});
		}
		
		player2.getChange = false;
	}
};

var onKeyDown = function (event) {
	var key = String.fromCharCode(event.keyCode);
	switch (key) {
		case reglesP1.inputs[0] :
			P1InputsDone.unshift("left");
		break;
		
		case reglesP1.inputs[1] :
			P1InputsDone.unshift("right");
		break;
		
		case reglesP1.inputs[2] :
			P1InputsDone.unshift("power");
		break;
	}
	
	if (options.player === 2) {
		switch (key) {
			case reglesP2.inputs[0] :
				P2InputsDone.unshift("left");
			break;
			
			case reglesP2.inputs[1] :
				P2InputsDone.unshift("right");
			break;
			
			case reglesP2.inputs[2] :
				P2InputsDone.unshift("power");
			break;
		}
	}
};

var preGameLoop = function() {
	var indexDernierCAR = stage.getNumChildren();
	stage.removeChildAt(indexDernierCAR-1, indexDernierCAR-2, indexDernierCAR-3); //remove timerCAR3 2 1
	if (options.player === 2) {
		stage.removeChildAt(indexDernierCAR-4, indexDernierCAR-5, indexDernierCAR-6);
	}
	
	musiqueIG = createjs.Sound.play("musiqueIG", {loop:-1, volume:0.4});
	
	document.addEventListener("keydown", onKeyDown, false);

	timeBeginGL = createjs.Ticker.getTime();
	createjs.Ticker.addEventListener("tick", gameLoop);
	
	var boutonRetourHitArea = new createjs.Shape()
	boutonRetourHitArea.graphics.beginFill("white").drawRect(0, 0, 24, 32);;
	boutonRetour = new createjs.Bitmap(images["boutonRetour"]);
	boutonRetour.x = 20;
	boutonRetour.y = 4;
	boutonRetour.hitArea = boutonRetourHitArea;
	boutonRetour.addEventListener("click", function(){tweenToMenu("boutonRetour");});
	
	stage.addChild(boutonRetour);
};

var endGame = function() {
	player1Animation.gotoAndPlay("stand");
	document.removeEventListener("keydown", onKeyDown);
	createjs.Ticker.removeEventListener("tick", gameLoop);
	
	musiqueIG.stop();
	musiqueMenu.play({loop:-1, volume:0.4});
	
	var backToMenuText = new createjs.Text("Click to get back to the menu", "20px Bangers, Trebuchet MS", "#AC3232");
	backToMenuText.lineWidth = 150;
	backToMenuText.lineHeight = 30;
	backToMenuText.textAlign = "center";
	backToMenuText.textBaseline = "alphabetic";
	backToMenuText.x = player1XOffset + 290;
	backToMenuText.y = 320;
	createjs.Tween.get(backToMenuText, {loop:true}).wait(500).to({alpha:0}, 1000).to({alpha:1}, 1000);
	
	if (options.player === 1) {
		var gameOverText = new createjs.Text("GAME OVER", "50px Bangers, Trebuchet MS", "#AC3232");
		gameOverText.lineWidth = 150;
		gameOverText.textAlign = "center";
		gameOverText.textBaseline = "alphabetic";
		gameOverText.x = player1XOffset + 290;
		gameOverText.y = 220;
		createjs.Tween.get(gameOverText, {loop:true}).wait(500).to({alpha:0}, 1000).to({alpha:1}, 1000);
		stage.addChild(gameOverText);
	} else {
		player2Animation.gotoAndPlay("stand");
		
		var winText = new createjs.Text("WIN", "50px Bangers, Trebuchet MS", "#AC3232");
		winText.lineWidth = 150;
		winText.textAlign = "center";
		winText.textBaseline = "alphabetic";
		winText.y = 220;
		createjs.Tween.get(winText, {loop:true}).wait(500).to({alpha:0}, 1000).to({alpha:1}, 1000);
		
		var loseText = new createjs.Text("LOSE", "50px Bangers, Trebuchet MS", "#AC3232");
		loseText.lineWidth = 150;
		loseText.textAlign = "center";
		loseText.textBaseline = "alphabetic";
		loseText.y = 220;
		createjs.Tween.get(loseText, {loop:true}).wait(500).to({alpha:0}, 1000).to({alpha:1}, 1000);
		
		if (player1.erreurs >= regles.erreursMax && player2.erreurs < regles.erreursMax) {
			winText.x = player2XOffset + 290;
			loseText.x = player1XOffset + 290;
		} else if (player1.erreurs < regles.erreursMax && player2.erreurs >= regles.erreursMax) {
			winText.x = player1XOffset + 290;
			loseText.x = player2XOffset + 290;
		} else if (player1.erreurs >= regles.erreursMax && player2.erreurs >= regles.erreursMax) {
			winText.text = "LOSE";
			winText.x = player2XOffset + 290;
			loseText.x = player1XOffset + 290;
		}
		
		var backToMenuText2 = new createjs.Text("Click to get back to the menu", "20px Bangers, Trebuchet MS", "#AC3232"); //FE2EF7
		backToMenuText2.lineWidth = 150;
		backToMenuText2.lineHeight = 30;
		backToMenuText2.textAlign = "center";
		backToMenuText2.textBaseline = "alphabetic";
		backToMenuText2.x = player2XOffset + 290;
		backToMenuText2.y = 320;
		createjs.Tween.get(backToMenuText2, {loop:true}).wait(500).to({alpha:0}, 1000).to({alpha:1}, 1000);
	
		stage.addChild(winText, loseText, backToMenuText2);
	}
	
	stage.addChild(backToMenuText);
	
	stage.addEventListener("click", tweenToMenu);
	
};

var retour = function() {

};

var tweenToMenu = function(args) {
	if (args === "boutonRetour") {
		boutonRetour.removeAllEventListeners();
	
		player1Animation.gotoAndPlay("stand");
		document.removeEventListener("keydown", onKeyDown);
		createjs.Ticker.removeEventListener("tick", gameLoop);
	
		musiqueIG.stop();
		musiqueMenu.play({loop:-1, volume:0.4});
	} else {
		stage.removeEventListener("click", tweenToMenu);
	}
	
	stage.removeAllChildren();
	stage.addChild(barreTitre);
	
	stage.addChild(menu);
	
	createjs.Tween.get(star, {loop:true, override:true})
											.to({rotation:0, scaleX:1, scaleY:1}, 0)	
											.to({rotation:180, scaleX:2, scaleY:2}, 2000)
											.to({rotation:360, scaleX:1, scaleY:1}, 2000)
											.to({rotation:540, scaleX:0.5, scaleY:0.5}, 2000)
											.to({rotation:720, scaleX:1, scaleY:1}, 2000);
	createjs.Tween.get(fondMenu).to({alpha:1}, 1000, createjs.Ease.cubicOut);
	createjs.Tween.get(fondMenuTrans).to({alpha:0.4}, 1000, createjs.Ease.cubicOut);
	createjs.Tween.get(choisirPlayer).to({x:-5}, 1000, createjs.Ease.cubicOut);
	createjs.Tween.get(choisirNbErreurs).wait(500).to({x:400}, 1000, createjs.Ease.cubicOut);
	createjs.Tween.get(startButton).wait(1000).to({y:385}, 1000, createjs.Ease.cubicOut);
	panneau1.x = -286;
	createjs.Tween.get(panneau1).wait(2000).to({x:30}, 400, createjs.Ease.linear).to({skewX:0}, 800, createjs.Ease.getElasticOut(2,0.5));
	
	choisirPlayer1.addEventListener("click", handleClickMenu);
	choisirPlayer2.addEventListener("click", handleClickMenu);
	choisirNbErreurs1.addEventListener("click", handleClickMenu);
	choisirNbErreurs2.addEventListener("click", handleClickMenu);
	choisirNbErreurs3.addEventListener("click", handleClickMenu);
	startButton.addEventListener("click", tweenMenu);
};

var gameLoop = function(event) {
	var timeCurrent = createjs.Ticker.getTime();
	var timeElapsedInCSec = Math.round((timeCurrent - timeBeginGL) / 10);
	
	rulePresses();
	
	action();
	
	deplacements();
	
	collision();
	
	if (calcErrors) {
		checkErrors();
	}
	
	if (regles.finDuJeu) {
		endGame();
	};
	affichageHUD(timeElapsedInCSec);
	
	if (regles.difficulte !== 7) {
		difficulte(timeElapsedInCSec);
	}
	createTargets(timeElapsedInCSec);
	
	if (Math.floor(timeElapsedInCSec/100) === nextChangeAt) {
		changementRegles();
	}
	
	if (player1.getChange || player2.getChange) {
		usePower();
	}
	
	if (Math.floor(timeElapsedInCSec/100) === prochaineSec) {
		appliquerChangements();
		prochaineSec++;
	}
	
};

createjs.Ticker.setFPS(60);
createjs.Ticker.timingMode = createjs.Ticker.TIMEOUT;
createjs.Ticker.addEventListener("tick", stage);

document.head.onload = init();

})();