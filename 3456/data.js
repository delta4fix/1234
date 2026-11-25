/* Deutsch Master — contenido estático (gramática, verbos, mazos base).
   Solo datos: no contiene lógica ni recursos externos. */
'use strict';

const DATA = {};

/* ---------- MAZOS DE VOCABULARIO ----------
   Sustantivos: "artículo|palabra|plural|español"  (plural "–" = sin plural)
   Otros:       "tipo|palabra|español"  (v = verbo, a = adjetivo, x = otro)          */

DATA.decks = {
  basis: {
    name: 'Vocabulario base A2/B1',
    tag: 'Basis',
    items: [
      'der|Abend|Abende|tarde, noche', 'die|Abfahrt|Abfahrten|salida', 'der|Alltag|–|vida cotidiana',
      'die|Angst|Ängste|miedo', 'die|Ankunft|Ankünfte|llegada', 'die|Antwort|Antworten|respuesta',
      'der|Anzug|Anzüge|traje', 'der|Apfel|Äpfel|manzana', 'die|Arbeit|Arbeiten|trabajo',
      'der|Arbeitsplatz|Arbeitsplätze|puesto de trabajo', 'der|Arzt|Ärzte|médico', 'die|Ärztin|Ärztinnen|médica',
      'die|Aufgabe|Aufgaben|tarea', 'der|Aufzug|Aufzüge|ascensor', 'das|Auge|Augen|ojo',
      'der|Ausflug|Ausflüge|excursión', 'der|Ausweis|Ausweise|documento de identidad', 'das|Auto|Autos|coche',
      'der|Bahnhof|Bahnhöfe|estación de tren', 'der|Baum|Bäume|árbol', 'die|Bedeutung|Bedeutungen|significado',
      'das|Beispiel|Beispiele|ejemplo', 'der|Beruf|Berufe|profesión', 'die|Bewerbung|Bewerbungen|solicitud de empleo',
      'das|Bild|Bilder|imagen, cuadro', 'der|Bildschirm|Bildschirme|pantalla', 'die|Brille|Brillen|gafas',
      'der|Brief|Briefe|carta', 'das|Brot|Brote|pan', 'der|Bruder|Brüder|hermano',
      'das|Buch|Bücher|libro', 'das|Büro|Büros|oficina', 'die|Dusche|Duschen|ducha',
      'das|Ei|Eier|huevo', 'die|Einladung|Einladungen|invitación', 'die|Entscheidung|Entscheidungen|decisión',
      'die|Erfahrung|Erfahrungen|experiencia', 'die|Erkältung|Erkältungen|resfriado', 'das|Ergebnis|Ergebnisse|resultado',
      'das|Essen|Essen|comida', 'die|Fahrkarte|Fahrkarten|billete', 'das|Fahrrad|Fahrräder|bicicleta',
      'die|Familie|Familien|familia', 'die|Farbe|Farben|color', 'der|Fehler|Fehler|error',
      'der|Feierabend|Feierabende|fin de la jornada laboral', 'das|Fenster|Fenster|ventana', 'das|Fest|Feste|fiesta',
      'das|Fieber|–|fiebre', 'der|Film|Filme|película', 'die|Flasche|Flaschen|botella',
      'das|Fleisch|–|carne', 'der|Flughafen|Flughäfen|aeropuerto', 'das|Flugzeug|Flugzeuge|avión',
      'die|Frage|Fragen|pregunta', 'die|Freizeit|–|tiempo libre', 'der|Freund|Freunde|amigo',
      'die|Freundin|Freundinnen|amiga', 'der|Frühling|Frühlinge|primavera', 'das|Frühstück|Frühstücke|desayuno',
      'der|Führerschein|Führerscheine|carné de conducir', 'der|Garten|Gärten|jardín', 'der|Gast|Gäste|invitado, huésped',
      'das|Gebäude|Gebäude|edificio', 'der|Geburtstag|Geburtstage|cumpleaños', 'das|Gefühl|Gefühle|sentimiento',
      'das|Gehalt|Gehälter|sueldo', 'das|Geld|Gelder|dinero', 'das|Gemüse|Gemüse|verdura',
      'das|Gepäck|–|equipaje', 'das|Gericht|Gerichte|plato (comida); tribunal', 'das|Geschäft|Geschäfte|tienda; negocio',
      'das|Geschenk|Geschenke|regalo', 'die|Geschichte|Geschichten|historia', 'das|Gesicht|Gesichter|cara',
      'die|Gesundheit|–|salud', 'das|Getränk|Getränke|bebida', 'das|Glas|Gläser|vaso; cristal',
      'das|Glück|–|suerte; felicidad', 'der|Grund|Gründe|motivo, razón', 'die|Gruppe|Gruppen|grupo',
      'das|Haar|Haare|pelo', 'der|Hafen|Häfen|puerto', 'der|Hals|Hälse|cuello; garganta',
      'die|Hand|Hände|mano', 'das|Handy|Handys|móvil', 'das|Haus|Häuser|casa',
      'das|Hemd|Hemden|camisa', 'der|Herbst|Herbste|otoño', 'das|Herz|Herzen|corazón',
      'die|Hilfe|Hilfen|ayuda', 'das|Hobby|Hobbys|afición', 'die|Hose|Hosen|pantalón',
      'der|Hund|Hunde|perro', 'der|Hunger|–|hambre', 'die|Idee|Ideen|idea',
      'die|Insel|Inseln|isla', 'die|Jacke|Jacken|chaqueta', 'das|Jahr|Jahre|año',
      'der|Junge|Jungen|chico', 'der|Kaffee|Kaffees|café', 'der|Kalender|Kalender|calendario',
      'die|Katze|Katzen|gato', 'der|Kellner|Kellner|camarero', 'das|Kind|Kinder|niño',
      'das|Kino|Kinos|cine', 'die|Kirche|Kirchen|iglesia', 'die|Kleidung|–|ropa',
      'der|Koffer|Koffer|maleta', 'der|Kollege|Kollegen|compañero de trabajo', 'der|Kopf|Köpfe|cabeza',
      'der|Körper|Körper|cuerpo', 'das|Krankenhaus|Krankenhäuser|hospital', 'die|Krankheit|Krankheiten|enfermedad',
      'die|Küche|Küchen|cocina', 'der|Kuchen|Kuchen|pastel', 'der|Kunde|Kunden|cliente',
      'die|Kunst|Künste|arte', 'der|Kurs|Kurse|curso', 'das|Land|Länder|país; campo',
      'das|Leben|Leben|vida', 'der|Lehrer|Lehrer|profesor', 'das|Licht|Lichter|luz',
      'die|Liebe|–|amor', 'das|Lied|Lieder|canción', 'die|Luft|–|aire',
      'die|Lust|–|ganas', 'das|Mädchen|Mädchen|chica', 'die|Mahlzeit|Mahlzeiten|comida (cada toma)',
      'der|Mann|Männer|hombre', 'der|Mantel|Mäntel|abrigo', 'das|Meer|Meere|mar',
      'die|Meinung|Meinungen|opinión', 'der|Mensch|Menschen|persona, ser humano', 'die|Miete|Mieten|alquiler',
      'die|Milch|–|leche', 'die|Minute|Minuten|minuto', 'der|Monat|Monate|mes',
      'der|Mond|Monde|luna', 'der|Morgen|Morgen|mañana', 'der|Müll|–|basura',
      'der|Mund|Münder|boca', 'die|Musik|–|música', 'die|Mutter|Mütter|madre',
      'die|Nachricht|Nachrichten|noticia; mensaje', 'der|Nachbar|Nachbarn|vecino', 'die|Nacht|Nächte|noche',
      'der|Name|Namen|nombre', 'die|Nase|Nasen|nariz', 'die|Natur|–|naturaleza',
      'die|Nummer|Nummern|número', 'das|Obst|–|fruta', 'der|Ort|Orte|lugar',
      'der|Park|Parks|parque', 'der|Pass|Pässe|pasaporte', 'die|Pause|Pausen|pausa, descanso',
      'der|Platz|Plätze|plaza; sitio', 'die|Polizei|–|policía', 'der|Preis|Preise|precio; premio',
      'das|Problem|Probleme|problema', 'die|Prüfung|Prüfungen|examen', 'die|Rechnung|Rechnungen|factura, cuenta',
      'der|Regen|–|lluvia', 'die|Regel|Regeln|regla', 'die|Reise|Reisen|viaje',
      'das|Restaurant|Restaurants|restaurante', 'das|Rezept|Rezepte|receta', 'der|Rücken|Rücken|espalda',
      'die|Ruhe|–|tranquilidad', 'der|Saft|Säfte|zumo', 'der|Satz|Sätze|frase',
      'der|Schlüssel|Schlüssel|llave', 'der|Schmerz|Schmerzen|dolor', 'der|Schnee|–|nieve',
      'der|Schuh|Schuhe|zapato', 'die|Schule|Schulen|escuela', 'die|Schwester|Schwestern|hermana',
      'das|Schwimmbad|Schwimmbäder|piscina', 'der|See|Seen|lago', 'die|Seite|Seiten|página; lado',
      'die|Sonne|Sonnen|sol', 'die|Sprache|Sprachen|idioma', 'die|Stadt|Städte|ciudad',
      'der|Strand|Strände|playa', 'die|Straße|Straßen|calle', 'das|Stück|Stücke|trozo; obra de teatro',
      'der|Student|Studenten|estudiante', 'die|Stunde|Stunden|hora', 'der|Stuhl|Stühle|silla',
      'der|Supermarkt|Supermärkte|supermercado', 'der|Tag|Tage|día', 'die|Tasche|Taschen|bolso; bolsillo',
      'die|Tasse|Tassen|taza', 'der|Teller|Teller|plato', 'der|Termin|Termine|cita',
      'das|Thema|Themen|tema', 'das|Tier|Tiere|animal', 'der|Tisch|Tische|mesa',
      'die|Tochter|Töchter|hija', 'die|Toilette|Toiletten|baño, aseo', 'der|Traum|Träume|sueño (al dormir)',
      'die|Tür|Türen|puerta', 'die|Uhr|Uhren|reloj; hora', 'der|Unfall|Unfälle|accidente',
      'die|Universität|Universitäten|universidad', 'der|Unterricht|–|clase (enseñanza)', 'der|Urlaub|Urlaube|vacaciones',
      'der|Vater|Väter|padre', 'der|Verkehr|–|tráfico', 'der|Vertrag|Verträge|contrato',
      'der|Vogel|Vögel|pájaro', 'der|Vorname|Vornamen|nombre de pila', 'die|Wahl|Wahlen|elección',
      'der|Wald|Wälder|bosque', 'die|Wand|Wände|pared', 'das|Wasser|–|agua',
      'der|Weg|Wege|camino', 'das|Wetter|–|tiempo (meteorológico)', 'die|Woche|Wochen|semana',
      'das|Wochenende|Wochenenden|fin de semana', 'die|Wohnung|Wohnungen|piso, vivienda', 'das|Wort|Wörter|palabra',
      'der|Wunsch|Wünsche|deseo', 'die|Zahl|Zahlen|número, cifra', 'der|Zahn|Zähne|diente',
      'die|Zeit|Zeiten|tiempo', 'die|Zeitung|Zeitungen|periódico', 'das|Zimmer|Zimmer|habitación',
      'der|Zug|Züge|tren', 'die|Zukunft|–|futuro',
      'v|arbeiten|trabajar', 'v|besuchen|visitar', 'v|bezahlen|pagar', 'v|brauchen|necesitar',
      'v|erklären|explicar', 'v|erzählen|contar, narrar', 'v|fragen|preguntar', 'v|glauben|creer',
      'v|hoffen|esperar (tener esperanza)', 'v|kaufen|comprar', 'v|kochen|cocinar', 'v|lernen|aprender',
      'v|mieten|alquilar', 'v|öffnen|abrir', 'v|putzen|limpiar', 'v|reisen|viajar',
      'v|sagen|decir', 'v|schicken|enviar', 'v|suchen|buscar', 'v|verdienen|ganar (dinero)',
      'v|versuchen|intentar', 'v|wohnen|vivir, residir', 'v|zeigen|mostrar, enseñar', 'v|sich beeilen|darse prisa',
      'v|sich erholen|descansar, recuperarse', 'v|sich fühlen|sentirse', 'v|vorschlagen|proponer', 'v|kennenlernen|conocer (a alguien)',
      'v|umziehen|mudarse', 'v|aufhören|dejar de, terminar',
      'a|billig|barato', 'a|teuer|caro', 'a|schnell|rápido', 'a|langsam|lento', 'a|müde|cansado',
      'a|krank|enfermo', 'a|gesund|sano', 'a|glücklich|feliz', 'a|traurig|triste', 'a|wichtig|importante',
      'a|schwierig|difícil', 'a|einfach|fácil, sencillo', 'a|laut|ruidoso, alto (volumen)', 'a|leise|bajo (volumen), silencioso',
      'a|pünktlich|puntual', 'a|fleißig|trabajador, aplicado', 'a|faul|perezoso', 'a|ehrlich|sincero, honesto',
      'a|freundlich|amable', 'a|voll|lleno', 'a|leer|vacío', 'a|sauber|limpio', 'a|schmutzig|sucio',
      'a|bequem|cómodo', 'a|gefährlich|peligroso', 'a|sicher|seguro', 'a|zufrieden|satisfecho', 'a|neugierig|curioso',
      'x|ungefähr|aproximadamente', 'x|wahrscheinlich|probablemente', 'x|trotzdem|a pesar de ello, aun así',
      'x|sofort|inmediatamente', 'x|manchmal|a veces', 'x|selten|rara vez', 'x|deshalb|por eso',
      'x|außerdem|además', 'x|leider|desgraciadamente', 'x|fast|casi'
    ]
  },
  luftfahrt: {
    name: 'Aviación (Luftfahrt)',
    tag: 'Luftfahrt',
    items: [
      'das|Flugzeug|Flugzeuge|avión', 'der|Flughafen|Flughäfen|aeropuerto', 'die|Startbahn|Startbahnen|pista de despegue',
      'die|Landebahn|Landebahnen|pista de aterrizaje', 'der|Rollweg|Rollwege|calle de rodaje', 'das|Vorfeld|Vorfelder|plataforma (apron)',
      'der|Kontrollturm|Kontrolltürme|torre de control', 'der|Fluglotse|Fluglotsen|controlador aéreo', 'die|Flugsicherung|–|control del tránsito aéreo',
      'der|Pilot|Piloten|piloto', 'der|Kopilot|Kopiloten|copiloto', 'der|Flugkapitän|Flugkapitäne|comandante',
      'die|Besatzung|Besatzungen|tripulación', 'das|Cockpit|Cockpits|cabina de mando', 'die|Kabine|Kabinen|cabina de pasaje',
      'die|Tragfläche|Tragflächen|ala, plano', 'das|Triebwerk|Triebwerke|motor (de avión)', 'der|Propeller|Propeller|hélice',
      'das|Fahrwerk|Fahrwerke|tren de aterrizaje', 'das|Seitenruder|Seitenruder|timón de dirección', 'das|Höhenruder|Höhenruder|timón de profundidad',
      'das|Querruder|Querruder|alerón', 'die|Landeklappe|Landeklappen|flap', 'der|Treibstoff|Treibstoffe|combustible',
      'der|Tank|Tanks|depósito', 'der|Start|Starts|despegue', 'die|Landung|Landungen|aterrizaje',
      'der|Anflug|Anflüge|aproximación', 'der|Abflug|Abflüge|salida (vuelo)', 'der|Steigflug|Steigflüge|ascenso',
      'der|Sinkflug|Sinkflüge|descenso', 'der|Reiseflug|Reiseflüge|crucero', 'die|Flughöhe|Flughöhen|altitud de vuelo',
      'die|Geschwindigkeit|Geschwindigkeiten|velocidad', 'der|Wind|Winde|viento', 'der|Seitenwind|Seitenwinde|viento cruzado',
      'die|Sicht|–|visibilidad', 'die|Wolke|Wolken|nube', 'das|Gewitter|Gewitter|tormenta',
      'die|Turbulenz|Turbulenzen|turbulencia', 'die|Vereisung|Vereisungen|engelamiento', 'der|Notfall|Notfälle|emergencia',
      'die|Notlandung|Notlandungen|aterrizaje de emergencia', 'der|Flugplan|Flugpläne|plan de vuelo', 'die|Freigabe|Freigaben|autorización (clearance)',
      'die|Frequenz|Frequenzen|frecuencia', 'das|Gewicht|Gewichte|peso', 'der|Luftraum|Lufträume|espacio aéreo',
      'die|Seemeile|Seemeilen|milla náutica', 'der|Hubschrauber|Hubschrauber|helicóptero', 'die|Luftwaffe|Luftwaffen|fuerza aérea',
      'die|Seenotrettung|–|salvamento marítimo',
      'v|starten|despegar; arrancar', 'v|landen|aterrizar', 'v|rollen|rodar (taxi)', 'v|steigen|ascender, subir',
      'v|sinken|descender', 'v|abheben|despegar (separarse del suelo)', 'v|tanken|repostar', 'v|durchstarten|motor y al aire (go-around)'
    ]
  }
};

