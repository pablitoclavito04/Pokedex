// ============================================================================
//          QUIZ PLAY PAGE - Página de juego del Quiz Pokémon
// ============================================================================

import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from '../../../services/loading.service';

export interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface AnswerRecord {
  question: Question;
  userAnswer: number;
  isCorrect: boolean;
}

interface QuestionBank {
  easy: Question[];
  normal: Question[];
  hard: Question[];
  expert: Question[];
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
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private loadingService: LoadingService
  ) {}

  // ========== CONFIGURACIÓN ==========
  difficulty: string = 'normal';
  totalQuestions: number = 10;

  // ========== ESTADO DEL QUIZ ==========
  currentQuestionIndex: number = 0;
  score: number = 0;
  selectedAnswer: number | null = null;
  showExitModal: boolean = false;
  isLoading: boolean = true;
  isFinishing: boolean = false;

  // ========== PREGUNTAS ==========
  questions: Question[] = [];

  // ========== HISTORIAL DE RESPUESTAS ==========
  answerHistory: AnswerRecord[] = [];

  // Claves para sessionStorage
  private readonly STORAGE_KEY = 'quiz_state';
  private readonly RESULTS_KEY = 'quiz_results';

  ngOnInit(): void {
    // Obtener parámetros de la URL
    this.route.queryParams.subscribe(params => {
      this.difficulty = params['difficulty'] || 'normal';
      this.totalQuestions = parseInt(params['questions']) || 10;

      // Intentar recuperar estado guardado
      const savedState = this.loadState();
      if (savedState && savedState.difficulty === this.difficulty && savedState.totalQuestions === this.totalQuestions) {
        // Restaurar estado guardado
        this.questions = savedState.questions;
        this.currentQuestionIndex = savedState.currentQuestionIndex;
        this.score = savedState.score;
        this.selectedAnswer = savedState.selectedAnswer;
        this.answerHistory = savedState.answerHistory || [];
        this.isLoading = false;
        this.cdr.detectChanges();
      } else {
        // Cargar nuevas preguntas
        this.loadQuestions();
      }
    });
  }

  ngOnDestroy(): void {
    // Limpiar estado al salir del quiz
  }

  // ========== MÉTODOS ==========
  loadQuestions(): void {
    this.isLoading = true;

    this.http.get<QuestionBank>('assets/data/quiz-questions.json').subscribe({
      next: (data) => {
        const bank = data[this.difficulty as keyof QuestionBank] || data['normal'];
        // Mezclar y seleccionar preguntas
        const shuffled = [...bank].sort(() => Math.random() - 0.5);
        this.questions = shuffled.slice(0, Math.min(this.totalQuestions, shuffled.length));
        this.answerHistory = [];
        this.isLoading = false;
        this.saveState();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando preguntas:', err);
        this.isLoading = false;
        // Navegar de vuelta al quiz si hay error
        this.router.navigate(['/quiz']);
      }
    });
  }

  // Guardar estado en sessionStorage
  private saveState(): void {
    const state = {
      difficulty: this.difficulty,
      totalQuestions: this.totalQuestions,
      questions: this.questions,
      currentQuestionIndex: this.currentQuestionIndex,
      score: this.score,
      selectedAnswer: this.selectedAnswer,
      answerHistory: this.answerHistory
    };
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
  }

  // Cargar estado desde sessionStorage
  private loadState(): any {
    const saved = sessionStorage.getItem(this.STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  }

  // Limpiar estado guardado
  private clearState(): void {
    sessionStorage.removeItem(this.STORAGE_KEY);
  }

  // Guardar resultados para la página de revisión
  private saveResults(): void {
    const results = {
      answerHistory: this.answerHistory,
      score: this.score,
      totalQuestions: this.totalQuestions,
      difficulty: this.difficulty
    };
    sessionStorage.setItem(this.RESULTS_KEY, JSON.stringify(results));
  }

  get currentQuestion(): Question | null {
    return this.questions[this.currentQuestionIndex] || null;
  }

  get progressPercentage(): number {
    return ((this.currentQuestionIndex + 1) / this.totalQuestions) * 100;
  }

  selectAnswer(index: number): void {
    this.selectedAnswer = index;
    this.saveState();
  }

  nextQuestion(): void {
    if (this.selectedAnswer === null || !this.currentQuestion) return;

    // Registrar la respuesta
    const isCorrect = this.selectedAnswer === this.currentQuestion.correctAnswer;
    this.answerHistory.push({
      question: this.currentQuestion,
      userAnswer: this.selectedAnswer,
      isCorrect: isCorrect
    });

    // Calcular puntuación
    if (isCorrect) {
      this.score++;
    }

    // Pasar a la siguiente pregunta o finalizar
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.selectedAnswer = null;
      this.saveState();
    } else {
      // Quiz terminado - mostrar pantalla de carga antes de ir a resultados
      this.isFinishing = true;
      this.loadingService.show('Calculando resultados...');
      document.body.style.overflow = 'hidden';
      this.saveResults();
      this.clearState();

      // Delay para mostrar la animación de carga
      setTimeout(() => {
        document.body.style.overflow = '';
        this.loadingService.hide();
        this.router.navigate(['/quiz/results'], {
          queryParams: {
            score: this.score,
            total: this.totalQuestions,
            difficulty: this.difficulty
          }
        });
      }, 4000);
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
    this.clearState();
    this.router.navigate(['/quiz']);
  }
}