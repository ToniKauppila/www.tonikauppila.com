#!/usr/bin/env python3
"""Local dev server that mirrors the .htaccess extensionless-URL rewrite
(RewriteRule ^(.*)$ $1.html), so links like href="photos" resolve the same
way here as they do on the live (Apache) host.

Usage:
    python3 serve.py [port]   # default port 8000
"""
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlsplit


class CleanURLHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        split = urlsplit(path)
        p = split.path
        candidate = Path(super().translate_path(p))
        if not candidate.exists() and not candidate.suffix:
            with_html = candidate.with_name(candidate.name + ".html")
            if with_html.is_file():
                return str(with_html)
        return str(candidate)


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    server = HTTPServer(("localhost", port), CleanURLHandler)
    print(f"Serving on http://localhost:{port}  (Ctrl+C to stop)")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
