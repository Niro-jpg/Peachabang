import * as THREE from 'three';
import * as CANNON from 'cannon';
import {world, scene, platforms_list, objects_list} from '/src/game.js';

export class Entity {
    constructor(body, position = NaN, orientation = NaN, meshes = [], bboxes_mesh = [], bboxes = []) 
    {
        console.log(position, orientation, meshes, bboxes)

        this.body = body;

        this.position = position;
        this.orientation = orientation;
        this.meshes_original_position = [];
        this.meshes_original_orientation = [];
        this.bboxes_original_position = [];
        this.bboxes_original_orientation = [];
        if (position == NaN)
        {
            this.position = new THREE.Vector3(0,0,0);
        }
        if (orientation == NaN)
            {
                new THREE.Euler(0,0,0);
            }
        this.meshes = [];
        for (var mesh of meshes)
        {
            this.meshes_original_position.push(mesh.position.clone())
            this.meshes_original_orientation.push(mesh.rotation.clone())
            mesh.position.add(this.position)
            this.meshes.push(mesh);
        }

        this.bboxes_mesh = [];
        for (let i = 0; i < bboxes_mesh.length; i++)
            {
                this.bboxes_original_position.push(bboxes_mesh[i].position.clone())
                this.bboxes_original_orientation.push(bboxes_mesh[i].rotation.clone())
                bboxes_mesh[i].position.add(this.position)
                this.bboxes_mesh.push(bboxes_mesh[i]);
                
                
            }

        this.bboxes = [];
        for (let i = 0; i < bboxes.length; i++)
        {
            if (bboxes[i] instanceof THREE.Sphere) {
                bboxes[i].center.set(this.bboxes_mesh[i].position,bboxes[i].radious)
              } else if (bboxes[i] instanceof THREE.Box3) {
                bboxes[i].setFromObject(this.bboxes_mesh[i])
              }
              this.bboxes.push(bboxes[i]);

            
        }

        if (body != 0)
        {
            this.update();
        }


    }

    change_position(position) 
    {
        if (this.body != NaN)
        {
            this.body.position = position
        } else 
        {
            this.position = position;
        }
        this.update();
    }

    add_position(position) 
    {
        if (this.body != NaN)
            {
                this.body.position.x += position.x;
                this.body.position.y += position.y;
                this.body.position.z += position.z;
            } else 
            {
                this.position.add(position);
            }
        this.update();
    }

    change_orientation(orientation)
    {

        if (this.body != 0)
            {

                var quaternion = new THREE.Quaternion();
                quaternion.setFromEuler(orientation);
                this.body.quaternion = new CANNON.Quaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w)

            } else 
            {
                this.orientation = orientation;
            }
        this.update();
        
    }

    add_orientation(orientation)
    {
        if (this.body != NaN)
            {
                this.body.quaternion.add(orientation);
                var quaternion = new THREE.Quaternion();
                quaternion.setFromEuler(orientation);
                this.body.quaternion = new CANNON.Quaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w)
                
            } else 
            {
                this.orientation.add(orientation);
            }
        this.update();

    }

    update()
    {
        if (this.body != 0)
        {
            this.position.copy(this.body.position);

            //var threeQuaternion = new THREE.Quaternion(this.body.quaternion.x, this.body.quaternion.y, this.body.quaternion.z, this.body.quaternion.w);
            var threeQuaternion = new THREE.Quaternion(0, this.body.quaternion.y, 0, this.body.quaternion.w);

            this.orientation = new THREE.Euler().setFromQuaternion(threeQuaternion, 'XZY')

        }

        var angle = this.orientation.y;

        for (let i = 0; i < this.meshes.length; i++) {
            this.meshes[i].rotation.copy(new THREE.Euler(this.orientation.x + this.meshes_original_orientation[i].x,this.orientation.y + this.meshes_original_orientation[i].y,this.orientation.z + this.meshes_original_orientation[i].z))

            this.meshes[i].position.copy(this.position.clone().add(new THREE.Euler(this.meshes_original_position[i].x*Math.cos(angle) - this.meshes_original_position[i].z*Math.sin(angle), this.meshes_original_position[i].y, -this.meshes_original_position[i].z*Math.cos(angle) - this.meshes_original_position[i].x*Math.sin(angle))))

        }
        for (let i = 0; i < this.bboxes_mesh.length; i++) {
            this.bboxes_mesh[i].rotation.copy(new THREE.Euler(this.orientation.x + this.bboxes_original_orientation[i].x,this.orientation.y + this.bboxes_original_orientation[i].y,this.orientation.z + this.bboxes_original_orientation[i].z))

            this.bboxes_mesh[i].position.copy(this.position.clone().add(new THREE.Euler(this.bboxes_original_position[i].x*Math.cos(angle) - this.bboxes_original_position[i].z*Math.sin(angle), this.bboxes_original_position[i].y, -this.bboxes_original_position[i].z*Math.cos(angle) - this.bboxes_original_position[i].x*Math.sin(angle))))
            if (this.bboxes[i] instanceof THREE.Sphere) {
                this.bboxes[i].center.copy(this.bboxes_mesh[i])
              } else if (this.bboxes[i] instanceof THREE.Box3) {
                this.bboxes[i].setFromObject(this.bboxes_mesh[i])
              }
        }

    }

    mesh_relative_position(mesh)
    {
        return mesh.position.clone().sub(this.position);
    }

    destroy()
    {
        for(var bbox of this.bboxes)
        {
        }

        delete this.bboxes

        for(var bbox of this.bboxes_mesh)
            {
                scene.remove(bbox)
            }

        for(var mesh of this.meshes)
            {
                scene.remove(mesh)
            }
        
        delete this.orientation
        delete  this.position

    }
}



