const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

const analyzeAlumno = async (alumnoData) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY no está configurada en las variables de entorno");
  }

  const prompt = buildAnalysisPrompt(alumnoData);

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error Response:", errorText);
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error?.message || errorMessage;
      } catch (e) {
        // Si no es JSON válido, usar el texto crudo
      }
      throw new Error(`Error de Gemini API: ${errorMessage}`);
    }

    const data = await response.json();

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No se recibió respuesta de Gemini");
    }

    const analysisText = data.candidates[0].content.parts[0].text;

    // Parsear la respuesta JSON de Gemini
    let analysisJson;
    try {
      // Limpiar posibles caracteres extras antes del JSON
      const cleanJson = analysisText.replace(/^[^{]*/, '').replace(/[^}]*$/, '');
      analysisJson = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error("Error parseando JSON de Gemini:", parseError);
      console.error("Texto recibido:", analysisText);
      // Si falla el parseo, devolver como texto plano
      analysisJson = { texto_completo: analysisText };
    }

    return {
      analysis: analysisJson,
      alumno: alumnoData,
    };
  } catch (error) {
    console.error("Error en analyzeAlumno:", error);
    throw error;
  }
};

const buildAnalysisPrompt = (alumno) => {
  return `Analiza el siguiente alumno universitario y proporciona insights útiles.

DATOS DEL ALUMNO:
- Nombre: ${alumno.name} ${alumno.lastname}
- Carrera: ${alumno.degree}
- Matrícula: ${alumno.enrollment}
- Semestre: ${alumno.semester}
- Email: ${alumno.email}

INSTRUCCIONES IMPORTANTES:
Responde ÚNICAMENTE con un objeto JSON válido sin formato markdown, sin asteriscos, sin saltos de linea especiales. El JSON debe tener esta estructura exacta:

{
  "perfil_academico": "Texto con observaciones sobre la carrera y progreso",
  "fortalezas_potenciales": "Texto con fortalezas basadas en la carrera",
  "recomendaciones": "Texto con sugerencias para mejorar desempeño",
  "perspectivas_carrera": "Texto con posibles caminos profesionales",
  "observacion_adicional": "Texto con insight motivacional"
}

REGLAS:
- Usa texto plano sin formato markdown
- No uses asteriscos, guiones, ni numeros al inicio
- Escribe en español
- Manten un tono profesional y positivo
- Cada campo debe ser un string con frases completas`;
};

const analyzeAlumnosBatch = async (alumnosData) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY no está configurada en las variables de entorno");
  }

  const prompt = buildBatchAnalysisPrompt(alumnosData);

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error Response:", errorText);
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error?.message || errorMessage;
      } catch (e) {
        // Si no es JSON válido, usar el texto crudo
      }
      throw new Error(`Error de Gemini API: ${errorMessage}`);
    }

    const data = await response.json();

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No se recibió respuesta de Gemini");
    }

    const analysisText = data.candidates[0].content.parts[0].text;

    // Parsear la respuesta JSON de Gemini
    let analysisJson;
    try {
      // Limpiar posibles caracteres extras antes del JSON
      const cleanJson = analysisText.replace(/^[^{]*/, '').replace(/[^}]*$/, '');
      analysisJson = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error("Error parseando JSON de Gemini:", parseError);
      console.error("Texto recibido:", analysisText);
      // Si falla el parseo, devolver como texto plano
      analysisJson = { texto_completo: analysisText };
    }

    return {
      analysis: analysisJson,
      totalAlumnos: alumnosData.length,
    };
  } catch (error) {
    console.error("Error en analyzeAlumnosBatch:", error);
    throw error;
  }
};

const buildBatchAnalysisPrompt = (alumnos) => {
  const alumnosInfo = alumnos.map((a, index) =>
    `${index + 1}. ${a.name} ${a.lastname} - ${a.degree} (Semestre ${a.semester}) - Matricula: ${a.enrollment}`
  ).join("; ");

  return `Analiza el siguiente grupo de alumnos universitarios y proporciona insights generales.

LISTA DE ALUMNOS: ${alumnosInfo}

INSTRUCCIONES IMPORTANTES:
Responde UNICAMENTE con un objeto JSON valido sin formato markdown, sin asteriscos, sin saltos de linea especiales. El JSON debe tener esta estructura exacta:

{
  "distribucion_carreras": "Texto con observaciones sobre diversidad de carreras",
  "estadisticas_generales": "Texto con rangos de semestres y tendencias",
  "fortalezas_grupo": "Texto con patrones positivos observados",
  "areas_mejora": "Texto con recomendaciones generales",
  "insights_estrategicos": "Texto con observaciones para administracion"
}

REGLAS:
- Usa texto plano sin formato markdown
- No uses asteriscos, guiones, ni numeros al inicio
- Escribe en espanol
- Manten un tono profesional y constructivo
- Cada campo debe ser un string con frases completas`;
};

export default {
  analyzeAlumno,
  analyzeAlumnosBatch,
};
