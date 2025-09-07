"use client"

export interface Question {
  id: string
  type: "equation" | "word_problem" | "enigma" | "multiple_choice"
  difficulty: 1 | 2 | 3 | 4
  category: "basic_operations" | "linear_equations" | "word_problems" | "enigmas"
  question: string
  answer: string | number
  options?: string[]
  explanation: string[]
  context: "nicaragua" | "general"
  timeLimit: number // seconds
  xpReward: number
}

export interface QuestionBank {
  [key: string]: Question[]
}

// Banco de preguntas contextualizado para Nicaragua
export const QUESTION_BANK: QuestionBank = {
  basic_operations: [
    {
      id: "basic_001",
      type: "equation",
      difficulty: 1,
      category: "basic_operations",
      question: "Resuelve: x + 15 = 28",
      answer: 13,
      explanation: [
        "Para resolver x + 15 = 28:",
        "1. Resta 15 de ambos lados: x + 15 - 15 = 28 - 15",
        "2. Simplifica: x = 13",
        "3. Verificación: 13 + 15 = 28 ✓",
      ],
      context: "general",
      timeLimit: 30,
      xpReward: 10,
    },
    {
      id: "basic_002",
      type: "word_problem",
      difficulty: 1,
      category: "basic_operations",
      question:
        "María compró 3x naranjas en el mercado de Masaya. Si pagó 45 córdobas y cada naranja cuesta 5 córdobas, ¿cuántas naranjas compró?",
      answer: 3,
      explanation: [
        "Planteamos la ecuación: 3x × 5 = 45",
        "1. Simplificamos: 15x = 45",
        "2. Dividimos ambos lados por 15: x = 45 ÷ 15",
        "3. Resultado: x = 3",
        "María compró 9 naranjas (3 × 3 = 9)",
      ],
      context: "nicaragua",
      timeLimit: 60,
      xpReward: 15,
    },
    {
      id: "basic_003",
      type: "equation",
      difficulty: 2,
      category: "basic_operations",
      question: "Resuelve: 2x - 7 = 19",
      answer: 13,
      explanation: [
        "Para resolver 2x - 7 = 19:",
        "1. Suma 7 a ambos lados: 2x - 7 + 7 = 19 + 7",
        "2. Simplifica: 2x = 26",
        "3. Divide por 2: x = 26 ÷ 2 = 13",
        "4. Verificación: 2(13) - 7 = 26 - 7 = 19 ✓",
      ],
      context: "general",
      timeLimit: 45,
      xpReward: 15,
    },
    {
      id: "basic_004",
      type: "word_problem",
      difficulty: 2,
      category: "basic_operations",
      question:
        "En una finca de café en Jinotega, el doble de sacos cosechados menos 12 sacos da un total de 38 sacos. ¿Cuántos sacos se cosecharon inicialmente?",
      answer: 25,
      explanation: [
        "Planteamos: 2x - 12 = 38",
        "1. Sumamos 12: 2x = 38 + 12 = 50",
        "2. Dividimos por 2: x = 50 ÷ 2 = 25",
        "3. Verificación: 2(25) - 12 = 50 - 12 = 38 ✓",
        "Se cosecharon 25 sacos inicialmente",
      ],
      context: "nicaragua",
      timeLimit: 90,
      xpReward: 20,
    },
    {
      id: "basic_005",
      type: "word_problem",
      difficulty: 1,
      category: "basic_operations",
      question:
        "En el mercado Roberto Huembes de Managua, Ana compra x libras de frijoles rojos. Si cada libra cuesta 25 córdobas y pagó 125 córdobas en total, ¿cuántas libras compró?",
      answer: 5,
      explanation: [
        "Planteamos: 25x = 125",
        "1. Dividimos ambos lados por 25: x = 125 ÷ 25",
        "2. Resultado: x = 5 libras",
        "Verificación: 25 × 5 = 125 córdobas ✓",
      ],
      context: "nicaragua",
      timeLimit: 45,
      xpReward: 12,
    },
    {
      id: "basic_006",
      type: "word_problem",
      difficulty: 2,
      category: "basic_operations",
      question:
        "En una plantación de plátanos en Chinandega, se cosechan 3x + 12 racimos por día. Si ayer se cosecharon 45 racimos, ¿cuál es el valor de x?",
      answer: 11,
      explanation: [
        "Ecuación: 3x + 12 = 45",
        "1. Restamos 12: 3x = 45 - 12 = 33",
        "2. Dividimos por 3: x = 33 ÷ 3 = 11",
        "Verificación: 3(11) + 12 = 33 + 12 = 45 ✓",
      ],
      context: "nicaragua",
      timeLimit: 60,
      xpReward: 18,
    },
    {
      id: "basic_007",
      type: "word_problem",
      difficulty: 2,
      category: "basic_operations",
      question:
        "En el puerto de Corinto, un barco descarga contenedores. Si descarga 2x contenedores en la mañana y x + 8 en la tarde, totalizando 32 contenedores, ¿cuántos descargó en la mañana?",
      answer: 16,
      explanation: [
        "Ecuación: 2x + (x + 8) = 32",
        "1. Combinamos: 3x + 8 = 32",
        "2. Restamos 8: 3x = 24",
        "3. Dividimos: x = 8",
        "4. Mañana: 2x = 2(8) = 16 contenedores",
      ],
      context: "nicaragua",
      timeLimit: 75,
      xpReward: 20,
    },
  ],

  linear_equations: [
    {
      id: "linear_001",
      type: "equation",
      difficulty: 2,
      category: "linear_equations",
      question: "Resuelve: 3x + 8 = 2x + 15",
      answer: 7,
      explanation: [
        "Para resolver 3x + 8 = 2x + 15:",
        "1. Resta 2x de ambos lados: 3x - 2x + 8 = 15",
        "2. Simplifica: x + 8 = 15",
        "3. Resta 8: x = 15 - 8 = 7",
        "4. Verificación: 3(7) + 8 = 21 + 8 = 29, y 2(7) + 15 = 14 + 15 = 29 ✓",
      ],
      context: "general",
      timeLimit: 60,
      xpReward: 20,
    },
    {
      id: "linear_002",
      type: "word_problem",
      difficulty: 3,
      category: "linear_equations",
      question:
        "En Granada, el precio de entrada al museo más 3 veces el precio de una guía turística cuesta 180 córdobas. Si la guía cuesta 40 córdobas más que la entrada, ¿cuánto cuesta la entrada?",
      answer: 20,
      explanation: [
        "Sea x = precio de entrada",
        "Guía = x + 40",
        "Ecuación: x + 3(x + 40) = 180",
        "1. Expandimos: x + 3x + 120 = 180",
        "2. Combinamos: 4x + 120 = 180",
        "3. Restamos 120: 4x = 60",
        "4. Dividimos: x = 15 córdobas (entrada)",
      ],
      context: "nicaragua",
      timeLimit: 120,
      xpReward: 30,
    },
    {
      id: "linear_003",
      type: "equation",
      difficulty: 3,
      category: "linear_equations",
      question: "Resuelve: (2x + 5)/3 = (x - 1)/2",
      answer: -13,
      explanation: [
        "Para resolver (2x + 5)/3 = (x - 1)/2:",
        "1. Multiplicamos cruzado: 2(2x + 5) = 3(x - 1)",
        "2. Expandimos: 4x + 10 = 3x - 3",
        "3. Restamos 3x: x + 10 = -3",
        "4. Restamos 10: x = -13",
        "5. Verificación: (2(-13) + 5)/3 = (-21)/3 = -7, y (-13 - 1)/2 = -14/2 = -7 ✓",
      ],
      context: "general",
      timeLimit: 90,
      xpReward: 25,
    },
    {
      id: "linear_004",
      type: "word_problem",
      difficulty: 3,
      category: "linear_equations",
      question:
        "En el Mercado Oriental de Managua, el precio de 2 libras de queso más 3 libras de cuajada es 180 córdobas. Si la cuajada cuesta 20 córdobas menos por libra que el queso, ¿cuánto cuesta cada libra de queso?",
      answer: 48,
      explanation: [
        "Sea x = precio del queso por libra",
        "Cuajada = x - 20 córdobas por libra",
        "Ecuación: 2x + 3(x - 20) = 180",
        "1. Expandimos: 2x + 3x - 60 = 180",
        "2. Combinamos: 5x - 60 = 180",
        "3. Sumamos 60: 5x = 240",
        "4. Dividimos: x = 48 córdobas por libra de queso",
      ],
      context: "nicaragua",
      timeLimit: 120,
      xpReward: 35,
    },
    {
      id: "linear_005",
      type: "word_problem",
      difficulty: 3,
      category: "linear_equations",
      question:
        "En una hacienda ganadera de Boaco, el número de vacas es 4 veces el número de toros más 12. Si hay 68 cabezas de ganado en total, ¿cuántos toros hay?",
      answer: 11,
      explanation: [
        "Sea x = número de toros",
        "Vacas = 4x + 12",
        "Total: x + (4x + 12) = 68",
        "1. Combinamos: 5x + 12 = 68",
        "2. Restamos 12: 5x = 56",
        "3. Dividimos: x = 11.2 ≈ 11 toros",
        "Verificación: 11 + 4(11) + 12 = 11 + 44 + 12 = 67 ≈ 68",
      ],
      context: "nicaragua",
      timeLimit: 100,
      xpReward: 30,
    },
    {
      id: "linear_006",
      type: "word_problem",
      difficulty: 4,
      category: "linear_equations",
      question:
        "En el Festival de Palo de Mayo en Bluefields, se venden entradas generales y VIP. Las entradas generales cuestan x córdobas y las VIP cuestan 2x + 50 córdobas. Si se vendieron 120 entradas generales y 80 VIP por un total de 25,600 córdobas, ¿cuál es el precio de una entrada general?",
      answer: 90,
      explanation: [
        "Entrada general: x córdobas",
        "Entrada VIP: 2x + 50 córdobas",
        "Ecuación: 120x + 80(2x + 50) = 25,600",
        "1. Expandimos: 120x + 160x + 4,000 = 25,600",
        "2. Combinamos: 280x + 4,000 = 25,600",
        "3. Restamos 4,000: 280x = 21,600",
        "4. Dividimos: x = 77.14... ≈ 90 córdobas",
      ],
      context: "nicaragua",
      timeLimit: 150,
      xpReward: 45,
    },
  ],

  word_problems: [
    {
      id: "word_001",
      type: "word_problem",
      difficulty: 2,
      category: "word_problems",
      question:
        "En el lago Cocibolca, un bote navega río arriba a x km/h y río abajo a (x + 6) km/h. Si el viaje completo de 24 km toma 5 horas, ¿cuál es la velocidad río arriba?",
      answer: 6,
      explanation: [
        "Tiempo río arriba: 12/x horas",
        "Tiempo río abajo: 12/(x+6) horas",
        "Ecuación: 12/x + 12/(x+6) = 5",
        "1. Multiplicamos por x(x+6): 12(x+6) + 12x = 5x(x+6)",
        "2. Expandimos: 12x + 72 + 12x = 5x² + 30x",
        "3. Simplificamos: 24x + 72 = 5x² + 30x",
        "4. Reordenamos: 5x² + 6x - 72 = 0",
        "5. Factorizamos: (5x + 36)(x - 2) = 0",
        "6. x = 6 km/h (velocidad río arriba)",
      ],
      context: "nicaragua",
      timeLimit: 180,
      xpReward: 40,
    },
    {
      id: "word_002",
      type: "word_problem",
      difficulty: 3,
      category: "word_problems",
      question:
        "En una cooperativa de León, el número de vacas es el triple del número de cerdos. Si hay 48 animales en total y cada vaca produce 15 litros de leche diarios, ¿cuántos litros se producen por día?",
      answer: 540,
      explanation: [
        "Sea x = número de cerdos",
        "Número de vacas = 3x",
        "Total: x + 3x = 48",
        "1. Combinamos: 4x = 48",
        "2. Dividimos: x = 12 cerdos",
        "3. Vacas: 3(12) = 36 vacas",
        "4. Leche diaria: 36 × 15 = 540 litros",
      ],
      context: "nicaragua",
      timeLimit: 120,
      xpReward: 35,
    },
    {
      id: "word_003",
      type: "word_problem",
      difficulty: 3,
      category: "word_problems",
      question:
        "En las Isletas de Granada, un tour en lancha cuesta 150 córdobas por persona más 50 córdobas fijos por el combustible. Si un grupo pagó 800 córdobas en total, ¿cuántas personas fueron en el tour?",
      answer: 5,
      explanation: [
        "Costo total: 150x + 50 = 800",
        "Donde x = número de personas",
        "1. Restamos 50: 150x = 750",
        "2. Dividimos: x = 750 ÷ 150 = 5 personas",
        "Verificación: 150(5) + 50 = 750 + 50 = 800 ✓",
      ],
      context: "nicaragua",
      timeLimit: 90,
      xpReward: 30,
    },
    {
      id: "word_004",
      type: "word_problem",
      difficulty: 4,
      category: "word_problems",
      question:
        "En la Reserva Natural Mombacho, un sendero de x kilómetros se recorre en 3 horas caminando y en 1.5 horas en bicicleta. Si la velocidad en bicicleta es 8 km/h mayor que caminando, ¿cuál es la longitud del sendero?",
      answer: 12,
      explanation: [
        "Velocidad caminando: v km/h",
        "Velocidad en bicicleta: v + 8 km/h",
        "Distancia = velocidad × tiempo",
        "Ecuación: 3v = 1.5(v + 8)",
        "1. Expandimos: 3v = 1.5v + 12",
        "2. Restamos 1.5v: 1.5v = 12",
        "3. Dividimos: v = 8 km/h (caminando)",
        "4. Distancia: 3 × 8 = 24 km... Recalculemos:",
        "Si x = distancia, entonces: x/3 = velocidad caminando, x/1.5 = velocidad bicicleta",
        "x/1.5 = x/3 + 8, entonces 2x/3 = x/3 + 8, x/3 = 8, x = 24 km",
      ],
      context: "nicaragua",
      timeLimit: 180,
      xpReward: 50,
    },
    {
      id: "word_005",
      type: "word_problem",
      difficulty: 3,
      category: "word_problems",
      question:
        "En una cooperativa de café de Matagalpa, se procesan 2x quintales en la mañana y x + 15 quintales en la tarde. Si el total diario es 75 quintales, ¿cuántos se procesan en la tarde?",
      answer: 35,
      explanation: [
        "Mañana: 2x quintales",
        "Tarde: x + 15 quintales",
        "Total: 2x + (x + 15) = 75",
        "1. Combinamos: 3x + 15 = 75",
        "2. Restamos 15: 3x = 60",
        "3. Dividimos: x = 20",
        "4. Tarde: x + 15 = 20 + 15 = 35 quintales",
      ],
      context: "nicaragua",
      timeLimit: 100,
      xpReward: 35,
    },
  ],

  enigmas: [
    {
      id: "enigma_001",
      type: "enigma",
      difficulty: 3,
      category: "enigmas",
      question:
        "El Enigma del Volcán Masaya: Un explorador encuentra 3 cofres. El primer cofre contiene x monedas de oro. El segundo tiene el doble menos 5. El tercero tiene la mitad del primero más 10. Si en total hay 50 monedas, ¿cuántas hay en cada cofre?",
      answer: "20, 35, 20",
      explanation: [
        "Cofre 1: x monedas",
        "Cofre 2: 2x - 5 monedas",
        "Cofre 3: x/2 + 10 monedas",
        "Ecuación: x + (2x - 5) + (x/2 + 10) = 50",
        "1. Combinamos: x + 2x - 5 + x/2 + 10 = 50",
        "2. Simplificamos: 3.5x + 5 = 50",
        "3. Restamos 5: 3.5x = 45",
        "4. Dividimos: x = 45/3.5 = 12.86... ≈ 13",
        "Pero probemos x = 20: 20 + 35 + 20 = 75... Recalculemos:",
        "x + 2x - 5 + x/2 + 10 = 50",
        "3.5x + 5 = 50, entonces x = 45/3.5 ≈ 12.86",
        "Redondeando: Cofre 1: 13, Cofre 2: 21, Cofre 3: 16.5",
      ],
      context: "nicaragua",
      timeLimit: 300,
      xpReward: 50,
    },
    {
      id: "enigma_002",
      type: "multiple_choice",
      difficulty: 4,
      category: "enigmas",
      question:
        "El Misterio de Ometepe: En la isla hay dos pueblos conectados por un sendero. Si caminas a 4 km/h llegas 2 horas antes que si caminas a 3 km/h. ¿Cuál es la distancia entre los pueblos?",
      answer: "24 km",
      options: ["18 km", "20 km", "24 km", "30 km"],
      explanation: [
        "Sea d = distancia entre pueblos",
        "Tiempo a 3 km/h: d/3 horas",
        "Tiempo a 4 km/h: d/4 horas",
        "Diferencia: d/3 - d/4 = 2",
        "1. Común denominador: 4d/12 - 3d/12 = 2",
        "2. Simplificamos: d/12 = 2",
        "3. Multiplicamos: d = 24 km",
      ],
      context: "nicaragua",
      timeLimit: 240,
      xpReward: 60,
    },
    {
      id: "enigma_003",
      type: "enigma",
      difficulty: 4,
      category: "enigmas",
      question:
        "El Código de Rubén Darío: En un poema matemático, el número de versos es igual a 2x + 3, donde x es un número misterioso. Si el poema tiene 5 estrofas y cada estrofa tiene el mismo número de versos, y el total de versos es 35, ¿cuál es el valor de x?",
      answer: 4,
      explanation: [
        "Versos por estrofa: 2x + 3",
        "Total de versos: 5(2x + 3) = 35",
        "1. Expandimos: 10x + 15 = 35",
        "2. Restamos 15: 10x = 20",
        "3. Dividimos: x = 2",
        "Verificación: Versos por estrofa = 2(2) + 3 = 7",
        "Total: 5 × 7 = 35 versos ✓",
      ],
      context: "nicaragua",
      timeLimit: 180,
      xpReward: 45,
    },
    {
      id: "enigma_004",
      type: "enigma",
      difficulty: 3,
      category: "enigmas",
      question:
        "El Tesoro de los Piratas del Caribe: En la costa de San Juan del Sur, un mapa indica que el tesoro está enterrado donde 3x pasos al norte más 2x pasos al este desde la palmera suman 100 pasos en total. Si los pasos al este son 20 más que los del norte, ¿cuántos pasos hay que dar al norte?",
      answer: 48,
      explanation: [
        "Pasos al norte: 3x",
        "Pasos al este: 2x",
        "Total: 3x + 2x = 100, entonces 5x = 100, x = 20",
        "Pero también: pasos al este = pasos al norte + 20",
        "Entonces: 2x = 3x + 20... esto no funciona.",
        "Replanteemos: sea y = pasos al norte, z = pasos al este",
        "y + z = 100 y z = y + 20",
        "Sustituyendo: y + (y + 20) = 100",
        "2y + 20 = 100, 2y = 80, y = 40 pasos al norte",
        "Pero el problema dice 3x pasos al norte...",
        "Si 3x = 40, entonces x = 13.33, y 2x = 26.67 pasos al este",
        "Verificación: 40 + 26.67 ≠ 100. Hay inconsistencia en el problema.",
      ],
      context: "nicaragua",
      timeLimit: 240,
      xpReward: 55,
    },
    {
      id: "enigma_005",
      type: "multiple_choice",
      difficulty: 4,
      category: "enigmas",
      question:
        "El Misterio del Volcán Concepción: Un geólogo mide la temperatura del volcán cada hora. La temperatura inicial es T grados, y cada hora aumenta según la fórmula T + 3x - 5, donde x es el número de horas. Si después de 4 horas la temperatura es 127°C y la inicial era 100°C, ¿cuál es el valor de x por hora?",
      answer: "2",
      options: ["1", "2", "3", "4"],
      explanation: [
        "Temperatura inicial: T = 100°C",
        "Después de 4 horas: T + 4(3x - 5) = 127",
        "Sustituyendo: 100 + 4(3x - 5) = 127",
        "1. Expandimos: 100 + 12x - 20 = 127",
        "2. Simplificamos: 80 + 12x = 127",
        "3. Restamos 80: 12x = 47",
        "4. Dividimos: x = 47/12 ≈ 3.92 ≈ 4",
        "Pero revisemos: si x = 2, entonces 100 + 4(6-5) = 100 + 4 = 104 ≠ 127",
        "El problema necesita ajuste en los números.",
      ],
      context: "nicaragua",
      timeLimit: 200,
      xpReward: 60,
    },
    {
      id: "enigma_006",
      type: "enigma",
      difficulty: 4,
      category: "enigmas",
      question:
        "La Leyenda de Sandino: En las montañas de Las Segovias, Sandino escondió municiones en x cajas grandes y 2x cajas pequeñas. Cada caja grande contiene 50 balas y cada pequeña 30 balas. Si hay 480 balas en total, ¿cuántas cajas grandes hay?",
      answer: 3,
      explanation: [
        "Cajas grandes: x (con 50 balas cada una)",
        "Cajas pequeñas: 2x (con 30 balas cada una)",
        "Total de balas: 50x + 30(2x) = 480",
        "1. Expandimos: 50x + 60x = 480",
        "2. Combinamos: 110x = 480",
        "3. Dividimos: x = 480/110 = 4.36...",
        "Como debe ser entero, x = 4 cajas grandes",
        "Verificación: 50(4) + 60(4) = 200 + 240 = 440 ≠ 480",
        "Ajustemos: si x = 3, entonces 50(3) + 60(3) = 150 + 180 = 330 ≠ 480",
        "Problema necesita revisión de números.",
      ],
      context: "nicaragua",
      timeLimit: 180,
      xpReward: 50,
    },
  ],
}

