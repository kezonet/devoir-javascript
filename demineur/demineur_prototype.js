/*	author:zou dongyan
**	email:kezonet@gmail.com
**	date:2009/12/20
*/
function Demineur(obj){
	this.renderto	= obj.renderto||document.body;
	this.width		= 10;
	this.height		= 10;
	this.nombre		= 10;
	this.onStart	= function(){}
	this.onClick	= function(){}
	this.onWin		= function(){}
	this.onFailed	= function(){}
	this.setting(obj);
}
Demineur.prototype={
	setting:function(obj){
		this.width		= obj.width||this.width;
		this.height		= obj.height||this.height;
		this.nombre		= obj.nombre||this.nombre;
		this.onStart	= obj.onStart||this.onStart;
		this.onClick	= obj.onClick||this.onClick;
		this.onWin		= obj.onWin||this.onWin;
		this.onFailed	= obj.onFailed||this.onFailed;
		return this;
	},
	newGame:function(){//prépare commence
		this.init();
		this.creatBox();
		this.confusion(1,1);
		this.voisines();
		this.view();
	},
	init:function(){//initialisation
		this.error		= 0;
		this.numMarque	= 0;
		this.numOpen	= 0;
		this.isStart	= false;
		this.isOver		= false;
		this.waitOpen	= [];
		this.tout		= this.width*this.height-this.nombre;
	},
	creatBox:function(){//crée le objet de case
		this.box	= [];
		var number	= 0;
		for (var h=0;h<this.height+2;h++){
			this.box[h] = [];
			for (var w=0;w<this.width+2;w++){
				this.box[h][w]={voisine:0,bomb:false,cache:true,marque:false}
				if ((h!=0)&&(h!=this.height+1)&&(w!=0)&&(w!=this.width+1)&&(number<this.nombre)){
					this.box[h][w].bomb = true;
					number++;
				}
			}
		}
	},
	confusion:function(h,w){//confondre les cases
		var toH=Math.ceil(Math.random()*(this.height-1)+1);
		var toW=Math.ceil(Math.random()*(this.width-1)+1);
		var tmp=this.box[h][w].bomb;
		this.box[h][w].bomb=this.box[toH][toW].bomb;
		this.box[toH][toW].bomb=tmp;
		if((h-1)*this.width+w<this.nombre){
			if(w<this.width){
				this.confusion(h,w+1);//la prochaine colonne
			}else if(h<this.height){
				this.confusion(h+1,1);//la prochaine rang
			}
		}
	},
	voisines:function(){//calculer la nombre du voisin
		for (var h=1;h<=this.height;h++){
			for (var w=1;w<=this.width;w++){
				if(this.box[h][w].bomb){
					this.box[h-1][w-1].voisine++;
					this.box[h-1][w].voisine++;
					this.box[h-1][w+1].voisine++;
					this.box[h][w-1].voisine++;
					this.box[h][w+1].voisine++;
					this.box[h+1][w-1].voisine++;
					this.box[h+1][w].voisine++;
					this.box[h+1][w+1].voisine++;
				}
			}
		}
	},
	view:function(){//le tableau de view
		this.td=[];
		var table = document.createElement("table");
		var tbody = document.createElement("tbody");
		table.appendChild(tbody);
		for (var h=1;h<=this.height;h++){
			this.td[h]=[];
			var tr = document.createElement("tr");
			for (var w=1;w<=this.width;w++){
				var td = document.createElement("td");
				td.setAttribute("h",h);
				td.setAttribute("w",w);
				this.td[h][w]=td;
				tr.appendChild(td);
			}
			tbody.appendChild(tr);
		}
		this.renderto.innerHTML='';
		this.renderto.appendChild(table);
		table.style.width=this.width*29+"px";
		table.addEventListener("mousedown",this.bind(this.clickBox,this),false);
		table.addEventListener("contextmenu",function(e){e.stopPropagation()},false);
	},
	clickBox:function(e){//click la case
		if(this.isOver){return}
		if(!this.isStart){this.start()}
		var h=parseInt(e.target.getAttribute("h"));
		var w=parseInt(e.target.getAttribute("w"));
		if(!this.box[h][w].cache){return}
		if(e.button==2){
			this.marque(h,w);
		}else{
			if(this.box[h][w].bomb&&!this.box[h][w].marque){
				this.endBoum(h,w);
			}else{
				this.openBox(h,w);
			}
		}
		if(!this.isOver){this.onClick(this.numOpen,this.numMarque,this.error,this.nombre-this.numMarque)}
	},
	start:function(){//on commence
		this.start_time	= new Date();
		this.isStart	= true;
		this.onStart();
	},
	marque:function(h,w){//marque
		if(this.box[h][w].cache){
			if(!this.box[h][w].marque){
				this.box[h][w].marque=true;
				this.td[h][w].setAttribute("class","marque");
				this.numMarque++;
				if(!this.box[h][w].bomb){
					this.error++;
				}
			}else{
				this.box[h][w].marque=false;
				this.td[h][w].setAttribute("class","");
				this.numMarque--;
				if(!this.box[h][w].bomb){
					this.error--;
				}
			}
		}
	},
	openBox:function(h,w){//change le état
		this.creatOpenList(h,w);
		var h,w;
		var length=this.waitOpen.length;
		for (var i=0; i<length;i++ ){
			h=this.waitOpen[i][0];
			w=this.waitOpen[i][1];
			this.td[h][w].setAttribute("class","vide"+this.box[h][w].voisine);
		}
		this.waitOpen	= [];
		this.numOpen	+= length;
		if(this.numOpen==this.tout){
			this.endMarque();
		}
	},
	creatOpenList:function(h,w){//prépqre la list pour change état
		if(this.box[h][w].cache&&!this.box[h][w].marque){
			this.waitOpen.push([h,w]);
			this.box[h][w].cache=false;
			if(this.box[h][w].voisine==0){
				if (h>1 && w>1) this.creatOpenList(h-1,w-1);
				if (h<this.height && w<this.width) this.creatOpenList(h+1,w+1);
				if (h>1) this.creatOpenList(h-1,w);
				if (w>1) this.creatOpenList(h,w-1);
				if (h<this.height) this.creatOpenList(h+1,w);
				if (w<this.width) this.creatOpenList(h,w+1);
				if (h>1 && w<this.width) this.creatOpenList(h-1,w+1);
				if (h<this.height && w>1) this.creatOpenList(h+1,w-1);
			}
		}
	},
	endBoum:function(h,w){//on a perdu
		this.end();
		for (var fh=1;fh<=this.height;fh++){
			for (var fw=1;fw<=this.width;fw++){
				if(this.box[fh][fw].bomb&&!this.box[fh][fw].marque){
					this.td[fh][fw].setAttribute("class","bombe");
				}else if(this.box[fh][fw].marque&&!this.box[fh][fw].bomb){
					this.td[fh][fw].setAttribute("class","erreur");
				}
			}
		}
		this.td[h][w].setAttribute("class","boum");
		this.onFailed(this.time);
	},
	endMarque:function(){//on a réussi
		this.end();
		for (var h=1;h<=this.height;h++){
			for (var w=1;w<=this.width;w++){
				if(this.box[h][w].bomb){
					this.td[h][w].setAttribute("class","marque");
				}else{
					this.td[h][w].setAttribute("class","vide"+this.box[h][w].voisine);
				}
			}
		}
		this.onWin(this.time);
	},
	end:function(){//termine
		var end_time	= new Date();
		var time	= parseInt(end_time - this.start_time);
		this.time	= parseInt(time/1000);
		this.isOver	= true;
	},
	bind:function(fn,scope){
		return function(){
			fn.apply(scope,arguments);
		}
	}
}