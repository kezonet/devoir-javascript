/*	author:zou dongyan
**	email:kezonet@gmail.com
**	date:2010/1/1
*/
function Loupe(obj){
	this.small	= obj.small	|| "loupe_small",
	this.big	= obj.big	|| "loupe_big",
	this.img_s	= obj.img_s	|| "loupe/petit.jpg",
	this.img_b	= obj.img_b	|| "loupe/grand.jpg",
	this.mclass	= obj.mclass|| "loup_move",
	this.dd		= obj.dd	|| "right",
	this.auto	= obj.auto	|| false,
	this.fois	= obj.fois	|| 2
	loupe_init(this);
}

function loupe_init(scope){
	scope.s	= {obj:document.getElementById(scope.small),img:document.createElement("img")}
	scope.b	= {obj:document.getElementById(scope.big)}
	scope.m	= {obj:document.createElement("div")}

	scope.s.img.setAttribute("src",scope.img_s);
	scope.s.obj.appendChild(scope.s.img);
	scope.s.obj.appendChild(scope.m.obj);
	scope.s.obj.style.position	= 'relative';
	if(scope.auto){
		scope.s.obj.style.cssFloat	= scope.dd;
		scope.s.obj.style.styleFloat	= scope.dd;
	}
	
	scope.b.width	= parseInt(scope.b.obj.style.width);
	scope.b.height	= parseInt(scope.b.obj.style.height);
	scope.b.obj.style.backgroundImage	= "URL("+scope.img_b+")";
	scope.b.obj.style.backgroundPosition = '0px 0px';

	scope.m.obj.setAttribute("class",scope.mclass);
	scope.m.obj.setAttribute("className",scope.mclass);
	scope.m.width			= scope.b.width/scope.fois;
	scope.m.height			= scope.b.height/scope.fois;
	scope.m.obj.style.width	= scope.m.width+'px';
	scope.m.obj.style.height= scope.m.height+'px';
	scope.m.obj.style.zIndex= '1000';
	scope.m.obj.style.left	= '0px';
	scope.m.obj.style.top	= '0px';
	scope.m.obj.style.position	= 'absolute';

	loupe_bind(event_img_onload,scope)();
	try{
		scope.s.img.addEventListener("load",loupe_bind(event_img_onload,scope),false);
		scope.s.obj.addEventListener("mousedown",loupe_bind(event_m_mousedown,scope),false);
		scope.s.obj.addEventListener("mousemove",loupe_bind(event_m_mousemove,scope),false);
		scope.s.obj.addEventListener("mouseup",loupe_bind(event_m_mouseup,scope),false);
	}catch(e){
		scope.s.img.attachEvent("onload",loupe_bind(event_img_onload,scope));
		scope.s.obj.attachEvent("onmousedown",loupe_bind(event_m_mousedown,scope));
		scope.s.obj.attachEvent("onmousemove",loupe_bind(event_m_mousemove,scope));
		scope.s.obj.attachEvent("onmouseup",loupe_bind(event_m_mouseup,scope));
	}
}

function loupe_bind(fn,scope){
	return function(){
		fn.apply(scope,arguments);
	}
}

function event_img_onload(e){
	if(e == null){e = window.event}
	this.s.img.style.display="block";
	this.s.width			= this.s.img.offsetWidth;
	this.s.height			= this.s.img.offsetHeight;
	this.s.obj.style.width	= this.s.width+'px';
	this.s.obj.style.height	= this.s.height+'px';
	this.diverX				= parseInt(this.s.width-this.m.width);
	this.diverY				= parseInt(this.s.height-this.m.height);
	if(this.s.width){
		this.s.obj.style.backgroundImage= "URL("+this.img_s+")";
		this.s.img.style.display		="none";
	}
}

function event_m_mousedown(e){
	if(e == null){e = window.event}
	this._x	= e.clientX-parseInt(this.m.obj.style.left);
	this._y	= e.clientY-parseInt(this.m.obj.style.top);
	if(!e.target||e.target==this.m.obj){
		this.ismove	= true;
	}
	document.body.focus();
	document.onselectstart	= function () { return false; }
	e.target.ondragstart	= function() { return false; } 
	return false; 
}

function event_m_mousemove(e){
	if(e == null){e = window.event}
	if(this.ismove){
		control_move(parseInt(e.clientX-this._x), parseInt(e.clientY-this._y), this);
	}
}

function event_m_mouseup(e){
	if(e == null){e = window.event}
	this.ismove	= false;
	if(this.auto){control_check(parseInt(e.clientX-this._x), parseInt(e.clientY-this._y), this);}
	return false; 
}

function control_move(x,y,scope){
	x	= (x>0)?(x<scope.diverX)?x:scope.diverX:0;
	y	= (y>0)?(y<scope.diverY)?y:scope.diverY:0;
	scope.m.obj.style.left	= x+'px';
	scope.m.obj.style.top	= y+'px';
	scope.b.obj.style.backgroundPosition = -x*scope.fois+'px '+(-y*scope.fois)+'px';
}

function control_check(x,y,scope){
	if(scope.dd=="left"&&x<5||scope.dd=="right"&&x>scope.diverX-5){
		scope.dd	= (scope.dd=="left")?"right":"left";
		scope.s.obj.style.cssFloat		= scope.dd;
		scope.s.obj.style.styleFloat	= scope.dd;
	}
}