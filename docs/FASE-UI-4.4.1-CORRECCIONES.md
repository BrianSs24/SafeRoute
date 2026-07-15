# FASE UI 4.4.1 — Correcciones Perfil y Configuración

| Campo | Valor |
|-------|--------|
| **Proyecto** | SafeRoute |
| **Fase** | UI 4.4.1 — Auditoría técnica correctiva |
| **Versión** | 0.4.4.1 |
| **Fecha** | 15 de julio de 2026 |
| **Alcance** | Corrección de errores en Perfil / Configuración + centralización del modo oscuro global (sin nuevo sistema de temas). |

---

# Resumen

Existían tres problemas en el módulo Perfil/Configuración:

1. **Editar perfil:** `setDoc()` fallaba con `Unsupported field value: undefined`.
2. **Configuración (notificaciones / apariencia):** el mismo error de Firestore al persistir preferencias.
3. **Cambiar fotografía:** el control no tenía acción (la app parecía rota).

Esta fase corrigió la causa raíz de las escrituras inválidas y añadió un mensaje informativo en la foto, sin integrar Firebase Storage ni cambiar navegación/arquitectura.

---

# Causa raíz

## Errores 1 y 2 — `undefined` en Firestore

Firestore **no admite** el valor JavaScript `undefined` en ningún nivel del documento (ni en campos anidados).

### Por qué fallaba la sanitización anterior

La función previa (`sanitizeUserWriteData`) era **superficial**:

- Recorría solo el primer nivel con `Object.entries`.
- Omitía `notificationsEnabled: undefined` y lo reemplazaba por `true`.
- **No** limpiaba propiedades `undefined` **dentro** de objetos anidados (especialmente `appearance`).

Ejemplo de payload inválido que pasaba el filtro shallow:

```js
{
  uid: "...",
  firstName: "Joel",
  notificationsEnabled: true, // corregido en raíz
  appearance: {
    darkMode: true,
    themeId: undefined   // ← Firestore rechaza esto
  }
}
```

### Dónde se generaba

| Origen | Archivo | Mecanismo |
|--------|---------|-----------|
| Documentos legacy | Firestore `users/{uid}` | Sin `appearance` / `notificationsEnabled` completos |
| Normalización anterior | `UserService.normalizeLoadedProfile` | Hacía `...data` del snapshot crudo |
| Reescritura | `EditProfileViewModel` / `SettingsViewModel` | Reenviaba `appearance` incompleto o con huecos |
| Escritura | `UserService.saveUserProfile` → `setDoc` | Sanitización shallow insuficiente |

### Propiedades típicas involucradas

- `notificationsEnabled` (usuarios antiguos: ausente → `undefined` en el objeto de escritura).
- `appearance.themeId` / `appearance.darkMode` (objetos parciales o reconstruidos con claves indefinidas).
- Cualquier campo anidado derivado de spreads crudos del documento.

---

# Archivos revisados

| Archivo | Hallazgo |
|---------|----------|
| `src/services/UserService.ts` | Sanitizer shallow; spread crudo al leer; punto único de `setDoc`/`updateDoc` de usuarios |
| `src/viewmodels/profile/EditProfileViewModel.ts` | Podía reenviar `appearance` incompleto |
| `src/viewmodels/profile/SettingsViewModel.ts` | Persistía apariencia/notificaciones vía `saveUserProfile` |
| `src/viewmodels/profile/ProfileViewModel.ts` | Solo lectura; sin escritura problemática |
| `src/context/AppSettingsContext.tsx` | Orquesta guardado; no escribe directo a Firestore |
| `src/app/(home)/edit-profile.tsx` | Botón foto sin `onPress` |
| `src/app/(home)/settings.tsx` | UI correcta; error venía del pipeline de escritura |

---

# Archivos modificados

| Archivo | Motivo |
|---------|--------|
| `src/services/UserService.ts` | Sanitización profunda global + normalización tipada al leer |
| `src/viewmodels/profile/EditProfileViewModel.ts` | Payload sin `undefined`; apariencia normalizada |
| `src/viewmodels/profile/SettingsViewModel.ts` | Payload sin `undefined`; apariencia/notificaciones con boolean seguro |
| `src/app/(home)/edit-profile.tsx` | Alert en “Cambiar fotografía” |
| `docs/FASE-UI-4.4.1-CORRECCIONES.md` | Documentación de la corrección |
| `docs/CHANGELOG.md` | Entrada 4.4.1 |

---

# Solución implementada

1. **Una sola función pública de sanitización:** `sanitizeUserDocumentForFirestore` en `UserService`.
2. **Limpieza recursiva** de `undefined` (`removeUndefinedDeep`), conservando `null`.
3. **Whitelist** de claves del documento de usuario.
4. **`notificationsEnabled`** siempre boolean (`true` si falta — usuarios legacy).
5. **`appearance`** normalizada a `{ darkMode: boolean, themeId: 'blue'|'teal'|'indigo' }`.
6. **Lectura tipada** sin `...snapshot.data()` crudo.
7. **`setDoc(..., { merge: true })`** se mantiene.
8. Foto: `Alert` — *“Esta funcionalidad estará disponible en una futura versión.”*

