import manifestJson from "../manifest.json";

function displayWelcomeMessage() {
  console.info(`🧩 Using ${manifestJson.name} ${manifestJson.version}.`);
}

export { displayWelcomeMessage };