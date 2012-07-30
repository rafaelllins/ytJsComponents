/******************************
YuupTech TreeView v0.4.5 beta
autor: Rafaell Lins
e-mail: rafaellmail@gmail.com
criado: 04/08/2011
última modificação: 01/10/2011
******************************/

/*************************************************************************************************************************************************
BUG:
[X]  - 	getCheckeds não retorna valores
[X]  - 	O id do checkbox não poderá receber o node.value como parte de seu valor ou o mesmo terá de ser tratado
[ ]* - 	Ao inserir os elementos dinamicamente está havendo distorção de estilo ** Não sei mais o que fazer...
[ ]  - 	No IE ao carregar nós dinamicamente numa treeview do tipo checkbox os mesmos não ficam checados quando necessário.
[ ]  - 	Para o tipo treeview checkbox, quando um nó for checado e requisitado com todos os valores ou valores de um prefixName não encontrado, o mesmo
		deve verificar se existe níveis de nós a serem consultados via ajax, até que os encontre. Caso contrário só deverá parar com as requisições
		quando a árvore não tiver mais nós a serem carregados.
**************************************************************************************************************************************************/

/*************************************************************************************************************************************************
TASK:
[X]  - 	Evoluir componente de modo a receber nós de requisições ajax realizadas de fora.
[P]  - 	Criar métodos genéricos para buscar em elementos e consultar um ou vários de seus atributos. Realizar substituição nos locais necessários.
[ ]* - 	Adicionar método responsável por criar toda a treeview no momento em que é instanciada. O parâmetro params.data deve ser passado.
[X]* - 	Adicionar ao Node o atributo Expanded
[ ]* - 	Adicionar opções de ToolTip para asções Expand/Collapse e Check -> radiobutton / Check/Uncheck -> checkbox. Valores default com base no 
		atributo description.
[ ]* -	Idependente do tipo de árvore, cada nó poderá informar se possui ou não radiobutton/checkbox
[ ]* -	Ao consultar um nó sob demanda e não retornar valor algum, retirar a imagem plus ou substituir por um quadrado preto
[ ]* -	Ao carregar um conjunto de nós sob demanda, carregá-los pausadamente.
**************************************************************************************************************************************************/