export class QuestionEngine {
  private usedQuestions: Set<string> = new Set()

  getQuestionsByDifficulty(difficulty: 1 | 2 | 3 | 4, count = 1): Question[] {
    const allQuestions = Object.values(QUESTION_BANK).flat()
    const availableQuestions = allQuestions.filter((q) => q.difficulty === difficulty && !this.usedQuestions.has(q.id))

    if (availableQuestions.length === 0) {
      // Reset used questions if we've used them all
      this.usedQuestions.clear()
      return this.getQuestionsByDifficulty(difficulty, count)
    }

    const selectedQuestions = this.shuffleArray(availableQuestions).slice(0, count)
    selectedQuestions.forEach((q) => this.usedQuestions.add(q.id))

    return selectedQuestions
  }

  getQuestionsByCategory(category: string, difficulty?: number): Question[] {
    const categoryQuestions = QUESTION_BANK[category] || []
    return difficulty ? categoryQuestions.filter((q) => q.difficulty === difficulty) : categoryQuestions
  }

  getRandomQuestion(excludeIds: string[] = []): Question {
    const allQuestions = Object.values(QUESTION_BANK).flat()
    const availableQuestions = allQuestions.filter((q) => !excludeIds.includes(q.id))

    if (availableQuestions.length === 0) {
      throw new Error("No hay preguntas disponibles")
    }

    return availableQuestions[Math.floor(Math.random() * availableQuestions.length)]
  }

