/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { Box, Spinner } from '@chakra-ui/react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { loadGLTFModel } from '../../libs/model';

function easeOutCirc(x) {
  return Math.sqrt(1 - Math.pow(x - 1, 4));
}

export const Model = () => {
  const refContainer = useRef(null);
  const [loading, setLoading] = useState(true);
  const [_camera, setCamera] = useState(null);
  const [target] = useState(new THREE.Vector3(-0.5, 1.2, 0));
  const [initialCameraPosition] = useState(
    new THREE.Vector3(
      20 * Math.sin(0.2 * Math.PI), 10, 
      20 * Math.cos(0.2 * Math.PI)
    )
  );

  const [scene] = useState(new THREE.Scene());
  const [_controls, setControls] = useState(null);

/* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
      const { current: container } = refContainer;
      if (container && !render) {
        const scW = container.clientWidth;
        const scH = container.clientHeight;

        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
        })

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(scW, scH);
        renderer.outputEncoding = THREE.sRGBEncoding;
        setRenderer(renderer);

        const scale = scH * 0.005 + 4.8;
        const camera = new THREE.OrthographicCamera(
          -scale,
          scale,
          scale,
          -scale,
          0.01,
          50000
        )
        camera.position.copy(initialCameraPosition);
        camera.lookAt(target);
        setCamera(camera);

        const ambientLight = new THREE.AmbientLight(0xcccccc, 1);
        scene.add(ambientLight);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.autoRotate = true;
        controls.target = target;
        setControls(controls);

        loadGLTFModel(scene, '/model', {
          receiveShadow: false,
          castShadow: false,
        }).then(() => {
          setLoading(false);
          container.appendChild(renderer.domElement);
        })
      }
    }, []);


  return (
    <Box 
      ref={refContainer}
      className='model' m='auto'
      mb={['-40px', '140px', '-200px']}
      at={['-20p', '-60px', '-120px']}
      w={[280, 480, 640]} h={[280, 480, 640]}
      position="relative"
    >
      {loading && (
        <Spinner 
          size="xl" position="absolute" 
          top="50%" left="50%" 
          transform="translate(-50%, -50%)" 
          ml="calc(0px - var(--spinner-size) / 2)"
          mt="calc(0px - var(--spinner-size) / 2)"
        />
      )}
      Room.
    </Box>
  )
}