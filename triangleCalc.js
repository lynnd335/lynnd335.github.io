
var lock = false;
var t;

var priority = new Array(null, null, null);

function init(){
	t = document.triangle;
	t.topAngle.focus();
	setAngleUnits();
}

function setAngleUnits(){
	var unit = t.angleunits[t.angleunits.selectedIndex].text;
	setText('leftAngleUnits', unit);
	setText('rightAngleUnits', unit);
	setText('topAngleUnits', unit);
	useDegrees = (t.angleunits.selectedIndex == 0);
}

function blurAll(){
	t.topAngle.blur();
	t.leftSide.blur();
	t.rightSide.blur();
	t.leftAngle.blur();
	t.bottomSide.blur();
	t.rightAngle.blur();	
}

var alertedSFUpgrade = false;

function compute() {
	var mask = 0;
	var ta = 0;
	var taSF = new SignificantFigures('0');
	var taSigFigs = taSF.sigFigs;
	var taSigDecs = taSF.sigDecs;
	var la = 0;
	var laSF = new SignificantFigures('0');
	var laSigFigs = laSF.sigFigs;
	var laSigDecs = laSF.sigDecs;
	var ra = 0;
	var raSF = new SignificantFigures('0');
	var raSigFigs = raSF.sigFigs;
	var raSigDecs = raSF.sigDecs;
	var ls = 0;
	var lsSF = new SignificantFigures('0');
	var lsSigFigs = lsSF.sigFigs;
	var lsSigDecs = lsSF.sigDecs;
	var rs = 0;
	var rsSF = new SignificantFigures('0');
	var rsSigFigs = rsSF.sigFigs;
	var rsSigDecs = rsSF.sigDecs;
	var bs = 0;
	var bsSF = new SignificantFigures('0');
	var bsSigFigs = bsSF.sigFigs;
	var bsSigDecs = bsSF.sigDecs;
	
	if (lock) return false;
	lock = true;
		
	t.computeButton.focus();
	
	if (!checkPriority(false)){
		lock = false;
		return false;
	}
	
	var upgradeSF = false;
		
	if (t.topAngle.value != '' && isPriority(t.topAngle)){
		ta = parseFloat(t.topAngle.value);
		if (!check(ta, t.topAngle)) return dieError("");
		if (!checkAngle(ta, t.topAngle)) return dieError("");
		if (isPriority(t.topAngle)) mask |= 0x01;
		taSF = new SignificantFigures(t.topAngle.value);
		if (taSF.sigFigs == 1){
			upgradeSF = true;
			taSigFigs = 2;
			taSigDecs = Math.min(0,taSF.sigDecs);
		} else {
			taSigFigs = taSF.sigFigs;
			taSigDecs = taSF.sigDecs;
		}
	}
	if (t.leftAngle.value != '' && isPriority(t.leftAngle)){
		la = parseFloat(t.leftAngle.value);
		if (!check(la, t.leftAngle)) return dieError("");
		if (!checkAngle(la, t.leftAngle)) return dieError("");
		if (isPriority(t.leftAngle)) mask |= 0x02;
		laSF = new SignificantFigures(t.leftAngle.value);
		if (laSF.sigFigs == 1){
			upgradeSF = true;
			laSigFigs = 2;
			laSigDecs = Math.min(0,laSF.sigDecs);
		} else {
			laSigFigs = laSF.sigFigs;
			laSigDecs = laSF.sigDecs;
		}
	}
	if (t.rightAngle.value != '' && isPriority(t.rightAngle)){
		ra = parseFloat(t.rightAngle.value);
		if (!check(ra, t.rightAngle)) return dieError("");
		if (!checkAngle(ra, t.rightAngle)) return dieError("");
		if (isPriority(t.rightAngle)) mask |= 0x04;
		raSF = new SignificantFigures(t.rightAngle.value);
		if (raSF.sigFigs == 1){
			upgradeSF = true;
			raSigFigs = 2;
			raSigDecs = Math.min(0,raSF.sigDecs);
		} else {
			raSigFigs = raSF.sigFigs;
			raSigDecs = raSF.sigDecs;
		}
	}
	if (t.leftSide.value != '' && isPriority(t.leftSide)){
		ls = parseFloat(t.leftSide.value);
		if (!check(ls, t.leftSide)) return dieError("");
		if (isPriority(t.leftSide)) mask |= 0x08;
		lsSF = new SignificantFigures(t.leftSide.value);
		if (lsSF.sigFigs == 1){
			upgradeSF = true;
			lsSigFigs = 2;
		} else {
			lsSigFigs = lsSF.sigFigs;
		}
		lsSigDecs = lsSF.sigDecs;
	}
	if (t.rightSide.value != '' && isPriority(t.rightSide)){
		rs = parseFloat(t.rightSide.value);
		if (!check(rs, t.rightSide)) return dieError("");
		if (isPriority(t.rightSide)) mask |= 0x10;
		rsSF = new SignificantFigures(t.rightSide.value);
		if (rsSF.sigFigs == 1){
			upgradeSF = true;
			rsSigFigs = 2;
		} else {
			rsSigFigs = rsSF.sigFigs;
		}
		rsSigDecs = rsSF.sigDecs;
	}
	if (t.bottomSide.value != '' && isPriority(t.bottomSide)){
		bs = parseFloat(t.bottomSide.value);
		if (!check(bs, t.bottomSide)) return dieError("");
		if (isPriority(t.bottomSide)) mask |= 0x20;
		bsSF = new SignificantFigures(t.bottomSide.value);
		if (bsSF.sigFigs == 1){
			upgradeSF = true;
			bsSigFigs = 2;
		} else {
			bsSigFigs = bsSF.sigFigs;
		}
		bsSigDecs = bsSF.sigDecs;
	}
	if (upgradeSF && !alertedSFUpgrade){
		alertedSFUpgrade=true;
		alert("Some of the values entered only had one\nsignificant figure.  Since one significant figure\ncalculations are not meaningful, all calculations\nwill be performed with two significant figures.");
	}
	if (mask == 0x7){
		if (useDegrees){
			if (ta + la + ra != 180) return dieError("The angles of a triangle must add up to be 180 degrees.");
		} else {
			if (ta + la + ra != Math.PI) return dieError("The angles of a triangle must add up to be pi radians.");
		}
		return dieError("At least one side must be specified.\nThere are an infinite number of proportianal triangles with the these angles.");
	}
	switch (mask){	
		case 0x19:{
			// SAS
			bs = sasGetSide3(ls,ta,rs);
			ra = sssGetAngle2(ls,rs,bs);			
			la = aaGetAngle3(ta,ra);
			bsSigFigs = min3(lsSigFigs,taSigFigs,rsSigFigs);
			bsSigDecs = -99;
			raSigFigs = min3(lsSigFigs,rsSigFigs,bsSigFigs);
			raSigDecs = -99;
			laSigFigs = 100;
			laSigDecs = Math.max(taSigDecs,raSigDecs);			
		} break;
		case 0x2A:{
			// SAS
			rs = sasGetSide3(ls,la,bs);
			ta = sssGetAngle2(bs,ls,rs);
			ra = aaGetAngle3(la,ta);
			rsSigFigs = min3(lsSigFigs,laSigFigs,bsSigFigs);
			rsSigDecs = -99;
			taSigFigs = min3(bsSigFigs,lsSigFigs,rsSigFigs);
			taSigDecs = -99;
			raSigFigs = 100;
			raSigDecs = Math.max(laSigDecs,taSigDecs);
		} break;
		case 0x34:{
			// SAS
			ls = sasGetSide3(bs,ra,rs);
			la = sssGetAngle2(rs,bs,ls);
			ta = aaGetAngle3(ra,la);
			lsSigFigs = min3(bsSigFigs,raSigFigs,rsSigFigs);
			lsSigDecs = -99;
			laSigFigs = min3(rsSigFigs,bsSigFigs,lsSigFigs);
			laSigDecs = -99;
			taSigFigs = 100;
			taSigDecs = Math.max(raSigDecs,laSigDecs);
		} break;
		case 0x38:{
			// SSS
			if (rs+bs<=ls || ls+rs<=bs || bs+ls<=rs) return dieError('The values entered cannot make a triangle.  The sum of the length of every two sides must exceed the length of the third side.');
			la = sssGetAngle2(rs,bs,ls);		
			ra = sssGetAngle2(ls,rs,bs);		
			ta = sssGetAngle2(bs,ls,rs);
			laSigFigs = min3(rsSigFigs,bsSigFigs,lsSigFigs);
			laSigDecs = -99;
			raSigFigs = min3(lsSigFigs,rsSigFigs,bsSigFigs);
			raSigDecs = -99;
			taSigFigs = min3(bsSigFigs,lsSigFigs,rsSigFigs);
			taSigDecs = -99;
		} break;
		case 0x15:{
			// ASA
			if (!checkAngles(ra, ta, t.rightAngle, t.topAngle)) return dieError("");
			la = aaGetAngle3(ra,ta);
			ls = aasGetSide2(ra,rs,la);
			bs = aasGetSide2(ta,rs,la);
			laSigFigs = 100;
			laSigDecs = Math.max(raSigDecs,taSigDecs);
			lsSigFigs = min3(raSigFigs,rsSigFigs,laSigFigs);
			lsSigDecs = -99;			
			bsSigFigs = min3(taSigFigs,rsSigFigs,laSigFigs);
			bsSigDecs = -99;
		} break;
		case 0x0b:{
			// ASA
			if (!checkAngles(ta, la, t.topAngle, t.leftAngle)) return dieError("");
			ra = aaGetAngle3(ta,la);
			bs = aasGetSide2(ta,ls,ra);
			rs = aasGetSide2(la,ls,ra);
			raSigFigs = 100;
			raSigDecs = Math.max(taSigDecs,laSigDecs);
			bsSigFigs = min3(taSigFigs,lsSigFigs,raSigFigs);
			bsSigDecs = -99;			
			rsSigFigs = min3(laSigFigs,lsSigFigs,raSigFigs);
			rsSigDecs = -99;
		} break;
		case 0x26:{
			// ASA
			if (!checkAngles(la, ra, t.leftAngle, t.rightAngle)) return dieError("");
			ta = aaGetAngle3(la,ra);
			rs = aasGetSide2(la,bs,ta);
			ls = aasGetSide2(ra,bs,ta);
			taSigFigs = 100;
			taSigDecs = Math.max(laSigDecs,raSigDecs);
			rsSigFigs = min3(laSigFigs,bsSigFigs,taSigFigs);
			rsSigDecs = -99;			
			lsSigFigs = min3(raSigFigs,bsSigFigs,taSigFigs);
			lsSigDecs = -99;
		} break;
		case 0x25:{
			// AAS
			if (!checkAngles(ra, ta, t.rightAngle, t.topAngle)) return dieError("");
			la = aaGetAngle3(ra,ta);
			rs = aasGetSide2(la,bs,ta);
			ls = aasGetSide2(ra,bs,ta);
			laSigFigs = 100;
			laSigDecs = Math.max(raSigDecs,taSigDecs);
			rsSigFigs = min3(laSigFigs,bsSigFigs,taSigFigs);
			rsSigDecs = -99;			
			lsSigFigs = min3(raSigFigs,bsSigFigs,taSigFigs);
			lsSigDecs = -99;
		} break;
		case 0x0d:{
			// AAS
			if (!checkAngles(ra, ta, t.rightAngle, t.topAngle)) return dieError("");
			la = aaGetAngle3(ra,ta);
			bs = aasGetSide2(ta,ls,ra);
			rs = aasGetSide2(la,ls,ra);
			laSigFigs = 100;
			laSigDecs = Math.max(raSigDecs,taSigDecs);
			bsSigFigs = min3(taSigFigs,lsSigFigs,raSigFigs);
			bsSigDecs = -99;			
			rsSigFigs = min3(laSigFigs,lsSigFigs,raSigFigs);
			rsSigDecs = -99;
		} break;
		case 0x13:{
			// AAS
			if (!checkAngles(ta, la, t.topAngle, t.leftAngle)) return dieError("");
			ra = aaGetAngle3(ta,la);
			ls = aasGetSide2(ra,rs,la);
			bs = aasGetSide2(ta,rs,la);
			raSigFigs = 100;
			raSigDecs = Math.max(taSigDecs,laSigDecs);
			lsSigFigs = min3(raSigFigs,rsSigFigs,laSigFigs);
			lsSigDecs = -99;			
			bsSigFigs = min3(taSigFigs,rsSigFigs,laSigFigs);
			bsSigDecs = -99;
		} break;
		case 0x23:{
			// AAS
			if (!checkAngles(ta, la, t.topAngle, t.leftAngle)) return dieError("");
			ra = aaGetAngle3(ta,la);
			rs = aasGetSide2(la,bs,ta);
			ls = aasGetSide2(ra,bs,ta);
			raSigFigs = 100;
			raSigDecs = Math.max(taSigDecs,laSigDecs);
			rsSigFigs = min3(laSigFigs,bsSigFigs,taSigFigs);
			rsSigDecs = -99;			
			lsSigFigs = min3(raSigFigs,bsSigFigs,taSigFigs);
			lsSigDecs = -99;
		} break;
		case 0x0e:{
			// AAS
			if (!checkAngles(la, ra, t.leftAngle, t.rightAngle)) return dieError("");
			ta = aaGetAngle3(la,ra);
			bs = aasGetSide2(ta,ls,ra);
			rs = aasGetSide2(la,ls,ra);
			taSigFigs = 100;
			taSigDecs = Math.max(laSigDecs,raSigDecs);
			bsSigFigs = min3(taSigFigs,lsSigFigs,raSigFigs);
			bsSigDecs = -99;			
			rsSigFigs = min3(laSigFigs,lsSigFigs,raSigFigs);
			rsSigDecs = -99;
		} break;
		case 0x16:{
			// AAS
			if (!checkAngles(la, ra, t.leftAngle, t.rightAngle)) return dieError("");
			ta = aaGetAngle3(la,ra);
			ls = aasGetSide2(ra,rs,la);
			bs = aasGetSide2(ta,rs,la);
			taSigFigs = 100;
			taSigDecs = Math.max(laSigDecs,raSigDecs);
			lsSigFigs = min3(raSigFigs,rsSigFigs,laSigFigs);
			lsSigDecs = -99;			
			bsSigFigs = min3(taSigFigs,rsSigFigs,laSigFigs);
			bsSigDecs = -99;
		} break;
		case 0x1c:{
			// SSA
			if (!checkSSA(ls,rs,ra)) return;
			la = ssaGetAngle2(ls,rs,ra);
			ta = aaGetAngle3(la,ra);
			bs = sasGetSide3(ls,ta,rs);
			laSigFigs = min3(lsSigFigs,rsSigFigs,raSigFigs);
			laSigDecs = -99;
			taSigFigs = 100;
			taSigDecs = Math.max(laSigDecs,raSigDecs);
			bsSigFigs = min3(lsSigFigs,taSigFigs,rsSigFigs);
			bsSigDecs = -99;
		} break;		
		case 0x1a:{
			// SSA
			if (!checkSSA(rs,ls,la)) return;
			ra = ssaGetAngle2(rs,ls,la);
			ta = aaGetAngle3(ra,la);
			bs = sasGetSide3(rs,ta,ls);
			raSigFigs = min3(rsSigFigs,lsSigFigs,laSigFigs);
			raSigDecs = -99;
			taSigFigs = 100;
			taSigDecs = Math.max(raSigDecs,laSigDecs);
			bsSigFigs = min3(rsSigFigs,taSigFigs,lsSigFigs);
			bsSigDecs = -99;
		} break;
		case 0x29:{
			// SSA
			if (!checkSSA(bs,ls,ta)) return;
			ra = ssaGetAngle2(bs,ls,ta);
			la = aaGetAngle3(ra,ta);
			rs = sasGetSide3(bs,la,ls);
			raSigFigs = min3(bsSigFigs,lsSigFigs,taSigFigs);
			raSigDecs = -99;
			laSigFigs = 100;
			laSigDecs = Math.max(raSigDecs,taSigDecs);
			rsSigFigs = min3(bsSigFigs,laSigFigs,lsSigFigs);
			rsSigDecs = -99;
		} break;		
		case 0x2c:{
			// SSA
			if (!checkSSA(ls,bs,ra)) return;
			ta = ssaGetAngle2(ls,bs,ra);
			la = aaGetAngle3(ta,ra);
			rs = sasGetSide3(ls,la,bs);
			taSigFigs = min3(lsSigFigs,bsSigFigs,raSigFigs);
			taSigDecs = -99;
			laSigFigs = 100;
			laSigDecs = Math.max(taSigDecs,raSigDecs);
			rsSigFigs = min3(lsSigFigs,laSigFigs,bsSigFigs);
			rsSigDecs = -99;
		} break;
		case 0x32:{
			// SSA
			if (!checkSSA(rs,bs,la)) return;
			ta = ssaGetAngle2(rs,bs,la);
			ra = aaGetAngle3(ta,la);
			ls = sasGetSide3(rs,ra,bs);
			taSigFigs = min3(rsSigFigs,bsSigFigs,laSigFigs);
			taSigDecs = -99;
			raSigFigs = 100;
			raSigDecs = Math.max(taSigDecs,laSigDecs);
			lsSigFigs = min3(rsSigFigs,raSigFigs,bsSigFigs);
			lsSigDecs = -99;
		} break;		
		case 0x31:{
			// SSA
			if (!checkSSA(bs,rs,ta)) return;
			la = ssaGetAngle2(bs,rs,ta);
			ra = aaGetAngle3(la,ta);
			ls = sasGetSide3(bs,ra,rs);
			laSigFigs = min3(bsSigFigs,rsSigFigs,taSigFigs);
			laSigDecs = -99;
			raSigFigs = 100;
			raSigDecs = Math.max(laSigDecs,taSigDecs);
			lsSigFigs = min3(bsSigFigs,raSigFigs,rsSigFigs);
			lsSigDecs = -99;
		} break;
	}
	var area=sasGetArea(ls,la,bs);
	var areaSigFigs=min3(lsSigFigs,laSigFigs,bsSigFigs);
	setText('area',(area>0)?displaySigFigs(area, areaSigFigs, -99, false):"");
	setInfo("");
	t.topAngle.value=(ta > 0)?(displaySigFigs(ta, taSigFigs, taSigDecs, false)):'';
	t.leftSide.value=(ls > 0)?(displaySigFigs(ls, lsSigFigs, lsSigDecs, false)):'';
	t.rightSide.value=(rs > 0)?(displaySigFigs(rs, rsSigFigs, rsSigDecs, false)):'';
	t.leftAngle.value=(la > 0)?(displaySigFigs(la, laSigFigs, laSigDecs, false)):'';
	t.bottomSide.value=(bs > 0)?(displaySigFigs(bs, bsSigFigs, bsSigDecs, false)):'';
	t.rightAngle.value=(ra > 0)?(displaySigFigs(ra, raSigFigs, raSigDecs, false)):'';
	
	setTimeout("lock=false;blurAll();", 100);

	return true;
}

