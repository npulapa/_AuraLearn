# 🎨 AuraDraw – AI-Powered Hand Gesture Drawing and Shape Recognition

## Overview

AuraDraw is an AI-powered educational web application that enables children and beginners to draw shapes, objects, letters, and numbers using hand gestures or a mouse. The application recognizes the drawing using Artificial Intelligence and instantly provides the name of the detected object along with an educational YouTube video related to it.

The primary goal of AuraDraw is to make learning interactive, engaging, and fun by combining Computer Vision, Artificial Intelligence, and Educational Content.

---

# Features

### ✨ AI Drawing Recognition

* Detects hand-drawn sketches using AI.
* Recognizes:

  * Basic Shapes
  * Complex Shapes
  * Animals
  * Fruits
  * Vehicles
  * Household Objects
  * Letters (A–Z)
  * Numbers (0–9)
  * Symbols
  * Custom drawings

---

### 🖐 Hand Gesture Drawing

* Draw in the air using your finger.
* Uses webcam for real-time hand tracking.
* Smooth drawing experience.
* Mouse drawing available as fallback.

---

### 🤖 AI Prediction

* Uses Google Gemini Vision API to analyze the drawing.
* Returns:

  * Predicted object name
  * Confidence score (if available)
  * Educational category

Example:

```
Drawing → Flower

Prediction

Flower 🌸

Learning Category

Nature
```

---

### 📺 Educational Video Recommendation

After prediction, AuraDraw automatically searches for a related educational YouTube video.

Examples

| Prediction | Recommended Video     |
| ---------- | --------------------- |
| Circle     | Circle Shape for Kids |
| Cat        | Learn About Cats      |
| Apple      | Apple Fruit for Kids  |
| Butterfly  | Butterfly Life Cycle  |
| Letter A   | Learn Letter A        |
| Number 5   | Counting Number 5     |

The selected video is embedded directly inside AuraDraw without opening YouTube separately.

---

### 📚 Learn Section

The Learn page contains:

* Educational Videos
* Drawing Examples
* Shape Information
* Learning Cards
* Interactive UI

---

### 📜 Drawing History

Stores previous drawings including:

* Drawing Preview
* Prediction
* Date & Time
* Learning Video

---

### ⚙ Settings

* Dark Mode
* Theme Selection
* Camera Controls
* Drawing Settings

---

# Technologies Used

## Frontend

* React
* TypeScript
* Vite
* TanStack Router
* Tailwind CSS
* Shadcn/UI
* Framer Motion
* Lucide Icons

---

## AI

* Google Gemini Vision API

---

## Computer Vision

* MediaPipe Hands
* HTML5 Canvas
* Webcam API

---

## Backend

* Node.js
* Server Functions
* Fetch API

---

## Video Integration

* YouTube Data API v3
* Embedded YouTube Player

---

## Storage

* Browser Local Storage
* Session Storage

---

# Project Structure

```
AuraDraw/

│
├── src/
│
├── components/
│      UI Components
│
├── routes/
│      Home
│      Draw
│      Learn
│      History
│      Settings
│
├── lib/
│      predict.functions.ts
│      shape-predict.ts
│      youtube.ts
│
├── server.ts
│
├── styles.css
│
├── package.json
│
└── README.md
```

---

# Application Workflow

```
Start

↓

Home Page

↓

Start Drawing

↓

Enable Webcam

↓

MediaPipe Detects Hand

↓

Draw in Air

↓

Canvas Image Generated

↓

Gemini Vision API

↓

Object Prediction

↓

YouTube API Search

↓

Educational Video Retrieved

↓

Prediction + Video Displayed

↓

Saved in History

↓

End
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/AuraDraw.git
```

---

## Navigate

```bash
cd AuraDraw
```

---

## Install Dependencies

```bash
npm install
```

---

## Environment Variables

Create a `.env` file.

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY
```

---

## Run Development Server

```bash
npm run dev
```

Open:

```
http://localhost:5173
```

---

# How It Works

### Step 1

User opens AuraDraw.

↓

### Step 2

Chooses **Start Drawing**.

↓

### Step 3

Allows webcam permission.

↓

### Step 4

Uses finger to draw.

↓

### Step 5

Drawing is captured on canvas.

↓

### Step 6

Canvas image is sent to Gemini Vision API.

↓

### Step 7

Gemini predicts the drawing.

↓

### Step 8

Prediction is displayed.

↓

### Step 9

AuraDraw searches YouTube Data API.

↓

### Step 10

The first educational and embeddable video is retrieved.

↓

### Step 11

Video plays directly inside AuraDraw.

↓

### Step 12

Prediction is saved in History.

---

# Screens

* 🏠 Home
* ✍ Draw
* 📚 Learn
* 📜 History
* ⚙ Settings

---

# Future Enhancements

* Voice guidance
* AI drawing correction
* Drawing difficulty levels
* Multiplayer learning
* Teacher dashboard
* Student profiles
* Progress analytics
* Quiz mode
* Offline AI model
* Multiple language support
* Speech recognition
* Handwriting recognition
* Reward badges
* Cloud synchronization
* PDF progress reports

---

# Advantages

* Interactive learning experience
* Improves creativity
* Enhances hand-eye coordination
* AI-powered object recognition
* Child-friendly interface
* Real-time educational feedback
* Supports gesture and mouse input
* Easy to use
* Modern responsive design
* Encourages self-learning

---

# Applications

* Primary Schools
* Kindergarten
* Smart Classrooms
* E-learning Platforms
* Home Learning
* Special Education
* Educational Games
* AI Learning Applications

---

# Requirements

### Software

* Node.js (v18 or later)
* npm
* Modern Web Browser
* Webcam
* Internet Connection

### Browser Support

* Google Chrome
* Microsoft Edge
* Brave
* Firefox
* Safari

---

# Contributors

**Developer:** Nandini Pulapa

**Project:** AuraDraw – AI-Powered Hand Gesture Drawing and Shape Recognition

---

# License

This project is licensed under the MIT License.

---

# Acknowledgements

Special thanks to the open-source communities and technologies that made AuraDraw possible:

* React
* Vite
* TypeScript
* Tailwind CSS
* Shadcn/UI
* MediaPipe Hands
* Google Gemini API
* YouTube Data API v3
* HTML5 Canvas
* TanStack Router
* Lucide Icons

---

# Conclusion

AuraDraw transforms traditional drawing into an AI-powered learning experience. By combining hand gesture recognition, intelligent image understanding, and educational multimedia, the application allows children to learn through creativity. Users can draw virtually anything—from simple geometric shapes to animals, fruits, letters, and numbers—and immediately receive accurate AI predictions along with related educational videos. AuraDraw demonstrates how Artificial Intelligence and Computer Vision can be used to create engaging, interactive, and personalized learning experiences for learners of all ages.
