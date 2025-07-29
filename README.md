# 🧠 AI-Powered Rubik's Cube Vision Solver

**An intelligent web app that uses AI to scan, solve, and teach the Rubik's Cube. Features computer vision with a custom Roboflow model for color detection, an API for solving algorithms, and interactive 3D solution tutorials.**

---

![Cube Solver Banner](https://placehold.co/1200x400/1a202c/71faef?text=AI+Cube+Vision&font=raleway)

## 🌟 Introduction

This project is a modern, AI-driven web application designed to be the ultimate companion for Rubik's Cube enthusiasts. It leverages a powerful, custom-trained computer vision model to bridge the gap between a physical, scrambled cube and its digital solution. Users can simply present their cube to the application, and the AI pipeline will recognize the color configuration, query a solver API for the most efficient solution, and then teach the user the solution through an interactive 3D visualization.

## ✨ Core Features

* **🤖 AI Vision Scanner:** Utilizes a custom computer vision model trained with **Roboflow** to accurately identify the location and color of each sticker from an uploaded image.
* **💡 External Solver API Integration:** Once the cube's state is determined, the application communicates with a dedicated API to fetch the optimal solving algorithm.
* **🎓 Interactive 3D Tutorials:** The app renders your scrambled cube in a fully interactive **3D environment** and animates each move of the solution, allowing you to follow along at your own pace.
* **📚 Algorithm Library:** Explore a built-in library of common Rubik's Cube algorithms to deepen your understanding and improve your speed.

## 🛠️ Core Technologies

| Technology | Role & Description |
| :--- | :--- |
| **AI / Computer Vision** | A custom **Roboflow** model performs object detection and classification to read the cube's state. |
| **Solver API** | An external API provides the core solving logic, returning the optimal move sequence. |
| **3D Rendering** | The front-end uses 3D graphics to render the cube and animate the solution tutorial. |
| **Web App Framework** | Built as a modern, single-page web application. |

## ⚙️ Application Workflow

1.  **Image Upload:** The user provides images of the six faces of the scrambled cube.
2.  **AI Model Inference:** The custom **Roboflow** model is executed in the browser, returning the detected colors and their positions for each face.
3.  **State Reconstruction:** The application processes the detection results to build a complete digital representation of the cube's state.
4.  **API Solver Request:** The state string is sent to the external solving API.
5.  **Solution Reception:** The API responds with an optimized sequence of moves.
6.  **3D Visualization:** The initial scrambled state is rendered in **3D**, and the user can play through the received solution step-by-step.

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v16 or later)
* npm

### Installation

1.  **Clone the repo**
    ```sh
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    ```
2.  **Navigate to the project directory**
    ```sh
    cd your-repo-name
    ```
3.  **Install NPM packages**
    ```sh
    npm install
    ```
4.  **Run the application**
    ```sh
    npm start
    ```
    The app will be available at `http://localhost:3000`.

## 🎯 Future Goals

- [ ] Implement a virtual cube that can be scrambled and solved manually.
- [ ] Add a timer for speedcubing practice.
- [ ] Expand the algorithm library with more advanced methods.
- [ ] Support different types of puzzles (e.g., 2x2, 4x4 cubes).

---

*This project was built to explore the intersection of modern web development, AI-driven computer vision, and algorithm visualization.*
