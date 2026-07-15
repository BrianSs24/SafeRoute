# Historial de Cambios

Registro oficial de fases de producto y UI de **SafeRoute**.  
Cada entrada resume el alcance entregado y apunta a su documentación técnica independiente.

---

## Fase UI 4.6 — Branding e Identidad Visual

**Estado:** Completada  
**Versión:** 0.4.6  
**Fecha:** 15 de julio de 2026

**Descripción:**  
Integración del logo oficial de SafeRoute en login, splash, icono de app (iOS/Android adaptive) y favicon web, sin alterar lógica, navegación, Firebase ni colores del sistema.

**Archivos clave:**  
`LoginScreen.tsx`, `app.json`, `assets/images/saferoute-logo.png`, `icon.png`, `splash-icon.png`, adaptive icons, `favicon.png`.

**Documentación:**  
[docs/FASE-UI-4.6-BRANDING.md](./FASE-UI-4.6-BRANDING.md)

---

## Fase UI 4.5 — Autenticación y UX

**Estado:** Completada  
**Versión:** 0.4.5

**Descripción:**  
Recuperación de contraseña por correo (Firebase Auth), botón volver vía `PageHeader` en pantallas secundarias, acceso al mapa seguro desde el badge “Mapa” del Home, pull-to-refresh en Mis Reportes y dirección legible (Ciudad / Sector / Calle) al reportar incidentes sin alterar el esquema Firestore.

**Documentación:**  
[docs/FASE-UI-4.5-AUTENTICACION-Y-UX.md](./FASE-UI-4.5-AUTENTICACION-Y-UX.md)

---

## Fase UI 4.4.1 — Correcciones Perfil y Configuración

**Estado:** Completada  
**Versión:** 0.4.4.1

**Descripción:**  
Auditoría correctiva del módulo Perfil/Configuración: sanitización profunda global antes de `setDoc`/`updateDoc`, compatibilidad con documentos legacy, aviso para “Cambiar fotografía” (sin Storage) y **modo oscuro global** centralizado vía `AppSettingsContext` + `buildAppTheme` en toda la app.

**Documentación:**  
[docs/FASE-UI-4.4.1-CORRECCIONES.md](./FASE-UI-4.4.1-CORRECCIONES.md)

---

## Fase UI 4.4 — Home + Centro de Notificaciones

**Estado:** Completada  
**Versión:** 0.4.4

**Descripción:**  
Se mejoró el Home para una experiencia dinámica y personalizada: nombre y avatar reales desde Firestore, Centro de Notificaciones in-app y preferencia `notificationsEnabled`, dejando preparada la arquitectura para futuras alertas inteligentes (FCM / radio 5 km) sin enviar push todavía.

**Documentación:**  
[docs/FASE-UI-4.4-HOME.md](./FASE-UI-4.4-HOME.md)

---

## Fase UI 4.3 — Perfil

**Estado:** Completada

**Descripción:**  
Se convirtió el módulo Perfil en un centro completo de administración de la cuenta del usuario, incorporando edición de perfil, cambio de contraseña, configuración visual de la aplicación y cierre de sesión seguro.

**Documentación:**  
[docs/FASE-UI-4.3-PERFIL.md](./FASE-UI-4.3-PERFIL.md)

---

## Fase UI 4.2 — Mis Reportes

**Estado:** Completada

**Descripción:**  
Se rediseñó el módulo Mis Reportes, se agregaron las funcionalidades de edición y eliminación de reportes, se mejoró la interfaz y se optimizó la experiencia del usuario.

**Documentación:**  
[docs/FASE-UI-4.2-MIS-REPORTES.md](./FASE-UI-4.2-MIS-REPORTES.md)

---

## Fases planificadas

| Fase | Documento | Estado |
|------|-----------|--------|
| UI 5.0 — Admin | `docs/FASE-UI-5.0-ADMIN.md` | Pendiente |

> Convención: cada fase nueva debe documentarse en su propio archivo `docs/FASE-*.md` y registrarse aquí. No reutilizar documentos de fases anteriores.
