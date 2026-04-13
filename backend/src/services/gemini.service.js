const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

export const analyzeStudentWithGemini = async (alumno) => {
  const prompt = `Analiza el siguiente alumno universitario y proporciona un análisis detallado:

Nombre: ${alumno.name} ${alumno.lastname}
Carrera: ${alumno.degree}
Matrícula: ${alumno.enrollment}
Cuatrimestre: ${alumno.semester}
Correo: ${alumno.email}

Proporciona un análisis académico en el siguiente formato JSON:
{
  "resumen": "Resumen general del desempeño y potencial del alumno (2-3 oraciones)",
  "puntosFuertes": ["punto fuerte 1", "punto fuerte 2", "punto fuerte 3"],
  "areasMejora": ["área 1", "área 2"],
  "recomendaciones": ["recomendación 1", "recomendación 2", "recomendación 3"],
  "calificacionGeneral": número del 1 al 10
}

Responde SOLO con el JSON, sin texto adicional.`;

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const isQuotaError = errorData.error?.code === 429 || errorData.error?.status === 'RESOURCE_EXHAUSTED';
      if (isQuotaError) {
        const retrySeconds = errorData.error?.details?.find(d => d['@type']?.includes('RetryInfo'))?.retryDelay;
        const retryMsg = retrySeconds ? ` Espera ${Math.ceil(parseInt(retrySeconds))} segundos.` : '';
        throw new Error(`Límite de cuota excedido. Verifica tu plan en https://ai.google.dev/gemini-api/docs/rate-limits.${retryMsg}`);
      }
      throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || 'Error desconocido'}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Parsear la respuesta JSON de Gemini
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0]);
      return analysis;
    }
    
    throw new Error('No se pudo parsear la respuesta de Gemini');
  } catch (error) {
    console.error('Error en Gemini API:', error.message);
    throw error;
  }
};

export default {
  analyzeStudentWithGemini
};
