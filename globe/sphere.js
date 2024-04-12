import * as THREE from 'three';
import { GLOBE_RADIUS } from './constants';
import { rootMesh } from './scene';

const COLOR_SPHERE_NIGHT = 0xa58945;

export function init() {
  const geometry = new THREE.SphereGeometry(GLOBE_RADIUS, 40, 30);
  const loader = new THREE.TextureLoader();
  
  const material = new THREE.MeshPhongMaterial({
    map: loader.load('https://i.imgur.com/45naBE9.jpg'),
    map: loader.load('./earth-texture.jpg'),
    map: loader.load('./earth-texture-2.jpg'),
    map: loader.load('./earth-texture-3.jpg'),
    map: loader.load('./earth-texture-4.jpg'),
    // color: COLOR_SPHERE_NIGHT
  });

  const mesh = new THREE.Mesh(geometry, material);
  
  // mesh.rotateY(Math.PI);
  // mesh.rotateX(100);
  rootMesh.add(mesh);
}