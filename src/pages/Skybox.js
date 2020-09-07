/** --------------------- /
 *      IMPORTS
 ** --------------------- */
import React, {Component} from 'react';

/** ---- import the 6 textures (order doesn't matter) ---- **/
import textureRt from '../textures/right.jpg';
import textureLt from '../textures/left.jpg';
import textureUp from '../textures/up.jpg';
import textureDn from '../textures/down.jpg';
import textureBk from '../textures/back.jpg';
import textureFt from '../textures/front.jpg';

/** ----  ---- **/

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/** --------------------- /
 *      COMPONENT
 ** --------------------- */
export default function Skybox(props){
    let renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.querySelector('body').append(renderer.domElement);

    let scene = new THREE.Scene;

    let camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 1, 1000);
    camera.position.set( 0, 0, 1 ); // Camera controls don't work when Z == 0)
    camera.lookAt(0, 0, 0);

    let geometry = new THREE.BoxGeometry(100, 100, 100);
    let materialArray = [];
    let texture_ft = new THREE.TextureLoader().load(textureFt);
    let texture_bk = new THREE.TextureLoader().load(textureBk);
    let texture_up = new THREE.TextureLoader().load(textureUp);
    let texture_dn = new THREE.TextureLoader().load(textureDn);
    let texture_rt = new THREE.TextureLoader().load(textureRt);
    let texture_lt = new THREE.TextureLoader().load(textureLt);

    materialArray.push(new THREE.MeshBasicMaterial({map: texture_rt})); // right
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_lt})); // left
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_up})); // up
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_dn})); // down
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_bk})); // back
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_ft})); // front

    let cube = new THREE.Mesh(geometry, materialArray);
    scene.add(cube);

    for(let i=0; i <6 ; i++){
        materialArray[i].side = THREE.BackSide;
    }

    let controls = new OrbitControls(camera, renderer.domElement);
    // controls.autoRotate = true;

    let animate = function(){
        controls.update();

        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();

    function toggle(){
        for(let i=0; i <6 ; i++){

            materialArray[i].side = materialArray[i].side == 0 ? 1 : 0;
        }
    }
    function rangeZoom(){
        let {x, y, z} = camera.position;
        let ratioX = x / (Math.abs(x) + Math.abs(y) + Math.abs(z));
        let ratioY = y / (Math.abs(x) + Math.abs(y) + Math.abs(z));
        let ratioZ = z / (Math.abs(x) + Math.abs(y) + Math.abs(z));
        console.log(ratioX);
        console.log(x);
        camera.position.set(
            ratioX*(201-document.querySelector(".zoomRange").value),
            ratioY*(201-document.querySelector(".zoomRange").value),
            ratioZ*(201-document.querySelector(".zoomRange").value)
        );
    }
    function rangeFov(){
        camera.fov = document.querySelector(".fovRange").value;
        camera.updateProjectionMatrix();
    }

    const localStyle = {
        position:'fixed',
        color:'white',
        backgroundColor:'black',
        opacity: 0.5,
        margin:'5vh 5vw',
        padding: '8px',
        borderRadius: '4px',
        fontSize: '0.9vw',
        display: 'flex',
        alignItems: 'center'
    }
    return(
   <>
       <h2 style={localStyle}>
            Try dragging around, zooming out, or clicking here >&nbsp;
            <span onClick={toggle} style={{cursor:'pointer', color:'Aqua'}}>
                Toggle Backfacing
            </span>
            <span style={{marginLeft:'30px'}}>ZOOM</span><input className="zoomRange" type="range" min="10" max="200" onChange={rangeZoom} defaultValue={200}/>
            <span style={{marginLeft:'30px'}}>FOV</span><input className="fovRange" type="range" min="10" max="150" onChange={rangeFov} defaultValue={70}/>
        </h2>
        <a target="_blank" href="https://github.com/Faber-smythe/js_visualization/blob/master/src/pages/Skybox.js" style={{...localStyle, ...{right:'5vw', marginRight:'0'}}}>SOURCE</a>
    </>
    )
}
