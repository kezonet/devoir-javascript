/*	author:zou dongyan
**	email:kezonet@gmail.com
**	date:2010/01/30
*/
var Demineur=function(obj){				//un objet de demineur
	this.renderto	= obj.renderto||document.body;	//ou on afficher cette jeu(par défaut on l'afficher dans la balise body)
	this.width		= 10;				//combien de case dans la horizontale(par defaut est 10)
	this.height		= 10;				//combien de case dans la verticale(par defaut est 10)
	this.nombre		= 10;				//nombien de bombe dans le jeu(par defaut est 10)
	this.onStart	= function(){}		//quand le jeu commence on fait quoi(par defaut est 10)
	this.onClick	= function(){}		//quand on click le souri sur le case on fait quoi(par defaut est on fait rien)
	this.onWin		= function(){}		//quand on reussi on fait quoi(par defaut est on fait rien)
	this.onFailed	= function(){}		//quand on click le bombe on fait quoi(par defaut est on fait rien)
	setting(obj,this);					//utilise la methode setting pour changer les paramètres qu'on a decidé
}

//appliquer les paramètre qu'on a decidé;
//si on transfrer les valeur pour change on le changera sinon on le reste par defaut
function setting(obj,scope){
		scope.width		= obj.width||scope.width;	
		scope.height	= obj.height||scope.height;
		scope.nombre	= obj.nombre||scope.nombre;
		scope.onStart	= obj.onStart||scope.onStart;
		scope.onClick	= obj.onClick||scope.onClick;
		scope.onWin		= obj.onWin||scope.onWin;
		scope.onFailed	= obj.onFailed||scope.onFailed;
}

//prepare un jeu de demineur par rapport les paramètre qu'on a decidé
function newGame(scope){		//le variable scope represent la objet de demineur qu'on a utilisé
	data_init(scope);			//call la methode data_init pour commence pepare des infomation de base pour le demineur
	data_creatBox(scope);		//call la methode data_creatBox pour commence cree les datas de cases
	data_confusion(scope);		//call la methode data_confusion pour mélanger les cases de bombe dans tous le cases
	data_voisines(scope);		//call la methode data_voisiones pour calculer combien de bombe autour chaque case
	view_table(scope);			//call la methode viez_table cree l'interface de cette jeu
}

//prepare les information de base de demineur
function data_init(scope){
	scope.error		= 0;		//combien de case normal qu'on a marque comme une bombe
	scope.numMarque	= 0;		//combien de case qu'on a marque
	scope.numOpen	= 0;		//combien de case qu'on a ouvrir
	scope.isStart	= false;	//Cette jeu a commencé ou pas
	scope.isOver	= false;	//Cette jeu a terminé ou pas
	scope.waitOpen	= [];		//une liste de case qui attendre ouvrir
	scope.tout		= scope.width*scope.height-scope.nombre;	//Calculer il y a combien de case normal dans cette jeu
}

//cree les datas de cases
function data_creatBox(scope){
	scope.box	= [];		//on definit un attribut du objet scope pour stocker les cases
	var number	= 0;		//Cette chiffre est pour calculer combien de case de bombe qu'on a créé
	//Ici,crée une case autour du table qu'on veut, c'est pour facilement calculer la nombre de voisine de chaque case meme si la case situe au bord de la table.
	for (var h=0;h<scope.height+2;h++){
		scope.box[h] = [];
		for (var w=0;w<scope.width+2;w++){
			scope.box[h][w]={voisine:0,bomb:false,cache:true,marque:false}		
			/* on definir chaque case comme un objet qui a 4 attribut:
			voisin:	nombre de voisin
			bomb:	c'est une case normal ou case bombe
			cache:	on le ouvrir ou pas
			marque: on le marque comme une bombe ou pas
			*/
			if ((h!=0)&&(h!=scope.height+1)&&(w!=0)&&(w!=scope.width+1)&&(number<scope.nombre)){
				//Si on n'a pas encore crée nombre de case bombe, cette case est devenu case bombe
				scope.box[h][w].bomb = true;	//Il se transformer une case bombe
				number++;						//ajouter un
			}
		}
	}
}

