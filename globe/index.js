import { init as initScene } from './scene';
import { init as initSphere } from './sphere';
import { init as initPaths } from './paths';

const adjectives = ['Red', 'Green', 'Blue', 'Yellow', 'Purple', 'Orange', 'Black', 'White'];
const nouns = ['Car', 'House', 'Tree', 'Mountain', 'Ocean', 'Sky', 'Sun', 'Moon'];

function generateRandomName() {
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${randomAdjective} ${randomNoun}`;
}

function generateRandomCoordinates(howMany = 0) {
  const coordinates = [];

  for (let i = 0; i < howMany; i++) {
    const latitude = Math.random() * 180 - 90; // Range from -90 to 90
    const longitude = Math.random() * 360 - 180; // Range from -180 to 180
    const altitude = Math.random() * 50; // Altitude range
    const accuracy = Math.random() * 200; // Accuracy range

    coordinates.push({
      data: { title: generateRandomName() },
      coordinates: [latitude, longitude, altitude, accuracy]
    });
  }

  return coordinates;
}

export default function initGlobe(container, options) {
  initScene(container, options);

  initSphere();

  setTimeout(() => {
    let data = [];

    if (options.jsonTemplateId) {
      const templateElement = document.getElementById(options.jsonTemplateId);

      const json = JSON.parse(templateElement.innerHTML);

      data = json;
    } else {
      // data = generateRandomCoordinates(6);
    }

    initPaths(data, { container });
  }, 500)
}
