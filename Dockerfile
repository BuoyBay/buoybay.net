# Build the native application on Debian 13 first; see README.md.
FROM debian:trixie-slim
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl libglib2.0-0t64 libstdc++6 \
    && apt-get clean
WORKDIR /app
COPY dist/app/ /app/
ENV PORT=8080
USER 65532:65532
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl --fail --silent "http://127.0.0.1:${PORT}/healthz" || exit 1
CMD ["/app/server"]
