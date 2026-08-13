---
title: 'Vidra Backend'
title_en: 'Vidra Backend'
description: 'Motor backend en Python 3.14 con API RESTful y Server-Sent Events (SSE) para la gestión de descargas con yt-dlp. Diseñado para ejecutarse integrado en Vidra o como servicio independiente con servidor multihilo Waitress.'
description_en: 'Python 3.14 backend engine with RESTful API and Server-Sent Events (SSE) for yt-dlp download management. Built to run embedded in Vidra or as a standalone service using the multi-threaded Waitress WSGI server.'
techStack:
  - 'Python'
  - 'Flask'
  - 'yt-dlp'
  - 'Waitress'
  - 'REST API'
  - 'SSE'
  - 'Certifi'
githubLink: 'https://github.com/chomusuke-mk/vidra-backend'
liveLink: 'https://github.com/chomusuke-mk/vidra-backend'
featured: false
order: 2
bentoSpan: 'col-span-1'
---

El motor de procesamiento central de Vidra desacoplado en un servicio en Python. Proporciona una interfaz RESTful completa para orquestar descargas, inspeccionar y seleccionar elementos específicos de listas de reproducción, consultar logs en tiempo real y transmitir progresos mediante Server-Sent Events (SSE).

### Características Principales

- **Gestión completa de descargas:** Iniciar, monitorear, pausar, reanudar y cancelar operaciones.
- **Inspección de listas de reproducción:** Selección granular de ítems y formatos de audio/video.
- **Eventos en tiempo real:** Streaming de deltas de progreso y logs vía Server-Sent Events (SSE).
- **Servidor Waitress multihilo:** Configurado con 16 hilos y certificados CA inyectados con `certifi`.
