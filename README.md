## SweetTrip — Trabajo desde otra máquina y Cloudflare Tunnel

### Requisitos
- Node.js 18+ y pnpm
- Git

### Clonar y cambiar a la rama de trabajo
```bash
git clone https://github.com/moy418/SweetTrip
cd SweetTrip
git fetch
git checkout chore/sync-to-github
```

### Instalar dependencias y ejecutar
- Desarrollo (Vite en 0.0.0.0:4001):
```bash
pnpm i
pnpm dev
```
- Build y preview:
```bash
pnpm build
pnpm preview
```

### Variables de entorno (.env)
Crear un archivo `.env` en la raíz con:
```bash
# Supabase
VITE_SUPABASE_URL="https://<tu-proyecto>.supabase.co"
VITE_SUPABASE_ANON_KEY="<tu_anon_key>"

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY="<pk_live_o_pk_test>"

# Opcional (scripts/automatizaciones)
SUPABASE_SERVICE_ROLE_KEY="<service_role_key>"  # usado por update-supabase-config.*
ZAPIER_WEBHOOK_URL="<webhook_url>"              # opcional si se usa orderProcessor
```

Nota: Si vas a exponer el dev server con un subdominio distinto (ej. `dev.sweettripcandy.com`), añade ese host en `vite.config.ts` → `server.allowedHosts`.

### Cloudflare Tunnel (dev/proxy seguro)
Objetivo: exponer `http://localhost:4001` de la máquina de desarrollo a Internet bajo tu dominio en Cloudflare.

1) Instalar `cloudflared` (Linux)
```bash
curl -fsSL https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o cloudflared.deb
sudo dpkg -i cloudflared.deb || sudo apt-get -f install -y
```

2) Autenticarse
```bash
cloudflared tunnel login
```

3) Crear túnel
```bash
cloudflared tunnel create sweettrip-dev
```

4) Configurar ingreso (ingress) al puerto 4001
Crear `~/.cloudflared/config.yml` (ruta puede variar) con:
```yaml
tunnel: sweettrip-dev
credentials-file: /home/<usuario>/.cloudflared/<UUID>.json
ingress:
  - hostname: dev.sweettripcandy.com
    service: http://localhost:4001
  - service: http_status:404
```

5) Crear DNS en Cloudflare para el túnel
```bash
cloudflared tunnel route dns sweettrip-dev dev.sweettripcandy.com
```

6) Ejecutar el túnel
```bash
cloudflared tunnel run sweettrip-dev
```

Consejos:
- Si usas un subdominio nuevo (p. ej., `dev.sweettripcandy.com`), añade ese host en `vite.config.ts > server.allowedHosts`.
- El dev server arranca en `http://0.0.0.0:4001`. `cloudflared` hace proxy a ese puerto.
- Para producción con NGINX, ver `nginx.conf` y el contenido de `dist/`.

---

# Supabase CLI

