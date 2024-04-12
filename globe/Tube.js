import * as THREE from 'three';
import { getSplineFromCoords } from './utils';
import { CURVE_SEGMENTS } from './constants';

const TUBE_RADIUS_SEGMENTS = 5;
const DEFAULT_TUBE_RADIUS = 1;
const DRAW_RANGE_DELTA = 16;
const MAX_DRAW_RANGE = DRAW_RANGE_DELTA * CURVE_SEGMENTS;

export default function TubeAnim(coords, material) {
  const { spline } = getSplineFromCoords(coords);
  const geometry = new THREE.TubeBufferGeometry(spline, CURVE_SEGMENTS, DEFAULT_TUBE_RADIUS, TUBE_RADIUS_SEGMENTS, false);

  geometry.setDrawRange(0, 0);

  this.mesh = new THREE.Mesh(geometry, material);

  // // Create a box
  // const boxGeometry = new THREE.BoxGeometry(5, 5, 5);
  // const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  // const box = new THREE.Mesh(boxGeometry, boxMaterial);

  // // Add the box to the scene
  // this.mesh.add(box);

  // Create spheres with point lights
  const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
  const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const startSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  const endSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

  // Position spheres at the start and end of the tube
  const startPoint = spline.getPointAt(0);
  const endPoint = spline.getPointAt(1);
  startSphere.position.copy(startPoint);
  endSphere.position.copy(endPoint);

  // Add spheres to the scene
  this.mesh.add(startSphere);
  this.mesh.add(endSphere);

  // Initialize draw range for animation
  this.drawStart = 0;
  this.drawEnd = 0;
  this.drawRangeIncrement = 30;

  this.boxDrawEnd = 0;
  this.boxRangeIncrement = 5;

  this.updateDrawRange = () => {
    this.drawEnd += this.drawRangeIncrement;

    geometry.setDrawRange(Math.min(this.drawStart, this.drawEnd), Math.max(this.drawStart, this.drawEnd));

    // this.boxDrawEnd += this.boxRangeIncrement;
    // const point = spline.getPointAt((this.boxDrawEnd % MAX_DRAW_RANGE) / MAX_DRAW_RANGE);
    // box.position.copy(point);
  };
}
