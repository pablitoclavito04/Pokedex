import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../services/loading.service';

/**
 * SpinnerComponent - Spinner global de carga
 *
 * Se suscribe al LoadingService y muestra un overlay con spinner
 * cuando hay operaciones async en curso.
 */
@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.html',
  styleUrls: ['./spinner.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpinnerComponent {
  private loadingService = inject(LoadingService);
  isLoading$ = this.loadingService.isLoading$;
  message$ = this.loadingService.message$;
}
