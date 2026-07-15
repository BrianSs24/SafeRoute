# FASE UI 4.2 — Rediseño de "Mis Reportes"

Documento técnico de implementación para el módulo de historial de incidentes del usuario en SafeRoute.

---

## Objetivo

Evolucionar la experiencia de usuario de la pantalla **Mis Reportes** sin alterar la identidad visual del producto ni la arquitectura existente del proyecto.

La intervención abarca:

- Refinamiento visual de tarjetas, espaciados, badges y jerarquía tipográfica.
- Acciones de **editar** y **eliminar** por reporte.
- Modal de edición in-place (sin navegación a otra pantalla).
- Confirmación previa a eliminación.
- Empty state accionable y estado de carga explícito.
- Animaciones suaves apoyadas en APIs nativas ya disponibles en React Native.

---

## Estado anterior

Antes de esta fase, `MyReportsScreen` ofrecía únicamente:

- Listado de incidentes del usuario (`getIncidentsByUser`).
- Tarjetas informativas (`ReportCard`) sin acciones.
- Empty state visual mínimo (ícono + textos) sin CTA.
- Sin indicador de carga: la lista podía verse vacía mientras resolvía Firestore.
- Sin operaciones de actualización ni borrado sobre la colección `incidents`.

El flujo era de solo lectura (Read) a nivel de UI.

---

## Problema identificado

1. La pantalla no permitía corregir un reporte erróneo sin perder el registro o crear uno nuevo.
2. No existía forma de retirar un reporte desde la app.
3. La UI carecía de feedback de carga y de un empty state orientado a la acción.
4. Las tarjetas cumplían la función informativa, pero con jerarquía y acabado visual mejorables dentro de la misma paleta.

---

## Solución implementada

Se mantuvo el patrón existente del módulo:

`app/(home)/my-reports.tsx` → `MyReportsScreen` → `MyReportsViewModel` → `IncidentService` → Firestore

Sobre esa base se añadió:

| Capacidad | Implementación |
|-----------|----------------|
| Update | `updateIncident` + `updateMyReport` + modal de edición |
| Delete | `deleteIncident` + `deleteMyReport` + `Alert` de confirmación |
| UX visual | Refino de `ReportCard` y header de la pantalla |
| Empty state | Ícono, copy y botón hacia `/report-incident` |
| Loading | `ActivityIndicator` + mensaje mientras carga |

La ubicación (`latitude` / `longitude`) **no** se expone ni se actualiza en el flujo de edición.

---

## Mejoras visuales

- Espaciado del header más consistente con el resto del producto.
- Tarjetas con borde sutil, sombra más suave y radius alineado a `theme.radius.xl`.
- Badges de riesgo/estado más compactos (pill) con tipografía de 12px.
- Ícono de incidente en contenedor cuadrado redondeado (menos “botón circular pesado”).
- Contador de reportes en chip azul claro (misma familia cromática primaria `#2563EB`).
- Acciones Editar / Eliminar como botones secundarios equilibrados en el footer de cada tarjeta.
- Empty state con contenedor de ícono y CTA primario (`CustomButton`).

Colores, tipografía e iconografía (`MaterialCommunityIcons`) se mantienen dentro del sistema visual vigente (`src/styles/theme.ts`).

---

## Mejoras funcionales

1. **Editar** un reporte desde la lista (modal).
2. **Eliminar** un reporte con confirmación.
3. **Sincronización local** de la lista tras Update/Delete (sin reiniciar la pantalla).
4. **Loading** explícito al iniciar la carga.
5. **Empty state** con navegación a reportar incidente (`router.push` a ruta ya existente).
6. **LayoutAnimation** para aparición/actualización/eliminación de ítems.

---

## Flujo de edición

```
Usuario pulsa "Editar" en ReportCard
  → openEditModal(report)
  → Modal se abre (animationType: slide)
  → Formulario se precarga (type, description, riskLevel)
  → Usuario modifica campos permitidos
  → "Guardar cambios"
      → validación local
      → updateMyReport(id, { type, description, riskLevel })
      → IncidentService.updateIncident → Firestore updateDoc
      → éxito: actualiza estado local de la lista + cierra modal
      → error: Alert amigable, modal permanece abierto
  → "Cancelar" / backdrop: cierra sin persistir
```

Campos no editables: ubicación, `status`, `userId`, `createdAt`.

---

## Flujo de eliminación

```
Usuario pulsa "Eliminar"
  → Alert nativo de confirmación
      Mensaje: ¿Estás seguro... / Esta acción no se puede deshacer.
      Botones: Cancelar | Eliminar
  → Si confirma:
      deleteMyReport(id)
      → IncidentService.deleteIncident → Firestore deleteDoc
      → éxito: LayoutAnimation + filtro del ítem en estado local
      → error: Alert amigable (lista intacta)
```

