function parse(data) {
	if(String(Number(data)) == data)
		return Number(data);
	else
		return data;
}

function Queue() {
	this.renders = [];
}

Queue.prototype = Object.create(Array.prototype);
Queue.prototype.name = 'queue';

Queue.prototype.push = function (arg) {
	for (var i=0;i<this.renders.length;i++)
		this.renders[i].push(1, arg);

	arg = parse(arg);
	Array.prototype.push.call(this, arg);
}

Queue.prototype.pop = function () {
	if (this.length < 1) {
		console.log("Warning: No element inside the "+this.name);
		return;
	}

	for (var i=0;i<this.renders.length;i++)
		this.renders[i].pop(0);

	return Array.prototype.shift.call(this);
}

Queue.prototype.peek = function () {
	return this[0];
}


function Stack() {
	this.renders = [];
}
Stack.prototype = Object.create(Array.prototype);
Stack.prototype.name = 'stack';

Stack.prototype.push = function (arg) {
	for (var i=0;i<this.renders.length;i++)
		this.renders[i].push(1, arg);

	arg = parse(arg);
	Array.prototype.push.call(this, arg);
}

Stack.prototype.pop = function () {
	if (this.length < 1) {
		console.log("Warning: No element inside the "+this.name);
		return;
	}

	for (var i=0;i<this.renders.length;i++)
		this.renders[i].pop(1);

	return Array.prototype.pop.call(this);
}

Stack.prototype.peek = function() {
	return this[this.length-1];
}


function Deque() {
	this.renders = [];
}
Deque.prototype = Object.create(Stack.prototype);
Deque.prototype.name = 'deque';

Deque.prototype.pushLeft = function (arg) {
	for (var i=0;i<this.renders.length;i++)
		this.renders[i].push(0, arg);

	arg = parse(arg);
	Array.prototype.unshift.call(this, arg);
}

Deque.prototype.popLeft = function () {
	if (this.length < 1) {
		console.log("Warning: No element inside the "+this.name);
		return;
	}

	for (var i=0;i<this.renders.length;i++)
		this.renders[i].pop(0);

	return Array.prototype.shift.call(this);
}


function Node(data) {
	this.data = data;
	this.left = undefined;		//works as prev
	this.right = undefined;		//works as next
	this.parent = undefined; 	
}

function LinkedList(data) {
	this.head = undefined;
	this.length = 1;
	this.renders = [];
}

LinkedList.prototype.find = function(i) {
	var n = this.head;
	for(var j = 0; j<i; j++)
		n = n.right;
	return n;
}

LinkedList.prototype.toString = function() {
	var node = this.head;
	var s = '['+node.data;
	while(node.right != undefined) {
		node = node.right;
		s += ' '+node.data;
	}
	s += ']';
	return s;
}

LinkedList.prototype.insert = function(data, node) {
	// Inserts data after a node. If the node is blank, place the node at the head
	data = parse(data);
	var n = new Node(data);

	if(node != undefined && node.__proto__ != Node.prototype)
		return;

	for(i=0;i<this.renders.length;i++)
		this.renders[i].insert(n, node);

	if (node == undefined) {
		n.right = this.head;
		this.head = n;
	} else {
		n.right = node.right;
		node.right = n;
	}

	this.length += 1;
}

LinkedList.prototype.insertAt = function(data, i) {
	if (i==0)
		this.insert(data);
	else if(i>0 && i<=this.length)
		this.insert(data, this.find(i-1));
}

LinkedList.prototype.remove = function(node) {
	if(node.__proto__ != Node.prototype)
		return;

	for(i=0;i<this.renders.length;i++)
		this.renders[i].remove(node);

	if (node==this.head)
		this.head = node.right;
	else {
		var prev = this.head;
		var found = false;

		for(var i = 0; i<this.length; i++) {
			if (prev.right == node) {
				found = true;
				break;
			}
			prev = prev.right;
		}

		if(found)
			prev.right = node.right;
	}

	this.length -= 1;
}

LinkedList.prototype.removeAt = function(i) {
	if (i==0) {
		for(i=0;i<this.renders.length;i++)
			this.renders[i].remove(this.head);

		this.head = this.head.right;
	}
	else {
		var prev = this.find(i-1);

		for(i=0;i<this.renders.length;i++)
			this.renders[i].remove(prev.right);

		prev.right = prev.right.right;
	}

	this.length -= 1;
}


function BinarySearchTree(data) {
	this.root = new Node(data);
	this.renders = [];
}

BinarySearchTree.prototype.insert = function(data) {
	data = parse(data);
	var root = this.root;

	while(true) {
		if(data == root.data)
			break;
		if(data < root.data) {
			if(root.left == undefined) {
				root.left = new Node(data);
				root.left.parent = root;
				break;
			} else {
				root = root.left;
			}
		} else {
			if(root.right == undefined) {
				root.right = new Node(data);
				root.right.parent = root;
				break;
			} else {
				root = root.right;
			}
		}
	}
}

