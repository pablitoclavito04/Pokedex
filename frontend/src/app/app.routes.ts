// ============================================================================
//          APP ROUTES - Configuración de rutas de la aplicación
// ============================================================================
//
// Sistema de rutas SPA con Angular Router
// - Lazy loading con loadComponent
// - Route guards para protección de rutas
// - Resolvers para precarga de datos
// - Breadcrumbs dinámicos
// - Página 404 personalizada
//
// ============================================================================

import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards';
import { pokemonResolver } from './resolvers';
import { pendingChangesGuard } from './guards';

export const routes: Routes = [

  // ========== RUTAS PÚBLICAS ==========

  // Ruta principal - Página de inicio
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent),
    title: 'Pokédex - Tu enciclopedia Pokémon',
    data: { breadcrumb: 'Inicio' }
  },

  // Pokédex (lista de Pokémon)
  {
    path: 'pokedex',
    loadComponent: () => import('./pages/pokedex/pokedex').then(m => m.PokedexComponent),
    title: 'Pokédex - Lista de Pokémon',
    data: { breadcrumb: 'Pokédex' }
  },

  // Detalle de Pokémon (con resolver)
  {
    path: 'pokemon/:id',
    loadComponent: () => import('./pages/pokemon-detail/pokemon-detail').then(m => m.PokemonDetailComponent),
    title: 'Detalle Pokémon',
    data: { breadcrumb: ':id' },
    resolve: { pokemon: pokemonResolver }
  },

  // ========== AUTENTICACIÓN (solo para invitados) ==========

  // Login
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent),
    title: 'Iniciar Sesión - Pokédex',
    canActivate: [guestGuard],
    data: { breadcrumb: 'Iniciar Sesión' }
  },

  // Register
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then(m => m.RegisterComponent),
    title: 'Crear Cuenta - Pokédex',
    canActivate: [guestGuard],
    data: { breadcrumb: 'Registro' }
  },

  // ========== RUTAS PROTEGIDAS (requieren autenticación) ==========

  // Comparador - Comparar Pokémon
  {
    path: 'comparador',
    loadComponent: () => import('./pages/comparador/comparador').then(m => m.ComparadorComponent),
    title: 'Comparador de Pokémon - Pokédex',
    canActivate: [authGuard],
    data: { breadcrumb: 'Comparador' }
  },

  // Profile - Perfil del usuario
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile').then(m => m.ProfileComponent),
    title: 'Mi Perfil - Pokédex',
    canActivate: [authGuard],
    data: { breadcrumb: 'Mi Perfil' }
  },

  // Settings - Editar perfil (con guard de cambios sin guardar)
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings').then(m => m.SettingsComponent),
    title: 'Editar Perfil - Pokédex',
    canActivate: [authGuard],
    canDeactivate: [pendingChangesGuard],
    data: { breadcrumb: 'Ajustes' }
  },

  // ========== QUIZ (rutas hijas anidadas) ==========

  // Quiz - Menú principal
  {
    path: 'quiz',
    loadComponent: () => import('./pages/quiz/quiz').then(m => m.QuizComponent),
    title: 'Quiz Pokémon - Pokédex',
    data: { breadcrumb: 'Quiz' }
  },

  // Quiz Play - Jugar Quiz
  {
    path: 'quiz/play',
    loadComponent: () => import('./pages/quiz-play/quiz-play').then(m => m.QuizPlayComponent),
    title: 'Jugando Quiz - Pokédex',
    data: { breadcrumb: 'Jugando' }
  },

  // Quiz Results - Resultados del Quiz
  {
    path: 'quiz/results',
    loadComponent: () => import('./pages/quiz-results/quiz-results').then(m => m.QuizResultsComponent),
    title: 'Resultados Quiz - Pokédex',
    data: { breadcrumb: 'Resultados' }
  },

  // Quiz Review - Revisión de respuestas
  {
    path: 'quiz/review',
    loadComponent: () => import('./pages/quiz-review/quiz-review').then(m => m.QuizReviewComponent),
    title: 'Revisión de respuestas - Pokédex',
    data: { breadcrumb: 'Revisión' }
  },

  // ========== RUTAS DE DESARROLLO ==========

  // Style Guide - Documentación de componentes
  {
    path: 'style-guide',
    loadComponent: () => import('./pages/style-guide/style-guide').then(m => m.StyleGuideComponent),
    title: 'Style Guide - Pokédex',
    data: { breadcrumb: 'Style Guide' }
  },

  // Forms Demo - Demostración de formularios reactivos
  {
    path: 'forms-demo',
    loadComponent: () => import('./pages/forms-demo/forms-demo').then(m => m.FormsDemoComponent),
    title: 'Formularios Reactivos - Pokédex',
    data: { breadcrumb: 'Formularios Demo' }
  },

  // Eventos Demo - Demostración de Rúbricas 2.3 y 2.4
  {
    path: 'eventos-demo',
    loadComponent: () => import('./pages/eventos-demo/eventos-demo').then(m => m.EventosDemoComponent),
    title: 'Demostración Eventos - Pokédex',
    data: { breadcrumb: 'Eventos Demo' }
  },

  // DOM Demo - Demostración de Rúbrica 1.3
  {
    path: 'dom-demo',
    loadComponent: () => import('./pages/dom-demo/dom-demo').then(m => m.DomDemoComponent),
    title: 'Demostración DOM - Pokédex',
    data: { breadcrumb: 'DOM Demo' }
  },

  // ========== RUTA WILDCARD 404 (siempre al final) ==========

  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFoundComponent),
    title: 'Página no encontrada - Pokédex'
  }
];
