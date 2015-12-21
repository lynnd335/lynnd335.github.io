"use strict"
jQuery(function() {
	console.log("Loaded");
	//Straight down is 375 px
	//Width is 900px
	var time = $('#block .pTimer')
	var americaScoreTag = $('#block .p1');
	var sovietScoreTag = $('#block .p2');
	var victoryScreen = $('#endScreenWin');
	var lossScreen = $('#endScreenLoss');
	var hitSound = document.createElement('audio');
    hitSound.setAttribute('src', '../audio/18624.mp3');
    hitSound.setAttribute('autoplay', 'autoplay');
	time.hide();
	americaScoreTag.hide();
	sovietScoreTag.hide();
	victoryScreen.hide();
	lossScreen.hide();
	var checkAmericaWin = function() {
		if (sovietScore === 0) {
			victoryScreen.show();
			americaScoreTag.hide();
			sovietScoreTag.hide();
			clearTimeout(loadUpInterval);
			$('missile').remove();
			return 'win';

		} else {
			return 'keepPlaying';
		}
	};
	var checkSovietWin = function() {
		if (americaScore === 0) {
			lossScreen.show();
			americaScoreTag.hide();
			sovietScoreTag.hide();
			clearTimeout(loadUpInterval);
			$('missile').remove();
			return 'loss';
		} else {
			return 'keepPlaying';
		}
	};
	var sovietScore;
	var americaScore;
	var bg = $("#block");
	var speedUp = 0;
	var changeSpeed = function() {
		var roll1 = Math.floor(Math.random() * (5 - 1 + 1) + 1);
		var roll2 = Math.floor(Math.random() * (5 - 1 + 1) + 1);
		if (roll1 === roll2) {
			speedUp = roll1;
		} else {
			speedUp = 0;
		}
		return speedUp;
	}
	var startGame = function() {
			americaScore = 300;
			sovietScore = 600;
		}
		//
	var increaseAmericaScore = function() {
		americaScore = americaScore + 10;
		console.log("America Score: " + americaScore);
		americaScoreTag.text("FREEDOM Score: " + americaScore);
	}
	var decreaseAmericaScore = function() {
		americaScore = americaScore - 10;
		console.log("America Score: " + americaScore);
		americaScoreTag.text("FREEDOM Score: " + americaScore);
	}
	var decreaseSovietScore = function() {
			sovietScore = sovietScore - 10;
			console.log("COMMIES Score: " + sovietScore);
			sovietScoreTag.text("COMMIES Score: " + sovietScore);
		}
		//
	var loadUp = function() {
			var missile = $('<div class="missile"></div>');

			var bgFlash = function() {
				setInterval(function() {
					bg.toggleClass('hit');
				}, 250);
			};
			var aSide;
			var bSide;
			var cSide;
			var speed = 12000 - changeSpeed();
			missile.appendTo(bg);
			var launchPoint = ((Math.random() * bg.width()));
			missile.css("left", launchPoint);
			var angle = Math.floor(Math.random() * (45 - 1 + 1) + 1);
			missile.css("transform", "rotate(" + angle + "deg)");
			var vector = function(ang, lp) {
					ang = ang - 180;
					aSide = 400;
					var x = function(ang) {
						return ang * Math.PI / 180;
					};
					cSide = 400 / Math.cos(x(ang));
					cSide = Math.abs(cSide);
					bSide = (aSide * aSide) - (cSide * cSide);
					bSide = Math.abs(bSide);
					bSide = Math.sqrt(bSide);
					return bSide + 300;
				}
				//
				//
			missile.animate({
				'left': +vector(angle, launchPoint) + 'px',
				'top': '+300px'
			}, speed);
			//launch missile end
			setTimeout(function() {
				//americaScoreTag.text("FREEDOM Score: " + americaScore);
				missile.toggleClass('hitsploded');
				setTimeout(function() {
					bgFlash();
					$(this).toggleClass('hitsploded');
					$(this).toggleClass('hitsploded2');
					setTimeout(function() {
						console.log("Bang!");
						missile.remove();
					}.bind($(this)), 10);
				}.bind($(this)), 250)
				decreaseAmericaScore();
				checkSovietWin();
				console.log("Soviet Score: " + sovietScore);
			}, 11000);
			var burnTimer1 = setInterval(function() {
				missile.toggleClass('missile2');
				missile.css("transform", "rotate(-" + 7 + "deg)");
			}, 250)
			var burnTimer2 = setInterval(function() {
					missile.css("transform", "rotate(" + 7 + "deg)");
					missile.toggleClass('missile3');
				}, 250)
				// missile impact end
				// click missile begin   
			missile.click(function() {
				hitSound.play();
				decreaseSovietScore();
				increaseAmericaScore();
				checkAmericaWin();
				var missileUp = $("<div class='missileUp'></div>");
				$('block').append(missileUp);
				missileUp.animate({
					'margin-top': '100px'
				}, 1000);
				missileUp.remove();
				clearTimeout(burnTimer1);
				clearTimeout(burnTimer2);
				$(this).toggleClass('sploded');
				setTimeout(function() {
					$(this).toggleClass('sploded');
					$(this).toggleClass('sploded2');
					setTimeout(function() {
						console.log("removing", $(this));
						$(this).remove();
					}.bind($(this)), 10);
				}.bind($(this)), 250)

			});
		}
		//

	//
	var loadUpInterval;
	var loadScreen = $('#loadScreen');
	bg.append(loadScreen);
	victoryScreen.hide();
	lossScreen.hide();
	loadScreen.click(function() {
		loadScreen.remove();
		americaScoreTag.show();
		sovietScoreTag.show();
		startGame();
		loadUpInterval = setInterval(loadUp, 1000);
	});
	victoryScreen.click(function(){
			window.reload();
		})
	lossScreen.click(function(){
			window.reload();
		})

	// }
});