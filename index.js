// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_file_name index.min.js
// ==/ClosureCompiler==

//-----------------------------------------------------------------------------
//UpdateCaesar - encrypt message using Rot-N Caesar Cipher
function UpdateCaesar() {
	//update key (rotated alphabet) for current rotN
	var ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var rotN = (26 + Number(document.getElementById("caesarRotN").value)) % 26;
	document.getElementById("caesarRotN").value = rotN;  //update in case out-of-bounds (left/right arrows)
	document.getElementById("caesarKey").innerHTML = ABC.substr(rotN, 26-rotN) + ABC.substr(0, rotN);

	//encrypt caesarOut;
	var caesarIn = document.getElementById("caesarIn").value;
	var caesarOut = "";
	for(var i = 0;  i < caesarIn.length;  i++) {
		var c = caesarIn.charCodeAt(i);
		if      (c >= 65  &&  c <=  90)  caesarOut += String.fromCharCode((((c-65) + rotN) % 26)+65);  //uppercase
		else if (c >= 97  &&  c <= 122)  caesarOut += String.fromCharCode((((c-97) + rotN) % 26)+97);  //lowercase
		else  caesarOut += caesarIn.charAt(i);  //not a letter
	}
	document.getElementById("caesarOut").value = caesarOut;
	if(~caesarOut.indexOf("Alice"))  CP('Shift');  //completed level 6
} //UpdateCaesar


//-----------------------------------------------------------------------------
//Beer - drink a beer
var g_beer = 0;  //number of beers consumed
function Beer() {
	var aTxt = [
		"",
		"Thanks! But beer ain't like a dead man, one per box.",
		"Men, start your livers!",
		"I'm so drunk, I cain't hit the floor with my hat.",
		"That's four. You keep count 'cause I'm 'bout out of fingers.",
		"Best slow down else I might could shift my words some.",
		"Ufcwy'm mywlyn cm W4xsGR0BenrivjDmHFOPI9aP3MJJAbM4",
	];

	g_beer = (g_beer + 1) % 7;
	if(g_beer == 6)  CP('Beer');  //completed level 5
	var cletus = document.getElementById("cletus");
	cletus.textContent = aTxt[g_beer];
	cletus.style.display = (g_beer == 0) ? "none" : "inline";
	cletus.scrollIntoView();
	document.getElementById("beer").src = "Beer"+ g_beer +".jpg";
//x	console.log("Beer = "+ g_beer);
} //Beer


//-----------------------------------------------------------------------------
//SpyHole - creepy eye looking through hole
var g_spyTimer;  //ms until next state change
var g_spyState = 0;  //current state:  hole, look, eye, hide
var g_aSpyImg = [];
function SpyHole() {
	if(g_aSpyImg.length == 0) {
		//pre-load images
		var aSrc = [
			"spy0Hole.gif",  //empty hole
			"spy1Look.gif",  //animated eye approaching hole
			"spy2Eye.gif",   //eye at hole
			"spy3Hide.gif",  //animated eye leaving hole
			"spy4NSA.jpg",   //hole covered by NSA logo
		];
		aSrc.forEach(function(imgSrc) {
			var img = new Image();
			img.src = imgSrc;
			g_aSpyImg.push(img);
		});
	} //if preload

	if(g_spyState == 4)  return;  //covered by NSA logo
	g_spyState = (g_spyState + 1) % 4;  //advance to next state
	document.getElementById("spyHole").src = g_aSpyImg[g_spyState].src;
//x	console.log(g_spyState);

	var aMax = [29000, 0, 2000, 0];  //max delay (hole = 30 sec, eye = 3 sec)
	var ms = Math.round(Math.random() * aMax[g_spyState]) + 500;  //min delay = 0.5 second
	g_spyTimer = setTimeout(SpyHole, ms);
//x	console.log("SpyHole %d = %s for %f sec", g_spyState, aSrc[g_spyState], ms/1000);
} //SpyHole

//-----------------------------------------------------------------------------
//SpyPoke - #spyHole.onclick - make the eye hide
function SpyPoke() {
	if(g_spyState < 1  ||  g_spyState > 2)  return;  //only poke if eye is at hole
//x	console.log("Poke");
	clearTimeout(g_spyTimer);  //stop current state
	g_spyState = 2;  //make sure eye is at hole
	SpyHole();  //make eye leave hole
} //SpyPoke

