import React, { useState, useEffect, useRef, useCallback } from "react";

/* ------------------------------------------------------------------ */
/* Seed vocabulary — [spanish, english, category, level]                */
/* ------------------------------------------------------------------ */
const SEED_WORDS = [
  // Saludos
  ["Hola", "Hello", "Saludos", "A1"],
  ["Buenos días", "Good morning", "Saludos", "A1"],
  ["Buenas tardes", "Good afternoon", "Saludos", "A1"],
  ["Buenas noches", "Good night / evening", "Saludos", "A1"],
  ["Adiós", "Goodbye", "Saludos", "A1"],
  ["Hasta luego", "See you later", "Saludos", "A1"],
  ["Hasta mañana", "See you tomorrow", "Saludos", "A1"],
  ["Por favor", "Please", "Saludos", "A1"],
  ["Gracias", "Thank you", "Saludos", "A1"],
  ["De nada", "You're welcome", "Saludos", "A1"],
  ["Perdón", "Sorry / excuse me", "Saludos", "A1"],
  ["¿Cómo estás?", "How are you?", "Saludos", "A1"],
  ["Bien, gracias", "Fine, thanks", "Saludos", "A1"],
  ["¿Cómo te llamas?", "What is your name?", "Saludos", "A1"],
  ["Me llamo...", "My name is...", "Saludos", "A1"],
  ["Mucho gusto", "Nice to meet you", "Saludos", "A1"],
  ["¿De dónde eres?", "Where are you from?", "Saludos", "A1"],
  ["Soy de...", "I am from...", "Saludos", "A1"],
  // Números
  ["cero", "zero", "Números", "A1"],
  ["uno", "one", "Números", "A1"],
  ["dos", "two", "Números", "A1"],
  ["tres", "three", "Números", "A1"],
  ["cuatro", "four", "Números", "A1"],
  ["cinco", "five", "Números", "A1"],
  ["seis", "six", "Números", "A1"],
  ["siete", "seven", "Números", "A1"],
  ["ocho", "eight", "Números", "A1"],
  ["nueve", "nine", "Números", "A1"],
  ["diez", "ten", "Números", "A1"],
  ["once", "eleven", "Números", "A1"],
  ["doce", "twelve", "Números", "A1"],
  ["trece", "thirteen", "Números", "A1"],
  ["catorce", "fourteen", "Números", "A1"],
  ["quince", "fifteen", "Números", "A1"],
  ["dieciséis", "sixteen", "Números", "A1"],
  ["diecisiete", "seventeen", "Números", "A1"],
  ["dieciocho", "eighteen", "Números", "A1"],
  ["diecinueve", "nineteen", "Números", "A1"],
  ["veinte", "twenty", "Números", "A1"],
  ["treinta", "thirty", "Números", "A1"],
  ["cuarenta", "forty", "Números", "A1"],
  ["cincuenta", "fifty", "Números", "A1"],
  ["sesenta", "sixty", "Números", "A1"],
  ["setenta", "seventy", "Números", "A1"],
  ["ochenta", "eighty", "Números", "A1"],
  ["noventa", "ninety", "Números", "A1"],
  ["cien", "one hundred", "Números", "A1"],
  // Colores
  ["rojo", "red", "Colores", "A1", null, "Me gusta el color rojo. — I like the color red."],
  ["azul", "blue", "Colores", "A1", null, "El cielo está azul hoy. — The sky is blue today."],
  ["verde", "green", "Colores", "A1", null, "Sus ojos son verdes. — Her eyes are green."],
  ["amarillo", "yellow", "Colores", "A1", null, "El sol es amarillo. — The sun is yellow."],
  ["negro", "black", "Colores", "A1", null, "Tiene el pelo negro. — He has black hair."],
  ["blanco", "white", "Colores", "A1", null, "La nieve es blanca. — Snow is white."],
  ["gris", "gray", "Colores", "A1", null, "El cielo está gris. — The sky is gray."],
  ["morado", "purple", "Colores", "A1", null, "Compré una camisa morada. — I bought a purple shirt."],
  ["rosa", "pink", "Colores", "A1", null, "Le regalé flores rosas. — I gave her pink flowers."],
  ["naranja", "orange", "Colores", "A1", null, "La naranja es de color naranja. — The orange is orange-colored."],
  ["café (color)", "brown", "Colores", "A1", null, "Tiene los ojos café. — He has brown eyes."],
  // Familia
  ["la madre", "mother", "Familia", "A1", null, "Mi madre cocina muy bien. — My mother cooks very well."],
  ["el padre", "father", "Familia", "A1", null, "Mi padre trabaja en un banco. — My father works at a bank."],
  ["el hermano", "brother", "Familia", "A1", null, "Tengo un hermano mayor. — I have an older brother."],
  ["la hermana", "sister", "Familia", "A1", null, "Mi hermana vive en México. — My sister lives in Mexico."],
  ["el abuelo", "grandfather", "Familia", "A1", null, "Mi abuelo tiene ochenta años. — My grandfather is eighty years old."],
  ["la abuela", "grandmother", "Familia", "A1", null, "Mi abuela hace pan casero. — My grandmother makes homemade bread."],
  ["el hijo", "son", "Familia", "A1", null, "Su hijo estudia medicina. — Her son is studying medicine."],
  ["la hija", "daughter", "Familia", "A1", null, "Tienen una hija pequeña. — They have a young daughter."],
  ["el esposo", "husband", "Familia", "A1", null, "Mi esposo llega a las seis. — My husband arrives at six."],
  ["la esposa", "wife", "Familia", "A1", null, "Su esposa es doctora. — His wife is a doctor."],
  ["el tío", "uncle", "Familia", "A1", null, "Mi tío vive cerca de aquí. — My uncle lives near here."],
  ["la tía", "aunt", "Familia", "A1", null, "Mi tía siempre me llama los domingos. — My aunt always calls me on Sundays."],
  ["el primo", "cousin", "Familia", "A1", null, "Mi primo juega fútbol los sábados. — My cousin plays soccer on Saturdays."],
  ["la familia", "family", "Familia", "A1", null, "Mi familia es muy grande. — My family is very big."],
  // Comida
  ["el agua", "water", "Comida", "A1", null, "Bebo mucha agua todos los días. — I drink a lot of water every day."],
  ["el pan", "bread", "Comida", "A1", null, "Compramos pan fresco cada mañana. — We buy fresh bread every morning."],
  ["la leche", "milk", "Comida", "A1", null, "¿Tienes leche para el café? — Do you have milk for the coffee?"],
  ["el café (bebida)", "coffee", "Comida", "A1", null, "Tomo café por la mañana. — I drink coffee in the morning."],
  ["el huevo", "egg", "Comida", "A1", null, "Desayuno un huevo frito. — I eat a fried egg for breakfast."],
  ["el arroz", "rice", "Comida", "A1", null, "El arroz con pollo es delicioso. — Chicken with rice is delicious."],
  ["el pollo", "chicken", "Comida", "A1", null, "Cenamos pollo asado. — We had roast chicken for dinner."],
  ["la carne", "meat", "Comida", "A1", null, "No como carne los viernes. — I don't eat meat on Fridays."],
  ["el pescado", "fish", "Comida", "A1", null, "El pescado fresco cuesta más. — Fresh fish costs more."],
  ["la fruta", "fruit", "Comida", "A1", null, "Como fruta después del almuerzo. — I eat fruit after lunch."],
  ["la manzana", "apple", "Comida", "A1", null, "Una manzana al día es saludable. — An apple a day is healthy."],
  ["el plátano", "banana", "Comida", "A1", null, "El plátano está muy maduro. — The banana is very ripe."],
  ["el queso", "cheese", "Comida", "A1", null, "Me gusta el queso con pan. — I like cheese with bread."],
  ["la verdura", "vegetable", "Comida", "A1", null, "Necesitamos comprar más verdura. — We need to buy more vegetables."],
  ["la sopa", "soup", "Comida", "A1", null, "La sopa está muy caliente. — The soup is very hot."],
  ["el desayuno", "breakfast", "Comida", "A1", null, "Mi desayuno favorito son los huevos. — My favorite breakfast is eggs."],
  ["el almuerzo", "lunch", "Comida", "A1", null, "El almuerzo es a la una. — Lunch is at one o'clock."],
  ["la cena", "dinner", "Comida", "A1", null, "La cena está lista. — Dinner is ready."],
  // Verbos
  ["ser", "to be (permanent)", "Verbos", "A1"],
  ["estar", "to be (temporary/location)", "Verbos", "A1"],
  ["tener", "to have", "Verbos", "A1"],
  ["hacer", "to do / make", "Verbos", "A1"],
  ["ir", "to go", "Verbos", "A1"],
  ["poder", "to be able to / can", "Verbos", "A1"],
  ["decir", "to say", "Verbos", "A1"],
  ["querer", "to want", "Verbos", "A1"],
  ["ver", "to see", "Verbos", "A1"],
  ["dar", "to give", "Verbos", "A1"],
  ["saber", "to know (a fact)", "Verbos", "A1"],
  ["comer", "to eat", "Verbos", "A1"],
  ["beber", "to drink", "Verbos", "A1"],
  ["hablar", "to speak", "Verbos", "A1"],
  ["vivir", "to live", "Verbos", "A1"],
  ["trabajar", "to work", "Verbos", "A1"],
  ["estudiar", "to study", "Verbos", "A1"],
  ["dormir", "to sleep", "Verbos", "A1"],
  ["escribir", "to write", "Verbos", "A1"],
  ["leer", "to read", "Verbos", "A1"],
  ["comprar", "to buy", "Verbos", "A1"],
  ["necesitar", "to need", "Verbos", "A1"],
  ["gustar", "to like / please", "Verbos", "A1"],
  ["llegar", "to arrive", "Verbos", "A1"],
  ["salir", "to leave / go out", "Verbos", "A1"],
  ["venir", "to come", "Verbos", "A1"],
  ["pensar", "to think", "Verbos", "A1"],
  ["encontrar", "to find", "Verbos", "A1"],
  // Adjetivos
  ["bueno (adjetivo)", "good", "Adjetivos", "A1", null, "Es un buen amigo. — He's a good friend."],
  ["malo", "bad", "Adjetivos", "A1", null, "La película fue mala. — The movie was bad."],
  ["grande", "big", "Adjetivos", "A1", null, "Viven en una casa grande. — They live in a big house."],
  ["pequeño", "small", "Adjetivos", "A1", null, "Tienen un perro pequeño. — They have a small dog."],
  ["feliz", "happy", "Adjetivos", "A1", null, "Estoy muy feliz hoy. — I'm very happy today."],
  ["triste", "sad", "Adjetivos", "A1", null, "Se sintió triste después. — He felt sad afterward."],
  ["cansado", "tired", "Adjetivos", "A1", null, "Estoy cansado después del trabajo. — I'm tired after work."],
  ["ocupado", "busy", "Adjetivos", "A1", null, "Mi jefe está muy ocupado. — My boss is very busy."],
  ["fácil", "easy", "Adjetivos", "A1", null, "Este examen fue fácil. — This exam was easy."],
  ["difícil", "difficult", "Adjetivos", "A1", null, "El español puede ser difícil. — Spanish can be difficult."],
  ["caliente", "hot", "Adjetivos", "A1", null, "El café está muy caliente. — The coffee is very hot."],
  ["frío", "cold", "Adjetivos", "A1", null, "Hace mucho frío hoy. — It's very cold today."],
  ["nuevo", "new", "Adjetivos", "A1", null, "Compré un coche nuevo. — I bought a new car."],
  ["viejo", "old", "Adjetivos", "A1", null, "Ese edificio es muy viejo. — That building is very old."],
  ["rápido", "fast", "Adjetivos", "A1", null, "El tren es muy rápido. — The train is very fast."],
  ["lento", "slow", "Adjetivos", "A1", null, "El servicio fue muy lento. — The service was very slow."],
  ["bonito", "pretty", "Adjetivos", "A1", null, "Tienes un jardín muy bonito. — You have a very pretty garden."],
  ["alto", "tall", "Adjetivos", "A1", null, "Mi hermano es muy alto. — My brother is very tall."],
  ["bajo", "short", "Adjetivos", "A1", null, "El techo es muy bajo. — The ceiling is very low."],
  // Tiempo
  ["hoy", "today", "Tiempo", "A1"],
  ["mañana", "tomorrow / morning", "Tiempo", "A1"],
  ["ayer", "yesterday", "Tiempo", "A1"],
  ["ahora", "now", "Tiempo", "A1"],
  ["después", "after / later", "Tiempo", "A1"],
  ["la semana", "week", "Tiempo", "A1"],
  ["el mes", "month", "Tiempo", "A1"],
  ["el año", "year", "Tiempo", "A1"],
  ["el lunes", "Monday", "Tiempo", "A1"],
  ["el martes", "Tuesday", "Tiempo", "A1"],
  ["el miércoles", "Wednesday", "Tiempo", "A1"],
  ["el jueves", "Thursday", "Tiempo", "A1"],
  ["el viernes", "Friday", "Tiempo", "A1"],
  ["el sábado", "Saturday", "Tiempo", "A1"],
  ["el domingo", "Sunday", "Tiempo", "A1"],
  // Frases útiles
  ["¿Qué hora es?", "What time is it?", "Frases", "A1"],
  ["No entiendo", "I don't understand", "Frases", "A1"],
  ["¿Puedes repetir?", "Can you repeat that?", "Frases", "A1"],
  ["¿Cuánto cuesta?", "How much does it cost?", "Frases", "A1"],
  ["¿Dónde está el baño?", "Where is the bathroom?", "Frases", "A1"],
  ["Tengo hambre", "I'm hungry", "Frases", "A1"],
  ["Tengo sed", "I'm thirsty", "Frases", "A1"],
  ["Estoy perdido", "I'm lost", "Frases", "A1"],
  ["Ayúdame por favor", "Help me please", "Frases", "A1"],
  ["No hablo mucho español", "I don't speak much Spanish", "Frases", "A1"],
  // Casa
  ["la casa", "house", "Casa", "A1", null, "Vivo en una casa pequeña. — I live in a small house."],
  ["la cocina", "kitchen", "Casa", "A1", null, "Mi madre está en la cocina. — My mother is in the kitchen."],
  ["el baño", "bathroom", "Casa", "A1", null, "El baño está al final del pasillo. — The bathroom is at the end of the hallway."],
  ["el dormitorio", "bedroom", "Casa", "A1", null, "Mi dormitorio tiene dos ventanas. — My bedroom has two windows."],
  ["la sala", "living room", "Casa", "A1", null, "Vemos la televisión en la sala. — We watch TV in the living room."],
  ["la mesa", "table", "Casa", "A1", null, "Pon los platos en la mesa. — Put the plates on the table."],
  ["la silla", "chair", "Casa", "A1", null, "Esta silla es muy cómoda. — This chair is very comfortable."],
  ["la puerta", "door", "Casa", "A1", null, "Cierra la puerta, por favor. — Close the door, please."],
  ["la ventana", "window", "Casa", "A1", null, "Abre la ventana, hace calor. — Open the window, it's hot."],
  ["la cama", "bed", "Casa", "A1", null, "Hago la cama todas las mañanas. — I make the bed every morning."],
  // Cuerpo
  ["la cabeza", "head", "Cuerpo", "A1", null, "Me duele la cabeza. — My head hurts."],
  ["la mano", "hand", "Cuerpo", "A1", null, "Dame la mano. — Give me your hand."],
  ["el pie", "foot", "Cuerpo", "A1", null, "Me duele el pie derecho. — My right foot hurts."],
  ["el ojo", "eye", "Cuerpo", "A1", null, "Tiene los ojos verdes. — He has green eyes."],
  ["la boca", "mouth", "Cuerpo", "A1", null, "Abre la boca, por favor. — Open your mouth, please."],
  ["la nariz", "nose", "Cuerpo", "A1", null, "Le sangra la nariz. — His nose is bleeding."],
  ["la oreja", "ear", "Cuerpo", "A1", null, "Se puso aretes en la oreja. — She put earrings in her ear."],
  ["el brazo", "arm", "Cuerpo", "A1", null, "Se rompió el brazo esquiando. — He broke his arm skiing."],
  ["la pierna", "leg", "Cuerpo", "A1", null, "Tengo la pierna cansada. — My leg is tired."],
  ["el corazón", "heart", "Cuerpo", "A1", null, "Su corazón late muy rápido. — Her heart is beating very fast."],

  // ---- A2 : Elemental ----
  ["el dinero", "money", "Compras", "A2"],
  ["la tarjeta", "card", "Compras", "A2"],
  ["el efectivo", "cash", "Compras", "A2"],
  ["el precio", "price", "Compras", "A2"],
  ["barato", "cheap", "Compras", "A2"],
  ["caro", "expensive", "Compras", "A2"],
  ["la tienda", "store", "Compras", "A2"],
  ["el mercado", "market", "Compras", "A2"],
  ["la oferta", "deal / sale", "Compras", "A2"],
  ["probarse", "to try on", "Compras", "A2"],
  ["la calle", "street", "Direcciones", "A2"],
  ["la esquina", "corner", "Direcciones", "A2"],
  ["cerca", "near", "Direcciones", "A2"],
  ["lejos", "far", "Direcciones", "A2"],
  ["izquierda", "left", "Direcciones", "A2"],
  ["derecha", "right", "Direcciones", "A2"],
  ["todo derecho", "straight ahead", "Direcciones", "A2"],
  ["la ciudad", "city", "Direcciones", "A2"],
  ["el pueblo", "town", "Direcciones", "A2"],
  ["el mapa", "map", "Direcciones", "A2"],
  ["el tiempo", "weather", "Clima", "A2"],
  ["el sol", "sun", "Clima", "A2"],
  ["la lluvia", "rain", "Clima", "A2"],
  ["la nieve", "snow", "Clima", "A2"],
  ["el viento", "wind", "Clima", "A2"],
  ["nublado", "cloudy", "Clima", "A2"],
  ["Hace frío", "It's cold", "Clima", "A2"],
  ["el carro", "car", "Transporte", "A2", "latam"],
  ["el coche", "car", "Transporte", "A2", "spain"],
  ["el autobús", "bus", "Transporte", "A2"],
  ["el tren", "train", "Transporte", "A2"],
  ["el avión", "plane", "Transporte", "A2"],
  ["el boleto", "ticket", "Transporte", "A2", "latam"],
  ["el billete", "ticket", "Transporte", "A2", "spain"],
  ["el aeropuerto", "airport", "Transporte", "A2"],
  ["la estación", "station", "Transporte", "A2"],
  ["manejar", "to drive", "Transporte", "A2", "latam"],
  ["conducir", "to drive", "Transporte", "A2", "spain"],
  ["viajar", "to travel", "Transporte", "A2"],
  ["levantarse", "to get up", "Rutina", "A2"],
  ["ducharse", "to shower", "Rutina", "A2"],
  ["vestirse", "to get dressed", "Rutina", "A2"],
  ["despertarse", "to wake up", "Rutina", "A2"],
  ["acostarse", "to go to bed", "Rutina", "A2"],
  ["empezar", "to start / begin", "Rutina", "A2"],
  ["terminar", "to finish", "Rutina", "A2"],
  ["llamar", "to call", "Rutina", "A2"],
  ["esperar", "to wait / hope", "Rutina", "A2"],
  ["ayudar", "to help", "Rutina", "A2"],
  ["trabajo", "job / work", "Trabajo", "A2"],
  ["oficina", "office", "Trabajo", "A2"],
  ["jefe", "boss", "Trabajo", "A2"],
  ["reunión", "meeting", "Trabajo", "A2"],
  ["escuela", "school", "Trabajo", "A2"],
  ["maestro", "teacher", "Trabajo", "A2"],
  ["estudiante", "student", "Trabajo", "A2"],
  ["examen", "exam", "Trabajo", "A2"],
  ["horario", "schedule", "Trabajo", "A2"],
  ["la ropa", "clothes", "Ropa", "A2"],
  ["la camisa", "shirt", "Ropa", "A2"],
  ["los pantalones", "pants", "Ropa", "A2"],
  ["los zapatos", "shoes", "Ropa", "A2"],
  ["la chaqueta", "jacket", "Ropa", "A2"],
  ["el vestido", "dress", "Ropa", "A2"],

  // ---- B1 : Intermedio ----
  ["en mi opinión", "in my opinion", "Opiniones", "B1"],
  ["creo que", "I think that", "Opiniones", "B1"],
  ["me parece que", "it seems to me that", "Opiniones", "B1"],
  ["estoy de acuerdo", "I agree", "Opiniones", "B1"],
  ["no estoy de acuerdo", "I disagree", "Opiniones", "B1"],
  ["depende", "it depends", "Opiniones", "B1"],
  ["sin embargo", "however", "Conectores", "B1"],
  ["aunque", "although", "Conectores", "B1"],
  ["por lo tanto", "therefore", "Conectores", "B1"],
  ["además", "furthermore", "Conectores", "B1"],
  ["por otro lado", "on the other hand", "Conectores", "B1"],
  ["es decir", "that is to say", "Conectores", "B1"],
  ["sorprendido", "surprised", "Sentimientos", "B1"],
  ["decepcionado", "disappointed", "Sentimientos", "B1"],
  ["orgulloso", "proud", "Sentimientos", "B1"],
  ["avergonzado", "embarrassed", "Sentimientos", "B1"],
  ["aliviado", "relieved", "Sentimientos", "B1"],
  ["celoso", "jealous", "Sentimientos", "B1"],
  ["el alojamiento", "lodging", "Viajes", "B1"],
  ["la reserva", "reservation", "Viajes", "B1"],
  ["el itinerario", "itinerary", "Viajes", "B1"],
  ["el destino", "destination", "Viajes", "B1"],
  ["la aventura", "adventure", "Viajes", "B1"],
  ["la cultura", "culture", "Viajes", "B1"],
  ["la costumbre", "custom", "Viajes", "B1"],
  ["lograr", "to achieve", "Verbos B1", "B1"],
  ["evitar", "to avoid", "Verbos B1", "B1"],
  ["sugerir", "to suggest", "Verbos B1", "B1"],
  ["mejorar", "to improve", "Verbos B1", "B1"],
  ["cambiar", "to change", "Verbos B1", "B1"],
  ["permitir", "to allow", "Verbos B1", "B1"],
  ["prohibir", "to prohibit", "Verbos B1", "B1"],
  ["el medio ambiente", "environment", "Tecnología", "B1"],
  ["la contaminación", "pollution", "Tecnología", "B1"],
  ["reciclar", "to recycle", "Tecnología", "B1"],
  ["la aplicación", "app", "Tecnología", "B1"],
  ["la contraseña", "password", "Tecnología", "B1"],
  ["descargar", "to download", "Tecnología", "B1"],

  // ---- B2 : Intermedio alto ----
  ["el argumento", "argument", "Debate", "B2"],
  ["punto de vista", "point of view", "Debate", "B2"],
  ["la ventaja", "advantage", "Debate", "B2"],
  ["la desventaja", "disadvantage", "Debate", "B2"],
  ["por un lado", "on one hand", "Debate", "B2"],
  ["en cuanto a", "regarding", "Debate", "B2"],
  ["cabe mencionar", "it's worth mentioning", "Debate", "B2"],
  ["es importante que", "it's important that", "Subjuntivo", "B2"],
  ["dudo que", "I doubt that", "Subjuntivo", "B2"],
  ["ojalá", "hopefully / I wish", "Subjuntivo", "B2"],
  ["es posible que", "it's possible that", "Subjuntivo", "B2"],
  ["no creo que", "I don't think that", "Subjuntivo", "B2"],
  ["imprescindible", "essential", "Adjetivos B2", "B2"],
  ["contundente", "forceful / conclusive", "Adjetivos B2", "B2"],
  ["ambiguo", "ambiguous", "Adjetivos B2", "B2"],
  ["coherente", "coherent", "Adjetivos B2", "B2"],
  ["versátil", "versatile", "Adjetivos B2", "B2"],
  ["sostenible", "sustainable", "Adjetivos B2", "B2"],
  ["la empresa", "company", "Negocios", "B2"],
  ["el presupuesto", "budget", "Negocios", "B2"],
  ["la inversión", "investment", "Negocios", "B2"],
  ["el contrato", "contract", "Negocios", "B2"],
  ["negociar", "to negotiate", "Negocios", "B2"],
  ["cumplir", "to fulfill / comply", "Negocios", "B2"],
  ["fracasar", "to fail", "Negocios", "B2"],
  ["alcanzar", "to reach / achieve", "Negocios", "B2"],

  // ---- C1 : Avanzado ----
  ["no obstante", "nevertheless", "Conectores C1", "C1"],
  ["en consecuencia", "consequently", "Conectores C1", "C1"],
  ["cabe destacar", "it's worth highlighting", "Conectores C1", "C1"],
  ["a fin de", "in order to", "Conectores C1", "C1"],
  ["si bien", "although / while", "Conectores C1", "C1"],
  ["el matiz", "nuance", "Vocabulario C1", "C1"],
  ["el trasfondo", "background / context", "Vocabulario C1", "C1"],
  ["la índole", "nature / kind", "Vocabulario C1", "C1"],
  ["el pormenor", "detail", "Vocabulario C1", "C1"],
  ["el ámbito", "field / scope", "Vocabulario C1", "C1"],
  ["vigente", "in force / current", "Vocabulario C1", "C1"],
  ["constatar", "to confirm / note", "Verbos C1", "C1"],
  ["plantear", "to raise / pose (an issue)", "Verbos C1", "C1"],
  ["abordar", "to address (a topic)", "Verbos C1", "C1"],
  ["desempeñar", "to carry out (a role)", "Verbos C1", "C1"],
  ["fomentar", "to foster", "Verbos C1", "C1"],
  ["prescindir de", "to do without", "Verbos C1", "C1"],

  // ---- C2 : Maestría ----
  ["costar un ojo de la cara", "to cost an arm and a leg", "Modismos", "C2"],
  ["no tener pelos en la lengua", "to speak bluntly", "Modismos", "C2"],
  ["estar en las nubes", "to have one's head in the clouds", "Modismos", "C2"],
  ["tirar la toalla", "to throw in the towel", "Modismos", "C2"],
  ["ponerse las pilas", "to get one's act together", "Modismos", "C2"],
  ["meter la pata", "to make a blunder", "Modismos", "C2"],
  ["no dar pie con bola", "to not get anything right", "Modismos", "C2"],
  ["tomar el pelo", "to pull someone's leg", "Modismos", "C2"],
  ["a grandes rasgos", "broadly speaking", "Modismos", "C2"],
  ["dar en el clavo", "to hit the nail on the head", "Modismos", "C2"],



  // ---- Preguntas (A1) ----
  ["qué", "what", "Preguntas", "A1"],
  ["quién", "who", "Preguntas", "A1"],
  ["cuándo", "when", "Preguntas", "A1"],
  ["dónde", "where", "Preguntas", "A1"],
  ["por qué", "why", "Preguntas", "A1"],
  ["cómo", "how", "Preguntas", "A1"],
  ["cuál", "which", "Preguntas", "A1"],
  ["cuánto", "how much / how many", "Preguntas", "A1"],

  // ---- Preposiciones (A2) ----
  ["en", "in / on", "Preposiciones", "A2"],
  ["con", "with", "Preposiciones", "A2"],
  ["sin", "without", "Preposiciones", "A2"],
  ["para", "for / in order to", "Preposiciones", "A2"],
  ["por", "for / by / through", "Preposiciones", "A2"],
  ["entre", "between", "Preposiciones", "A2"],
  ["sobre", "on / about", "Preposiciones", "A2"],
  ["debajo de", "under", "Preposiciones", "A2"],
  ["encima de", "on top of", "Preposiciones", "A2"],
  ["detrás de", "behind", "Preposiciones", "A2"],
  ["delante de", "in front of", "Preposiciones", "A2"],
  ["al lado de", "next to", "Preposiciones", "A2"],

  // ---- Posesivos y demostrativos (A2) ----
  ["mi", "my", "Posesivos y demostrativos", "A2"],
  ["tu", "your", "Posesivos y demostrativos", "A2"],
  ["su", "his / her / their", "Posesivos y demostrativos", "A2"],
  ["nuestro", "our", "Posesivos y demostrativos", "A2"],
  ["este", "this", "Posesivos y demostrativos", "A2"],
  ["ese", "that", "Posesivos y demostrativos", "A2"],
  ["aquel", "that (over there)", "Posesivos y demostrativos", "A2"],
  ["aquí", "here", "Posesivos y demostrativos", "A2"],
  ["allí", "there", "Posesivos y demostrativos", "A2"],

  // ---- Verbos reflexivos (B1) ----
  ["sentirse", "to feel", "Verbos reflexivos", "B1"],
  ["quejarse", "to complain", "Verbos reflexivos", "B1"],
  ["preocuparse", "to worry", "Verbos reflexivos", "B1"],
  ["enojarse", "to get angry", "Verbos reflexivos", "B1"],
  ["enamorarse", "to fall in love", "Verbos reflexivos", "B1"],
  ["divertirse", "to have fun", "Verbos reflexivos", "B1"],
  ["aburrirse", "to get bored", "Verbos reflexivos", "B1"],
  ["relajarse", "to relax", "Verbos reflexivos", "B1"],
  ["mudarse", "to move (residence)", "Verbos reflexivos", "B1"],
  ["casarse", "to get married", "Verbos reflexivos", "B1"],

  // ---- Salud (B1) ----
  ["enfermo", "sick", "Salud", "B1"],
  ["sano", "healthy", "Salud", "B1"],
  ["el dolor", "pain", "Salud", "B1"],
  ["la fiebre", "fever", "Salud", "B1"],
  ["el resfriado", "cold (illness)", "Salud", "B1"],
  ["la medicina", "medicine", "Salud", "B1"],
  ["la farmacia", "pharmacy", "Salud", "B1"],
  ["la receta", "prescription", "Salud", "B1"],
  ["la cita", "appointment", "Salud", "B1"],
  ["el síntoma", "symptom", "Salud", "B1"],

  // ---- Tecnología (B1, additions) ----
  ["la red social", "social network", "Tecnología", "B1"],
  ["el correo electrónico", "email", "Tecnología", "B1"],
  ["el archivo", "file", "Tecnología", "B1"],
  ["la pantalla", "screen", "Tecnología", "B1"],
  ["el teclado", "keyboard", "Tecnología", "B1"],

  // ---- Hipotéticos (B2) ----
  ["Si tuviera tiempo...", "If I had time...", "Hipotéticos", "B2"],
  ["Si pudiera...", "If I could...", "Hipotéticos", "B2"],
  ["en caso de que", "in case", "Hipotéticos", "B2"],
  ["a menos que", "unless", "Hipotéticos", "B2"],
  ["con tal de que", "provided that", "Hipotéticos", "B2"],
  ["siempre que", "as long as / whenever", "Hipotéticos", "B2"],
  ["a no ser que", "unless", "Hipotéticos", "B2"],

  // ---- Medios de comunicación (B2) ----
  ["noticia", "news item", "Medios de comunicación", "B2"],
  ["periódico", "newspaper", "Medios de comunicación", "B2"],
  ["titular", "headline", "Medios de comunicación", "B2"],
  ["reportaje", "report / feature story", "Medios de comunicación", "B2"],
  ["entrevista", "interview", "Medios de comunicación", "B2"],
  ["encuesta", "survey / poll", "Medios de comunicación", "B2"],
  ["opinión pública", "public opinion", "Medios de comunicación", "B2"],
  ["censura", "censorship", "Medios de comunicación", "B2"],
  ["libertad de prensa", "freedom of the press", "Medios de comunicación", "B2"],

  // ---- Negocios (B2, additions) ----
  ["rentable", "profitable", "Negocios", "B2"],
  ["el rendimiento", "performance / yield", "Negocios", "B2"],
  ["la competencia", "competition", "Negocios", "B2"],
  ["la estrategia", "strategy", "Negocios", "B2"],
  ["el objetivo", "goal / objective", "Negocios", "B2"],
  ["el plazo", "deadline", "Negocios", "B2"],
  ["el riesgo", "risk", "Negocios", "B2"],
  ["el beneficio", "profit / benefit", "Negocios", "B2"],
  ["la pérdida", "loss", "Negocios", "B2"],

  // ---- Conectores C1 (additions) ----
  ["por consiguiente", "consequently", "Conectores C1", "C1"],
  ["en aras de", "for the sake of", "Conectores C1", "C1"],
  ["so pena de", "under penalty of", "Conectores C1", "C1"],
  ["a raíz de", "as a result of", "Conectores C1", "C1"],
  ["en detrimento de", "to the detriment of", "Conectores C1", "C1"],

  // ---- Verbos C1 (additions) ----
  ["matizar", "to qualify / add nuance to", "Verbos C1", "C1"],
  ["argüir", "to argue (a point)", "Verbos C1", "C1"],
  ["discrepar", "to disagree / dissent", "Verbos C1", "C1"],
  ["atenuar", "to mitigate / soften", "Verbos C1", "C1"],
  ["enfatizar", "to emphasize", "Verbos C1", "C1"],
  ["corroborar", "to corroborate", "Verbos C1", "C1"],
  ["refutar", "to refute", "Verbos C1", "C1"],
  ["suscitar", "to give rise to / provoke", "Verbos C1", "C1"],
  ["prevalecer", "to prevail", "Verbos C1", "C1"],
  ["converger", "to converge", "Verbos C1", "C1"],

  // ---- Vocabulario C1 (additions) ----
  ["la trascendencia", "significance / import", "Vocabulario C1", "C1"],
  ["la controversia", "controversy", "Vocabulario C1", "C1"],
  ["la paradoja", "paradox", "Vocabulario C1", "C1"],
  ["la premisa", "premise", "Vocabulario C1", "C1"],
  ["la disyuntiva", "dilemma", "Vocabulario C1", "C1"],
  ["la coyuntura", "juncture / current situation", "Vocabulario C1", "C1"],
  ["la viabilidad", "viability", "Vocabulario C1", "C1"],
  ["la rentabilidad", "profitability", "Vocabulario C1", "C1"],
  ["la idiosincrasia", "idiosyncrasy", "Vocabulario C1", "C1"],
  ["la polémica", "controversy / polemic", "Vocabulario C1", "C1"],

  // ---- Refranes (C2) ----
  ["Más vale tarde que nunca", "Better late than never", "Refranes", "C2"],
  ["No hay mal que por bien no venga", "Every cloud has a silver lining", "Refranes", "C2"],
  ["Quien mucho abarca, poco aprieta", "Don't bite off more than you can chew", "Refranes", "C2"],
  ["A quien madruga, Dios le ayuda", "The early bird catches the worm", "Refranes", "C2"],
  ["En boca cerrada no entran moscas", "Silence is golden", "Refranes", "C2"],
  ["Perro que ladra no muerde", "His bark is worse than his bite", "Refranes", "C2"],
  ["Camarón que se duerme, se lo lleva la corriente", "You snooze, you lose", "Refranes", "C2"],
  ["Al mal tiempo, buena cara", "Keep a stiff upper lip", "Refranes", "C2"],

  // ---- Modismos (C2, additions) ----
  ["estar como pez en el agua", "to be in one's element", "Modismos", "C2"],
  ["tener la sartén por el mango", "to be in control / call the shots", "Modismos", "C2"],
  ["írsele la mano a alguien", "to overdo it / go overboard", "Modismos", "C2"],
  ["ser pan comido", "to be a piece of cake", "Modismos", "C2"],
  ["no ver tres en un burro", "to have terrible eyesight", "Modismos", "C2"],
  ["dar la lata", "to be a nuisance / pester", "Modismos", "C2"],
  ["estar en la luna", "to be daydreaming / out of it", "Modismos", "C2"],
  ["hacer la vista gorda", "to turn a blind eye", "Modismos", "C2"],

  // ---- Meses (A1) ----
  ["enero", "January", "Meses", "A1"],
  ["febrero", "February", "Meses", "A1"],
  ["marzo", "March", "Meses", "A1"],
  ["abril", "April", "Meses", "A1"],
  ["mayo", "May", "Meses", "A1"],
  ["junio", "June", "Meses", "A1"],
  ["julio", "July", "Meses", "A1"],
  ["agosto", "August", "Meses", "A1"],
  ["septiembre", "September", "Meses", "A1"],
  ["octubre", "October", "Meses", "A1"],
  ["noviembre", "November", "Meses", "A1"],
  ["diciembre", "December", "Meses", "A1"],

  // ---- Estaciones (A1) ----
  ["la primavera", "spring", "Estaciones", "A1"],
  ["el verano", "summer", "Estaciones", "A1"],
  ["el otoño", "fall / autumn", "Estaciones", "A1"],
  ["el invierno", "winter", "Estaciones", "A1"],

  // ---- Animales (A1) ----
  ["el perro", "dog", "Animales", "A1", null, "Mi perro se llama Max. — My dog's name is Max."],
  ["el gato", "cat", "Animales", "A1", null, "El gato duerme todo el día. — The cat sleeps all day."],
  ["el pájaro", "bird", "Animales", "A1", null, "Un pájaro cantaba en el árbol. — A bird was singing in the tree."],
  ["el caballo", "horse", "Animales", "A1", null, "El caballo corre muy rápido. — The horse runs very fast."],
  ["la vaca", "cow", "Animales", "A1", null, "La vaca da leche fresca. — The cow gives fresh milk."],
  ["el cerdo", "pig", "Animales", "A1", null, "El cerdo come en el granero. — The pig eats in the barn."],
  ["el pez", "fish", "Animales", "A1", null, "Tengo un pez en una pecera. — I have a fish in a fishbowl."],
  ["el león", "lion", "Animales", "A1", null, "El león es el rey de la selva. — The lion is the king of the jungle."],
  ["el oso", "bear", "Animales", "A1", null, "Vimos un oso en el bosque. — We saw a bear in the forest."],
  ["el ratón", "mouse", "Animales", "A1", null, "Un ratón salió de la cocina. — A mouse came out of the kitchen."],

  // ---- Números ordinales (A2) ----
  ["primero", "first", "Números ordinales", "A2"],
  ["segundo", "second", "Números ordinales", "A2"],
  ["tercero", "third", "Números ordinales", "A2"],
  ["cuarto", "fourth", "Números ordinales", "A2"],
  ["quinto", "fifth", "Números ordinales", "A2"],
  ["sexto", "sixth", "Números ordinales", "A2"],
  ["séptimo", "seventh", "Números ordinales", "A2"],
  ["octavo", "eighth", "Números ordinales", "A2"],
  ["noveno", "ninth", "Números ordinales", "A2"],
  ["décimo", "tenth", "Números ordinales", "A2"],

  // ---- Naturaleza (A2) ----
  ["el árbol", "tree", "Naturaleza", "A2"],
  ["la flor", "flower", "Naturaleza", "A2"],
  ["la montaña", "mountain", "Naturaleza", "A2"],
  ["el río", "river", "Naturaleza", "A2"],
  ["el mar", "sea", "Naturaleza", "A2"],
  ["la playa", "beach", "Naturaleza", "A2"],
  ["el bosque", "forest", "Naturaleza", "A2"],
  ["el cielo", "sky", "Naturaleza", "A2"],
  ["la estrella", "star", "Naturaleza", "A2"],
  ["la luna", "moon", "Naturaleza", "A2"],

  // ---- Deportes y pasatiempos (A2) ----
  ["el fútbol", "soccer", "Deportes y pasatiempos", "A2"],
  ["el baloncesto", "basketball", "Deportes y pasatiempos", "A2"],
  ["la natación", "swimming", "Deportes y pasatiempos", "A2"],
  ["correr", "to run", "Deportes y pasatiempos", "A2"],
  ["nadar", "to swim", "Deportes y pasatiempos", "A2"],
  ["jugar", "to play (a game / sport)", "Deportes y pasatiempos", "A2"],
  ["ganar", "to win", "Deportes y pasatiempos", "A2"],
  ["perder", "to lose", "Deportes y pasatiempos", "A2"],
  ["el equipo", "team", "Deportes y pasatiempos", "A2"],
  ["el partido", "match / game", "Deportes y pasatiempos", "A2"],

  // ---- La hora (A2) ----
  ["Es la una", "It's one o'clock", "La hora", "A2"],
  ["Son las dos", "It's two o'clock", "La hora", "A2"],
  ["y media", "half past", "La hora", "A2"],
  ["y cuarto", "quarter past", "La hora", "A2"],
  ["menos cuarto", "quarter to", "La hora", "A2"],
  ["de la mañana", "in the morning (with a time)", "La hora", "A2"],
  ["de la tarde", "in the afternoon (with a time)", "La hora", "A2"],
  ["de la noche", "at night (with a time)", "La hora", "A2"],

  // ---- Verbos (A2, additions) ----
  ["poner", "to put", "Verbos", "A2"],
  ["seguir", "to follow / continue", "Verbos", "A2"],
  ["conocer", "to know (a person / place)", "Verbos", "A2"],
  ["pedir", "to ask for / order", "Verbos", "A2"],
  ["sentir", "to feel / sense", "Verbos", "A2"],
  ["traer", "to bring", "Verbos", "A2"],
  ["llevar", "to carry / wear", "Verbos", "A2"],
  ["dejar", "to leave / let", "Verbos", "A2"],

  // ---- Sentimientos (B1, additions) ----
  ["emocionado", "excited", "Sentimientos", "B1"],
  ["nervioso", "nervous", "Sentimientos", "B1"],
  ["confundido", "confused", "Sentimientos", "B1"],
  ["agradecido", "grateful", "Sentimientos", "B1"],
  ["motivado", "motivated", "Sentimientos", "B1"],

  // ---- Pronombres personales (A1) ----
  ["yo", "I", "Pronombres personales", "A1"],
  ["tú", "you (informal)", "Pronombres personales", "A1"],
  ["él", "he", "Pronombres personales", "A1"],
  ["ella", "she", "Pronombres personales", "A1"],
  ["usted", "you (formal)", "Pronombres personales", "A1"],
  ["nosotros", "we", "Pronombres personales", "A1"],
  ["ellos", "they (masc. / mixed)", "Pronombres personales", "A1"],
  ["ellas", "they (fem.)", "Pronombres personales", "A1"],
  ["ustedes", "you all (formal & informal)", "Pronombres personales", "A1"],
  ["vosotros", "you all (informal, Spain)", "Pronombres personales", "A1", "spain"],

  // ---- Pronombres de objeto (A2) ----
  ["me", "me / to me", "Pronombres de objeto", "A2"],
  ["te", "you / to you", "Pronombres de objeto", "A2"],
  ["lo", "him / it (masc.)", "Pronombres de objeto", "A2"],
  ["la", "her / it (fem.)", "Pronombres de objeto", "A2"],
  ["nos", "us / to us", "Pronombres de objeto", "A2"],
  ["los", "them (masc.)", "Pronombres de objeto", "A2"],
  ["las", "them (fem.)", "Pronombres de objeto", "A2"],
  ["le", "to him / her / you (formal)", "Pronombres de objeto", "A2"],
  ["les", "to them / you all", "Pronombres de objeto", "A2"],
  ["se", "himself / herself / themselves", "Pronombres de objeto", "A2"],
  ["os", "you all / to you all (Spain)", "Pronombres de objeto", "A2", "spain"],

  // ---- Marcadores conversacionales (A2/B1) ----
  ["bueno (interjección)", "well / okay", "Marcadores conversacionales", "A2"],
  ["pues", "well / so", "Marcadores conversacionales", "A2"],
  ["o sea", "I mean / that is", "Marcadores conversacionales", "B1"],
  ["a ver", "let's see", "Marcadores conversacionales", "A2"],
  ["dale", "okay / sure / go ahead", "Marcadores conversacionales", "A2", "latam"],
  ["vale", "okay / sure", "Marcadores conversacionales", "A2", "spain"],
  ["claro", "of course", "Marcadores conversacionales", "A2"],
  ["en fin", "anyway / in short", "Marcadores conversacionales", "B1"],
  ["la verdad", "honestly / the truth is", "Marcadores conversacionales", "B1"],
  ["por cierto", "by the way", "Marcadores conversacionales", "B1"],
  ["oye", "hey (to get attention)", "Marcadores conversacionales", "A2"],
  ["mira", "look (to get attention / emphasize)", "Marcadores conversacionales", "A2"],

  // ---- Adverbios comunes (A2) ----
  ["también", "also", "Adverbios comunes", "A2"],
  ["tampoco", "neither / not either", "Adverbios comunes", "A2"],
  ["siempre", "always", "Adverbios comunes", "A2"],
  ["nunca", "never", "Adverbios comunes", "A2"],
  ["a veces", "sometimes", "Adverbios comunes", "A2"],
  ["todavía", "still / yet", "Adverbios comunes", "A2"],
  ["ya", "already / now", "Adverbios comunes", "A2"],
  ["casi", "almost", "Adverbios comunes", "A2"],
  ["solo", "only", "Adverbios comunes", "A2"],





  // ---- Haciendo planes (A2) ----
  ["¿Quieres...?", "Do you want to...?", "Haciendo planes", "A2"],
  ["¿Te gustaría...?", "Would you like to...?", "Haciendo planes", "A2"],
  ["¿Qué tal si...?", "What if... / How about...?", "Haciendo planes", "A2"],
  ["Nos vemos", "See you (later)", "Haciendo planes", "A2"],
  ["Quedamos en...", "Let's agree to meet at...", "Haciendo planes", "A2"],
  ["¿A qué hora quedamos?", "What time shall we meet?", "Haciendo planes", "A2"],
  ["Tengo planes", "I have plans", "Haciendo planes", "A2"],
  ["Estoy libre", "I'm free", "Haciendo planes", "A2"],
  ["Cuenta conmigo", "Count me in", "Haciendo planes", "A2"],
  ["Lo siento, no puedo", "Sorry, I can't", "Haciendo planes", "A2"],

  // ---- Acuerdo y desacuerdo (B1) ----
  ["Tienes razón", "You're right", "Acuerdo y desacuerdo", "B1"],
  ["Puede ser", "Could be / maybe", "Acuerdo y desacuerdo", "B1"],
  ["Ni idea", "No idea", "Acuerdo y desacuerdo", "B1"],
  ["Para nada", "Not at all", "Acuerdo y desacuerdo", "B1"],
  ["Exactamente", "Exactly", "Acuerdo y desacuerdo", "B1"],
  ["Buen punto", "Good point", "Acuerdo y desacuerdo", "B1"],
  ["Lo dudo", "I doubt it", "Acuerdo y desacuerdo", "B1"],
  ["Eso no es cierto", "That's not true", "Acuerdo y desacuerdo", "B1"],

  // ---- Preferencias (A2) ----
  ["Me encanta", "I love it", "Preferencias", "A2"],
  ["Me gusta mucho", "I like it a lot", "Preferencias", "A2"],
  ["No me gusta nada", "I don't like it at all", "Preferencias", "A2"],
  ["Me da igual", "I don't mind / it's all the same to me", "Preferencias", "A2"],
  ["Prefiero...", "I prefer...", "Preferencias", "A2"],
  ["Me molesta", "It bothers me", "Preferencias", "A2"],
  ["Me interesa", "I'm interested in it", "Preferencias", "A2"],
  ["Odio...", "I hate...", "Preferencias", "A2"],

  // ---- Pidiendo aclaración (A2) ----
  ["¿Qué significa...?", "What does...mean?", "Pidiendo aclaración", "A2"],
  ["¿Puedes explicar...?", "Can you explain...?", "Pidiendo aclaración", "A2"],
  ["¿Puedes hablar más despacio?", "Can you speak more slowly?", "Pidiendo aclaración", "A2"],
  ["No entendí bien", "I didn't quite understand", "Pidiendo aclaración", "A2"],
  ["¿Cómo se dice...?", "How do you say...?", "Pidiendo aclaración", "A2"],
  ["¿Puedes escribirlo?", "Can you write it down?", "Pidiendo aclaración", "A2"],
  ["Otra vez, por favor", "Again, please", "Pidiendo aclaración", "A2"],
  ["¿Qué quieres decir?", "What do you mean?", "Pidiendo aclaración", "A2"],

  // ---- Disculpas y sentimientos (A2) ----
  ["Lo siento mucho", "I'm very sorry", "Disculpas y sentimientos", "A2"],
  ["Perdona", "Forgive me / excuse me", "Disculpas y sentimientos", "A2"],
  ["Fue mi culpa", "It was my fault", "Disculpas y sentimientos", "A2"],
  ["No fue mi intención", "I didn't mean to", "Disculpas y sentimientos", "A2"],
  ["Qué pena", "What a shame", "Disculpas y sentimientos", "A2"],
  ["Qué lástima", "What a pity", "Disculpas y sentimientos", "A2"],
  ["No hay problema", "No problem", "Disculpas y sentimientos", "A2"],
  ["No pasa nada", "It's nothing / don't worry about it", "Disculpas y sentimientos", "A2"],

  // ---- Certeza e incertidumbre (B1) ----
  ["Estoy seguro", "I'm sure", "Certeza e incertidumbre", "B1"],
  ["No estoy seguro", "I'm not sure", "Certeza e incertidumbre", "B1"],
  ["Tal vez", "Maybe / perhaps", "Certeza e incertidumbre", "B1"],
  ["Probablemente", "Probably", "Certeza e incertidumbre", "B1"],
  ["Sin duda", "Without a doubt", "Certeza e incertidumbre", "B1"],
  ["Puede que...", "It might be that...", "Certeza e incertidumbre", "B1"],
  ["Quizás", "Maybe / perhaps", "Certeza e incertidumbre", "B1"],
  ["Seguramente", "Surely / most likely", "Certeza e incertidumbre", "B1"],

  // ---- Charla social (A2) ----
  ["¿Qué tal?", "How's it going?", "Charla social", "A2"],
  ["¿Qué hay de nuevo?", "What's new?", "Charla social", "A2"],
  ["Cuánto tiempo sin verte", "Long time no see", "Charla social", "A2"],
  ["¡Qué alegría verte!", "How great to see you!", "Charla social", "A2"],
  ["Nos mantenemos en contacto", "Let's keep in touch", "Charla social", "A2"],
  ["Saludos a tu familia", "Say hi to your family", "Charla social", "A2"],
  ["Que tengas un buen día", "Have a good day", "Charla social", "A2"],
  ["Igualmente", "Likewise / same to you", "Charla social", "A2"],

  // ---- Descripción física (A2) ----
  ["delgado", "thin / slim", "Descripción física", "A2"],
  ["gordo", "heavy-set / overweight", "Descripción física", "A2"],
  ["guapo", "handsome / attractive", "Descripción física", "A2"],
  ["feo", "ugly", "Descripción física", "A2"],
  ["fuerte", "strong", "Descripción física", "A2"],
  ["débil", "weak", "Descripción física", "A2"],
  ["calvo", "bald", "Descripción física", "A2"],
  ["rubio", "blonde", "Descripción física", "A2"],
  ["moreno", "dark-haired / dark-skinned", "Descripción física", "A2"],
  ["pelirrojo", "red-haired", "Descripción física", "A2"],
  ["barba", "beard", "Descripción física", "A2"],
  ["bigote", "mustache", "Descripción física", "A2"],

  // ---- Personalidad (B1) ----
  ["simpático", "nice / friendly", "Personalidad", "B1"],
  ["antipático", "unfriendly", "Personalidad", "B1"],
  ["amable", "kind", "Personalidad", "B1"],
  ["generoso", "generous", "Personalidad", "B1"],
  ["tacaño", "stingy", "Personalidad", "B1"],
  ["honesto", "honest", "Personalidad", "B1"],
  ["mentiroso", "lying / a liar", "Personalidad", "B1"],
  ["valiente", "brave", "Personalidad", "B1"],
  ["cobarde", "cowardly", "Personalidad", "B1"],
  ["tímido", "shy", "Personalidad", "B1"],
  ["extrovertido", "outgoing", "Personalidad", "B1"],
  ["perezoso", "lazy", "Personalidad", "B1"],
  ["trabajador", "hardworking", "Personalidad", "B1"],
  ["inteligente", "intelligent", "Personalidad", "B1"],
  ["tonto", "silly / foolish", "Personalidad", "B1"],
  ["gracioso", "funny", "Personalidad", "B1"],
  ["serio", "serious", "Personalidad", "B1"],
  ["paciente", "patient", "Personalidad", "B1"],
  ["impaciente", "impatient", "Personalidad", "B1"],
  ["curioso", "curious", "Personalidad", "B1"],

  // ---- Comparativos y superlativos (B1) ----
  ["más...que", "more...than", "Comparativos y superlativos", "B1"],
  ["menos...que", "less...than", "Comparativos y superlativos", "B1"],
  ["tan...como", "as...as", "Comparativos y superlativos", "B1"],
  ["el más / la más", "the most", "Comparativos y superlativos", "B1"],
  ["el menos / la menos", "the least", "Comparativos y superlativos", "B1"],
  ["mejor", "better / best", "Comparativos y superlativos", "B1"],
  ["peor", "worse / worst", "Comparativos y superlativos", "B1"],
  ["mayor", "older / greater", "Comparativos y superlativos", "B1"],
  ["menor", "younger / lesser", "Comparativos y superlativos", "B1"],
  ["tanto como", "as much as", "Comparativos y superlativos", "B1"],

  // ---- Lugares en la ciudad (A2) ----
  ["el banco", "bank", "Lugares en la ciudad", "A2"],
  ["el hospital", "hospital", "Lugares en la ciudad", "A2"],
  ["el correo", "post office", "Lugares en la ciudad", "A2"],
  ["el supermercado", "supermarket", "Lugares en la ciudad", "A2"],
  ["la iglesia", "church", "Lugares en la ciudad", "A2"],
  ["el parque", "park", "Lugares en la ciudad", "A2"],
  ["la biblioteca", "library", "Lugares en la ciudad", "A2"],
  ["el gimnasio", "gym", "Lugares en la ciudad", "A2"],
  ["el museo", "museum", "Lugares en la ciudad", "A2"],
  ["el teatro", "theater", "Lugares en la ciudad", "A2"],
  ["el hotel", "hotel", "Lugares en la ciudad", "A2"],
  ["el restaurante", "restaurant", "Lugares en la ciudad", "A2"],
  ["la plaza", "town square", "Lugares en la ciudad", "A2"],
  ["el ayuntamiento", "city hall", "Lugares en la ciudad", "A2"],
  ["el cine", "movie theater", "Lugares en la ciudad", "A2"],

  // ---- Profesiones (A2) ----
  ["el/la médico", "doctor", "Profesiones", "A2"],
  ["el/la enfermero", "nurse", "Profesiones", "A2"],
  ["el/la profesor", "teacher / professor", "Profesiones", "A2"],
  ["el/la ingeniero", "engineer", "Profesiones", "A2"],
  ["el/la abogado", "lawyer", "Profesiones", "A2"],
  ["el/la cocinero", "cook / chef", "Profesiones", "A2"],
  ["el/la mesero", "waiter", "Profesiones", "A2", "latam"],
  ["el/la camarero", "waiter", "Profesiones", "A2", "spain"],
  ["el/la policía", "police officer", "Profesiones", "A2"],
  ["el/la bombero", "firefighter", "Profesiones", "A2"],
  ["el/la piloto", "pilot", "Profesiones", "A2"],
  ["el/la periodista", "journalist", "Profesiones", "A2"],
  ["el/la artista", "artist", "Profesiones", "A2"],
  ["el/la músico", "musician", "Profesiones", "A2"],
  ["el/la contador", "accountant", "Profesiones", "A2"],
  ["el/la electricista", "electrician", "Profesiones", "A2"],
  ["el/la plomero", "plumber", "Profesiones", "A2"],
  ["el/la peluquero", "hairdresser", "Profesiones", "A2"],
  ["el/la granjero", "farmer", "Profesiones", "A2"],
  ["el/la soldado", "soldier", "Profesiones", "A2"],
  ["el/la científico", "scientist", "Profesiones", "A2"],

  // ---- Nacionalidades y países (A2) ----
  ["estadounidense", "American (U.S.)", "Nacionalidades y países", "A2"],
  ["mexicano", "Mexican", "Nacionalidades y países", "A2"],
  ["español", "Spanish", "Nacionalidades y países", "A2"],
  ["argentino", "Argentine", "Nacionalidades y países", "A2"],
  ["colombiano", "Colombian", "Nacionalidades y países", "A2"],
  ["canadiense", "Canadian", "Nacionalidades y países", "A2"],
  ["francés", "French", "Nacionalidades y países", "A2"],
  ["alemán", "German", "Nacionalidades y países", "A2"],
  ["italiano", "Italian", "Nacionalidades y países", "A2"],
  ["británico", "British", "Nacionalidades y países", "A2"],
  ["chino", "Chinese", "Nacionalidades y países", "A2"],
  ["japonés", "Japanese", "Nacionalidades y países", "A2"],
  ["brasileño", "Brazilian", "Nacionalidades y países", "A2"],
  ["peruano", "Peruvian", "Nacionalidades y países", "A2"],
  ["chileno", "Chilean", "Nacionalidades y países", "A2"],

  // ---- Números extendidos (A2) ----
  ["doscientos", "two hundred", "Números extendidos", "A2"],
  ["trescientos", "three hundred", "Números extendidos", "A2"],
  ["cuatrocientos", "four hundred", "Números extendidos", "A2"],
  ["quinientos", "five hundred", "Números extendidos", "A2"],
  ["seiscientos", "six hundred", "Números extendidos", "A2"],
  ["setecientos", "seven hundred", "Números extendidos", "A2"],
  ["ochocientos", "eight hundred", "Números extendidos", "A2"],
  ["novecientos", "nine hundred", "Números extendidos", "A2"],
  ["mil", "one thousand", "Números extendidos", "A2"],
  ["un millón", "one million", "Números extendidos", "A2"],

  // ---- Verbos (A2, additions — needed for imperative batch) ----
  ["escuchar", "to listen", "Verbos", "A2"],
  ["mirar", "to look / watch", "Verbos", "A2"],
  ["caminar", "to walk", "Verbos", "A2"],
  ["parar", "to stop", "Verbos", "A2"],
  ["girar", "to turn", "Verbos", "A2"],
  ["cruzar", "to cross", "Verbos", "A2"],
  ["abrir", "to open", "Verbos", "A2"],
  ["cerrar", "to close", "Verbos", "A2"],
  ["tocar", "to touch / to play (an instrument)", "Verbos", "A2"],
  ["olvidar", "to forget", "Verbos", "A2"],

  // ---- Mandatos informales, tú — irregular (A2) ----
  ["venir (mandato tú)", "ven", "Mandatos informales (tú)", "A2"],
  ["ir (mandato tú)", "ve", "Mandatos informales (tú)", "A2"],
  ["salir (mandato tú)", "sal", "Mandatos informales (tú)", "A2"],
  ["poner (mandato tú)", "pon", "Mandatos informales (tú)", "A2"],
  ["tener (mandato tú)", "ten", "Mandatos informales (tú)", "A2"],
  ["hacer (mandato tú)", "haz", "Mandatos informales (tú)", "A2"],
  ["ser (mandato tú)", "sé", "Mandatos informales (tú)", "A2"],
  ["decir (mandato tú)", "di", "Mandatos informales (tú)", "A2"],

  // ---- Mandatos informales, tú — regulares (A2) ----
  ["hablar (mandato tú)", "habla", "Mandatos informales (tú)", "A2"],
  ["escuchar (mandato tú)", "escucha", "Mandatos informales (tú)", "A2"],
  ["mirar (mandato tú)", "mira", "Mandatos informales (tú)", "A2"],
  ["esperar (mandato tú)", "espera", "Mandatos informales (tú)", "A2"],
  ["caminar (mandato tú)", "camina", "Mandatos informales (tú)", "A2"],
  ["parar (mandato tú)", "para", "Mandatos informales (tú)", "A2"],
  ["girar (mandato tú)", "gira", "Mandatos informales (tú)", "A2"],
  ["cruzar (mandato tú)", "cruza", "Mandatos informales (tú)", "A2"],
  ["abrir (mandato tú)", "abre", "Mandatos informales (tú)", "A2"],
  ["cerrar (mandato tú)", "cierra", "Mandatos informales (tú)", "A2"],
  ["comer (mandato tú)", "come", "Mandatos informales (tú)", "A2"],
  ["beber (mandato tú)", "bebe", "Mandatos informales (tú)", "A2"],
  ["escribir (mandato tú)", "escribe", "Mandatos informales (tú)", "A2"],
  ["leer (mandato tú)", "lee", "Mandatos informales (tú)", "A2"],
  ["seguir (mandato tú)", "sigue", "Mandatos informales (tú)", "A2"],

  // ---- Mandatos negativos, tú (B1) ----
  ["hablar (mandato negativo tú)", "no hables", "Mandatos negativos (tú)", "B1"],
  ["ir (mandato negativo tú)", "no vayas", "Mandatos negativos (tú)", "B1"],
  ["comer (mandato negativo tú)", "no comas", "Mandatos negativos (tú)", "B1"],
  ["tocar (mandato negativo tú)", "no toques", "Mandatos negativos (tú)", "B1"],
  ["preocuparse (mandato negativo tú)", "no te preocupes", "Mandatos negativos (tú)", "B1"],
  ["llegar tarde (mandato negativo tú)", "no llegues tarde", "Mandatos negativos (tú)", "B1"],
  ["olvidar (mandato negativo tú)", "no olvides", "Mandatos negativos (tú)", "B1"],

  // ---- Mandatos formales y direcciones (A2) ----
  ["Perdone", "Excuse me (formal)", "Mandatos formales y direcciones", "A2"],
  ["Disculpe", "Excuse me / pardon me (formal)", "Mandatos formales y direcciones", "A2"],
  ["Espere, por favor", "Please wait", "Mandatos formales y direcciones", "A2"],
  ["Siga recto", "Continue straight", "Mandatos formales y direcciones", "A2"],
  ["Gire a la derecha", "Turn right", "Mandatos formales y direcciones", "A2"],
  ["Gire a la izquierda", "Turn left", "Mandatos formales y direcciones", "A2"],
  ["Tenga cuidado", "Be careful", "Mandatos formales y direcciones", "A2"],
  ["Pase", "Come in / go ahead", "Mandatos formales y direcciones", "A2"],

  // ---- Mandatos con nosotros (A2) ----
  ["Vamos", "Let's go", "Mandatos con nosotros", "A2"],
  ["Empecemos", "Let's start", "Mandatos con nosotros", "A2"],
  ["Comamos", "Let's eat", "Mandatos con nosotros", "A2"],
  ["Hagámoslo", "Let's do it", "Mandatos con nosotros", "A2"],
  ["Vámonos", "Let's get going / let's leave", "Mandatos con nosotros", "A2"],







  // ---- Gerundios (Verbos, A2) ----
  ["hablar — gerundio", "hablando", "Gerundios", "A2"],
  ["ser — gerundio", "siendo", "Gerundios", "A2"],
  ["estar — gerundio", "estando", "Gerundios", "A2"],
  ["tener — gerundio", "teniendo", "Gerundios", "A2"],
  ["ir — gerundio", "yendo", "Gerundios", "A2"],
  ["hacer — gerundio", "haciendo", "Gerundios", "A2"],
  ["poder — gerundio", "pudiendo", "Gerundios", "A2"],
  ["querer — gerundio", "queriendo", "Gerundios", "A2"],
  ["decir — gerundio", "diciendo", "Gerundios", "A2"],
  ["saber — gerundio", "sabiendo", "Gerundios", "A2"],
  ["dar — gerundio", "dando", "Gerundios", "A2"],
  ["ver — gerundio", "viendo", "Gerundios", "A2"],
  ["poner — gerundio", "poniendo", "Gerundios", "A2"],
  ["salir — gerundio", "saliendo", "Gerundios", "A2"],
  ["venir — gerundio", "viniendo", "Gerundios", "A2"],

  // ---- Presente progresivo — example usage (Frases, A2) ----
  ["Estoy hablando", "I am speaking", "Presente progresivo", "A2"],
  ["Estás comiendo", "You are eating", "Presente progresivo", "A2"],
  ["Está lloviendo", "It's raining", "Presente progresivo", "A2"],
  ["Estamos trabajando", "We are working", "Presente progresivo", "A2"],
  ["Estáis estudiando", "You all are studying", "Presente progresivo", "A2"],
  ["Están durmiendo", "They are sleeping", "Presente progresivo", "A2"],

  // ---- Participios (Verbos, A2) ----
  ["hablar — participio", "hablado", "Participios", "A2"],
  ["ser — participio", "sido", "Participios", "A2"],
  ["estar — participio", "estado", "Participios", "A2"],
  ["tener — participio", "tenido", "Participios", "A2"],
  ["ir — participio", "ido", "Participios", "A2"],
  ["hacer — participio", "hecho", "Participios", "A2"],
  ["poder — participio", "podido", "Participios", "A2"],
  ["querer — participio", "querido", "Participios", "A2"],
  ["decir — participio", "dicho", "Participios", "A2"],
  ["saber — participio", "sabido", "Participios", "A2"],
  ["dar — participio", "dado", "Participios", "A2"],
  ["ver — participio", "visto", "Participios", "A2"],
  ["poner — participio", "puesto", "Participios", "A2"],
  ["salir — participio", "salido", "Participios", "A2"],
  ["venir — participio", "venido", "Participios", "A2"],

  // ---- haber — auxiliary verb (Verbos, A2) ----

  // ---- Presente perfecto y pluscuamperfecto — example usage (Frases, B1) ----
  ["He hablado con mi amigo", "I have spoken with my friend", "Presente perfecto y pluscuamperfecto", "B1"],
  ["Has hecho la tarea", "You have done the homework", "Presente perfecto y pluscuamperfecto", "B1"],
  ["Ha dicho la verdad", "He/she has told the truth", "Presente perfecto y pluscuamperfecto", "B1"],
  ["Hemos visto la película", "We have seen the movie", "Presente perfecto y pluscuamperfecto", "B1"],
  ["Habéis puesto la mesa", "You all have set the table", "Presente perfecto y pluscuamperfecto", "B1"],
  ["Habían salido temprano", "They had left early", "Presente perfecto y pluscuamperfecto", "B1"],
  ["Nunca había estado aquí", "I had never been here", "Presente perfecto y pluscuamperfecto", "B1"],

  // ---- Ser vs. estar — meaning-changing adjective pairs (B1) ----
  ["Es aburrido", "He/it is boring", "Ser vs. estar", "B1"],
  ["Está aburrido", "He is bored", "Ser vs. estar", "B1"],
  ["Es listo", "He is clever / smart", "Ser vs. estar", "B1"],
  ["Está listo", "He is ready", "Ser vs. estar", "B1"],
  ["Es malo", "He is bad / evil", "Ser vs. estar", "B1"],
  ["Está malo", "He is sick / it tastes bad", "Ser vs. estar", "B1"],
  ["Es bueno", "He is good (kind)", "Ser vs. estar", "B1"],
  ["Está bueno", "It tastes good / he's good-looking", "Ser vs. estar", "B1"],
  ["Es rico", "He is rich", "Ser vs. estar", "B1"],
  ["Está rico", "It's delicious", "Ser vs. estar", "B1"],
  ["Es verde", "It's green / he's inexperienced", "Ser vs. estar", "B1"],
  ["Está verde", "It's unripe", "Ser vs. estar", "B1"],
  ["Es vivo", "He's sharp / clever", "Ser vs. estar", "B1"],
  ["Está vivo", "He's alive", "Ser vs. estar", "B1"],
  ["Es callado", "He's a quiet person (by nature)", "Ser vs. estar", "B1"],
  ["Está callado", "He's being quiet right now", "Ser vs. estar", "B1"],
  ["Es despierto", "He's quick-witted", "Ser vs. estar", "B1"],
  ["Está despierto", "He's awake", "Ser vs. estar", "B1"],
  ["Es seguro", "It's safe / reliable", "Ser vs. estar", "B1"],
  ["Está seguro", "He's sure / certain", "Ser vs. estar", "B1"],

  // ---- Ser vs. estar — general usage patterns (B1) ----
  ["Soy médico", "I am a doctor", "Ser vs. estar", "B1"],
  ["Es de España", "He/she is from Spain", "Ser vs. estar", "B1"],
  ["Son las cinco", "It's five o'clock", "Ser vs. estar", "B1"],
  ["Es inteligente", "He/she is intelligent", "Ser vs. estar", "B1"],
  ["Estoy en el trabajo", "I'm at work", "Ser vs. estar", "B1"],
  ["Está enojada", "She's angry", "Ser vs. estar", "B1"],
  ["La ventana está rota", "The window is broken", "Ser vs. estar", "B1"],
  ["Estamos de vacaciones", "We are on vacation", "Ser vs. estar", "B1"],

  // ---- Por vs. para — usage of "por" (B1) ----
  ["Por eso", "That's why / for that reason", "Por vs. para", "B1"],
  ["Por la lluvia", "Because of the rain", "Por vs. para", "B1"],
  ["Por dos horas", "For two hours", "Por vs. para", "B1"],
  ["Por el parque", "Through the park", "Por vs. para", "B1"],
  ["Gracias por tu ayuda", "Thanks for your help", "Por vs. para", "B1"],
  ["Por teléfono", "By phone", "Por vs. para", "B1"],
  ["Por ciento", "Percent", "Por vs. para", "B1"],
  ["Por la mañana", "In the morning (generally)", "Por vs. para", "B1"],
  ["Viajé por Europa", "I traveled through Europe", "Por vs. para", "B1"],
  ["Lo compré por veinte dólares", "I bought it for twenty dollars", "Por vs. para", "B1"],

  // ---- Por vs. para — usage of "para" (B1) ----
  ["Para aprender español", "In order to learn Spanish", "Por vs. para", "B1"],
  ["Es para ti", "It's for you", "Por vs. para", "B1"],
  ["Para el lunes", "By Monday", "Por vs. para", "B1"],
  ["Para mí", "In my opinion / for me", "Por vs. para", "B1"],
  ["Salgo para México", "I'm leaving for Mexico", "Por vs. para", "B1"],
  ["Trabajo para Google", "I work for Google", "Por vs. para", "B1"],
  ["Estudio para ser médico", "I study to become a doctor", "Por vs. para", "B1"],
  ["Para siempre", "Forever", "Por vs. para", "B1"],
  ["Necesito tiempo para pensar", "I need time to think", "Por vs. para", "B1"],
  ["Es demasiado caro para mí", "It's too expensive for me", "Por vs. para", "B1"],

  // ---- Por vs. para — direct contrast pairs (B1) ----
  ["Por mí", "For my sake / because of me", "Por vs. para", "B1"],
  ["Lo hice por ti", "I did it for your sake / because of you", "Por vs. para", "B1"],
  ["Camino por la ciudad", "I walk through the city", "Por vs. para", "B1"],
  ["Trabajo por necesidad", "I work out of necessity", "Por vs. para", "B1"],

  // ---- Restaurante — vocabulario (A2) ----
  ["el menú", "menu", "Restaurante", "A2"],
  ["la cuenta", "the bill / check", "Restaurante", "A2"],
  ["la propina", "the tip", "Restaurante", "A2"],
  ["el plato", "the dish / plate", "Restaurante", "A2"],
  ["la bebida", "the drink", "Restaurante", "A2"],
  ["la entrada", "appetizer", "Restaurante", "A2"],
  ["el plato principal", "main course", "Restaurante", "A2"],
  ["el postre", "dessert", "Restaurante", "A2"],
  ["la reservación", "reservation", "Restaurante", "A2"],

  // ---- Restaurante — frases (A2) ----
  ["¿Está listo/a para ordenar?", "Are you ready to order?", "Restaurante — frases", "A2"],
  ["Quisiera...", "I would like...", "Restaurante — frases", "A2"],
  ["¿Qué me recomienda?", "What do you recommend?", "Restaurante — frases", "A2"],
  ["La cuenta, por favor", "The check, please", "Restaurante — frases", "A2"],
  ["¿Aceptan tarjeta?", "Do you accept card?", "Restaurante — frases", "A2"],
  ["Para llevar", "To go", "Restaurante — frases", "A2"],
  ["Para comer aquí", "For here", "Restaurante — frases", "A2"],
  ["¡Buen provecho!", "Enjoy your meal!", "Restaurante — frases", "A2"],
  ["Estaba delicioso", "It was delicious", "Restaurante — frases", "A2"],

  // ---- Compras — vocabulario, additions (A2) ----
  ["la talla", "size (clothing)", "Compras", "A2"],
  ["el probador", "fitting room", "Compras", "A2"],
  ["la rebaja", "discount", "Compras", "A2"],
  ["el cambio", "change (money returned)", "Compras", "A2"],
  ["el recibo", "receipt", "Compras", "A2"],
  ["la caja", "checkout / register", "Compras", "A2"],

  // ---- Compras — frases (A2) ----
  ["¿Cuánto cuesta esto?", "How much does this cost?", "Compras — frases", "A2"],
  ["¿Tiene esto en otra talla?", "Do you have this in another size?", "Compras — frases", "A2"],
  ["Solo estoy mirando", "I'm just looking", "Compras — frases", "A2"],
  ["Me lo llevo", "I'll take it", "Compras — frases", "A2"],
  ["¿Puedo pagar con tarjeta?", "Can I pay by card?", "Compras — frases", "A2"],
  ["¿Dónde está el probador?", "Where's the fitting room?", "Compras — frases", "A2"],

  // ---- Llamadas telefónicas — vocabulario (A2) ----
  ["la llamada", "the call", "Llamadas telefónicas", "A2"],
  ["el buzón de voz", "voicemail", "Llamadas telefónicas", "A2"],
  ["el número de teléfono", "phone number", "Llamadas telefónicas", "A2"],
  ["el mensaje de texto", "text message", "Llamadas telefónicas", "A2"],
  ["la batería", "battery", "Llamadas telefónicas", "A2"],
  ["la señal", "signal", "Llamadas telefónicas", "A2"],

  // ---- Llamadas telefónicas — frases (A2) ----
  ["¿Aló? / ¿Bueno? / ¿Diga?", "Hello? (answering the phone)", "Llamadas telefónicas — frases", "A2"],
  ["¿Está...?", "Is... there? (asking for someone)", "Llamadas telefónicas — frases", "A2"],
  ["Un momento, por favor", "One moment, please", "Llamadas telefónicas — frases", "A2"],
  ["Se cortó la llamada", "The call dropped", "Llamadas telefónicas — frases", "A2"],
  ["Te llamo luego", "I'll call you later", "Llamadas telefónicas — frases", "A2"],
  ["No hay señal", "There's no signal", "Llamadas telefónicas — frases", "A2"],

  // ---- Salud — vocabulario, additions (B1) ----
  ["la alergia", "allergy", "Salud", "B1"],
  ["la presión arterial", "blood pressure", "Salud", "B1"],
  ["la radiografía", "X-ray", "Salud", "B1"],
  ["la inyección", "injection / shot", "Salud", "B1"],
  ["embarazada", "pregnant", "Salud", "B1"],
  ["el seguro médico", "health insurance", "Salud", "B1"],

  // ---- Salud — frases (B1) ----
  ["¿Qué le duele?", "What hurts? (formal)", "Salud — frases", "B1"],
  ["Me duele aquí", "It hurts here", "Salud — frases", "B1"],
  ["Tengo náuseas", "I feel nauseous", "Salud — frases", "B1"],
  ["¿Es alérgico a algo?", "Are you allergic to anything?", "Salud — frases", "B1"],
  ["Necesito una receta", "I need a prescription", "Salud — frases", "B1"],
  ["Respire profundo", "Breathe deeply", "Salud — frases", "B1"],

  // ---- Banco — vocabulario (B1) ----
  ["la cuenta bancaria", "bank account", "Banco", "B1"],
  ["la cuenta de ahorros", "savings account", "Banco", "B1"],
  ["la tarjeta de crédito", "credit card", "Banco", "B1"],
  ["la tarjeta de débito", "debit card", "Banco", "B1"],
  ["el préstamo", "loan", "Banco", "B1"],
  ["el saldo", "balance", "Banco", "B1"],
  ["el cajero automático", "ATM", "Banco", "B1"],
  ["el depósito", "deposit", "Banco", "B1"],

  // ---- Banco — frases (B1) ----
  ["Quiero abrir una cuenta", "I want to open an account", "Banco — frases", "B1"],
  ["¿Cuál es mi saldo?", "What's my balance?", "Banco — frases", "B1"],
  ["Necesito retirar dinero", "I need to withdraw money", "Banco — frases", "B1"],
  ["¿Dónde está el cajero automático?", "Where's the ATM?", "Banco — frases", "B1"],

  // ---- Problemas con el carro — vocabulario (B1) ----
  ["la llanta ponchada", "flat tire", "Problemas con el carro", "B1"],
  ["la batería descargada", "dead battery", "Problemas con el carro", "B1"],
  ["el motor", "engine", "Problemas con el carro", "B1"],
  ["la gasolina", "gas / fuel", "Problemas con el carro", "B1"],
  ["el taller mecánico", "mechanic's shop", "Problemas con el carro", "B1"],
  ["la grúa", "tow truck", "Problemas con el carro", "B1"],
  ["el seguro de auto", "car insurance", "Problemas con el carro", "B1"],
  ["la licencia de conducir", "driver's license", "Problemas con el carro", "B1"],

  // ---- Problemas con el carro — frases (B1) ----
  ["Mi carro no arranca", "My car won't start", "Problemas con el carro — frases", "B1"],
  ["Tengo una llanta ponchada", "I have a flat tire", "Problemas con el carro — frases", "B1"],
  ["Se me acabó la gasolina", "I ran out of gas", "Problemas con el carro — frases", "B1"],
  ["Necesito una grúa", "I need a tow truck", "Problemas con el carro — frases", "B1"],

  // ---- Conjugación presente (full paradigm, incl. vosotros) ----
  ["hablar — presente", "yo hablo · tú hablas · él/ella/usted habla · nosotros hablamos · vosotros habláis · ellos/ellas/ustedes hablan", "Conjugación presente", "A1"],
  ["ser — presente", "yo soy · tú eres · él/ella/usted es · nosotros somos · vosotros sois · ellos/ellas/ustedes son", "Conjugación presente", "A1"],
  ["estar — presente", "yo estoy · tú estás · él/ella/usted está · nosotros estamos · vosotros estáis · ellos/ellas/ustedes están", "Conjugación presente", "A1"],
  ["tener — presente", "yo tengo · tú tienes · él/ella/usted tiene · nosotros tenemos · vosotros tenéis · ellos/ellas/ustedes tienen", "Conjugación presente", "A1"],
  ["ir — presente", "yo voy · tú vas · él/ella/usted va · nosotros vamos · vosotros vais · ellos/ellas/ustedes van", "Conjugación presente", "A1"],
  ["hacer — presente", "yo hago · tú haces · él/ella/usted hace · nosotros hacemos · vosotros hacéis · ellos/ellas/ustedes hacen", "Conjugación presente", "A1"],
  ["poder — presente", "yo puedo · tú puedes · él/ella/usted puede · nosotros podemos · vosotros podéis · ellos/ellas/ustedes pueden", "Conjugación presente", "A1"],
  ["querer — presente", "yo quiero · tú quieres · él/ella/usted quiere · nosotros queremos · vosotros queréis · ellos/ellas/ustedes quieren", "Conjugación presente", "A1"],
  ["decir — presente", "yo digo · tú dices · él/ella/usted dice · nosotros decimos · vosotros decís · ellos/ellas/ustedes dicen", "Conjugación presente", "A1"],
  ["saber — presente", "yo sé · tú sabes · él/ella/usted sabe · nosotros sabemos · vosotros sabéis · ellos/ellas/ustedes saben", "Conjugación presente", "A1"],
  ["dar — presente", "yo doy · tú das · él/ella/usted da · nosotros damos · vosotros dais · ellos/ellas/ustedes dan", "Conjugación presente", "A1"],
  ["ver — presente", "yo veo · tú ves · él/ella/usted ve · nosotros vemos · vosotros veis · ellos/ellas/ustedes ven", "Conjugación presente", "A1"],
  ["poner — presente", "yo pongo · tú pones · él/ella/usted pone · nosotros ponemos · vosotros ponéis · ellos/ellas/ustedes ponen", "Conjugación presente", "A1"],
  ["salir — presente", "yo salgo · tú sales · él/ella/usted sale · nosotros salimos · vosotros salís · ellos/ellas/ustedes salen", "Conjugación presente", "A1"],
  ["venir — presente", "yo vengo · tú vienes · él/ella/usted viene · nosotros venimos · vosotros venís · ellos/ellas/ustedes vienen", "Conjugación presente", "A1"],
  ["haber — presente", "yo he · tú has · él/ella/usted ha · nosotros hemos · vosotros habéis · ellos/ellas/ustedes han", "Conjugación presente", "A2"],

  // ---- Conjugación pretérito (full paradigm, incl. vosotros) ----
  ["hablar — pretérito", "yo hablé · tú hablaste · él/ella/usted habló · nosotros hablamos · vosotros hablasteis · ellos/ellas/ustedes hablaron", "Conjugación pretérito", "A2"],
  ["ser — pretérito", "yo fui · tú fuiste · él/ella/usted fue · nosotros fuimos · vosotros fuisteis · ellos/ellas/ustedes fueron", "Conjugación pretérito", "A2"],
  ["estar — pretérito", "yo estuve · tú estuviste · él/ella/usted estuvo · nosotros estuvimos · vosotros estuvisteis · ellos/ellas/ustedes estuvieron", "Conjugación pretérito", "A2"],
  ["tener — pretérito", "yo tuve · tú tuviste · él/ella/usted tuvo · nosotros tuvimos · vosotros tuvisteis · ellos/ellas/ustedes tuvieron", "Conjugación pretérito", "A2"],
  ["ir — pretérito", "yo fui · tú fuiste · él/ella/usted fue · nosotros fuimos · vosotros fuisteis · ellos/ellas/ustedes fueron", "Conjugación pretérito", "A2"],
  ["hacer — pretérito", "yo hice · tú hiciste · él/ella/usted hizo · nosotros hicimos · vosotros hicisteis · ellos/ellas/ustedes hicieron", "Conjugación pretérito", "A2"],
  ["poder — pretérito", "yo pude · tú pudiste · él/ella/usted pudo · nosotros pudimos · vosotros pudisteis · ellos/ellas/ustedes pudieron", "Conjugación pretérito", "A2"],
  ["querer — pretérito", "yo quise · tú quisiste · él/ella/usted quiso · nosotros quisimos · vosotros quisisteis · ellos/ellas/ustedes quisieron", "Conjugación pretérito", "A2"],
  ["decir — pretérito", "yo dije · tú dijiste · él/ella/usted dijo · nosotros dijimos · vosotros dijisteis · ellos/ellas/ustedes dijeron", "Conjugación pretérito", "A2"],
  ["saber — pretérito", "yo supe · tú supiste · él/ella/usted supo · nosotros supimos · vosotros supisteis · ellos/ellas/ustedes supieron", "Conjugación pretérito", "A2"],
  ["dar — pretérito", "yo di · tú diste · él/ella/usted dio · nosotros dimos · vosotros disteis · ellos/ellas/ustedes dieron", "Conjugación pretérito", "A2"],
  ["ver — pretérito", "yo vi · tú viste · él/ella/usted vio · nosotros vimos · vosotros visteis · ellos/ellas/ustedes vieron", "Conjugación pretérito", "A2"],
  ["poner — pretérito", "yo puse · tú pusiste · él/ella/usted puso · nosotros pusimos · vosotros pusisteis · ellos/ellas/ustedes pusieron", "Conjugación pretérito", "A2"],
  ["salir — pretérito", "yo salí · tú saliste · él/ella/usted salió · nosotros salimos · vosotros salisteis · ellos/ellas/ustedes salieron", "Conjugación pretérito", "A2"],
  ["venir — pretérito", "yo vine · tú viniste · él/ella/usted vino · nosotros vinimos · vosotros vinisteis · ellos/ellas/ustedes vinieron", "Conjugación pretérito", "A2"],

  // ---- Conjugación imperfecto (full paradigm, incl. vosotros) ----
  ["hablar — imperfecto", "yo hablaba · tú hablabas · él/ella/usted hablaba · nosotros hablábamos · vosotros hablabais · ellos/ellas/ustedes hablaban", "Conjugación imperfecto", "A2"],
  ["ser — imperfecto", "yo era · tú eras · él/ella/usted era · nosotros éramos · vosotros erais · ellos/ellas/ustedes eran", "Conjugación imperfecto", "A2"],
  ["estar — imperfecto", "yo estaba · tú estabas · él/ella/usted estaba · nosotros estábamos · vosotros estabais · ellos/ellas/ustedes estaban", "Conjugación imperfecto", "A2"],
  ["tener — imperfecto", "yo tenía · tú tenías · él/ella/usted tenía · nosotros teníamos · vosotros teníais · ellos/ellas/ustedes tenían", "Conjugación imperfecto", "A2"],
  ["ir — imperfecto", "yo iba · tú ibas · él/ella/usted iba · nosotros íbamos · vosotros ibais · ellos/ellas/ustedes iban", "Conjugación imperfecto", "A2"],
  ["hacer — imperfecto", "yo hacía · tú hacías · él/ella/usted hacía · nosotros hacíamos · vosotros hacíais · ellos/ellas/ustedes hacían", "Conjugación imperfecto", "A2"],
  ["poder — imperfecto", "yo podía · tú podías · él/ella/usted podía · nosotros podíamos · vosotros podíais · ellos/ellas/ustedes podían", "Conjugación imperfecto", "A2"],
  ["querer — imperfecto", "yo quería · tú querías · él/ella/usted quería · nosotros queríamos · vosotros queríais · ellos/ellas/ustedes querían", "Conjugación imperfecto", "A2"],
  ["decir — imperfecto", "yo decía · tú decías · él/ella/usted decía · nosotros decíamos · vosotros decíais · ellos/ellas/ustedes decían", "Conjugación imperfecto", "A2"],
  ["saber — imperfecto", "yo sabía · tú sabías · él/ella/usted sabía · nosotros sabíamos · vosotros sabíais · ellos/ellas/ustedes sabían", "Conjugación imperfecto", "A2"],
  ["dar — imperfecto", "yo daba · tú dabas · él/ella/usted daba · nosotros dábamos · vosotros dabais · ellos/ellas/ustedes daban", "Conjugación imperfecto", "A2"],
  ["ver — imperfecto", "yo veía · tú veías · él/ella/usted veía · nosotros veíamos · vosotros veíais · ellos/ellas/ustedes veían", "Conjugación imperfecto", "A2"],
  ["poner — imperfecto", "yo ponía · tú ponías · él/ella/usted ponía · nosotros poníamos · vosotros poníais · ellos/ellas/ustedes ponían", "Conjugación imperfecto", "A2"],
  ["salir — imperfecto", "yo salía · tú salías · él/ella/usted salía · nosotros salíamos · vosotros salíais · ellos/ellas/ustedes salían", "Conjugación imperfecto", "A2"],
  ["venir — imperfecto", "yo venía · tú venías · él/ella/usted venía · nosotros veníamos · vosotros veníais · ellos/ellas/ustedes venían", "Conjugación imperfecto", "A2"],
  ["haber — imperfecto", "yo había · tú habías · él/ella/usted había · nosotros habíamos · vosotros habíais · ellos/ellas/ustedes habían", "Conjugación imperfecto", "A2"],

  // ---- Conjugación futuro (full paradigm, incl. vosotros) ----
  ["hablar — futuro", "yo hablaré · tú hablarás · él/ella/usted hablará · nosotros hablaremos · vosotros hablaréis · ellos/ellas/ustedes hablarán", "Conjugación futuro", "B1"],
  ["ser — futuro", "yo seré · tú serás · él/ella/usted será · nosotros seremos · vosotros seréis · ellos/ellas/ustedes serán", "Conjugación futuro", "B1"],
  ["estar — futuro", "yo estaré · tú estarás · él/ella/usted estará · nosotros estaremos · vosotros estaréis · ellos/ellas/ustedes estarán", "Conjugación futuro", "B1"],
  ["tener — futuro", "yo tendré · tú tendrás · él/ella/usted tendrá · nosotros tendremos · vosotros tendréis · ellos/ellas/ustedes tendrán", "Conjugación futuro", "B1"],
  ["ir — futuro", "yo iré · tú irás · él/ella/usted irá · nosotros iremos · vosotros iréis · ellos/ellas/ustedes irán", "Conjugación futuro", "B1"],
  ["hacer — futuro", "yo haré · tú harás · él/ella/usted hará · nosotros haremos · vosotros haréis · ellos/ellas/ustedes harán", "Conjugación futuro", "B1"],
  ["poder — futuro", "yo podré · tú podrás · él/ella/usted podrá · nosotros podremos · vosotros podréis · ellos/ellas/ustedes podrán", "Conjugación futuro", "B1"],
  ["querer — futuro", "yo querré · tú querrás · él/ella/usted querrá · nosotros querremos · vosotros querréis · ellos/ellas/ustedes querrán", "Conjugación futuro", "B1"],
  ["decir — futuro", "yo diré · tú dirás · él/ella/usted dirá · nosotros diremos · vosotros diréis · ellos/ellas/ustedes dirán", "Conjugación futuro", "B1"],
  ["saber — futuro", "yo sabré · tú sabrás · él/ella/usted sabrá · nosotros sabremos · vosotros sabréis · ellos/ellas/ustedes sabrán", "Conjugación futuro", "B1"],
  ["dar — futuro", "yo daré · tú darás · él/ella/usted dará · nosotros daremos · vosotros daréis · ellos/ellas/ustedes darán", "Conjugación futuro", "B1"],
  ["ver — futuro", "yo veré · tú verás · él/ella/usted verá · nosotros veremos · vosotros veréis · ellos/ellas/ustedes verán", "Conjugación futuro", "B1"],
  ["poner — futuro", "yo pondré · tú pondrás · él/ella/usted pondrá · nosotros pondremos · vosotros pondréis · ellos/ellas/ustedes pondrán", "Conjugación futuro", "B1"],
  ["salir — futuro", "yo saldré · tú saldrás · él/ella/usted saldrá · nosotros saldremos · vosotros saldréis · ellos/ellas/ustedes saldrán", "Conjugación futuro", "B1"],
  ["venir — futuro", "yo vendré · tú vendrás · él/ella/usted vendrá · nosotros vendremos · vosotros vendréis · ellos/ellas/ustedes vendrán", "Conjugación futuro", "B1"],

  // ---- Conjugación condicional (full paradigm, incl. vosotros) ----
  ["hablar — condicional", "yo hablaría · tú hablarías · él/ella/usted hablaría · nosotros hablaríamos · vosotros hablaríais · ellos/ellas/ustedes hablarían", "Conjugación condicional", "B1"],
  ["ser — condicional", "yo sería · tú serías · él/ella/usted sería · nosotros seríamos · vosotros seríais · ellos/ellas/ustedes serían", "Conjugación condicional", "B1"],
  ["estar — condicional", "yo estaría · tú estarías · él/ella/usted estaría · nosotros estaríamos · vosotros estaríais · ellos/ellas/ustedes estarían", "Conjugación condicional", "B1"],
  ["tener — condicional", "yo tendría · tú tendrías · él/ella/usted tendría · nosotros tendríamos · vosotros tendríais · ellos/ellas/ustedes tendrían", "Conjugación condicional", "B1"],
  ["ir — condicional", "yo iría · tú irías · él/ella/usted iría · nosotros iríamos · vosotros iríais · ellos/ellas/ustedes irían", "Conjugación condicional", "B1"],
  ["hacer — condicional", "yo haría · tú harías · él/ella/usted haría · nosotros haríamos · vosotros haríais · ellos/ellas/ustedes harían", "Conjugación condicional", "B1"],
  ["poder — condicional", "yo podría · tú podrías · él/ella/usted podría · nosotros podríamos · vosotros podríais · ellos/ellas/ustedes podrían", "Conjugación condicional", "B1"],
  ["querer — condicional", "yo querría · tú querrías · él/ella/usted querría · nosotros querríamos · vosotros querríais · ellos/ellas/ustedes querrían", "Conjugación condicional", "B1"],
  ["decir — condicional", "yo diría · tú dirías · él/ella/usted diría · nosotros diríamos · vosotros diríais · ellos/ellas/ustedes dirían", "Conjugación condicional", "B1"],
  ["saber — condicional", "yo sabría · tú sabrías · él/ella/usted sabría · nosotros sabríamos · vosotros sabríais · ellos/ellas/ustedes sabrían", "Conjugación condicional", "B1"],
  ["dar — condicional", "yo daría · tú darías · él/ella/usted daría · nosotros daríamos · vosotros daríais · ellos/ellas/ustedes darían", "Conjugación condicional", "B1"],
  ["ver — condicional", "yo vería · tú verías · él/ella/usted vería · nosotros veríamos · vosotros veríais · ellos/ellas/ustedes verían", "Conjugación condicional", "B1"],
  ["poner — condicional", "yo pondría · tú pondrías · él/ella/usted pondría · nosotros pondríamos · vosotros pondríais · ellos/ellas/ustedes pondrían", "Conjugación condicional", "B1"],
  ["salir — condicional", "yo saldría · tú saldrías · él/ella/usted saldría · nosotros saldríamos · vosotros saldríais · ellos/ellas/ustedes saldrían", "Conjugación condicional", "B1"],
  ["venir — condicional", "yo vendría · tú vendrías · él/ella/usted vendría · nosotros vendríamos · vosotros vendríais · ellos/ellas/ustedes vendrían", "Conjugación condicional", "B1"],

  // ---- Conjugación subjuntivo (full paradigm, incl. vosotros) ----
  ["hablar — subjuntivo", "yo hable · tú hables · él/ella/usted hable · nosotros hablemos · vosotros habléis · ellos/ellas/ustedes hablen", "Conjugación subjuntivo", "B1"],
  ["ser — subjuntivo", "yo sea · tú seas · él/ella/usted sea · nosotros seamos · vosotros seáis · ellos/ellas/ustedes sean", "Conjugación subjuntivo", "B1"],
  ["estar — subjuntivo", "yo esté · tú estés · él/ella/usted esté · nosotros estemos · vosotros estéis · ellos/ellas/ustedes estén", "Conjugación subjuntivo", "B1"],
  ["tener — subjuntivo", "yo tenga · tú tengas · él/ella/usted tenga · nosotros tengamos · vosotros tengáis · ellos/ellas/ustedes tengan", "Conjugación subjuntivo", "B1"],
  ["ir — subjuntivo", "yo vaya · tú vayas · él/ella/usted vaya · nosotros vayamos · vosotros vayáis · ellos/ellas/ustedes vayan", "Conjugación subjuntivo", "B1"],
  ["hacer — subjuntivo", "yo haga · tú hagas · él/ella/usted haga · nosotros hagamos · vosotros hagáis · ellos/ellas/ustedes hagan", "Conjugación subjuntivo", "B1"],
  ["poder — subjuntivo", "yo pueda · tú puedas · él/ella/usted pueda · nosotros podamos · vosotros podáis · ellos/ellas/ustedes puedan", "Conjugación subjuntivo", "B1"],
  ["querer — subjuntivo", "yo quiera · tú quieras · él/ella/usted quiera · nosotros queramos · vosotros queráis · ellos/ellas/ustedes quieran", "Conjugación subjuntivo", "B1"],
  ["decir — subjuntivo", "yo diga · tú digas · él/ella/usted diga · nosotros digamos · vosotros digáis · ellos/ellas/ustedes digan", "Conjugación subjuntivo", "B1"],
  ["saber — subjuntivo", "yo sepa · tú sepas · él/ella/usted sepa · nosotros sepamos · vosotros sepáis · ellos/ellas/ustedes sepan", "Conjugación subjuntivo", "B1"],
  ["dar — subjuntivo", "yo dé · tú des · él/ella/usted dé · nosotros demos · vosotros deis · ellos/ellas/ustedes den", "Conjugación subjuntivo", "B1"],
  ["ver — subjuntivo", "yo vea · tú veas · él/ella/usted vea · nosotros veamos · vosotros veáis · ellos/ellas/ustedes vean", "Conjugación subjuntivo", "B1"],
  ["poner — subjuntivo", "yo ponga · tú pongas · él/ella/usted ponga · nosotros pongamos · vosotros pongáis · ellos/ellas/ustedes pongan", "Conjugación subjuntivo", "B1"],
  ["salir — subjuntivo", "yo salga · tú salgas · él/ella/usted salga · nosotros salgamos · vosotros salgáis · ellos/ellas/ustedes salgan", "Conjugación subjuntivo", "B1"],
  ["venir — subjuntivo", "yo venga · tú vengas · él/ella/usted venga · nosotros vengamos · vosotros vengáis · ellos/ellas/ustedes vengan", "Conjugación subjuntivo", "B1"],

  // ---- Reacciones y exclamaciones (A2) ----
  ["¡Qué bien!", "How great! / That's wonderful!", "Reacciones y exclamaciones", "A2"],
  ["¡Qué horror!", "How awful! / That's terrible!", "Reacciones y exclamaciones", "A2"],
  ["¡No puede ser!", "No way! / That can't be!", "Reacciones y exclamaciones", "A2"],
  ["¡Increíble!", "Incredible! / Unbelievable!", "Reacciones y exclamaciones", "A2"],
  ["¡Vaya!", "Wow! / Oh my!", "Reacciones y exclamaciones", "A2"],
  ["¡Qué sorpresa!", "What a surprise!", "Reacciones y exclamaciones", "A2"],
  ["¡No me digas!", "No way! / You don't say!", "Reacciones y exclamaciones", "A2"],
  ["¡Qué suerte!", "What luck!", "Reacciones y exclamaciones", "A2"],
  ["¡Genial!", "Great! / Awesome!", "Reacciones y exclamaciones", "A2"],
  ["¡Qué asco!", "Gross! / How disgusting!", "Reacciones y exclamaciones", "A2"],

  // ---- Dando consejos (B1) ----
  ["Deberías...", "You should...", "Dando consejos", "B1"],
  ["Te recomiendo que...", "I recommend that you...", "Dando consejos", "B1"],
  ["Si yo fuera tú...", "If I were you...", "Dando consejos", "B1"],
  ["Lo mejor sería...", "The best thing would be...", "Dando consejos", "B1"],
  ["Te sugiero que...", "I suggest that you...", "Dando consejos", "B1"],
  ["¿Por qué no...?", "Why don't you...?", "Dando consejos", "B1"],

  // ---- Narrando una historia (B1) ----
  ["Érase una vez", "Once upon a time", "Narrando una historia", "B1"],
  ["De repente", "Suddenly", "Narrando una historia", "B1"],
  ["Al final", "In the end", "Narrando una historia", "B1"],
  ["Entonces", "Then / So", "Narrando una historia", "B1"],
  ["Después de eso", "After that", "Narrando una historia", "B1"],
  ["Resulta que", "It turns out that", "Narrando una historia", "B1"],
  ["Para colmo", "To top it all off", "Narrando una historia", "B1"],
  ["Menos mal que", "Thank goodness that", "Narrando una historia", "B1"],

  // ---- Presentaciones y despedidas (A2) ----
  ["Te presento a...", "Let me introduce you to...", "Presentaciones y despedidas", "A2"],
  ["Encantado/a", "Delighted (to meet you)", "Presentaciones y despedidas", "A2"],
  ["Que te vaya bien", "Take care / go well", "Presentaciones y despedidas", "A2"],
  ["Cuídate", "Take care (of yourself)", "Presentaciones y despedidas", "A2"],
  ["Nos vemos pronto", "See you soon", "Presentaciones y despedidas", "A2"],
  ["Fue un placer", "It was a pleasure", "Presentaciones y despedidas", "A2"],

  // ---- Quejas y reclamos (B1) ----
  ["Esto no está bien", "This isn't right", "Quejas y reclamos", "B1"],
  ["No estoy satisfecho/a", "I'm not satisfied", "Quejas y reclamos", "B1"],
  ["Quiero hablar con el gerente", "I want to speak with the manager", "Quejas y reclamos", "B1"],
  ["Esto no es lo que pedí", "This isn't what I ordered", "Quejas y reclamos", "B1"],
  ["Quiero mi dinero de vuelta", "I want my money back", "Quejas y reclamos", "B1"],

  // ---- Deseos y esperanza (B1) ----
  ["Espero que todo salga bien", "I hope everything goes well", "Deseos y esperanza", "B1"],
  ["Espero que...", "I hope that...", "Deseos y esperanza", "B1"],
  ["Que tengas suerte", "Good luck (to you)", "Deseos y esperanza", "B1"],
  ["Que te mejores", "Get well soon", "Deseos y esperanza", "B1"],
  ["Que descanses", "Sleep well / rest well", "Deseos y esperanza", "B1"],

  // ---- Empatía y comprensión (B1) ----
  ["Te entiendo", "I understand you", "Empatía y comprensión", "B1"],
  ["Sé cómo te sientes", "I know how you feel", "Empatía y comprensión", "B1"],
  ["Estoy aquí para ti", "I'm here for you", "Empatía y comprensión", "B1"],
  ["Ánimo", "Cheer up / hang in there", "Empatía y comprensión", "B1"],

  // ---- Conjugación subjuntivo imperfecto (full paradigm, -ra form) (B2) ----
  ["hablar — subjuntivo imperfecto", "yo hablara · tú hablaras · él/ella/usted hablara · nosotros habláramos · vosotros hablarais · ellos/ellas/ustedes hablaran", "Conjugación subjuntivo imperfecto", "B2"],
  ["ser — subjuntivo imperfecto", "yo fuera · tú fueras · él/ella/usted fuera · nosotros fuéramos · vosotros fuerais · ellos/ellas/ustedes fueran", "Conjugación subjuntivo imperfecto", "B2"],
  ["estar — subjuntivo imperfecto", "yo estuviera · tú estuvieras · él/ella/usted estuviera · nosotros estuviéramos · vosotros estuvierais · ellos/ellas/ustedes estuvieran", "Conjugación subjuntivo imperfecto", "B2"],
  ["tener — subjuntivo imperfecto", "yo tuviera · tú tuvieras · él/ella/usted tuviera · nosotros tuviéramos · vosotros tuvierais · ellos/ellas/ustedes tuvieran", "Conjugación subjuntivo imperfecto", "B2"],
  ["ir — subjuntivo imperfecto", "yo fuera · tú fueras · él/ella/usted fuera · nosotros fuéramos · vosotros fuerais · ellos/ellas/ustedes fueran", "Conjugación subjuntivo imperfecto", "B2"],
  ["hacer — subjuntivo imperfecto", "yo hiciera · tú hicieras · él/ella/usted hiciera · nosotros hiciéramos · vosotros hicierais · ellos/ellas/ustedes hicieran", "Conjugación subjuntivo imperfecto", "B2"],
  ["poder — subjuntivo imperfecto", "yo pudiera · tú pudieras · él/ella/usted pudiera · nosotros pudiéramos · vosotros pudierais · ellos/ellas/ustedes pudieran", "Conjugación subjuntivo imperfecto", "B2"],
  ["querer — subjuntivo imperfecto", "yo quisiera · tú quisieras · él/ella/usted quisiera · nosotros quisiéramos · vosotros quisierais · ellos/ellas/ustedes quisieran", "Conjugación subjuntivo imperfecto", "B2"],
  ["decir — subjuntivo imperfecto", "yo dijera · tú dijeras · él/ella/usted dijera · nosotros dijéramos · vosotros dijerais · ellos/ellas/ustedes dijeran", "Conjugación subjuntivo imperfecto", "B2"],
  ["saber — subjuntivo imperfecto", "yo supiera · tú supieras · él/ella/usted supiera · nosotros supiéramos · vosotros supierais · ellos/ellas/ustedes supieran", "Conjugación subjuntivo imperfecto", "B2"],
  ["dar — subjuntivo imperfecto", "yo diera · tú dieras · él/ella/usted diera · nosotros diéramos · vosotros dierais · ellos/ellas/ustedes dieran", "Conjugación subjuntivo imperfecto", "B2"],
  ["ver — subjuntivo imperfecto", "yo viera · tú vieras · él/ella/usted viera · nosotros viéramos · vosotros vierais · ellos/ellas/ustedes vieran", "Conjugación subjuntivo imperfecto", "B2"],
  ["poner — subjuntivo imperfecto", "yo pusiera · tú pusieras · él/ella/usted pusiera · nosotros pusiéramos · vosotros pusierais · ellos/ellas/ustedes pusieran", "Conjugación subjuntivo imperfecto", "B2"],
  ["salir — subjuntivo imperfecto", "yo saliera · tú salieras · él/ella/usted saliera · nosotros saliéramos · vosotros salierais · ellos/ellas/ustedes salieran", "Conjugación subjuntivo imperfecto", "B2"],
  ["venir — subjuntivo imperfecto", "yo viniera · tú vinieras · él/ella/usted viniera · nosotros viniéramos · vosotros vinierais · ellos/ellas/ustedes vinieran", "Conjugación subjuntivo imperfecto", "B2"],

  // ---- Subjuntivo imperfecto — ejemplos (B2) ----
  ["Si fuera rico, compraría una casa", "If I were rich, I would buy a house", "Subjuntivo imperfecto — ejemplos", "B2"],
  ["Ojalá pudiera ir contigo", "I wish I could go with you", "Subjuntivo imperfecto — ejemplos", "B2"],
  ["Quisiera pedir un café", "I would like to order a coffee", "Subjuntivo imperfecto — ejemplos", "B2"],
  ["Me pidió que llegara temprano", "He asked me to arrive early", "Subjuntivo imperfecto — ejemplos", "B2"],
  ["Dudaba que dijera la verdad", "I doubted that he was telling the truth", "Subjuntivo imperfecto — ejemplos", "B2"],
  ["Esperaba que vinieras a la fiesta", "I was hoping you would come to the party", "Subjuntivo imperfecto — ejemplos", "B2"],

  // ---- Vocabulario C2 (B2->C2 sophistication) ----
  ["la elocuencia", "eloquence", "Vocabulario C2", "C2"],
  ["la perspicacia", "insight / perspicacity", "Vocabulario C2", "C2"],
  ["el desasosiego", "unease / restlessness", "Vocabulario C2", "C2"],
  ["la vehemencia", "vehemence / passion", "Vocabulario C2", "C2"],
  ["la abnegación", "selflessness / self-sacrifice", "Vocabulario C2", "C2"],
  ["el hastío", "weariness / ennui", "Vocabulario C2", "C2"],
  ["la encrucijada", "crossroads", "Vocabulario C2", "C2"],
  ["el meollo", "the crux / heart of the matter", "Vocabulario C2", "C2"],
  ["la vorágine", "whirlwind / maelstrom", "Vocabulario C2", "C2"],
  ["el desenlace", "outcome / denouement", "Vocabulario C2", "C2"],
  ["la reticencia", "reluctance / reticence", "Vocabulario C2", "C2"],
  ["la ambigüedad", "ambiguity", "Vocabulario C2", "C2"],
  ["el ímpetu", "impetus / momentum", "Vocabulario C2", "C2"],
  ["la lucidez", "lucidity / clarity of mind", "Vocabulario C2", "C2"],
  ["la contundencia", "forcefulness / conclusiveness", "Vocabulario C2", "C2"],

  // ---- Conjugación reflexiva (full paradigm, presente) (B1) ----
  ["llamarse — presente", "yo me llamo · tú te llamas · él/ella/usted se llama · nosotros nos llamamos · vosotros os llamáis · ellos/ellas/ustedes se llaman", "Conjugación reflexiva", "B1"],
  ["levantarse — presente", "yo me levanto · tú te levantas · él/ella/usted se levanta · nosotros nos levantamos · vosotros os levantáis · ellos/ellas/ustedes se levantan", "Conjugación reflexiva", "B1"],
  ["sentirse — presente", "yo me siento · tú te sientes · él/ella/usted se siente · nosotros nos sentimos · vosotros os sentís · ellos/ellas/ustedes se sienten", "Conjugación reflexiva", "B1"],
  ["preocuparse — presente", "yo me preocupo · tú te preocupas · él/ella/usted se preocupa · nosotros nos preocupamos · vosotros os preocupáis · ellos/ellas/ustedes se preocupan", "Conjugación reflexiva", "B1"],
  ["divertirse — presente", "yo me divierto · tú te diviertes · él/ella/usted se divierte · nosotros nos divertimos · vosotros os divertís · ellos/ellas/ustedes se divierten", "Conjugación reflexiva", "B1"],

  // ---- Clima — additions (A2) ----
  ["Hace calor", "It's hot", "Clima", "A2"],
  ["Hace sol", "It's sunny", "Clima", "A2"],
  ["Hay niebla", "It's foggy", "Clima", "A2"],
  ["Está despejado", "It's clear (sky)", "Clima", "A2"],
  ["el pronóstico", "forecast", "Clima", "A2"],
  ["la temperatura", "temperature", "Clima", "A2"],
  ["los grados", "degrees", "Clima", "A2"],
  ["húmedo", "humid", "Clima", "A2"],
  ["seco", "dry", "Clima", "A2"],
  ["la tormenta", "storm", "Clima", "A2"],
  ["el trueno", "thunder", "Clima", "A2"],
  ["el relámpago", "lightning", "Clima", "A2"],

  // ---- Trabajo — additions (B1) ----
  ["renunciar", "to quit / resign", "Trabajo", "B1"],
  ["contratar", "to hire", "Trabajo", "B1"],
  ["despedir", "to fire", "Trabajo", "B1"],
  ["el sueldo", "salary", "Trabajo", "B1"],
  ["las vacaciones", "vacation", "Trabajo", "B1"],
  ["el currículum", "résumé / CV", "Trabajo", "B1"],
  ["la entrevista", "interview", "Trabajo", "B1"],
  ["el compañero de trabajo", "coworker", "Trabajo", "B1"],
  ["jubilarse", "to retire", "Trabajo", "B1"],
  ["el ascenso", "promotion", "Trabajo", "B1"],

  // ---- Tecnología — additions (B1) ----
  ["la computadora", "computer", "Tecnología", "B1"],
  ["el internet", "the internet", "Tecnología", "B1"],
  ["la nube", "the cloud (storage)", "Tecnología", "B1"],
  ["el wifi", "wifi", "Tecnología", "B1"],
  ["actualizar", "to update", "Tecnología", "B1"],
  ["instalar", "to install", "Tecnología", "B1"],
  ["el software", "software", "Tecnología", "B1"],
  ["la impresora", "printer", "Tecnología", "B1"],
  ["cargar", "to charge (a battery)", "Tecnología", "B1"],
];