/* ---------- VERBOS IRREGULARES ----------
   infinitivo | español | 3ª sg. presente | Präteritum (3ª sg.) | Partizip II | auxiliar ("haben", "sein" o "sein/haben") */
DATA.verbs = [
  'beginnen|comenzar|beginnt|begann|begonnen|haben', 'bekommen|recibir|bekommt|bekam|bekommen|haben',
  'beschreiben|describir|beschreibt|beschrieb|beschrieben|haben', 'bitten|pedir, rogar|bittet|bat|gebeten|haben',
  'bleiben|quedarse|bleibt|blieb|geblieben|sein', 'brechen|romper|bricht|brach|gebrochen|haben',
  'bringen|traer, llevar|bringt|brachte|gebracht|haben', 'denken|pensar|denkt|dachte|gedacht|haben',
  'dürfen|poder (permiso)|darf|durfte|gedurft|haben', 'empfehlen|recomendar|empfiehlt|empfahl|empfohlen|haben',
  'entscheiden|decidir|entscheidet|entschied|entschieden|haben', 'erfahren|enterarse, experimentar|erfährt|erfuhr|erfahren|haben',
  'essen|comer|isst|aß|gegessen|haben', 'fahren|ir (en vehículo), conducir|fährt|fuhr|gefahren|sein/haben',
  'fallen|caer|fällt|fiel|gefallen|sein', 'fangen|atrapar|fängt|fing|gefangen|haben',
  'finden|encontrar|findet|fand|gefunden|haben', 'fliegen|volar|fliegt|flog|geflogen|sein/haben',
  'fliehen|huir|flieht|floh|geflohen|sein', 'frieren|tener frío; congelarse|friert|fror|gefroren|haben',
  'geben|dar|gibt|gab|gegeben|haben', 'gefallen|gustar|gefällt|gefiel|gefallen|haben',
  'gehen|ir (a pie)|geht|ging|gegangen|sein', 'gelten|valer, considerarse|gilt|galt|gegolten|haben',
  'genießen|disfrutar|genießt|genoss|genossen|haben', 'geschehen|suceder|geschieht|geschah|geschehen|sein',
  'gewinnen|ganar|gewinnt|gewann|gewonnen|haben', 'gießen|regar; verter|gießt|goss|gegossen|haben',
  'greifen|agarrar|greift|griff|gegriffen|haben', 'haben|tener|hat|hatte|gehabt|haben',
  'halten|sostener; parar|hält|hielt|gehalten|haben', 'hängen|estar colgado|hängt|hing|gehangen|haben',
  'heben|levantar|hebt|hob|gehoben|haben', 'heißen|llamarse|heißt|hieß|geheißen|haben',
  'helfen|ayudar|hilft|half|geholfen|haben', 'kennen|conocer|kennt|kannte|gekannt|haben',
  'kommen|venir|kommt|kam|gekommen|sein', 'können|poder (capacidad)|kann|konnte|gekonnt|haben',
  'laden|cargar|lädt|lud|geladen|haben', 'lassen|dejar|lässt|ließ|gelassen|haben',
  'laufen|correr; andar|läuft|lief|gelaufen|sein', 'leiden|sufrir|leidet|litt|gelitten|haben',
  'leihen|prestar|leiht|lieh|geliehen|haben', 'lesen|leer|liest|las|gelesen|haben',
  'liegen|estar tumbado, estar situado|liegt|lag|gelegen|haben', 'lügen|mentir|lügt|log|gelogen|haben',
  'messen|medir|misst|maß|gemessen|haben', 'mögen|gustar|mag|mochte|gemocht|haben',
  'müssen|tener que|muss|musste|gemusst|haben', 'nehmen|tomar, coger|nimmt|nahm|genommen|haben',
  'nennen|nombrar|nennt|nannte|genannt|haben', 'raten|aconsejar; adivinar|rät|riet|geraten|haben',
  'rennen|correr|rennt|rannte|gerannt|sein', 'riechen|oler|riecht|roch|gerochen|haben',
  'rufen|llamar (gritar)|ruft|rief|gerufen|haben', 'scheinen|brillar; parecer|scheint|schien|geschienen|haben',
  'schieben|empujar|schiebt|schob|geschoben|haben', 'schlafen|dormir|schläft|schlief|geschlafen|haben',
  'schlagen|golpear|schlägt|schlug|geschlagen|haben', 'schließen|cerrar|schließt|schloss|geschlossen|haben',
  'schneiden|cortar|schneidet|schnitt|geschnitten|haben', 'schreiben|escribir|schreibt|schrieb|geschrieben|haben',
  'schreien|gritar|schreit|schrie|geschrien|haben', 'schweigen|callar|schweigt|schwieg|geschwiegen|haben',
  'schwimmen|nadar|schwimmt|schwamm|geschwommen|sein', 'sehen|ver|sieht|sah|gesehen|haben',
  'sein|ser, estar|ist|war|gewesen|sein', 'singen|cantar|singt|sang|gesungen|haben',
  'sinken|hundirse; descender|sinkt|sank|gesunken|sein', 'sitzen|estar sentado|sitzt|saß|gesessen|haben',
  'sprechen|hablar|spricht|sprach|gesprochen|haben', 'springen|saltar|springt|sprang|gesprungen|sein',
  'stehen|estar de pie|steht|stand|gestanden|haben', 'stehlen|robar|stiehlt|stahl|gestohlen|haben',
  'steigen|subir, ascender|steigt|stieg|gestiegen|sein', 'sterben|morir|stirbt|starb|gestorben|sein',
  'streiten|discutir, pelearse|streitet|stritt|gestritten|haben', 'tragen|llevar (puesto), cargar|trägt|trug|getragen|haben',
  'treffen|encontrarse con|trifft|traf|getroffen|haben', 'treiben|practicar (deporte)|treibt|trieb|getrieben|haben',
  'trinken|beber|trinkt|trank|getrunken|haben', 'tun|hacer|tut|tat|getan|haben',
  'verbieten|prohibir|verbietet|verbot|verboten|haben', 'vergessen|olvidar|vergisst|vergaß|vergessen|haben',
  'vergleichen|comparar|vergleicht|verglich|verglichen|haben', 'verlieren|perder|verliert|verlor|verloren|haben',
  'verschwinden|desaparecer|verschwindet|verschwand|verschwunden|sein', 'verstehen|entender|versteht|verstand|verstanden|haben',
  'wachsen|crecer|wächst|wuchs|gewachsen|sein', 'waschen|lavar|wäscht|wusch|gewaschen|haben',
  'werden|llegar a ser, volverse|wird|wurde|geworden|sein', 'werfen|lanzar|wirft|warf|geworfen|haben',
  'wiegen|pesar|wiegt|wog|gewogen|haben', 'wissen|saber|weiß|wusste|gewusst|haben',
  'wollen|querer|will|wollte|gewollt|haben', 'ziehen|tirar de; mudarse|zieht|zog|gezogen|haben/sein',
  'anrufen|llamar por teléfono|ruft an|rief an|angerufen|haben', 'aufstehen|levantarse|steht auf|stand auf|aufgestanden|sein',
  'ankommen|llegar|kommt an|kam an|angekommen|sein', 'abfahren|salir (vehículo)|fährt ab|fuhr ab|abgefahren|sein',
  'einladen|invitar|lädt ein|lud ein|eingeladen|haben', 'einsteigen|subir (a un vehículo)|steigt ein|stieg ein|eingestiegen|sein',
  'aussteigen|bajar (de un vehículo)|steigt aus|stieg aus|ausgestiegen|sein', 'umsteigen|hacer transbordo|steigt um|stieg um|umgestiegen|sein',
  'fernsehen|ver la tele|sieht fern|sah fern|ferngesehen|haben', 'anfangen|empezar|fängt an|fing an|angefangen|haben'
].map(s => { const [inf, es, pr, pt, p2, aux] = s.split('|'); return { inf, es, pr, pt, p2, aux }; });

