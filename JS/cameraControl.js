// cameraControl.js
import { camera, controls, defaultCamPos, defaultLook } from './globalVar.js';
import { translationMatrix } from './utils.js';
import * as THREE from 'three';

let attachedObject = null;
let blendingFactor = 0.1;

// Implement the camera attachment given the key being pressed
function handleCameraAttachment(event) {
    switch (event.key) {
        case '3': // Attach camera to Planet 3
            attachedObject = 0; // Index for Planet 3
            controls.enabled = false;
            break;
        case '4': // Attach camera to Planet 4
            attachedObject = 1; // Index for Planet 4
            controls.enabled = false;
            break;
        case '0': // Detach camera and return to default view
            detachCamera();
            break;
    }
}

// Detach camera and reset to default view
function detachCamera() {
    attachedObject = null;
    camera.position.copy(defaultCamPos); // Default position
    camera.lookAt(defaultLook); // Look at the origin
    controls.enabled = true; // Enable orbit controls
}

function updateCameraPosition(index, planet, model_transform) {
    // Camera attachment logic here, when certain planet is being attached, we want the camera to be following the planet by having the same transformation as the planet itself. No need to make changes.
    if (attachedObject === index) {
        let cameraTransform = new THREE.Matrix4();

        // Copy the transformation of the planet (Hint: for the wobbling planet 3, you might have to rewrite to the model_tranform so that the camera won't wobble together)
        cameraTransform.copy(model_transform);

        // Add a translation offset of (0, 0, 10) in front of the planet
        let offset = translationMatrix(0, 0, 10);
        cameraTransform.multiply(offset);

        // Apply the new transformation to the camera position
        let cameraPosition = new THREE.Vector3();
        cameraPosition.setFromMatrixPosition(cameraTransform);
        camera.position.lerp(cameraPosition, blendingFactor);

        // Make the camera look at the planet
        let planetPosition = new THREE.Vector3();
        planetPosition.setFromMatrixPosition(planet.matrix);
        camera.lookAt(planetPosition);

        // Disable controls
        controls.enabled = false;
        // TODO: If camera is detached, slowly lerp the camera back to the original position and look at the origin
    } else if (attachedObject === null & !controls.enabled) {
        camera.position.lerp(defaultCamPos, 0.1);
        camera.lookAt(defaultLook);
        // Enable controls
        controls.enabled = true;
    }
}

export { handleCameraAttachment, updateCameraPosition };