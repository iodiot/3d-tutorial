# Three.js from Scratch

**Live:** https://iodiot.github.io/3d-tutorial/

A step-by-step tutorial series on 3D for the web with Three.js, WebGL and WebGPU, written for frontend developers. Every part has diagrams, real screenshots and a live demo.

| Part | Article | Demo |
|---|---|---|
| 1 | [Your First Scene](https://iodiot.github.io/3d-tutorial/part-1-first-scene/): scene, camera, renderer, lights, animation loop, resizing, OrbitControls | [live](https://iodiot.github.io/3d-tutorial/demos/part-1/) · [code](demos/part-1/) |
| 2 | [Geometry, Materials and Textures](https://iodiot.github.io/3d-tutorial/part-2-geometry-materials-textures/): BufferGeometry, normals, the built-in materials, roughness and metalness, UVs, colour spaces, wrapping, normal and roughness maps | [live](https://iodiot.github.io/3d-tutorial/demos/part-2/) · [code](demos/part-2/) |
| 3 | [Models, Light and Shadows](https://iodiot.github.io/3d-tutorial/part-3-models-shadows-environment/): GLTFLoader and loadAsync, Draco/KTX2/meshopt, traversing the scene graph, fitting with Box3, AnimationMixer and Timer, RoomEnvironment, HDR environments, tone mapping and exposure, shadow maps, fitting the shadow camera, bias and normalBias, ShadowMaterial | [live](https://iodiot.github.io/3d-tutorial/demos/part-3/) · [code](demos/part-3/) |
| 4 | [Your First Shaders](https://iodiot.github.io/3d-tutorial/part-4-shaders/): ShaderMaterial and GLSL basics, vertex and fragment shaders, uniforms (time, mouse, colour), varyings and UVs, vertex displacement, normals by finite differences, gradients, value noise and fbm, fresnel rim, onBeforeCompile and customDepthMaterial, GLSL vs WGSL vs TSL | [live](https://iodiot.github.io/3d-tutorial/demos/part-4/) · [code](demos/part-4/) |
| 5 | WebGPU and TSL: WebGPURenderer, node materials, TSL and compute | coming next |

The demos use Three.js r186 (`three@0.186.1`) from jsDelivr through an import map, so each one is a single HTML file you can copy and serve locally.

## Layout

```
posts/part-N-<slug>.md   articles (Markdown with inline HTML for figures and demo embeds)
images/part-N/           diagrams (SVG + PNG), screenshots (WebP), demo GIF and social card for each part
demos/part-N/            standalone live demos and step-by-step files, copied as-is
series.json              series title and the list of planned parts
site/style.css           styles
build.mjs                static site builder (markdown-it + highlight.js)
```

Build: `npm install && npm run build` writes the site to `dist/`, which is published on the `gh-pages` branch.

## License

Text and images © Mike Smahin. Demo and build code: MIT. Third-party assets used by the demos (the Part 3 fox model and HDR) keep their own licences, listed in [demos/part-3/CREDITS.md](demos/part-3/CREDITS.md).
