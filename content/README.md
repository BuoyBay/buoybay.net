# Site copy and package descriptions

`site.json` contains the written page copy. The HTML template refers to those strings by key; the server escapes them before rendering. Keep keys synchronized with `public/index.html`.

`catalog.json` contains package names, short purpose statements, and display categories. Include only projects approved for public listing. Categories are `data`, `desktop`, `network`, and `developer`; repository links are derived from the package name.

After changing content, run the native preparation helper and restart the service. Content is loaded once at startup.

Written content uses CC-BY-4.0; see `LICENSE`. Functional application code remains AGPL-3.0-only as described in the repository's licensing policy.

Maintainers can refresh the catalog from the BuoyBay workspace's current publication policy and curated About descriptions using the native helper:

```sh
mkdir -p local/catalog
buoy tools/catalog.bui -o local/catalog/catalog
./local/catalog/catalog /path/to/buoybay /path/to/descriptions.json > local/catalog.next.json
mv local/catalog.next.json content/catalog.json
```

The helper cross-checks `workspace.json` and `packages.json`, applying their listing and release-selection settings. It emits package names, descriptions and display categories.