---

## Componentes modificados

| Componente | Rol |
|------------|-----|
| `ReportCard` | Presentación del incidente + acciones Editar/Eliminar |
| `MyReportsScreen` | Orquestación de lista, loading, empty, modal y confirmaciones |
| Reutilizados sin cambio de archivo: `CustomButton`, `CustomInput`, `SelectCard`, `RiskSelector`, `OptionModal` | Formulario del modal alineado al módulo Reportar |

---

## Archivos modificados

| Archivo | Responsabilidad |
|---------|-----------------|
| `src/services/IncidentService.ts` | CRUD Firestore de incidentes (`updateIncident`, `deleteIncident`) |
| `src/viewmodels/report/MyReportsViewModel.ts` | Capas de orquestación `updateMyReport` / `deleteMyReport` |
| `src/components/ReportCard.tsx` | UI de tarjeta y acciones |
| `src/screens/report/MyReportsScreen.tsx` | Pantalla del módulo Mis Reportes |
| `docs/FASE-UI-4.2-MIS-REPORTES.md` | Documentación de esta fase |

**No modificados:** login, registro, home, mapa, perfil, Firebase config, rutas Expo Router, tema global, `package.json`.

---

## Integración con Firestore

Colección: `incidents`

| Operación | Método SDK | Función | Notas |
|-----------|------------|---------|-------|
| Create | `addDoc` | `createIncident` | Existente (otros módulos) |
| Read | `getDocs` + `where("userId")` | `getIncidentsByUser` | Existente; usado al cargar la lista |
| Update | `updateDoc` | `updateIncident` | **Nuevo** — solo `type`, `description`, `riskLevel` |
| Delete | `deleteDoc` | `deleteIncident` | **Nuevo** — documento por `id` |

La configuración de Firebase (`src/config/firebase.ts`) no se alteró.

---

## Consideraciones técnicas

- Arquitectura MVVM ligera del proyecto conservada (screen → viewmodel → service).
- El modal de edición evita rutas nuevas y no modifica el Stack de Expo Router.
- `OptionModal` se reutiliza para el tipo de incidente (mismo patrón que Reportar).
- Animaciones vía `Modal.animationType` + `LayoutAnimation` (sin dependencias nuevas).
- En Android se habilita `setLayoutAnimationEnabledExperimental` cuando aplica.
- Actualización de lista tras editar/eliminar es optimista controlada (solo si Firestore confirma éxito).

---

## Riesgos evitados

- No se cambió el esquema de autenticación ni el flujo de login/registro.
- No se alteró la navegación global ni se añadieron rutas nuevas.
- No se modificó el mapa ni `getAllIncidents`.
- La edición no toca coordenadas, evitando inconsistencias geográficas.
- No se actualizaron dependencias ni versiones de Expo/React Native.
- No se eliminó código compartido todavía en uso.

---

## Compatibilidad

Verificado a nivel de diseño de cambio:

| Área | Estado |
|------|--------|
| Firebase Auth | Intacta |
| Firestore (config) | Intacta |
| Expo Router / rutas | Intactas (solo consumo de `/report-incident` existente) |
| Login / Registro | Intactos |
| Home / Mapa / Perfil | Intactos |
| Tema (`styles/theme.ts`) | Intacto |
| Arquitectura general | Intacta |
| Expo SDK actual | Compatible (APIs RN/Firebase ya usadas en el proyecto) |

---

## Pruebas realizadas

Pruebas estáticas / de revisión de código sobre el diff de esta fase:

- [x] Compilación lógica de props nuevas en `ReportCard` (opcionales `onEdit` / `onDelete`).
- [x] Update escribe únicamente campos editables.
- [x] Delete exige confirmación previa.
- [x] Empty state incluye CTA a reportar.
- [x] Loading evita pantalla en blanco.
- [x] Alcance limitado a archivos del módulo Mis Reportes + servicio/viewmodel relacionados.
- [ ] Prueba manual en dispositivo/emulador Android (recomendado en entorno local).
- [ ] Prueba manual en iOS Simulator (recomendado en entorno local).
- [ ] Validación de permisos/reglas Firestore en consola Firebase para `update`/`delete` del dueño del documento.

> Nota: Si las reglas de seguridad de Firestore no permiten `update`/`delete` al usuario autenticado dueño del documento, la UI mostrará el Alert de error amigable. Ajustar reglas en Firebase Console si aún no contemplan estas operaciones.

---

## Resultado final

La pantalla **Mis Reportes** evoluciona de un historial solo lectura a un módulo de gestión personal de reportes, con UI más profesional y operaciones Update/Delete sobre Firestore, sin romper la identidad visual ni el resto de SafeRoute.