DATA.verbNotes = [
  '**fahren / fliegen**: con *sein* cuando es desplazamiento (Ich bin nach Berlin geflogen); con *haben* cuando llevan objeto directo (Ich habe das Flugzeug geflogen / Er hat das Auto gefahren).',
  '**ziehen**: *haben* = tirar de (Er hat an der Tür gezogen); *sein* = mudarse (Sie ist nach München gezogen).',
  '**Verbos de movimiento o cambio de estado** (gehen, kommen, fallen, sterben, werden…) + sein, bleiben y sein → Perfekt con *sein*.'
];

/* ---------- PREPOSICIONES ---------- c: A = Akkusativ, D = Dativ, W = Wechsel (A/D), G = Genitiv */
DATA.preps = [
  { p: 'durch', c: 'A', es: 'a través de, por', ex: 'Wir gehen durch den Park.' },
  { p: 'für', c: 'A', es: 'para, por', ex: 'Das Geschenk ist für meinen Bruder.' },
  { p: 'gegen', c: 'A', es: 'contra; hacia (hora aprox.)', ex: 'Wir spielen gegen die Mannschaft aus Köln.' },
  { p: 'ohne', c: 'A', es: 'sin', ex: 'Ich trinke Kaffee ohne Zucker.' },
  { p: 'um', c: 'A', es: 'alrededor de; a las (hora)', ex: 'Wir fahren um den See. Der Kurs beginnt um acht Uhr.' },
  { p: 'bis', c: 'A', es: 'hasta', ex: 'Ich arbeite bis nächsten Freitag.' },
  { p: 'entlang', c: 'A', es: 'a lo largo de (va detrás)', ex: 'Wir gehen den Fluss entlang.' },
  { p: 'aus', c: 'D', es: 'de (procedencia), de dentro de', ex: 'Sie kommt aus der Schweiz.' },
  { p: 'außer', c: 'D', es: 'excepto, aparte de', ex: 'Außer meinem Bruder kommen alle.' },
  { p: 'bei', c: 'D', es: 'en casa de, junto a, en (empresa)', ex: 'Ich wohne bei meinen Eltern.' },
  { p: 'mit', c: 'D', es: 'con; en (medio de transporte)', ex: 'Ich fahre mit dem Bus.' },
  { p: 'nach', c: 'D', es: 'después de; a (ciudades y países sin artículo)', ex: 'Nach dem Essen fliegen wir nach Berlin.' },
  { p: 'seit', c: 'D', es: 'desde (hace)', ex: 'Ich lerne seit einem Jahr Deutsch.' },
  { p: 'von', c: 'D', es: 'de, desde', ex: 'Das ist ein Geschenk von meiner Mutter.' },
  { p: 'zu', c: 'D', es: 'a, hacia (personas, lugares, eventos)', ex: 'Ich gehe zum Arzt und dann zur Arbeit.' },
  { p: 'gegenüber', c: 'D', es: 'enfrente de', ex: 'Die Bank ist gegenüber dem Bahnhof.' },
  { p: 'ab', c: 'D', es: 'a partir de', ex: 'Ab dem ersten Mai bin ich im Urlaub.' },
  { p: 'an', c: 'W', es: 'en, junto a (contacto lateral / vertical)', ex: 'Ich hänge das Bild an die Wand. → Das Bild hängt an der Wand.' },
  { p: 'auf', c: 'W', es: 'sobre, encima (contacto horizontal)', ex: 'Ich lege das Buch auf den Tisch. → Das Buch liegt auf dem Tisch.' },
  { p: 'hinter', c: 'W', es: 'detrás de', ex: 'Er stellt das Fahrrad hinter das Haus. → Es steht hinter dem Haus.' },
  { p: 'in', c: 'W', es: 'en, dentro de', ex: 'Wir gehen in die Stadt. → Wir wohnen in der Stadt.' },
  { p: 'neben', c: 'W', es: 'al lado de', ex: 'Setz dich neben mich! → Sie sitzt neben mir.' },
  { p: 'über', c: 'W', es: 'sobre, por encima (sin contacto); a través', ex: 'Wir fliegen über das Meer. → Die Lampe hängt über dem Tisch.' },
  { p: 'unter', c: 'W', es: 'debajo de', ex: 'Die Katze läuft unter den Stuhl. → Sie schläft unter dem Stuhl.' },
  { p: 'vor', c: 'W', es: 'delante de; hace (tiempo → Dat)', ex: 'Ich parke vor dem Haus. Vor zwei Jahren war ich in Wien.' },
  { p: 'zwischen', c: 'W', es: 'entre', ex: 'Er stellt die Lampe zwischen die Stühle. → Sie steht zwischen den Stühlen.' },
  { p: 'wegen', c: 'G', es: 'a causa de', ex: 'Wegen des Wetters bleiben wir zu Hause.' },
  { p: 'trotz', c: 'G', es: 'a pesar de', ex: 'Trotz des Regens gehen wir spazieren.' },
  { p: 'während', c: 'G', es: 'durante', ex: 'Während des Fluges habe ich geschlafen.' },
  { p: '(an)statt', c: 'G', es: 'en lugar de', ex: 'Statt eines Autos kaufe ich ein Fahrrad.' },
  { p: 'innerhalb', c: 'G', es: 'dentro de (tiempo/espacio)', ex: 'Innerhalb einer Woche bekommen Sie eine Antwort.' },
  { p: 'außerhalb', c: 'G', es: 'fuera de', ex: 'Wir wohnen außerhalb der Stadt.' },
  { p: 'aufgrund', c: 'G', es: 'debido a', ex: 'Aufgrund des Nebels ist der Flug verspätet.' }
];

