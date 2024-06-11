import * as THREE from 'three';
import Hammer from 'hammerjs';
import { adjustCoordinates, clamp, debounce, renderTemplate, throttle } from './utils';
import { GLOBE_RADIUS, PI_TWO } from './constants';

let _deltaX = 0;
let _deltaY = 0;
let _startX = 0;
let _startY = 0;

const CAMERA_Z_MIN = 800;
const CAMERA_Z_MAX = 2500;
let _cameraZ = 1250; // 1100

export const scene = new THREE.Scene();
export const rootMesh = new THREE.Mesh(new THREE.Geometry());

export const STATE = {
  container: null,
  camera: null,
  paths: [],
  isInersecting: false,
  intersectingMeshId: null
};

export function init(container, options = {}) {
  const width = container.offsetWidth || window.innerWidth;
  const height = container.offsetHeight || window.innerHeight;
  const camera = new THREE.PerspectiveCamera(30, width / height, 1, 10000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

  STATE.camera = camera;

  STATE.container = container;

  const hoverCard = createHoverCard(container, options.labelTemplateId);

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const screenMouse = {};

  if(!isNaN(options.zoomLevel)) _cameraZ = options.zoomLevel;

  setTimeout(() => {
    const cleanUp = throttle((callback) => callback(), 450);
    let isInteracting = false;

    container.addEventListener('mousemove', (event) => {
      const rect = STATE.container.getBoundingClientRect();
      const mouseX = (event.clientX - rect.left) / rect.width * 2 - 1;
      const mouseY = -(event.clientY - rect.top) / rect.height * 2 + 1;

      mouse.x = mouseX;
      mouse.y = mouseY;

      // mouse.x = (event.clientX / container.offsetWidth) * 2 - 1;
      // mouse.y = -(event.clientY / container.offsetHeight) * 2 + 1;

      screenMouse.clientX = event.clientX;
      screenMouse.clientY = event.clientY;

      if(isInteracting){
        cleanUp(() => {
          isInteracting = false;
        });

        return;
      }

      raycaster.setFromCamera(mouse, STATE.camera);

      // Increase the raycast width
      raycaster.params.Points.threshold = 0.1; // Increase the point cloud threshold
      raycaster.params.Line.threshold = 0.1;

      // Path interaction
      STATE.paths.forEach(item => {
        const path = item.path;

        const mesh = path.mesh;

        const intersects = raycaster.intersectObject(mesh);

        if (intersects.length > 0 && intersects[0].object.uuid == mesh.uuid) {
          intersects[0].object.material.color.set(0x67e8f9);

          STATE.container.style.cursor = "pointer";

          isInteracting = true;

          hoverCard.show(screenMouse.clientX, screenMouse.clientY, {
            data: item.data.data
          });
        } else {
          mesh.material.color.set(0xffffff);

          if (!isInteracting) {
            STATE.container.style.cursor = "auto";
            hoverCard.hide();
          }
        }
      });
    });
  }, 2000)

  // Default rotation
  rootMesh.rotation.x = 0.49826628687325725;
  rootMesh.rotation.y = 2.9990576315611692;

  // main animation loop
  const play = () => {
    // rotation
    rootMesh.rotation.x += Math.atan(_deltaY / _cameraZ) * 0.2;
    rootMesh.rotation.y += Math.atan((_deltaX != 0 ? _deltaX : 2) / _cameraZ) * 0.2;
    if (rootMesh.rotation.x > PI_TWO) rootMesh.rotation.x -= PI_TWO;
    if (rootMesh.rotation.y > PI_TWO) rootMesh.rotation.y -= PI_TWO;

    // zoom
    camera.position.z = _cameraZ;

    // Path interaction
    STATE.paths.forEach(item => {
      const path = item.path;

      // Animation
      path.updateDrawRange();
    });

    // render
    renderer.render(scene, camera);

    // next frame
    requestAnimationFrame(play);
  };

  // init scene
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);
  camera.position.z = _cameraZ;

  // add rootMesh to scene
  scene.add(rootMesh);

  // lighting
  const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.93);
  scene.add(light);

  // init event listeners
  initPanListener(container);
  // initZoomListener(container);
  initResizeListener(container, camera, renderer);

  resizeRenderer(container, camera, renderer);

  // play scene
  play();
}

function reset() {
  _deltaX = 0;
  _deltaY = 0;
  _startX = 0;
  _startY = 0;
}

function initPanListener(container) {
  const mc = new Hammer.Manager(container);

  mc.add(new Hammer.Pan());

  mc.on('pan', (e) => {
    _deltaX = e.deltaX - _startX;
    _deltaY = e.deltaY - _startY;
  });

  mc.on('panstart', () => {
    reset();
    container.style.cursor = 'move';
  });

  mc.on('panend', () => {
    reset();
    container.style.cursor = 'auto';
  });
}

function initZoomListener(container) {
  container.addEventListener('mousewheel', (e) => {
    const delta = e.wheelDeltaY * 0.2;
    _cameraZ = clamp(_cameraZ - delta, CAMERA_Z_MIN, CAMERA_Z_MAX);
  }, false);
}

function initResizeListener(container, camera, renderer) {
  window.addEventListener('resize', () => {
    resizeRenderer(container, camera, renderer);
  }, false);
}

function resizeRenderer(container, camera, renderer) {
  // const width = container.offsetWidth || window.innerWidth;
  // const height = container.offsetHeight || window.innerHeight;

  const width = container.offsetWidth || window.innerWidth;
  const height = container.offsetHeight || window.innerHeight;


  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function createHoverCard(container, labelTemplateId = null) {
  const element = document.createElement('div');

  let template = ``;

  if (labelTemplateId) {
    const templateElement = document.getElementById(labelTemplateId);

    template = templateElement.innerHTML
  }

  function renderLabelTemplate(data = {}) {
    const renderedTemplate = renderTemplate(template, { data });

    element.innerHTML = renderedTemplate;
  }

  renderLabelTemplate()

  element.style.cssText = `
    visibility: hidden;
    position: fixed;
    width: max-content;
    height: max-content;
    transition:  opacity 0.4s;
  `;

  container.appendChild(element);

  return {
    show(positionX, positionY, options) {
      const { data } = options;

      renderLabelTemplate(data);

      const rect = element.getBoundingClientRect();

      const { x, y } = adjustCoordinates(positionX, positionY + 25, rect.width, rect.height);

      element.style.top = `${y}px`;
      element.style.left = `${x}px`;
      element.style.visibility = "visible";
      element.style.opacity = "1";
    },
    hide() {
      element.style.visibility = "hidden";
      element.style.opacity = "0";
    }
  }
}