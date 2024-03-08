import * as THREE from 'three';
import _ from 'lodash';
import Curve from './Curve';
import Tube from './Tube';
import { rootMesh, STATE } from './scene';
import { CURVE_COLOR } from './constants';

export function init(allCoords) {
  const curveMesh = new THREE.Mesh();

  const meshes = [];

  rootMesh.add(curveMesh);
  
  allCoords.forEach((pathObject, index) => {
    // if (index % 2) {
    //   const curve = new Curve(coords, material);
    //   curveMesh.add(curve.mesh);
    // } else {
    //   const tube = new Tube(coords, material);
    //   curveMesh.add(tube.mesh);
    // }

    const material = new THREE.MeshBasicMaterial({
      blending: THREE.AdditiveBlending,
      opacity: 0.5,
      transparent: true,
      color: 0xfffffff
    });

    const tube = new Tube(pathObject.coordinates, material);

    curveMesh.add(tube.mesh);

    setTimeout(() => {
      meshes.push(tube.mesh);
  
      STATE.paths.push({ data: pathObject, path: tube });
    }, 100 * index)
  });

 

  // const raycaster = new THREE.Raycaster();

  // const mouse = new THREE.Vector2();

  // window.addEventListener('mousemove', (event) => {
  //   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  //   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  // });

  // window.addEventListener('mousemove', () => {
  //   raycaster.setFromCamera(mouse, STATE.camera);

  //   meshes.forEach(mesh => {
  //     const intersects = raycaster.intersectObject(mesh);

  //     if (intersects.length > 0 && intersects[0].object.uuid == mesh.uuid) {
  //       intersects[0].object.material.color.set(0xff0000);

  //       console.log(intersects[0].object.uuid);

  //       STATE.isInersecting = true;
  //       STATE.intersectingMeshId = intersects[0].object.uuid;
  //     } else {
  //       mesh.material.color.set(0xffffff);

  //       STATE.isInersecting = false;
  //       STATE.intersectingMeshId = null;
  //     }
  //   })
  // });
}