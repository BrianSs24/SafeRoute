# Fase UI 4.5 — Autenticación y UX

**Estado:** Completada  
**Versión:** 0.4.5  
**Alcance:** Recuperación de contraseña, botón volver en secundarias, acceso al mapa seguro, pull-to-refresh en Mis Reportes y dirección legible al reportar incidentes.

---

## Objetivo

Mejorar la experiencia de uso en flujos cotidianos (login, navegación secundaria, home, mis reportes y ubicación del reporte) **sin rediseñar** SafeRoute ni alterar la arquitectura pantallas → viewmodels → services → Firebase.

## Qué problema existía

1. El login no ofrecía recuperación de contraseña por correo.
2. Varias pantallas secundarias no tenían `←` consistente arriba a la izquierda.
3. El badge **Mapa** del Home no era interactivo (aunque el ActionCard “Ver mapa seguro” sí navegaba bien).
4. Mis Reportes no permitía refrescar deslizando hacia abajo.
5. Reportar incidente mostraba Lat/Lng crudas, poco amigables.

## Auditoría

### Archivos analizados

| Área | Archivos |
|------|----------|
| Login | `LoginScreen.tsx`, `LoginViewModel.ts`, `AuthService.ts` |
| Navegación | `PageHeader.tsx`, `app/(home)/_layout.tsx`, pantallas home/report/auth |
| Home | `HomeScreen.tsx`, `ActionCard.tsx`, `WelcomeCard.tsx` |
| Mis Reportes | `MyReportsScreen.tsx`, `MyReportsViewModel.ts` |
| Reporte | `ReportIncidentScreen.tsx`, `LocationCard.tsx`, uso de `expo-location` |

### Hallazgos clave

- Auth usaba `signInWithEmailAndPassword`; no existía `sendPasswordResetEmail`.
- `PageHeader` ya implementaba `router.back()`; varias secundarias no lo usaban.
- ActionCard “Ver mapa seguro” → `/routes` (correcto). Badge “Mapa” no era `Pressable`.
- Mis Reportes: carga vía `loadMyReports`; sin `RefreshControl`.
- Ubicación: solo `getCurrentPositionAsync`; sin reverse geocoding en el repo.
- **Restricción respetada:** no se modificó `RoutesScreen` / mapa / Google APIs / `firebase.ts`.

### Riesgos detectados

- Añadir reset de password sin romper el login existente.
- Pull-to-refresh no debe vaciar la lista ni montar spinner de pantalla completa.
- Reverse geocode no debe cambiar el esquema Firestore (solo UI).
- No duplicar headers donde ya existía `PageHeader`.

---

## Archivos creados

| Archivo | Propósito |
|---------|-----------|
| `src/screens/auth/ForgotPasswordScreen.tsx` | UI: correo + enviar enlace + PageHeader |
| `src/viewmodels/auth/ForgotPasswordViewModel.ts` | Validación + llamada al service + mensajes |
| `src/app/(auth)/forgot-password.tsx` | Ruta Expo Router `/forgot-password` |
| `docs/FASE-UI-4.5-AUTENTICACION-Y-UX.md` | Esta documentación |

## Archivos modificados

| Archivo | Cambio exacto |
|---------|----------------|
| `src/services/AuthService.ts` | Se **agregó** `sendPasswordReset()` (funciones previas intactas) |
| `src/screens/auth/LoginScreen.tsx` | Enlace discreto “¿Has olvidado tu contraseña?” |
| `src/screens/home/HomeScreen.tsx` | Card/badge “Mapa” navega a `/routes` |
| `src/screens/report/MyReportsScreen.tsx` | `PageHeader` + `RefreshControl` (CRUD intacto) |
| `src/screens/report/ReportIncidentScreen.tsx` | `PageHeader`, reverse geocode, sin botón Volver duplicado |
| `src/components/LocationCard.tsx` | Muestra Ciudad/Sector/Calle (o fallback) |
| `src/app/(home)/profile.tsx` | `PageHeader` con `router.back()` |
| `docs/CHANGELOG.md` | Entrada Fase UI 4.5 |

---

## Funcionalidades agregadas

- Recuperación de contraseña por correo (`sendPasswordResetEmail`).
- Botón volver (`PageHeader` → `router.back`) en secundarias que lo necesitaban.
- Acceso al mapa seguro desde el badge **Mapa** del Home.
- Pull to refresh en Mis Reportes.
- Dirección legible al reportar (sin cambiar lat/lng en Firestore).

---

## Flujo de funcionamiento

### 1) Recuperación de contraseña

Usuario → Login (“¿Has olvidado…?”) → `ForgotPasswordScreen` → `ForgotPasswordViewModel.requestPasswordReset` → `AuthService.sendPasswordReset` → Firebase Auth `sendPasswordResetEmail` → Alert de éxito/error → UI.

### 2) Botón volver

Usuario → Pantalla secundaria → `PageHeader` (←) → `router.back()` → pantalla anterior.

### 3) Mapa seguro desde Home

Usuario → badge/card “Mapa” o ActionCard “Ver mapa seguro” → `router.push("/routes")` → `RoutesScreen` (sin modificar su código).

### 4) Pull to refresh

Usuario desliza en Mis Reportes → `RefreshControl` → `loadReports(true)` → `loadMyReports` → `IncidentService` / Firestore → actualiza lista manteniendo tarjetas y edición/eliminación.

### 5) Dirección legible

Usuario → “Obtener ubicación” → `getCurrentPositionAsync` (lat/lng) → `reverseGeocodeAsync` → `LocationCard` muestra Ciudad/Sector/Calle → al enviar, Firestore sigue recibiendo solo latitude/longitude.

---

## Compatibilidad

| Tecnología | Estado |
|------------|--------|
| Expo SDK 56 | Compatible (`expo-location` ya en proyecto) |
| Firebase Auth | `sendPasswordResetEmail` |
| Firestore | Esquema de incidentes sin cambios |
| Expo Router | Nueva ruta `/forgot-password` |
| Android / iOS | `RefreshControl`, reverse geocode nativo vía Expo |

---

## Riesgos evitados

| Qué no se tocó | Por qué |
|----------------|---------|
| Login (lógica de sesión) | Solo se añadió un enlace; flujo `loginUser` intacto |
| Funciones previas de AuthService | Solo se agregó `sendPasswordReset` |
| RoutesScreen / Google APIs | Restricción explícita; Home solo corrige navegación |
| Firestore schema | Coordenadas se guardan igual; dirección es UI |
| CRUD Mis Reportes | Solo refresh + header |
| package.json / tema global | Sin dependencias nuevas ni restyle |

---

## Conclusión

La Fase UI 4.5 cierra fricciones reales del día a día: recuperar la cuenta, volver atrás con el mismo patrón visual, entrar al mapa desde el Home, refrescar reportes y entender la ubicación sin leer coordenadas crudas. Todo se apoya en piezas ya existentes (`PageHeader`, Firebase Auth, Firestore, `expo-location`) y deja la arquitectura del equipo igual que antes, con una capa de UX más humana encima.
