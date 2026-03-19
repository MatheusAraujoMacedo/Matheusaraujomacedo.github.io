import os
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

# Carrega variáveis do .env
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configura a API do Gemini
API_KEY = os.getenv("GEMINI_API_KEY")

if API_KEY:
    genai.configure(api_key=API_KEY)
    
    # Configuração do modelo e do System Prompt
    generation_config = {
        "temperature": 0.7,
        "top_p": 0.95,
        "top_k": 40,
        "max_output_tokens": 1024,
    }
    
    # Prompt do sistema que define como o Gemini deve agir
    SYSTEM_INSTRUCTION = """
    Você é o assistente virtual do portfólio de Matheus Araújo Macedo.
    Seu objetivo principal é ajudar recrutadores e visitantes a conhecerem mais sobre o Matheus.
    
    INFORMAÇÕES SOBRE O MATHEUS:
    - Profissão: Desenvolvedor Back-end & Cloud Computing.
    - Foco atual: Back-end seguro, escalável e bem arquitetado usando Python, Flask, Banco de Dados Relacionais e APIs RESTful.
    - Tecnologias e Stack: JavaScript, Python, HTML/CSS, Git, SQL Server, MySQL, Azure (Cloud), Linux, Docker (DevOps).
    - Formação: Cursando Bacharelado em Sistemas de Informação na Faculdade Impacta (início em 2026).
    - Cursos e Títulos: Curso técnico de Desenvolvimento Web no IOS; Apresentou TCC no evento Cria Tech da TOTVS.
    - Certificações importantes: Microsoft Azure Fundamentals (AZ-900). No portfólio estão AZ-901, AZ-902 e AZ-903 (referência de nuvem).
    - Idioma: Inglês intermediário focado em leitura técnica.
    - Soft Skills: Comunicação, trabalho em equipe, apresentações de projetos.
    
    OS PROJETOS DELE:
    1. TCC - TOTVS/Criatech: Sites responsivos para um evento de inovação focado em interfaces de alto impacto (Front-end).
    2. Dashboard de Finanças: SPA para controle financeiro, com visualização de dados dinâmica usando Chart.js (Front-end/Data Viz).
    3. Gestor Financeiro FOHB: Sistema completo para gestão financeira utilizando Python, Flask e PostgreSQL. Hospedado no Render (Back-end/Full-stack/Cloud Depoy).
    
    COMO VOCÊ DEVE RESPONDER:
    - Seja extremamente educado, profissional e entusiasmado.
    - Responda de forma concisa (não crie textos gigantes) e vá direto ao ponto.
    - Fale em primeira pessoa do plural ("Nós trabalhamos com...", ou na terceira pessoa, "O Matheus domina..."). Nunca diga que você é o Matheus. Diga: "Eu sou o assistente de IA do Matheus".
    - Se perguntarem algo que não está neste currículo, diga que não tem essa informação mas a pessoa pode contatar o Matheus diretamente pelo WhatsApp (11) 93406-9176 ou e-mail matheusaraujoo776@gmail.com.
    """
    
    try:
        model = genai.GenerativeModel(
            model_name="gemini-2.5-flash", 
            generation_config=generation_config,
            system_instruction=SYSTEM_INSTRUCTION
        )
    except Exception as e:
        print(f"Erro ao inicializar o modelo: {e}")
        model = None
else:
    print("AVISO: GEMINI_API_KEY não encontrada no arquivo .env")
    model = None

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/chat", methods=["POST"])
def chat():
    if not model:
        return jsonify({"error": "A API do Gemini não está configurada no servidor."}), 500
        
    try:
        data = request.json
        user_message = data.get("message", "")
        
        if not user_message:
            return jsonify({"error": "Mensagem vazia"}), 400
            
        # Inicia ou usa o recurso de chat
        # Para simplificar na demo, passamos a mensagem direta. Em um app maior gerenciaríamos o histórico (chat session).
        response = model.generate_content(user_message)
        
        return jsonify({
            "response": response.text
        })
        
    except Exception as e:
        print(f"Erro no chat: {e}")
        return jsonify({"error": f"Ocorreu um erro ao processar sua mensagem: {str(e)}"}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    # Em produção, debug deve ser False
    app.run(host="0.0.0.0", port=port, debug=True)
