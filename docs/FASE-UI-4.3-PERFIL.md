# Portada

| Campo | Valor |
|-------|--------|
| **Proyecto** | SafeRoute |
| **Fase** | UI 4.3 — Perfil |
| **Fecha** | 14 de julio de 2026 |
| **Objetivo** | Convertir el módulo Perfil en un centro completo de administración de cuenta: edición de datos, seguridad (cambio de contraseña), configuración visual (modo oscuro y temas) y cierre de sesión seguro, sin alterar la arquitectura general ni los módulos no relacionados. |

---

# Resumen Ejecutivo

En esta fase se perfeccionó el área de **Perfil** de SafeRoute. El usuario puede administrar su información en Firestore, cambiar su contraseña mediante Firebase Auth (con reautenticación), personalizar la apariencia del módulo (modo oscuro y selector de temas de acento) y cerrar sesión de forma confirmada e íntegra (`signOut`).

Se añadieron las rutas faltantes `/change-password` y `/settings`, se calcularon estadísticas reales a partir de los reportes del usuario y se introdujo un contexto ligero de preferencias (`AppSettingsProvider`) persistido en el documento `users/{uid}`.

---

# Estado anterior

Antes de la Fase UI 4.3 el módulo Perfil presentaba estas características:

- Encabezado y opciones de menú con navegación parcial.
- Enlaces a `/change-password` y `/settings` **sin pantallas**.
- Edición de perfil con valores hardcodeados (`Brian`, `Sosa`, etc.).
- Estadísticas fijas (`24 / 18 / 96`), no derivadas de Firestore.
- “Cerrar sesión” solo navegaba a `/login` **sin** invocar `logout()` de Firebase Auth.
- “Acerca de SafeRoute” sin acción.
- Sin preferencias de apariencia ni modo oscuro de producto.

---

# Problemas identificados

1. Rutas de Seguridad y Configuración rotas.
2. Datos de perfil no hidratados desde Firestore en la pantalla de edición.
3. Sesión Firebase podía permanecer activa tras “cerrar sesión” desde Perfil.
4. Falta de control de acceso a la contraseña desde la app.
5. Ausencia de personalización visual persistente por usuario.
6. Métricas de equipo/comunidad inventadas, sin valor operativo.

---

# Objetivos de la mejora

- Completar el ciclo de administración de cuenta dentro del módulo Perfil.
- Garantizar cierre de sesión real y confirmado.
- Habilitar cambio de contraseña con validaciones y reautenticación.
- Persistir y aplicar preferencias visuales (modo oscuro + tema).
- Mostrar estadísticas coherentes con los reportes del usuario.
- Mantener compatibilidad con Expo Router, Firebase Auth/Firestore y el resto de módulos.

---

# Arquitectura utilizada

Se respetó el patrón vigente del proyecto:

```
Ruta Expo Router (app/(home)/*)
  → Pantalla / orquestación UI
  → ViewModel (async)
  → Service (AuthService / UserService / IncidentService)
  → Firebase Auth | Firestore
```

Complemento acotado a esta fase:

- `AppSettingsProvider` (`src/context/AppSettingsContext.tsx`) en el layout raíz, solo para preferencias de apariencia del módulo Perfil.
- Paleta local `getProfilePalette` (`src/styles/profileTheme.ts`) sin modificar `src/styles/theme.ts` global del resto de la app.

---

# Pantallas involucradas

| Pantalla | Ruta | Acción |
|----------|------|--------|
| Perfil | `/profile` | Rediseño funcional + stats + logout seguro |
| Editar perfil | `/edit-profile` | Hidratación Firestore + validaciones |
| Seguridad / Contraseña | `/change-password` | **Nueva** |
| Configuración | `/settings` | **Nueva** |

---

# Componentes modificados

| Componente | Responsabilidad |
|------------|-----------------|
| `ProfileHeader` | Cabecera de identidad; admite colores de acento del tema |
| `ProfileOption` | Fila de menú; soporta superficies/textos para modo oscuro |
| `ProfileStats` | Métricas; colores adaptativos |
| `PageHeader` | Cabecera con back; colores opcionales para pantallas de perfil |