export class Character extends Entity {
    constructor(position = new CANNON.Vec3(0,10,0)) {

        var body_geometry = new THREE.SphereGeometry( 1, 32, 10 );
        var body_material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
        var body = new THREE.Mesh( body_geometry, body_material );
        body.position.add( new THREE.Vector3(0,0,0))
        body.visible = false;
        body.castShadow = true;

        var body_base_geometry = new THREE.BoxGeometry( 1 );
        var body_base_material = new THREE.MeshPhongMaterial( { color: 0xff2f3f } );
        var body_base = new THREE.Mesh( body_base_geometry, body_base_material );
        body_base.position.add( new THREE.Vector3(0,-0.75,0))
        body_base.visible = false;

        var bbbase_body = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        bbbase_body.setFromObject(body_base)

        var center = new THREE.Vector3(0, 0, 0);
        var mbbody = new THREE.Sphere(new THREE.Vector3(0, 0, 0),7);
        mbbody.set(center,1)

        var weapon_geometry = new THREE.BoxGeometry( 0.4, 0.4, 0.4);
        var weapon_material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
        var weapon = new THREE.Mesh( weapon_geometry, weapon_material );
        weapon.position.copy( new THREE.Vector3(-1,1,0))
        weapon.castShadow = true;

        var material = new CANNON.Material( {
            friction: 1000.0, 
        })
        const shape = new CANNON.Sphere(1);
        const cbody = new CANNON.Body({
        mass: 1,
        position: position,
        shape: shape,
        material:material
        });



        var textureLoader = new THREE.TextureLoader();
        var texture = textureLoader.load('main_character_sprites/front/tile012.png');
        var sprite_material = new THREE.SpriteMaterial({ map: texture });
        var sprite = new THREE.Sprite(sprite_material );
        sprite.position.copy(new THREE.Vector3(0,0,0))
        sprite.scale.set(2, 2, 2);

      super(cbody, new THREE.Vector3(0, 30,0),new THREE.Euler(0,0,0),[weapon, sprite],[body_base, body],[bbbase_body, mbbody]);
      
      this.speed = 24;
      world.addBody(cbody);
      scene.add( body )
      scene.add( weapon )
      scene.add( body_base)
      scene.add( sprite)

    }
  
    jump() {

        var jumpImpulse = new CANNON.Vec3(0, 60, 0); 

        for(var platform of platforms_list)
        {
            if(this.bboxes[0].intersectsBox(platform.bboxes[0]))
                {

                    this.body.applyImpulse(jumpImpulse, this.body.position);
                }
        }
        
    }

