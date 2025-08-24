Project fixed by assistant (Venom v3.1 audit)

{
  "summary": "Fixed frontend: setCarouselStyle/selectStyle, persisted selectedStyle, fixed getCurrentScreen, hardened loading screen handlers, DOMContentLoaded apply persisted style.",
  "files_included": [
    "index.html",
    "styles_modern.css",
    "app_modern.js (fixed)",
    "app_modern.js.bak (original backup)",
    "app_modern.fixed.js (fixed copy)"
  ],
  "notes": [
    "Do not forget to test via HTTP server (not file://).",
    "If you use build tools, ensure paths to script/css are correct in index.html.",
    "I did not change server/back-end (Make.com) integrations."
  ]
}