/*********************************************************************************************
params:
{
	containerId,-> obrigatorio
	instanceName, -> obrigatorio
	type, -> opcional
	onRequestNodes, -> obrigatorio, se algum node.hasChilds = true e node.childs = undefined
	onCheck, -> opcional
	labelAction, -> opcional
	data -> opcional
	messageWait -> opcional
}
**********************************************************************************************/
function ytTreeView(params){

	//Privates
	var imagePlus = "plus.gif";
	var imageMinus = "minus.gif";
	var classNameNode = "node";
	var classNameLeaft = "leaf_node";
	var classNameWait = "wait";
	
	//Publics, constructor
	this.container = document.getElementById(params.containerId);
	this.instanceName = params.instanceName;
	this.checkBoxName = params.containerId + "_ck";
	this.radioButtonName = params.containerId + "_rd";
	this.type = (params.type != undefined) ? params.type : ytTreeView.TYPE_NONE;
	this.onRequestNodes = (params.onRequestNodes != undefined && typeof params.onRequestNodes == 'function') ? params.onRequestNodes : null;
	this.onCheck = (params.onCheck != undefined && typeof params.onCheck == 'function') ? params.onCheck : null;
	this.labelAction = (params.labelAction != undefined) ? params.labelAction : ytTreeView.LABEL_ACTION_NONE;
	this.messageWait = (params.messageWait != undefined) ? params.messageWait : "loading...";
	
	this.check = function(obj){
		if(this.type == ytTreeView.TYPE_CHECK_BOX){
			ck = obj;
			var parentLi = ck.parentNode;
			var childCk = parentLi.getElementsByTagName("input");
			var length = childCk.length;                               
			
			for(var x = 1; x < length; x++){
				if(childCk[x].type.toUpperCase() == "CHECKBOX"){
					childCk[x].checked = ck.checked;
				}
			}
			
			if(ck.checked)
				this.selectParent(parentLi);
			else	
				this.unSelectParent(parentLi);
		}
	}
	
	this.selectParent = function(parentLi){
		var selParent = parentLi.parentNode.parentNode;
		if(selParent.nodeName.toUpperCase() == "LI"){
			var childCk = selParent.getElementsByTagName("input");
			childCk[0].checked = true;
			this.selectParent(selParent);
		}
	}

	this.unSelectParent = function(parentLi){
		var selParent = parentLi.parentNode.parentNode;
		if(selParent.nodeName.toUpperCase() == "LI"){
			var childCk = selParent.getElementsByTagName("input");
			var length = childCk.length;
			var isCheck = false;
			for(var x = 1; x < length; x++){
				if(childCk[x].checked){
					isCheck = true;
					break;
				}
			}
			if (!isCheck){
				childCk[0].checked = false;
				this.unSelectParent(selParent);
			}
		}
	}
	
	this.clickNode = function(a){
		var li = a.parentNode;
		var indexOL = -1;
		var indexIMG = -1;
		
		for(var x = 0; x < li.childNodes.length; x++){
			if(indexOL == -1 && li.childNodes[x].nodeName.toUpperCase() == "OL")
				indexOL = x;
			if(indexIMG == -1 && li.childNodes[x].nodeName.toUpperCase() == "IMG" && li.childNodes[x].className.toUpperCase() == "IMG_TREE")
				indexIMG = x;
			if(indexOL > -1 && indexIMG > -1)
				break;
		}
		
		if(indexOL == -1){
			var isLoading = false;
			
			for(var x = 0; x < li.childNodes.length; x++){
				if(li.childNodes[x].nodeName.toUpperCase() == "SPAN"){
					isLoading = true;
					break;
				}
			}
			
			if(!isLoading){
				//Dispara evento de modo a requisitar os nós filhos do nó atual
				var _params = {};
				_params.li = li;
				
				if(this.type == ytTreeView.TYPE_CHECK_BOX || this.type == ytTreeView.TYPE_RADIO_BUTTON){
					for(var x = 0; x < li.childNodes.length; x++){
						if(li.childNodes[x].nodeName.toUpperCase() == "INPUT"){
							_params.value = li.childNodes[x].value;
							break;
						}
					}
				}
				
				var span = document.createElement("span");
				span.className = classNameWait;
				span.innerHTML = this.messageWait;
				li.appendChild(span);
				this.onRequestNodes(_params);
			}
		}
		
		if(indexOL > -1 && indexIMG > -1){
			if (li.childNodes[indexOL].className.toUpperCase() == "EXPAND"){
				li.childNodes[indexOL].className = "collapse";
				li.childNodes[indexIMG].src = ytTreeView.PATH_IMAGE + imagePlus;
			}else{
				li.childNodes[indexOL].className = "expand";
				li.childNodes[indexIMG].src = ytTreeView.PATH_IMAGE + imageMinus;
			}
		}
	}
	
	this.getCheckeds = function(prefixName,delimiter){
		var result = new Array();
		var allChecks = this.container.getElementsByTagName("input");
		var i = 0;
		var length = allChecks.length;
		
		for(var x = 0; x < length; x++){
			var typeInput = allChecks[x].type.toUpperCase();
			var nameInput = prefixName + this.checkBoxName;
			
			if(typeInput == "CHECKBOX" && allChecks[x].name == nameInput && allChecks[x].checked == true){
				result[i++] = allChecks[x].value;
			}
		}
		
		return result.join(delimiter);
	}
	
	this.getAllCheckeds = function(delimiter){
		var result = new Array();
		var allChecks = this.container.getElementsByTagName("input");
		var i = 0;
		var length = allChecks.length;

		for(var x = 0; x < length; x++){
			var typeInput = allChecks[x].type.toUpperCase();
			var nameInput = allChecks[x].name;
			var endWith = nameInput.substr(nameInput.length - this.checkBoxName.length, this.checkBoxName.length);
			
			if(typeInput == "CHECKBOX" && endWith == this.checkBoxName && allChecks[x].checked == true){
				result[i++] = allChecks[x].value;
			}
		}
		
		return result.join(delimiter);
	}
	
	this.getChecked = function(){
		var result = "";
		var allRadios = document.getElementsByName(this.radioButtonName);		
		var length = allRadios.length;
		
		for(var x = 0; x < length; x++){
			if(allRadios[x].checked == true){
				result = allRadios[x].value;
				break;
			}
		}
		
		return result;
	}
	
	/****************************
	node:
	{
		description
		value
		hasChilds
		childs
		prefixName
		expanded
	}
	****************************/
	this.createNode = function(node){
		var li = document.createElement("li");
		
		if(node.hasChilds){
			li.className = classNameNode;
			
			var oImg = document.createElement("img");
			oImg.className = "img_tree";
			
			if(node.expanded != undefined && node.expanded === true){
				oImg.src = ytTreeView.PATH_IMAGE + imageMinus;
			}else{
				oImg.src = ytTreeView.PATH_IMAGE + imagePlus;
			}
						
			eval("oImg.onclick = function(){" + this.instanceName + ".clickNode(this);};");
			
			li.appendChild(oImg);
		}else{
			li.className = classNameLeaft;
		}
		
		if(this.type == ytTreeView.TYPE_CHECK_BOX || this.type == ytTreeView.TYPE_RADIO_BUTTON){
			
			var oInput = document.createElement("input");
			
			if(this.type == ytTreeView.TYPE_CHECK_BOX){
				oInput.type = "checkbox";
				oInput.name = node.prefixName + this.checkBoxName;
				oInput.checked = node.checked;
			}else{
				oInput.type = "radio";
				oInput.name = this.radioButtonName;
			}
			
			oInput.value = node.value;
			eval("oInput.onclick = function(){" + this.instanceName + ".check(this);};");
			li.appendChild(oInput);
		}
		
		var oLabel = document.createElement("a");
		oLabel.innerHTML = node.description;
		if(this.labelAction == ytTreeView.LABEL_ACTION_CHECK){			
			eval("oLabel.onclick = function(){" + this.instanceName + ".check(this);};");
		}else if(node.hasChilds && this.labelAction == ytTreeView.LABEL_ACTION_HIERARCHICAL){
			eval("oLabel.onclick = function(){" + this.instanceName + ".clickNode(this);};");
		}
		li.appendChild(oLabel);
		
		if(node.childs != undefined && node.childs.length > 0){
			this.addNodes(node.childs, li, node.checked);
		}
		
		return li;
	}
	
	this.addNodes = function(nodes, parentNode, checked){
		if(nodes != undefined){
			var oOl = document.createElement("ol");
			oOl.className = "collapse";
			
			var length = parentNode.childNodes.length;
			
			for(var i = 0; i < length; i++){
				if(parentNode.childNodes[i].nodeName.toUpperCase() == "IMG" && parentNode.childNodes[i].src == ytTreeView.PATH_IMAGE + imageMinus){
					oOl.className = "expand";
					break;
				}
			}
			
			var length = nodes.length;
			
			for(var x = 0; x < length; x++){
				nodes[x].checked = checked;
				oOl.appendChild(this.createNode(nodes[x]));
			}
			
			parentNode.appendChild(oOl);
		}
	}
	
	this.loadNodes = function(params){
		var li = params.li;
		var indexOL = -1;
		var indexSpan = -1;
		var indexInput = -1;
		
		for(var x = 0; x < li.childNodes.length && (indexOL == -1 || indexSpan == -1 || indexInput == -1); x++){
			if(indexOL == -1 && li.childNodes[x].nodeName.toUpperCase() == "OL"){
				indexOL = x;
			}
			
			if(indexSpan == -1 && li.childNodes[x].nodeName.toUpperCase() == "SPAN"){
				indexSpan = x;
			}
			
			if(indexInput == -1 && li.childNodes[x].nodeName.toUpperCase() == "INPUT"){
				indexInput = x;
			}
		}
		
		if(indexOL == -1){
			var checked = false;
			
			if(this.type == ytTreeView.TYPE_CHECK_BOX){
				checked = li.childNodes[indexInput].checked;
			}
			
			this.addNodes(params.nodes, li, checked);
			this.clickNode(li.childNodes[indexInput]);
		}
		
		if(indexSpan > -1){
			li.removeChild(li.childNodes[indexSpan]);
		}
	}
}
//tree types
ytTreeView.TYPE_CHECK_BOX = "checkbox";
ytTreeView.TYPE_RADIO_BUTTON = "radiobutton";
ytTreeView.TYPE_NONE = "none";

//label actions
ytTreeView.LABEL_ACTION_CHECK = "check";
ytTreeView.LABEL_ACTION_HIERARCHICAL = "hierarchical";
ytTreeView.LABEL_ACTION_NONE = "none";

//Constants
ytTreeView.PATH_IMAGE = "./images/";

//teste data
ytTreeView.dataSample = [
	{
		description: 'titulo A1', value: 'a1', hasChilds: true, prefixName: 'z', childs:[	
		{
			description: 'titulo B1', value: 'b1', hasChilds: true, prefixName: 'u', childs:[
				{
					description: 'titulo C1', value: 'c1', hasChilds: false, prefixName: 'y'
				}
			]
		}]
	},
	{
		description: 'titulo A2', value: 'a2', hasChilds: true, prefixName: 'z'
	}
];

/*
//Este método fica para mais tarde, já que será utilizado em um posterior editar sendo uma árvore de checkbox's.
function tree_Load(str_cks,delimiter){
    var cks = str_cks.split(delimiter);
    var length = cks.length;
    for(var x = 0; x < length; x++){
        var objCk = document.getElementById(cks[x]);
        objCk.checked = (objCk.checked)?false:true;
        tree_check(objCk);
    }
}
*/