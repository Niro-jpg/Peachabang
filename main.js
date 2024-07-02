import * as THREE from 'three';
import * as v from './VARIABLES.js'

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2()
document.addEventListener('mousemove', onDocumentMouseMove, false);


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
cube.position.add( new THREE.Vector3(0,-6,0))
scene.add( cube );

const geometry2 = new THREE.BoxGeometry( 1, 1, 1 );
const material2 = new THREE.MeshBasicMaterial( { color: 0xffc0cb } );
const cube2 = new THREE.Mesh( geometry2, material2 );
cube2.position.add( new THREE.Vector3(3,-6,0))
scene.add( cube2 );

const platform_geometry = new THREE.BoxGeometry( 30, 0.5, 30 );
const platform_material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
const platform = new THREE.Mesh( platform_geometry, platform_material );
platform.position.add( new THREE.Vector3(0, -7,0))
scene.add( platform );

camera.position.z = 5;

var pressed = false;

var xSpeed = 0;
var zSpeed = 0;
var xMaxSpeed = 0.8;
var zMaxSpeed = 0.8;
var xChangeSpeed = 0.6
var zChangeSpeed = 0.6

var xAxcel = 0.3;
var zAxcel = 0.3;
var xDecel = 0.4;
var zDecel = 0.4;
function setupKeyControls() {
	document.onkeyup = function(e) {
		pressed = false;
	  };
	document.onkeydown = function(e) {
		pressed = true;
		if(e.keyCode == v.RIGHT) {		
			xSpeed = Math.min(xSpeed + xAxcel, xMaxSpeed);
			xSpeed = Math.max(xSpeed, xChangeSpeed);
		} else if (e.keyCode== v.LEFT) {
			xSpeed = Math.max(xSpeed - xAxcel, xMaxSpeed*-1);
			xSpeed = Math.min(xSpeed, xChangeSpeed*-1);
		}


		if(e.keyCode == v.DOWN) {
			zSpeed = Math.min(zSpeed + zAxcel, zMaxSpeed);
			zSpeed = Math.max(zSpeed, zChangeSpeed);
		} else if (e.keyCode== v.UP) {
			zSpeed = Math.max(zSpeed - zAxcel, zMaxSpeed*-1);
			zSpeed = Math.min(zSpeed, zChangeSpeed*-1);
		} 
  }
}

function onDocumentMouseMove(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}


function animate() {

	cube.rotation.y = -mouse.x*Math.PI;
  	//cube.rotation.y = mouse.y*Math.PI;


	cube2.rotation.x += 0.01;
	cube2.rotation.y += 0.01;
	cube2.position.add( new THREE.Vector3(-0.01,0,0))
	
	setupKeyControls();
	console.log(pressed)
	if (!pressed) {
		if (zDecel > Math.abs(zSpeed)) {
			zSpeed = 0
		} else {
			zSpeed = Math.sign(zSpeed)*(Math.abs(zSpeed)-zDecel)
		}

		if (xDecel > Math.abs(xSpeed)) {
			xSpeed = 0
		} else {
			xSpeed = Math.sign(xSpeed)*(Math.abs(xSpeed)-xDecel)
		}


	}

	console.log(cube.position)
	console.log(cube.rotation.y)
	//cube.position.add(new THREE.Vector3(zSpeed*Math.cos(cube.rotation.y),0,zSpeed*Math.sin(cube.rotation.y)))
	cube.position.add(new THREE.Vector3(zSpeed*Math.sin(cube.rotation.y) + xSpeed*Math.cos(cube.rotation.y),0,zSpeed*Math.cos(cube.rotation.y) - xSpeed*Math.sin(cube.rotation.y)))

	camera.position.x = cube.position.x + Math.sin(cube.rotation.y)*5;
	camera.position.y = cube.position.y + 2;
	camera.position.z = cube.position.z + Math.cos(cube.rotation.y)*5;
	camera.rotation.copy(cube.rotation)

	renderer.render( scene, camera );

}