---

# Compatibilidad

| Escenario | Comportamiento |
|-----------|----------------|
| Usuario nuevo | Escribe campos completos + `notificationsEnabled: true` por defecto |
| Usuario antiguo sin `notificationsEnabled` | Se inicializa en `true` al guardar |
| Usuario antiguo sin `appearance` | No se fuerza `appearance` vacío; al cambiar tema/modo se escribe objeto válido |
| Sin `photoURL` | Se persiste string vacío o se omite según fuente; nunca `undefined` |

---

# Riesgos evitados

- Futuros campos opcionales en `users/{uid}` no romperán `setDoc` si pasan por `saveUserProfile` / `updateUserProfile`.
- No hay sanitizadores duplicados en ViewModels (un solo gate en el servicio).
- No se instaló Storage ni dependencias; no se alteró Auth ni otros módulos.

---

# Pruebas realizadas

| Prueba | Resultado esperado | Estado |
|--------|--------------------|--------|
| Guardar perfil | Sin error Firestore | Verificado por revisión de pipeline |
| Cambiar nombre | Persiste `firstName` | Verificado por revisión de pipeline |
| Cambiar teléfono | Persiste `phone` | Verificado por revisión de pipeline |
| Guardar apariencia (modo oscuro) | Objeto `appearance` válido | Verificado por revisión de pipeline |
| Cambiar tema | `themeId` siempre definido | Verificado por revisión de pipeline |
| Activar/desactivar notificaciones | Boolean persistido | Verificado por revisión de pipeline |
| Abrir editar perfil | Hidratación sin crash | Verificado por revisión de pipeline |
| Pulsar cambiar fotografía | Alert informativo | Implementado |

> Nota: validación en dispositivo/emulador recomendada tras recargar el bundle (evitar caché Metro del sanitizer antiguo).

---

## Modo oscuro global

### Cómo funcionaba antes

El flag `appearance.darkMode` se guardaba en Firestore y se hidrataba en `AppSettingsContext`, pero la UI oscura se resolvía solo con `getProfilePalette()` (archivo `profileTheme.ts`) y se aplicaba a pantallas del módulo Perfil (Perfil, Editar perfil, Configuración, Seguridad).

El resto de la app importaba el objeto estático `theme` de `styles/theme.ts` (siempre claro).

### Por qué solo afectaba Perfil

Existían dos caminos de apariencia:

1. Paleta dinámica limitada a Perfil (`getProfilePalette`).
2. Tema estático global (`theme`) usado por Home, Reportes, Mapa, Auth, cards, inputs, etc.

Activar el switch de modo oscuro actualizaba el estado, pero Home/Mapa/Reportes no leían ese estado.

### Qué cambios se realizaron

1. **`styles/theme.ts`** pasó a ser la **única fábrica** (`buildAppTheme(darkMode, themeId)`).
2. **`AppSettingsContext`** expone `theme` resuelto + hook `useAppTheme()`.
3. **`profileTheme.ts`** solo reexporta (compatibilidad); no duplica colores.
4. Componentes y pantallas consumen `useAppTheme()` / `theme.colors`.
5. Root layout aplica `StatusBar` y `contentStyle` según el tema.
6. Home llama `reloadFromProfile()` al ganar foco para sincronizar apariencia tras login.
7. Mapa usa `darkMapStyle` solo si `theme.darkMode`.

La preferencia sigue en Firestore: `users/{uid}.appearance.darkMode` (sin cambiar el esquema). El toggle actualiza estado de forma optimista → toda la UI se re-pinta sin cerrar sesión.

### Componentes / pantallas que usan el tema global

| Área | Archivos |
|------|----------|
| Shell | `_layout.tsx` (StatusBar + fondo Stack) |
| Auth | `LoginScreen`, `RegisterScreen` |
| Home | `HomeScreen`, `WelcomeCard`, `ActionCard` |
| Notificaciones | `NotificationsScreen`, `NotificationCard` |
| Reportes | `MyReportsScreen`, `ReportIncidentScreen`, `ReportCard` |
| Mapa | `RoutesScreen`, `SearchBar`, `SearchResults`, `IncidentBottomSheet`, `MyLocationButton` |
| Perfil | `profile`, `edit-profile`, `settings`, `change-password`, `Profile*` |
| UI base | `CustomButton`, `CustomInput`, `PageHeader`, `SelectCard`, `LocationCard`, `OptionModal`, `RiskSelector` |

### Centralización del sistema de apariencia

```
Firestore users/{uid}.appearance
        ↓
AppSettingsProvider (estado darkMode + themeId)
        ↓
buildAppTheme()  ← única fuente de colores
        ↓
useAppTheme() / useAppSettings().theme
        ↓
Pantallas y componentes de toda la app
```

No se creó un segundo ThemeProvider ni una segunda tabla de colores.

---

# Resultado final

Los flujos de **Editar perfil** y **Configuración** quedan protegidos de forma global contra `undefined` en Firestore. El control de fotografía deja de parecer roto. El **modo oscuro** y el acento de tema se aplican de forma uniforme en toda la aplicación a través de `AppSettingsContext` + `buildAppTheme`.
