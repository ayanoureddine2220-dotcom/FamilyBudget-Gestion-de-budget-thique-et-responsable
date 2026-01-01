import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css'; // We'll move styles here or use App.css

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const togglePanel = () => setIsOpen(!isOpen);

  useEffect(() => {
    // Initial Greeting
    const persona = localStorage.getItem('fb_persona') || 'famille';
    let greet = 'Bonjour ! Je suis FamilyCoach, votre assistant bienveillant.';
    if (persona === 'parent_seul') greet = 'Bonjour ! Je suis FamilyCoach. Je vous aide à simplifier le quotidien et garder le cap.';
    else if (persona === 'seniors') greet = 'Bonjour ! Je suis FamilyCoach. Je vous aide à gérer sereinement vos revenus et dépenses.';
    else if (persona === 'jeunes_couples') greet = 'Bonjour ! Je suis FamilyCoach. Je vous aide à construire vos projets sans stress.';

    addMessage({
      text: `<h4>${greet}</h4><p>Je réponds simplement à vos questions et je vous guide pas à pas. Choisissez une suggestion ci-dessous ou posez votre question.</p>`,
      who: 'bot'
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (msg) => {
    setMessages(prev => [...prev, msg]);
  };

  const replyFor = (q) => {
    const s = q.toLowerCase();
    if (s.includes('inscription') || s.includes('compte')) return "<h4>Inscription en 3 étapes</h4><p>1) Cliquez sur <a href='/signup'>Commencer</a> ou <a href='/premium'>Premium</a></p><p>2) Remplissez vos informations</p><p>3) Accédez au <a href='/dashboard'>Tableau de bord</a></p>";
    if (s.includes('premium')) return "<h4>Avantages Premium</h4><p>• Analyse avancée</p><p>• Exports illimités</p><p>• Alertes intelligentes</p><p><a href='/premium'>Voir l’offre</a></p>";
    if (s.includes('analyse') || s.includes('catégorie')) return "<h4>Analyse par catégorie</h4><p>• Visualisez où va l’argent</p><p>• Repérez les économies possibles</p>";
    if (s.includes('objectif') || s.includes('alerte')) return "<h4>Objectifs & alertes</h4><p>• Fixez des objectifs réalistes</p><p>• Recevez des rappels bienveillants</p>";
    if (s.includes('export') || s.includes('excel') || s.includes('pdf')) return "<h4>Exporter vos données</h4><p>• PDF via impression</p><p>• Excel via CSV</p>";
    if (s.includes('sécurité') || s.includes('confidentialité') || s.includes('données')) return "<h4>Vie privée</h4><p>• Données privées</p><p>• Pas de publicité</p><p>• Approche éthique</p>";
    if (s.includes('personas') || s.includes('profil') || s.includes('famille')) return "<h4>Choisir un profil</h4><p>• Adaptez l’expérience à votre situation</p>";
    if (s.includes('tableau') || s.includes('dashboard')) return "<h4>Tableau de bord</h4><p>• Suivi des dépenses, revenus, économies</p><p>• Reste à vivre</p>";
    if (s.includes('budget') || s.includes('dépense')) return "<h4>Conseils budget</h4><p>• Listez les essentiels (logement, courses, transport)</p><p>• Règle 50/30/20: besoins/loisirs/épargne</p><p>• Planifiez un fonds d’urgence</p>";
    return null;
  };

  const callGemini = async (text) => {
    const apiKey = localStorage.getItem('gemini_api_key') || 'api_key';
    if (!apiKey) return null;

    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: text + " (Réponds de manière pédagogique, brève et bienveillante en tant qu'assistant 'FamilyCoach' pour la gestion du budget familial. Utilise un formatage HTML simple si nécessaire: <b>, <br>, <ul><li>.)" }] }]
        })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      return data.candidates[0].content.parts[0].text;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const handleSend = async (text) => {
    if (!text || !text.trim()) return;
    const userMsg = text.trim();
    addMessage({ text: userMsg, who: 'user' });
    setInput('');

    if (userMsg.startsWith('/apikey ')) {
      const key = userMsg.split(' ')[1].trim();
      if (key) {
        localStorage.setItem('gemini_api_key', key);
        setTimeout(() => addMessage({ text: "✅ Clé API Gemini enregistrée avec succès !", who: 'bot' }), 500);
      } else {
        setTimeout(() => addMessage({ text: "❌ Clé invalide.", who: 'bot' }), 500);
      }
      return;
    }

    const localReply = replyFor(userMsg);
    if (localReply) {
      setTimeout(() => addMessage({ text: localReply, who: 'bot' }), 150);
    } else {
      // Loading state could be handled better, but reusing message list for simplicity
      const loadingId = Date.now();
      setMessages(prev => [...prev, { text: '🤔 Je réfléchis...', who: 'bot', id: loadingId, isLoading: true }]);

      const geminiReply = await callGemini(userMsg);
      
      setMessages(prev => prev.filter(m => m.id !== loadingId)); // Remove loading

      if (geminiReply) {
        let formatted = geminiReply.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
        addMessage({ text: formatted, who: 'bot' });
      } else {
        addMessage({ 
          text: "<h4>Je peux aider sur</h4><p>Inscription, Premium, Analyse, Objectifs...</p><p>Pour activer mon IA, envoyez <code>/apikey VOTRE_CLE</code></p>", 
          who: 'bot' 
        });
      }
    }
  };

  const suggestions = [
    { k: 'Inscription', v: 'Comment m’inscrire ?' },
    { k: 'Premium', v: 'Qu’apporte l’offre Premium ?' },
    { k: 'Conseils', v: 'Comment gérer mon budget ?' },
  ];

  return (
    <>
      <button className="chatbot-toggler" onClick={togglePanel}>
        {isOpen ? (
          <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        ) : (
          <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
        )}
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>
              <span>FamilyCoach</span>
              <span style={{ fontSize: '0.7em', opacity: 0.8, fontWeight: 400 }}>IA Ready</span>
            </h3>
            <button className="chatbot-close" onClick={togglePanel}>×</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`message ${m.who}`}>
                <div dangerouslySetInnerHTML={{ __html: m.text }} />
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-suggestions">
            {suggestions.map((s, i) => (
              <button key={i} className="suggestion-btn" onClick={() => handleSend(s.v)}>
                {s.k}
              </button>
            ))}
          </div>

          <div className="chatbot-input-area">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="Posez votre question..." 
            />
            <button className="chatbot-send" onClick={() => handleSend(input)} disabled={!input.trim()}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
