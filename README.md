# 🔗 KnotLab — Advanced Knot Theory Visualizer

**Developed by Muhammad Omar Rasin — [omarasinyt@gmail.com](mailto:omarasinyt@gmail.com)**  
**🌐 [Live Site](https://v0-knot-theory-visualizer.vercel.app/)**

---

## 🎓 Overview

**KnotLab** is a cutting-edge, fully client-side **knot theory sandbox** designed for advanced mathematical visualization and interactive topological exploration. Combining the elegance of parametric equations with real-time WebGL rendering, **KnotLab** bridges deep mathematical theory with modern frontend engineering.

This project showcases my passion for mathematical topology, parametric geometry, and performant 3D rendering — all orchestrated within a robust, scalable, and beautiful single-page application.

---

## ✨ Features

### 🏠 **Immersive Homepage**

- Fullscreen animated **radial gradient** from deep navy to royal purple.
- Dynamic, pulsing orbs in cyan, magenta, and ultraviolet tones.
- Centered site title **“KnotLab”** with gradient typography and serif elegance.
- Large **“Start Exploring”** CTA with scale, glow, and hover transitions.
---

### 🎛️ **Sophisticated Control Panel**

- **Predefined Knots**: Trefoil, Figure-Eight, Cinquefoil, Hopf Link, (7,2) Torus Knot.
- **Custom Knot Generator**: Define parametric equations _x(t)_, _y(t)_, _z(t)_ with real-time validation and sandboxed evaluation.
- **Equation Syntax Highlighting** and balanced parentheses checking to prevent degenerate or open curves.
- Instant feedback for domain mismatches, periodicity, and closed-loop enforcement.

---

### 🧮 **In-Depth Mathematical Analysis**

- **Real Parametric Formulas** displayed in monospace notation.
- **Knot Invariants**:
  - *Crossing Number* — computed diagrammatically.
  - *Writhe* — approximated using the discrete Gauss linking integral.
  - *Genus* — estimated via Seifert surface algorithms.
  - *Alexander & Jones Polynomials* — with classical _q_-polynomial notation.

- Dynamic tooltips explaining topological significance and computational approximations.

---

### 🌀 **3D Visualization Engine**

- Built with **React Three Fiber**, leveraging efficient WebGL pipelines.
- **TubeGeometry** with high-segment splines (400+ segments) for smooth curvature.
- Custom **Catmull-Rom interpolation** for continuous derivatives.
- **Environment lighting**, metallic shaders, and emissive materials for high-fidelity visuals.
- Fully interactive:
  - **Orbit Controls** — rotate, zoom, and pan with inertial damping.
  - **Auto-Rotation** with smoothly interpolated angular velocity.
  - Directional arrows indicating knot orientation, colored using gradient mapping.

---

### ⚙️ **Advanced Computational Algorithms**

- **Gauss linking approximation** for writhe calculation.
- **Curve closure validator**: checks _f(0) ≈ f(2π)_ within epsilon tolerance.
- **Self-intersection detection** for verifying knot primality.
- **Polynomial estimators** using determinant and skein relation methods.
- **Custom expression parser** ensures runtime safety and isolates malicious input.

---

### 🎨 **High-End User Interface**

- Dark mode with **glassmorphism** overlays and backdrop blur.
- Responsive **grid layout** adapting from quad-column desktop view to mobile-friendly stacks.
- Smooth state transitions, fade-in animations, and hover-responsive neon accents.
- Consistent typographic hierarchy: elegant serif for headings, monospace for equations.

---

### 🚀 **Tech Stack**

- **Next.js 14 App Router** — modern SSR and code splitting.
- **React 18 with Hooks & Context** — reactive UI and state management.
- **TypeScript** — end-to-end static type safety.
- **Tailwind CSS** — utility-first styling for rapid, consistent design.
- **React Three Fiber + Drei** — declarative WebGL bindings for high-performance 3D.

---

## 📐 **Mathematical & Programming Highlights**

- Advanced use of **parametric curve theory**, topological invariants, and **Reidemeister moves** for educational value.
- Custom knot generation sandbox using safe expression parsing and dynamic function constructors.
- Real-time numerical evaluation pipeline optimized with memoization and React concurrency.
- Complex lighting models and anti-aliasing for artifact-free rendering.

---

## 🎯 **Why KnotLab Matters**

This project is more than a visualizer — it’s a hands-on mathematical lab for anyone curious about the elegant complexity of knots. It demonstrates:

✅ Mastery of advanced math concepts  
✅ Application of 3D computer graphics theory  
✅ Clean, maintainable, type-safe frontend code  
✅ High-performance rendering and interaction

---
