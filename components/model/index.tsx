import React, { useState, useEffect, useRef, useCallback } from 'react';
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

  return (
    <Box 
      ref={refContainer}
      className='model' m='auto'
      mb={['-40px', '140px', '-200px']}
      at={['-20p', '-60px', '-120px']}
      w={[280, 480, 640]} h={[280, 480, 640]}
      position="relative"
    >
      Room.
    </Box>
  )
}