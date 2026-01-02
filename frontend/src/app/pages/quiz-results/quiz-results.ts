// ============================================================================
//          QUIZ RESULTS PAGE - Página de resultados del Quiz Pokémon
// ============================================================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-quiz-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-results.html',
  styleUrl: './quiz-results.scss'
})
export class QuizResultsComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  // ========== RESULTADOS ==========
  score: number = 0;
  totalQuestions: number = 10;
  difficulty: string = 'normal';

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.score = parseInt(params['score']) || 0;
      this.totalQuestions = parseInt(params['total']) || 10;
      this.difficulty = params['difficulty'] || 'normal';
    });
  }

  // ========== GETTERS ==========
  get incorrectAnswers(): number {
    return this.totalQuestions - this.score;
  }

  get percentage(): number {
    return Math.round((this.score / this.totalQuestions) * 100);
  }

  get resultTitle(): string {
    const pct = this.percentage;
    if (pct === 100) return '¡PERFECTO!';
    if (pct >= 80) return '¡EXCELENTE!';
    if (pct >= 60) return '¡MUY BIEN!';
    if (pct >= 40) return '¡BIEN!';
    if (pct >= 20) return '¡SIGUE INTENTANDO!';
    return '¡NO TE RINDAS!';
  }

  get resultMessage(): string {
    const pct = this.percentage;
    if (pct === 100) return '¡Increíble! Eres un verdadero maestro Pokémon.';
    if (pct >= 80) return '¡Impresionante! Conoces muy bien el mundo Pokémon.';
    if (pct >= 60) return '¡Buen trabajo! Tienes buenos conocimientos Pokémon.';
    if (pct >= 40) return 'Nada mal, pero puedes mejorar.';
    if (pct >= 20) return 'Necesitas estudiar más sobre Pokémon.';
    return 'No te preocupes, ¡practica y lo conseguirás!';
  }

  get trophyEmoji(): string {
    const pct = this.percentage;
    if (pct === 100) return '🏆';
    if (pct >= 80) return '🥇';
    if (pct >= 60) return '🥈';
    if (pct >= 40) return '🥉';
    return '💪';
  }

  // ========== MÉTODOS ==========
  goToPokedex(): void {
    this.router.navigate(['/pokedex']);
  }

  reviewAnswers(): void {
    this.router.navigate(['/quiz/review']);
  }

  playAgain(): void {
    this.router.navigate(['/quiz/play'], {
      queryParams: {
        difficulty: this.difficulty,
        questions: this.totalQuestions
      }
    });
  }
}
