//-----------------------------------------------------------------------------
//ToggleELI5 - show/hide ELI5 summary
function ToggleELI5(eli5) {
	var span = eli5.getElementsByTagName('span')[0];
	var div  = eli5.getElementsByTagName('div')[0];
	if(div.style.display == 'none') {  //is hidden
		//show
		span.innerHTML = "&#9650 ELI5 Summary";  //&#9650 = 0x25B2 = up arrow
		div.style.display = '';
	} else {
		//hide
		span.innerHTML = "&#9660 ELI5 Summary";  //&#9660 = 0x25BC = down arrow
		div.style.display = 'none';
	}
} //ToggleELI5


//-----------------------------------------------------------------------------
//InitModals - initialize modal dialog boxes (add close functionality)
function InitModals() {
	var aModal = document.getElementsByClassName('modal');
	if(!aModal)  return;  //none found

	//all close button
	[].forEach.call(aModal, function(dlg) {
		var close = dlg.getElementsByTagName('button')[0];  //first child button is Close
		close.onclick = function() { dlg.style.display = 'none'; }
	});

	//close on ESC
	document.addEventListener('keyup', function(ev) {
		if(ev.code == 'Escape') {  //ESC closes all modal boxes
			var aModal = document.getElementsByClassName('modal');
			[].forEach.call(aModal, function(dlg) { dlg.style.display = 'none'; });
		}
	});

	//close if clicked outside box
	document.addEventListener('click', function(ev) {
		if(ev.target.classList.contains('modal'))  //if clicked on modal background (i.e. outside box)
			ev.target.style.display = 'none';  //close
	});
} //InitModals


//-----------------------------------------------------------------------------
//window.onload - initialize everything
window.addEventListener("load", function() {
//	console.log(GetBrowserInfo());
//	InitClock();  //display current time in a different time-zone
//	ReplaceEmails("info", "ELI40");
	InitModals();
});