    move_character(move = new THREE.Vector3(0,0,0)) {

        //var moveImpulse = new CANNON.Vec3(move.x*this.speed, move.y, move.z*this.speed); 
        //this.body.position = this.body.position.vadd(moveImpulse)

        var damping = 0.6

        this.body.velocity.set(this.body.velocity.x + move.x*this.speed, this.body.velocity.y, this.body.velocity.z + move.z*this.speed);
        this.body.velocity.x *= damping;
        this.body.velocity.z *= damping;
    }

    shoot(dir)
    {
        objects_list.push(new Projectile(this.meshes[0].position.clone(), dir, 1.9, 'blue', 0.4))
    } 
  }

  export class Platform extends Entity {
    constructor(meshShape = new THREE.Vector3(30,1,30), position = new THREE.Vector3(0,0,0)) {


        const shape = new CANNON.Box(new CANNON.Vec3(meshShape.x/2, meshShape.y/2, meshShape.z/2 ));
        const material = new CANNON.Material( {
            friction: 1000.0, // Coefficiente di attrito elevato
        })
        const body = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(position.x, position.y, position.z),
        shape: shape,
        material: material
        });
        world.addBody(body);

        var textureLoader = new THREE.TextureLoader();
        var texture = textureLoader.load('sprites/wall.jpg', function (texture) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(4, 4);
        });

        var platform_material = new THREE.MeshPhongMaterial({ map: texture });

        const platform_geometry = new THREE.BoxGeometry( meshShape.x, meshShape.y, meshShape.z );
        const platform = new THREE.Mesh( platform_geometry, platform_material );
        platform.castShadow = true;
        platform.position.copy(new THREE.Vector3(0,0,0))

        const bbplatform = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        bbplatform.setFromObject(platform)

        super(body, new THREE.Vector3(position.x, position.y,position.z),new THREE.Euler(0,0,0),[], [platform],[bbplatform]);

        scene.add( platform );
    }
  
  }

  export class Lava extends Entity {
    constructor( position = new THREE.Vector3(0,0,0)) {

        const shape = new CANNON.Box(new CANNON.Vec3(1000, 0.5, 1000 ));
        const material = new CANNON.Material( {
            friction: 1000.0, // Coefficiente di attrito elevato
        })
        const body = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(position.x, position.y, position.z),
        shape: shape,
        material: material
        });
        world.addBody(body);

        var textureLoader = new THREE.TextureLoader();
        var texture = textureLoader.load('sprites/lava.jpg', function (texture) {
            // Imposta le proprietà di wrapping
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            // Imposta il numero di ripetizioni della texture
            texture.repeat.set(64, 64);
        }
        );

        const platform_geometry = new THREE.BoxGeometry( 2000, 1, 2000 );
        var platform_material = new THREE.MeshBasicMaterial({ map: texture,
            emissive: 0x00ff00,
            emissiveIntensity: 1.0

         });
        const platform = new THREE.Mesh( platform_geometry, platform_material );
        platform.castShadow = true;
        platform.position.copy(new THREE.Vector3(0,0,0))

        const bbplatform = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        bbplatform.setFromObject(platform)

        super(body, new THREE.Vector3(position.x, position.y,position.z),new THREE.Euler(0,0,0),[], [platform],[bbplatform]);

        scene.add( platform );
    }
  
  }

  export class Projectile extends Entity {
    constructor(position = new THREE.Vector3(0,3,0), direction = new THREE.Vector3(0,0,0), speed = 0.5, color = 'red', rad) {

        const shape = new CANNON.Sphere(rad);
        const cbody = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(position.x, position.y, position.z),
        shape: shape,
        material: new CANNON.Material({ 
            friction: 10.0,
            restitution: 0.0,
            contactEquationRelaxation: 10.0,
            frictionEquationStiffness: 1 })
        });
        

        const body_geometry = new THREE.SphereGeometry( rad, 32, 10 );
        const body_material = new THREE.MeshBasicMaterial( { color: color} );
        const body = new THREE.Mesh( body_geometry, body_material );
        body.position.add( new THREE.Vector3(0,0,0))
        body.castShadow = true;


        const bbbody = new THREE.Sphere(new THREE.Vector3(0,0,0), rad);

        super(0, position,new THREE.Euler(0,0,0),[], [body],[bbbody]);

        scene.add( body );
        //world.addBody(cbody);
        this.direction = direction;
        this.speed = speed

        //cbody.velocity.set(speed*direction.x, speed*direction.y, speed*direction.z);

    }

    move()
    {
        this.position.add(this.direction.clone().multiplyScalar(this.speed))
    }
  
  }

  export class Enemy extends Entity {
    constructor(position = new CANNON.Vec3(0,10,0)) {

        var body_geometry = new THREE.SphereGeometry( 1, 32, 10 );
        var body_material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
        var body = new THREE.Mesh( body_geometry, body_material );
        body.visible= false
        body.position.add( new THREE.Vector3(0,0,0))
        body.castShadow = true;

        var body_base_geometry = new THREE.BoxGeometry( 1 );
        var body_base_material = new THREE.MeshPhongMaterial( { color: 0xff2f3f } );
        var body_base = new THREE.Mesh( body_base_geometry, body_base_material );
        body_base.visible = false
        body_base.position.add( new THREE.Vector3(0,-0.75,0))

        var bbbase_body = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        bbbase_body.setFromObject(body_base)

        var center = new THREE.Vector3(0, 0, 0);
        let dmbbody = new THREE.Sphere(center,7);
        let mbbody = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 1);
        mbbody.set(center,1)


        var weapon_geometry = new THREE.BoxGeometry( 0.4, 0.4, 0.4);
        var weapon_material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
        var weapon = new THREE.Mesh( weapon_geometry, weapon_material );
        weapon.position.copy( new THREE.Vector3(-1,1,0))
        weapon.castShadow = true;

        var material = new CANNON.Material( {
            friction: 1000.0, 
        })
        const shape = new CANNON.Sphere(1);
        const cbody = new CANNON.Body({
        mass: 1,
        position: position,
        shape: shape,
        material:material
        });
        world.addBody(cbody);


        var textureLoader = new THREE.TextureLoader();
        var texture = textureLoader.load('enemy_sprites/frame_000_delay-0.05s.png');
        var sprite_material = new THREE.SpriteMaterial({ map: texture });
        var sprite = new THREE.Sprite(sprite_material );
        sprite.position.copy(new THREE.Vector3(0,0,0))
        sprite.scale.set(3, 3, 2);

        

      super(cbody, new THREE.Vector3(0, 30,0),new THREE.Euler(0,0,0),[weapon, sprite],[body_base, body],[bbbase_body, mbbody]);
      
      this.speed = 24;
      this.charge = 5000
      this.max_charge = 5000
      scene.add( body )
      scene.add(sprite)
      scene.add( weapon )
      scene.add( body_base)
    }
  
    jump() {

        var jumpImpulse = new CANNON.Vec3(0, 60, 0); 

        for(var platform of platforms_list)
        {
            if(this.bboxes[0].intersectsBox(platform.bboxes[0]))
                {
                    this.body.applyImpulse(jumpImpulse, this.body.position);
                }
        }
        
    }

    move_character(move = new THREE.Vector3(0,0,0)) {

        //var moveImpulse = new CANNON.Vec3(move.x*this.speed, move.y, move.z*this.speed); 
        //this.body.position = this.body.position.vadd(moveImpulse)

        var damping = 0.6

        this.body.velocity.set(this.body.velocity.x + move.x*this.speed, this.body.velocity.y, this.body.velocity.z + move.z*this.speed);
        this.body.velocity.x *= damping;
        this.body.velocity.z *= damping;
        this.body.angularVelocity.set(0, this.body.angularVelocity.y*=damping, 0)
    }

    shoot(dir)
    {
        objects_list.push(new Projectile(this.meshes[0].position.clone(), dir, 0.35, 'red', 0.6))
    } 

    add_charge(charge)
    {
        this.charge = Math.min(this.max_charge, this.charge + charge)
    }

    try_to_shoot(character)
    {
        if(this.position.distanceTo(character.position) < 100 && this.charge == this.max_charge)
        {
            this.shoot(character.bboxes_mesh[0].position.clone().sub(this.position).normalize())
            this.charge = 0
        }
    }
  }


