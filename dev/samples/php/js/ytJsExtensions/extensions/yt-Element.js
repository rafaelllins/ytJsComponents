/****************************************
  ytJsExtensions by Yuup Tech v0.3b
  -------------------------------------
autor: Rafaell Lins
e-mail: rafaellmail@gmail.com
criado: 01/10/2011
última modificação: 27/07/2012
*****************************************/

/*********************************************************************************************
searchElements: -> Grupo de elementos a serem pesquisados.
[{	
	groupName -> obrigatório, nome do atributo (grupo) que conterá o objeto, caso encontrado. Se a opção single estiver falsa, será retornado um array.
	single -> opcional, retorna na primeira ocorrência, default é falso
	att:{ -> Qualquer atributo e em quantos quiser. Obrigatório ao menos um atributo.
		id,
		className,
		tagName,
		value,
		atributo_customizado...
	}
}, ...] -> mais de uma expressão de busca pode ser passada ao método e todas serão verificadas em conjunto
,settings: -> Configurações gerais. Opcional.
{
	ignoreCase -> opcional, comparação case insensitive
	recursive -> busca recursiva
}
**********************************************************************************************/
var _getGroupsElementsByAttributes = function(searchElements, settings){
	var allFoundElements = [];
	var ifExpression;
	var checkAndAdd;
	var arrBlockIfExpression = [];
	var arrElementsExpression = [];
	var upper = "";
	var validGroupName;
	var validAtt;
	var _groupName;
	var _single = false;
	var _recursive = true;
	var _ignoreCase = false;
	
	var foundElement = function(el, i){
		return {element: el, index: i};
	}
	
	if(settings != undefined && typeof settings == "object"){
		if(_ignoreCase = (settings.ignoreCase != undefined && settings.ignoreCase === true))
			upper = ".toUpperCase()";
		if(settings.recursive != undefined)
			_recursive = !settings.recursive === false;
	}
	
	if(searchElements != undefined && typeof searchElements == "object" && searchElements.length > 0){
		for(var z = 0; z < searchElements.length && typeof searchElements[z] == "object"; z++){
			validGroupName = searchElements[z].groupName != undefined && typeof searchElements[z].groupName == 'string';
			validAtt = searchElements[z].attributes != undefined && typeof searchElements[z].attributes == "object";
			if(validGroupName && validAtt){
				_groupName = searchElements[z].groupName;
				_single = searchElements[z].single != undefined && searchElements[z].single === true ? true : false;
				var arrExpression = [];
				var x = 0;
				for (var attribute in searchElements[z].attributes) {
					if (typeof searchElements[z].attributes[attribute] == 'string') {
						if(!_ignoreCase && attribute == "tagName")
							upper = ".toUpperCase()";
						arrExpression[x++] = "child." + attribute + " != undefined && child." + attribute + upper + " == \"" + searchElements[z].attributes[attribute] + "\"" + upper;
						if(!_ignoreCase && attribute == "tagName")
							upper = "";
					}
				}
				//Verifica se possui uma expressão de busca
				if(arrExpression.length > 0){
					eval("allFoundElements." + _groupName + " = " + (_single ? "null" : "[]") + ";");
					var elementNotFound = _single ? "allFoundElements." + _groupName + " == null && " : "";
					arrElementsExpression.push(elementNotFound + arrExpression.join(" && "));
					arrBlockIfExpression.push("{allFoundElements." + _groupName + (_single ? " = foundElement(child, index)" : ".push(foundElement(child, index))") + ";}");
				}
			}
		}
		
		if(arrElementsExpression.length > 0){
			ifExpression = "if(" + arrElementsExpression[0];
			for(var k = 1; k < arrElementsExpression.length; k++)
				ifExpression += ") " + arrBlockIfExpression[k - 1] + " if(" + arrElementsExpression[k];
			ifExpression += ")" + arrBlockIfExpression[arrBlockIfExpression.length - 1];
			
			//Compila a rotina de verificação e adição de novos elementos
			eval("checkAndAdd = function(child, index){" + ifExpression + "}");
			
			var checkAndAddRecursive = function(currentChild){
				for(var x = 0; x < currentChild.childNodes.length; x++){
					var child = currentChild.childNodes[x];
					
					if(child.nodeName != undefined && child.nodeName != "#text"){
						checkAndAdd(child, x);
						
						if(_recursive && child.childNodes.length > 0){
							checkAndAddRecursive(child);
						}
					}
				}
			}
			checkAndAddRecursive(this);
		}
	}
	return allFoundElements;
}
Element.prototype.getGroupsElementsByAttributes = _getGroupsElementsByAttributes;
Document.prototype.getGroupsElementsByAttributes = _getGroupsElementsByAttributes;

/*********************************************************************************************
attributes:{ -> Qualquer atributo e em quantos quiser. Obrigatório ao menos um atributo
	id,
	className,
	tagName,
	value,
	atributo_customizado...
},
settings:{ -> Configurações. Opcional.
	single -> Retorna na primeira ocorrência. Opcional.
	ignoreCase -> Comparação case insensitive. Opcional.
	recursive -> Busca recursiva. Opcional.
}
**********************************************************************************************/
var _getElementsByAttributes = function(attributes, settings){
	var allFoundElements = [];
	var checkAndAdd;
	var ifExpression = "";
	var blockIfExpression = "";
	var arrExpression = [];
	var upper = "";
	var _single = false;
	var _recursive = true;
	var _ignoreCase = false;
	
	var foundElement = function(el, i){
		return {element: el, index: i};
	}
	
	if(settings != undefined && typeof settings == "object"){
		_single = settings.single != undefined && settings.single === true ? true : false;
		if(_ignoreCase = (settings.ignoreCase != undefined && settings.ignoreCase === true))
			upper = ".toUpperCase()";
		if(settings.recursive != undefined)
			_recursive = !settings.recursive === false;
	}

	if(attributes != undefined && typeof attributes == "object"){
		var x = 0;
		for (var attribute in attributes) {
			if (typeof attributes[attribute] == 'string') {
				if(!_ignoreCase && attribute == "tagName")
					upper = ".toUpperCase()";
				arrExpression[x++] = "child." + attribute + " != undefined && child." + attribute + upper + " == \"" + attributes[attribute] + "\"" + upper;
				if(!_ignoreCase && attribute == "tagName")
					upper = "";
			}
		}
		
		//Verifica se possui uma expressão de busca
		if(arrExpression.length > 0){
			eval("allFoundElements = " + (_single ? "null" : "[]") + ";");
			
			blockIfExpression = "{allFoundElements" + (_single ? " = foundElement(child, index)" : ".push(foundElement(child, index))") + ";}";
			ifExpression = "if(" + arrExpression.join(" && ") + ")" + blockIfExpression;
			
			//Compila a rotina de verificação e adição de novos elementos
			eval("checkAndAdd = function(child, index){" + ifExpression + "}");
			
			var checkAndAddRecursive = function(currentChild){
				for(var x = 0; x < currentChild.childNodes.length; x++){
					var child = currentChild.childNodes[x];
					
					if(child.nodeName != undefined && child.nodeName != "#text"){
						checkAndAdd(child, x);
						
						if(_single && allFoundElements != null)break;
						
						if(_recursive && child.childNodes.length > 0){
							checkAndAddRecursive(child);
							if(_single && allFoundElements != null)break;
						}
					}
				}
			}
			checkAndAddRecursive(this);
		}
	}
	return allFoundElements;
}
Element.prototype.getElementsByAttributes = _getElementsByAttributes;
Document.prototype.getElementsByAttributes = _getElementsByAttributes;