//-----------------------------------------------------------------------------
//SpyPeek - #spyHole.onmouseover - summon the eye
function SpyPeek() {
	if(g_spyState != 0)  return;  //only summon if hole is empty
//x	console.log("Peek");
	clearTimeout(g_spyTimer);  //stop current state
	g_spyState = 0;  //make sure eye is hidden
	SpyHole();  //summon the eye
} //SpyPeek


//-----------------------------------------------------------------------------
//DoEyeDrop - process img dropped on #spyhole
function DoEyeDrop(event) {
	event.preventDefault();  //default behavior is NOT droppable
	var txt = event.dataTransfer.getData("text").substr(-7, 3);
	if(txt != "NSA")
		return;  //proceed only if dropped img == NSA

	//stop looking at me
	clearTimeout(g_spyTimer);  //stop current state
	g_spyState = 4;
	var img = document.getElementById("spyHole");
	img.src = "spy4NSA.jpg";
	img.title = "Ahh, I can't see!";
	if(CP()) { //only change caption if puzzle started
		document.getElementById("spyCap").textContent = Tea.decrypt("YAeBBP9JbZHQJSsgNsSe5bRSA5rxE3+rc13zJqJKh9FJ0Msr77kh51+k7mnk4aaI", txt);
		CP('NSA');  //completed level 8
	}
} //DoEyeDrop


//-----------------------------------------------------------------------------
//Encryption game - Copyright 2015 Gary Strawn
//There are four levels, on each level the user drags and drops encryption keys.
//Above and below each key are associated <input> elements.
//All drop-zones (empty keys), preset-keys and text inputs have class "io".
//
//Encryption types: APrv, APub, BPrv, BPub
//Stored in <alt> attribute of encryption keys (i.e. <img>)
// None = no encryption
// APrv = Alice's private key
// APub = Alice's public key
// BPrv = Bob's private key
// BPub = Bob's public key

//g_aInputs - array of <input> index for each .io element
//Ex:  On level 4, Bob's top <input> is io[10] and receives
//     it's input from g_aInputs[4][10].
var g_aInputs = [
	//Alice      Internet,   Bob
	[0,0,1,                  2,3,4],  //level 1
	[0,0,1,      4,5,2,5,6,  5,8,9],  //level 2
	[0,0,1,      3,3,2,7,7,  5,8,9],  //level 3
	[0,0,1,2,3,  6,7,4,7,8,  7,10,11,12,13],  //level 4
	[0,0,1,2,3,  6,7,4,7,8,  7,10,11,12,13],  //level 5
];
var g_numLevels = 5;  //set by InitGame


//-----------------------------------------------------------------------------
//EncDec - Encrypt/decrypt specified text
//Since Tea (Tiny Encryption Algorithm) is symmetrical (same password for encrypt/decrypt)
//  an encryption type character (i.e. {}[]) is appended to encrypted text to indicate password
//  Ex: EncDec(<plain text>, 'APrv')         => <encrypted text> + '{'
//      EncDec(<encrypted text>+'{', 'APub') => <plain text>
//Note: To avoid encryption conflicts {}[] aren't Base64 characters: [A-Z][a-z][0-9][=+/-_.:~!*]
function EncDec(txt, key) {
	//if currKey and prevKey are complements, then decrypt using prevKey
	//  ex: APub <=> APrv,  BPub <=> BPrv
	var currKey = {'APrv':'{', 'APub':'}', 'BPrv':'[', 'BPub':']'}[key];  //convert key to encryption character
	var prevKey = txt.slice(-1);  //get last character
	var iCurr = '}{]['.indexOf(currKey);
	var iPrev = '{}[]'.indexOf(prevKey);
	if(iCurr == iPrev  &&  iCurr != -1) {  //if complements (and valid)
		//decrypt
		var pswd = {'{':'APrv', '}':'APub', '[':'BPrv', ']':'BPub'}[prevKey];  //convert key to password
		try {
			return Tea.decrypt(txt.slice(0, -1), pswd);  //remove last character then decrypt
		} catch(e) {}  //fallthrough if decryption failed (string wasn't encrypted by TEA; i.e. user modified it)
	}
	//encrypt
	return Tea.encrypt(txt, key) + currKey;  //encrypt then append key character
} //EncDec


//StrHash("C4dyMX0HktxobpJsNLUVO9gV3SPPGhS4") = 257923834
function StrHash(s) {return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);}


