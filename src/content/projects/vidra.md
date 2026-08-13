---
title: 'Vidra'
title_en: 'Vidra'
description: 'Gestor de descargas de video avanzado, multiplataforma (Android, Windows, Linux) y privado. Integra el motor original de yt-dlp con una interfaz gráfica moderna construida en Flutter y un backend de Python aislado vía serious_python, ofreciendo actualizaciones OTA sin telemetría.'
description_en: 'Advanced, cross-platform (Android, Windows, Linux), privacy-focused video download manager. Integrates the raw power of the original yt-dlp engine with a modern Flutter user interface and an isolated Python backend via serious_python, featuring OTA updates and zero telemetry.'
techStack:
  - 'Flutter'
  - 'Dart'
  - 'Python'
  - 'yt-dlp'
  - 'FFmpeg'
  - 'QuickJS'
  - 'serious_python'
  - 'Clean Architecture'
  - 'REST API'
  - 'SSE'
githubLink: 'https://github.com/chomusuke-mk/vidra'
liveLink: 'https://github.com/chomusuke-mk/vidra/releases/latest'
downloadLink: 'https://github.com/chomusuke-mk/vidra/releases/latest'
featured: true
order: 1
bentoSpan: 'col-span-1 md:col-span-2 lg:col-span-3'
installInstructions:
  - platform: 'Windows'
    label: 'Instalador Windows'
    label_en: 'Windows Installer'
    url: 'https://github.com/chomusuke-mk/vidra/releases/latest'
    icon: 'windows'
  - platform: 'Linux (AppImage)'
    label: 'AppImage'
    label_en: 'AppImage'
    url: 'https://github.com/chomusuke-mk/vidra/releases/latest'
    icon: 'linux'
  - platform: 'Linux (APT)'
    label: 'Repositorio APT'
    label_en: 'APT Repository'
    url: 'https://apt.chomusuke.dev'
    icon: 'linux'
  - platform: 'Android (APK)'
    label: 'APK directo'
    label_en: 'Direct APK'
    url: 'https://github.com/chomusuke-mk/vidra/releases/latest'
    icon: 'android'
  - platform: 'Android (F-Droid)'
    label: 'F-Droid'
    label_en: 'F-Droid'
    url: 'https://fdroid.chomusuke.dev'
    icon: 'android'
  - platform: 'Chocolatey'
    label: 'Chocolatey'
    label_en: 'Chocolatey'
    url: 'https://community.chocolatey.org/packages/vidra'
    icon: 'windows'
  - platform: 'Snap Store'
    label: 'Snap Store'
    label_en: 'Snap Store'
    url: 'https://snapcraft.io/vidra'
    icon: 'linux'
  - platform: 'Obtainium'
    label: 'Obtainium'
    label_en: 'Obtainium'
    url: 'https://apps.obtainium.imranr.dev/redirect?r=obtainium://add/https://github.com/chomusuke-mk/vidra'
    icon: 'android'
---

Vidra es un gestor de descargas de video de grado profesional diseñado para llevar la potencia bruta y sin restricciones de yt-dlp a todos los usuarios. Reconstruido desde cero bajo principios de Arquitectura Limpia (Clean Architecture), Vidra desacopla el cliente gráfico (Flutter) del motor de procesamiento pesado en Python, el cual se ejecuta en un Isolate de Dart usando `serious_python`.

### Características Principales

- **Actualizaciones OTA en tiempo real:** Mantiene yt-dlp y yt-dlp-ejs siempre actualizados directamente desde sus repositorios oficiales.
- **100% Privado & Cero Telemetría:** Operación totalmente offline-first, sin recolección de datos personales o métricas.
- **Verificación Criptográfica:** Firmas GPG y sumas SHA2-256/512 en todos los binarios y actualizaciones.
- **Comunicación Segura Localhost:** API REST dinámica en 127.0.0.1 con autenticación mediante Bearer Token de 256 bytes.
- **Sincronización en Tiempo Real:** Interfaz fluida (60/120 fps) gracias a eventos Server-Sent Events (SSE) y aislamiento de hilos.
