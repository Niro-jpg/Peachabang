import * as THREE from 'three';
import * as CANNON from 'cannon';
import * as v from '/src/VARIABLES.js'
import {Entity, Character, Platform, Lava, Enemy, Boss, Ghost} from '/src/Entities.js'
//import {add_platform , add_character, add_lava, add_spooky, add_enemy, load_music, sprites_lists, get_enemy_sprites, death, win} from '/src/world_functions.js'


var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2()
var center = new THREE.Vector2()
document.addEventListener('mousemove', onDocumentMouseMove, false);
var dead = false


export var characters_list = []
export var entities_list = []
export var objects_list = []
export var platforms_list = []
export var enemies_list = []
export var fires_list = []


export const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var audio_loader = load_music(camera)

const listener = new THREE.AudioListener();
camera.add(listener);

const sound = new THREE.Audio(listener);

const audioLoader = new THREE.AudioLoader();
audioLoader.load('/sounds/shot.ogg', function(buffer) {
  sound.setBuffer(buffer);
  sound.setLoop(false);
  sound.setVolume(1);
});

export const world = new CANNON.World();
world.gravity.set(0, -200, 0);


const ambientLight = new THREE.AmbientLight(0xffffff, 0); // Colore bianco, intensità 0.5
scene.add(ambientLight);

const dl = new THREE.DirectionalLight('white', 0.02);
dl.position.set(1, 9, 2);
dl.castShadow = true;
scene.add(dl);

var main_character= add_character(new CANNON.Vec3(0,4,190))
//enemies_list.push(add_enemy(new CANNON.Vec3(-2,10,-2)))
//enemies_list.push(add_enemy(new CANNON.Vec3(0,10,-150)))
//enemies_list.push(add_enemy(new CANNON.Vec3(-6,5,80)))

//enemies_list.push(add_enemy(new CANNON.Vec3(-40,5,46)))
//enemies_list.push(add_enemy(new CANNON.Vec3(-40,5,49)))
//enemies_list.push(add_enemy(new CANNON.Vec3(40,10,-20)))
//enemies_list.push(add_enemy(new CANNON.Vec3(40,10,0)))
//enemies_list.push(add_enemy(new CANNON.Vec3(0,8,83)))
//enemies_list.push(add_enemy(new CANNON.Vec3(33,5,130)))
enemies_list.push(add_enemy(new CANNON.Vec3(-40,5,-186)))
enemies_list.push(add_enemy(new CANNON.Vec3(37,5,-180)))
enemies_list.push(add_ghost(new CANNON.Vec3(7,8,-15)))

//corridoio iniziale
create_cone(0,0,140,40,30,120, [true,false,true,false])

load_fire(new THREE.Vector3(0,5,0))
load_fire(new THREE.Vector3(10,5,180))
load_fire(new THREE.Vector3(-10,5,180))
load_fire(new THREE.Vector3(10,5,140))
load_fire(new THREE.Vector3(-10,5,140))
load_fire(new THREE.Vector3(10,5,100))
load_fire(new THREE.Vector3(-10,5,100))

enemies_list.push(add_enemy(new CANNON.Vec3(0,5,110)))

//stanza iniziale
create_cone(0,0,10,80,30,140, [true,false,false,false])

create_door(0,0,10,80,30,140,20,20, 2)
create_door(0,0,10,80,30,140,20,20, 1)
create_door(0,0,10,80,30,140,20,20, 3)

load_fire(new THREE.Vector3(30,5,1-40))
load_fire(new THREE.Vector3(-30,5,-40))
load_fire(new THREE.Vector3(30,5,60))
load_fire(new THREE.Vector3(-30,5,60))
load_fire(new THREE.Vector3(-30,5,60))

enemies_list.push(add_enemy(new CANNON.Vec3(25,5,40)))
enemies_list.push(add_enemy(new CANNON.Vec3(-10,5,30)))
enemies_list.push(add_enemy(new CANNON.Vec3(0,5,30)))
enemies_list.push(add_enemy(new CANNON.Vec3(0,5,10)))

//secondo tunnel
create_cone(60,0,10,40,20,40, [false,true,false,true])
create_cone(100,3,9,40,20,40, [false,true,false,true])
create_cone(140,6,8,40,20,40, [false,false,true,true])

