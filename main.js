import * as THREE from 'three';
import * as v from './VARIABLES.js'
import {Entity, MainCharacter, Platform} from './Entities.js'

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2()
document.addEventListener('mousemove', onDocumentMouseMove, false);


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const geometry2 = new THREE.BoxGeometry( 1, 1, 1 );
const material2 = new THREE.MeshBasicMaterial( { color: 0xffc0cb } );
const cube2 = new THREE.Mesh( geometry2, material2 );
cube2.position.add( new THREE.Vector3(3,-6,0))
scene.add( cube2 );

var characters_list = []
var entities_list = []
var objects_list = []

var platform = new Platform(scene)
entities_list.push(platform)
objects_list.push(platform)

camera.position.z = 5;

var main_character = new MainCharacter(scene)
entities_list.push(main_character)
characters_list.push(main_character)

var maxSpeed = 0.45;

const pressedKeys = {};
var lastPressedUpDown = 0;
var lastPressedRightLeft = 0;

window.addEventListener('keydown', function(event) {
	if (event.key == v.UP || event.key == v.DOWN || event.key == v.LEFT || event.key == v.RIGHT || event.key == v.SPACE){
		pressedKeys[event.key] = true;
		if(event.key == v.UP)
		{
			lastPressedUpDown = 0;
		}
		else if (event.key == v.DOWN)
		{
			lastPressedUpDown = 1;
		}
	else if (event.key == v.LEFT)
		{
			lastPressedRightLeft = 0;
		}
	else if (event.key == v.RIGHT)
		{
			lastPressedRightLeft = 1;
		}
		else if (event.key == v.SPACE)
			{
				console.log(main_character.bboxes[0])
				console.log(platform.bboxes[0])
				if(main_character.bboxes[0].intersectsBox(platform.bboxes[0]))
				{
					console.log("JUMP")
				}
			}
	}
});

// Aggiungi listener per l'evento 'keyup'
window.addEventListener('keyup', function(event) {
    if (event.key == v.UP || event.key == v.DOWN || event.key == v.LEFT || event.key == v.RIGHT || event.key == v.SPACE){
		pressedKeys[event.key] = false;
		if(event.key == v.UP)
			{
				lastPressedUpDown = 1;
			}
			else if (event.key == v.DOWN)
			{
				lastPressedUpDown = 0;
			}
		else if (event.key == v.LEFT)
			{
				lastPressedRightLeft = 1;
			}
		else if (event.key == v.RIGHT)
			{
				lastPressedRightLeft = 0;
			}
			else if (event.key == v.SPACE)
				{

				}
	}
});

function checkCollisions()
{
	if (cube.intersectBox())
	{
		console.log("nooooooooooo")
	}
}

function character_dir() {
	var angle = 0;
	var counter = 0;
	var x = 0;
	var z = 0;
    if (!Object.values(pressedKeys).every(key => key === false)) {
		if(pressedKeys[v.UP] && lastPressedUpDown == 0) 
			{
				counter += 1;
				angle += 90;
			}
		else if(pressedKeys[v.DOWN] && lastPressedUpDown == 1) 
			{
				counter += 1;
				angle += 270;
			}
		if(pressedKeys[v.RIGHT] && lastPressedRightLeft == 1) 
			{	
				counter += 1;
				angle += 0;
			}
		else if(pressedKeys[v.LEFT] && lastPressedRightLeft == 0) 
			{
				counter += 1;
				angle += 180;
			}

		if (counter == 2)
		{	
			angle = (angle/2)%360;
			if(pressedKeys[v.RIGHT] && lastPressedRightLeft == 1 && pressedKeys[v.DOWN] && lastPressedUpDown == 1) 
				{
					angle = 315;
			}
		}
		angle = (angle*Math.PI)/180
		x = Math.cos(angle);
		z = Math.sin(angle);
    } 
	return [x, z]
}

function onDocumentMouseMove(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function character_speed(xdir, zdir)
{
	 var xspeed = maxSpeed*xdir;
	 var zspeed = maxSpeed*zdir;
	 return [xspeed, zspeed]
}

function character_move(xspeed, zspeed, angle)
{
	return new THREE.Vector3(xspeed*Math.cos(angle) - zspeed*Math.sin(angle),0,-zspeed*Math.cos(angle) - xspeed*Math.sin(angle))
}


function animate() {

	var [x, z] = character_dir();
	var [xspeed,zspeed] = character_speed(x, z)

	var character_angulation = -mouse.x*Math.PI
	main_character.change_orientation(new THREE.Euler(0,character_angulation,0));
  	//cube.rotation.y = mouse.y*Math.PI;

	//checkCollisions()


	cube2.rotation.x += 0.01;
	cube2.rotation.y += 0.01;
	cube2.position.add( new THREE.Vector3(0,0,0))

	//cube.position.add(character_move(xspeed, zspeed, character_angulation))
	main_character.add_position(character_move(xspeed, zspeed, character_angulation))

	camera.position.x = main_character.position.x + Math.sin(main_character.orientation.y)*15;
	camera.position.y = main_character.position.y + 3;
	camera.position.z = main_character.position.z + Math.cos(main_character.orientation.y)*15;
	camera.rotation.copy(main_character.orientation)

	renderer.render( scene, camera );

}