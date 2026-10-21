# Serve the repo for previewing decks in a browser, with caching off so edits show on reload.
#   python3 templates/linkedin-carousel/serve.py   ->  http://localhost:4173/carousels/<slug>/deck.html
# Run it from the repo root. Opening deck.html straight from disk can break the relative CSS, JS and logo paths.
import http.server
import sys


class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


port = int(sys.argv[1]) if len(sys.argv) > 1 else 4173
http.server.ThreadingHTTPServer(("127.0.0.1", port), NoCache).serve_forever()
