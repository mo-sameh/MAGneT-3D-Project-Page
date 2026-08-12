# MAGneT-3D — project page

Source for the project page of **MAGneT-3D: Monocular and Domain-Generalizable Temporal 3D
Detection** (oral presentation, DriveX Workshop @ ECCV 2026).

Static site: no build step, no dependencies, no external requests. Push to `main` and GitHub
Pages serves it as-is.

```
index.html              the whole page
static/css/style.css
static/js/main.js       progressive enhancement only
static/images/          figures at 1x and 2x, plus the og-image link-preview card
static/pdf/             the same figures as vector PDFs
tools/                  figure-export tooling — untracked, see below
```

The page runs title block → teaser → abstract → method → results → ablations → BibTeX →
acknowledgments. The results table switches between training sources and the ablation table
between the three ablations; each section has its own mAP / NDS filter. With JavaScript
disabled every table is still in the DOM and readable.

Light theme by default regardless of the reader's OS setting, with a small toggle for dark.

## Local preview

```sh
python3 -m http.server 8000     # then open http://localhost:8000
```

## Before it goes live: three links to fill in

`grep -n "TODO(link)" index.html`

| Placeholder | What to do |
| --- | --- |
| **Paper** | Point at the camera-ready PDF or the arXiv PDF. |
| **arXiv** | Replace with `https://arxiv.org/abs/XXXX.XXXXX`. |
| **Code** | Replace with the public code repository. |

Each is a `<span>` with a `(soon)` tag. To activate one, turn the `<span>` into an
`<a href="...">` and delete its `<span class="pending">` — the stylesheet already renders any
anchor in that row as an available link.

Also update the BibTeX block once the proceedings entry is final.

## The figures come from the paper repository

Every figure is compiled from the paper's own LaTeX sources — they are native TikZ/pgfplots,
not image files, and the loose PDFs in the paper's `figures/` directory are older drafts. The
exported PNG/PDF assets are committed here; the tooling that produces them is not (`tools/` is
in `.gitignore`, because it reads the paper sources directly).

With the paper repository checked out alongside this one:

```sh
./tools/export_figures.sh /path/to/paper-repo
# or, if it is a sibling directory, just:
./tools/export_figures.sh
```

That rebuilds the LaTeX preamble from the paper's `main.tex`, appends `tools/figexport_body.tex`,
compiles one tightly-cropped page per figure via the `preview` package, and rasterises each to
`static/images/<name>.png` (200 dpi), `<name>@2x.png` (400 dpi) and `static/pdf/<name>.pdf`.
Build artefacts go to a temp directory; nothing is written to the paper repo.

Two things the exporter does on purpose, for the web versions only:

- `\cite` is suppressed, so figures read "StreamPETR" rather than "StreamPETR [42]" — there is
  no reference list on the page for a number to point at.
- `\cref{sec:cag}` / `\cref{sec:tpr}` are resolved by hand to "Sec. 4.3" / "Sec. 4.4", since the
  section labels live in the paper body. **If those section numbers change in the camera-ready,
  update them at the top of `tools/figexport_body.tex`.**

## Keeping the page in sync with the paper

The page duplicates paper content, so it drifts when the paper changes. After a round of edits,
re-run the exporter and re-check:

- the **title** (`<h1>`, `<title>`, both social-card meta tags, and the BibTeX entry),
- the **abstract**, which is quoted verbatim,
- the four **figure captions**,
- the **28 result numbers** in the two tables, against the paper's `tables/*.tex`.