function buildSeedDeck() {
  return SEED_WORDS.map(([es, en, category, level, dialect, example], i) => ({
    id: `seed-${i}`,
    front: es,
    back: en,
    category,
    level: level || "A1",
    dialect: dialect || "neutral",
    example: example || null,
    contentType: contentTypeOf(category),
    status: "new",
    repetitions: 0,
    easeFactor: 2.5,
    interval: 0,
    dueDate: null,
    lastReviewed: null,
    createdAt: new Date(0).toISOString(),
    deletedAt: null,
  }));
}

/* ------------------------------------------------------------------ */
/* Content-type + level metadata                                       */
/* ------------------------------------------------------------------ */
const FRASES_CATEGORIES = new Set([
  "Saludos", "Frases", "Modismos", "Opiniones",
  "Conectores", "Conectores C1", "Subjuntivo", "Debate",
  "Hipotéticos", "Refranes", "Marcadores conversacionales",
  "Haciendo planes", "Acuerdo y desacuerdo", "Preferencias",
  "Pidiendo aclaración", "Disculpas y sentimientos",
  "Certeza e incertidumbre", "Charla social",
  "Comparativos y superlativos",
  "Mandatos formales y direcciones", "Mandatos con nosotros",
  "Presente progresivo", "Presente perfecto y pluscuamperfecto",
  "Ser vs. estar", "Por vs. para",
  "Restaurante — frases", "Compras — frases", "Llamadas telefónicas — frases",
  "Salud — frases", "Banco — frases", "Problemas con el carro — frases",
  "Reacciones y exclamaciones", "Dando consejos", "Narrando una historia",
  "Presentaciones y despedidas", "Quejas y reclamos", "Deseos y esperanza",
  "Empatía y comprensión", "Subjuntivo imperfecto — ejemplos",
]);
const VERBOS_CATEGORIES = new Set([
  "Verbos", "Verbos B1", "Verbos C1", "Verbos reflexivos",
  "Conjugación presente", "Conjugación pretérito", "Conjugación imperfecto",
  "Conjugación futuro", "Conjugación condicional", "Conjugación subjuntivo",
  "Mandatos informales (tú)", "Mandatos negativos (tú)",
  "Gerundios", "Participios", "Conjugación subjuntivo imperfecto", "Conjugación reflexiva",
]);