function min2(num1, num2){
	var min = num1;
	if (num2 < min) min = num2;
	return min;
}

function min3(num1, num2, num3){
	var min = num1;
	if (num2 < min) min = num2;
	if (num3 < min) min = num3;
	return min;
}

var useDegrees = true;

function deg2Rad(angle){
	return angle * Math.PI / 180;
}

function rad2Deg(angle){
	return angle * 180 / Math.PI;
}
function sasGetArea(side1, angle1, side2){
	if (useDegrees) angle1 = deg2Rad(angle1);
	return side1 * side2 * Math.sin(angle1) / 2;
}
function sasGetSide3(side1, angle1, side2){
	if (useDegrees) angle1 = deg2Rad(angle1);
	return Math.sqrt(side1 * side1 + side2 * side2 - 2 * side1 * side2 * Math.cos(angle1));
}
function sssGetAngle2(side1, side2, side3){
	var angle = Math.acos((side2 * side2 + side3 * side3 - side1 * side1)/(2 * side2 * side3));
	if (useDegrees) return rad2Deg(angle);
	else return angle;
}
function aaGetAngle3(angle1, angle2){
	if (useDegrees) return 180 - angle1 - angle2;
	else return Math.PI  - angle1 - angle2;
}
function aasGetSide2(angle1, side1, angle2){
	if (useDegrees) angle1 = deg2Rad(angle1);
	if (useDegrees) angle2 = deg2Rad(angle2);
	return side1 * (Math.sin(angle1)) / (Math.sin(angle2));
}
function ssaGetAngle2(side1, side2, angle1){
	if (useDegrees) angle1 = deg2Rad(angle1);
	var angle = Math.asin(side2 * Math.sin(angle1) / side1);
	if (useDegrees) return rad2Deg(angle);
	else return angle;
}
function checkSSA(side1, side2, angle1){
	if (useDegrees) angle1 = deg2Rad(angle1);
	alert(side1 + " " + side2 + " " + angle1);
	if (angle1 < Math.PI/2){
		if (side1<side2*Math.sin(angle1)){
			setInfo("Side with value "+side1+" is not long enough to form a triangle.");
			return false;
		}
	} else if (angle1 > Math.PI/2){
		alert("big angle");
		if (side1<=side2){
			setInfo("Side with value "+side1+" is not long enough to form a triangle.");
		  return false;
		}
	}
	return true;
}

