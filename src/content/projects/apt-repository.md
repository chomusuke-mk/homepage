---
title: 'Repositorio APT'
title_en: 'APT Repository'
description: 'Repositorio APT oficial para distribuciones Debian y Ubuntu. Aloja paquetes del ecosistema Chomusuke (como Vidra para Linux) con actualizaciones automáticas en segundo plano, firmas criptográficas GPG y despliegue serverless vía GitHub Actions y GitHub Pages.'
description_en: 'Official APT repository for Debian and Ubuntu distributions. Hosts Chomusuke ecosystem software (such as Vidra for Linux) with seamless automatic updates, GPG cryptographic signatures, and 100% serverless deployment via GitHub Actions and GitHub Pages.'
techStack:
  - 'Debian'
  - 'Ubuntu'
  - 'APT'
  - 'GPG'
  - 'reprepro'
  - 'GitHub Actions'
  - 'GitHub Pages'
  - 'Cloudflare'
githubLink: 'https://github.com/chomusuke-mk/apt-repository'
liveLink: 'https://apt.chomusuke.dev'
downloadLink: 'https://apt.chomusuke.dev'
featured: false
order: 5
bentoSpan: 'col-span-1 md:col-span-1 lg:col-span-1'
installInstructions:
  - platform: 'linux'
    label: 'Configurar Repositorio APT'
    label_en: 'Configure APT Repository'
    url: 'https://apt.chomusuke.dev'
    icon: 'linux'
---

Infraestructura 100% serverless y automatizada para distribución segura de paquetes `.deb` a través de un repositorio APT alojado en GitHub Pages.

### Características Principales

- **Automatización CI/CD:** Se actualiza de forma autónoma mediante eventos `repository_dispatch` cada vez que se publica una nueva versión de una aplicación.
- **Seguridad Criptográfica:** Todos los índices del repositorio y paquetes están firmados digitalmente con una clave privada GPG. La clave pública se valida en el sistema objetivo mediante `keyrings`.
- **Integración Nativa en Linux:** Permite a los usuarios de Debian, Ubuntu, Linux Mint y Pop!_OS recibir actualizaciones sin intervención manual usando `sudo apt update && sudo apt upgrade`.
- **Generación de Índices con Reprepro:** Estructura estática optimizada para minimizar el consumo de ancho de banda.