BinarySearchTree.prototype.search = function(data) {
	var root = this.root;
	while(true) {
		if(data == root.data)
			return root;
		if(data < root.data) {
			if(root.left == undefined) {
				return;
			} else {
				root = root.left;
			}
		} else {
			if(root.right == undefined) {
				return;
			} else {
				root = root.right;
			}
		}
	}
}

BinarySearchTree.prototype.remove = function(data) {
	var node = this.search(data);
	var min = undefined;

	function f(node) {
		//Find min of subtree which has node as root
		if (node.left != undefined)
			f(node.left);
		
		if(min.data > node.data)
			min = node;

		if (node.right != undefined)
			f(node.right);
	}
	
	function del(node) {
		var hasLeft = node.left != undefined;
		var hasRight = node.right != undefined;

		if(hasLeft && hasRight) {
			f(node.right);
			node.data = min.data;
			del(min);
		} else if (hasLeft) {
			node.data = node.left.data;
			del(node.left);
		} else if (hasRight) {
			node.data = node.right.data;
			del(node.right);
		} else {
			if(node.parent.data < node.data)
				node.parent.right = undefined;
			else
				node.parent.left = undefined;
		}
	}

	del(node);
}


BinarySearchTree.prototype.toArray = function() {
	var a = [];
	function f(root) {
		if (root.left != undefined)
			f(root.left);
		a.push(root.data);
		if (root.right != undefined)
			f(root.right);
	}

	f(this.root);

	return a;
}

BinarySearchTree.prototype.toString = function() {
	return this.toArray().toString();
}


function createContent(arg) {
	var e = document.createElement("div");
	e.className = "content";
	e.innerText = arg;

	return e;
}

function DequeRender(deque, box) {
	//For queue, stack, and deque
	this.container = document.createElement("div");
	this.container.className = deque.name;

	document.body.appendChild(this.container);

	deque.renders.push(this);

	for (var i=0; i < deque.length; i++)
		this.push(1, deque[i]);
}

DequeRender.prototype.push = function (i, arg) {
	var e = createContent(arg);

	if(i==0) {
		this.container.insertBefore(e, this.container.firstChild);
		e.style.animation = 'pushLeft 1s 1';
	}
	else {
		this.container.appendChild(e);
		e.style.animation = 'pushRight 1s 1';
	}
}

DequeRender.prototype.pop = function (i) {
	//TODO: Play pop animation
	var e;
	var c = this.container;

	if(i==0) {
		e = this.container.firstChild;
		var left = e.offsetLeft; 
		e.style.position = 'absolute';
		e.style.left = left-100+'px';
		e.style.opacity = '0';
	} else {
		e = this.container.lastChild;
		var left = e.offsetLeft;
		e.style.position = 'absolute';
		e.style.left = left+100+'px';
		e.style.opacity = '0';
	}

	this.container.removeChild(e);
}

function LinkedListRender(list, box) {
	this.container = document.createElement("div");
	this.container.className = "linkedlist";
	this.length = 0;
	this.elements = [];

	document.body.appendChild(this.container);

	list.renders.push(this);

	if(list.head != undefined) {
		n1 = list.head;
		n2 = undefined;

		for(i=0;i<list.length;i++) {
			this.insert(n1, n2);
			n2 = n1;
			n1 = n1.right;
		}
	}
	
}

LinkedListRender.prototype.insert = function(n1, n2) {
	var e = createContent(n1.data);

	var arrow = document.createElement("div");
	arrow.innerText = '->';
	arrow.className = "arrow";

	arrow.style.animation = 'pushTop 1s 1';
	e.style.animation = 'pushTop 1s 1';
	
	if(n2 == undefined) {
		if (this.length > 0)
			this.container.insertBefore(arrow, this.container.firstChild);
		e = this.container.insertBefore(e, this.container.firstChild);
		this.elements.unshift(n1);
	}
	else {
		var i = this.elements.indexOf(n2)+1;

		if(i == this.elements.length) {
			this.container.appendChild(arrow);
			e = this.container.appendChild(e);
		}
		else {
			this.container.insertBefore(arrow, this.container.children[2*i]);
			e = this.container.insertBefore(e, this.container.children[2*i]);
		}

		this.elements.splice(i, 0, n1);
	}
	
	this.length += 1;
}

LinkedListRender.prototype.remove = function(n) {
	var i = this.elements.indexOf(n);
	if (i==0) {
		if (this.length > 1)
			this.container.children[1].remove();
		this.container.children[0].remove();
	} else {
		this.container.children[2*i].remove();
		this.container.children[2*i-1].remove();
	}
	this.elements.splice(i, 1);
	this.length -= 1;
}


function BinaryTreeRender(tree, box) {
	this.container = document.createElement("div");
	this.container.className = "binarytree";
	this.length = 0;

	//if (box == undefined)
		box = document.body;
	box.appendChild(this.container);

	tree.renders.push(this);

	var f = function(node, parent, isLeft) {
		this.insert(node, parent, isLeft);

		if(node.left != undefined)
			f(node.left, node, true);
		if(node.right != undefined)
			f(node.right, node, false);
	}

	f(tree.root);
}

BinaryTreeRender.prototype.insert = function(node, parent, isLeft) {
	if(parent == undefined) {

	}
}