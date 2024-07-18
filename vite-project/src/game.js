import * as THREE from 'three';
import * as CANNON from 'cannon';
import * as v from '/src/VARIABLES.js'
import {Entity, Character, Platform} from '/src/Entities.js'
import {add_platform , add_character, add_lava, add_spooky, add_enemy, load_music, sprites_lists, get_enemy_sprites, death, win} from '/src/world_functions.js'

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2()
var center = new THREE.Vector2()
document.addEventListener('mousemove', onDocumentMouseMove, false);




export var characters_list = []
export var entities_list = []
export var objects_list = []
export var platforms_list = []
export var enemies_list = []


export const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var audio_loader = load_music(camera)

export const world = new CANNON.World();
world.gravity.set(0, -200, 0);


const ambientLight = new THREE.AmbientLight(0xffffff, 0); // Colore bianco, intensità 0.5
scene.add(ambientLight);

add_spooky(new THREE.Vector3(0,20,0))
add_spooky(new THREE.Vector3(0,20,80))
add_spooky(new THREE.Vector3(35,20,0))
add_spooky(new THREE.Vector3(40,20,0))
add_spooky(new THREE.Vector3(0,20,-65))
add_spooky(new THREE.Vector3(15,20,-145))
add_spooky(new THREE.Vector3(-15,20,-165))

const dl = new THREE.DirectionalLight('white', 0.2);
dl.position.set(1, 9, 2);
dl.castShadow = true;
const dlHelper = new THREE.DirectionalLightHelper(dl, 3);
scene.add(dl);

var main_character= add_character(new CANNON.Vec3(-30,4,120))
enemies_list.push(add_enemy(new CANNON.Vec3(-2,10,-2)))
enemies_list.push(add_enemy(new CANNON.Vec3(0,10,-150)))
enemies_list.push(add_enemy(new CANNON.Vec3(-6,5,80)))

enemies_list.push(add_enemy(new CANNON.Vec3(-40,5,46)))
enemies_list.push(add_enemy(new CANNON.Vec3(-40,5,49)))
enemies_list.push(add_enemy(new CANNON.Vec3(40,10,-20)))
enemies_list.push(add_enemy(new CANNON.Vec3(40,10,0)))
enemies_list.push(add_enemy(new CANNON.Vec3(0,8,83)))
enemies_list.push(add_enemy(new CANNON.Vec3(33,5,130)))
enemies_list.push(add_enemy(new CANNON.Vec3(-40,5,-186)))
enemies_list.push(add_enemy(new CANNON.Vec3(7,5,-200)))
enemies_list.push(add_enemy(new CANNON.Vec3(37,5,-180)))

add_platform(new THREE.Vector3(30,10,30), new THREE.Vector3(0,0,0))
add_platform(new THREE.Vector3(30,10,30), new THREE.Vector3(35,0,0))
add_platform(new THREE.Vector3(5,15,50), new THREE.Vector3(40,0,0))

add_platform(new THREE.Vector3(100,5,100), new THREE.Vector3(0,0,-150))
add_platform(new THREE.Vector3(100,5,100), new THREE.Vector3(0,0,80))

add_platform(new THREE.Vector3(10,10,65), new THREE.Vector3(0,0,-55))

add_platform(new THREE.Vector3(30,200,30), new THREE.Vector3(-100,0,-100))
add_platform(new THREE.Vector3(30,200,30), new THREE.Vector3(-30,0,100))
add_platform(new THREE.Vector3(30,200,30), new THREE.Vector3(40,0,70))
add_platform(new THREE.Vector3(20,200,20), new THREE.Vector3(50,0,-80))
add_platform(new THREE.Vector3(20,200,20), new THREE.Vector3(30,0,-150))
add_platform(new THREE.Vector3(20,200,20), new THREE.Vector3(-60,0,-110))
add_platform(new THREE.Vector3(20,200,20), new THREE.Vector3(-60,0,150))
add_platform(new THREE.Vector3(70,200,70), new THREE.Vector3(-90,0,200))


add_platform(new THREE.Vector3(1,200,400), new THREE.Vector3(200,0,0))
add_platform(new THREE.Vector3(1,200,400), new THREE.Vector3(-200,0,0))
add_platform(new THREE.Vector3(400,200,1), new THREE.Vector3(0,0,200))
add_platform(new THREE.Vector3(400,200,1), new THREE.Vector3(0,0,-200))
add_platform(new THREE.Vector3(400,1,400), new THREE.Vector3(0,100,0))
var lava = add_lava( new THREE.Vector3(0,-5,0))

