// ============================================================================
//          QUIZ PLAY PAGE - Página de juego del Quiz Pokémon
// ============================================================================

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

@Component({
  selector: 'app-quiz-play',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-play.html',
  styleUrl: './quiz-play.scss'
})
export class QuizPlayComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  // ========== CONFIGURACIÓN ==========
  difficulty: string = 'normal';
  totalQuestions: number = 10;

  // ========== ESTADO DEL QUIZ ==========
  currentQuestionIndex: number = 0;
  score: number = 0;
  selectedAnswer: number | null = null;
  showExitModal: boolean = false;

  // ========== PREGUNTAS ==========
  questions: Question[] = [];

  // Banco de preguntas por dificultad
  private questionBank: { [key: string]: Question[] } = {
    easy: [
      { question: '¿Qué objeto necesita Pikachu para evolucionar a Raichu?', options: ['Piedra trueno', 'Piedra lunar', 'Piedra solar', 'Piedra fuego'], correctAnswer: 0 },
      { question: '¿De qué tipo es Charmander?', options: ['Agua', 'Planta', 'Fuego', 'Eléctrico'], correctAnswer: 2 },
      { question: '¿Cuál es el Pokémon número 1 en la Pokédex?', options: ['Pikachu', 'Bulbasaur', 'Charmander', 'Squirtle'], correctAnswer: 1 },
      { question: '¿De qué color es Squirtle?', options: ['Rojo', 'Verde', 'Azul', 'Amarillo'], correctAnswer: 2 },
      { question: '¿Cuántos tipos de Pokémon existen actualmente?', options: ['15', '18', '20', '12'], correctAnswer: 1 },
      { question: '¿Qué Pokémon es la mascota principal de la franquicia?', options: ['Eevee', 'Pikachu', 'Charizard', 'Mewtwo'], correctAnswer: 1 },
      { question: '¿De qué tipo es Jigglypuff?', options: ['Normal/Hada', 'Hada', 'Normal', 'Psíquico'], correctAnswer: 0 },
      { question: '¿Qué evolución tiene Eevee con una Piedra Agua?', options: ['Flareon', 'Jolteon', 'Vaporeon', 'Espeon'], correctAnswer: 2 },
      { question: '¿Cuál es el tipo de Geodude?', options: ['Tierra', 'Roca/Tierra', 'Roca', 'Acero'], correctAnswer: 1 },
      { question: '¿Qué Pokémon dice su nombre al atacar?', options: ['Todos', 'Pikachu', 'Ninguno', 'Solo los eléctricos'], correctAnswer: 0 },
      { question: '¿Cuál es la evolución de Magikarp?', options: ['Goldeen', 'Gyarados', 'Seaking', 'Milotic'], correctAnswer: 1 },
      { question: '¿De qué tipo es Gastly?', options: ['Fantasma', 'Veneno', 'Fantasma/Veneno', 'Siniestro'], correctAnswer: 2 },
    ],
    normal: [
      { question: '¿Qué objeto necesita Pikachu para evolucionar a Raichu?', options: ['Piedra trueno', 'Piedra lunar', 'Piedra solar', 'Piedra fuego'], correctAnswer: 0 },
      { question: '¿En qué generación se introdujo el tipo Hada?', options: ['Generación 4', 'Generación 5', 'Generación 6', 'Generación 7'], correctAnswer: 2 },
      { question: '¿Cuál es el Pokémon más pesado?', options: ['Snorlax', 'Wailord', 'Groudon', 'Celesteela'], correctAnswer: 3 },
      { question: '¿Qué habilidad tiene Shedinja?', options: ['Robustez', 'Polvo Escudo', 'Muro Mágico', 'Brillo Estelar'], correctAnswer: 2 },
      { question: '¿Cuántos Pokémon legendarios hay en la primera generación?', options: ['4', '5', '6', '7'], correctAnswer: 1 },
      { question: '¿Qué tipo es inmune a los movimientos de tipo Dragón?', options: ['Acero', 'Hada', 'Hielo', 'Normal'], correctAnswer: 1 },
      { question: '¿Cuál es la pre-evolución de Pikachu?', options: ['Pichu', 'Raichu', 'Plusle', 'Minun'], correctAnswer: 0 },
      { question: '¿En qué región se encuentra Ciudad Luminalia?', options: ['Kanto', 'Johto', 'Kalos', 'Alola'], correctAnswer: 2 },
      { question: '¿Qué Pokémon puede tener la habilidad Impostor?', options: ['Mew', 'Ditto', 'Zoroark', 'Smeargle'], correctAnswer: 1 },
      { question: '¿Cuál es el único tipo que resiste a sí mismo?', options: ['Dragón', 'Acero', 'Fantasma', 'Ninguno'], correctAnswer: 1 },
      { question: '¿Qué movimiento tiene prioridad +2?', options: ['Velocidad Extrema', 'Acua Jet', 'Protección', 'Detección'], correctAnswer: 2 },
      { question: '¿Cuántas formas tiene Rotom?', options: ['4', '5', '6', '7'], correctAnswer: 2 },
    ],
    hard: [
      { question: '¿Cuál es el stat base total de Arceus?', options: ['680', '700', '720', '670'], correctAnswer: 2 },
      { question: '¿Qué Pokémon tiene el Speed base más alto?', options: ['Ninjask', 'Deoxys-Speed', 'Electrode', 'Regieleki'], correctAnswer: 3 },
      { question: '¿En qué juego apareció por primera vez el Pokémon Meltan?', options: ['Pokémon GO', 'Pokémon Espada', 'Pokémon Let\'s Go', 'Pokémon Sol'], correctAnswer: 0 },
      { question: '¿Cuál es la única combinación de tipos que no existe?', options: ['Fuego/Hada', 'Normal/Hielo', 'Bicho/Dragón', 'Veneno/Acero'], correctAnswer: 1 },
      { question: '¿Qué habilidad anula los movimientos de prioridad?', options: ['Armadura Frágil', 'Espacio Raro', 'Bromista', 'Blindaje'], correctAnswer: 3 },
      { question: '¿Cuántos Pokémon pueden aprender Esquema?', options: ['1', '2', '3', '4'], correctAnswer: 0 },
      { question: '¿Qué Pokémon tiene el movimiento exclusivo Canto Mortal?', options: ['Primarina', 'Jigglypuff', 'Altaria', 'Meloetta'], correctAnswer: 0 },
      { question: '¿Cuál es el único Pokémon con el tipo Hada/Fuego?', options: ['No existe', 'Mega Altaria', 'Chi-Yu', 'Ninetales Alola'], correctAnswer: 0 },
      { question: '¿Qué objeto aumenta la precisión en un 10%?', options: ['Lupa', 'Cinta Ancha', 'Zoom', 'Gafas Especiales'], correctAnswer: 0 },
      { question: '¿Cuántos EVs se pueden tener en total?', options: ['510', '508', '512', '500'], correctAnswer: 0 },
      { question: '¿Qué naturaleza aumenta Ataque y baja Defensa?', options: ['Firme', 'Osada', 'Huraña', 'Activa'], correctAnswer: 2 },
      { question: '¿Cuál es el Pokémon más ligero?', options: ['Gastly', 'Haunter', 'Kartana', 'Flabébé'], correctAnswer: 3 },
    ],
    expert: [
      { question: '¿Cuál es la probabilidad base de encontrar un Pokémon shiny en Gen 2?', options: ['1/4096', '1/8192', '1/512', '1/1365'], correctAnswer: 1 },
      { question: '¿Qué valor tiene el multiplicador STAB?', options: ['1.25', '1.5', '2.0', '1.75'], correctAnswer: 1 },
      { question: '¿Cuántos pasos base necesita un huevo de Magikarp para eclosionar?', options: ['1280', '2560', '1024', '5120'], correctAnswer: 0 },
      { question: '¿Qué Pokémon tiene exactamente 600 de stat base total sin ser pseudo-legendario?', options: ['Slaking', 'Wishiwashi', 'Silvally', 'Archeops'], correctAnswer: 2 },
      { question: '¿Cuál es el daño base del movimiento Explosión?', options: ['200', '250', '300', '170'], correctAnswer: 1 },
      { question: '¿Qué porcentaje de vida recupera Descanso?', options: ['50%', '75%', '100%', '25%'], correctAnswer: 2 },
      { question: '¿En qué generación se cambió el sistema de IVs de 0-15 a 0-31?', options: ['Gen 2', 'Gen 3', 'Gen 4', 'Gen 5'], correctAnswer: 1 },
      { question: '¿Cuál es el único movimiento que puede golpear durante Vuelo y tiene 100% de precisión?', options: ['Trueno', 'Tornado', 'Ataque Aéreo', 'Ráfaga'], correctAnswer: 1 },
      { question: '¿Qué habilidad ignora las habilidades defensivas del oponente?', options: ['Rompemoldes', 'Turbollama', 'Nerviosismo', 'Todas las anteriores'], correctAnswer: 3 },
      { question: '¿Cuántos Pokémon pueden aprender todos los movimientos de TM/MO?', options: ['1 (Mew)', '2 (Mew y Smeargle)', '0', '3'], correctAnswer: 0 },
      { question: '¿Cuál es el multiplicador de daño de un golpe crítico en Gen 6+?', options: ['2.0', '1.5', '2.25', '1.75'], correctAnswer: 1 },
      { question: '¿Qué porcentaje de precisión tiene Fisura?', options: ['30%', '20%', '50%', 'Varía con el nivel'], correctAnswer: 0 },
    ]
  };

  ngOnInit(): void {
    // Obtener parámetros de la URL
    this.route.queryParams.subscribe(params => {
      this.difficulty = params['difficulty'] || 'normal';
      this.totalQuestions = parseInt(params['questions']) || 10;
      this.loadQuestions();
    });
  }

  ngOnDestroy(): void {
    // Limpiar recursos si es necesario
  }

  // ========== MÉTODOS ==========
  loadQuestions(): void {
    const bank = this.questionBank[this.difficulty] || this.questionBank['normal'];
    // Mezclar y seleccionar preguntas
    const shuffled = [...bank].sort(() => Math.random() - 0.5);
    this.questions = shuffled.slice(0, Math.min(this.totalQuestions, shuffled.length));
  }

  get currentQuestion(): Question | null {
    return this.questions[this.currentQuestionIndex] || null;
  }

  get progressPercentage(): number {
    return (this.currentQuestionIndex / this.totalQuestions) * 100;
  }

  selectAnswer(index: number): void {
    this.selectedAnswer = index;
  }

  nextQuestion(): void {
    if (this.selectedAnswer === null) return;

    // Calcular puntuación
    if (this.selectedAnswer === this.currentQuestion?.correctAnswer) {
      this.score++;
    }

    // Pasar a la siguiente pregunta o finalizar
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.selectedAnswer = null;
    } else {
      // Quiz terminado - navegar a resultados
      this.router.navigate(['/quiz/results'], {
        queryParams: {
          score: this.score,
          total: this.totalQuestions,
          difficulty: this.difficulty
        }
      });
    }
  }

  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index); // A, B, C, D
  }

  isSelected(index: number): boolean {
    return this.selectedAnswer === index;
  }

  goBack(): void {
    this.router.navigate(['/quiz']);
  }

  openExitModal(): void {
    this.showExitModal = true;
  }

  closeExitModal(): void {
    this.showExitModal = false;
  }

  confirmExit(): void {
    this.showExitModal = false;
    this.router.navigate(['/quiz']);
  }
}
