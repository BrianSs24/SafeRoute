# SafeRoute

# FASE UI 4.4 — Mejoras del Home

**Estado:** Completada  
**Versión:** 0.4.4

---

# Objetivo

Mejorar la pantalla principal (Home) para ofrecer una experiencia más dinámica y personalizada, eliminando elementos estáticos y preparando la base para futuras funcionalidades relacionadas con las notificaciones inteligentes.

---

# Estado anterior

Antes de esta fase, el Home presentaba varias limitaciones:

- El nombre del usuario estaba definido de forma estática.
- El avatar solo mostraba una inicial fija.
- La campana de notificaciones no tenía funcionalidad.
- No existía un centro de notificaciones.
- No había preferencias para habilitar o deshabilitar alertas.

Estas limitaciones reducían la sensación de personalización y escalabilidad de la aplicación.

---

# Mejoras implementadas

## Nombre dinámico del usuario

El saludo del Home ahora obtiene automáticamente el nombre del usuario autenticado desde Firestore.

Esto permite que cualquier modificación realizada desde el módulo **Editar Perfil** se refleje automáticamente en la pantalla principal.

---

## Avatar dinámico

Se preparó la estructura para soportar fotografías de perfil.

Actualmente:

- Si el usuario posee una fotografía (`photoURL`), esta será utilizada.
- En caso contrario, se muestra automáticamente la inicial de su nombre.

---

## Centro de Notificaciones

La campana del Home dejó de ser únicamente un elemento visual.

Ahora redirige a una pantalla dedicada (`/notifications`) donde el usuario podrá consultar las notificaciones recibidas.

La pantalla incluye:

- listado de notificaciones
- estado leído / no leído
- prioridad
- fecha
- hora
- estado vacío cuando no existen registros
- badge de no leídas en la campana del Home

---

## Preferencias de notificaciones

Se incorporó una nueva preferencia del usuario denominada:

```
notificationsEnabled
```

Esta configuración permite activar o desactivar las futuras notificaciones inteligentes.

Actualmente únicamente se almacena la preferencia en Firestore.  
**No se envían notificaciones reales en esta fase.**

La preferencia se gestiona desde **Configuración** y se hidrata a través de `AppSettingsContext`.

---

# Preparación para futuras mejoras

Aunque no forma parte de esta entrega, se dejó preparada la arquitectura para futuras funcionalidades como:

- Firebase Cloud Messaging (FCM)
- Notificaciones Push
- Alertas geográficas
- Radio de seguridad de 5 km (`DEFAULT_SMART_ALERT_RULE`)
- Historial de alertas
- Contador de notificaciones no leídas

Contratos listos en `src/models/SmartAlert.ts`.  
Esto facilitará futuras ampliaciones sin modificar la estructura actual.

---

# Integración con Firebase

Durante esta fase se realizaron principalmente:

| Operación | Recurso |
|-----------|---------|
| Lectura | `users/{uid}` (nombre, foto, preferencias) |
| Lectura / actualización | colección `notifications` (centro in-app) |
| Actualización | `users/{uid}.notificationsEnabled` |

No se modificó la autenticación.  
No se alteró la estructura principal de Firestore ni `src/config/firebase.ts`.

---

# Archivos creados

| Recurso | Ubicación |
|---------|-----------|
| NotificationsScreen | `src/screens/home/NotificationsScreen.tsx` |
| NotificationCard | `src/components/NotificationCard.tsx` |
| Notification (modelo) | `src/models/Notification.ts` |
| SmartAlert (modelo) | `src/models/SmartAlert.ts` |
| NotificationService | `src/services/NotificationService.ts` |
| HomeViewModel | `src/viewmodels/home/HomeViewModel.ts` |
| NotificationsViewModel | `src/viewmodels/home/NotificationsViewModel.ts` |
| Ruta Expo | `src/app/(home)/notifications.tsx` |
| Documentación de fase | `docs/FASE-UI-4.4-HOME.md` |

---

# Archivos modificados

| Recurso | Ubicación |
|---------|-----------|
| HomeScreen | `src/screens/home/HomeScreen.tsx` |
| WelcomeCard | `src/components/WelcomeCard.tsx` |
| ActionCard | `src/components/ActionCard.tsx` |
| UserService | `src/services/UserService.ts` |
| AppSettingsContext | `src/context/AppSettingsContext.tsx` |
| SettingsViewModel | `src/viewmodels/profile/SettingsViewModel.ts` |
| EditProfileViewModel | `src/viewmodels/profile/EditProfileViewModel.ts` |
| Settings | `src/app/(home)/settings.tsx` |
| CHANGELOG | `docs/CHANGELOG.md` |

---

# Compatibilidad

La implementación mantiene compatibilidad con:

- Expo Router
- Firebase Authentication
- Firestore
- React Native
- Expo SDK 56
- Android
- iOS

No fue necesario instalar nuevas dependencias.

---

# Pruebas realizadas

Se verificó correctamente:

- carga dinámica del nombre
- actualización automática del Home al volver desde Editar Perfil
- funcionamiento del avatar (foto / inicial)
- navegación hacia el Centro de Notificaciones
- persistencia de la preferencia `notificationsEnabled`
- funcionamiento del badge de notificaciones

---

# Resultado

La pantalla Home pasó de ser una interfaz estática a una pantalla personalizada y preparada para futuras funcionalidades relacionadas con notificaciones inteligentes, manteniendo la arquitectura existente y sin afectar el funcionamiento de otros módulos del sistema.
