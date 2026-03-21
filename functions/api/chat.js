export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    const userMessage = data.message || "";
    
    if (!userMessage) {
        return new Response(JSON.stringify({ error: "Mensagem vazia" }), { status: 400 });
    }

    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
        return new Response(JSON.stringify({ error: "A API do Gemini não está configurada no servidor Cloudflare." }), { status: 500 });
    }

    const SYSTEM_INSTRUCTION = `Você é o assistente virtual do portfólio de Matheus Araújo Macedo.
Seu objetivo principal é ajudar recrutadores e visitantes a conhecerem mais sobre o Matheus.

INFORMAÇÕES SOBRE O MATHEUS:
- Profissão: Desenvolvedor Back-end & Cloud Computing.
- Foco atual: Back-end seguro, escalável e bem arquitetado usando Python, Flask, Banco de Dados Relacionais e APIs RESTful.
- Tecnologias e Stack: JavaScript, Python, HTML/CSS, Git, SQL Server, MySQL, Azure (Cloud), Linux, Docker (DevOps).
- Experiência: Jovem Aprendiz em TI na SAMI Saúde (início em 2026).
- Formação: Cursando Bacharelado em Sistemas de Informação na Faculdade Impacta (início em 2026).
- Cursos e Títulos: Curso técnico de Desenvolvimento Web no IOS; Apresentou TCC no evento Cria Tech da TOTVS.
- Certificações importantes: Microsoft Azure Fundamentals (AZ-900). No portfólio estão AZ-901, AZ-902 e AZ-903 (referência de nuvem).
- Idioma: Inglês intermediário focado em leitura técnica.
- Soft Skills: Comunicação, trabalho em equipe, apresentações de projetos.

OS PROJETOS DELE:
1. CyberFinance Pro: Projeto robusto em Python para gestão financeira avançada e análise de dados (Back-end).
2. Assistente de Estudos (Terminal): Aplicativo robusto em Python/Textual que roda direto no terminal, integra com a API Gemini de visão para ajudar nos estudos (Back-end/Data Viz/AI).
3. Criador de QR Code: Utilitário web interativo (JS/HTML/CSS) para gerar rapidamente QR codes (Front-end).
4. Gestor Financeiro FOHB: Sistema completo para gestão financeira utilizando Python, Flask e PostgreSQL. Hospedado no Render (Back-end/Full-stack/Cloud Depoy).
5. Dashboard de Finanças: SPA para controle financeiro, com visualização de dados dinâmica usando Chart.js (Front-end/Data Viz).
6. TCC - TOTVS/Criatech: Sites responsivos para um evento de inovação focado em interfaces de alto impacto (Front-end).

COMO VOCÊ DEVE RESPONDER:
- Seja extremamente educado, profissional e entusiasmado.
- Responda de forma concisa (não crie textos gigantes) e vá direto ao ponto.
- Fale em primeira pessoa do plural ("Nós trabalhamos com...", ou na terceira pessoa, "O Matheus domina..."). Nunca diga que você é o Matheus. Diga: "Eu sou o assistente de IA do Matheus".
- Se perguntarem algo que não está neste currículo, diga que não tem essa informação mas a pessoa pode contatar o Matheus diretamente pelo WhatsApp (11) 93406-9176 ou e-mail matheusaraujoo776@gmail.com.`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const requestBody = {
        system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents: [{ parts: [{ text: userMessage }] }],
        generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 1024,
        }
    };

    const response = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const err = await response.text();
        return new Response(JSON.stringify({ error: "Erro na API do Gemini", details: err }), { status: 500 });
    }

    const result = await response.json();
    let replyText = "Desculpe, não consegui gerar uma resposta.";
    if (result.candidates && result.candidates.length > 0) {
        replyText = result.candidates[0].content.parts[0].text;
    }

    return new Response(JSON.stringify({ response: replyText }), {
        headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