function checkAngles(angle1, angle2, field1, field2){
	if (useDegrees){
		if (angle1 + angle2 >= 180){
			setInfo(field1.value + ' and ' + field2.value + ' are too large to be an angles in a triangle.');
			return false;
		}
	} else {
		if (angle1 + angle2 >= Math.PI){
			setInfo(field1.value + ' and ' + field2.value + ' are too large to be an angles in a triangle.');
			return false;
		}
	}
	return true;
}

function checkAngle(floatVal, field){
	if (useDegrees){
		if (floatVal >= 180){
			if (field != null){
				setInfo(field.value + ' is too large to be an angle in a triangle.');
			}
			return false;
		}
	} else {
		if (floatVal >= Math.PI){
			if (field != null){
				setInfo(field.value + ' is too large to be an angle in a triangle.');
			}
			return false;
		}
	}
	return true;
}

function check(floatVal, field){
	if (floatVal + '' == 'NaN'){
		setInfo(field.value + ' does not appear to be a number.');
		return false;
	}
	if (floatVal <= 0){
		setInfo('Values must be greater than zero.');
		return false;
	}
	return true;
}

function dieError(message){
	if (message != '') setInfo(message);
	clearComputed();
	setTimeout("lock=false;", 100);
	return false;
}

function clearComputed(){
	if (!isPriority(t.topAngle)){
		t.topAngle.value='';
		if (t.topAngle.style){
			t.topAngle.style.backgroundColor='white';
		}
	}
	if (!isPriority(t.leftSide)){
		t.leftSide.value='';
		if (t.leftSide.style){
			t.leftSide.style.backgroundColor='white';
		}
	}
	if (!isPriority(t.rightSide)){
		t.rightSide.value='';
		if (t.rightSide.style){
			t.rightSide.style.backgroundColor='white';
		}
	}
	if (!isPriority(t.leftAngle)){
		t.leftAngle.value='';
		if (t.leftAngle.style){
			t.leftAngle.style.backgroundColor='white';
		}
	}
	if (!isPriority(t.bottomSide)){
		t.bottomSide.value='';
		if (t.bottomSide.style){
			t.bottomSide.style.backgroundColor='white';
		}
	}
	if (!isPriority(t.rightAngle)){
		t.rightAngle.value='';
		if (t.rightAngle.style){
			t.rightAngle.style.backgroundColor='white';
		}
	}
}

