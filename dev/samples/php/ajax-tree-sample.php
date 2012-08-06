<?php
require_once 'Node.php';

$nodes = array();
$node = new Node("Titutlo A1", "A1", true, true, true, array(
	new Node("Titutlo A1.B1", "A1.B1", true, true, true),
	new Node("Titutlo A1.B2", "A1.B2", true, true, true, array(
		new Node("Titutlo A1.B2.C1", "A1.B2.C1", true, true, true)
	)),
));

$node2 = new Node("Titutlo A2", "A2", true, true, true, array(
	new Node("Titutlo A2.B1", "A2.B1", true, true, true, array(
		new Node("Titutlo A2.B1.C1", "A2.B1.C1"),
		new Node("Titutlo A2.B1.C2", "A2.B1.C2"),
		new Node("Titutlo A2.B1.C3", "A2.B1.C3")
	))
));

$node3 = new Node("Titutlo A3", "A3");

array_push($nodes, $node->toArray());
array_push($nodes, $node2->toArray());
array_push($nodes, $node3->toArray());

echo json_encode($nodes);
?>