/** ---------------------- /
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

/** ---- import the actual libraries ---- **/

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/** ---------------------- /
 *     THREE.JS COMPONENT
 ** --------------------- */
export default function Skybox(props){

    /** ---- create a Physics Renderer (provided by WebGL) ---- **/
    let renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight); // adjust ratio to viewport
    document.querySelector('body').append(renderer.domElement); // renderer will be embeded as <canvas>

    /** ---- THREE needs a scene within which to render the elements ---- **/
    let scene = new THREE.Scene;

    /** ---- THREE will need a camera (or we won't actually see anything...) ---- **/
    // Camera needs a field of view (70 is about standard), a ratio, and frustum limits (only inbetween distances are rendered)
    let camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 1, 1000);
    camera.position.set( 0, 0, 1 ); // Camera controls don't work when z == 0
    camera.lookAt(0, 0, 0);

    /** ---- create a THREE skeleton for the coming object ---- **/

    let geometry = new THREE.BoxGeometry(100, 100, 100);

    /** ---- mapping the texture material ---- **/
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

    /** ---- create the actual object with skeleton + material ---- **/
    let cube = new THREE.Mesh(geometry, materialArray);

    /** ---- the new object doesn't exist unless it's added to the a rendered scene ---- **/
    scene.add(cube);

    for(let i=0; i <6 ; i++){
        // this will switch the sides on which applied textures are visible, and the other transparent sides
        materialArray[i].side = THREE.BackSide;
    }

    /** ---- This will allow the dragging control ---- **/
    let controls = new OrbitControls(camera, renderer.domElement);
    // controls.autoRotate = true;

    /** ---- Finally, the actual rendering ---- **/
    /*
        renderer.render must be called at each frame, that's why such a recursive function animate(){} is needed
     */
    let animate = function(){
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();


    /** ---------------------- /
     *     FOLLOWING ARE CUSTOM INTERFACE FUNCTIONS
     ** --------------------- */
    // Toggle and untoggle backfacing
    function toggle(){
        for(let i=0; i <6 ; i++){
            materialArray[i].side = materialArray[i].side == 0 ? 1 : 0;
        }
    }
    // Zoom in and out faster than by scrolling
    function rangeZoom(){
        let {x, y, z} = camera.position;

        let ratioX = x / (Math.abs(x) + Math.abs(y) + Math.abs(z));
        let ratioY = y / (Math.abs(x) + Math.abs(y) + Math.abs(z));
        let ratioZ = z / (Math.abs(x) + Math.abs(y) + Math.abs(z));

        camera.position.set(
            ratioX*(501-document.querySelector(".zoomRange").value),
            ratioY*(501-document.querySelector(".zoomRange").value),
            ratioZ*(501-document.querySelector(".zoomRange").value)
        );
    }
    // Play around with the field of view (! need to update the projection matrix afterwards !)
    function rangeFov(){
        camera.fov = document.querySelector(".fovRange").value;
        camera.updateProjectionMatrix();
    }

    // CSS styling
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

    /** --------------------- /
     *     REACT RENDERING
     ** --------------------- */
    // This is not actually needed for THREE.JS, this is merely for the UI
    return(
   <>
       <h2 style={localStyle}>
            Try dragging around, zooming out, or clicking here >&nbsp;
            <span onClick={toggle} style={{cursor:'pointer', color:'Aqua'}}>
                Toggle Backfacing
            </span>
            <span style={{marginLeft:'30px'}}>ZOOM</span><input className="zoomRange" type="range" min="10" max="500" onChange={rangeZoom} defaultValue={500}/>
            <span style={{marginLeft:'30px'}}>FOV</span><input className="fovRange" type="range" min="10" max="150" onChange={rangeFov} defaultValue={70}/>
        </h2>
        <a target="_blank" href="https://github.com/Faber-smythe/js_visualization/blob/master/src/pages/Skybox.js" style={{...localStyle, ...{right:'5vw', marginRight:'0'}}}>SOURCE</a>
    </>
    )
}
