---
name: slide-skill
description: Use this skill as reference material when creating or editing presentation slide decks.
---

# Slides Skill

Use this skill as reference material when creating or editing presentation slide decks.

## Skill Folder Contents

Contents of the `slides/` skill folder:

- `container_tools/`: Standalone python scripts for slides and relevant asset manipulation.
- `artifact_tool/`: API documentation and coding examples for the artifact tool library.
- `pptxgenjs_helpers/`: JavaScript helpers for PptxGenJS.
- `slide_templates/`: Optional slide templates to use; see `slide_templates/Overview.png` to get started.

## Implementation

You MUST use PptxGenJS to implement the slide deck. Even when the user provides a template (or you use a built-in one), you MUST still generate the deck with PptxGenJS and adhere to the template’s visual style, typography, spacing, color palette, and layout conventions. The only exception is for trivial quick-edit requests, where you may use `python-pptx` or `artifact_tool`.

We also provide OpenAI-specific helper scripts under `pptxgenjs_helpers/` to make it easier to use the upstream open-source library. Import and use these helpers; do not copy-paste their code into your deliverable source files.

Work in your own working directory while coding. Only copy artifacts to the requested locations after you finish building and validating the slides.

## Container Tools

- `ensure_raster_image.py`: Ensure images are rasterized; convert to PNG if needed; quick usage `--input_files <img_path1> ...`.
- `render_slides.py`: render a PowerPoint file into a folder of PNG slides using default sizing; quick usage: `<input.pptx>`. Output files are named `slide-1.png`, `slide-2.png`, ... in a directory with the same name as the input file.
- `create_montage.py`: build a tiled montage from images in a directory (for viewing multiple image assets or rendered slides at once); quick usage: `--input_dir <imgs_dir> --output_file <montage.png>`. It supports most image formats with auto conversion under the hood.
- `slides_test.py`: detect content overflowing the original slide canvas; usage: `<input.pptx>`.

Run each script with `-h` to view detailed usage info.

## Demo screenshots

For high-resolution browser demo screenshots, use:

```bash
agent-browser --headed open http://127.0.0.1:3000 && agent-browser set viewport 2560 1440 && agent-browser wait --load networkidle && agent-browser screenshot --full artifacts/slide-demo.png
```

## Helpers API

Version: 1.2.0 (from `pptxgenjs_helpers/index.js`)

- autoFontSize: Approximate a font size that fits text into a fixed box.
  - Usage: `slide.addText(textOrRuns, autoFontSize(textOrRuns, fontFace, { x, y, w, h, fontSize?, minFontSize?, maxFontSize?, mode? }))`
- calcTextBox: Measure text into a box and return `addText` options for a given font size.
  - Usage: `slide.addText(textOrRuns, calcTextBox(fontSizePt, { text: textOrRuns, w, fontFace, ...opts }))`
- calcTextBoxHeightSimple: Estimate text-box height from font size and line count.
  - Usage: `const h = calcTextBoxHeightSimple(fontSizePt, numLines, leading?, padding?)`
- imageSizingCrop: Place an image by center-cropping to fill a target box. Accepts a filesystem `path` or `data` (data URI, raw SVG string, or Buffer), and likewise for the APIs below that take `pathOrData`
  - Usage: `slide.addImage({ path|data, ...imageSizingCrop(pathOrData, x, y, w, h) })`
- imageSizingContain: Place an image fully visible within a target box, preserving aspect.
  - Usage: `slide.addImage({ path|data, ...imageSizingContain(pathOrData, x, y, w, h) })`
- svgToDataUri: Convert a sanitized SVG string to a data URI for `addImage`.
  - Usage: `slide.addImage({ data: svgToDataUri(svgString), x, y, w, h })`
- latexToSvgDataUri: Render LaTeX as SVG and return a data URI for vector text.
  - Usage: `slide.addImage({ data: latexToSvgDataUri(texString), x, y, w })`