function contentTypeOf(category) {
  if (VERBOS_CATEGORIES.has(category)) return "verbos";
  if (FRASES_CATEGORIES.has(category)) return "frases";
  return "vocabulario";
}

const CONTENT_TYPES = [
  { code: "vocabulario", label: "Vocabulary" },
  { code: "verbos", label: "Verbs" },
  { code: "frases", label: "Useful Phrases" },
];

// Display-only English labels for category tags. The underlying category
// strings stay in Spanish (used by contentTypeOf, filtering, and stored
// card data) — this map only changes what's shown on screen.
const CATEGORY_LABELS = {
  "Saludos": "Greetings",
  "Números": "Numbers",
  "Colores": "Colors",
  "Familia": "Family",
  "Comida": "Food",
  "Verbos": "Verbs",
  "Adjetivos": "Adjectives",
  "Tiempo": "Time",
  "Frases": "Phrases",
  "Casa": "House",
  "Cuerpo": "Body",
  "Compras": "Shopping",
  "Direcciones": "Directions",
  "Clima": "Weather",
  "Transporte": "Transportation",
  "Rutina": "Routine",
  "Trabajo": "Work",
  "Ropa": "Clothing",
  "Opiniones": "Opinions",
  "Conectores": "Connectors",
  "Sentimientos": "Feelings",
  "Viajes": "Travel",
  "Tecnología": "Technology",
  "Debate": "Debate",
  "Subjuntivo": "Subjunctive",
  "Adjetivos B2": "Adjectives (B2)",
  "Negocios": "Business",
  "Conectores C1": "Connectors (C1)",
  "Vocabulario C1": "Vocabulary (C1)",
  "Verbos B1": "Verbs (B1)",
  "Verbos C1": "Verbs (C1)",
  "Modismos": "Idioms",
  "Conjugación presente": "Present Tense Conjugation",
  "Preguntas": "Question Words",
  "Preposiciones": "Prepositions",
  "Posesivos y demostrativos": "Possessives & Demonstratives",
  "Verbos reflexivos": "Reflexive Verbs",
  "Salud": "Health",
  "Hipotéticos": "Hypotheticals",
  "Medios de comunicación": "Media",
  "Refranes": "Proverbs",
  "Meses": "Months",
  "Estaciones": "Seasons",
  "Animales": "Animals",
  "Números ordinales": "Ordinal Numbers",
  "Naturaleza": "Nature",
  "Deportes y pasatiempos": "Sports & Hobbies",
  "La hora": "Telling Time",
  "Pronombres personales": "Personal Pronouns",
  "Pronombres de objeto": "Object Pronouns",
  "Marcadores conversacionales": "Conversational Fillers",
  "Adverbios comunes": "Common Adverbs",
  "Conjugación pretérito": "Preterite Conjugation",
  "Conjugación imperfecto": "Imperfect Conjugation",
  "Conjugación futuro": "Future Conjugation",
  "Conjugación condicional": "Conditional Conjugation",
  "Haciendo planes": "Making Plans",
  "Acuerdo y desacuerdo": "Agreement & Disagreement",
  "Preferencias": "Preferences",
  "Pidiendo aclaración": "Asking for Clarification",
  "Disculpas y sentimientos": "Apologies & Regret",
  "Certeza e incertidumbre": "Certainty & Uncertainty",
  "Charla social": "Small Talk",
  "Descripción física": "Physical Description",
  "Personalidad": "Personality",
  "Comparativos y superlativos": "Comparatives & Superlatives",
  "Lugares en la ciudad": "Places in the City",
  "Profesiones": "Professions",
  "Nacionalidades y países": "Nationalities & Countries",
  "Números extendidos": "Extended Numbers",
  "Mandatos informales (tú)": "Informal Commands (tú)",
  "Mandatos negativos (tú)": "Negative Commands (tú)",
  "Mandatos formales y direcciones": "Formal Commands & Directions",
  "Mandatos con nosotros": "\"Let's...\" Commands",
  "Conjugación subjuntivo": "Subjunctive Conjugation",
  "Gerundios": "Gerunds",
  "Presente progresivo": "Present Progressive",
  "Participios": "Past Participles",
  "Presente perfecto y pluscuamperfecto": "Present & Past Perfect",
  "Ser vs. estar": "Ser vs. Estar",
  "Por vs. para": "Por vs. Para",
  "Restaurante": "Restaurant",
  "Restaurante — frases": "Restaurant Phrases",
  "Compras — frases": "Shopping Phrases",
  "Llamadas telefónicas": "Phone Calls",
  "Llamadas telefónicas — frases": "Phone Call Phrases",
  "Salud — frases": "Health Phrases",
  "Banco": "Banking",
  "Banco — frases": "Banking Phrases",
  "Problemas con el carro": "Car Trouble",
  "Problemas con el carro — frases": "Car Trouble Phrases",
  "Reacciones y exclamaciones": "Reactions & Exclamations",
  "Dando consejos": "Giving Advice",
  "Narrando una historia": "Telling a Story",
  "Presentaciones y despedidas": "Introductions & Farewells",
  "Quejas y reclamos": "Complaints",
  "Deseos y esperanza": "Wishes & Hopes",
  "Empatía y comprensión": "Empathy & Understanding",
  "Conjugación subjuntivo imperfecto": "Imperfect Subjunctive Conjugation",
  "Subjuntivo imperfecto — ejemplos": "Imperfect Subjunctive Examples",
  "Vocabulario C2": "Advanced Vocabulary (C2)",
  "Conjugación reflexiva": "Reflexive Conjugation",
};
function categoryLabel(category) {
  return CATEGORY_LABELS[category] || category;
}

