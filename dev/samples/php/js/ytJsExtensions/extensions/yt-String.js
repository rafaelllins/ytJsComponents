/****************************************
  ytJsExtensions by Yuup Tech v0.3b
  -------------------------------------
autor: Rafaell Lins
e-mail: rafaellmail@gmail.com
criado: 01/10/2011
última modificação: 27/11/2011
*****************************************/

String.prototype.endWith = function(str){
	var result;
	if(result = str.length <= this.length)
		result = this.substr(this.length - str.length, str.length) == str;
	return result;
}

String.prototype.startWith = function(str){
	var result;
	if(result = str.length <= this.length)
		result = this.substr(0, str.length) == str;
	return result;
}