- getImageDimensions: Return `{ width, height, aspectRatio, type }` for a file path or data.
  - Usage: `const { aspectRatio } = getImageDimensions(pathOrData)`
- safeOuterShadow: Return a safe outer shadow config that avoids invalid DrawingML.
  - Usage: `slide.addText(text, { shadow: safeOuterShadow(), ... })`
- codeToRuns: Convert source code into rich text runs for syntax-highlighted `addText`.
  - Usage: `slide.addText(codeToRuns(code, lang), { x, y, w, h })`
- warnIfSlideHasOverlaps: Log warnings when elements overlap on a slide.
  - Usage: `warnIfSlideHasOverlaps(slide, pptx)`
- warnIfSlideElementsOutOfBounds: Warn when elements are outside or touching slide bounds.
  - Usage: `warnIfSlideElementsOutOfBounds(slide, pptx)`
- alignSlideElements: Align selected elements to edges or centers.
  - Usage: `alignSlideElements(slide, indices, "left"|"right"|"top"|"bottom"|"hcenter"|"vcenter")`
- distributeSlideElements: Evenly space selected elements horizontally/vertically.
  - Usage: `distributeSlideElements(slide, indices, "horizontal"|"vertical")`

## Page size

- Set the page size to 16:9 (13 1/3 × 7.5 inches, PptxGenJS `LAYOUT_WIDE`) by default, unless a
  different aspect ratio is explicitly required.
  For example, if the user uploads a 4:3 slide image and asks you to recreate it, set the page size to 4:3 (not 16:9).
  If you are not defining the page size, derive the
  page size using `getSlideDimensions`. Prefer `(7.5 / 9) * 16` over `13.33` for exact computation.

## Visuals

- When using `addImage`, avoid the built-in `sizing` argument due to known bugs.
- Instead, use these helpers for image placement:
  - Crop (default): `imageSizingCrop` enlarges and center-crops to fit most images. Adjust crop parameters as needed if the subject is not centered in the frame.
  - Contain: `imageSizingContain` keeps important images (e.g., plots or text) fully visible.
  - Stretch: for textures or backgrounds, call `addImage` directly without the helpers.
- Note: The helpers compute safe sizing/crop values; do not add a separate `sizing` field alongside them.
- Inputs: helpers accept filesystem paths, data URIs, raw SVG strings, or Buffers. For remote images, download or data‑URI encode first.
- Mirroring (left–right flip): pass `flipH: true` to `addImage({ ..., flipH: true })`.

## Slide layout helpers

Strive for strong spatial consistency and balance. Use these helpers to detect and correct layout issues:

- `warnIfSlideHasOverlaps(slide, pptx)`: Detects overlapping elements; cropped images use the
  viewport; diagonal-line false positives filtered; no “pass” logs.
- `warnIfSlideElementsOutOfBounds(slide, pptx)`: Flags items outside the canvas; uses EMU→inch
  conversion and throws if slide size is unknown.
- `alignSlideElements(slide, indices, alignment)`: Precisely align selected elements
  (left/right/top/bottom/centers) to enforce tidy columns/rows for shapes (text boxes, images,
  icons).
- `distributeSlideElements(slide, indices, direction)`: Evenly space elements horizontally or
  vertically to maintain consistent gaps and rhythm across a row/column.

You MUST fix ALL severe text overlap errors, ALL unintended overlap warnings, and ALL unintended elements out of bounds warnings before you deliver the slides!

- Establish consistent margins and a simple grid early; prefer equal spacing between peer elements.
- After each major placement pass, re-run the diagnostics above and adjust until clean.

## Web search

- After downloading an image file, use `file` to verify that it downloaded successfully and is an image.
- Note that thumbnails in the image search preview are center-cropped. If the downloaded image doesn't have the desired aspect ratio (e.g., you need a wide area to cover but got a tall image), try another image.

## Citations

Include `[Sources]` blocks in the speaker notes for every externally sourced asset and every externally sourced non-trivial claim.
