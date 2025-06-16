# 🧩 Planning Poker - Historias de Usuario y Criterios de Aceptación

## ✅ Progreso de Historias (Check para marcar completadas)

- [ ] 1. Crear Partida (Sin Rol)
- [ ] 2. Crear Usuario Administrador
- [ ] 3. Visualizar Mesa de Votación (Administrador)
- [ ] 4. Elegir Carta con Puntaje (Administrador)
- [ ] 5. Revelar Cartas y Promedio (Administrador)
- [ ] 6. Reiniciar Partida (Administrador)
- [ ] 7. Invitar Participantes (Administrador)
- [ ] 8. Crear Usuario Jugador
- [ ] 9. Visualizar Mesa de Votación (Jugador)
- [ ] 10. Elegir Carta con Puntaje (Jugador)
- [ ] 11. Invitar Participantes (Jugador)
- [ ] 12. Cambiar Modo de Visualización (Jugador/Admin)
- [ ] 13. Asignar Rol de Administrador
- [ ] 14. Cambiar Modo de Puntaje de Cartas

---

## 📌 Historias de Usuario y Criterios de Aceptación

### 1. Crear Partida (Sin Rol)
**Historia**: Como usuario sin rol, quiero poder crear una nueva partida, para que otros usuarios se conecten.

**Criterios**:
- Nombre válido (5–20 caracteres, máx. 3 números, sin especiales, no solo números).
- Se crea una sala (Room) con ese nombre.

---

### 2. Crear Usuario Administrador
**Historia**: Como administrador, quiero crear mi perfil con modo de visualización y sala para administrar una partida.

**Criterios**:
- Ingresar nombre, modo y Room.
- El usuario se crea con rol de propietario.

---

### 3. Visualizar Mesa de Votación (Administrador)
**Historia**: Como administrador, quiero ver la mesa con los jugadores para monitorear votaciones.

**Criterios**:
- Mesa redonda con todos los jugadores.
- Carta en blanco si no han votado.
- Carta especial para espectadores.

---

### 4. Elegir Carta con Puntaje (Administrador)
**Historia**: Como administrador, quiero elegir una carta visible para mostrar mi voto.

**Criterios**:
- Solo jugadores pueden votar.
- Cartas con puntajes únicos.
- Si no hay cartas, se muestra advertencia.
- Al votar: se notifica a todos, y se actualiza visualmente.

---

### 5. Revelar Cartas y Promedio (Administrador)
**Historia**: Como administrador, quiero revelar todas las cartas para ver resultados y promedio.

**Criterios**:
- Solo admin puede revelar.
- Se ven cartas elegidas por jugadores.
- Espectadores conservan diseño.
- Se muestra cantidad por carta y promedio.

---

### 6. Reiniciar Partida (Administrador)
**Historia**: Como administrador, quiero reiniciar la partida para iniciar nueva ronda.

**Criterios**:
- Todos los jugadores vuelven a estado inicial.
- Se puede votar y revelar de nuevo.

---

### 7. Invitar Participantes (Administrador)
**Historia**: Como administrador, quiero generar y compartir un link para invitar usuarios.

**Criterios**:
- Link único generado.
- Botón para copiar.

---

### 8. Crear Usuario Jugador
**Historia**: Como jugador, quiero registrarme con nombre, modo y sala para participar.

**Criterios**:
- Ingresar nombre, modo (jugador/espectador), y Room.
- Reglas del nombre igual a las de partida.

---

### 9. Visualizar Mesa de Votación (Jugador)
**Historia**: Como jugador, quiero ver la mesa para saber quién ha votado.

**Criterios**:
- Mesa circular.
- Cartas en blanco si no votaron.
- Diseño especial para espectadores.

---

### 10. Elegir Carta con Puntaje (Jugador)
**Historia**: Como jugador, quiero elegir una carta visible para mostrar mi voto.

**Criterios**:
- Solo jugadores pueden votar.
- Cartas con puntajes únicos.
- Advertencia si no hay cartas.
- Al votar: se notifica y se actualiza visual.

---

### 11. Invitar Participantes (Jugador)
**Historia**: Como jugador, quiero compartir un link para que otros se unan.

**Criterios**:
- Se genera link.
- Botón para copiar.

---

### 12. Cambiar Modo de Visualización (Jugador/Admin)
**Historia**: Como jugador o admin, quiero cambiar modo a espectador cuando no quiera votar.

**Criterios**:
- Modo jugador: puede votar.
- Modo espectador: no vota, tiene diseño especial.

---

### 13. Asignar Rol de Administrador
**Historia**: Como admin, quiero asignar el rol de administrador a otro usuario.

**Criterios**:
- Solo admin puede asignar.
- Solo admin puede revelar o reiniciar partida.

---

### 14. Cambiar Modo de Puntaje de Cartas
**Historia**: Como admin, quiero cambiar el tipo de puntaje de las cartas.

**Criterios**:
- Solo admin puede cambiar.
- Solo antes de revelar cartas.
- Si ya se votó: se resetean votos.
- Se aplica nueva opción, afecta las cartas visibles.

