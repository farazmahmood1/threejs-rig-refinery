// import React, { useEffect, useRef } from 'react';
// import * as THREE from 'three';
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// const ThreeScene: React.FC = () => {
//   const mountRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!mountRef.current) return;

//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0xeeeeee);

//     const camera = new THREE.PerspectiveCamera(
//       75, // Field of View (FOV)
//       window.innerWidth / window.innerHeight,
//       0.1,
//       1000
//     );
//     camera.position.z = 5;

//     const renderer = new THREE.WebGLRenderer();
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     mountRef.current.appendChild(renderer.domElement);

//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
//     scene.add(ambientLight);

//     const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
//     directionalLight.position.set(10, 10, 10);
//     scene.add(directionalLight);

//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true; // Smooth movement
//     controls.dampingFactor = 0.05; // Damping intensity
//     controls.screenSpacePanning = false; // Disable panning in screen space
//     controls.minDistance = 2; // Minimum zoom distance
//     controls.maxDistance = 100; // Maximum zoom distance

//     const objLoader = new OBJLoader();
//     objLoader.load(
//       '/models/ibda_platform_v1.obj', // Replace with the path to your .obj file
//       (object) => {
//         scene.add(object);
//       },
//       undefined,
//       (error) => {
//         console.error('Error loading .obj file:', error);
//       }
//     );

//     const animate = () => {
//       requestAnimationFrame(animate);

//       controls.update();

//       renderer.render(scene, camera);
//     };
//     animate();

//     const handleResize = () => {
//       if (camera && renderer) {
//         camera.aspect = window.innerWidth / window.innerHeight;
//         camera.updateProjectionMatrix();
//         renderer.setSize(window.innerWidth, window.innerHeight);
//       }
//     };
//     window.addEventListener('resize', handleResize);

//     return () => {
//       window.removeEventListener('resize', handleResize);
//       mountRef.current?.removeChild(renderer.domElement);
//     };
//   }, []);

//   return <div ref={mountRef} />;
// };

// export default ThreeScene;


import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Water } from "three/examples/jsm/objects/Water";

const ThreeScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 10);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 20, 10);
    scene.add(directionalLight);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 2;
    controls.maxDistance = 100;
    const waterGeometry = new THREE.PlaneGeometry(100, 100);
    const water = new Water(waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load(
        "https://threejs.org/examples/textures/waternormals.jpg",
        (texture) => {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }
      ),
      alpha: 1.0,
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x0044ff,
      distortionScale: 8,
      fog: scene.fog !== undefined,
    });
    water.rotation.x = -Math.PI / 2;
    water.position.y = 0;
    scene.add(water);
    const objLoader = new OBJLoader();
    objLoader.load(
      "/models/ibda_platform_v1.obj",
      (object) => {
        object.position.set(0, 1, 0);
        scene.add(object);
      },
      undefined,
      (error) => {
        console.error("Error loading .obj file:", error);
      }
    );
    const animate = () => {
      requestAnimationFrame(animate);
      water.material.uniforms["time"].value += 0.03;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} />;
};

export default ThreeScene;