function clearAll(){
	t.topAngle.value='';
	if (t.topAngle.style){
		t.topAngle.style.backgroundColor='white';
	}
	t.leftSide.value='';
	if (t.leftSide.style){
		t.leftSide.style.backgroundColor='white';
	}
	t.rightSide.value='';
	if (t.rightSide.style){
		t.rightSide.style.backgroundColor='white';
	}
	t.leftAngle.value='';
	if (t.leftAngle.style){
		t.leftAngle.style.backgroundColor='white';
	}
	t.bottomSide.value='';
	if (t.bottomSide.style){
		t.bottomSide.style.backgroundColor='white';
	}
	t.rightAngle.value='';
	if (t.rightAngle.style){
		t.rightAngle.style.backgroundColor='white';
	}
	clearPriority();
	compute();
	t.topAngle.focus();
}

var okToCompute = true;
function checkPriority(computeIt){
	if (priority[0] == null){
		setInfo("Please enter and select three values.");
		okToCompute = true;
		return false;
	} else if (priority[1] == null){	
		setInfo("Please enter and select two more values.");
		okToCompute = true;
		return false;
	} else if (priority[2] == null){
		setInfo("Please enter and select one more value.");
		setTimeout("okToCompute=true;", 100);
		return false;
	}
	setInfo("");
	if (computeIt && okToCompute){
		okToCompute = false;
		compute();
	}
	return true;	
}

