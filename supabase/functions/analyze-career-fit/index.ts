type CareerFitRequest = {
  profileSummary?: string;
  jobDescription?: string;
};

type CareerFitResponse = {
  score: number;
  strengths: string[];
  gaps: string[];
  nextActions: string[];
  provider: 'mock' | 'gemini';
};

const jsonHeaders = {
  'content-type': 'application/json; charset=utf-8',
};

Deno.serve(async (request) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Metodo nao suportado.' }), {
      status: 405,
      headers: jsonHeaders,
    });
  }

  const payload = (await request.json()) as CareerFitRequest;
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

  if (!geminiApiKey) {
    const response: CareerFitResponse = {
      score: 68,
      strengths: ['Experiencia tecnica consistente', 'Objetivo internacional claro'],
      gaps: ['Configurar Gemini para analise real', 'Cadastrar criterios da vaga em dados estruturados'],
      nextActions: ['Criar projeto Supabase', 'Cadastrar GEMINI_API_KEY como secret'],
      provider: 'mock',
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: jsonHeaders,
    });
  }

  const response: CareerFitResponse = {
    score: 0,
    strengths: [],
    gaps: [
      'Integracao Gemini pendente',
      `Perfil recebido: ${Boolean(payload.profileSummary)}`,
      `Vaga recebida: ${Boolean(payload.jobDescription)}`,
    ],
    nextActions: ['Implementar chamada Gemini com schema de resposta'],
    provider: 'gemini',
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: jsonHeaders,
  });
});