/* ---------- VERBOS CON PREPOSICIÓN FIJA ---------- */
DATA.verbPreps = [
  ['warten', 'auf', 'A', 'esperar a', 'Ich warte auf den Bus.'],
  ['denken', 'an', 'A', 'pensar en', 'Ich denke oft an dich.'],
  ['sich freuen', 'auf', 'A', 'tener ganas de (algo futuro)', 'Ich freue mich auf den Urlaub.'],
  ['sich freuen', 'über', 'A', 'alegrarse de (algo presente/pasado)', 'Sie freut sich über das Geschenk.'],
  ['sich interessieren', 'für', 'A', 'interesarse por', 'Er interessiert sich für Politik.'],
  ['sich kümmern', 'um', 'A', 'ocuparse de, cuidar de', 'Wer kümmert sich um den Hund?'],
  ['Angst haben', 'vor', 'D', 'tener miedo de', 'Sie hat Angst vor Spinnen.'],
  ['teilnehmen', 'an', 'D', 'participar en', 'Ich nehme an dem Kurs teil.'],
  ['sprechen', 'über', 'A', 'hablar sobre', 'Wir sprechen über das Problem.'],
  ['sprechen', 'mit', 'D', 'hablar con', 'Ich spreche mit meinem Chef.'],
  ['sich erinnern', 'an', 'A', 'acordarse de', 'Erinnerst du dich an unseren Urlaub?'],
  ['sich ärgern', 'über', 'A', 'enfadarse por', 'Er ärgert sich über den Stau.'],
  ['bitten', 'um', 'A', 'pedir (algo)', 'Ich bitte dich um Hilfe.'],
  ['fragen', 'nach', 'D', 'preguntar por', 'Der Tourist fragt nach dem Weg.'],
  ['sich beschäftigen', 'mit', 'D', 'ocuparse de, dedicarse a', 'Ich beschäftige mich mit Grammatik.'],
  ['sich bewerben', 'um', 'A', 'solicitar (un puesto)', 'Sie bewirbt sich um die Stelle.'],
  ['sich bewerben', 'bei', 'D', 'presentar candidatura en (empresa)', 'Er bewirbt sich bei einer Fluggesellschaft.'],
  ['gehören', 'zu', 'D', 'formar parte de', 'Mallorca gehört zu den Balearen.'],
  ['träumen', 'von', 'D', 'soñar con', 'Ich träume von einer Reise nach Japan.'],
  ['sich gewöhnen', 'an', 'A', 'acostumbrarse a', 'Ich gewöhne mich an das Wetter.'],
  ['achten', 'auf', 'A', 'prestar atención a', 'Achte auf den Verkehr!'],
  ['antworten', 'auf', 'A', 'responder a', 'Bitte antworte auf meine E-Mail.'],
  ['sich verlassen', 'auf', 'A', 'confiar en, contar con', 'Du kannst dich auf mich verlassen.'],
  ['abhängen', 'von', 'D', 'depender de', 'Das hängt vom Wetter ab.'],
  ['sich entschuldigen', 'für', 'A', 'disculparse por', 'Ich entschuldige mich für die Verspätung.'],
  ['erzählen', 'von', 'D', 'contar sobre', 'Erzähl mir von deiner Reise!'],
  ['halten', 'von', 'D', 'opinar de', 'Was hältst du von dem Plan?'],
  ['sich treffen', 'mit', 'D', 'quedar con', 'Ich treffe mich mit Freunden.'],
  ['Lust haben', 'auf', 'A', 'tener ganas de', 'Ich habe Lust auf ein Eis.'],
  ['sich vorbereiten', 'auf', 'A', 'prepararse para', 'Ich bereite mich auf die Prüfung vor.'],
  ['sich beschweren', 'über', 'A', 'quejarse de', 'Er beschwert sich über den Lärm.'],
  ['aufhören', 'mit', 'D', 'dejar de', 'Ich höre mit dem Rauchen auf.'],
  ['anfangen', 'mit', 'D', 'empezar con', 'Wir fangen mit der Lektion an.'],
  ['einladen', 'zu', 'D', 'invitar a', 'Ich lade dich zu meiner Party ein.'],
  ['glauben', 'an', 'A', 'creer en', 'Sie glaubt an das Gute im Menschen.'],
  ['sich konzentrieren', 'auf', 'A', 'concentrarse en', 'Konzentrier dich auf die Aufgabe!'],
  ['diskutieren', 'über', 'A', 'discutir sobre', 'Wir diskutieren über den Vertrag.'],
  ['sich bedanken', 'für', 'A', 'dar las gracias por', 'Ich bedanke mich für die Einladung.'],
  ['sich entscheiden', 'für', 'A', 'decidirse por', 'Ich habe mich für das blaue Auto entschieden.'],
  ['sich sorgen', 'um', 'A', 'preocuparse por', 'Sie sorgt sich um ihre Mutter.'],
  ['gratulieren', 'zu', 'D', 'felicitar por', 'Ich gratuliere dir zum Geburtstag.'],
  ['schreiben', 'an', 'A', 'escribir a', 'Ich schreibe einen Brief an meine Oma.'],
  ['sich unterhalten', 'mit', 'D', 'conversar con', 'Ich unterhalte mich mit dem Piloten.'],
  ['sich verabreden', 'mit', 'D', 'quedar con (cita)', 'Ich habe mich mit Anna verabredet.'],
  ['passen', 'zu', 'D', 'pegar con, ir bien con', 'Die Jacke passt zu deiner Hose.']
].map(([v, p, c, es, ex]) => ({ v, p, c, es, ex }));