//-----------------------------------------------------------------------------
//UpdateLevel - an "io" element changed;  update all down-stream elements
function UpdateLevel(elem) {
	//find current level
	var level;
	for(var levelNum = 1;  levelNum <= g_numLevels;  levelNum++) {
		level = document.getElementById("Level"+ levelNum);
		if(level.contains(elem))
			break;
	}
	console.assert(levelNum <= g_numLevels, "Could not find parent level for %o", elem);
	var aInputs = g_aInputs[levelNum-1];

	//find element that changed
	var aIONodes = level.querySelectorAll(".io");  //all io nodes on this level
	console.assert(aIONodes.length == aInputs.length, "aIONodes does not match g_aInputs");
	for(var iElem = 0; iElem < aIONodes.length; iElem++)
		if(aIONodes[iElem] == elem)
			break;
	console.assert(iElem < aIONodes.length, "Could not find changed element %o", elem);

	//update all down-stream elements
	var aStack = [iElem];  //stack of elements that have changed
	while(aStack.length > 0) {
		var iCurr = aStack.pop();  //index of element that changed
		var currElem = aIONodes[iCurr];  //element that changed

		//update down-stream <input> (but not iElem which the user just modified)
		if(currElem.tagName == "INPUT"  &&   iCurr != iElem) {
			var parent = aIONodes[aInputs[iCurr]];
			if(parent.tagName == "INPUT") {
				//parent is also an <input>, simply copy parent's text
				if(levelNum == 1  &&  iCurr == 3  &&  StrHash(aIONodes[0].value) == 257923834) {
					//hack for Cicada puzzle
					//decrypt("C4dyMX0HktxobpJsNLUVO9gV3SPPGhS4", "APrv") = Is the NSA spying on us?
					currElem.value = Tea.decrypt(aIONodes[0].value, "APrv");
					CP('Alice');  //completed level 7
				} else {
					if(levelNum == 3  &&  iCurr == 5) {
						//hack for Level 3 to let Chuck insert a fake message
						switch(aIONodes[1].alt) {
							case "None":  //fallthrough
							case "APub":  parent = aIONodes[3];  break;
							case "BPub":  parent = aIONodes[7];  break;
						} //switch
					} //if
					currElem.value = parent.value;
				}
			} else { //parent !<input> (i.e. parent is a key <img>)
				//parent is a key and a key's parent (grandparent) is always an <input> so
				//  encrypt the grandparent's text (srcText) using the parent's key (encKey)
				var iSrc = aInputs[aInputs[iCurr]];  //index of source text (i.e. grandparent)
				var srcTxt = aIONodes[iSrc].value;  //source text
				var encKey = parent.alt;  //encryption key (ex: APub, APrv, BPub)
				currElem.value = (encKey == "None")  ?  srcTxt  :  EncDec(srcTxt, encKey);
			} //else !<input>
		} //if <input>

		//add dependents (i.e. elements that get their input from this element)
		//Note:  start at i=1, because level's first <input> has no parent input
		for(var i = 1;  i < aInputs.length;  i++)
			if(aInputs[i] == iCurr)
				aStack.push(i);
	} //while

	//update status
	var feedback = level.querySelector(".feedback");
	feedback.innerHTML = "Something unexpected has happened.";  //default;  if error, enable next level
	switch(levelNum) {
	case 1:
		switch(aIONodes[4].alt) {
			case "None":  feedback.innerHTML = "Which key should Bob use?";  break;
			case "APrv":  feedback.innerHTML = "Only Alice should use Alice's private key.";  break;
			case "BPub":  feedback.innerHTML = "Hint:&nbsp; Bob should try using Alice's public key.";  break;
			case "APub":
				if(aIONodes[aIONodes.length-1].value == aIONodes[0].value)
					feedback.innerHTML = "SUCCESS!&nbsp; Bob has received Alice's secret message.";
				else
					feedback.innerHTML = "Bob can't decrypt the message.";
				break;
		}
		break;

	case 2:
		switch(aIONodes[1].alt) {
			case "None":  feedback.innerHTML = "Which key should Alice use?";  break;
			case "APub":  feedback.innerHTML = "Bob can't decrypt the message.";  break;
			case "APrv":  feedback.innerHTML = "Eve has intercepted the message.";  break;
			case "BPub":
				if(aIONodes[aIONodes.length-1].value == aIONodes[0].value)
					feedback.innerHTML = "SUCCESS!&nbsp; Alice's message was kept confidential.";
				else
					feedback.innerHTML = "Bob can't decrypt the message.";
				break;
		}
		break;

	case 3:
		switch(aIONodes[1].alt) {
			case "None":  feedback.innerHTML = "Which key should Alice use to sign her message?";  break;
			case "APub":  feedback.innerHTML = "Chuck used Alice's public key to send a fake message.";  break;
			case "BPub":  feedback.innerHTML = "Bob suspects the message is not from Alice.";  break;
			case "APrv":
				switch(aIONodes[9].alt) {
					case "None":  feedback.innerHTML = "The message is from Alice but what does it say?";  break;
					case "BPub":  feedback.innerHTML = "The message was not encrypted with Bob's private key.";  break;
					case "APrv":  feedback.innerHTML = "Only Alice should use Alice's private key.";  break;
					case "APub":  
						if(aIONodes[aIONodes.length-1].value == aIONodes[0].value)
							feedback.innerHTML = "SUCCESS!&nbsp; Bob knows the message came from Alice.";
						else
							feedback.innerHTML = "Bob can't decrypt the message.";
						break;
				}
				break;
		}
		break;

	case 4:
		if(aIONodes[7].value == aIONodes[0].value)
			feedback.innerHTML = "Don't let the Internet see Alice's message.";
		else if(aIONodes[5].value == aIONodes[0].value
			 || aIONodes[9].value == aIONodes[0].value)
			feedback.innerHTML = "Someone on the Internet has decrypted Alice's message.";
		else if(aIONodes[13].alt == "APrv")
			feedback.innerHTML = "Only Alice should use Alice's private key.";
		else if(aIONodes[13].alt != "APub")
			feedback.innerHTML = "Bob isn't sure if Alice's message is real.";
		else if(aIONodes[14].value != aIONodes[0].value)
			if(aIONodes[1].alt == "BPub"  &&  aIONodes[3].alt == "APrv"  &&  aIONodes[13].alt == "APub")
				feedback.innerHTML = "Order is important, try switching Alice's keys.";
			else
				feedback.innerHTML = "Bob can't decrypt Alice's message.";
		else
			feedback.innerHTML = "SUCCESS!&nbsp; The message is confidential and authentic.";
		break;

	case 5:
		if( aIONodes[5].value == aIONodes[0].value
		 || aIONodes[7].value == aIONodes[0].value
		 || aIONodes[9].value == aIONodes[0].value)
			feedback.innerHTML = "SUCCESS!&nbsp; You understand the strengths and weaknesses of cryptography.";
		else if(aIONodes[6].alt != "None"  &&  aIONodes[7].alt != "None")
			feedback.innerHTML = "Is there some other way to COPY the original message?";
		else
			feedback.innerHTML = "Appearing secure is not the same as being secure.";
		break;
	} //switch
	if(iElem == aIONodes.length-1  &&  aIONodes[aIONodes.length-1].value == aIONodes[0].value)
		feedback.innerHTML = "Sometimes even the best security can be thwarted.";
	if(feedback.innerHTML[0] == 'S')  //success (or "Something unexpected..." or "Sometimes...")
		level.querySelector("button[type=submit]").style.display = "inline-block";
} //UpdateLevel