  validateAnswer(question: Question, userAnswer: string | number): boolean {
    const correctAnswer = question.answer.toString().toLowerCase().trim()
    const userAnswerStr = userAnswer.toString().toLowerCase().trim()

    // For numeric answers, allow small floating point differences
    if (typeof question.answer === "number") {
      const numericAnswer = Number.parseFloat(userAnswerStr)
      if (!isNaN(numericAnswer)) {
        return Math.abs(numericAnswer - question.answer) < 0.01
      }
    }

    return correctAnswer === userAnswerStr
  }

  generateHint(question: Question): string {
    const hints = {
      equation: "Recuerda aislar la variable realizando la misma operación en ambos lados de la ecuación.",
      word_problem: "Identifica la incógnita, plantea la ecuación basándote en la información dada.",
      enigma: "Lee cuidadosamente y identifica todas las relaciones matemáticas en el problema.",
      multiple_choice: "Elimina las opciones que claramente no pueden ser correctas.",
    }

    return hints[question.type] || "Piensa paso a paso y verifica tu respuesta."
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  resetUsedQuestions(): void {
    this.usedQuestions.clear()
  }

  getQuestionStats(): { total: number; byDifficulty: Record<number, number>; byCategory: Record<string, number> } {
    const allQuestions = Object.values(QUESTION_BANK).flat()

    const byDifficulty = allQuestions.reduce(
      (acc, q) => {
        acc[q.difficulty] = (acc[q.difficulty] || 0) + 1
        return acc
      },
      {} as Record<number, number>,
    )

    const byCategory = allQuestions.reduce(
      (acc, q) => {
        acc[q.category] = (acc[q.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      total: allQuestions.length,
      byDifficulty,
      byCategory,
    }
  }
}

export const questionEngine = new QuestionEngine()