function setInfo(s){
	setText('info',s);
}

function setText(n,s){
	document.getElementById(n).textContent=s;
}

function isPriority(input){
	for (var i=0; i < priority.length; i++){
		if (priority[i] == input) return true;
	}
	return false;
}

function clearPriority(input){
	var found = false;
	var i;
	for (i=0; i < priority.length && !found; i++){
		if (priority[i] == input){
			found = true;
		} 
	}
	if (found){
		for (; i < priority.length; i++){
			priority[i-1] = priority[i];
		}
		priority[i-1] = null;
	}	
	checkPriority(true);
}

function setPriority(input){
	var i;
	var foundSpot = false;
	for (i=0; i < priority.length && !foundSpot; i++){
		if (priority[i] == null){
			priority[i] = input;
			foundSpot = true;
		}
		if (priority[i] == input){
			foundSpot = true;
		}
	}
	if (!foundSpot){
		if (priority[priority.length-1].style){
			priority[priority.length-1].style.backgroundColor='white';
		}
		priority[priority.length-1] = input;
	}
	var last = input;
	var temp;
	for (i=0; i+1 < priority.length && priority[i] != input; i++){
		temp = priority[i];
		priority[i] = last;
		last = temp;
	}
	priority[i] = last;
	checkPriority(true);
}

function colorSide(input){
	if (lock) return;
	var color = 'white';
	var makePriority = false;
	if (input.value != ''){
		var side = parseFloat(input.value);
		if (side + '' == 'NaN' || side <= 0){
			color = '#FFCCCC';
		} else {
			color = '#CCFFCC';
			makePriority = true;
		}
	}
	if (makePriority){
		setPriority(input);
	} else {
		clearPriority(input);
	}
	if (input.style){
		input.style.backgroundColor=color;
	}	
}

function colorAngle(input){
	if (lock) return;
	var color = 'white';
	var makePriority = false;
	if (input.value != ''){
		var angle = parseFloat(input.value);
		if (angle + '' == 'NaN' || !checkAngle(angle, null)){
			color = '#FFCCCC';
		} else {
			color = '#CCFFCC';
			makePriority = true;
		}
	}
	if (makePriority){
		setPriority(input);
	} else {
		clearPriority(input);
	}
	if (input.style){
		input.style.backgroundColor=color;
	}	
}
