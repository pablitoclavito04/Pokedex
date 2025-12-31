// ============================================================================
//          QUIZ PAGE - Página del Quiz Pokémon
// ============================================================================

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './quiz.html',
  styleUrl: './quiz.scss'
})
export class QuizComponent {

  constructor(private router: Router) {}

  // ========== CONFIGURACIÓN DEL QUIZ ==========
  selectedDifficulty: string | null = null;
  selectedQuestions: number | null = null;

  difficulties = [
    { value: 'easy', label: 'Fácil', description: 'Preguntas básicas para principiantes' },
    { value: 'normal', label: 'Normal', description: 'Un reto equilibrado' },
    { value: 'hard', label: 'Difícil', description: 'Para verdaderos fans' },
    { value: 'expert', label: 'Experto', description: 'Solo para maestros Pokémon' }
  ];

  questionOptions = [5, 10, 15, 20];

  // ========== MÉTODOS ==========
  goBack(): void {
    this.router.navigate(['/pokedex']);
  }

  startQuiz(): void {
    if (!this.selectedDifficulty || !this.selectedQuestions) return;

    this.router.navigate(['/quiz/play'], {
      queryParams: {
        difficulty: this.selectedDifficulty,
        questions: this.selectedQuestions
      }
    });
  }

  get canStartQuiz(): boolean {
    return this.selectedDifficulty !== null && this.selectedQuestions !== null;
  }

  getTimeLimit(): number {
    switch (this.selectedDifficulty) {
      case 'easy': return 30;
      case 'normal': return 20;
      case 'hard': return 15;
      case 'expert': return 10;
      default: return 20;
    }
  }
}