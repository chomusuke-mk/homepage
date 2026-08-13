---
title: 'Vidra FFmpeg'
title_en: 'Vidra FFmpeg'
description: 'Entorno automatizado de compilación cruzada en Docker para generar binarios estáticos de FFmpeg y FFprobe (n8.1.2) optimizados para yt-dlp, transcodificación, renderizado de subtítulos (libass) y aceleración por hardware.'
description_en: 'Automated Docker cross-compilation suite for producing custom static FFmpeg and FFprobe binaries (n8.1.2) optimized for yt-dlp, media transcoding, subtitle rendering (libass), and hardware acceleration.'
techStack:
  - 'FFmpeg'
  - 'FFprobe'
  - 'C'
  - 'Docker'
  - 'Cross-compilation'
  - 'Hardware Acceleration'
  - 'libass'
  - 'VAAPI'
  - 'NVENC'
  - 'Android'
  - 'Windows'
  - 'Linux'
githubLink: 'https://github.com/chomusuke-mk/vidra-ffmpeg'
liveLink: 'https://github.com/chomusuke-mk/vidra-ffmpeg/releases'
downloadLink: 'https://github.com/chomusuke-mk/vidra-ffmpeg/releases'
featured: false
order: 4
bentoSpan: 'col-span-1'
---

Entorno de compilación Docker con parches personalizados para compilar FFmpeg n8.1.2 de forma estática para Linux, Windows y Android. Integra más de 20 librerías de códecs (x264, x265, svtav1, dav1d, vpx, libass, opus, openjpeg) y aceleración por hardware (VAAPI, Vulkan, NVENC, DXVA2, MediaCodec).

### Características Principales

- **20+ Librerías Multimedia:** x264, x265, svtav1, dav1d, libass, opus, openjpeg, zimg, fribidi, harfbuzz, fontconfig.
- **Aceleración por Hardware:** VAAPI, Vulkan, NVENC/NVDEC en Linux; Schannel, DXVA2, D3D11VA, NVENC, oneVPL en Windows; MediaCodec en Android.
- **Validación Automatizada:** Suite de pruebas con `test_ffmpeg.py` y script de parcheo `view_files.sh`.
- **Binarios Estáticos:** Ejecutables auto-contenidos diseñados para integrarse sin fricción con yt-dlp.
