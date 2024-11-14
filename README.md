# Petrix - A Digital Pet Matrix

A virtual pet simulation built using **Three.js.** The simulation includes an interactive 3D environment with various animated objects, such as a virtual pet sheep that can perform random actions, display needs icons (e.g., hunger, hygiene, happiness), and has a day-night cycle that dynamically changes the background color.

![image-0](docs/overview.png)

## Demo / Getting Started

Clone the repository:

```bash
git clone https://github.com/smalex-z/Petrix
```

```bash 
npm init -y
```
We will install `Three.js` and `vite` by running:
```bash
# three.js
npm install --save three

# vite
npm install --save-dev vite

# run
npx vite
```

---

## Controls:

Mouse, Keyboard

---

## Features
**3D Virtual Pet:** A sheep character that performs random actions, moves within a defined radius, and responds to user interactions (feeding, cleaning, playing).

**Dynamic Status System:** Tracks pet’s life, hunger, hygiene, and happiness, which degrade over time and can be restored by interacting with the pet.
Interactive Needs Icons: Displays icons for the pet’s needs (hunger, hygiene, happiness) above its head, with a blinking effect.

**Day/Night Cycle:** Automatically transitions the background between day and night based on planetary rotations.

**Planets Orbit:** Simulates a simple solar system with planets orbiting a green environment in the background.

**Customizable Controls:** Orbit controls for camera movement, and the option to lock the camera onto planets for a close-up view.

---

## Project Structure

```
.
├── JS/
│   ├── pet.js              # Defines the virtual pet object and structure.
│   ├── sceneSetup.js       # Sets up the Three.js scene, camera, renderer, and controls.
│   ├── planets.js          # Creates and manages planets and their orbit animations.
│   ├── status.js           # Manages pet status, icon display, and status update intervals.
│   ├── icons.js            # Creates and positions icons for hunger, hygiene, and happiness.
│   ├── movement.js         # Contains functions for pet movement and action logic.
│   ├── dayNight.js         # Manages the day-night cycle based on planet positions.
│   ├── lighting.js         # Sets up ambient and directional lighting.
│   └── utils.js            # Contains utility functions for matrix transformations.
├── main.js                 # Main script to manage rendering and animations.
└── index.html              # Main HTML file with controls and canvas for rendering.
```
