function externallinks() {
	if (!document.getElementsByTagName) return;
	var anchors = document.getElementsByTagName("a");
	for (var i=0; i<anchors.length; i++) {
		var anchor = anchors[i];
		if (anchor.getAttribute("href") && anchor.getAttribute("rel") == "external")anchor.target = "_blank";
	}
}
window.onload = externallinks;
function attache(element,evenement,action){
	if (element.addEventListener)element.addEventListener(evenement,action,false);
	else if (element.attachEvent)element.attachEvent('on'+evenement,action);
}