import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

const geometry2 = new THREE.BoxGeometry( 1, 1, 1 );
const material2 = new THREE.MeshBasicMaterial( { color: 0xffc0cb } );
const cube2 = new THREE.Mesh( geometry2, material2 );
cube2.position.add( new THREE.Vector3(3,0,0))
scene.add( cube2 );

const platform_geometry = new THREE.BoxGeometry( 30, 0.5, 30 );
const platform_material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
const platform = new THREE.Mesh( platform_geometry, platform_material );
platform.position.add( new THREE.Vector3(0, -7,0))
scene.add( platform );

raycaster = new THREE.Raycaster();
mouse = new THREE.Vector2()
document.addEventListener('mousemove', onDocumentMouseMove, false);
window.addEventListener('resize', onWindowResize, false);
document.addEventListener('mousedown', onMouseDown, false);

function onDocumentMouseMove(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

camera.position.z = 5;

function animate() {

	console.log("aosososo")
	console.log("mouse: ", mouse)
	cube.rotation.x = mouse.y*Math.PI;
  	cube.rotation.y = mouse.x*Math.PI;

	cube2.rotation.x += 0.01;
	cube2.rotation.y += 0.01;
	cube2.position.add( new THREE.Vector3(-0.01,0,0))

	renderer.render( scene, camera );

}