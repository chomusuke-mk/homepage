---
title: 'Repositorio F-Droid'
title_en: 'F-Droid Repository'
description: 'Repositorio F-Droid oficial para aplicaciones Android del ecosistema Chomusuke. Aloja Vidra con optimización de paquetes por arquitectura (ABI splits), firmado con Java Keystore y despliegue automatizado con fdroidserver y GitHub Pages.'
description_en: 'Official F-Droid repository for Android applications in the Chomusuke ecosystem. Hosts Vidra featuring CPU architecture splits (ABI splits), Java Keystore index signing, and automated serverless publishing via fdroidserver and GitHub Pages.'
techStack:
  - 'Android'
  - 'F-Droid'
  - 'fdroidserver'
  - 'Java Keystore'
  - 'ABI Splits'
  - 'GitHub Actions'
  - 'GitHub Pages'
  - 'Cloudflare'
githubLink: 'https://github.com/chomusuke-mk/fdroid-repository'
liveLink: 'https://fdroid.chomusuke.dev'
downloadLink: 'https://fdroid.chomusuke.dev'
featured: false
order: 6
bentoSpan: 'col-span-1 md:col-span-1 lg:col-span-1'
installInstructions:
  - platform: 'android'
    label: 'Agregar a F-Droid'
    label_en: 'Add to F-Droid'
    url: 'https://fdroid.chomusuke.dev'
    icon: 'android'
---

Repositorio F-Droid serverless y automatizado que distribuye aplicaciones Android con actualizaciones automáticas en segundo plano. Alojado en GitHub Pages con índices firmados mediante Java Keystore.

### Características Principales

- **Optimización de Almacenamiento (ABI Splits):** Distribuye APKs compilados específicamente para cada arquitectura de CPU (`arm64-v8a`, `armeabi-v7a`, `x86_64`), reduciendo drásticamente el tamaño de descarga e instalación.
- **Integración con Clientes Android:** Soporte nativo para F-Droid, Droid-ify, Neo Store y agregación automática vía deep link (`fdroidrepos://`).
- **Construcción Automatizada con `fdroidserver`:** Pipeline en GitHub Actions que procesa eventos `repository_dispatch` (`update-fdroid`), descarga artefactos y regenera la metadata del repositorio.
- **Firma Persistente:** Keystore de Java almacenado de forma segura en secretos de GitHub para garantizar la compatibilidad de actualizaciones continuas.
