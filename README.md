# Three.js from Scratch

**Live:** https://iodiot.github.io/3d-tutorial/

A step-by-step tutorial series on 3D for the web with Three.js, WebGL and WebGPU, written for frontend developers. Every part has diagrams, real screenshots and a live demo.

| Part | Article | Demo |
|---|---|---|
| 1 | [Your First Scene](https://iodiot.github.io/3d-tutorial/part-1-first-scene/): scene, camera, renderer, lights, animation loop, resizing, OrbitControls | [live](https://iodiot.github.io/3d-tutorial/demos/part-1/) · [code](demos/part-1/) |
| 2 | [Geometry, Materials and Textures](https://iodiot.github.io/3d-tutorial/part-2-geometry-materials-textures/): BufferGeometry, normals, the built-in materials, roughness and metalness, UVs, colour spaces, wrapping, normal and roughness maps | [live](https://iodiot.github.io/3d-tutorial/demos/part-2/) · [code](demos/part-2/) |
| 3 | Real models, shadows and environment light | coming next |
| 4 | Shaders | planned |
| 5 | WebGPU | planned |

The demos use Three.js r186 (`three@0.186.1`) from jsDelivr through an import map, so each one is a single HTML file you can copy and serve locally.

## Layout

```
posts/part-N-<slug>.md   articles (Markdown with inline HTML for figures and demo embeds)
images/part-N/           diagrams (SVG) and screenshots (WebP) for each part
demos/part-N/            standalone live demos and step-by-step files, copied as-is
series.json              series title and the list of planned parts
site/style.css           styles
build.mjs                static site builder (markdown-it + highlight.js)
```

Build: `npm install && npm run build` writes the site to `dist/`, which is published on the `gh-pages` branch.

## License

Text and images © Mike Smahin. Demo and build code: MIT.