var [front_sprites, right_sprites, left_sprites] = sprites_lists()
var enemy_sprites = get_enemy_sprites()

const pressedKeys = {};
var lastPressedUpDown = 0;
var lastPressedRightLeft = 0;

function onMouseClick(event) {

	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;


	center.x = 0.02
    center.y = 0
	// Impostare il raycaster basato sulla posizione del mouse e della camera
	raycaster.setFromCamera(center, camera);
  
	// Calcolare le intersezioni
	const intersects = raycaster.intersectObjects(scene.children);

	// Se c'è un'intersezione, ottieni le coordinate
	if (intersects.length > 0) {
	  const intersect = intersects[0];
		main_character.shoot(new THREE.Vector3(intersect.point.x - main_character.position.x,intersect.point.y -main_character.position.y, intersect.point.z - main_character.position.z).normalize() )
	}
	else 
	{
		main_character.shoot(new THREE.Vector3(camera.rotation.x- main_character.position.x, camera.rotation.y-main_character.position.y, camera.rotation.z- main_character.position.z).normalize())
		//main_character.shoot(new THREE.Vector3(selected_point.x - main_character.position.x,selected_point.y -main_character.position.y, selected_point.z - main_character.position.z) )
	}
  }
  
  // Aggiungere l'event listener per il click del mouse
  window.addEventListener('click', onMouseClick);

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
				main_character.jump()
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
    if (pressedKeys[v.UP] || pressedKeys[v.DOWN] || pressedKeys[v.RIGHT] || pressedKeys[v.LEFT]) {
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

function rotateVectorY(vector, radians) {

    // Crea una matrice di rotazione attorno all'asse x
    var rotationMatrix = new THREE.Matrix4();
    rotationMatrix.makeRotationY(radians);

    // Applica la matrice di rotazione al vettore
    vector.applyMatrix4(rotationMatrix);
	return vector
}

function rotateVectorX(vector, radians) {

    // Crea una matrice di rotazione attorno all'asse x
    var rotationMatrix = new THREE.Matrix4();
    rotationMatrix.makeRotationX(radians);

    // Applica la matrice di rotazione al vettore
    vector.applyMatrix4(rotationMatrix);
	return vector
}

function character_move(xspeed, zspeed, angle)
{
	return new THREE.Vector3(xspeed*Math.cos(angle) - zspeed*Math.sin(angle),0,-zspeed*Math.cos(angle) - xspeed*Math.sin(angle))
}

const body_geometry = new THREE.SphereGeometry( 1, 32, 10 );
        const body_material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
        const body = new THREE.Mesh( body_geometry, body_material );
        body.position.add( new THREE.Vector3(0,0,0))
        body.castShadow = true;

scene.add(body)


let startTime = new Date();

let currentTime = new Date();

let elapsedTime = 0

let max_sprites_timer = 100
let sprites_timer = max_sprites_timer
let max_nothing_timer = 200
let nothing_timer = max_nothing_timer
let sprites_max_counter = 8
let sprites_counter = 0

let sprites_enemy_counter = 0

renderer.setAnimationLoop( animate );

function animate() {
	if (enemies_list.length <= 2)
	{
		win()
	}

	currentTime = new Date()

	elapsedTime = (currentTime - startTime);
	startTime = currentTime

	var [xspeed,zspeed] = character_dir();

	var character_angulation = -mouse.x*Math.PI
	var y_angulation = mouse.y*(Math.PI/3)
	main_character.change_orientation(new THREE.Euler(0,character_angulation,0, 'XYZ'));
  	//cube.rotation.y = mouse.y*Math.PI;

	//checkCollisions()

	world.step(1 / 60);

	main_character.move_character(character_move(xspeed, zspeed, character_angulation))

	var remove_list = []
	for (let i = 0; i < objects_list.length; i++) 
	{ 
		var next = false; 
		objects_list[i].move()
		objects_list[i].update()
				for(var platform of platforms_list)
        			{
            		if(objects_list[i].bboxes[0].intersectsBox(platform.bboxes[0]) || objects_list[i].position.distanceTo(new THREE.Vector3(0,0,0)) > 300)
                		{

							remove_list.push(i)
							objects_list[i].destroy()
							next = true
							break;
                		}
        			}
					if(next)
					{
						continue
					}
					for(let j = 0; j < enemies_list.length; j++)
						{ 
							if(objects_list[i].position.distanceTo(enemies_list[j].position) < 1)
								{
								remove_list.push(i)
								objects_list[i].destroy()

								var target_enemy = enemies_list[j]
								var index = enemies_list.indexOf(enemies_list[j]);
								enemies_list.splice(index, 1); 
								target_enemy.destroy()
								console.log(index)
								next = true
								break;
								
							}
						}
						if(next)
							{
								continue
							}
						else if(objects_list[i].position.distanceTo(main_character.position) < 1)
							{
							remove_list.push(i)
							objects_list[i].destroy()

							console.log("DEEEEEEEEEEEAAAAAAAAAAAAAAD")
							death()
						}
	}

	for (let index of remove_list) {
		objects_list.splice(index, 1);
	  }

	for (var enemy of enemies_list)
	{
		enemy.move_character()
		if(enemy.position.distanceTo(main_character.position) < 100)
		{
			let enemy_orientation= main_character.position.clone().sub(enemy.position)
			enemy.change_orientation(new THREE.Euler(0,Math.atan2(enemy_orientation.x, enemy_orientation.z),0, 'XYZ'));
			enemy.update()
		}

		enemy.add_charge(elapsedTime)
		enemy.try_to_shoot(main_character)

	}

	for(var character of enemies_list)
		{
			character.update()
			if(character.bboxes[0].intersectsBox(lava.bboxes[0]))
				{
					var index = enemies_list.indexOf(character);
					enemies_list.splice(index, 1); 
					character.destroy()
					console.log("enemy dead :(")
				}
		}
	if(main_character.bboxes[0].intersectsBox(lava.bboxes[0]))
		{
			console.log("me dead :c")
			death()
		}
	

	camera.position.copy(main_character.position.clone().add(rotateVectorY(rotateVectorX(new THREE.Vector3(0,2,9), y_angulation), character_angulation)))

	camera.lookAt(main_character.position.clone().add(new THREE.Vector3(0,2,0)))

	renderer.render( scene, camera );

	sprites_timer += elapsedTime
	if (sprites_timer >= max_sprites_timer)
	{
		for (var enemy of enemies_list)
		{
			sprites_enemy_counter = (sprites_enemy_counter + 1)%135
			var textureLoader = new THREE.TextureLoader();
        	var texture = textureLoader.load(enemy_sprites[sprites_enemy_counter]);
			enemy.meshes[1].material.map = texture
			enemy.meshes[1].material.needsUpdate = true;
		}
		sprites_counter = (sprites_counter + 1)%sprites_max_counter
		sprites_timer = sprites_timer%max_sprites_timer

		if (pressedKeys[v.UP] || pressedKeys[v.DOWN] || pressedKeys[v.RIGHT] || pressedKeys[v.LEFT]) {
			nothing_timer = 0;
			if(pressedKeys[v.RIGHT] && lastPressedRightLeft == 1) 
				{	
					var textureLoader = new THREE.TextureLoader();
        			var texture = textureLoader.load(right_sprites[sprites_counter]);
					main_character.meshes[1].material.map = texture
					main_character.meshes[1].material.needsUpdate = true;
				}
			else if(pressedKeys[v.LEFT] && lastPressedRightLeft == 0) 
				{
					var textureLoader = new THREE.TextureLoader();
        			var texture = textureLoader.load(left_sprites[sprites_counter]);
					main_character.meshes[1].material.map = texture
					main_character.meshes[1].material.needsUpdate = true;
				}
			else
				{
					var textureLoader = new THREE.TextureLoader();
        			var texture = textureLoader.load(front_sprites[sprites_counter]);
					main_character.meshes[1].material.map = texture
					main_character.meshes[1].material.needsUpdate = true;
				}

		} 
	} else
	{
		nothing_timer+= elapsedTime
		if (nothing_timer >= max_nothing_timer)
		{
		var textureLoader = new THREE.TextureLoader();
        var texture = textureLoader.load('main_character_sprites/tile002.png');
		main_character.meshes[1].material.map = texture
		main_character.meshes[1].material.needsUpdate = true;
		}
	}

}