const MODES = [
  { code: "srs", label: "Review" },
  { code: "browse", label: "Deck" },
  { code: "match", label: "Match" },
];

const LEVELS = [
  { code: "A1", label: "A1", name: "Beginner", blurb: "Basic phrases for immediate needs" },
  { code: "A2", label: "A2", name: "Elementary", blurb: "Everyday topics and routines" },
  { code: "B1", label: "B1", name: "Intermediate", blurb: "Opinions, experiences, plans" },
  { code: "B2", label: "B2", name: "Upper Intermediate", blurb: "Abstract ideas and debate" },
  { code: "C1", label: "C1", name: "Advanced", blurb: "Nuanced, fluent, professional" },
  { code: "C2", label: "C2", name: "Mastery", blurb: "Idioms and native-like nuance" },
];
const LEVEL_ORDER = LEVELS.map((l) => l.code);

const DIALECTS = [
  { code: "latam", label: "Latin America", blurb: "Latin American vocabulary and forms (default)" },
  { code: "spain", label: "Spain", blurb: "Peninsular Spanish vocabulary and forms (vosotros, vale, coche...)" },
];

/* ------------------------------------------------------------------ */
/* Grammar reference guide (not SRS content — static explanations)     */
/* ------------------------------------------------------------------ */
const GRAMMAR_GUIDE = {
  A1: {
    name: "Principiante",
    intro: "The foundations: how Spanish sentences are built, and the present tense that carries most early conversation.",
    sections: [
      {
        heading: "Nouns have gender",
        body: "Every Spanish noun is either masculine or feminine — not just people and animals, but objects and ideas too (la mesa, el libro). Nouns ending in -o are usually masculine and -a usually feminine, but there are common exceptions worth memorizing rather than guessing: el día, el mapa, el problema are masculine despite ending in -a; la mano is feminine despite ending in -o. El agua is feminine but takes el in the singular for pronunciation reasons (two stressed a-sounds in a row are avoided) — adjectives describing it still agree as feminine: el agua fría, not el agua frío.",
        examples: ["el libro — the book (m.)", "la mesa — the table (f.)", "el día — the day (m., irregular)", "la mano — the hand (f., irregular)"],
      },
      {
        heading: "Articles and adjective agreement",
        body: "Definite articles (el, la, los, las) and indefinite articles (un, una, unos, unas) must match the noun's gender and number. Adjectives agree too, and — unlike English — they usually come after the noun: casa grande, not grande casa. A handful of common adjectives (bueno, malo, grande) can go before the noun with a slightly different meaning or emphasis, but placing adjectives after the noun is the safe default.",
        examples: ["un coche rojo — a red car", "las casas grandes — the big houses", "una mujer inteligente — an intelligent woman"],
      },
      {
        heading: "Subject pronouns are often dropped",
        body: "Yo, tú, él, ella, usted, nosotros, vosotros, ellos, ellas, ustedes exist, but Spanish verb endings already show who's doing the action, so pronouns are usually omitted unless needed for clarity or emphasis. Hablo español says \"I speak Spanish\" on its own — adding Yo hablo español only makes sense if you're contrasting yourself with someone else.",
        examples: ["Hablo español. — I speak Spanish. (pronoun dropped)", "Yo hablo español, pero él habla francés. — I speak Spanish, but he speaks French. (pronoun kept for contrast)"],
      },
      {
        heading: "Present tense: three regular patterns",
        body: "Regular verbs fall into three families based on their infinitive ending — -ar, -er, -ir — each with its own set of present-tense endings. Once you know the pattern, you can conjugate any regular verb in that family. Irregular verbs (ser, estar, tener, ir, hacer and others) don't follow the pattern and have to be learned individually — these are exactly the verbs covered in the Verbs tab's conjugation paradigms.",
        examples: ["hablar → hablo, hablas, habla, hablamos, habláis, hablan", "comer → como, comes, come, comemos, coméis, comen", "vivir → vivo, vives, vive, vivimos, vivís, viven"],
      },
      {
        heading: "Ser vs. estar — the first big distinction",
        body: "English has one verb \"to be\"; Spanish has two. Ser is for identity, characteristics, origin, profession, and time — things that define what something fundamentally is. Estar is for location, temporary states, and condition — where something is or what state it's currently in. A full contrast set with the adjectives that change meaning between the two (aburrido, listo, malo...) lives in the Frases tab under \"Ser vs. estar.\"",
        examples: ["Es alto. — He is tall. (characteristic — ser)", "Está cansado. — He is tired. (temporary state — estar)"],
      },
      {
        heading: "Asking questions and saying no",
        body: "Question words (qué, quién, dónde, cuándo, cómo, cuál, por qué, cuánto) go at the start of the question, and written Spanish opens with an inverted question mark: ¿Dónde vives? Negation is simple — put no directly before the verb. There's no auxiliary \"do\" the way English needs it for questions and negatives.",
        examples: ["¿Dónde vives? — Where do you live?", "No hablo francés. — I don't speak French."],
      },
    ],
  },

  A2: {
    name: "Elemental",
    intro: "Talking about the past, expressing preferences the Spanish way, and the small connective words that hold sentences together.",
    sections: [
      {
        heading: "Preterite vs. imperfect — two different pasts",
        body: "Spanish splits the simple past into two tenses that English doesn't distinguish. The preterite (hablé, comí, viví) is for completed actions with a clear beginning and end — something that happened and finished. The imperfect (hablaba, comía, vivía) is for ongoing or habitual past actions — what was happening, or what used to happen regularly, without a defined endpoint. The two often appear together: the imperfect sets the scene, the preterite reports what happened in it.",
        examples: ["Ayer comí pizza. — Yesterday I ate pizza. (one completed event — preterite)", "Cuando era niño, jugaba mucho. — When I was a kid, I used to play a lot. (ongoing/habitual — imperfect)", "Miraba la tele cuando sonó el teléfono. — I was watching TV when the phone rang. (imperfect sets the scene, preterite interrupts it)"],
      },
      {
        heading: "Reflexive verbs",
        body: "Reflexive verbs describe an action the subject does to itself, and they need a reflexive pronoun (me, te, se, nos, os, se) that changes with the subject, in addition to the normal verb ending. Many everyday routine verbs are reflexive in Spanish even when they aren't in English — llamarse (to be called/named) is the most common example every learner meets immediately.",
        examples: ["Me llamo Ana. — My name is Ana. (literally: I call myself Ana)", "Se levanta a las siete. — He gets up at seven."],
      },
      {
        heading: "Object pronouns",
        body: "Direct object pronouns (lo, la, los, las) replace the thing being acted on; indirect object pronouns (me, te, le, nos, os, les) replace the person something is being done for or to. Both normally go directly before a conjugated verb, which takes some getting used to for English speakers, since English keeps the object after the verb.",
        examples: ["Lo veo. — I see it/him.", "Le doy el libro. — I give him/her the book."],
      },
      {
        heading: "Gustar and verbs like it",
        body: "Gustar doesn't work like English \"to like\" — it works more like \"to be pleasing to.\" The thing being liked is the grammatical subject, and the person doing the liking takes an indirect object pronoun. This \"backwards\" structure trips up almost every English speaker at first, but it becomes automatic with exposure. Several other common verbs (encantar, molestar, interesar, doler) follow the exact same pattern.",
        examples: ["Me gusta el café. — I like coffee. (literally: coffee is pleasing to me)", "Le duelen los pies. — Her feet hurt. (literally: the feet are hurting to her)"],
      },
      {
        heading: "Comparing things",
        body: "Comparisons use más...que (more...than), menos...que (less...than), and tan...como (as...as) — a full set of comparative and superlative patterns, including the irregular ones (mejor, peor, mayor, menor), lives in the Frases tab.",
        examples: ["Es más alto que yo. — He's taller than me.", "Tan bueno como el otro. — As good as the other one."],
      },
    ],
  },

  B1: {
    name: "Intermedio",
    intro: "Talking about the future, giving commands, and the first real encounter with the subjunctive mood.",
    sections: [
      {
        heading: "Future and conditional",
        body: "The future tense (hablaré, tendré) and conditional (hablaría, tendría) are both built by adding endings directly onto the infinitive — no separate stem needed for regular verbs. A dozen common verbs use an irregular shortened stem for both tenses (tener → tendr-, hacer → har-, poder → podr-, decir → dir-, salir → saldr-, venir → vendr-), which is why they're worth drilling as their own paradigm rather than guessing.",
        examples: ["Hablaré con ella mañana. — I will speak with her tomorrow.", "¿Podrías ayudarme? — Could you help me? (conditional, softened request)"],
      },
      {
        heading: "The subjunctive mood — first encounter",
        body: "Up to this point, everything has been in the indicative mood — stating facts. The subjunctive is a different mood entirely, used for wishes, doubts, requests, emotions, and reactions to things that aren't presented as objective fact. It's triggered by specific phrases followed by que, and the verb after que shifts into subjunctive conjugation. This is one of the biggest structural differences from English, which barely has a subjunctive left (\"If I were you\" is one of English's last remnants of it).",
        examples: ["Quiero que vengas. — I want you to come. (not \"que vienes\")", "Es importante que estudies. — It's important that you study.", "Ojalá pudiera ir. — I wish I could go."],
      },
      {
        heading: "Giving commands",
        body: "Commands change form depending on who you're talking to and whether the command is affirmative or negative. Informal (tú) affirmative commands often use a shortened, irregular form for common verbs (ven, ve, sal, pon, ten, haz, sé, di) but regular commands for most others. Negative tú commands switch to the subjunctive form entirely — a different word than the affirmative version of the same verb. Formal (usted) commands use the subjunctive form for both affirmative and negative.",
        examples: ["¡Ven aquí! — Come here! (affirmative, irregular)", "¡No vengas tarde! — Don't come late! (negative, subjunctive form)", "Siga recto. — Continue straight. (formal usted command)"],
      },
      {
        heading: "The progressive and perfect tenses",
        body: "The progressive (estar + gerund) describes an action in progress right now: estoy hablando, not a general habit. The present perfect (haber + past participle) describes a past action with present relevance or a recent completed action: he hablado. A handful of past participles are irregular and worth memorizing outright: hecho, dicho, visto, puesto.",
        examples: ["Estoy trabajando ahora mismo. — I'm working right now.", "He visto esa película. — I've seen that movie."],
      },
      {
        heading: "Por vs. para",
        body: "Both translate to \"for\" in English, which is exactly why they're a persistent source of errors. Para generally points forward — toward a purpose, destination, deadline, or recipient. Por generally points backward or through — a cause, a duration, a route, an exchange. A full contrast set with the trickiest overlapping cases (para mí vs. por mí) lives in the Frases tab.",
        examples: ["Es para ti. — It's for you. (recipient — para)", "Gracias por tu ayuda. — Thanks for your help. (reason — por)"],
      },
    ],
  },

  B2: {
    name: "Intermedio alto",
    intro: "Hypothetical thinking, a wider net of subjunctive triggers, and constructions that let you speak with more nuance and less directness.",
    sections: [
      {
        heading: "Hypotheticals with si",
        body: "\"If\" statements split into two grammatically distinct types. Real or likely conditions use si + present indicative, with the result in present or future: Si tengo tiempo, voy. Unreal, unlikely, or contrary-to-fact conditions use si + imperfect subjunctive, with the result in the conditional: Si tuviera tiempo, iría. Mixing the two — using the wrong tense pairing — is one of the clearest markers of a non-native speaker at this level, so getting the pairing automatic is worth deliberate attention.",
        examples: ["Si llueve, no salgo. — If it rains, I'm not going out. (real condition)", "Si fuera rico, viajaría más. — If I were rich, I would travel more. (unreal condition)"],
      },
      {
        heading: "More subjunctive triggers",
        body: "Beyond wishes and requests, the subjunctive extends to doubt (dudo que), denial (no creo que), emotional reaction (me sorprende que), and impersonal expressions of possibility (es posible que). A useful test: if the main clause expresses certainty about a fact, the second verb stays indicative; if it expresses doubt, emotion, desire, or a value judgment, the second verb shifts to subjunctive.",
        examples: ["Creo que tiene razón. — I think he's right. (certainty — indicative)", "No creo que tenga razón. — I don't think he's right. (doubt — subjunctive)"],
      },
      {
        heading: "Ser vs. estar — the meaning-changing adjectives",
        body: "Beyond the basic identity/location split, a set of adjectives genuinely change meaning depending on which verb pairs with them, rather than just shifting emphasis. This isn't a minor stylistic choice — es aburrido and está aburrido describe two completely different situations. The full set of these pairs lives in the Frases tab and is worth deliberate memorization rather than inference.",
        examples: ["Es rico. — He's rich. (ser — wealth)", "Está rico. — It's delicious. (estar — taste)"],
      },
      {
        heading: "Relative clauses",
        body: "Que is the all-purpose relative pronoun (\"that/which/who\"), but quien(es) is used after prepositions when referring to people, lo que refers to a whole idea rather than a specific noun (\"what\" in the sense of \"the thing that\"), and cuyo/cuya (\"whose\") agrees with the noun it possesses, not the possessor.",
        examples: ["El libro que compré. — The book that I bought.", "No sé lo que quiere. — I don't know what he wants.", "La mujer cuyo hijo conocí. — The woman whose son I met."],
      },
      {
        heading: "Passive constructions",
        body: "True passive voice (ser + past participle) exists but is used less often in Spanish than in English — it tends to sound formal or written. The passive se construction is far more common in speech for describing an action without naming who did it, especially for general statements, instructions, and signs.",
        examples: ["El libro fue escrito por ella. — The book was written by her. (formal passive)", "Se habla español aquí. — Spanish is spoken here. (passive se, everyday)", "Se vende. — For sale. (literally: it sells itself)"],
      },
    ],
  },

  C1: {
    name: "Avanzado",
    intro: "Full command of the subjunctive system, and the connectors and register choices that mark genuinely advanced, fluent speech.",
    sections: [
      {
        heading: "The imperfect subjunctive in full",
        body: "Beyond hypotheticals, the imperfect subjunctive (hablara, tuviera, fuera) is required whenever a subjunctive trigger is itself in a past tense — the sequence-of-tenses rule. It's also the standard way to soften requests and suggestions (quisiera rather than quiero), and it appears in reported speech when the original statement used the subjunctive. Spanish has two imperfect subjunctive forms (-ra and -se); the -ra form is overwhelmingly what's spoken, especially across Latin America, while -se skews literary and formal.",
        examples: ["Quería que vinieras. — I wanted you to come. (past-tense trigger → imperfect subjunctive)", "Quisiera un café. — I would like a coffee. (softened request)"],
      },
      {
        heading: "Advanced connectors and formal register",
        body: "Fluent argumentation and formal writing lean on a set of connectors that go well beyond pero and porque — no obstante (nevertheless), en consecuencia (consequently), cabe destacar (it's worth highlighting), a raíz de (as a result of). Using these naturally, rather than defaulting to basic connectors in every register, is one of the clearest signals of advanced fluency. The full set lives in the Frases tab.",
        examples: ["No obstante, decidió continuar. — Nevertheless, he decided to continue.", "Cabe destacar que los resultados variaron. — It's worth noting that the results varied."],
      },
      {
        heading: "Precision verbs",
        body: "At this level, vague verbs (decir, pensar, hacer) start getting replaced by more precise alternatives depending on exactly what's meant — matizar (to add nuance to a statement), argüir (to argue a specific point), refutar (to refute), corroborar (to corroborate). Choosing the precise verb over the generic one is a vocabulary skill, but it's also a grammar-adjacent fluency marker: native speakers reach for precision by default in formal or careful speech.",
        examples: ["Quiero matizar ese punto. — I want to add some nuance to that point.", "Los datos corroboran la teoría. — The data corroborate the theory."],
      },
      {
        heading: "Shifting register",
        body: "Advanced fluency includes knowing when to shift between registers — the vocabulary, connectors, and even grammatical choices (like preferring the passive se or full passive voice in writing, or usted over tú in professional contexts) change depending on who you're speaking to and how formal the situation is. Getting the words right but the register wrong is a distinctly non-native pattern.",
        examples: [],
      },
    ],
  },

  C2: {
    name: "Maestría",
    intro: "Idiomatic and figurative fluency, subtle near-synonym distinctions, and the dialectal awareness that comes with true mastery.",
    sections: [
      {
        heading: "Idiomatic and figurative language",
        body: "True mastery includes fluent use of modismos (idioms) and refranes (proverbs) — expressions whose meaning can't be derived from their literal words. Hacer la vista gorda doesn't mean anything about eyesight; it means to turn a blind eye. Using these naturally, and recognizing them instantly when heard, is a hallmark of near-native comprehension. The full set lives in the Frases tab.",
        examples: ["Ser pan comido. — To be a piece of cake.", "Hacer la vista gorda. — To turn a blind eye."],
      },
      {
        heading: "Near-synonym precision",
        body: "At this level, the challenge isn't learning new grammar structures — it's choosing precisely the right word among several that translate the same way in English but carry different connotations, formality, or emotional weight in Spanish. La lucidez, la perspicacia, and la elocuencia all relate to clear or sharp thinking/speaking, but they're not interchangeable, and a fluent speaker chooses deliberately.",
        examples: ["Habló con elocuencia. — He spoke with eloquence. (skillful, persuasive speech)", "Tiene mucha perspicacia. — She has a lot of insight. (sharp perception/judgment)"],
      },
      {
        heading: "Regional and dialectal awareness",
        body: "Fluent Spanish speakers recognize — and often code-switch between — regional variation without it disrupting comprehension: vosotros vs. ustedes, vale vs. dale, coche vs. carro. None of these are \"incorrect\"; they're regional norms, and true mastery includes recognizing them all even if you only actively produce one. This app's dialect toggle reflects exactly that distinction.",
        examples: [],
      },
      {
        heading: "Literary and archaic forms",
        body: "At the highest level, exposure to literature and formal writing means encountering forms that are rare or absent from everyday speech — the -se imperfect subjunctive in formal writing, the future subjunctive in legal or biblical text (quien fuere), and vosotros forms in older or Peninsular literature regardless of which dialect you actively speak. Recognizing these passively matters more than producing them.",
        examples: [],
      },
    ],
  },
};

