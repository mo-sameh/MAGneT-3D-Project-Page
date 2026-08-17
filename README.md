# MAGneT-3D — project page

Project page for **MAGneT-3D: Monocular and Domain-Generalizable Temporal 3D Detection**
([arXiv:2608.14282](https://arxiv.org/abs/2608.14282), oral at the DriveX Workshop @ ECCV 2026).

Live at <https://mo-sameh.github.io/MAGneT-3D-Project-Page/>. Static, no build step — push to `main` and
GitHub Pages serves it as-is. Everything is in `index.html`, plus `static/`.

```sh
python3 -m http.server 8000     # preview at http://localhost:8000
```

**One link still missing:** the Code button (`grep -n "TODO(link)" index.html`). To activate it,
turn the `<span>` into an `<a href="...">` and delete its `<span class="pending">`.

**Figures** are exported from the paper's LaTeX sources (native TikZ/pgfplots) by
`./tools/export_figures.sh /path/to/paper-repo` — the PNG/PDF outputs are committed, the tooling
is not (`tools/` is gitignored, it reads the paper repo directly). It suppresses `\cite` and
hard-codes the Sec. 4.3 / 4.4 cross-references, so check those against the camera-ready.

**When the paper changes,** re-export the figures and re-check the title (`<h1>`, `<title>`, both
social-card meta tags, BibTeX), the verbatim abstract, the four captions, and the 28 numbers in
the results and ablation tables.