//confondre les cases
function data_confusion(scope){
	//les deux circle sont utilisé parcourir les cases
	for (var h=1;h<=scope.height;h++){
		for (var w=1;w<=scope.width;w++){
			var toH=Math.ceil(Math.random()*(scope.height-1)+1);//obtenir un chichre aléatoire
			var toW=Math.ceil(Math.random()*(scope.width-1)+1);	//obtenir un chichre aléatoire
			var tmp=scope.box[h][w].bomb;			//un variable pour stocker la case aléatoire pour on changer la type de case entre deux cases
			if((tmp&&!scope.box[toH][toW].bomb)||(!tmp&&scope.box[toH][toW].bomb)){
				//si les deux cases une est case normal et l'autre est case bombe, on les changer type entre eux
				scope.box[h][w].bomb=scope.box[toH][toW].bomb;
				scope.box[toH][toW].bomb=tmp;
			}
		}
	}
}

//calculer la nombre du voisinde chaque case
function data_voisines(scope){
	//parcourir la table de case
	for (var h=1;h<=scope.height;h++){
		for (var w=1;w<=scope.width;w++){
			if(scope.box[h][w].bomb){			//si cette case est une bombe,on va traiter
				//l'attribute voisine de tous les voisines de cette case bombe ajouter un
				scope.box[h-1][w-1].voisine++;	
				scope.box[h-1][w].voisine++;
				scope.box[h-1][w+1].voisine++;
				scope.box[h][w-1].voisine++;
				scope.box[h][w+1].voisine++;
				scope.box[h+1][w-1].voisine++;
				scope.box[h+1][w].voisine++;
				scope.box[h+1][w+1].voisine++;
			}
		}
	}
}

//le tableau de view
function view_table(scope){
	scope.td=[];		//on definit un attribut du objet scope pour stocker les interface de case
	var table = document.createElement("table");
	table.setAttribute('class','demineur');
	var tbody = document.createElement("tbody");
	table.appendChild(tbody);
	for (var h=1;h<=scope.height;h++){
		scope.td[h]=[];
		var tr = document.createElement("tr");
		for (var w=1;w<=scope.width;w++){
			var td = document.createElement("td");
			td.setAttribute("h",h);
			td.setAttribute("w",w);
			scope.td[h][w]=td;
			tr.appendChild(td);
		}
		tbody.appendChild(tr);
	}
	scope.renderto.innerHTML='';
	scope.renderto.appendChild(table);		//afficher l'interface dans le endoit où on a indiqué
	table.style.width=scope.width*29+"px";
	table.addEventListener("mousedown",bind(event_clickBox,scope),false);
	//ajouter un methode pour traiter le click de la souris
	table.addEventListener("contextmenu",function(e){e.stopPropagation()},false);
	//quand on click droit sur ce tableu on n'afficher rien de menu de navigateur
}

//Cette méthode est utilisé pour changer un scope de fonction
function bind(fn,scope){
	return function(){
		fn.apply(scope,arguments);
	}
}

//traiter le click de souris
function event_clickBox(e){
	if(this.isOver){return}						//si le jeu est déjà terminé, on arrêt
	if(!this.isStart){on_Start(this)}
	//si le jeu pas commence, call la methode on_Start pour lancer un événement de demineur
	var h=parseInt(e.target.getAttribute("h"));
	var w=parseInt(e.target.getAttribute("w"));
	//les deux ligne pour savoir le utilisateur a click quelle case
	if(!this.box[h][w].cache){return}			//si la case est déjà ouvrir, on arrêt
	if(e.button==2){							//click droit
		control_marque(h,w,this);				//call la methode control_marque
	}else{										//click gauche
		if(!this.box[h][w].marque){				//si on n'a pas marqué
			control_openBox(h,w,this);			//call la methode control_openbox
		}
	}
	//call la methode on_Click pour lancer un événement de demineur
	on_Click(this)
}

//marque une case
function control_marque(h,w,scope){
	if(scope.box[h][w].cache){				//si la case indiqué ne pas ouvrir on le marcher
		if(!scope.box[h][w].marque){		//si la case ne pas marqué on la marque
			scope.box[h][w].marque=true;
			scope.td[h][w].setAttribute("class","marque");
			scope.numMarque++;
			if(!scope.box[h][w].bomb){
				scope.error++;
			}
		}else{				//si la case marqué on la demarqué
			scope.box[h][w].marque=false;
			scope.td[h][w].setAttribute("class","");
			scope.numMarque--;
			if(!scope.box[h][w].bomb){
				scope.error--;
			}
		}
	}
}