const GRAMMAR_LEVELS = Object.keys(GRAMMAR_GUIDE);

/* ------------------------------------------------------------------ */
/* Quick Start Guide content (static — not SRS content)                */
/* ------------------------------------------------------------------ */
const QUICK_START_GUIDE = [
  {
    heading: "1. Start narrow: Vocabulary, level A1 only",
    body: "The app has three content tabs — Vocabulary, Verbs, and Useful Phrases — and six CEFR levels (A1 through C2) you can toggle on or off at any time in the header. When you're just starting out, turn off every level except A1 and stay on the Vocabulary tab. Resist turning more levels on early — a narrow, fully-mastered foundation beats a wide, shaky one.",
  },
  {
    heading: "2. Do a Review session every day",
    body: "Review is the core loop: you'll see a Spanish word or phrase, try to recall it, tap to flip the card, then grade yourself honestly — Again, Hard, Good, or Easy. That grade is what schedules when you'll see the card next. Grading Easy on something you guessed doesn't help you; grading Again on something you actually knew just wastes a rep. A short daily session beats a long occasional one, since spaced repetition depends on consistent spacing, not cramming.",
  },
  {
    heading: "3. Add Verbs and Phrases once Vocabulary feels steady",
    body: "Once A1 Vocabulary stops feeling overwhelming, switch to the Verbs tab and do the same thing — conjugation paradigm cards show all persons at once (yo, tú, él/ella, nosotros...), so grade based on whether you got the whole pattern, not just one form. Then do the same for Useful Phrases. You don't need to finish one tab before starting the next; just don't start all three on day one.",
  },
  {
    heading: "4. Use Match to reinforce, not to learn",
    body: "The Match game only pulls from cards you've already reviewed at least once — it's designed for reinforcement, not first exposure. If it tells you there aren't enough studied cards yet, that's working as intended: go review a few more first.",
  },
  {
    heading: "5. Browse the Deck to see everything, search, or add your own words",
    body: "The Deck tab shows every card in the current tab and active levels, searchable and filterable by category. It's also where you add your own cards — tap + Add, and anything you add is immediately eligible to show up in Review.",
  },
  {
    heading: "6. Check the Grammar tab when something doesn't click",
    body: "Cards drill; they don't explain. If a pattern isn't making sense — why ser and estar both mean \"to be,\" why the subjunctive shows up after certain phrases — the Grammar tab has a plain-language guide organized by the same CEFR levels, with the reasoning cards don't have room for.",
  },
  {
    heading: "7. Turn on the speaker icon and actually use it",
    body: "Every card has a 🔊 button using your browser's built-in text-to-speech. Pronunciation is easy to skip when you're focused on recall, but saying the word out loud — even just once per card — builds the connection between spelling and sound much faster than silent reading does.",
  },
  {
    heading: "8. Raise your levels and daily new-card limit gradually",
    body: "Head to Settings once A1 feels comfortable — turn on A2, and consider raising the daily new-card limit if you have the time for it (it starts at 15/day). There's no single right pace; the point is to raise it deliberately, not all at once out of impatience.",
  },
  {
    heading: "9. Back up your progress",
    body: "Your progress lives only in this browser. Head to Progress → Backup & transfer and download a backup every so often, especially before clearing browser data or switching devices — it's the only way to move your progress or protect it from being lost.",
  },
];

