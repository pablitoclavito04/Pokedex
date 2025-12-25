// ============================================================================
//          APP ROUTES - Configuración de rutas de la aplicación
// ============================================================================

import { Routes } from '@angular/router';

export const routes: Routes = [

  // Ruta principal - Página de inicio
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent),
    title: 'Pokédex - Tu enciclopedia Pokémon'
  },

  // Style Guide - Documentación de componentes
  {
    path: 'style-guide',
    loadComponent: () => import('./pages/style-guide/style-guide').then(m => m.StyleGuideComponent),
    title: 'Style Guide - Pokédex'
  },

  // Forms Demo - Demostración de formularios reactivos
  {
    path: 'forms-demo',
    loadComponent: () => import('./pages/forms-demo/forms-demo').then(m => m.FormsDemoComponent),
    title: 'Formularios Reactivos - Pokédex'
  },

  // Pokédex (lista de Pokémon)
  // {
  //   path: 'pokedex',
  //   loadComponent: () => import('./pages/pokedex/pokedex').then(m => m.PokedexComponent),
  //   title: 'Pokédex'
  // },

  // Detalle de Pokémon
  // {
  //   path: 'pokemon/:id',
  //   loadComponent: () => import('./pages/pokemon-detail/pokemon-detail').then(m => m.PokemonDetailComponent),
  //   title: 'Detalle Pokémon'
  // },

  // Favoritos
  // {
  //   path: 'favorites',
  //   loadComponent: () => import('./pages/favorites/favorites').then(m => m.FavoritesComponent),
  //   title: 'Favoritos - Pokédex'
  // },

  // Login
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent),
    title: 'Iniciar Sesión - Pokédex'
  },

  // Ruta comodín - Redirige al inicio si no encuentra la ruta
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
