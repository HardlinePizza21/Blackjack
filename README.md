#Blackjack-vite

pasos para ejecutar el proyecto:

1. Clonar el repositorio
2. Ejecutar ```npm install``` para reconstruir los modulos de node



## Requisitos del projecto(Rehaciendo el proyecto)

### Introduccion general
Quiero hacer un Blackjack online para varios jugadores, todos estan en la misma mesa y todos comenzaron con las mismas fichas y todos pueden ver todas las cartas de los demas. Cada jugador decide cuanto apostar y comienza la ronda, los jugadores deciden si *hit* o *stay*, solo hay un mazo de cartas y 8 segundos para decidir. Al acabar el tiempo la casa procede a sacar de forma *soft 17*

### Diagrama de despliegue

El juego no va a tener base de datos, solo va a ser un proceso monolito, para hacer una web modular pero no demasiada compleja, y definitivamente no muy escalable pero de desarrollo rapido y sencillo voy a utilizar *vite + react* ademas *socket.io* se combina muy bien con react y asi tendria un monolito, rapido de construir y con un buen mecanismo base para multiplayer.




La plataforma de despliegue mas apropiada me parece netlify, ya que solo es un proyecto de garajes


