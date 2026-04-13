import { Component, Inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { AlumnosService } from '../../services/alumnos-service';

@Component({
selector: 'app-resumen-ia-dialog',
standalone: true,
changeDetection: ChangeDetectionStrategy.OnPush,
imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
],
template: `
    <div class="resumen-dialog">
    <div class="dialog-header">
        <div>
        <h2 class="dialog-title">Resumen IA</h2>
        <p class="dialog-subtitle">{{ data.nombreAlumno }}</p>
        </div>
        <button mat-icon-button (click)="close()">
        <mat-icon>close</mat-icon>
        </button>
    </div>

    <div class="dialog-body">
        @if (loading()) {
        <div class="loading-container">
        <mat-spinner diameter="40"></mat-spinner>
        <p>Generando resumen con IA...</p>
        </div>
        } @else if (error()) {
        <div class="error-container">
        <mat-icon class="error-icon">error_outline</mat-icon>
        <p>{{ error() }}</p>
        </div>
        } @else {
        <div class="resumen-content">{{ resumen() }}</div>
        }
    </div>
    </div>
`,
styles: [
    `
    .resumen-dialog {
        min-width: 500px;
        max-width: 700px;
    }

    .dialog-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 20px 24px 12px 24px;
        border-bottom: 1px solid #e0e0e0;
    }

    .dialog-title {
        font-size: 22px;
        font-weight: 600;
        color: #333;
        margin: 0;
    }

    .dialog-subtitle {
        font-size: 14px;
        color: #666;
        margin: 4px 0 0 0;
    }

    .dialog-body {
        padding: 24px;
        max-height: 60vh;
        overflow-y: auto;
    }

    .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 0;
        gap: 16px;
        color: #666;
    }

    .error-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 0;
        gap: 12px;
        color: #f44336;
    }

    .error-icon {
        font-size: 40px;
        width: 40px;
        height: 40px;
    }

    .resumen-content {
        background-color: #f9f9f9;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 24px;
        font-size: 14px;
        line-height: 1.6;
        color: #333;
        white-space: pre-wrap;
    }
    `,
],
})
export class ResumenIaDialogComponent implements OnInit {
loading = signal(true);
resumen = signal('');
error = signal<string | null>(null);

private alumnosService: AlumnosService;

constructor(
    public dialogRef: MatDialogRef<ResumenIaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { nombreAlumno: string; alumnoId: number },
    alumnosService: AlumnosService
) {
    this.alumnosService = alumnosService;
}

ngOnInit() {
    this.alumnosService.getResumenIA(this.data.alumnoId).subscribe({
    next: (response) => {
        this.resumen.set(response.resumen || response);
        this.loading.set(false);
    },
    error: (err) => {
        console.error('Error fetching resumen IA:', err);
        this.error.set('Error al generar el resumen. Intenta de nuevo.');
        this.loading.set(false);
    },
    });
}

close() {
    this.dialogRef.close();
}
}