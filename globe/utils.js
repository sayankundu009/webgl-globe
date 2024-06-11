import * as THREE from 'three';
import { geoInterpolate } from 'd3-geo';
import { GLOBE_RADIUS, CURVE_MIN_ALTITUDE, CURVE_MAX_ALTITUDE } from './constants';

const DEGREE_TO_RADIAN = Math.PI / 180;

export function clamp(num, min, max) {
  return num <= min ? min : (num >= max ? max : num);
}

export function coordinateToPosition(lat, lng, radius) {
  const phi = (90 - lat) * DEGREE_TO_RADIAN;
  const theta = (lng + 180) * DEGREE_TO_RADIAN;

  return new THREE.Vector3(
    - radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

export function getSplineFromCoords(coords) {
  const startLat = coords[0];
  const startLng = coords[1];
  const endLat = coords[2];
  const endLng = coords[3];

  // spline vertices
  const start = coordinateToPosition(startLat, startLng, GLOBE_RADIUS);
  const end = coordinateToPosition(endLat, endLng, GLOBE_RADIUS);
  const altitude = clamp(start.distanceTo(end) * .35, CURVE_MIN_ALTITUDE, CURVE_MAX_ALTITUDE);
  const interpolate = geoInterpolate([startLng, startLat], [endLng, endLat]);
  const midCoord1 = interpolate(0.25);
  const midCoord2 = interpolate(0.75);
  const mid1 = coordinateToPosition(midCoord1[1], midCoord1[0], GLOBE_RADIUS + altitude);
  const mid2 = coordinateToPosition(midCoord2[1], midCoord2[0], GLOBE_RADIUS + altitude);

  return {
    start,
    end,
    spline: new THREE.CubicBezierCurve3(start, mid1, mid2, end)
  };
}

// export function getSplineFromCoords(coords, altitudeFactor = 1.5) {
//   const startLat = coords[0];
//   const startLng = coords[1];
//   const endLat = coords[2];
//   const endLng = coords[3];

//   // spline vertices
//   const start = coordinateToPosition(startLat, startLng, GLOBE_RADIUS);
//   const end = coordinateToPosition(endLat, endLng, GLOBE_RADIUS);
//   const distance = start.distanceTo(end);
//   const altitude = clamp(distance * altitudeFactor, CURVE_MIN_ALTITUDE, CURVE_MAX_ALTITUDE);
//   const interpolate = geoInterpolate([startLng, startLat], [endLng, endLat]);
//   const midCoord = interpolate(0.5);
//   const mid = coordinateToPosition(midCoord[1], midCoord[0], GLOBE_RADIUS + altitude);

//   return {
//     start,
//     end,
//     spline: new THREE.QuadraticBezierCurve3(start, mid, end)
//   };
// }


export function renderTemplate(template, data) {
  const regex = /\{\{([^{}]+)\}\}/g;

  const renderedTemplate = template.replace(regex, (match, key) => {
    const keys = key.trim().split('.');

    let value = data;

    for (const k of keys) {
      value = value[k];
    }

    return value;
  });

  return renderedTemplate;
}

export function adjustCoordinates(x, y, width, height) {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  if (x + width > viewportWidth) {
    x = viewportWidth - width;
  }

  if (y + height > viewportHeight) {
    y = viewportHeight - height;
  }

  x = Math.max(0, x);
  y = Math.max(0, y);

  return { x, y };
}

export function onElementVisible(element, callback, once = false) {
  let callbackExecuted = false;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !callbackExecuted) {
        callback();
        callbackExecuted = true;
        observer.disconnect();
      }
    });
  });

  observer.observe(element);
}

export function elementIsVisible(element) {
  const rect = element.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

export function throttle(func, limit) {
  let lastFunc;
  let lastRan;

  return function () {
    const context = this;
    const args = arguments;

    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function () {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  }
}

export function debounce(func, wait) {
  let timeout;

  return function (...args) {
    const context = this;

    clearTimeout(timeout);

    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}