/* ---------- EJERCICIOS DE CASOS (frases) ---------- */
DATA.caseDrills = [
  ['Ich fahre mit ___ Bus zur Arbeit.', ['dem', 'den', 'der', 'des'], 'dem', 'mit + Dativ; der Bus → dem Bus.'],
  ['Das Geschenk ist für ___ Mutter.', ['die', 'der', 'dem', 'den'], 'die', 'für + Akkusativ; femenino → die.'],
  ['Wir gehen durch ___ Park.', ['den', 'dem', 'der', 'das'], 'den', 'durch + Akkusativ; der Park → den Park.'],
  ['Er wohnt noch bei ___ Eltern.', ['seinen', 'seine', 'seiner', 'seines'], 'seinen', 'bei + Dativ plural → -en (seinen Eltern).'],
  ['Ich lege das Buch auf ___ Tisch.', ['den', 'dem', 'der', 'das'], 'den', 'Wechselpräposition + movimiento (wohin?) → Akkusativ.'],
  ['Das Buch liegt auf ___ Tisch.', ['dem', 'den', 'der', 'das'], 'dem', 'Wechselpräposition + posición (wo?) → Dativ.'],
  ['Wegen ___ Wetters bleiben wir zu Hause.', ['des', 'dem', 'den', 'der'], 'des', 'wegen + Genitiv; das Wetter → des Wetters.'],
  ['Sie kommt aus ___ Schweiz.', ['der', 'die', 'dem', 'den'], 'der', 'aus + Dativ; die Schweiz → der Schweiz.'],
  ['Ich hänge das Bild an ___ Wand.', ['die', 'der', 'den', 'dem'], 'die', 'Movimiento (wohin?) → Akkusativ: an die Wand.'],
  ['Das Bild hängt an ___ Wand.', ['der', 'die', 'den', 'dem'], 'der', 'Posición (wo?) → Dativ: an der Wand.'],
  ['Wir fahren heute in ___ Stadt.', ['die', 'der', 'den', 'dem'], 'die', 'Dirección (wohin?) → Akkusativ.'],
  ['Wir wohnen in ___ Stadt.', ['der', 'die', 'den', 'dem'], 'der', 'Lugar (wo?) → Dativ.'],
  ['Ohne ___ Handy gehe ich nie aus dem Haus.', ['mein', 'meinem', 'meinen', 'meines'], 'mein', 'ohne + Akkusativ; das Handy → mein Handy (neutro no cambia).'],
  ['Seit ___ Jahr lerne ich Deutsch.', ['einem', 'ein', 'einen', 'eines'], 'einem', 'seit + Dativ; das Jahr → einem Jahr.'],
  ['Ich helfe ___ Freund beim Umzug.', ['meinem', 'meinen', 'mein', 'meiner'], 'meinem', 'helfen rige Dativ.'],
  ['Kannst du ___ helfen? (yo)', ['mir', 'mich', 'mein', 'ich'], 'mir', 'helfen + Dativ → mir.'],
  ['Ich sehe ___ jeden Tag. (él)', ['ihn', 'ihm', 'er', 'sein'], 'ihn', 'sehen + Akkusativ → ihn.'],
  ['Das Auto gehört ___. (ellos)', ['ihnen', 'sie', 'ihr', 'ihre'], 'ihnen', 'gehören + Dativ; sie (plural) → ihnen.'],
  ['Ich danke ___ für alles. (tú)', ['dir', 'dich', 'du', 'dein'], 'dir', 'danken + Dativ → dir.'],
  ['Er hat ___ Hund und zwei Katzen.', ['einen', 'ein', 'einem', 'eines'], 'einen', 'haben + Akkusativ; der Hund → einen Hund.'],
  ['Die Katze schläft unter ___ Stuhl.', ['dem', 'den', 'der', 'das'], 'dem', 'Posición (wo?) → Dativ.'],
  ['Die Katze läuft unter ___ Stuhl.', ['den', 'dem', 'der', 'das'], 'den', 'Movimiento hacia (wohin?) → Akkusativ.'],
  ['Trotz ___ Regens gehen wir spazieren.', ['des', 'dem', 'den', 'der'], 'des', 'trotz + Genitiv; der Regen → des Regens.'],
  ['Ich gebe ___ Kind einen Apfel.', ['dem', 'den', 'das', 'der'], 'dem', 'Objeto indirecto (a quién) → Dativ.'],
  ['Sie geht morgen zu ___ Ärztin.', ['der', 'die', 'dem', 'den'], 'der', 'zu + Dativ; die Ärztin → zu der (zur) Ärztin.'],
  ['Wir spielen gegen ___ Mannschaft aus Berlin.', ['die', 'der', 'den', 'dem'], 'die', 'gegen + Akkusativ; femenino → die.'],
  ['Nach ___ Unterricht gehe ich nach Hause.', ['dem', 'den', 'der', 'des'], 'dem', 'nach + Dativ; der Unterricht → dem Unterricht.'],
  ['Ich warte schon lange auf ___ Zug.', ['den', 'dem', 'der', 'des'], 'den', 'warten auf + Akkusativ.'],
  ['Ich denke oft an ___ Urlaub in Mexiko.', ['den', 'dem', 'der', 'das'], 'den', 'denken an + Akkusativ.'],
  ['Sie hat Angst vor ___ Hund.', ['dem', 'den', 'der', 'das'], 'dem', 'Angst haben vor + Dativ.'],
  ['Er interessiert sich für ___ Geschichte.', ['die', 'der', 'den', 'dem'], 'die', 'sich interessieren für + Akkusativ.'],
  ['Das ist der Mann, ___ ich gestern gesehen habe.', ['den', 'der', 'dem', 'dessen'], 'den', 'Relativpronomen: sehen + Akk, masculino → den.'],
  ['Das ist die Frau, ___ ich geholfen habe.', ['der', 'die', 'den', 'deren'], 'der', 'Relativpronomen: helfen + Dat, femenino → der.'],
  ['Das sind die Kinder, ___ Eltern in Spanien leben.', ['deren', 'dessen', 'denen', 'die'], 'deren', 'Relativo genitivo plural (cuyos) → deren.'],
  ['Das ist das Flugzeug, mit ___ wir geflogen sind.', ['dem', 'das', 'den', 'der'], 'dem', 'mit + Dativ; neutro → dem.'],
  ['Während ___ Fluges habe ich geschlafen.', ['des', 'dem', 'den', 'der'], 'des', 'während + Genitiv; der Flug → des Fluges.'],
  ['Ich wasche ___ die Hände.', ['mir', 'mich', 'sich', 'mein'], 'mir', 'Reflexivo en Dativ cuando ya hay objeto en Akkusativ (die Hände).'],
  ['Ich wasche ___ jeden Morgen.', ['mich', 'mir', 'sich', 'mein'], 'mich', 'Reflexivo en Akkusativ (no hay otro objeto).'],
  ['Der Pilot fliegt über ___ Meer.', ['das', 'dem', 'den', 'der'], 'das', 'Movimiento que cruza (wohin?) → Akkusativ.'],
  ['Zwischen ___ Häusern steht ein Baum.', ['den', 'die', 'dem', 'der'], 'den', 'Posición → Dativ plural: den Häusern (+n).'],
  ['Ich habe ein Geschenk für ___. (vosotros)', ['euch', 'ihr', 'ihnen', 'eure'], 'euch', 'für + Akkusativ; ihr → euch.'],
  ['Er stellt die Flasche in ___ Kühlschrank.', ['den', 'dem', 'der', 'das'], 'den', 'stellen (wohin?) → Akkusativ.'],
  ['Die Flasche steht in ___ Kühlschrank.', ['dem', 'den', 'der', 'das'], 'dem', 'stehen (wo?) → Dativ (im Kühlschrank).'],
  ['Ich schreibe ___ Kollegin eine E-Mail.', ['meiner', 'meine', 'meinem', 'meinen'], 'meiner', 'Objeto indirecto femenino en Dativ → meiner.'],
  ['Das ist das Auto ___ Nachbarn.', ['meines', 'meinem', 'meinen', 'mein'], 'meines', 'Genitivo masculino (n-Deklination): meines Nachbarn.']
].map(([s, o, a, e]) => ({ s, o, a, e }));

