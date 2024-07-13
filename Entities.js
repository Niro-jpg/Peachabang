import * as THREE from 'three';

export class Entity {
    constructor(position = NaN, orientation = NaN, meshes = [], bboxes_mesh = [], bboxes = []) 
    {
        console.log(position, orientation, meshes, bboxes)
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
        for (var bbox_mesh of bboxes_mesh)
            {
                this.bboxes_original_position.push(bbox_mesh.position.clone())
                this.bboxes_original_orientation.push(bbox_mesh.rotation.clone())
                bbox_mesh.position.add(this.position)
                this.bboxes_mesh.push(bbox_mesh);
            }

        this.bboxes = [];
        for (var bbox of bboxes)
        {
            this.bboxes.push(bbox);
        }



    }

    change_position(position) 
    {
        this.position = position;
        this.update();
    }

    add_position(position) 
    {
        this.position.add(position);
        this.update();
    }

    change_orientation(orientation)
    {
        this.orientation = orientation;
        this.update();
        
    }

    add_orientation(orientation)
    {
        this.orientation.add(orientation);
        this.update();

    }

    update()
    {
        var angle = this.orientation.y;

        for (let i = 0; i < this.meshes.length; i++) {
            this.meshes[i].rotation.copy(new THREE.Euler(this.orientation.x + this.meshes_original_orientation[i].x,this.orientation.y + this.meshes_original_orientation[i].y,this.orientation.z + this.meshes_original_orientation[i].z))

            this.meshes[i].position.copy(this.position.clone().add(new THREE.Euler(this.meshes_original_position[i].x*Math.cos(angle) - this.meshes_original_position[i].z*Math.sin(angle), this.meshes_original_position[i].y, -this.meshes_original_position[i].z*Math.cos(angle) - this.meshes_original_position[i].x*Math.sin(angle))))

        }
        for (let i = 0; i < this.bboxes_mesh.length; i++) {
            this.bboxes_mesh[i].rotation.copy(new THREE.Euler(this.orientation.x + this.bboxes_original_orientation[i].x,this.orientation.y + this.bboxes_original_orientation[i].y,this.orientation.z + this.bboxes_original_orientation[i].z))

            this.bboxes_mesh[i].position.copy(this.position.clone().add(new THREE.Euler(this.bboxes_original_position[i].x*Math.cos(angle) - this.bboxes_original_position[i].z*Math.sin(angle), this.bboxes_original_position[i].y, -this.bboxes_original_position[i].z*Math.cos(angle) - this.bboxes_original_position[i].x*Math.sin(angle))))
            this.bboxes[i].setFromObject(this.bboxes_mesh[i])
        }
    }

    update_positions()
    {
        for (let i = 0; i < this.meshes.length; i++) {
            this.meshes[i].position.copy(this.position.clone().add(this.meshes_original_position[i]))
        }
        for (let i = 0; i < this.bboxes.length; i++) {
            this.bboxes[i].position.copy(this.position.clone().add(this.bboxes_original_position[i]))
        }
    }
    mesh_relative_position(mesh)
    {
        return mesh.position.clone().sub(this.position);
    }

}



export class MainCharacter extends Entity {
    constructor(scene) {
        const body_geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const body_material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        const body = new THREE.Mesh( body_geometry, body_material );
        body.position.add( new THREE.Vector3(0,0,0))

        const body_base_geometry = new THREE.BoxGeometry( 1.4, 0.2, 1.4 );
        const body_base_material = new THREE.MeshBasicMaterial( { color: 0xff2f3f } );
        const body_base = new THREE.Mesh( body_base_geometry, body_base_material );
        body_base.position.add( new THREE.Vector3(0,-0.8,0))

        const bbbody = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        bbbody.setFromObject(body_base)

        const weapon_geometry = new THREE.BoxGeometry( 0.5, 1, 1 );
        const weapon_material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        const weapon = new THREE.Mesh( weapon_geometry, weapon_material );
        weapon.position.add( new THREE.Vector3(-1,1,0))

      super(new THREE.Vector3(0, -6,0),new THREE.Euler(0,0,0),[body, weapon],[body_base],[bbbody]);
      
      scene.add( body )
      scene.add( weapon )
      scene.add( body_base)
    }
  
    calculateArea() {
      return Math.PI * this.radius * this.radius;
    }
  }

  export class Platform extends Entity {
    constructor(scene) {
        const platform_geometry = new THREE.BoxGeometry( 30, 0.5, 30 );
        const platform_material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
        const platform = new THREE.Mesh( platform_geometry, platform_material );
        platform.position.add( new THREE.Vector3(0, 0,0))

        const bbplatform = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        bbplatform.setFromObject(platform)

        super(new THREE.Vector3(0, -7,0),new THREE.Euler(0,0,0),[], [platform],[bbplatform]);

        scene.add( platform );
    }
  
    calculateArea() {
      return Math.PI * this.radius * this.radius;
    }
  }