---

# Funcionalidades implementadas

## Edición de perfil

- Carga automática de `firstName`, `lastName`, `email`, `phone` desde Firestore.
- Validación de nombre/apellido obligatorios y correo con formato básico.
- Persistencia con `saveUserProfile` (`setDoc` merge), conservando `appearance` y `photoURL`.
- Feedback por `Alert` de éxito o error.

## Cambio de contraseña

- Formulario: contraseña actual, nueva y confirmación.
- Validaciones locales (longitud mínima, coincidencia, diferencia respecto a la actual).
- Firebase: `reauthenticateWithCredential` + `updatePassword`.
- Mensajes amigables vía `getFirebaseErrorMessage`.

## Configuración visual

- Pantalla dedicada con secciones de apariencia.
- Persistencia en `users/{uid}.appearance`.

## Modo oscuro

- Switch en Configuración.
- Aplica la paleta oscura del módulo Perfil (perfil, edición, seguridad, settings).
- No reescribe Home, Mapa ni Auth (alcance controlado).

## Selector de temas

- Opciones: **Azul SafeRoute**, **Teal**, **Índigo**.
- Actualiza acentos del header y opciones del módulo Perfil.
- Selección persistida junto al modo oscuro.

## Cierre de sesión

- Diálogo de confirmación.
- `AuthService.logout()` (`signOut`) y luego `router.replace("/login")`.
- Manejo de error si el sign-out falla.

---

# Integración con Firebase

| Operación | API / método | Uso |
|-----------|--------------|-----|
| Sesión actual | `auth.currentUser` | Carga de perfil y seguridad |
| Cerrar sesión | `signOut` | Logout seguro |
| Reautenticación | `EmailAuthProvider` + `reauthenticateWithCredential` | Antes de cambiar contraseña |
| Cambio de clave | `updatePassword` | Seguridad de cuenta |

La configuración del proyecto Firebase (`src/config/firebase.ts`) **no** se modificó.

---

# Integración con Firestore

| Operación | Colección / doc | Detalle |
|-----------|-----------------|---------|
| Lectura perfil | `users/{uid}` | `loadCurrentUserProfile` / `getDoc` |
| Actualización perfil | `users/{uid}` | `setDoc` merge vía `saveUserProfile` |
| Preferencias | `users/{uid}.appearance` | `{ darkMode, themeId }` |
| Stats | `incidents` where `userId` | Conteo total / verificados / % confianza |

Validaciones de negocio se aplican en ViewModels antes de escribir.

---

# Mejoras visuales

- Menú de perfil con mejor espaciado y sombras suaves.
- Stats alimentadas por datos reales.
- Headers adaptados a modo oscuro/acento.
- Settings con tarjetas, switch y selector de tema con swatches.
- Pantalla de seguridad con tarjeta informativa de buenas prácticas.
- Loading explícito al abrir Perfil y Editar perfil.

---

# Mejoras de experiencia de usuario (UX)

- El usuario encuentra ahora todas las acciones de cuenta en un solo hub.
- Deja de haber callejones sin salida (`/settings`, `/change-password`).
- Logout previene abandonos accidentales y limpia la sesión Auth.
- Preferencias visuales se recuerdan entre sesiones (Firestore).
- Editar perfil ya no parte de datos ficticios hardcodeados.

---

# Validaciones implementadas

| Flujo | Validaciones |
|-------|----------------|
| Editar perfil | Nombre y apellido no vacíos; email con `@` |
| Cambiar contraseña | Actual requerida; nueva ≥ 6; coincidencia; distinta a la actual |
| Configuración | Persistencia atómica; rollback visual si falla el guardado |
| Logout | Confirmación previa obligatoria |

---

# Manejo de errores

