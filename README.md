# Leincester API

Microservicio que guarda en una base de datos MongoDB toda la información actualizada al momento de iniciarse, sobre todos los partidos jugados por el equipo Leincester.
Cuenta con una API Rest con diferentes endpoint que pueden devolver la siguiente información util de manera ordenada:
  - `GET /games/last`: Información sobre el último partido jugado por el equipo.
  - `GET /games/last/50`: Información sobre los últimos 50 partidos jugados por el equipo.
  - `GET /games/id`: Información de un partido en especifico a través de su id.
  - `GET /games/yyyy-mm-dd`: Información de un partido en especifico a través de la fecha en que se jugó.
  - `GET /games/date/yyyy-mm-dd/yyyy-mm-dd`: Información de todos los partidos en un rango de fechas especifico.
  - `GET /team/goals/yyyy-mm-dd`: Contar la cantidad de puntos obtenidas en un rango de fechas especifico.
  - `POST /games/add`: Añadir un nuevo juego a la base de datos. Ejemplo de body:
  ```JSON
{
  "date": "2020-10-12",
  "teamOne": {
    "name": "Leicester City",
    "goals": 2
  },
  "teamTwo": {
    "name": "Este es un equipo",
    "goals": 1
  },
  "stadium": "Un estadio bonito"
}
  ```

#### Configuración
  - Crear una base de datos MongoDB y guardar los datos de acceso.
  - Crear un archivo llamado `.env` y dentro agregar las siguientes variables:
```
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_HOST=
```
  - Instala todas las dependencias con el comando `npm install`
  - Inicia el servidor con el comando `npm install`
