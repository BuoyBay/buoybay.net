# A native web service and package catalog for buoybay.net

BuoyBay's developer site introduces reusable Buoy packages, BPM, Ahoy, and Buoy Bay Studio. A small Buoy HTTP server serves the landing page, a searchable package catalog, and health checks. Browser behavior uses plain JavaScript; no database or accounts are needed for this scaffold.

## Local AI setup

On your own machine, install Buoy and run:

```sh
buoy ai init --both
```

Generated agent instructions, documentation indexes, and editor settings remain local and ignored.

## Build and run

The verified build environment is Linux x86_64, Debian 13, and Buoy 0.72.0. Install Buoy with its HTTPServer 1.1.0 package. The native preparation helper stages that package locally and copies the site assets:

```sh
mkdir -p local/setup
buoy tools/prepare.bui -o local/setup/prepare
./local/setup/prepare
```

Compile the server. This Linux toolchain needs explicit TLS/static-library arguments even for plain HTTP:

```sh
buoy src/main.bui \
  --stubs-dir /usr/lib/x86_64-linux-gnu \
  --extra-obj /usr/lib/buoy/libbuoy_tls.a \
  --extra-obj /usr/lib/buoy/libssl.a \
  --extra-obj /usr/lib/buoy/libcrypto.a \
  --extra-obj /usr/lib/x86_64-linux-gnu/libc_nonshared.a \
  -o dist/app/server
./dist/app/server
```

Open `http://localhost:8080`. Re-run the preparation helper after editing assets or content, then restart the service; assets are loaded once at startup. Compiler semantic checks pass for all six desktop targets, but native execution and container validation currently cover Linux x86_64 only.

## Routes and configuration

| Route | Behavior |
| --- | --- |
| `/` | Rendered landing page |
| `/site.css`, `/site.js` | Browser assets |
| `/catalog.json` | Package names, descriptions, and categories |
| `/healthz` | JSON readiness response |
| `/source` | Redirect to the corresponding service source |

The service accepts `GET` and `HEAD`. Other methods receive `405`; unknown paths receive `404`. It has no general filesystem route. Put TLS and public request routing in a reverse proxy; `deploy/Caddyfile.example` is an operator-managed example.

| Environment | Default |
| --- | --- |
| `PORT` | `8080`; the SDK binds all interfaces |
| `BUOYBAY_PUBLIC_DIR` | `public/` beside the executable |
| `BUOYBAY_CONTENT_DIR` | `content/` beside the executable |
| `BUOY_PACKAGES_DIR` | Standard installed SDK package directory, used by preparation |
| `SOURCE_URL` | `https://github.com/BuoyBay/buoybay.net` |

For a deployed or modified version, set `SOURCE_URL` to the corresponding accessible source, preferably its exact commit. The visible **Site source** footer links to it through `/source`.

## Container

Build the native `dist/app/` bundle first on Debian 13 for the same CPU architecture as the runtime container. Then:

```sh
docker compose --env-file .env.example build
docker compose --env-file .env.example up -d
curl --fail http://127.0.0.1:8080/healthz
docker compose --env-file .env.example down
```

Compose binds to loopback by default. Copy `.env.example` to `.env` to select a different host port or source URL; use `--env-file .env` for those deployment commands. The container runs as an unprivileged user with a read-only root filesystem. Compiler runtime libraries beside the generated executable must stay in the bundle.

## Source layout

- `src/main.bui`: HTTP routes and content rendering.
- `tools/prepare.bui`: native local SDK/asset preparation.
- `public/`: functional HTML template, CSS, and JavaScript.
- `content/`: written copy and package catalog data.
- `deploy/`: example reverse-proxy configuration.

Application code and deployment configuration use **AGPL-3.0-only**. Written content and documentation use **CC-BY-4.0**. See [LICENSING.md](LICENSING.md) and [CONTRIBUTING.md](CONTRIBUTING.md). No CLA is required. Build/test artifacts and private suites stay local; this repository does not itself deploy DNS, hosting, or a production service.