/* ------------------------------------------------------------------ */
/* SM-2 spaced repetition scheduler                                    */
/* ------------------------------------------------------------------ */
const QUALITY = { again: 0, hard: 3, good: 4, easy: 5 };

function scheduleCard(card, grade) {
  const quality = QUALITY[grade];
  let { repetitions, easeFactor, interval } = card;

  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);
    repetitions += 1;
  }

  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  const due = new Date();
  due.setDate(due.getDate() + interval);

  return {
    ...card,
    status: "review",
    repetitions,
    easeFactor: Math.round(easeFactor * 100) / 100,
    interval,
    dueDate: due.toISOString(),
    lastReviewed: new Date().toISOString(),
  };
}

/* ------------------------------------------------------------------ */
/* Date / misc helpers                                                 */
/* ------------------------------------------------------------------ */
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
function daysUntil(dueDateStr) {
  if (!dueDateStr) return null;
  const ms = new Date(dueDateStr).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0);
  return Math.round(ms / 86400000);
}
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ------------------------------------------------------------------ */
/* Pronunciation (browser Web Speech API — free, no account needed)    */
/* ------------------------------------------------------------------ */
function speakableText(text) {
  // Strip trailing annotations like "(yo)" from conjugation-drill fronts
  // so the speaker doesn't read the parenthesis aloud.
  return text.replace(/\s*\([^)]*\)\s*$/, "").trim();
}
function speak(text) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(speakableText(text));
    utter.lang = "es-ES";
    utter.rate = 0.88;
    const voices = window.speechSynthesis.getVoices();
    const esVoice = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith("es"));
    if (esVoice) utter.voice = esVoice;
    window.speechSynthesis.speak(utter);
  } catch (e) {
    // speech synthesis unsupported or blocked — fail silently
  }
}

const DEFAULT_STATS = {
  currentStreak: 0,
  lastStudyDate: null,
  totalReviews: 0,
  newIntroducedDate: null,
  newIntroducedCount: 0,
  dailyNewLimit: 15,
  activeLevels: ["A1"],
  activeDialects: ["latam"],
};

