// ============================================================================
//          QUIZ REVIEW PAGE - Página de revisión de respuestas del Quiz
// ============================================================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface AnswerRecord {
  question: Question;
  userAnswer: number;
  isCorrect: boolean;
}

interface QuizResults {
  answerHistory: AnswerRecord[];
  score: number;
  totalQuestions: number;
  difficulty: string;
}

@Component({
  selector: 'app-quiz-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-review.html',
  styleUrl: './quiz-review.scss'
})
export class QuizReviewComponent implements OnInit {

  constructor(private router: Router) {}

  // ========== DATOS ==========
  results: QuizResults | null = null;
  filter: 'all' | 'correct' | 'incorrect' = 'all';

  private readonly RESULTS_KEY = 'quiz_results';
  private readonly QUIZ_STATE_KEY = 'quiz_state';

  ngOnInit(): void {
    this.loadResults();
  }

  // ========== MÉTODOS ==========
  private loadResults(): void {
    const saved = sessionStorage.getItem(this.RESULTS_KEY);
    if (saved) {
      this.results = JSON.parse(saved);
    } else {
      // No hay resultados, volver al quiz
      this.router.navigate(['/quiz']);
    }
  }

  get filteredAnswers(): AnswerRecord[] {
    if (!this.results) return [];

    switch (this.filter) {
      case 'correct':
        return this.results.answerHistory.filter(a => a.isCorrect);
      case 'incorrect':
        return this.results.answerHistory.filter(a => !a.isCorrect);
      default:
        return this.results.answerHistory;
    }
  }

  get correctCount(): number {
    return this.results?.answerHistory.filter(a => a.isCorrect).length || 0;
  }

  get incorrectCount(): number {
    return this.results?.answerHistory.filter(a => !a.isCorrect).length || 0;
  }

  get difficultyLabel(): string {
    const labels: Record<string, string> = {
      'easy': 'Fácil',
      'normal': 'Normal',
      'hard': 'Difícil',
      'expert': 'Experto'
    };
    return labels[this.results?.difficulty || 'normal'] || 'Normal';
  }

  setFilter(filter: 'all' | 'correct' | 'incorrect'): void {
    this.filter = filter;
  }

  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index); // A, B, C, D
  }

  goBack(): void {
    this.router.navigate(['/quiz/results'], {
      queryParams: {
        score: this.results?.score || 0,
        total: this.results?.totalQuestions || 10,
        difficulty: this.results?.difficulty || 'normal'
      }
    });
  }

  playAgain(): void {
    if (!this.results) return;

    // Extraer las preguntas originales del historial de respuestas
    const originalQuestions = this.results.answerHistory.map(a => a.question);

    // Guardar el estado del quiz con las mismas preguntas para repetirlo
    const quizState = {
      difficulty: this.results.difficulty,
      totalQuestions: this.results.totalQuestions,
      questions: originalQuestions,
      currentQuestionIndex: 0,
      score: 0,
      selectedAnswer: null,
      answerHistory: []
    };
    sessionStorage.setItem(this.QUIZ_STATE_KEY, JSON.stringify(quizState));
    sessionStorage.removeItem(this.RESULTS_KEY);

    this.router.navigate(['/quiz/play'], {
      queryParams: {
        difficulty: this.results.difficulty,
        questions: this.results.totalQuestions
      }
    });
  }

  goToQuiz(): void {
    sessionStorage.removeItem(this.RESULTS_KEY);
    this.router.navigate(['/quiz']);
  }

  goToPokedex(): void {
    sessionStorage.removeItem(this.RESULTS_KEY);
    this.router.navigate(['/pokedex']);
  }
}