[![Coverage Status](https://coveralls.io/repos/github/supabase/cli/badge.svg?branch=main)](https://coveralls.io/github/supabase/cli?branch=main) [![Bitbucket Pipelines](https://img.shields.io/bitbucket/pipelines/supabase-cli/setup-cli/master?style=flat-square&label=Bitbucket%20Canary)](https://bitbucket.org/supabase-cli/setup-cli/pipelines) [![Gitlab Pipeline Status](https://img.shields.io/gitlab/pipeline-status/sweatybridge%2Fsetup-cli?label=Gitlab%20Canary)
](https://gitlab.com/sweatybridge/setup-cli/-/pipelines)

[Supabase](https://supabase.io) is an open source Firebase alternative. We're building the features of Firebase using enterprise-grade open source tools.

This repository contains all the functionality for Supabase CLI.

- [x] Running Supabase locally
- [x] Managing database migrations
- [x] Creating and deploying Supabase Functions
- [x] Generating types directly from your database schema
- [x] Making authenticated HTTP requests to [Management API](https://supabase.com/docs/reference/api/introduction)

## Getting started

### Install the CLI

Available via [NPM](https://www.npmjs.com) as dev dependency. To install:

```bash
npm i supabase --save-dev
```

To install the beta release channel:

```bash
npm i supabase@beta --save-dev
```

When installing with yarn 4, you need to disable experimental fetch with the following nodejs config.

```
NODE_OPTIONS=--no-experimental-fetch yarn add supabase
```

> **Note**
For Bun versions below v1.0.17, you must add `supabase` as a [trusted dependency](https://bun.sh/guides/install/trusted) before running `bun add -D supabase`.

<details>
  <summary><b>macOS</b></summary>

  Available via [Homebrew](https://brew.sh). To install:

  ```sh
  brew install supabase/tap/supabase
  ```

  To install the beta release channel:
  
  ```sh
  brew install supabase/tap/supabase-beta
  brew link --overwrite supabase-beta
  ```
  
  To upgrade:

  ```sh
  brew upgrade supabase
  ```
</details>

<details>
  <summary><b>Windows</b></summary>

  Available via [Scoop](https://scoop.sh). To install:

  ```powershell
  scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
  scoop install supabase
  ```

  To upgrade:

  ```powershell
  scoop update supabase
  ```
</details>

<details>
  <summary><b>Linux</b></summary>

  Available via [Homebrew](https://brew.sh) and Linux packages.

  #### via Homebrew

  To install:

  ```sh
  brew install supabase/tap/supabase
  ```

  To upgrade:

  ```sh
  brew upgrade supabase
  ```

  #### via Linux packages

  Linux packages are provided in [Releases](https://github.com/supabase/cli/releases). To install, download the `.apk`/`.deb`/`.rpm`/`.pkg.tar.zst` file depending on your package manager and run the respective commands.

  ```sh
  sudo apk add --allow-untrusted <...>.apk
  ```

  ```sh
  sudo dpkg -i <...>.deb
  ```

  ```sh
  sudo rpm -i <...>.rpm
  ```

  ```sh
  sudo pacman -U <...>.pkg.tar.zst
  ```
</details>

<details>
  <summary><b>Other Platforms</b></summary>

  You can also install the CLI via [go modules](https://go.dev/ref/mod#go-install) without the help of package managers.

  ```sh
  go install github.com/supabase/cli@latest
  ```

  Add a symlink to the binary in `$PATH` for easier access:

  ```sh
  ln -s "$(go env GOPATH)/bin/cli" /usr/bin/supabase
  ```

  This works on other non-standard Linux distros.
</details>

<details>
  <summary><b>Community Maintained Packages</b></summary>

  Available via [pkgx](https://pkgx.sh/). Package script [here](https://github.com/pkgxdev/pantry/blob/main/projects/supabase.com/cli/package.yml).
  To install in your working directory:

  ```bash
  pkgx install supabase
  ```

  Available via [Nixpkgs](https://nixos.org/). Package script [here](https://github.com/NixOS/nixpkgs/blob/master/pkgs/development/tools/supabase-cli/default.nix).
</details>

### Run the CLI

```bash
supabase bootstrap
```

Or using npx:

```bash
npx supabase bootstrap
```

The bootstrap command will guide you through the process of setting up a Supabase project using one of the [starter](https://github.com/supabase-community/supabase-samples/blob/main/samples.json) templates.

## Docs

Command & config reference can be found [here](https://supabase.com/docs/reference/cli/about).

## Breaking changes

We follow semantic versioning for changes that directly impact CLI commands, flags, and configurations.

However, due to dependencies on other service images, we cannot guarantee that schema migrations, seed.sql, and generated types will always work for the same CLI major version. If you need such guarantees, we encourage you to pin a specific version of CLI in package.json.

## Developing

To run from source:

```sh
# Go >= 1.22
go run . help
```
