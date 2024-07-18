import * as THREE from 'three';
import * as CANNON from 'cannon';
import * as v from '/src/VARIABLES.js'
import {Entity, Character, Platform, Lava, Enemy} from '/src/Entities.js'
import {world, scene, entities_list, objects_list, platforms_list, characters_list, enemies_list} from '/src/game.js';

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
        const frameNumber = String(i).padStart(3, '0'); // Formatta il numero con leading zeroes
        sprites.push(`enemy_sprites/frame_${frameNumber}_delay-0.05s.png`);
    }

    return sprites


}

export function death()
{
    window.location.href = "/loser";
}

export function win()
{
    window.location.href = "/winner";
}