enemies_list.push(add_enemy(new CANNON.Vec3(60,5,10)))
enemies_list.push(add_enemy(new CANNON.Vec3(140,15,8)))

load_fire(new THREE.Vector3(100,9,9))

//terrazza dopo tunnel
add_platform(new THREE.Vector3(80,9,80), new THREE.Vector3(140,6,-50))
enemies_list.push(add_enemy(new CANNON.Vec3(140,14,-50)))

load_fire(new THREE.Vector3(140,26,-50))

//platform dopo tunnel
add_platform(new THREE.Vector3(40,30,40), new THREE.Vector3(180,0,-120))
add_platform(new THREE.Vector3(40,40,40), new THREE.Vector3(150,0,-160))
add_platform(new THREE.Vector3(40,50,40), new THREE.Vector3(120,0,-110))
add_platform(new THREE.Vector3(40,60,40), new THREE.Vector3(80,0,-160))

enemies_list.push(add_enemy(new CANNON.Vec3(150,30,-160)))
enemies_list.push(add_enemy(new CANNON.Vec3(80,30,-160)))

load_fire(new THREE.Vector3(140,36,-110))
load_fire(new THREE.Vector3(100,40,-130))

enemies_list.push(add_ghost(new CANNON.Vec3(190,25,-120)))
enemies_list.push(add_ghost(new CANNON.Vec3(120,30,-110)))
enemies_list.push(add_ghost(new CANNON.Vec3(70,40,-150)))

//piattaforma finale
add_platform(new THREE.Vector3(100,10,100), new THREE.Vector3(0,30,-120))

var boss = new Boss(new CANNON.Vec3(0,35,-120))
enemies_list.push(boss)

add_platform(new THREE.Vector3(1,200,400), new THREE.Vector3(200,0,0))
add_platform(new THREE.Vector3(1,200,400), new THREE.Vector3(-200,0,0))
add_platform(new THREE.Vector3(400,200,1), new THREE.Vector3(0,0,200))
add_platform(new THREE.Vector3(400,200,1), new THREE.Vector3(0,0,-200))
add_platform(new THREE.Vector3(400,1,400), new THREE.Vector3(0,100,0))
var lava = add_lava( new THREE.Vector3(0,-5,0))


var [front_sprites, right_sprites, left_sprites] = sprites_lists()
var enemy_sprites = get_enemy_sprites()
var fire_sprites = get_fire_sprites()
var boss_sprites = get_boss_sprites()
var dead_sprites = get_dead_sprites()
var ghost_sprites = get_ghost_sprites()

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
	  sound.play();
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
let sprites_fire_counter = 0
let sprites_boss_counter = 0
let sprites_dead_counter = 0
let sprites_ghost_counter = 0

renderer.setAnimationLoop( animate );

function box_intersect(sphere, cube){

	cube.geometry.computeBoundingBox();
	const boundingBox = cube.geometry.boundingBox;

	// Ottieni i vertici inferiori e superiori
	const cubeMin = boundingBox.min; // Vertice inferiore sinistro
	const cubeMax = boundingBox.max; // Vertice superiore destro

	console.log(cubeMin, cubeMax)

}