//-----------------------------------------------------------------------------
//DoDragStart - user started dragging a key
function DoDragStart(event) {
//x	console.log("DoDragStart(%o)", event.target);
	event.dataTransfer.setData("Encrypt_keyID", event.target.alt);  //store id being dragged
	event.dataTransfer.effectAllowed = "copy";  //use copy-cursor instead of move-cursor
	if(event.target.classList.contains("drop")) {  //if removing from a drop zone
		//reset back to None
		event.target.setAttribute("alt", "None");
		event.target.setAttribute("src", "None.gif");
		UpdateLevel(event.target);
	}
} //DoDragStart


//-----------------------------------------------------------------------------
//DoDropDisable - cursor is hovering over a drop zone
function DoDropDisable(event) {
	event.preventDefault();  //default behavior is droppable
	event.dataTransfer.dropEffect = "none";  //show copy-cursor instead of move-cursor
	return false;
} //DoDropDisable


//-----------------------------------------------------------------------------
//DoDragOver - cursor is hovering over a drop zone
function DoDragOver(event) {
//x	console.log("DoDragOver(%o)", event.target);
	event.preventDefault();  //default behavior is NOT droppable
	event.dataTransfer.dropEffect = "copy";  //show copy-cursor instead of move-cursor
	event.currentTarget.style.border = "2px dashed black";
	return false;
} //DoDragOver


