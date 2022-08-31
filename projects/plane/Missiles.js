// import { Group, Vector3 } from 'three';
import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

class Missiles {
    constructor(game) {
        this.assetsPath = game.assetsPath;
        this.loadingBar = game.loadingBar;
        this.game = game;
        this.scene = game.scene;
        this.loadMissile();
        this.missiles = [];
    }

    loadMissile() {
        const loader = new GLTFLoader().setPath(`${this.assetsPath}plane/`);

        loader.load(
            // resource URL
            'bomb.glb',
            // called when the resource is loaded
            (gltf) => {
                let missileOne = gltf.scene.children[0];
                missileOne.rotation.x = Math.PI * 0.5;
                this.missile = new Group();

                this.missile.add(missileOne);
            },
            // called while loading is progressing
            (xhr) => {
                this.loadingBar.update('missile', xhr.loaded, xhr.total);
            },
            // called when loading has errors
            (err) => {
                console.error(err);
            }
        );
    }

    newMissile(game) {
        let new_missile = this.missile.clone();
        new_missile.velocity = {...game.plane.velocity};
        const initPos = game.plane.tmpPos;
        new_missile.position.set(initPos.x,initPos.y,initPos.z);
        this.missiles.push(new_missile);
        this.scene.add(new_missile);
    }

    updatePosition(time) {
        this.missiles.forEach((missile, index) => {
            if (Math.abs(missile.position.z - this.game.plane.position.z) > 40) {
                this.missiles.splice(index, 1);
                this.scene.remove(missile);
            }
            missile.velocity.z = missile.velocity.z + 0.0025;
            // missile.rotateZ(0.01);
            missile.translateZ(missile.velocity.z);
        })
    }
}

export { Missiles }