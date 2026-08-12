/* Progressive enhancement only. With scripting disabled the page stays fully
   readable: every table panel is in the DOM and no content is hidden by CSS. */

(function () {
  "use strict";

  /* --------------------------------------------------------------- theme */

  /* Light is the default; the button only ever adds or removes the dark
     override. It is markup-hidden until wired up, so it never appears as a
     dead control when scripting is unavailable. */
  var themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    var root = document.documentElement;

    var sync = function () {
      var dark = root.getAttribute("data-theme") === "dark";
      themeBtn.setAttribute("aria-pressed", dark ? "true" : "false");
      themeBtn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    };

    themeBtn.hidden = false;
    sync();

    themeBtn.addEventListener("click", function () {
      var dark = root.getAttribute("data-theme") === "dark";
      if (dark) root.removeAttribute("data-theme");
      else root.setAttribute("data-theme", "dark");
      try { localStorage.setItem("magnet3d-theme", dark ? "light" : "dark"); } catch (e) {}
      sync();
    });
  }

  /* ---------------------------------------------------------------- tabs */

  /**
   * Wire a set of text switches to their tab panels.
   * @param {string} containerId  element holding the role="tab" buttons
   * @param {string} attr         data attribute on each button naming its panel
   * @param {function} panelId    maps an attribute value to a panel element id
   */
  function wireTabs(containerId, attr, panelId) {
    var container = document.getElementById(containerId);
    if (!container) return;
    var tabs = Array.prototype.slice.call(container.querySelectorAll("[role='tab']"));

    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(panelId(t.getAttribute(attr)));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
    }

    container.addEventListener("click", function (ev) {
      var tab = ev.target.closest("[role='tab']");
      if (tab) select(tab, false);
    });

    container.addEventListener("keydown", function (ev) {
      var i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      var next = null;
      if (ev.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
      else if (ev.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (ev.key === "Home") next = tabs[0];
      else if (ev.key === "End") next = tabs[tabs.length - 1];
      if (next) { ev.preventDefault(); select(next, true); }
    });
  }

  wireTabs("source-tabs", "data-source", function (v) { return "panel-" + v; });
  wireTabs("ablation-tabs", "data-abl", function (v) { return "abl-" + v; });

  /* ------------------------------------------------------ mAP / NDS filter */

  /* Every metric cell carries data-metric="map|nds", so filtering is a flat
     sweep — no column arithmetic, and it stays correct for the ablation tables
     that have extra leading columns. Each switch filters only the container
     named by its data-scope, so it never changes a table elsewhere on the page. */
  Array.prototype.forEach.call(
    document.querySelectorAll("[data-metric-toggle]"),
    function (toggle) {
      var scope = document.getElementById(toggle.getAttribute("data-scope"));
      if (!scope) return;

      toggle.addEventListener("click", function (ev) {
        var btn = ev.target.closest("button[data-metric]");
        if (!btn) return;
        var metric = btn.getAttribute("data-metric");

        Array.prototype.forEach.call(toggle.querySelectorAll("button"), function (b) {
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
        Array.prototype.forEach.call(
          scope.querySelectorAll("[data-metric]"),
          function (cell) {
            cell.hidden = metric !== "both" && cell.getAttribute("data-metric") !== metric;
          }
        );
      });
    }
  );

  /* ---------------------------------------------------------- copy BibTeX */

  var btn = document.getElementById("copy-bibtex");
  if (!btn) return;
  if (!navigator.clipboard) { btn.hidden = true; return; }

  btn.addEventListener("click", function () {
    var src = document.getElementById(btn.getAttribute("data-target"));
    if (!src) return;
    navigator.clipboard.writeText(src.textContent.trim()).then(
      function () {
        btn.textContent = "Copied";
        setTimeout(function () { btn.textContent = "Copy"; }, 1800);
      },
      function () {
        btn.textContent = "Copy failed";
        setTimeout(function () { btn.textContent = "Copy"; }, 2200);
      }
    );
  });
})();
