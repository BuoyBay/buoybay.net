# Contributing to buoybay.net

This repository contains the native HTTP service, browser assets, and written content for BuoyBay's developer website.

- Change server behavior in `src/`, browser behavior/styles in `public/`, and written copy/catalog data in `content/`.
- Keep content claims tied to the actual package APIs and documented platform support.
- Application code and deployment configuration use AGPL-3.0-only. Documentation and written content use CC-BY-4.0; contributions follow those licenses. No CLA is required.
- Use the installed Buoy language reference and verify changed `.bui` files with the real compiler. Check each platform branch changed; a cross-target check does not establish native execution on that platform.
- Include a short reproduction, expected behavior, and the commands/results used to verify a change. Maintainers run the private HTTP, content, and container suites before publishing.
- Keep secrets, generated runtime bundles, local editor setup, and private tests out of commits.

See the README for the native build, local server, and container commands. Deployment remains an explicit operator action.
