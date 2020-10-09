# Leincester API

Microservicio que guarda en una base de datos MongoDB toda la información actualizada al momento de iniciarse, sobre todos los partidos jugados por el equipo Leincester.
Cuenta con una API Rest con diferentes endpoint que pueden devolver la siguiente información util de manera ordenada:
  - `/games/last`: Información sobre el último partido jugado por el equipo.
  - `/games/last/50`: Información sobre los últimos 50 partidos jugados por el equipo.
  - `/games/id`: Información de un partido en especifico a través de su id.
  - `/games/yyyy-mm-dd`: Información de un partido en especifico a través de la fecha en que se jugó.
  - `/games/date/yyyy-mm-dd/yyyy-mm-dd`: Información de todos los partidos en un rango de fechas especifico.
  - `/team/goals/yyyy-mm-dd`: Contar la cantidad de puntos obtenidas en un rango de fechas especifico.

#### To-do

  - Añadir JWT para que solo las personas autorizadas puedan utilizar la API.
  - Añadir una ruta que permita añadir manualmente un partido.