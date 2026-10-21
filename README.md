# 🐝 Apis mellifera — Ultra-Realism 3D Anatomical Atlas (Flat GitHub Upload)

All files in this folder are flat (no sub-folders) for simple drag-and-drop upload directly to GitHub via the web interface.

---

## 🚀 How to Host on GitHub Pages (Web Upload in 1 Minute)

1. Go to [github.com](https://github.com) and create a **New Repository** (e.g. `apis-mellifera-atlas`).
2. Click **"Upload files"** (or **"Add file" → "Upload files"**).
3. Drag and drop all the files from this folder directly into the GitHub upload area:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `.nojekyll`
   - `README.md`
   - `apis_mellifera_atlas.html`
   - (and other files in this folder)
4. Click **"Commit changes"**.
5. In your repository, go to **Settings → Pages**.
6. Under **Branch**, select `main` (or `master`) and `/ (root)`, then click **Save**.
7. In ~30 seconds, your 3D atlas will be live at:
   `https://<your-username>.github.io/<repository-name>/`

---

## 📂 Included Flat Files (No Sub-Folders)

* `index.html` — The main website entry point loaded by GitHub Pages.
* `styles.css` — Museum glassmorphic styles, DoF bokeh vignette, and sliders.
* `app.js` — Complete Three.js 3D application bundle (datasets + PBR models + controller).
* `apis_mellifera_atlas.html` — Portable, self-contained single-file version.
* `anatomy_data.js` — Full scientific dataset (75 anatomical structures, 3 castes, 9 dissection modes).
* `three_models.js` — Procedural PBR chitin, 3D setae hair, individual 3D pollen, and organ builders.
* `app_controller.js` — WebGL camera, raycaster, clipping plane slicers, and 10-stage cinematic tour.
* `anatomy_guide.md` — Detailed scientific monographs and anatomical reference documentation.
* `.nojekyll` — Ensures GitHub Pages serves all static files directly.
* `.gitignore` & `package.json` — Git ignore settings and local development scripts (`npx serve .`).
* `LICENSE` — Open-source MIT license.

---

## 🔬 Features Overview

* **4 Interactive Modules**: Whole-Bee & 8 Dissection Layers (27 labels), Internal Organ Systems (24 structures), Mouthparts Complex (15 structures), and Sting Apparatus (9 structures).
* **Caste Comparison**: Worker (♀), Queen (♛), and Drone (♂) with dynamic 3D allometric morphing and caste-specific reproductive organs.
* **Ultra-Realism Graphics**: Physically Based Rendering (PBR) chitin, thousands of hexagonal ommatidia with eye tracking, 20 hamuli wing hooks with thin-film iridescence, 5,500+ individual 3D hair strands, and 1,200+ 3D pollen grains.
* **Cinematic Controls**: 100mm–180mm Macro Lens with optical DoF bokeh, 9 Dissection Modes, 0.2x Slow-Motion simulation, continuous Exploded View, and a 10-Stage Auto Showcase Tour.
