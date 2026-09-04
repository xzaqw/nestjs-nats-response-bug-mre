# NestJS NATS `response` key deserialization MRE

This repository reproduces a NestJS NATS `ClientProxy` response deserialization
bug. When a plain JSON response contains a top-level `response` key, Nest treats
the object as its internal response envelope and returns only that property's
value.

Both endpoints below request the same NATS subject (`service.alert.lookup`). A
single raw NATS listener answers every request with the same JSON object, so the
only meaningful difference is the requesting client.

## Run

Prerequisite: Docker with Docker Compose.

From the repository root, run:

```sh
docker compose up --build
```

The command works the same way in Linux, macOS, Windows PowerShell, and Windows
Command Prompt. Wait until Nest logs that the application has started.

## Reproduce

Open the following URLs in a browser, or call them with any HTTP client.

### Official NATS client: correct

```text
http://localhost:3000/alerts/via-nats-client
```

This endpoint uses `@nats-io/transport-node` directly and returns the complete
object, including `uuid`, `code`, `response`, and every other property.

### NestJS NATS ClientProxy: incorrect

```text
http://localhost:3000/alerts/via-nest-client-proxy
```

This endpoint uses `ClientProxy` with `Transport.NATS`. Instead of the complete
object, its HTTP response body contains only the value of the object's
`response` property:

```text
The service has been placed into the maintenance state.
```

The raw NATS listener and both request implementations are in
`src/nats.service.ts`; the endpoint definitions are in `src/app.controller.ts`.

Stop the project with `Ctrl+C`. To remove its containers afterward, run
`docker compose down`.
