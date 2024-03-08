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

  // Initialize draw range for animation
  this.drawStart = 0;
  this.drawEnd = 0;
  this.drawRangeIncrement = 30;

  this.updateDrawRange = () => {
    this.drawEnd += this.drawRangeIncrement;

    geometry.setDrawRange(Math.min(this.drawStart, this.drawEnd), Math.max(this.drawStart, this.drawEnd));
  };
}
