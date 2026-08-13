export const languages = {
  es: 'Español',
  en: 'English',
} as const;

export const defaultLang = 'es';

export const ui = {
  es: {
    // Header & Navigation
    'nav.projects': 'Proyectos',
    'nav.about': 'Sobre Mí',
    'nav.install': 'Instalar',
    'nav.github': 'GitHub',
    'nav.lang': 'Idioma',
    'nav.skip': 'Saltar al contenido principal',

    // Hero Section
    'hero.badge': 'Desarrollador de Software',
    'hero.greeting': 'Hola, soy ',
    'hero.name': 'Chomusuke',
    'hero.description':
      'Desarrollo herramientas de software multiplataforma, sistemas de compilación cruzada y ecosistemas de distribución automatizada. Mi enfoque está en crear soluciones robustas, privadas y de alto rendimiento.',
    'hero.cta.projects': 'Ver Proyectos',
    'hero.cta.github': 'GitHub',
    'hero.avatarAlt': 'Avatar de Chomusuke',

    // Vidra Showcase
    'vidra.flagshipBadge': 'PROYECTO PRINCIPAL DEL ECOSISTEMA',
    'vidra.title': 'Vidra',
    'vidra.tagline':
      'Gestor de descargas de video avanzado, multiplataforma y 100% privado',
    'vidra.description':
      'Integra el motor original de yt-dlp con una interfaz gráfica moderna en Flutter y un backend de Python aislado vía serious_python. Ofrece actualizaciones OTA, verificación criptográfica y cero telemetría.',
    'vidra.arch.title': 'Arquitectura Multicapa del Ecosistema',
    'vidra.arch.flutter': 'Vidra UI (Flutter)',
    'vidra.arch.flutterDesc':
      'Clean Architecture, Provider, i18n & UI Multiplataforma',
    'vidra.arch.backend': 'Vidra Backend (Python 3.14)',
    'vidra.arch.backendDesc':
      'Flask + Waitress WSGI, API REST / SSE, Bearer Token',
    'vidra.arch.ytdlp': 'yt-dlp Engine',
    'vidra.arch.ytdlpDesc': 'Motor principal con parches OTA',
    'vidra.arch.quickjs': 'QuickJS Engine',
    'vidra.arch.quickjsDesc': 'Extracción de JS en 6 ABIs',
    'vidra.arch.ffmpeg': 'FFmpeg / FFprobe',
    'vidra.arch.ffmpegDesc': '20+ códecs y HW acceleration',
    'vidra.platforms.title': 'Disponibilidad Multiplataforma',
    'vidra.platforms.windows': 'Windows',
    'vidra.platforms.linux': 'Linux',
    'vidra.platforms.android': 'Android',
    'vidra.platforms.macos': 'macOS',
    'vidra.platforms.comingSoon': 'Próximamente',
    'vidra.cta.download': 'Descargar Vidra',
    'vidra.cta.github': 'Repositorio GitHub',
    'vidra.aptSnippet.title':
      'Instalación rápida vía Repositorio APT (Debian / Ubuntu)',
    'vidra.aptSnippet.copy': 'Copiar comandos',
    'vidra.aptSnippet.copied': '¡Copiado!',

    // About Me
    'about.heading.prefix': 'Sobre ',
    'about.heading.highlight': 'Mí',
    'about.subtitle':
      'Ingeniero de Software, Creador Open Source y Especialista en Desarrollo con IA',
    'about.bio1':
      'Soy Chomusuke, desarrollador de software apasionado por la creación de soluciones eficientes, accesibles y orientadas a la privacidad.',
    'about.bio2':
      'Mi trabajo abarca la ingeniería full-stack con React, Python y bases de datos relacionales y NoSQL (Postgres, MongoDB), hasta la arquitectura de aplicaciones multiplataforma con Flutter, entornos de compilación cruzada con Docker y desarrollo acelerado mediante Inteligencia Artificial.',
    'about.bio3':
      'Creo firmemente en la transparencia del código abierto, la verificación criptográfica y la entrega automatizada sin telemetría.',

    // Expertise Pillars
    'about.skills.title': 'Áreas de Especialización',
    'about.skills.react.title': 'React / UI Frontend',
    'about.skills.react.desc':
      'Construcción de interfaces web reactivas, dinámicas y modernas con arquitecturas de componentes reusables y TypeScript.',
    'about.skills.postgres.title': 'Postgres / SQL',
    'about.skills.postgres.desc':
      'Diseño e implementación de bases de datos relacionales con alta integridad de datos, esquemas optimizados y consultas complejas.',
    'about.skills.mongodb.title': 'MongoDB / NoSQL',
    'about.skills.mongodb.desc':
      'Modelado de datos basado en documentos JSON, procesamiento de agregaciones y gestión de almacenamiento flexible.',
    'about.skills.python.title': 'Python / Backend & Automatización',
    'about.skills.python.desc':
      'Desarrollo de APIs REST, scripts de automatización e integración de entornos aislados de ejecución (serious_python, yt-dlp).',
    'about.skills.ai.title': 'Desarrollo con IA',
    'about.skills.ai.desc':
      'Integración de LLMs, automatización mediante agentes autónomos, optimización de prompts y flujos asistidos por IA.',
    'about.skills.os.title': 'Open Source & Privacidad',
    'about.skills.os.desc':
      'Filosofía 100% código abierto sin telemetría, licencias libres, verificación criptográfica y transparencia total.',

    // Stats
    'stats.projects': 'Proyectos Activos',
    'stats.platforms': 'Plataformas',
    'stats.opensource': 'Código Abierto',
    'stats.telemetry': 'Telemetría',

    // Projects Section
    'projects.badge': 'Portafolio',
    'projects.title.prefix': 'Mis ',
    'projects.title.highlight': 'Proyectos',
    'projects.subtitle':
      'Un ecosistema completo de herramientas — desde la aplicación principal hasta la infraestructura de compilación y distribución.',
    'projects.card.code': 'Código',
    'projects.card.download': 'Descargar',
    'projects.card.visit': 'Visitar',
    'projects.card.featured': 'Proyecto Principal',

    // Install Section
    'install.badge': 'Instalación',
    'install.title.prefix': 'Cómo ',
    'install.title.highlight': 'Instalar',
    'install.subtitle':
      'Vidra y las herramientas del ecosistema están disponibles en múltiples plataformas y canales de distribución.',
    'install.windows.desc': 'Instalador ejecutable o Chocolatey',
    'install.linux.desc': 'AppImage, DEB, APT o Snap Store',
    'install.android.desc': 'APK directo o Repositorio F-Droid',
    'install.apt.title': 'Instalar vía Repositorio APT (Debian/Ubuntu)',
    'install.apt.step1': '# 1. Descargar la clave pública de seguridad GPG',
    'install.apt.step2': '# 2. Agregar el repositorio a las fuentes',
    'install.apt.step3': '# 3. Actualizar la lista e instalar Vidra',

    // Contact / CTA Section
    'cta.title': '¿Interesado en colaborar?',
    'cta.description':
      'Todos mis proyectos son de código abierto. Si quieres contribuir, reportar errores o proponer mejoras, visita los repositorios en GitHub.',
    'cta.github': 'Ver en GitHub',
    'cta.donate': '☕ Donar',

    // Footer
    'footer.role': 'Desarrollador de Software',
    'footer.builtWith': 'Desarrollado con',
    'footer.and': 'y',
    'footer.rights': 'Todos los derechos reservados.',
  },
  en: {
    // Header & Navigation
    'nav.projects': 'Projects',
    'nav.about': 'About Me',
    'nav.install': 'Install',
    'nav.github': 'GitHub',
    'nav.lang': 'Language',
    'nav.skip': 'Skip to main content',

    // Hero Section
    'hero.badge': 'Software Engineer',
    'hero.greeting': "Hello, I'm ",
    'hero.name': 'Chomusuke',
    'hero.description':
      'I develop cross-platform software tools, containerized build systems, and automated distribution pipelines. Focused on engineering high-performance, robust, and privacy-first solutions.',
    'hero.cta.projects': 'View Projects',
    'hero.cta.github': 'GitHub',
    'hero.avatarAlt': 'Chomusuke Avatar',

    // Vidra Showcase
    'vidra.flagshipBadge': 'FLAGSHIP ECOSYSTEM PROJECT',
    'vidra.title': 'Vidra',
    'vidra.tagline':
      'Advanced, cross-platform & 100% private video download manager',
    'vidra.description':
      'Integrates raw yt-dlp engine with a modern Flutter GUI and an isolated Python backend via serious_python. Features OTA engine updates, cryptographic binary verification, and zero telemetry.',
    'vidra.arch.title': 'Multi-Tier Ecosystem Architecture',
    'vidra.arch.flutter': 'Vidra UI (Flutter)',
    'vidra.arch.flutterDesc':
      'Clean Architecture, Provider, i18n & Multi-platform UI',
    'vidra.arch.backend': 'Vidra Backend (Python 3.14)',
    'vidra.arch.backendDesc':
      'Flask + Waitress WSGI, REST / SSE API, Bearer Token',
    'vidra.arch.ytdlp': 'yt-dlp Engine',
    'vidra.arch.ytdlpDesc': 'Core engine with OTA patches',
    'vidra.arch.quickjs': 'QuickJS Engine',
    'vidra.arch.quickjsDesc': 'JS extraction across 6 ABIs',
    'vidra.arch.ffmpeg': 'FFmpeg / FFprobe',
    'vidra.arch.ffmpegDesc': '20+ codecs & HW acceleration',
    'vidra.platforms.title': 'Cross-Platform Availability',
    'vidra.platforms.windows': 'Windows',
    'vidra.platforms.linux': 'Linux',
    'vidra.platforms.android': 'Android',
    'vidra.platforms.macos': 'macOS',
    'vidra.platforms.comingSoon': 'Coming Soon',
    'vidra.cta.download': 'Download Vidra',
    'vidra.cta.github': 'GitHub Repository',
    'vidra.aptSnippet.title':
      'Quick Setup via APT Repository (Debian / Ubuntu)',
    'vidra.aptSnippet.copy': 'Copy commands',
    'vidra.aptSnippet.copied': 'Copied!',

    // About Me
    'about.heading.prefix': 'About ',
    'about.heading.highlight': 'Me',
    'about.subtitle':
      'Software Engineer, Open Source Creator & AI Development Specialist',
    'about.bio1':
      'I am Chomusuke, a software engineer dedicated to building high-performance, accessible, and privacy-focused software tools.',
    'about.bio2':
      'My experience ranges from full-stack web engineering with React, Python, and relational/NoSQL databases (Postgres, MongoDB), to cross-platform application architectures with Flutter, containerized cross-compilation infrastructure with Docker, and cutting-edge AI Development.',
    'about.bio3':
      'I strongly advocate for open-source transparency, cryptographic key verification, and automated telemetry-free distribution.',

    // Expertise Pillars
    'about.skills.title': 'Areas of Expertise',
    'about.skills.react.title': 'React / UI Frontend',
    'about.skills.react.desc':
      'Building modern, reactive, and responsive web user interfaces with reusable component architectures and TypeScript.',
    'about.skills.postgres.title': 'Postgres / SQL',
    'about.skills.postgres.desc':
      'Designing and deploying relational databases with strong data integrity, optimized indexing, and complex queries.',
    'about.skills.mongodb.title': 'MongoDB / NoSQL',
    'about.skills.mongodb.desc':
      'Document-based JSON data modeling, aggregation pipelines, and high-performance flexible schema storage.',
    'about.skills.python.title': 'Python / Backend & Automation',
    'about.skills.python.desc':
      'Developing REST APIs, automation scripting, and isolated runtime integrations (serious_python, yt-dlp).',
    'about.skills.ai.title': 'AI Development',
    'about.skills.ai.desc':
      'Integration of LLMs, autonomous agent orchestration, prompt engineering, and AI-assisted developer workflows.',
    'about.skills.os.title': 'Open Source & Privacy',
    'about.skills.os.desc':
      '100% open-source philosophy with zero telemetry, permissive licensing, cryptographic key verification, and full transparency.',

    // Stats
    'stats.projects': 'Active Projects',
    'stats.platforms': 'Platforms',
    'stats.opensource': 'Open Source',
    'stats.telemetry': 'Telemetry',

    // Projects Section
    'projects.badge': 'Portfolio',
    'projects.title.prefix': 'My ',
    'projects.title.highlight': 'Projects',
    'projects.subtitle':
      'A complete tool ecosystem — from the flagship application to cross-compilation and distribution infrastructure.',
    'projects.card.code': 'Code',
    'projects.card.download': 'Download',
    'projects.card.visit': 'Visit',
    'projects.card.featured': 'Flagship Project',

    // Install Section
    'install.badge': 'Installation',
    'install.title.prefix': 'How to ',
    'install.title.highlight': 'Install',
    'install.subtitle':
      'Vidra and ecosystem tools are available across multiple platforms and distribution channels.',
    'install.windows.desc': 'Executable installer or Chocolatey',
    'install.linux.desc': 'AppImage, DEB, APT, or Snap Store',
    'install.android.desc': 'Direct APK or F-Droid Repository',
    'install.apt.title': 'Install via APT Repository (Debian/Ubuntu)',
    'install.apt.step1': '# 1. Download the public GPG security key',
    'install.apt.step2': '# 2. Add repository to system sources',
    'install.apt.step3': '# 3. Update package index and install Vidra',

    // Contact / CTA Section
    'cta.title': 'Interested in collaborating?',
    'cta.description':
      'All my projects are open source. If you want to contribute, report issues, or suggest improvements, check out the GitHub repositories.',
    'cta.github': 'View on GitHub',
    'cta.donate': '☕ Donate',

    // Footer
    'footer.role': 'Software Engineer',
    'footer.builtWith': 'Built with',
    'footer.and': 'and',
    'footer.rights': 'All rights reserved.',
  },
} as const;
