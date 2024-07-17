import * as THREE from 'three';
import * as CANNON from 'cannon';
import * as v from './VARIABLES.js'
import {Entity, Character, Platform, Lava, Enemy} from './Entities.js'
import {world, scene, entities_list, objects_list, platforms_list, characters_list, enemies_list} from './main.js';

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


export function add_spooky(position)
{
    // Crea una luce puntiforme posizionata nella stessa posizione del cubo
    var pointLight = new THREE.PointLight('red', 100, 1000);
    pointLight.position.set(position.x,position.y,position.z);
    pointLight.castShadow = true;
    scene.add(pointLight);
    console.log("added spoks")
}