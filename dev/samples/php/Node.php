<?php
class Node{
	public $description;
	public $value;
	public $hasChilds;
	public $expanded;
	public $hasCheckElement;
	public $childNodes;
	
	public function __construct($description, $value, $hasChilds = false, $expanded = false, $hasCheckElement = true, $childNodes = array()){
		$this->description = $description;
		$this->value = $value;
		$this->hasChilds = $hasChilds;
		$this->expanded = $expanded;
		$this->hasCheckElement = $hasCheckElement;
		$this->childNodes = $childNodes;
	}
	
	public function toArray(){
		$arrNode = array(
			$this->description,
			$this->value,
			$this->hasChilds,
			$this->expanded,
			$this->hasCheckElement
		);
		
		$sizeChildNodes = count($this->childNodes);
		
		if($sizeChildNodes > 0){
			$arrChilds = array();
			
			for($i = 0; $i < $sizeChildNodes; $i++){
				array_push($arrChilds, $this->childNodes[$i]->toArray());
			}
			
			array_push($arrNode, $arrChilds);
		}
		
		return $arrNode;
	}
}
?>