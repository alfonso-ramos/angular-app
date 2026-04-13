import { Component, Inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
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
    MatChipsModule,
],
template: `
    <div class="resumen-dialog">
    <div class="dialog-header">
        <div>
        <h2 class="dialog-title">Análisis IA del Alumno</h2>
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
        <p>Analizando datos del alumno con IA...</p>
        </div>
        } @else if (error()) {
        <div class="error-container">
        <mat-icon class="error-icon">error_outline</mat-icon>
        <p>{{ error() }}</p>
        </div>
        } @else {
        <div class="analysis-content">
            @if (analisis().resumen) {
            <div class="analysis-section">
                <h3><mat-icon>summarize</mat-icon> Resumen</h3>
                <p class="section-text">{{ analisis().resumen }}</p>
            </div>
            }

            @if (analisis().puntosFuertes?.length) {
            <div class="analysis-section">
                <h3><mat-icon>star</mat-icon> Puntos Fuertes</h3>
                <div class="chips-list">
                    @for (punto of analisis().puntosFuertes; track $index) {
                    <mat-chip class="strength-chip">{{ punto }}</mat-chip>
                    }
                </div>
            </div>
            }

            @if (analisis().areasMejora?.length) {
            <div class="analysis-section">
                <h3><mat-icon>trending_up</mat-icon> Áreas de Mejora</h3>
                <div class="chips-list">
                    @for (area of analisis().areasMejora; track $index) {
                    <mat-chip class="improvement-chip">{{ area }}</mat-chip>
                    }
                </div>
            </div>
            }

            @if (analisis().recomendaciones?.length) {
            <div class="analysis-section">
                <h3><mat-icon>lightbulb</mat-icon> Recomendaciones</h3>
                <ul class="recommendations-list">
                    @for (rec of analisis().recomendaciones; track $index) {
                    <li>{{ rec }}</li>
                    }
                </ul>
            </div>
            }

            @if (analisis().calificacionGeneral) {
            <div class="analysis-section">
                <h3><mat-icon>grade</mat-icon> Calificación General</h3>
                <div class="grade-display">{{ analisis().calificacionGeneral }}/10</div>
            </div>
            }
        </div>
        }
    </div>
    </div>
`,
styles: [
    `
    .resumen-dialog {
        min-width: 550px;
        max-width: 750px;
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
        max-height: 70vh;
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

    .analysis-content {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .analysis-section {
        background-color: #f9f9f9;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 16px;
    }

    .analysis-section h3 {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin: 0 0 12px 0;
    }

    .analysis-section h3 mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
        color: #1976d2;
    }

    .section-text {
        font-size: 14px;
        line-height: 1.6;
        color: #555;
        margin: 0;
    }

    .chips-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    .strength-chip {
        background-color: #e8f5e9 !important;
        color: #2e7d32 !important;
    }

    .improvement-chip {
        background-color: #fff3e0 !important;
        color: #ef6c00 !important;
    }

    .recommendations-list {
        margin: 0;
        padding-left: 20px;
    }

    .recommendations-list li {
        font-size: 14px;
        line-height: 1.6;
        color: #555;
        margin-bottom: 8px;
    }

    .grade-display {
        font-size: 32px;
        font-weight: 700;
        color: #1976d2;
        text-align: center;
        padding: 16px;
        background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
        border-radius: 8px;
    }
    `,
],
})
export class ResumenIaDialogComponent implements OnInit {
loading = signal(true);
analisis = signal<any>({});
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
    this.alumnosService.analyzeAlumno(this.data.alumnoId).subscribe({
    next: (response) => {
        this.analisis.set(response.analisis || response);
        this.loading.set(false);
    },
    error: (err) => {
        console.error('Error fetching analisis IA:', err);
        this.error.set('Error al generar el análisis. Intenta de nuevo.');
        this.loading.set(false);
    },
    });
}

close() {
    this.dialogRef.close();
}
}