- Errores de Auth normalizados con `getFirebaseErrorMessage` (incluye `wrong-password`, `requires-recent-login`, `too-many-requests`).
- Fallos de guardado de perfil/configuración → `Alert` con mensaje claro.
- Fallo de logout → `Alert` sin redirigir.
- Preferencias: si Firestore falla tras un cambio optimista, se recarga el estado desde el perfil.

---

# Riesgos evitados

Módulos **no** modificados para evitar regresiones:

- Login / Registro (UI)
- Home
- Mapa / Routes
- Reportar incidente / Mis Reportes (lógica 4.2)
- Google Places / Directions
- Tema global `src/styles/theme.ts` (valores base intactos)
- Dependencias y versiones (`package.json`)

Solo se tocó AuthService para añadir `changePassword` (compatible y no invasivo).

---

# Compatibilidad

| Tecnología | Compatibilidad |
|------------|----------------|
| Expo Router | Rutas nuevas bajo `(home)`; Stack existente |
| Firebase Auth | Email/password + reauth + updatePassword |
| Firestore | Merge de perfil y appearance |
| React Native | Switch, Alert, ScrollView, Focus effects |
| Android | Soportado |
| iOS | Soportado |
| Expo SDK 56 | Sin nuevas dependencias npm |

---

# Archivos modificados

| Archivo | Responsabilidad | Motivo del cambio |
|---------|-----------------|-------------------|
| `src/app/_layout.tsx` | Layout raíz | Integrar `AppSettingsProvider` |
| `src/app/(home)/profile.tsx` | Hub de cuenta | Stats reales, logout, apariencia |
| `src/app/(home)/edit-profile.tsx` | Edición | Hidratar Firestore + validar |
| `src/app/(home)/change-password.tsx` | Seguridad | Pantalla nueva |
| `src/app/(home)/settings.tsx` | Preferencias | Pantalla nueva |
| `src/context/AppSettingsContext.tsx` | Estado de apariencia | Preferencias globales de módulo |
| `src/styles/profileTheme.ts` | Paletas perfil | Modo oscuro + temas |
| `src/services/AuthService.ts` | Auth | `changePassword` |
| `src/services/UserService.ts` | Perfil Firestore | Tipo `appearance` |
| `src/viewmodels/profile/*` | Orquestación | Load/save/password/settings/stats |
| `src/components/profile/*` | UI perfil | Soporte de colores adaptativos |
| `src/components/common/PageHeader.tsx` | Header | Colores opcionales |
| `src/utils/firebaseErrors.ts` | Mensajes Auth | Más códigos útiles |
| `docs/CHANGELOG.md` | Historial | Entrada de fase |
| `docs/FASE-UI-4.3-PERFIL.md` | Doc de fase | Este documento |

---

# Pruebas realizadas

Checklist recomendado para QA manual:

1. **Perfil**
   - Abrir `/profile` autenticado → ver nombre/correo reales o fallbacks coherentes.
   - Verificar que los contadores cambian al crear/eliminar reportes.
2. **Editar perfil**
   - Modificar nombre/teléfono → Guardar → volver a Perfil y comprobar actualización.
   - Probar validación dejando nombre vacío.
3. **Contraseña**
   - Contraseña actual incorrecta → mensaje amigable.
   - Flujo exitoso → Alert + retorno a Perfil; login posterior con la nueva clave.
4. **Configuración**
   - Activar modo oscuro → pantallas de perfil oscurecen.
   - Cambiar tema → header y acentos se actualizan.
   - Reiniciar app / reabrir Perfil → preferencias persisten.
5. **Logout**
   - Cancelar diálogo → permanece en Perfil.
   - Confirmar → `signOut` + pantalla de login; rutas protegidas por sesión fallan al usar `getCurrentUser` nulo.

> Automatización E2E no incluida en esta fase.

---

# Resultado final

El módulo **Perfil** queda consolidado como centro de administración de cuenta alineado con la identidad visual de SafeRoute. La fase entrega valor funcional inmediato (seguridad, preferencias, datos reales) sin reescribir la arquitectura ni contaminar módulos ajenos. La documentación queda versionada de forma independiente en este archivo y referenciada desde `docs/CHANGELOG.md`.
