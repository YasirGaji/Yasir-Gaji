/* eslint-disable no-unused-vars */
import React from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';



export function loadGLTFModel(
  scene: { add: (arg0: any) => void; },
  glbPath: any,
  options = {
    receiveShadow: true,
    castShadow: true,
    scale: 1,
  }
) {
  const { receiveShadow, castShadow, scale } = options;
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();

    loader.load(
      glbPath,
      (gltf: { scene: any; }) => {
        const obj = gltf.scene;
        obj.name = 'model';
        obj.position.y = 0;
        obj.position.x = 0;
        obj.receiveShadow = receiveShadow;
        obj.castShadow = castShadow;
        obj.scale.set(scale, scale, scale);
        scene.add(obj);

        obj.traverse((child: { isMesh: any; castShadow: boolean; receiveShadow: boolean; }) => {
          if (child.isMesh) {
            child.castShadow = castShadow;
            child.receiveShadow = receiveShadow;
          }
        })

        resolve(obj);
      },
      undefined,
      function (error: any) {
        console.error(error);
        reject(error);
      }
    )
  })
}