//ouvrir les cases ce qui est dans la liste de ouvrir
function control_openBox(h,w,scope){
	if(scope.box[h][w].bomb){on_Failed(h,w,scope);return}
	control_creatOpenList(h,w,scope);
	//call la methode control_creatOpenList pour prépare la liste de ouvrir
	var h,w;
	//parcourir la liste de ouvrir et ouvrir toutes les case qu'on a noté dans la liste
	for (var i=0; i<scope.waitOpen.length;i++ ){
		h=scope.waitOpen[i][0];
		w=scope.waitOpen[i][1];
		scope.td[h][w].setAttribute("class","vide"+scope.box[h][w].voisine);
	}
	scope.numOpen	+= scope.waitOpen.length;		//reindique la chiffre de case ouvrir
	scope.waitOpen	= [];							//vider la liste de ouvrir
	if(scope.numOpen==scope.tout){
		on_Win(scope);
		//si la nombre de case ouvrir autant de la nombre de case normal, call la methode event_win
	}
}

//prépqre la liste pour ouvrir selon l'attribute de nombre de voisin
function control_creatOpenList(h,w,scope){
	if(scope.box[h][w].cache&&!scope.box[h][w].marque){
	//si la case n'avait pas ouvrir et n'avait pas marque comme une bombe
		scope.waitOpen.push([h,w]);			//on la ajouter dans la liste de ouvrir
		scope.box[h][w].cache=false;		//on la marque comme déjà ouvrir
		if(scope.box[h][w].voisine==0){		//si il y n'a pas de case bombe autour, marcher ça
			if (h>1 && w>1) control_creatOpenList(h-1,w-1,scope);
			if (h<scope.height && w<scope.width) control_creatOpenList(h+1,w+1,scope);
			if (h>1) control_creatOpenList(h-1,w,scope);
			if (w>1) control_creatOpenList(h,w-1,scope);
			if (h<scope.height) control_creatOpenList(h+1,w,scope);
			if (w<scope.width) control_creatOpenList(h,w+1,scope);
			if (h>1 && w<scope.width) control_creatOpenList(h-1,w+1,scope);
			if (h<scope.height && w>1) control_creatOpenList(h+1,w-1,scope);
		}
	}
}

//il marche quand le jeu commence
function on_Start(scope){
	scope.start_time= new Date();	//obtenir un temps
	scope.isStart	= true;			//marque ce jeu est commencé
	scope.onStart();				//call la methode onstart de objet demineur q'on a prévue
}

function on_Click(scope){
	//call la methode de onclick de obj demineur q'on a prévue
	if(!scope.isOver){
		scope.onClick(scope.numOpen,scope.numMarque,scope.error,scope.nombre-scope.numMarque)
	}
}

//il marche quand on click une bombe
function on_Failed(h,w,scope){
	control_end(scope);		//call la methode event_end
	//parcourir la table de case
	for (var fh=1;fh<=scope.height;fh++){
		for (var fw=1;fw<=scope.width;fw++){
			if(scope.box[fh][fw].bomb&&!scope.box[fh][fw].marque){
				scope.td[fh][fw].setAttribute("class","bombe");
				//toutes les cases de bombes affichent
			}else if(scope.box[fh][fw].marque&&!scope.box[fh][fw].bomb){
				scope.td[fh][fw].setAttribute("class","erreur");
				//afficher les fautes cases
			}
		}
	}
	scope.td[h][w].setAttribute("class","boum");
	//la case qu'on a préssé afficher une images de exploseur
	scope.onFailed(scope.time);
	// call la methode onfailed de objet demineur q'on a prévue
}

//il marche quand on reussir le jeu
function on_Win(scope){
	control_end(scope);		//call la methode event_end
	//parcourir la table de case
	for (var h=1;h<=scope.height;h++){
		for (var w=1;w<=scope.width;w++){
			if(scope.box[h][w].bomb){
				scope.td[h][w].setAttribute("class","marque");
				//marquer toutes les cases de bombe
			}else{
				scope.td[h][w].setAttribute("class","vide"+scope.box[h][w].voisine);
				//ouvrir tous les cases de normal
			}
		}
	}
	scope.onWin(scope.time);
	// call la methode onxin de objet demineur q'on a prévue
}

//il marche quand le jeu termine
function control_end(scope){
	var end_time= new Date();		//obtenir un temps
	scope.time	= parseInt(parseInt(end_time - scope.start_time)/1000);
	//calculer on a utiliser combien de temps
	scope.isOver= true;				//marque ce jeu est terminé
}