function animate() {
	if (enemies_list.length <= 2)
	{

		//win()
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

	if(!dead)main_character.move_character(character_move(xspeed, zspeed, character_angulation))

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
						} else
						{
							if(objects_list[i].tag == 'character')
								{
									for (let j = 0; j < objects_list.length; j++)
									{
										if (objects_list[j].tag == 'character')
										{
											continue
										}
										if (remove_list.includes(j))
										{
											continue
										}
										if(objects_list[i].position.distanceTo(objects_list[j].position) < 1)
										{
											let power = 2
											objects_list[j].direction = new THREE.Vector3(objects_list[j].direction.x + objects_list[i].direction.x*power, objects_list[j].direction.y + objects_list[i].direction.y*power, objects_list[j].direction.z + objects_list[i].direction.z*power).normalize().multiplyScalar(3) 
											objects_list[j].direction + objects_list[i].direction
											remove_list.push(i)
											objects_list[i].destroy()
											console.log("touched")
											break
										}
											
									}
								}

						}
						
	}

	for (let i = 0; i < remove_list.length; i++) {
		objects_list.splice(remove_list[i]-i, 1);
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
			sprites_boss_counter = (sprites_boss_counter + 1)%6
			if (enemy == boss)
			{
				var textureLoader = new THREE.TextureLoader();
				var texture = textureLoader.load(boss_sprites[sprites_boss_counter]);
				enemy.meshes[1].material.map = texture
				enemy.meshes[1].material.needsUpdate = true;
				continue
			}
			sprites_ghost_counter = (sprites_ghost_counter + 1)%8
			if (enemy.constructor.name == "Ghost")
			{
				var textureLoader = new THREE.TextureLoader();
				var texture = textureLoader.load(ghost_sprites[sprites_ghost_counter]);
				enemy.meshes[1].material.map = texture
				enemy.meshes[1].material.needsUpdate = true;
				continue
			}
			sprites_enemy_counter = (sprites_enemy_counter + 1)%135
			var textureLoader = new THREE.TextureLoader();
        	var texture = textureLoader.load(enemy_sprites[sprites_enemy_counter]);
			enemy.meshes[1].material.map = texture
			enemy.meshes[1].material.needsUpdate = true;
		}

		sprites_fire_counter = (sprites_fire_counter + 1)%4
		for (var fire of fires_list)
		{
			var textureLoader = new THREE.TextureLoader();
			var texture = textureLoader.load(fire_sprites[sprites_fire_counter]);
			fire.material.map = texture
			fire.material.needsUpdate = true;
		}

		sprites_counter = (sprites_counter + 1)%sprites_max_counter
		sprites_timer = sprites_timer%max_sprites_timer

		
		if (pressedKeys[v.UP] || pressedKeys[v.DOWN] || pressedKeys[v.RIGHT] || pressedKeys[v.LEFT]  || dead) {
			nothing_timer = 0;
			if (dead)
				{
					sprites_dead_counter = (sprites_dead_counter + 1)
					var textureLoader = new THREE.TextureLoader();
					var texture = textureLoader.load(dead_sprites[sprites_dead_counter]);
					main_character.meshes[1].material.map = texture
					main_character.meshes[1].material.needsUpdate = true;
					if (sprites_dead_counter>8)
					{
						window.location.href = "/loser";
					}
			
				}else if(pressedKeys[v.RIGHT] && lastPressedRightLeft == 1) 
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



































export function add_platform (shape, position)
{
    var platform = new Platform(shape, position)
    entities_list.push(platform)
    platforms_list.push(platform)
    return platform
}

export function add_lava (position)
{
    var platform = new Lava(position)
    entities_list.push(platform)
    platforms_list.push(platform)
    return platform
}

export function add_character(position)
{
    var character = new Character(position)
    entities_list.push(character)
    characters_list.push(character)
    return character
}

export function add_enemy(position)
{
    var character = new Enemy(position)
    entities_list.push(character)
    characters_list.push(character)
    return character
}

export function add_ghost(position)
{
    var character = new Ghost(position)
    entities_list.push(character)
    characters_list.push(character)
    return character
}


export function add_spooky(position)
{
    // Crea una luce puntiforme posizionata nella stessa posizione del cubo
    var pointLight = new THREE.PointLight('orange', 100, 1000);
    pointLight.position.set(position.x,position.y,position.z);
    pointLight.castShadow = true;
    scene.add(pointLight);
}

export function load_music(camera)
{
    // Caricamento e riproduzione dell'audio
    let listener = new THREE.AudioListener();
    camera.add(listener);

    let sound = new THREE.Audio(listener);
    let audioLoader = new THREE.AudioLoader();

    return audioLoader.load('sounds/bloody_tears.mp3', function(buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(true); // Se vuoi che la musica si ripeta
        sound.setVolume(0.5); // Imposta il volume
        sound.play();
    });

}

export function sprites_lists()
{
    var front_sprites = []
    front_sprites.push('main_character_sprites/front/tile012.png')
    front_sprites.push('main_character_sprites/front/tile013.png')
    front_sprites.push('main_character_sprites/front/tile014.png')
    front_sprites.push('main_character_sprites/front/tile015.png')
    front_sprites.push('main_character_sprites/front/tile016.png')
    front_sprites.push('main_character_sprites/front/tile017.png')
    front_sprites.push('main_character_sprites/front/tile018.png')
    front_sprites.push('main_character_sprites/front/tile019.png')

    var right_sprites = []
    right_sprites.push('main_character_sprites/right/tile020.png')
    right_sprites.push('main_character_sprites/right/tile021.png')
    right_sprites.push('main_character_sprites/right/tile022.png')
    right_sprites.push('main_character_sprites/right/tile023.png')
    right_sprites.push('main_character_sprites/right/tile024.png')
    right_sprites.push('main_character_sprites/right/tile025.png')
    right_sprites.push('main_character_sprites/right/tile026.png')
    right_sprites.push('main_character_sprites/right/tile027.png')

    var left_sprites = []

    left_sprites.push('main_character_sprites/left/tile028.png')
    left_sprites.push('main_character_sprites/left/tile029.png')
    left_sprites.push('main_character_sprites/left/tile030.png')
    left_sprites.push('main_character_sprites/left/tile031.png')
    left_sprites.push('main_character_sprites/left/tile032.png')
    left_sprites.push('main_character_sprites/left/tile033.png')
    left_sprites.push('main_character_sprites/left/tile034.png')
    left_sprites.push('main_character_sprites/left/tile035.png')

    return [front_sprites, right_sprites, left_sprites]


}

export function get_enemy_sprites()
{
    var sprites = []
    sprites.push('enemy_sprites/frame_000_delay-0.05s.png')
    
    for (let i = 0; i <= 134; i++) {
        const frameNumber = String(i).padStart(3, '0');
        sprites.push(`enemy_sprites/frame_${frameNumber}_delay-0.05s.png`);
    }

    return sprites


}

export function get_fire_sprites()
{
    var sprites = []
    sprites.push('sprites/fire_sprites/fare1.png')
    
    for (let i = 2; i <= 4; i++) {
        const frameNumber = String(i);
        sprites.push(`sprites/fire_sprites/fare${frameNumber}.png`);
    }

    return sprites


}

export function get_boss_sprites()
{
    var sprites = []
    sprites.push('sprites/boss_sprites/demon_idle_1.png')
    
    for (let i = 2; i <= 6; i++) {
        const frameNumber = String(i); // Formatta il numero con leading zeroes
        sprites.push(`sprites/boss_sprites/demon_idle_${frameNumber}.png`);
    }

    return sprites


}

export function get_ghost_sprites()
{
    var sprites = []
    sprites.push('sprites/ghost_sprites/ghost1.png')
    
    for (let i = 2; i <= 8; i++) {
        const frameNumber = String(i); // Formatta il numero con leading zeroes
        sprites.push(`sprites/ghost_sprites/ghost${frameNumber}.png`);
    }
    return sprites


}

export function get_dead_sprites()
{
    var sprites = []
    sprites.push('sprites/dead_sprites/dead1.png')
    
    for (let i = 2; i <= 8; i++) {
        const frameNumber = String(i); // Formatta il numero con leading zeroes
        sprites.push(`sprites/dead_sprites/dead${frameNumber}.png`);

    }
    return sprites


}

export function death()
{
    dead = true
}

export function win()
{
    window.location.href = "/winner";
}

export function create_cone(positionx,positionz,positiony,dimensionx,dimensionz,dimensiony, direction)
{
    //corridoio iniziale
	//base
	add_platform(new THREE.Vector3(dimensionx,5,dimensiony), new THREE.Vector3(positionx,positionz,positiony))
	//tetto
	add_platform(new THREE.Vector3(dimensionx,5,dimensiony), new THREE.Vector3(positionx,positionz + dimensionz, positiony))
	//muri
	if (direction[0])
	{
		add_platform(new THREE.Vector3(2,dimensionz,dimensiony), new THREE.Vector3(positionx - (dimensionx/2),positionz + (dimensionz/2),positiony))
	}
	if (direction[1])
	{
		add_platform(new THREE.Vector3(dimensionx,dimensionz,2), new THREE.Vector3(positionx ,positionz + (dimensionz/2), positiony - (dimensiony/2)))
	}
	if (direction[2])
	{
		add_platform(new THREE.Vector3(2,dimensionz,dimensiony), new THREE.Vector3(positionx + (dimensionx/2),positionz + (dimensionz/2),positiony))
	} 
	if (direction[3])
	{
		add_platform(new THREE.Vector3(dimensionx,dimensionz,2), new THREE.Vector3(positionx ,positionz + (dimensionz/2), positiony + (dimensiony/2)))
	} 
	


}

export function create_door(positionx,positionz,positiony,dimensionx,dimensionz,dimensiony, doorx, doorz, direction)
{
    //corridoio iniziale
	//base
	if (direction == 0)
	{
		add_platform(new THREE.Vector3(2,dimensionz,(dimensiony - doorx)/2), new THREE.Vector3(positionx - (dimensionx/2),positionz + (dimensionz/2),positiony - (doorx)/2 - (dimensiony - doorx)/4))
		add_platform(new THREE.Vector3(2,dimensionz,(dimensiony - doorx)/2), new THREE.Vector3(positionx - (dimensionx/2),positionz + (dimensionz/2),positiony + (doorx)/2 + (dimensiony - doorx)/4))
		add_platform(new THREE.Vector3(2,dimensionz - doorz,doorx), new THREE.Vector3(positionx - (dimensionx/2),positionz + dimensionz - (dimensionz - doorz)/2,positiony))
	} else if (direction == 1)
	{

		add_platform(new THREE.Vector3((dimensionx - doorx)/2,dimensionz,2), new THREE.Vector3(positionx - (doorx)/2 - (dimensionx - doorx)/4,positionz + (dimensionz/2),positiony - (dimensiony/2)))
		add_platform(new THREE.Vector3((dimensionx - doorx)/2,dimensionz,2), new THREE.Vector3(positionx + (doorx)/2 + (dimensionx - doorx)/4,positionz + (dimensionz/2),positiony - (dimensiony/2)))
		add_platform(new THREE.Vector3(doorx,dimensionz - doorz,2), new THREE.Vector3(positionx ,positionz + dimensionz - (dimensionz - doorz)/2, positiony - (dimensiony/2)))

	} else if (direction == 2)
	{
		add_platform(new THREE.Vector3(2,dimensionz,(dimensiony - doorx)/2), new THREE.Vector3(positionx + (dimensionx/2),positionz + (dimensionz/2),positiony - (doorx)/2 - (dimensiony - doorx)/4))
		add_platform(new THREE.Vector3(2,dimensionz,(dimensiony - doorx)/2), new THREE.Vector3(positionx + (dimensionx/2),positionz + (dimensionz/2),positiony + (doorx)/2 + (dimensiony - doorx)/4))
		add_platform(new THREE.Vector3(2,dimensionz - doorz,doorx), new THREE.Vector3(positionx + (dimensionx/2),positionz + dimensionz - (dimensionz - doorz)/2,positiony))
			
	} else if (direction == 3)
	{
		add_platform(new THREE.Vector3((dimensionx - doorx)/2,dimensionz,2), new THREE.Vector3(positionx - (doorx)/2 - (dimensionx - doorx)/4,positionz + (dimensionz/2),positiony + (dimensiony/2)))
		add_platform(new THREE.Vector3((dimensionx - doorx)/2,dimensionz,2), new THREE.Vector3(positionx + (doorx)/2 + (dimensionx - doorx)/4,positionz + (dimensionz/2),positiony + (dimensiony/2)))
		add_platform(new THREE.Vector3(doorx,dimensionz - doorz,2), new THREE.Vector3(positionx ,positionz + dimensionz - (dimensionz - doorz)/2, positiony + (dimensiony/2)))
		
	}

}

function load_fire(position)
{

	var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('sprites/fire_sprites/fare1.png');
    var sprite_material = new THREE.SpriteMaterial({ map: texture });
    var sprite = new THREE.Sprite(sprite_material );
    sprite.position.copy(position)
    sprite.scale.set(5, 5, 2);
	scene.add(sprite)
	fires_list.push(sprite)
	add_spooky(position)
}

function load_fires()
{


	return
	

	
}