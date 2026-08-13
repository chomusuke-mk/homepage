---
title: 'Vidra QuickJS'
title_en: 'Vidra QuickJS'
description: 'Entorno automatizado de compilación cruzada basado en Docker para generar binarios independientes y altamente optimizados del motor JavaScript QuickJS (QuickJS-NG) en Linux, Windows y Android.'
description_en: 'Automated Docker-based cross-compilation environment for building standalone, highly optimized QuickJS JavaScript engine binaries (QuickJS-NG) targeting Linux, Windows, and Android.'
techStack:
  - 'QuickJS'
  - 'C'
  - 'Docker'
  - 'GitHub Actions'
  - 'Cross-compilation'
  - 'Sigstore'
  - 'Android'
  - 'Windows'
  - 'Linux'
githubLink: 'https://github.com/chomusuke-mk/vidra-quickjs'
liveLink: 'https://github.com/chomusuke-mk/vidra-quickjs/releases'
downloadLink: 'https://github.com/chomusuke-mk/vidra-quickjs/releases'
featured: false
order: 3
bentoSpan: 'col-span-1'
---

Builder multiplataforma basado en Docker para compilar el motor de JavaScript QuickJS (v0.15.1 de quickjs-ng) hacia Linux (estático glibc), Windows (estático mingw-w64) y Android (dinámico PIE, API 24+) en 6 arquitecturas.

### Características Principales

- **Soporte para 6 targets:** Linux x86_64, Windows x86_64, Android arm64-v8a/armeabi-v7a/x86/x86_64.
- **CI/CD Automatizado:** Workflows en GitHub Actions con notas de lanzamiento dinámicas.
- **Seguridad Criptográfica:** Firmas Sigstore ("Verified" en GitHub Releases) y checksums SHA2-256/512.
- **Binarios Estáticos Ultra-ligeros:** Ejecutables autónomos sin dependencias de sistema adicionales.
