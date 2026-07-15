# Fase UI 4.6 — Branding e Identidad Visual

**Estado:** Completada  
**Versión:** 0.4.6  
**Fecha:** 15 de julio de 2026

---

## Resumen

Se integró el logo oficial de SafeRoute (escudo + ruta + pin) en:

- Pantalla de inicio de sesión
- Splash Screen
- Icono de la aplicación (iOS / Android / adaptive)
- Favicon web

No se modificó navegación, lógica de negocio, Firebase, Firestore, autenticación ni el tema de colores de la UI.

---

## Objetivo

Dar identidad visual profesional y coherente a SafeRoute usando el branding oficial, de forma que la app instalada (APK), el splash y el login muestren el mismo símbolo, sin rediseñar pantallas ni alterar flujos ya entregados en fases 4.2–4.5.

---

## Auditoría inicial

| Recurso | Estado previo |
|---------|----------------|
| Login | Texto tipográfico “SafeRoute” (sin imagen) |
| Splash | `assets/images/splash-icon.png` (asset Expo genérico) + fondo `#208AEF` |
| Icono global | `assets/images/icon.png` |
| iOS icon | `assets/expo.icon` (composer Expo, no branding SafeRoute) |
| Android adaptive | foreground / background / monochrome genéricos |
| Favicon | `assets/images/favicon.png` |
| Config | `app.json` (sin cambios de plugins salvo rutas de imagen) |

Archivos revisados: `assets/`, `app.json`, `eas.json`, `package.json`, `LoginScreen.tsx`, `src/components` (animated-icon Expo no tocado: templates demo).

---

## Archivos creados

| Archivo | Descripción |
|---------|-------------|
| `assets/images/saferoute-logo.png` | Logo master RGBA 1024² (fondo canvas removido) |
| `assets/images/saferoute-logo-source.png` | Copia del original entregado |
| `docs/FASE-UI-4.6-BRANDING.md` | Esta documentación |

## Archivos modificados / reemplazados

| Archivo | Cambio |
|---------|--------|
| `src/screens/auth/LoginScreen.tsx` | Texto logo → `Image` responsiva con `resizeMode="contain"` |
| `app.json` | iOS icon → PNG branding; splash `image` + `imageWidth` 160 (fondo `#208AEF` intacto); rutas adaptive ya apuntaban a `assets/images/*` |
| `assets/images/icon.png` | Reemplazado con branding 1024² |
| `assets/images/splash-icon.png` | Reemplazado (512² transparente) |
| `assets/images/favicon.png` | Reemplazado (48²) |
| `assets/images/android-icon-foreground.png` | Logo en safe-zone (~64 %) |
| `assets/images/android-icon-background.png` | Color `#E6F4FE` (mismo que `backgroundColor` adaptive) |
| `assets/images/android-icon-monochrome.png` | Silueta alpha para iconos temáticos |
| `docs/CHANGELOG.md` | Entrada Fase UI 4.6 |

---

## Recursos gráficos actualizados

| Superficie | Asset | Notas |
|------------|-------|-------|
| Login | `saferoute-logo.png` | 120–180 px según ancho de pantalla |
| Splash | `splash-icon.png` | Fondo `#208AEF` sin cambios |
| Icono APK / iOS | `icon.png` | Referenciado en `expo.icon` y `ios.icon` |
| Adaptive Android | foreground + background + monochrome | Padding para safe zone |
| Favicon | `favicon.png` | Web static |

---

## Compatibilidad

| Plataforma | Resultado |
|------------|-----------|
| Expo SDK 56 | Rutas estándar de `expo-splash-screen` e iconos |
| Android (APK) | Adaptive icon usa nuevos PNG |
| iOS | `ios.icon` apunta al PNG branding (deja de depender de `expo.icon` genérico) |
| Web | Favicon actualizado |

Sin nuevas dependencias npm. Requiere rebuild nativo / EAS para que el icono de launcher se regenere en dispositivo.

---

## Verificaciones

- [x] Rutas de `app.json` existen en disco
- [x] Login mantiene formulario, colores, botones y enlaces previos
- [x] Splash conserva `backgroundColor` `#208AEF`
- [x] Adaptive `backgroundColor` `#E6F4FE` sin cambio
- [x] Logo generado con LANCZOS; canvas gris claro convertido a transparencia
- [x] No se tocaron Firebase, AuthService, Firestore, RoutesScreen ni tema global

## Riesgos evitados

| No modificado | Motivo |
|---------------|--------|
| Navegación / Expo Router | Fuera de alcance |
| Auth / Firebase / Firestore | Solo branding visual |
| Colores de tema UI | No se cambió `theme.ts` |
| package.json | Sin installs |
| Register / Home / Map | No pedidos en esta fase |

---

## Resultado final

SafeRoute muestra el escudo oficial en login y splash; el launcher Android/iOS y el favicon web usan el mismo branding. La identidad queda unificada sin alterar la arquitectura ni las funcionalidades de las fases anteriores.

> **Nota operativa:** tras este cambio hay que regenerar el binario (`eas build` / prebuild) para ver el icono nuevo en el home del teléfono; Expo Go puede no reflejar adaptive icons del proyecto.