/* ------------------------------------------------------------------ */
/* Main app                                                             */
/* ------------------------------------------------------------------ */
export default function App() {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [cards, setCards] = useState([]);
  const [stats, setStats] = useState(DEFAULT_STATS);

  const [contentTab, setContentTab] = useState("vocabulario");
  const [modeTab, setModeTab] = useState("srs");
  const [panel, setPanel] = useState("study"); // "study" | "progress" | "grammar"
  const [grammarLevel, setGrammarLevel] = useState("A1");

  const [sessionQueue, setSessionQueue] = useState(null);
  const [sessionIndex, setSessionIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionDone, setSessionDone] = useState(0);

  const [showAdd, setShowAdd] = useState(false);
  const [addFront, setAddFront] = useState("");
  const [addBack, setAddBack] = useState("");
  const [addCategory, setAddCategory] = useState("");
  const [addLevel, setAddLevel] = useState("A1");
  const [addFeedback, setAddFeedback] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todas");
  const [editingId, setEditingId] = useState(null);
  const [editFront, setEditFront] = useState("");
  const [editBack, setEditBack] = useState("");

  const [importMessage, setImportMessage] = useState(null);
  const importInputRef = useRef(null);

  const cardsRef = useRef(cards);
  cardsRef.current = cards;

  /* ---- load from persistent storage on mount ---- */
  useEffect(() => {
    let cancelled = false;
    async function load() {
      let loadedCards = null;
      let loadedStats = null;
      try {
        const res = await window.storage.get("srs-cards", false);
        if (res && res.value) loadedCards = JSON.parse(res.value);
      } catch (e) {
        loadedCards = null;
      }
      try {
        const res = await window.storage.get("srs-stats", false);
        if (res && res.value) loadedStats = JSON.parse(res.value);
      } catch (e) {
        loadedStats = null;
      }
      if (cancelled) return;

      let finalCards = loadedCards && loadedCards.length ? loadedCards : buildSeedDeck();
      finalCards = finalCards.map((c) => {
        let next = c;
        if (!next.contentType) next = { ...next, contentType: contentTypeOf(next.category) };
        if (!next.dialect) next = { ...next, dialect: "neutral" };
        if (next.example === undefined) next = { ...next, example: null };
        if (next.deletedAt === undefined) next = { ...next, deletedAt: null };
        return next;
      });

      let finalStats = loadedStats ? { ...DEFAULT_STATS, ...loadedStats } : DEFAULT_STATS;
      if (!finalStats.activeLevels || !finalStats.activeLevels.length) {
        finalStats.activeLevels =
          loadedStats && loadedStats.studyLevel ? [loadedStats.studyLevel] : ["A1"];
      }
      if (!finalStats.activeDialects || !finalStats.activeDialects.length) {
        finalStats.activeDialects = ["latam"];
      }

      setCards(finalCards);
      setStats(finalStats);
      setAddLevel(finalStats.activeLevels[0] || "A1");
      setLoading(false);

      if (!loadedCards) {
        try {
          await window.storage.set("srs-cards", JSON.stringify(finalCards), false);
        } catch (e) {
          setLoadError(true);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const persistCards = useCallback(async (next) => {
    setCards(next);
    try {
      await window.storage.set("srs-cards", JSON.stringify(next), false);
    } catch (e) {
      setLoadError(true);
    }
  }, []);

  const persistStats = useCallback(async (next) => {
    setStats(next);
    try {
      await window.storage.set("srs-stats", JSON.stringify(next), false);
    } catch (e) {
      setLoadError(true);
    }
  }, []);

  /* ---- filters ---- */
  const inScope = useCallback(
    (c) =>
      !c.deletedAt &&
      c.contentType === contentTab &&
      stats.activeLevels.includes(c.level) &&
      (c.dialect === "neutral" || !c.dialect || stats.activeDialects.includes(c.dialect)),
    [contentTab, stats.activeLevels, stats.activeDialects]
  );

  const dueReviewCards = cards.filter(
    (c) => c.status === "review" && c.dueDate && new Date(c.dueDate) <= new Date() && inScope(c)
  );
  const newCardsAll = cards.filter((c) => c.status === "new" && inScope(c));
  const todaysNewAvailable =
    stats.newIntroducedDate === todayStr()
      ? Math.max(0, stats.dailyNewLimit - stats.newIntroducedCount)
      : stats.dailyNewLimit;
  const newCardsForToday = newCardsAll.slice(0, todaysNewAvailable);
  const dueTotal = dueReviewCards.length + newCardsForToday.length;

  const scopedCards = cards.filter(inScope);
  const categories = ["Todas", ...Array.from(new Set(scopedCards.map((c) => c.category))).sort()];
  const studiedScopedCards = scopedCards.filter((c) => c.status === "review");

  function toggleLevel(code) {
    const has = stats.activeLevels.includes(code);
    let next;
    if (has) {
      if (stats.activeLevels.length === 1) return;
      next = stats.activeLevels.filter((l) => l !== code);
    } else {
      next = [...stats.activeLevels, code];
    }
    persistStats({ ...stats, activeLevels: next });
  }

  function toggleDialect(code) {
    const has = stats.activeDialects.includes(code);
    let next;
    if (has) {
      if (stats.activeDialects.length === 1) return;
      next = stats.activeDialects.filter((d) => d !== code);
    } else {
      next = [...stats.activeDialects, code];
    }
    persistStats({ ...stats, activeDialects: next });
  }

  function switchContentTab(code) {
    setContentTab(code);
    endSession();
    setCategoryFilter("Todas");
    setSearch("");
    setShowAdd(false);
  }

  /* ---- session control ---- */
  function startReview() {
    const queue = shuffle([...dueReviewCards, ...newCardsForToday]).map((c) => c.id);
    setSessionQueue(queue);
    setSessionIndex(0);
    setSessionDone(0);
    setFlipped(false);
  }

  function endSession() {
    setSessionQueue(null);
    setSessionIndex(0);
    setFlipped(false);
  }

  const currentCardId = sessionQueue ? sessionQueue[sessionIndex] : null;
  const currentCard = currentCardId ? cards.find((c) => c.id === currentCardId) : null;

  function recordStudyDay(prevStats) {
    const today = todayStr();
    if (prevStats.lastStudyDate === today) return prevStats;
    const yStr = yesterdayStr();
    const streak = prevStats.lastStudyDate === yStr ? prevStats.currentStreak + 1 : 1;
    return { ...prevStats, currentStreak: streak, lastStudyDate: today };
  }

  function grade(g) {
    if (!currentCard) return;
    const wasNew = currentCard.status === "new";
    const updatedCard = scheduleCard(currentCard, g);
    const nextCards = cardsRef.current.map((c) => (c.id === updatedCard.id ? updatedCard : c));

    let nextStats = recordStudyDay(stats);
    nextStats = { ...nextStats, totalReviews: nextStats.totalReviews + 1 };
    if (wasNew) {
      const today = todayStr();
      if (nextStats.newIntroducedDate === today) {
        nextStats.newIntroducedCount += 1;
      } else {
        nextStats.newIntroducedDate = today;
        nextStats.newIntroducedCount = 1;
      }
    }

    persistCards(nextCards);
    persistStats(nextStats);
    setSessionDone((n) => n + 1);
    setFlipped(false);

    let newQueue = sessionQueue;
    if (g === "again") {
      newQueue = [...sessionQueue];
      const insertAt = Math.min(newQueue.length, sessionIndex + 3);
      newQueue.splice(insertAt, 0, currentCard.id);
    }

    if (sessionIndex + 1 >= newQueue.length) {
      setSessionQueue(null);
      setSessionIndex(0);
    } else {
      setSessionQueue(newQueue);
      setSessionIndex(sessionIndex + 1);
    }
  }

  /* ---- keyboard shortcuts during review ---- */
  useEffect(() => {
    function onKey(e) {
      if (modeTab !== "srs" || !currentCard) return;
      if (e.code === "Space") {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (flipped) {
        if (e.key === "1") grade("again");
        else if (e.key === "2") grade("hard");
        else if (e.key === "3") grade("good");
        else if (e.key === "4") grade("easy");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  /* ---- add card ---- */
  function submitAdd(e) {
    e.preventDefault();
    if (!addFront.trim() || !addBack.trim()) return;
    const newCard = {
      id: `custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      front: addFront.trim(),
      back: addBack.trim(),
      category: addCategory.trim() || CONTENT_TYPES.find((t) => t.code === contentTab).label,
      level: addLevel,
      contentType: contentTab,
      status: "new",
      repetitions: 0,
      easeFactor: 2.5,
      interval: 0,
      dueDate: null,
      lastReviewed: null,
      createdAt: new Date().toISOString(),
    };
    persistCards([newCard, ...cardsRef.current]);
    setAddFront("");
    setAddBack("");
    setAddFeedback(`Added: "${newCard.front}"`);
    setTimeout(() => setAddFeedback(""), 2200);
  }

  function deleteCard(id) {
    const card = cardsRef.current.find((c) => c.id === id);
    if (!card) return;
    if (!window.confirm(`Delete "${card.front}"? You can restore it later from Trash.`)) return;

    persistCards(
      cardsRef.current.map((c) => (c.id === id ? { ...c, deletedAt: new Date().toISOString() } : c))
    );
    if (sessionQueue) {
      setSessionQueue(sessionQueue.filter((qid) => qid !== id));
    }
  }

  function restoreCard(id) {
    persistCards(cardsRef.current.map((c) => (c.id === id ? { ...c, deletedAt: null } : c)));
  }

  function purgeCard(id) {
    const card = cardsRef.current.find((c) => c.id === id);
    if (!card) return;
    if (!window.confirm(`Permanently delete "${card.front}"? This can't be undone.`)) return;
    persistCards(cardsRef.current.filter((c) => c.id !== id));
  }

  function emptyTrash() {
    const trashCount = cardsRef.current.filter((c) => c.deletedAt).length;
    if (trashCount === 0) return;
    if (!window.confirm(`Permanently delete all ${trashCount} card(s) in Trash? This can't be undone.`))
      return;
    persistCards(cardsRef.current.filter((c) => !c.deletedAt));
  }

  function startEdit(c) {
    setEditingId(c.id);
    setEditFront(c.front);
    setEditBack(c.back);
  }
  function saveEdit(id) {
    persistCards(
      cardsRef.current.map((c) =>
        c.id === id ? { ...c, front: editFront.trim(), back: editBack.trim() } : c
      )
    );
    setEditingId(null);
  }

  async function resetProgress() {
    if (
      !window.confirm(
        "Reset all progress? This clears every card's schedule and returns to the starter deck. Custom cards you added will be lost."
      )
    )
      return;
    const fresh = buildSeedDeck();
    await persistCards(fresh);
    await persistStats(DEFAULT_STATS);
    endSession();
  }

  function setDailyLimit(n) {
    persistStats({ ...stats, dailyNewLimit: n });
  }

  /* ---- backup: export / import ---- */
  function exportBackup() {
    try {
      const payload = {
        app: "cuaderno",
        backupVersion: 1,
        exportedAt: new Date().toISOString(),
        cards: cardsRef.current,
        stats,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cuaderno-backup-${todayStr()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setImportMessage({ ok: true, text: "Backup downloaded." });
    } catch (e) {
      setImportMessage({ ok: false, text: "Couldn't create the backup file. Try again." });
    }
  }

  function handleImportFile(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      let parsed;
      try {
        parsed = JSON.parse(reader.result);
      } catch (err) {
        setImportMessage({ ok: false, text: "That file isn't valid JSON — import cancelled." });
        return;
      }

      const validCards =
        Array.isArray(parsed.cards) &&
        parsed.cards.length > 0 &&
        parsed.cards.every((c) => c && typeof c.id === "string" && typeof c.front === "string" && typeof c.back === "string");

      if (!validCards) {
        setImportMessage({ ok: false, text: "That file doesn't look like a Cuaderno backup — import cancelled." });
        return;
      }

      const cardCount = parsed.cards.length;
      if (
        !window.confirm(
          `Import ${cardCount} cards and replace your current progress on this device? This can't be undone unless you have another backup.`
        )
      ) {
        return;
      }

      const importedStats = parsed.stats && typeof parsed.stats === "object"
        ? { ...DEFAULT_STATS, ...parsed.stats }
        : DEFAULT_STATS;
      if (!importedStats.activeLevels || !importedStats.activeLevels.length) {
        importedStats.activeLevels = ["A1"];
      }

      // Backfill contentType for any imported card missing it
      const importedCards = parsed.cards.map((c) =>
        c.contentType ? c : { ...c, contentType: contentTypeOf(c.category) }
      );

      await persistCards(importedCards);
      await persistStats(importedStats);
      endSession();
      setImportMessage({ ok: true, text: `Imported ${cardCount} cards successfully.` });
    };
    reader.onerror = () => {
      setImportMessage({ ok: false, text: "Couldn't read that file — import cancelled." });
    };
    reader.readAsText(file);
  }

  /* ---- browse filtering ---- */
  const filteredCards = scopedCards
    .filter((c) => categoryFilter === "Todas" || c.category === categoryFilter)
    .filter(
      (c) =>
        !search.trim() ||
        c.front.toLowerCase().includes(search.toLowerCase()) ||
        c.back.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.front.localeCompare(b.front));

  const masteredCount = cards.filter((c) => !c.deletedAt && c.interval >= 21).length;
  const trashCount = cards.filter((c) => c.deletedAt).length;

  /* ================================================================ */
  if (loading) {
    return (
      <div className="cuaderno-root flex items-center justify-center" style={{ minHeight: 420 }}>
        <GlobalStyle />
        <div className="font-hand text-2xl" style={{ color: "var(--ink-soft)" }}>
          opening the notebook...
        </div>
      </div>
    );
  }

  const contentMeta = CONTENT_TYPES.find((t) => t.code === contentTab);

  return (
    <div className="cuaderno-root">
      <GlobalStyle />
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
          <div>
            <div className="font-hand text-sm tracking-wide" style={{ color: "var(--mustard)" }}>
              ¡Tú puedes!
            </div>
            <h1 className="app-title font-display text-3xl sm:text-4xl font-semibold">
              Cuaderno
            </h1>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="font-hand text-2xl leading-none" style={{ color: "var(--red-pen)" }}>
              {stats.currentStreak > 0 ? `streak: ${stats.currentStreak} 🔥` : "no streak yet"}
            </div>
            {panel === "study" ? (
              <div className="flex flex-wrap justify-end gap-2">
                <button className="ink-btn ink-btn-ghost ink-btn-small" onClick={() => setPanel("guide")}>
                  Quick Start
                </button>
                <button className="ink-btn ink-btn-ghost ink-btn-small" onClick={() => setPanel("grammar")}>
                  Grammar
                </button>
                <button className="ink-btn ink-btn-ghost ink-btn-small" onClick={() => setPanel("progress")}>
                  Progress
                </button>
                <button className="ink-btn ink-btn-ghost ink-btn-small" onClick={() => setPanel("settings")}>
                  Settings
                </button>
              </div>
            ) : (
              <button className="ink-btn ink-btn-ghost ink-btn-small" onClick={() => setPanel("study")}>
                ← Back
              </button>
            )}
          </div>
        </div>
        <div className="tile-strip mb-6" />

        {/* Level toggle — always visible, filters every mode instantly */}
        <div className="flex items-center flex-wrap gap-1.5 mb-3">
          <span className="text-xs mr-1" style={{ color: "var(--ink-soft)" }}>
            Levels:
          </span>
          {LEVELS.map((l) => (
            <button
              key={l.code}
              className="level-pill"
              data-active={stats.activeLevels.includes(l.code)}
              onClick={() => toggleLevel(l.code)}
              title={l.blurb}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Dialect toggle — Spain-specific words only appear when Spain is active */}
        <div className="flex items-center flex-wrap gap-1.5 mb-6">
          <span className="text-xs mr-1" style={{ color: "var(--ink-soft)" }}>
            Dialect:
          </span>
          {DIALECTS.map((d) => (
            <button
              key={d.code}
              className="level-pill"
              data-active={stats.activeDialects.includes(d.code)}
              onClick={() => toggleDialect(d.code)}
              title={d.blurb}
            >
              {d.label}
            </button>
          ))}
        </div>

        {loadError && (
          <div className="mb-4 px-3 py-2 rounded text-sm font-medium" style={{ background: "#F8D6CE", color: "var(--red-pen)" }}>
            Progress couldn't be saved just now — your data may not persist. Try again in a moment.
          </div>
        )}

        {panel === "progress" ? (
          <ProgressView
            cards={cards.filter((c) => !c.deletedAt)}
            stats={stats}
            masteredCount={masteredCount}
            onExport={exportBackup}
            onImportClick={() => importInputRef.current && importInputRef.current.click()}
            onImportFile={handleImportFile}
            importInputRef={importInputRef}
            importMessage={importMessage}
          />
        ) : panel === "grammar" ? (
          <GrammarView level={grammarLevel} setLevel={setGrammarLevel} />
        ) : panel === "settings" ? (
          <SettingsView
            stats={stats}
            onToggleLevel={toggleLevel}
            onToggleDialect={toggleDialect}
            onSetDailyLimit={setDailyLimit}
            onReset={resetProgress}
          />
        ) : panel === "guide" ? (
          <GuideView />
        ) : panel === "trash" ? (
          <TrashView cards={cards} onRestore={restoreCard} onPurge={purgeCard} onEmptyTrash={emptyTrash} />
        ) : (
          <>
            {/* Content-type primary tabs */}
            <div className="flex gap-1 mb-2 border-b" style={{ borderColor: "var(--grid-line)" }}>
              {CONTENT_TYPES.map((t) => (
                <button
                  key={t.code}
                  onClick={() => switchContentTab(t.code)}
                  className="tab-btn font-display text-sm sm:text-base"
                  data-active={contentTab === t.code}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Mode sub-tabs */}
            <div className="flex gap-2 mb-6">
              {MODES.map((m) => (
                <button
                  key={m.code}
                  onClick={() => {
                    setModeTab(m.code);
                    endSession();
                  }}
                  className="subtab-btn"
                  data-active={modeTab === m.code}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {modeTab === "srs" && (
              <div>
                {!sessionQueue && (
                  <div className="notecard text-center py-10 px-6">
                    {dueTotal === 0 ? (
                      <>
                        <div className="font-display text-2xl mb-2">All caught up!</div>
                        <p style={{ color: "var(--ink-soft)" }} className="mb-1">
                          No cards due in {contentMeta.label.toLowerCase()} for your active levels.
                        </p>
                        <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
                          Try turning on another level above, or add cards from the Deck.
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="font-display text-2xl mb-1">
                          {dueTotal} {dueTotal === 1 ? "card ready" : "cards ready"}
                        </div>
                        <p className="text-sm mb-6" style={{ color: "var(--ink-soft)" }}>
                          {dueReviewCards.length} to review · {newCardsForToday.length} new
                        </p>
                        <button className="ink-btn ink-btn-primary" onClick={startReview}>
                          Start review
                        </button>
                      </>
                    )}
                  </div>
                )}

                {sessionQueue && currentCard && (
                  <ReviewCard
                    card={currentCard}
                    flipped={flipped}
                    onFlip={() => setFlipped((f) => !f)}
                    onGrade={grade}
                    remaining={sessionQueue.length - sessionIndex}
                    done={sessionDone}
                    onExit={endSession}
                  />
                )}

                {sessionQueue && !currentCard && (
                  <div className="notecard text-center py-10 px-6">
                    <div className="font-display text-2xl mb-2">Session complete!</div>
                    <p style={{ color: "var(--ink-soft)" }}>You reviewed {sessionDone} cards.</p>
                  </div>
                )}
              </div>
            )}

            {modeTab === "browse" && (
              <BrowseView
                contentMeta={contentMeta}
                filteredCards={filteredCards}
                categories={categories}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                search={search}
                setSearch={setSearch}
                editingId={editingId}
                editFront={editFront}
                editBack={editBack}
                setEditFront={setEditFront}
                setEditBack={setEditBack}
                startEdit={startEdit}
                saveEdit={saveEdit}
                setEditingId={setEditingId}
                deleteCard={deleteCard}
                showAdd={showAdd}
                setShowAdd={setShowAdd}
                addFront={addFront}
                addBack={addBack}
                addCategory={addCategory}
                addLevel={addLevel}
                setAddFront={setAddFront}
                setAddBack={setAddBack}
                setAddCategory={setAddCategory}
                setAddLevel={setAddLevel}
                submitAdd={submitAdd}
                addFeedback={addFeedback}
                trashCount={trashCount}
                onOpenTrash={() => setPanel("trash")}
              />
            )}

            {modeTab === "match" && <MatchGame pool={studiedScopedCards} contentLabel={contentMeta.label} />}
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Review (SRS) card                                                    */
/* ------------------------------------------------------------------ */
function ReviewCard({ card, flipped, onFlip, onGrade, remaining, done, onExit }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3 text-sm" style={{ color: "var(--ink-soft)" }}>
        <button onClick={onExit} className="underline">
          Exit
        </button>
        <span>
          {done} done · {remaining} left
        </span>
      </div>

      <div className="flip-wrap" onClick={onFlip}>
        <div className={`flip-card${flipped ? " is-flipped" : ""}`}>
          <div className="flip-face flip-front">
            <div className="text-xs font-hand text-lg mb-2" style={{ color: "var(--mustard)" }}>
              {categoryLabel(card.category)} · {card.level}
            </div>
            <div className="flex items-center gap-2">
              <div className="font-display text-3xl sm:text-4xl">{card.front}</div>
              <SpeakButton text={card.front} />
            </div>
            <div className="text-xs mt-6" style={{ color: "var(--ink-soft)" }}>
              tap to flip
            </div>
          </div>
          <div className="flip-face flip-back">
            <div className="text-xs font-hand text-lg mb-2" style={{ color: "var(--mustard)" }}>
              {categoryLabel(card.category)} · {card.level}
            </div>
            <div className="font-display text-3xl sm:text-4xl">{card.back}</div>
            <div className="flex items-center gap-2 mt-2">
              <div className="text-sm" style={{ color: "var(--ink-soft)" }}>
                {card.front}
              </div>
              <SpeakButton text={card.front} size="small" />
            </div>
            {card.example && (
              <div className="example-block">
                {card.example.split(" — ").map((part, i) => (
                  <div key={i} className={i === 0 ? "example-es" : "example-en"}>
                    {part}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {!flipped && (
        <div className="text-center mt-4">
          <button className="ink-btn ink-btn-primary" onClick={onFlip}>
            Show answer
          </button>
        </div>
      )}

      {flipped && (
        <div className="grade-row mt-5">
          <button className="grade-btn" data-kind="again" onClick={() => onGrade("again")}>
            <span className="grade-mark">✗</span>
            <span>Again</span>
            <span className="grade-key">1</span>
          </button>
          <button className="grade-btn" data-kind="hard" onClick={() => onGrade("hard")}>
            <span className="grade-mark">~</span>
            <span>Hard</span>
            <span className="grade-key">2</span>
          </button>
          <button className="grade-btn" data-kind="good" onClick={() => onGrade("good")}>
            <span className="grade-mark">✓</span>
            <span>Good</span>
            <span className="grade-key">3</span>
          </button>
          <button className="grade-btn" data-kind="easy" onClick={() => onGrade("easy")}>
            <span className="grade-mark">✓✓</span>
            <span>Easy</span>
            <span className="grade-key">4</span>
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Browse (Mazo)                                                        */
/* ------------------------------------------------------------------ */
function BrowseView(props) {
  const {
    contentMeta, filteredCards, categories, categoryFilter, setCategoryFilter,
    search, setSearch, editingId, editFront, editBack, setEditFront, setEditBack,
    startEdit, saveEdit, setEditingId, deleteCard,
    showAdd, setShowAdd, addFront, addBack, addCategory, addLevel,
    setAddFront, setAddBack, setAddCategory, setAddLevel, submitAdd, addFeedback,
    trashCount, onOpenTrash,
  } = props;

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <input
          className="ink-input flex-1"
          placeholder={`Search ${contentMeta.label.toLowerCase()}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="ink-input sm:w-48" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "Todas" ? "All" : categoryLabel(c)}
            </option>
          ))}
        </select>
        <button className="ink-btn ink-btn-small" onClick={() => setShowAdd((s) => !s)}>
          {showAdd ? "Close" : "+ Add"}
        </button>
        {trashCount > 0 && (
          <button className="ink-btn ink-btn-small ink-btn-ghost" onClick={onOpenTrash}>
            Trash ({trashCount})
          </button>
        )}
      </div>

      {showAdd && (
        <form onSubmit={submitAdd} className="notecard px-5 py-4 mb-4 flex flex-col gap-3">
          <div className="font-display text-base">Add to {contentMeta.label}</div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input className="ink-input flex-1" placeholder="Spanish" value={addFront} onChange={(e) => setAddFront(e.target.value)} />
            <input className="ink-input flex-1" placeholder="English" value={addBack} onChange={(e) => setAddBack(e.target.value)} />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              className="ink-input flex-1"
              placeholder="Category (optional)"
              value={addCategory}
              onChange={(e) => setAddCategory(e.target.value)}
            />
            <select className="ink-input sm:w-40" value={addLevel} onChange={(e) => setAddLevel(e.target.value)}>
              {LEVELS.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label} · {l.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="ink-btn ink-btn-primary self-start">
            Add card
          </button>
          {addFeedback && (
            <div className="font-hand text-lg" style={{ color: "var(--green-check)" }}>
              {addFeedback}
            </div>
          )}
        </form>
      )}

      <div className="text-sm mb-3" style={{ color: "var(--ink-soft)" }}>
        {filteredCards.length} {filteredCards.length === 1 ? "card" : "cards"}
      </div>
      <div className="flex flex-col gap-2">
        {filteredCards.map((c) => (
          <div key={c.id} className="browse-row">
            {editingId === c.id ? (
              <div className="flex flex-col sm:flex-row gap-2 flex-1">
                <input className="ink-input flex-1" value={editFront} onChange={(e) => setEditFront(e.target.value)} />
                <input className="ink-input flex-1" value={editBack} onChange={(e) => setEditBack(e.target.value)} />
                <div className="flex gap-2">
                  <button className="ink-btn ink-btn-small" onClick={() => saveEdit(c.id)}>
                    Save
                  </button>
                  <button className="ink-btn ink-btn-small ink-btn-ghost" onClick={() => setEditingId(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <div className="font-display text-base truncate">{c.front}</div>
                    <SpeakButton text={c.front} size="small" />
                  </div>
                  <div className="text-sm truncate" style={{ color: "var(--ink-soft)" }}>
                    {c.back}
                  </div>
                </div>
                <div className="hidden sm:block text-xs font-hand text-lg px-2" style={{ color: "var(--mustard)" }}>
                  {categoryLabel(c.category)}
                </div>
                <span className="badge" style={{ background: "#E2EAF0", color: "var(--ink-soft)" }}>
                  {c.level}
                </span>
                <StatusBadge card={c} />
                <div className="flex gap-1 ml-2 shrink-0">
                  <button className="icon-btn" title="Edit" onClick={() => startEdit(c)}>
                    ✎
                  </button>
                  <button className="icon-btn icon-btn-danger" title="Delete" onClick={() => deleteCard(c.id)}>
                    <TrashIcon />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        {filteredCards.length === 0 && (
          <div className="text-sm py-6 text-center" style={{ color: "var(--ink-soft)" }}>
            No cards found for your active levels.
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Matching game                                                        */
/* ------------------------------------------------------------------ */
function MatchGame({ pool, contentLabel }) {
  const [round, setRound] = useState(null);
  const [leftOrder, setLeftOrder] = useState([]);
  const [rightOrder, setRightOrder] = useState([]);
  const [matched, setMatched] = useState([]);
  const [selLeft, setSelLeft] = useState(null);
  const [selRight, setSelRight] = useState(null);
  const [wrong, setWrong] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const timeoutRef = useRef(null);

  const newRound = useCallback(() => {
    const n = Math.min(8, pool.length);
    const chosen = shuffle(pool).slice(0, n);
    setRound(chosen);
    setLeftOrder(shuffle(chosen.map((c) => c.id)));
    setRightOrder(shuffle(chosen.map((c) => c.id)));
    setMatched([]);
    setSelLeft(null);
    setSelRight(null);
    setWrong(null);
    setMistakes(0);
  }, [pool]);

  useEffect(() => {
    newRound();
    return () => clearTimeout(timeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool.length]);

  if (pool.length < 4) {
    return (
      <div className="notecard text-center py-10 px-6">
        <div className="font-display text-2xl mb-2">Not enough studied cards yet</div>
        <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
          Matching only uses cards you've already reviewed at least once, so you're only practicing
          what you should already know. Study a few more {contentLabel.toLowerCase()} cards in Review
          first, or turn on another level above (minimum 4).
        </p>
      </div>
    );
  }
  if (!round) return null;

  function pick(side, id) {
    if (matched.includes(id) || wrong) return;
    if (side === "left") {
      if (selLeft === id) {
        setSelLeft(null);
        return;
      }
      setSelLeft(id);
      if (selRight) checkPair(id, selRight);
    } else {
      if (selRight === id) {
        setSelRight(null);
        return;
      }
      setSelRight(id);
      if (selLeft) checkPair(selLeft, id);
    }
  }

  function checkPair(leftId, rightId) {
    if (leftId === rightId) {
      setMatched((m) => [...m, leftId]);
      setSelLeft(null);
      setSelRight(null);
    } else {
      setWrong({ leftId, rightId });
      setMistakes((m) => m + 1);
      timeoutRef.current = setTimeout(() => {
        setWrong(null);
        setSelLeft(null);
        setSelRight(null);
      }, 550);
    }
  }

  const complete = matched.length === round.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-3 text-sm" style={{ color: "var(--ink-soft)" }}>
        <span>{contentLabel} · match Spanish to English</span>
        <span>
          {mistakes} mistake{mistakes === 1 ? "" : "s"}
        </span>
      </div>

      {complete ? (
        <div className="notecard text-center py-10 px-6">
          <div className="font-display text-2xl mb-2">Complete!</div>
          <p className="mb-4 text-sm" style={{ color: "var(--ink-soft)" }}>
            {round.length} pairs · {mistakes} mistake{mistakes === 1 ? "" : "s"}
          </p>
          <button className="ink-btn ink-btn-primary" onClick={newRound}>
            Play again
          </button>
        </div>
      ) : (
        <div className="match-grid">
          <div className="flex flex-col gap-2">
            {leftOrder.map((id) => {
              const card = round.find((c) => c.id === id);
              const isMatched = matched.includes(id);
              const isSel = selLeft === id;
              const isWrong = wrong && wrong.leftId === id;
              return (
                <div
                  key={id}
                  role="button"
                  tabIndex={isMatched ? -1 : 0}
                  className="match-tile flex items-center justify-between gap-2"
                  data-matched={isMatched}
                  data-selected={isSel}
                  data-wrong={isWrong}
                  onClick={() => !isMatched && pick("left", id)}
                  onKeyDown={(e) => {
                    if (!isMatched && (e.key === "Enter" || e.key === " ")) pick("left", id);
                  }}
                >
                  <span>{card.front}</span>
                  {!isMatched && <SpeakButton text={card.front} size="small" />}
                </div>
              );
            })}
          </div>
          <div className="flex flex-col gap-2">
            {rightOrder.map((id) => {
              const card = round.find((c) => c.id === id);
              const isMatched = matched.includes(id);
              const isSel = selRight === id;
              const isWrong = wrong && wrong.rightId === id;
              return (
                <button
                  key={id}
                  className="match-tile"
                  data-matched={isMatched}
                  data-selected={isSel}
                  data-wrong={isWrong}
                  disabled={isMatched}
                  onClick={() => pick("right", id)}
                >
                  {card.back}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Progress view                                                        */
/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/* Grammar reference view (not SRS — reference article content)         */
/* ------------------------------------------------------------------ */
function GrammarView({ level, setLevel }) {
  const guide = GRAMMAR_GUIDE[level];
  return (
    <div>
      <div className="flex gap-1 mb-2 flex-wrap" style={{ borderBottom: "1px solid var(--grid-line)" }}>
        {GRAMMAR_LEVELS.map((code) => (
          <button
            key={code}
            onClick={() => setLevel(code)}
            className="tab-btn font-display text-sm sm:text-base"
            data-active={level === code}
          >
            {code}
          </button>
        ))}
      </div>

      <div className="mb-5 mt-4">
        <div className="font-hand text-xl" style={{ color: "var(--mustard)" }}>
          {guide.name}
        </div>
        <p className="text-sm mt-1" style={{ color: "var(--ink-soft)" }}>
          {guide.intro}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {guide.sections.map((section, i) => (
          <div key={i} className="notecard px-5 py-4">
            <div className="font-display text-lg mb-2">{section.heading}</div>
            <p className="text-sm leading-relaxed mb-2" style={{ color: "var(--ink)" }}>
              {section.body}
            </p>
            {section.examples && section.examples.length > 0 && (
              <div className="grammar-examples">
                {section.examples.map((ex, j) => (
                  <div key={j} className="grammar-example-line">
                    {ex}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Quick Start Guide view                                               */
/* ------------------------------------------------------------------ */
function GuideView() {
  return (
    <div>
      <div className="mb-5">
        <div className="font-hand text-xl" style={{ color: "var(--mustard)" }}>
          new here?
        </div>
        <p className="text-sm mt-1" style={{ color: "var(--ink-soft)" }}>
          The short version: start narrow, review daily, widen gradually. Here's the full path.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        {QUICK_START_GUIDE.map((step, i) => (
          <div key={i} className="notecard px-5 py-4">
            <div className="font-display text-lg mb-2">{step.heading}</div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--ink)" }}>
              {step.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Settings view                                                        */
/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/* Trash view — recover or permanently delete removed cards             */
/* ------------------------------------------------------------------ */
function TrashView({ cards, onRestore, onPurge, onEmptyTrash }) {
  const trashed = cards
    .filter((c) => c.deletedAt)
    .sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
          Deleted cards stay here until you restore or permanently delete them — they're never
          included in Review, the Deck, or Match while here.
        </p>
        {trashed.length > 0 && (
          <button
            className="ink-btn ink-btn-ghost ink-btn-small shrink-0 ml-3"
            style={{ borderColor: "var(--red-pen)", color: "var(--red-pen)" }}
            onClick={onEmptyTrash}
          >
            Empty trash
          </button>
        )}
      </div>

      {trashed.length === 0 ? (
        <div className="notecard text-center py-10 px-6">
          <div className="font-display text-2xl mb-2">Trash is empty</div>
          <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
            Cards you delete from the Deck will show up here first.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {trashed.map((c) => (
            <div key={c.id} className="browse-row">
              <div className="flex-1 min-w-0">
                <div className="font-display text-base truncate">{c.front}</div>
                <div className="text-sm truncate" style={{ color: "var(--ink-soft)" }}>
                  {c.back}
                </div>
              </div>
              <span className="badge" style={{ background: "#E2EAF0", color: "var(--ink-soft)" }}>
                {c.level}
              </span>
              <div className="flex gap-2 ml-2 shrink-0">
                <button className="ink-btn ink-btn-small" onClick={() => onRestore(c.id)}>
                  Restore
                </button>
                <button
                  className="ink-btn ink-btn-small ink-btn-ghost"
                  style={{ borderColor: "var(--red-pen)", color: "var(--red-pen)" }}
                  onClick={() => onPurge(c.id)}
                >
                  Delete forever
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SettingsView({ stats, onToggleLevel, onToggleDialect, onSetDailyLimit, onReset }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="notecard px-6 py-5">
        <div className="font-display text-lg mb-1">Difficulty levels</div>
        <p className="text-sm mb-3" style={{ color: "var(--ink-soft)" }}>
          Only active levels introduce new cards. Toggle any combination on or off, any time.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {LEVELS.map((l) => (
            <button
              key={l.code}
              className="level-pill"
              data-active={stats.activeLevels.includes(l.code)}
              onClick={() => onToggleLevel(l.code)}
              title={l.blurb}
            >
              {l.label} <span className="hidden sm:inline">· {l.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="notecard px-6 py-5">
        <div className="font-display text-lg mb-1">Dialect</div>
        <p className="text-sm mb-3" style={{ color: "var(--ink-soft)" }}>
          Spain-specific words (vosotros, vale, coche...) only appear when Spain is active.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {DIALECTS.map((d) => (
            <button
              key={d.code}
              className="level-pill"
              data-active={stats.activeDialects.includes(d.code)}
              onClick={() => onToggleDialect(d.code)}
              title={d.blurb}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="notecard px-6 py-5">
        <div className="font-display text-lg mb-1">Pace</div>
        <label className="text-sm flex items-center gap-3 mt-2" style={{ color: "var(--ink-soft)" }}>
          New cards per day
          <input
            type="number"
            min="1"
            max="100"
            className="ink-input"
            style={{ width: 80 }}
            value={stats.dailyNewLimit}
            onChange={(e) => onSetDailyLimit(Math.max(1, parseInt(e.target.value) || 1))}
          />
        </label>
      </div>

      <div className="notecard px-6 py-5">
        <div className="font-display text-lg mb-2">Support this project</div>
        <p className="text-sm mb-3" style={{ color: "var(--ink-soft)" }}>
          Cuaderno is free, with no subscription and no ads. If it's helped you learn, a coffee is
          always appreciated — never required.
        </p>
        <a
          href="https://ko-fi.com/languageyapps"
          target="_blank"
          rel="noopener noreferrer"
          className="kofi-btn"
        >
          ☕ Buy me a coffee
        </a>
      </div>

      <div className="notecard px-6 py-5">
        <div className="font-display text-lg mb-2">Danger zone</div>
        <p className="text-sm mb-3" style={{ color: "var(--ink-soft)" }}>
          Clears every card's schedule and returns to the starter deck. Custom cards you added will be
          lost. Consider a backup first (Progress → Backup & transfer).
        </p>
        <button
          className="ink-btn ink-btn-ghost"
          style={{ borderColor: "var(--red-pen)", color: "var(--red-pen)" }}
          onClick={onReset}
        >
          Reset progress
        </button>
      </div>
    </div>
  );
}

function ProgressView({
  cards, stats, masteredCount,
  onExport, onImportClick, onImportFile, importInputRef, importMessage,
}) {
  const newCount = cards.filter((c) => c.status === "new").length;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatBlock label="Streak" value={stats.currentStreak} accent="var(--red-pen)" />
        <StatBlock label="Total reviews" value={stats.totalReviews} accent="var(--ink)" />
        <StatBlock label="Mastered" value={masteredCount} accent="var(--green-check)" />
        <StatBlock label="New" value={newCount} accent="var(--mustard)" />
      </div>

      <div className="notecard px-6 py-5">
        <div className="font-display text-lg mb-3">By content type</div>
        <div className="flex flex-col gap-2">
          {CONTENT_TYPES.map((t) => {
            const typeCards = cards.filter((c) => c.contentType === t.code);
            const total = typeCards.length;
            const done = typeCards.filter((c) => c.status === "review").length;
            return (
              <div key={t.code} className="flex items-center gap-3">
                <div className="text-sm w-32 shrink-0 truncate">{t.label}</div>
                <div className="bar-track flex-1">
                  <div className="bar-fill" style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
                </div>
                <div className="text-xs w-16 text-right" style={{ color: "var(--ink-soft)" }}>
                  {done}/{total}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="notecard px-6 py-5">
        <div className="font-display text-lg mb-1">By level (CEFR)</div>
        <p className="text-sm mb-3" style={{ color: "var(--ink-soft)" }}>
          Active levels: <strong>{stats.activeLevels.join(", ")}</strong> — use the toggles above to change what
          you study, at any time.
        </p>
        <div className="flex flex-col gap-2">
          {LEVELS.map((l) => {
            const levelCards = cards.filter((c) => c.level === l.code);
            const total = levelCards.length;
            const started = levelCards.filter((c) => c.status === "review").length;
            const mastered = levelCards.filter((c) => c.interval >= 21).length;
            const pct = total ? Math.round((started / total) * 100) : 0;
            return (
              <div key={l.code} className="flex items-center gap-3">
                <div className="level-row-label" data-current={stats.activeLevels.includes(l.code)}>
                  {l.label} <span className="hidden sm:inline">· {l.name}</span>
                </div>
                <div className="bar-track flex-1">
                  <div className="bar-fill" style={{ width: `${pct}%` }} />
                </div>
                <div className="text-xs w-24 text-right" style={{ color: "var(--ink-soft)" }}>
                  {started}/{total} · {mastered} mastered
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="notecard px-6 py-5">
        <div className="font-display text-lg mb-1">Backup & transfer</div>
        <p className="text-sm mb-4" style={{ color: "var(--ink-soft)" }}>
          Your progress lives in this browser only. Download a backup to protect it, or to move it to
          another device — then import it there.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button className="ink-btn ink-btn-primary" onClick={onExport}>
            Download backup
          </button>
          <button className="ink-btn ink-btn-ghost" onClick={onImportClick}>
            Import backup
          </button>
          <input
            ref={importInputRef}
            type="file"
            accept="application/json,.json"
            style={{ display: "none" }}
            onChange={onImportFile}
          />
        </div>
        {importMessage && (
          <div
            className="text-sm mt-3"
            style={{ color: importMessage.ok ? "var(--green-check)" : "var(--red-pen)" }}
          >
            {importMessage.text}
          </div>
        )}
      </div>

    </div>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 7 H20" />
      <path d="M9 7 V4.5 C9 3.7 9.7 3 10.5 3 H13.5 C14.3 3 15 3.7 15 4.5 V7" />
      <path d="M6 7 L7 20.5 C7.05 21.3 7.7 22 8.5 22 H15.5 C16.3 22 16.95 21.3 17 20.5 L18 7" />
      <path d="M10 11 V17.5" />
      <path d="M14 11 V17.5" />
    </svg>
  );
}

function SpeakButton({ text, size = "normal" }) {
  return (
    <button
      type="button"
      className={size === "small" ? "speak-btn speak-btn-small" : "speak-btn"}
      title="Listen"
      aria-label={`Listen: ${text}`}
      onClick={(e) => {
        e.stopPropagation();
        speak(text);
      }}
    >
      🔊
    </button>
  );
}

function StatusBadge({ card }) {
  if (card.status === "new") {
    return (
      <span className="badge" style={{ background: "#F7E3AE", color: "var(--mustard)" }}>
        new
      </span>
    );
  }
  const d = daysUntil(card.dueDate);
  if (d <= 0) {
    return (
      <span className="badge" style={{ background: "#F8D6CE", color: "var(--red-pen)" }}>
        today
      </span>
    );
  }
  return (
    <span className="badge" style={{ background: "#D9EEDA", color: "var(--green-check)" }}>
      in {d}d
    </span>
  );
}

function StatBlock({ label, value, accent }) {
  return (
    <div className="notecard px-4 py-4 text-center">
      <div className="font-hand text-4xl" style={{ color: accent }}>
        {value}
      </div>
      <div className="text-xs mt-1" style={{ color: "var(--ink-soft)" }}>
        {label}
      </div>
    </div>
  );
}

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Inter:wght@400;500;600;700&family=Caveat:wght@500;600;700&display=swap');

      .cuaderno-root {
        --paper: #FBF3E4;
        --grid-line: rgba(21,74,107,0.14);
        --ink: #154A6B;
        --ink-soft: #5C7E92;
        --red-pen: #C1272D;
        --green-check: #3E8E5B;
        --mustard: #E0A526;
        --terracotta: #C1502E;
        --magenta: #C2317B;
        --card-white: #FFFCF5;
        font-family: 'Inter', sans-serif;
        color: var(--ink);
        background-color: var(--paper);
        background-image:
          linear-gradient(var(--grid-line) 1px, transparent 1px),
          linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
        background-size: 22px 22px;
        border-radius: 12px;
      }
      .font-display { font-family: 'Fraunces', serif; }
      .font-hand { font-family: 'Caveat', cursive; font-weight: 600; }

      .tile-strip {
        height: 7px;
        border-radius: 999px;
        background: repeating-linear-gradient(
          115deg,
          var(--ink) 0px, var(--ink) 9px,
          var(--card-white) 9px, var(--card-white) 11px,
          var(--terracotta) 11px, var(--terracotta) 20px,
          var(--card-white) 20px, var(--card-white) 22px,
          var(--mustard) 22px, var(--mustard) 31px,
          var(--card-white) 31px, var(--card-white) 33px
        );
        opacity: 0.9;
      }

      .app-title {
        color: var(--ink);
        letter-spacing: 0.01em;
        text-shadow: 0 1px 0 rgba(255,252,245,0.6), 0 2px 3px rgba(21,74,107,0.16);
        position: relative;
        display: inline-block;
        padding-bottom: 6px;
      }
      .app-title::after {
        content: "";
        position: absolute;
        left: 2px;
        right: 8%;
        bottom: 0;
        height: 3px;
        border-radius: 999px;
        background: linear-gradient(90deg, var(--terracotta), var(--mustard));
        opacity: 0.85;
      }

      .tab-btn {
        padding: 8px 16px 10px;
        color: var(--ink-soft);
        border-bottom: 3px solid transparent;
        margin-bottom: -1px;
        transition: color 0.15s ease, border-color 0.15s ease;
      }
      .tab-btn:hover { color: var(--ink); }
      .tab-btn[data-active="true"] {
        color: var(--ink);
        border-bottom-color: var(--red-pen);
        font-weight: 600;
      }

      .subtab-btn {
        font-family: 'Inter', sans-serif;
        font-size: 0.82rem;
        font-weight: 600;
        padding: 5px 14px;
        border-radius: 999px;
        border: 1.5px solid rgba(21,74,107,0.25);
        background: var(--card-white);
        color: var(--ink-soft);
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .subtab-btn[data-active="true"] {
        background: var(--ink);
        border-color: var(--ink);
        color: var(--card-white);
      }

      .level-pill {
        font-family: 'Fraunces', serif;
        font-size: 0.78rem;
        font-weight: 600;
        padding: 3px 11px;
        border-radius: 999px;
        border: 1.5px solid rgba(21,74,107,0.3);
        background: var(--card-white);
        color: var(--ink-soft);
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .level-pill[data-active="true"] {
        background: #F7E3AE;
        border-color: var(--mustard);
        color: var(--ink);
      }

      .notecard {
        background: var(--card-white);
        border: 1px solid rgba(21,74,107,0.18);
        border-radius: 10px;
        box-shadow: 0 1px 0 rgba(21,74,107,0.04), 0 6px 16px -10px rgba(21,74,107,0.25);
      }

      .ink-btn {
        font-family: 'Fraunces', serif;
        font-weight: 600;
        padding: 10px 22px;
        border-radius: 7px;
        border: 1.5px solid var(--ink);
        background: transparent;
        color: var(--ink);
        cursor: pointer;
        transition: transform 0.1s ease, background 0.15s ease;
      }
      .ink-btn:hover { transform: translateY(-1px); }
      .ink-btn:active { transform: translateY(0); }
      .ink-btn-primary {
        background: var(--ink);
        color: var(--card-white);
      }
      .ink-btn-ghost {
        border-color: rgba(21,74,107,0.35);
        color: var(--ink-soft);
      }
      .ink-btn-small { padding: 6px 12px; font-size: 0.85rem; }

      .ink-input {
        font-family: 'Inter', sans-serif;
        padding: 8px 12px;
        border-radius: 7px;
        border: 1.5px solid rgba(21,74,107,0.3);
        background: var(--card-white);
        color: var(--ink);
        outline: none;
      }
      .ink-input:focus {
        border-color: var(--ink);
        box-shadow: 0 0 0 3px rgba(21,74,107,0.1);
      }

      .browse-row {
        display: flex;
        align-items: center;
        gap: 8px;
        background: var(--card-white);
        border: 1px solid rgba(21,74,107,0.14);
        border-radius: 8px;
        padding: 10px 12px;
      }

      .icon-btn {
        width: 28px; height: 28px;
        border-radius: 6px;
        border: 1px solid rgba(21,74,107,0.25);
        background: transparent;
        color: var(--ink-soft);
        cursor: pointer;
      }
      .icon-btn:hover { background: rgba(21,74,107,0.08); }
      .icon-btn-danger:hover { background: #F8D6CE; color: var(--red-pen); border-color: var(--red-pen); }

      .speak-btn {
        width: 30px;
        height: 30px;
        flex-shrink: 0;
        border-radius: 999px;
        border: 1.5px solid rgba(21,74,107,0.25);
        background: var(--card-white);
        color: var(--ink);
        font-size: 0.85rem;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s ease;
      }
      .speak-btn:hover {
        border-color: var(--terracotta);
        background: #F8D6CE;
        transform: scale(1.06);
      }
      .speak-btn:active { transform: scale(0.95); }
      .speak-btn-small {
        width: 22px;
        height: 22px;
        font-size: 0.7rem;
      }

      .level-row-label {
        width: 96px;
        flex-shrink: 0;
        text-align: left;
        font-size: 0.85rem;
        font-weight: 600;
        padding: 3px 8px;
        border-radius: 6px;
        border: 1px solid transparent;
        color: var(--ink-soft);
      }
      .level-row-label[data-current="true"] {
        color: var(--ink);
        background: #F7E3AE;
        border-color: var(--mustard);
      }

      .badge {
        font-size: 0.7rem;
        font-weight: 600;
        padding: 3px 8px;
        border-radius: 999px;
        white-space: nowrap;
      }

      .bar-track {
        height: 8px;
        border-radius: 999px;
        background: rgba(21,74,107,0.14);
        overflow: hidden;
      }
      .bar-fill {
        height: 100%;
        background: var(--green-check);
        border-radius: 999px;
      }

      .flip-wrap {
        perspective: 1400px;
        cursor: pointer;
      }
      .flip-card {
        position: relative;
        height: 300px;
        width: 100%;
        max-width: 480px;
        margin: 0 auto;
        transform-style: preserve-3d;
        transition: transform 0.45s cubic-bezier(.4,.2,.2,1);
        transform: rotateY(0deg) rotate(-0.6deg);
      }
      .flip-card.is-flipped { transform: rotateY(180deg) rotate(-0.6deg); }
      .flip-face {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        backface-visibility: hidden;
        border-radius: 10px;
        background: var(--card-white);
        border: 1px solid rgba(21,74,107,0.2);
        box-shadow: 0 10px 24px -14px rgba(21,74,107,0.4);
        padding: 24px;
        overflow: hidden;
      }
      .flip-face::before {
        content: "";
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 6px;
        background: repeating-linear-gradient(
          115deg,
          var(--ink) 0px, var(--ink) 8px,
          var(--card-white) 8px, var(--card-white) 10px,
          var(--terracotta) 10px, var(--terracotta) 18px,
          var(--card-white) 18px, var(--card-white) 20px,
          var(--mustard) 20px, var(--mustard) 28px,
          var(--card-white) 28px, var(--card-white) 30px
        );
      }
      .flip-back { transform: rotateY(180deg); }

      .example-block {
        margin-top: 14px;
        padding-top: 12px;
        border-top: 1px dashed rgba(21,74,107,0.25);
        max-width: 90%;
      }
      .example-es {
        font-style: italic;
        font-size: 0.82rem;
        color: var(--ink);
      }
      .example-en {
        font-size: 0.72rem;
        color: var(--ink-soft);
        margin-top: 2px;
      }

      .grammar-examples {
        margin-top: 10px;
        padding: 10px 12px;
        background: var(--paper);
        border-radius: 7px;
        border: 1px dashed rgba(21,74,107,0.25);
      }
      .grammar-example-line {
        font-family: 'Fraunces', serif;
        font-style: italic;
        font-size: 0.85rem;
        color: var(--ink);
        line-height: 1.6;
      }
      .grammar-example-line + .grammar-example-line {
        margin-top: 4px;
      }

      .kofi-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-family: 'Fraunces', serif;
        font-weight: 600;
        font-size: 0.9rem;
        padding: 9px 20px;
        border-radius: 999px;
        background: var(--terracotta);
        color: var(--card-white);
        text-decoration: none;
        border: 1.5px solid var(--terracotta);
        transition: transform 0.1s ease, background 0.15s ease;
      }
      .kofi-btn:hover {
        background: var(--red-pen);
        border-color: var(--red-pen);
        transform: translateY(-1px);
      }

      @media (prefers-reduced-motion: reduce) {
        .flip-card { transition: none; }
      }

      .grade-row {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
        max-width: 480px;
        margin: 0 auto;
      }
      .grade-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        padding: 10px 4px 8px;
        border-radius: 8px;
        border: 1.5px solid rgba(21,74,107,0.25);
        background: var(--card-white);
        cursor: pointer;
        font-size: 0.78rem;
        color: var(--ink-soft);
        transition: transform 0.1s ease, border-color 0.15s ease;
      }
      .grade-btn:hover { transform: translateY(-2px); }
      .grade-mark { font-family: 'Caveat', cursive; font-size: 1.6rem; line-height: 1; font-weight: 700; }
      .grade-key { font-size: 0.65rem; opacity: 0.5; }
      .grade-btn[data-kind="again"] .grade-mark { color: var(--red-pen); }
      .grade-btn[data-kind="again"]:hover { border-color: var(--red-pen); }
      .grade-btn[data-kind="hard"] .grade-mark { color: var(--mustard); }
      .grade-btn[data-kind="hard"]:hover { border-color: var(--mustard); }
      .grade-btn[data-kind="good"] .grade-mark { color: var(--green-check); }
      .grade-btn[data-kind="good"]:hover { border-color: var(--green-check); }
      .grade-btn[data-kind="easy"] .grade-mark { color: var(--magenta); }
      .grade-btn[data-kind="easy"]:hover { border-color: var(--magenta); }

      .match-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px 12px;
        max-width: 560px;
        margin: 0 auto;
      }
      .match-tile {
        font-family: 'Inter', sans-serif;
        font-size: 0.85rem;
        text-align: left;
        padding: 10px 12px;
        border-radius: 8px;
        border: 1.5px solid rgba(21,74,107,0.25);
        background: var(--card-white);
        color: var(--ink);
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .match-tile:hover:not(:disabled) { border-color: var(--ink); }
      .match-tile[data-selected="true"] {
        border-color: var(--mustard);
        background: #F7E3AE;
      }
      .match-tile[data-matched="true"] {
        border-color: var(--green-check);
        background: #D9EEDA;
        color: var(--green-check);
        opacity: 0.7;
        cursor: default;
      }
      .match-tile[data-wrong="true"] {
        border-color: var(--red-pen);
        background: #F8D6CE;
      }
    `}</style>
  );
}