/* ---------- TEMAS DE GRAMÁTICA ----------
   Secciones: { h, p, table:{head, rows, cols}, list, note }
   cols: clases de color por columna ('m','f','n','pl','')                         */
DATA.grammar = [
  {
    id: 'pronomen', title: 'Pronombres', sub: 'Personal, reflexivo, interrogativo',
    sections: [
      { h: 'Pronombres personales', table: {
        head: ['', 'Nominativ', 'Akkusativ', 'Dativ', 'Genitiv'],
        rows: [
          ['yo', 'ich', 'mich', 'mir', 'meiner'], ['tú', 'du', 'dich', 'dir', 'deiner'],
          ['él', 'er', 'ihn', 'ihm', 'seiner'], ['ella', 'sie', 'sie', 'ihr', 'ihrer'],
          ['ello', 'es', 'es', 'ihm', 'seiner'], ['nosotros', 'wir', 'uns', 'uns', 'unser'],
          ['vosotros', 'ihr', 'euch', 'euch', 'euer'], ['ellos', 'sie', 'sie', 'ihnen', 'ihrer'],
          ['usted(es)', 'Sie', 'Sie', 'Ihnen', 'Ihrer']
        ] },
        note: 'El genitivo personal casi no se usa (solo con algunos verbos: *Gedenken wir seiner*). Lo esencial: **Akk = objeto directo**, **Dat = objeto indirecto** (a quién).' },
      { h: 'Pronombres reflexivos', table: {
        head: ['', 'Akkusativ', 'Dativ'],
        rows: [['ich', 'mich', 'mir'], ['du', 'dich', 'dir'], ['er / sie / es', 'sich', 'sich'], ['wir', 'uns', 'uns'], ['ihr', 'euch', 'euch'], ['sie / Sie', 'sich', 'sich']] },
        note: 'Dativ cuando ya hay otro objeto en Akkusativ: *Ich wasche **mir** die Hände* — *Ich wasche **mich***.' },
      { h: 'Pronombres interrogativos', table: {
        head: ['', 'Personas', 'Cosas'],
        rows: [['Nominativ', 'wer?', 'was?'], ['Akkusativ', 'wen?', 'was?'], ['Dativ', 'wem?', '—'], ['Genitiv', 'wessen?', '—']] },
        note: 'Con preposición y cosas se usa **wo(r)- + preposición**: *Worauf wartest du?* — con personas: *Auf wen wartest du?*' },
      { h: 'Pronombres relativos (B1)', table: {
        head: ['', 'masc.', 'fem.', 'neutro', 'plural'], cols: ['', 'm', 'f', 'n', 'pl'],
        rows: [['Nom', 'der', 'die', 'das', 'die'], ['Akk', 'den', 'die', 'das', 'die'], ['Dat', 'dem', 'der', 'dem', 'denen'], ['Gen', 'dessen', 'deren', 'dessen', 'deren']] },
        note: 'Género y número del antecedente; **caso según su función en la oración relativa**. El verbo va al final: *Der Mann, **den** ich kenne, **wohnt** hier.*' }
    ]
  },
  {
    id: 'possessiv', title: 'Posesivos', sub: 'mein, dein, sein… y su declinación',
    sections: [
      { h: 'Posesivo por persona', table: {
        head: ['Persona', 'Posesivo', 'Español'],
        rows: [['ich', 'mein', 'mi'], ['du', 'dein', 'tu'], ['er / es', 'sein', 'su (de él)'], ['sie', 'ihr', 'su (de ella)'], ['wir', 'unser', 'nuestro'], ['ihr', 'euer', 'vuestro'], ['sie', 'ihr', 'su (de ellos)'], ['Sie', 'Ihr', 'su (de usted)']] } },
      { h: 'Declinación (se declina como «ein»)', table: {
        head: ['', 'masc.', 'fem.', 'neutro', 'plural'], cols: ['', 'm', 'f', 'n', 'pl'],
        rows: [['Nom', 'mein', 'meine', 'mein', 'meine'], ['Akk', 'meinen', 'meine', 'mein', 'meine'], ['Dat', 'meinem', 'meiner', 'meinem', 'meinen'], ['Gen', 'meines', 'meiner', 'meines', 'meiner']] },
        note: '**euer** pierde la -e- al declinarse: *eure Mutter, euren Vater*. Con **unser** se mantiene: *unsere, unseren*.' }
    ]
  },
  {
    id: 'artikel', title: 'Artículos', sub: 'der / ein / kein / dieser en los 4 casos',
    sections: [
      { h: 'Artículo determinado', table: {
        head: ['', 'masc.', 'fem.', 'neutro', 'plural'], cols: ['', 'm', 'f', 'n', 'pl'],
        rows: [['Nom', 'der', 'die', 'das', 'die'], ['Akk', 'den', 'die', 'das', 'die'], ['Dat', 'dem', 'der', 'dem', 'den (+n)'], ['Gen', 'des (+s)', 'der', 'des (+s)', 'der']] },
        note: 'Solo el **masculino** cambia en Akkusativ. En Dativ plural el sustantivo añade **-n** (*den Kindern*) salvo plurales en -s o -n.' },
      { h: 'Artículo indeterminado', table: {
        head: ['', 'masc.', 'fem.', 'neutro', 'plural'], cols: ['', 'm', 'f', 'n', 'pl'],
        rows: [['Nom', 'ein', 'eine', 'ein', '—'], ['Akk', 'einen', 'eine', 'ein', '—'], ['Dat', 'einem', 'einer', 'einem', '—'], ['Gen', 'eines', 'einer', 'eines', '—']] } },
      { h: 'Negación «kein»', table: {
        head: ['', 'masc.', 'fem.', 'neutro', 'plural'], cols: ['', 'm', 'f', 'n', 'pl'],
        rows: [['Nom', 'kein', 'keine', 'kein', 'keine'], ['Akk', 'keinen', 'keine', 'kein', 'keine'], ['Dat', 'keinem', 'keiner', 'keinem', 'keinen'], ['Gen', 'keines', 'keiner', 'keines', 'keiner']] } },
      { h: '«dieser» (igual: jeder, welcher, mancher, alle)', table: {
        head: ['', 'masc.', 'fem.', 'neutro', 'plural'], cols: ['', 'm', 'f', 'n', 'pl'],
        rows: [['Nom', 'dieser', 'diese', 'dieses', 'diese'], ['Akk', 'diesen', 'diese', 'dieses', 'diese'], ['Dat', 'diesem', 'dieser', 'diesem', 'diesen'], ['Gen', 'dieses', 'dieser', 'dieses', 'dieser']] } },
      { h: 'n-Deklination', p: 'Algunos masculinos añaden **-(e)n** en todos los casos salvo el Nominativ singular: der Junge → den/dem/des **Jungen**. Típicos: *der Mensch, der Kunde, der Kollege, der Nachbar, der Student, der Herr (Herrn), der Name (des Namens)*.' }
    ]
  },
  {
    id: 'adjektiv', title: 'Adjetivos', sub: 'Terminaciones débil, mixta y fuerte',
    sections: [
      { h: 'Regla rápida', list: [
        '**Débil** (tras der, dieser, jeder…): el artículo ya marca el caso → el adjetivo solo pone **-e** o **-en**.',
        '**Mixta** (tras ein, kein, mein…): igual que la débil salvo donde «ein» no marca nada (masc. Nom, neutro Nom/Akk) → **-er / -es**.',
        '**Fuerte** (sin artículo): el adjetivo toma la terminación del artículo determinado (dem → -em, der → -er…).',
        'Atajo: en **Dativ y Genitiv** casi todo es **-en**.'
      ] },
      { h: 'Débil — der gute Wein', table: {
        head: ['', 'masc.', 'fem.', 'neutro', 'plural'], cols: ['', 'm', 'f', 'n', 'pl'],
        rows: [['Nom', 'der gute', 'die gute', 'das gute', 'die guten'], ['Akk', 'den guten', 'die gute', 'das gute', 'die guten'], ['Dat', 'dem guten', 'der guten', 'dem guten', 'den guten'], ['Gen', 'des guten', 'der guten', 'des guten', 'der guten']] } },
      { h: 'Mixta — ein guter Wein', table: {
        head: ['', 'masc.', 'fem.', 'neutro', 'plural'], cols: ['', 'm', 'f', 'n', 'pl'],
        rows: [['Nom', 'ein guter', 'eine gute', 'ein gutes', 'keine guten'], ['Akk', 'einen guten', 'eine gute', 'ein gutes', 'keine guten'], ['Dat', 'einem guten', 'einer guten', 'einem guten', 'keinen guten'], ['Gen', 'eines guten', 'einer guten', 'eines guten', 'keiner guten']] } },
      { h: 'Fuerte — guter Wein', table: {
        head: ['', 'masc.', 'fem.', 'neutro', 'plural'], cols: ['', 'm', 'f', 'n', 'pl'],
        rows: [['Nom', 'guter', 'gute', 'gutes', 'gute'], ['Akk', 'guten', 'gute', 'gutes', 'gute'], ['Dat', 'gutem', 'guter', 'gutem', 'guten'], ['Gen', 'guten', 'guter', 'guten', 'guter']] } },
      { h: 'Comparativo y superlativo', table: {
        head: ['Positiv', 'Komparativ', 'Superlativ'],
        rows: [['schnell', 'schneller', 'am schnellsten'], ['alt', 'älter', 'am ältesten'], ['groß', 'größer', 'am größten'], ['gut', 'besser', 'am besten'], ['viel', 'mehr', 'am meisten'], ['gern', 'lieber', 'am liebsten'], ['hoch', 'höher', 'am höchsten'], ['nah', 'näher', 'am nächsten']] },
        note: 'Comparación: *größer **als*** (más que) — *so groß **wie*** (tan como).' }
    ]
  },
  {
    id: 'praepositionen', title: 'Preposiciones', sub: 'Akk, Dat, Wechsel y Genitiv', dynamic: 'preps'
  },
  {
    id: 'verbprep', title: 'Verbos con preposición', sub: 'warten auf + Akk…', dynamic: 'verbPreps'
  },
  {
    id: 'verben', title: 'Verbos irregulares', sub: 'Präsens, Präteritum, Partizip II', dynamic: 'verbs'
  },
  {
    id: 'zeiten', title: 'Tiempos verbales', sub: 'Perfekt, Präteritum, Futur, Passiv',
    sections: [
      { h: 'Resumen', table: {
        head: ['Tiempo', 'Formación', 'Ejemplo'],
        rows: [
          ['Präsens', 'raíz + -e, -st, -t, -en, -t, -en', 'Ich fliege heute.'],
          ['Perfekt', 'haben/sein + Partizip II (al final)', 'Ich bin nach Berlin geflogen.'],
          ['Präteritum', 'raíz + -te (regulares) / forma propia', 'Ich war müde. Ich hatte Zeit.'],
          ['Plusquamperfekt', 'hatte/war + Partizip II', 'Ich hatte schon gegessen.'],
          ['Futur I', 'werden + infinitivo', 'Ich werde Fluglotse.'],
          ['Passiv Präsens', 'werden + Partizip II', 'Das Flugzeug wird getankt.'],
          ['Passiv Präteritum', 'wurde + Partizip II', 'Der Flug wurde gestrichen.'],
          ['Passiv Perfekt', 'ist + Partizip II + worden', 'Der Flug ist gestrichen worden.']
        ] } },
      { h: 'Uso', list: [
        'Al hablar se usa sobre todo el **Perfekt**. El **Präteritum** se usa en textos escritos y, también al hablar, con **sein, haben, werden** y los **modales** (war, hatte, konnte, musste…).',
        '**Partizip II regular**: ge- + raíz + -t (gemacht). **Irregular**: ge- + raíz (a veces con cambio vocálico) + -en (gesprochen).',
        'Sin **ge-**: verbos con prefijo inseparable (besucht, verstanden) y terminados en **-ieren** (studiert, telefoniert).',
        'Separables: **ge** entre prefijo y raíz → *angerufen, aufgestanden*.'
      ] },
      { h: 'Präteritum regular — machen', table: {
        head: ['Persona', 'Präteritum'],
        rows: [['ich', 'machte'], ['du', 'machtest'], ['er / sie / es', 'machte'], ['wir', 'machten'], ['ihr', 'machtet'], ['sie / Sie', 'machten']] } }
    ]
  },
  {
    id: 'modal', title: 'Verbos modales', sub: 'können, müssen, dürfen…',
    sections: [
      { h: 'Presente', table: {
        head: ['', 'können', 'müssen', 'dürfen', 'sollen', 'wollen', 'mögen', 'möchten'],
        rows: [
          ['ich', 'kann', 'muss', 'darf', 'soll', 'will', 'mag', 'möchte'],
          ['du', 'kannst', 'musst', 'darfst', 'sollst', 'willst', 'magst', 'möchtest'],
          ['er/sie/es', 'kann', 'muss', 'darf', 'soll', 'will', 'mag', 'möchte'],
          ['wir', 'können', 'müssen', 'dürfen', 'sollen', 'wollen', 'mögen', 'möchten'],
          ['ihr', 'könnt', 'müsst', 'dürft', 'sollt', 'wollt', 'mögt', 'möchtet'],
          ['sie/Sie', 'können', 'müssen', 'dürfen', 'sollen', 'wollen', 'mögen', 'möchten']
        ] } },
      { h: 'Präteritum y Konjunktiv II', table: {
        head: ['Infinitivo', 'Significado', 'Präteritum', 'Konjunktiv II'],
        rows: [
          ['können', 'poder (capacidad, posibilidad)', 'konnte', 'könnte'],
          ['müssen', 'tener que', 'musste', 'müsste'],
          ['dürfen', 'poder (permiso)', 'durfte', 'dürfte'],
          ['sollen', 'deber (encargo de otro)', 'sollte', 'sollte'],
          ['wollen', 'querer (voluntad)', 'wollte', 'wollte'],
          ['mögen', 'gustar', 'mochte', 'möchte']
        ] } },
      { h: 'Ojo', list: [
        'El modal va en posición 2 y el **infinitivo al final**: *Ich **muss** heute lange **arbeiten**.*',
        '**nicht müssen** = no hace falta — **nicht dürfen** = está prohibido.',
        '*Du **solltest** mehr schlafen* = deberías (consejo, Konjunktiv II de sollen).'
      ] }
    ]
  },
  {
    id: 'konjunktiv', title: 'Konjunktiv II', sub: 'Deseos, consejos, cortesía, hipótesis',
    sections: [
      { h: 'Formas más usadas', table: {
        head: ['', 'sein', 'haben', 'werden (würde + inf.)', 'können'],
        rows: [['ich', 'wäre', 'hätte', 'würde', 'könnte'], ['du', 'wärst', 'hättest', 'würdest', 'könntest'], ['er/sie/es', 'wäre', 'hätte', 'würde', 'könnte'], ['wir', 'wären', 'hätten', 'würden', 'könnten'], ['ihr', 'wärt', 'hättet', 'würdet', 'könntet'], ['sie/Sie', 'wären', 'hätten', 'würden', 'könnten']] } },
      { h: 'Usos', list: [
        'Cortesía: *Könnten Sie mir helfen? Ich hätte gern einen Kaffee.*',
        'Deseo irreal: *Wenn ich mehr Zeit **hätte**, **würde** ich mehr reisen.*',
        'Consejo: *An deiner Stelle **würde** ich das Angebot annehmen.*',
        'Pasado: **hätte/wäre + Partizip II** → *Ich **hätte** fast den Flug **verpasst**.*'
      ] }
    ]
  },
  {
    id: 'trennbar', title: 'Verbos separables', sub: 'Prefijos separables e inseparables',
    sections: [
      { h: 'Prefijos', table: {
        head: ['Tipo', 'Prefijos', 'Ejemplo'],
        rows: [
          ['Separables (tónicos)', 'ab-, an-, auf-, aus-, bei-, ein-, fest-, her-, hin-, los-, mit-, nach-, vor-, weg-, weiter-, zu-, zurück-, zusammen-', 'Ich **rufe** dich morgen **an**.'],
          ['Inseparables (átonos)', 'be-, emp-, ent-, er-, ge-, miss-, ver-, zer-', 'Ich **besuche** meine Eltern.'],
          ['Variables', 'durch-, über-, um-, unter-, wieder-', '*übersetzen* (traducir, insep.) / *übersetzen* (cruzar en barco, sep.)']
        ] } },
      { h: 'Comportamiento', table: {
        head: ['', 'Separable (anrufen)', 'Inseparable (besuchen)'],
        rows: [
          ['Presente', 'Ich rufe ihn an.', 'Ich besuche ihn.'],
          ['Con modal', 'Ich muss ihn anrufen.', 'Ich muss ihn besuchen.'],
          ['Subordinada', '…, weil ich ihn anrufe.', '…, weil ich ihn besuche.'],
          ['Perfekt', 'Ich habe ihn angerufen.', 'Ich habe ihn besucht.'],
          ['zu + inf.', 'Ich habe vergessen, ihn anzurufen.', 'Ich habe vergessen, ihn zu besuchen.']
        ] } }
    ]
  },
  {
    id: 'satzbau', title: 'Orden y conectores', sub: 'Posición del verbo, weil, deshalb…',
    sections: [
      { h: 'Posición del verbo', list: [
        '**Oración principal**: verbo conjugado en **posición 2**. *Morgen **fliege** ich nach Hamburg.*',
        '**Subordinada**: verbo conjugado **al final**. *…, weil ich morgen nach Hamburg **fliege**.*',
        '**Pregunta sí/no** e imperativo: verbo en posición 1. ***Kommst** du mit?*',
        'Orden en el centro: **Te-Ka-Mo-Lo** (temporal, causal, modal, local): *Ich fahre **morgen wegen des Termins mit dem Zug nach Madrid**.*'
      ] },
      { h: 'Conectores', table: {
        head: ['Tipo', 'Conectores', 'Efecto', 'Ejemplo'],
        rows: [
          ['Posición 0', 'und, aber, oder, denn, sondern', 'no cambia el orden', 'Ich bleibe zu Hause, **denn** ich bin müde.'],
          ['Subordinantes', 'weil, dass, ob, wenn, als, obwohl, damit, bevor, nachdem, während, bis, seitdem, falls, sodass', 'verbo al final', 'Ich bleibe zu Hause, **weil** ich müde **bin**.'],
          ['Adverbios conectores', 'deshalb, deswegen, darum, trotzdem, dann, danach, außerdem, sonst, also', 'inversión (verbo justo detrás)', 'Ich bin müde, **deshalb bleibe** ich zu Hause.'],
          ['Dobles', 'entweder…oder, weder…noch, sowohl…als auch, nicht nur…sondern auch, je…desto', '—', '**Je** mehr ich lerne, **desto** besser spreche ich.']
        ] } },
      { h: 'wenn / als / ob', list: [
        '**wenn**: si (condición) o cuando (presente/futuro o repetido en pasado).',
        '**als**: cuando (hecho único en el pasado). *Als ich Kind war, …*',
        '**ob**: si (pregunta indirecta). *Ich weiß nicht, ob er kommt.*'
      ] },
      { h: 'Infinitivo con zu', list: [
        '*Ich habe keine Lust, heute **zu** kochen.* — *Es ist wichtig, pünktlich **zu** sein.*',
        '**um … zu** (para), **ohne … zu** (sin), **statt … zu** (en lugar de): *Ich lerne Deutsch, **um** in Deutschland **zu** arbeiten.*'
      ] }
    ]
  },
  {
    id: 'genus', title: 'Género y plural', sub: 'Pistas para acertar el artículo',
    sections: [
      { h: 'Suelen ser masculinos (der)', list: [
        'Días, meses, estaciones y puntos cardinales: *der Montag, der Mai, der Winter, der Norden*.',
        'Fenómenos meteorológicos: *der Regen, der Schnee, der Wind* (pero *das Gewitter, das Wetter*).',
        'Terminaciones **-er** (agentes), **-ling, -ismus, -or, -ig, -ich, -ant, -ist**: *der Lehrer, der Frühling, der Motor, der Honig*.',
        'Sustantivos de raíz verbal sin sufijo: *der Flug, der Gang, der Anfang*.'
      ] },
      { h: 'Suelen ser femeninos (die)', list: [
        'Terminaciones **-ung, -heit, -keit, -schaft, -ion, -tät, -ik, -ei, -ie, -enz, -ur**: *die Landung, die Freiheit, die Information, die Musik*.',
        'Casi todos los terminados en **-e**: *die Lampe, die Reise* (excepciones: *der Junge, der Name, das Auge, das Ende*).',
        'Números como sustantivos: *die Eins, die Zehn*.'
      ] },
      { h: 'Suelen ser neutros (das)', list: [
        'Diminutivos **-chen, -lein**: *das Mädchen, das Fräulein*.',
        'Infinitivos sustantivados: *das Essen, das Fliegen*.',
        'Terminaciones **-um, -ment, -ma (muchos), -nis (muchos)**: *das Zentrum, das Dokument, das Thema, das Ergebnis*.',
        'Muchos con **Ge-**: *das Gebäude, das Gepäck, das Gewitter*.',
        'Metales y colores sustantivados: *das Gold, das Blau*.'
      ] },
      { h: 'Formación del plural', table: {
        head: ['Terminación', 'Típico de', 'Ejemplo'],
        rows: [
          ['-e (a veces con ¨)', 'masculinos y neutros monosílabos', 'der Tag → Tage, der Zug → Züge'],
          ['-er (con ¨ si puede)', 'neutros monosílabos', 'das Kind → Kinder, das Buch → Bücher'],
          ['-(e)n', 'femeninos; n-Deklination', 'die Frau → Frauen, die Lampe → Lampen'],
          ['-nen', 'femeninos en -in', 'die Lehrerin → Lehrerinnen'],
          ['– (sin cambio, a veces ¨)', 'masc./neutros en -er, -el, -en, -chen', 'der Lehrer → Lehrer, der Vater → Väter'],
          ['-s', 'extranjerismos, terminados en vocal', 'das Auto → Autos, das Handy → Handys']
        ] },
        note: 'En plural el artículo siempre es **die** (Nom/Akk), **den** (+n) en Dativ y **der** en Genitiv.' }
    ]
  },
  {
    id: 'zahlen', title: 'Números, hora y fecha', sub: 'Zahlen, Uhrzeit, Datum',
    sections: [
      { h: 'Números', table: {
        head: ['', '', '', ''],
        rows: [
          ['0 null', '1 eins', '2 zwei', '3 drei'], ['4 vier', '5 fünf', '6 sechs', '7 sieben'],
          ['8 acht', '9 neun', '10 zehn', '11 elf'], ['12 zwölf', '13 dreizehn', '16 sechzehn', '17 siebzehn'],
          ['20 zwanzig', '21 einundzwanzig', '30 dreißig', '40 vierzig'], ['60 sechzig', '70 siebzig', '100 (ein)hundert', '1000 (ein)tausend'],
          ['1.000.000 eine Million', '1.000.000.000 eine Milliarde', '2027 zweitausendsiebenundzwanzig', '1995 neunzehnhundertfünfundneunzig']
        ] },
        note: 'Las unidades van **antes** de las decenas: 47 = *sieben**und**vierzig*. Los años de 1100 a 1999 se dicen en centenas: *neunzehnhundert…*' },
      { h: 'Ordinales', list: [
        '1-19: número + **-te** → der zwei**te**, vier**te** (irregulares: **erste, dritte, siebte, achte**).',
        'Desde 20: número + **-ste** → der zwanzig**ste**, hundert**ste**.',
        'Fecha: *Heute ist **der** erste Mai.* — *Ich fliege **am** fünfzehnten Januar.* (escrito: am 15.01.)'
      ] },
      { h: 'La hora (informal)', table: {
        head: ['Hora', 'Alemán', 'Ojo'],
        rows: [
          ['8:00', 'acht Uhr', ''], ['8:05', 'fünf nach acht', ''], ['8:15', 'Viertel nach acht', ''],
          ['8:20', 'zwanzig nach acht / zehn vor halb neun', ''], ['8:30', '**halb neun**', '¡media hacia la siguiente hora!'],
          ['8:45', 'Viertel vor neun', ''], ['8:55', 'fünf vor neun', '']
        ] },
        note: 'Formal / oficial (aviación, trenes): *acht Uhr dreißig, zwanzig Uhr fünfzehn*. Preguntas: *Wie spät ist es? — Um wie viel Uhr …?*' },
      { h: 'Días y meses', list: [
        '**Días** (der): Montag, Dienstag, Mittwoch, Donnerstag, Freitag, Samstag, Sonntag — *am Montag*.',
        '**Meses** (der): Januar, Februar, März, April, Mai, Juni, Juli, August, September, Oktober, November, Dezember — *im Januar*.',
        '**Estaciones** (der): Frühling, Sommer, Herbst, Winter — *im Sommer*.'
      ] }
    ]
  }
];