//-----------------------------------------------------------------------------
//DoDragLeave - cursor exited a drop zone
function DoDragLeave(event) {
//x	console.log("DoDragLeave(%o)", event.target);
	event.currentTarget.style.border = "none";
	return false;
} //DoDragLeave


//-----------------------------------------------------------------------------
//DoDrop - process key dropped event
function DoDrop(event) {  //event = drop zone  (i.event. "key drop")
//x	console.log("DoDrop(%o)", event.target);
	event.preventDefault();  //default behavior is NOT droppable
	event.currentTarget.style.border = "none";

	var keyType = event.dataTransfer.getData("Encrypt_keyID");
	if(keyType) {  //only accept Encrypt_keyID
		event.target.setAttribute("alt", keyType);
		event.target.setAttribute("src", keyType +".gif");
		UpdateLevel(event.target);
	}
} //DoDrop


//-----------------------------------------------------------------------------
//ShowLevel - make level/tab visible
function ShowLevel(i) {
	//deactivate old level
	var oldTab = document.querySelector("#KeyGame ul.tabs li.tab_active");
	if(oldTab)  oldTab.removeAttribute("class");  //remove class="tab_active"
	document.getElementById(oldTab.getAttribute("data-tab_id")).style.display = "none";

	//activate new level
	var newTab = document.querySelector("#KeyGame ul.tabs li:nth-child("+i+")");
	newTab.setAttribute("class", "tab_active");  //add class="tab_active"
	document.getElementById(newTab.getAttribute("data-tab_id")).style.display = "inline-block";
} //ShowLevel


//-----------------------------------------------------------------------------
//ResetLevel - game init or user pressed Reset button
function ResetLevel(i) {
	//empty all keys on this level
	var level = document.getElementById("Level"+i);
	var drops = level.querySelectorAll(".drop");
	[].forEach.call(drops, function(drop) {
		drop.setAttribute("alt", "None");
		drop.setAttribute("src", "None.gif");
	});
	level.querySelector("button[type=submit]").style.display = "none";  //hide the "Next Level" button
	UpdateLevel(level.querySelector("input"));  //update level's first <input> and all its dependents
} //ResetLevel


//-----------------------------------------------------------------------------
//ResetAll - reset all levels, show Level1
function ResetAll(id) {
	for(var levelNum = 0; levelNum < g_numLevels; levelNum++)
		ResetLevel(levelNum+1);
	ShowLevel(1)
} //ResetAll


//-----------------------------------------------------------------------------
//initialize game board
function InitKeyGame() {
	g_numLevels = document.querySelectorAll("#KeyGame section.tab").length;

	//initialize all <section.tab> elements
	var tabs = document.querySelectorAll("#KeyGame ul.tabs li");
	console.assert(tabs.length == g_numLevels, "number of tabs != number of levels");
	for(var iTab = 0; iTab < tabs.length; iTab++)
		tabs[iTab].onclick = function(i) { return function() { ShowLevel(i+1); }}(iTab);

	//initialize all <input> elements
	var inputs = document.querySelectorAll("#KeyGame input");
	[].forEach.call(inputs, function(input) {
		input.addEventListener("input", function(e) { UpdateLevel(e.target); });
		input.addEventListener("dragover", DoDropDisable);
		input.addEventListener("drop", DoDropDisable);
	});

	//initialize draggable elements
	var drags = document.querySelectorAll("#KeyGame .drag");
	[].forEach.call(drags, function(drag) {
		drag.addEventListener("dragstart", DoDragStart);
		//drag.setAttribute("draggable", "true");  //unnecessary;  <img> draggable = default
	});

	//initialized drop-zone elements
	var drops = document.querySelectorAll("#KeyGame .drop");
	[].forEach.call(drops, function(drop) {
		drop.addEventListener("dragstart", DoDragStart);
		drop.addEventListener("dragover", DoDragOver);
		drop.addEventListener("dragleave", DoDragLeave);
		drop.addEventListener("drop", DoDrop);
	});

	ResetAll();

	//initialize spying eye
	var spyHole = document.getElementById("spyHole");
	spyHole.addEventListener("drop", DoEyeDrop);
	spyHole.addEventListener("dragover", function(event) { event.preventDefault(); });  //default behavior is NOT droppable
	SpyHole();  //start randomly peeking eye through spy hole
} //InitKeyGame

window.addEventListener("load", InitKeyGame);
