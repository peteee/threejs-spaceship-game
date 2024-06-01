import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ColladaLoader } from 'three/addons/loaders/ColladaLoader.js';
import { Reflector } from 'three/addons/objects/Reflector';

let container, stats, clock;
let camera, scene, renderer;
window.dae;

init();
animate();

function init() {

    container = document.getElementById('container');

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(8, 20, 8);
    camera.lookAt(0, 3, 0);

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xeeeeee );
    scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );

    clock = new THREE.Clock();

    // loading manager

    const loadingManager = new THREE.LoadingManager(function () {

        scene.add(window.dae);
        TweenMax.fromTo(dae.position, 2, {y:1}, {y:3, ease:Linear.easeNone, repeat:-1, yoyo: true});

    });

    // collada

    const loader = new ColladaLoader(loadingManager);
    loader.load('./assets/ship-new.dae', function (collada) {

        window.dae = collada.scene;

        //cast shadows
        window.dae.traverse( function ( object ) {

            if ( object.isMesh ) object.castShadow = true;

        } );

    });

        // ground

    // const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 1000, 1000 ), new THREE.MeshPhongMaterial( { color: 0xcbcbcb, depthWrite: false } ) );
    // mesh.rotation.x = - Math.PI / 2;
    // mesh.receiveShadow = true;
    // scene.add( mesh );
    


    // const geometry = new THREE.PlaneGeometry( 1000, 1000 );
    // const material = new THREE.MeshBasicMaterial( {color: 0xcbcbcb, depthWrite: false} );
    // const plane = new THREE.Mesh( geometry, material );
    // plane.rotation.x = - Math.PI / 2;
    // plane.receiveShadow = true;
    // scene.add( plane );



/**
 * FLOOR
 */

//const texture4 = new THREE.TextureLoader().load( 'assets/TexturesCom_Sand_Muddy2_header.jpg' );
const geometry4 = new THREE.PlaneGeometry( 400, 400 );
const material4 = new THREE.MeshPhongMaterial( {
    /*color: 0xffff00, */
    side: THREE.DoubleSide, 
 //   map: texture4, 
    //bumpMap: texture4,
    shininess: 55, 
    reflectivity: 1,
    depthWrite: false,
    //blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.5
} );
const floor = new THREE.Mesh( geometry4, material4 );
floor.position.set(0,-1,0);
floor.rotation.x = Math.PI / 2;
scene.add( floor );


//const geometry5 = new THREE.CircleGeometry( 40, 64 );
const groundMirror = new Reflector( geometry4, {
    clipBias: 0.003,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 0xb5b5b5,
} );
groundMirror.position.y = -1.5;
groundMirror.rotateX( - Math.PI / 2 );
scene.add( groundMirror );




// add shadow plane
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(),
    new THREE.ShadowMaterial( {
        color: 0xd81b60,
        transparent: true,
        opacity: 0.075,
        side: THREE.DoubleSide,
    } ),
);
plane.position.y = - 0.9;
plane.rotation.x = - Math.PI / 2;
plane.scale.setScalar( 100 );
plane.receiveShadow = true;
scene.add( plane );

    // lights

    // const ambientLight = new THREE.AmbientLight(0xffffff);
    // scene.add(ambientLight);

    // const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
    // directionalLight.position.set(1, 1, 0).normalize();
    // scene.add(directionalLight);

    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d, 3 );
    hemiLight.position.set( 0, 20, 0 );
    scene.add( hemiLight );

    const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
    dirLight.position.set( 0, 10, 0 );
    dirLight.castShadow = true;
    dirLight.shadow.radius = 8;
    dirLight.shadow.camera.top = 12;
    dirLight.shadow.camera.bottom = - 12;
    dirLight.shadow.camera.left = - 12;
    dirLight.shadow.camera.right = 12;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 40;
    scene.add( dirLight );

    // var spotLight = new THREE.SpotLight(0xffa95c, 2)
    // spotLight.castShadow = true
    // spotLight.position.set(2,2,-2)
    
    // spotLight.angle = Math.PI * 0.1;
    
    // spotLight.shadow.camera.near = 1;
    // spotLight.shadow.camera.far = 4;
    // spotLight.shadow.bias = - 0.002;
    // spotLight.shadow.mapSize.set( 1024, 1024 );
    // scene.add( new THREE.CameraHelper( spotLight.shadow.camera ) );

    // renderer

    // renderer = new THREE.WebGLRenderer();
    // renderer.setPixelRatio(window.devicePixelRatio);


    // renderer.setSize(window.innerWidth, window.innerHeight);
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);



    // stats

    stats = new Stats();
    container.appendChild(stats.dom);

    // resize

    window.addEventListener('resize', onWindowResize);


    const controls = new  OrbitControls( camera, renderer.domElement );
    //controls.addEventListener( 'change', render );


}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

    requestAnimationFrame(animate);

    render();
    stats.update();

}

function render() {

    const delta = clock.getDelta();

    if (window.dae !== undefined) {

        // dae.rotation.z += delta * 0.5;
        

    }

    renderer.render(scene, camera);

}

let shipX = 0;
let shipY = 0;
let shipRot = 0;

let shipSound = new Audio("./assets/mixkit-flying-spaceship-slowing-down-2736.wav");
window.addEventListener('keydown', event => {
    if (event.key == "ArrowLeft") {
        shipY += 5;
        // shipRot += 1;
    } else if (event.key == "ArrowRight") {
        shipY -= 5;
        // shipRot -= 1;
    } else if (event.key == "ArrowUp") {
        shipX += 10;
        // shipRot = 0;
    } else if (event.key == "ArrowDown") {
        shipX -= 10;
        // shipRot = 0;
    }

    shipSound.pause();
    shipSound.currentTime = 0;
    shipSound.play();

    TweenMax.to(window.dae.position, 1, {
        x: shipX,
        z: shipY,
        ease: Power3.easeInOut
    });
    // TweenMax.to(window.dae.rotation, 1, {
    //     z: shipRot,
    //     ease: Power3.easeInOut
    // });
    

  })


