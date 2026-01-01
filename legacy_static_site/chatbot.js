document.addEventListener('DOMContentLoaded', function () {
  var root = document.createElement('div')
  root.className = 'chatbot-root'
  root.innerHTML = "<button class=\"chatbot-trigger\" aria-label=\"Ouvrir l’aide\">💬 Aide</button>" +
    "<div class=\"chatbot-panel\" role=\"dialog\" aria-modal=\"false\" aria-labelledby=\"chatbotTitle\" aria-live=\"polite\">" +
    "<div class=\"chatbot-header\"><div><div id=\"chatbotTitle\">FamilyCoach</div><div class=\"chatbot-header-sub\">Votre assistant bienveillant pour le budget familial <span class=\"chatbot-badge\">IA Ready</span></div></div><button class=\"chatbot-close\" aria-label=\"Fermer\">×</button></div>" +
    "<div class=\"chatbot-body\"><div class=\"chatbot-messages\" id=\"chatbotMessages\"></div>" +
    "<div class=\"chatbot-quick\" id=\"chatbotQuick\"></div></div>" +
    "<div class=\"chatbot-input\"><input id=\"chatbotInput\" type=\"text\" placeholder=\"Posez votre question...\" aria-label=\"Question\"><button id=\"chatbotSend\" class=\"btn btn-primary\">Envoyer</button></div>" +
    "</div>"
  document.body.appendChild(root)

  var trigger = root.querySelector('.chatbot-trigger')
  var panel = root.querySelector('.chatbot-panel')
  var closeBtn = root.querySelector('.chatbot-close')
  var input = root.querySelector('#chatbotInput')
  var send = root.querySelector('#chatbotSend')
  var messages = root.querySelector('#chatbotMessages')
  var quick = root.querySelector('#chatbotQuick')

  // Inline styles de secours pour assurer un affichage correct même si styles.css est mis en cache
  try {
    trigger.style.position = 'fixed'
    trigger.style.right = '18px'
    trigger.style.bottom = '18px'
    trigger.style.background = '#4fb388'
    trigger.style.color = '#ffffff'
    trigger.style.border = 'none'
    trigger.style.borderRadius = '999px'
    trigger.style.padding = '10px 16px'
    trigger.style.fontWeight = '700'
    trigger.style.boxShadow = '0 10px 24px rgba(0,0,0,0.12)'
    trigger.style.cursor = 'pointer'
    trigger.style.zIndex = '140'
  } catch (e) {}
  try {
    panel.style.position = 'fixed'
    panel.style.right = '18px'
    panel.style.bottom = '72px'
    panel.style.width = '340px'
    panel.style.maxWidth = '90vw'
    panel.style.background = '#ffffff'
    panel.style.borderRadius = '16px'
    panel.style.boxShadow = '0 18px 44px rgba(0,0,0,0.18)'
    panel.style.display = 'none'
    panel.style.zIndex = '140'
    panel.style.overflow = 'hidden'
  } catch (e) {}

  function togglePanel () {
    var willOpen = panel.style.display === 'none'
    panel.style.display = willOpen ? 'block' : 'none'
    panel.classList.toggle('open', willOpen)
    if (willOpen) input.focus()
  }
  trigger.addEventListener('click', togglePanel)
  closeBtn.addEventListener('click', togglePanel)

  function addMessage (text, who) {
    var d = document.createElement('div')
    d.className = 'chatbot-message ' + (who === 'user' ? 'user' : 'bot')
    var avatar = document.createElement('div')
    avatar.className = 'chatbot-avatar ' + (who === 'user' ? 'user' : 'bot')
    avatar.textContent = who === 'user' ? '🙂' : '🤝'
    var bubble = document.createElement('div')
    bubble.className = 'chatbot-bubble'
    if (who === 'bot') bubble.innerHTML = text; else bubble.textContent = text
    d.appendChild(avatar)
    d.appendChild(bubble)
    messages.appendChild(d)
    messages.scrollTop = messages.scrollHeight
  }

  function replyFor (q) {
    var s = q.toLowerCase()
    if (s.includes('inscription') || s.includes('compte')) return "<h4>Inscription en 3 étapes</h4><p>1) Cliquez sur <a href='signup.html'>Commencer</a> ou <a href='premium.html'>Premium</a></p><p>2) Remplissez vos informations</p><p>3) Accédez au <a href='dashboard.html'>Tableau de bord</a></p>"
    if (s.includes('premium')) return "<h4>Avantages Premium</h4><p>• Analyse avancée</p><p>• Exports illimités</p><p>• Alertes intelligentes</p><p><a href='premium.html'>Voir l’offre</a> ou <a href='premium-account.html'>Compte Premium</a></p>"
    if (s.includes('analyse') || s.includes('catégorie')) return "<h4>Analyse par catégorie</h4><p>• Visualisez où va l’argent</p><p>• Repérez les économies possibles</p><p><a href='analysis.html'>Ouvrir l’analyse</a></p>"
    if (s.includes('objectif') || s.includes('alerte')) return "<h4>Objectifs & alertes</h4><p>• Fixez des objectifs réalistes</p><p>• Recevez des rappels bienveillants</p><p><a href='goals.html'>Configurer</a></p>"
    if (s.includes('export') || s.includes('excel') || s.includes('pdf')) return "<h4>Exporter vos données</h4><p>• PDF via impression</p><p>• Excel via CSV</p><p><a href='export.html'>Aller aux exports</a></p>"
    if (s.includes('sécurité') || s.includes('confidentialité') || s.includes('données')) return "<h4>Vie privée</h4><p>• Données privées</p><p>• Pas de publicité</p><p>• Approche éthique</p><p>Voir la section Sécurité</p>"
    if (s.includes('personas') || s.includes('profil') || s.includes('famille') || s.includes('parent') || s.includes('seniors') || s.includes('couples')) return "<h4>Choisir un profil</h4><p>• Adaptez l’expérience à votre situation</p><p><a href='personas.html'>Choisir profil</a></p>"
    if (s.includes('tableau') || s.includes('dashboard')) return "<h4>Tableau de bord</h4><p>• Suivi des dépenses, revenus, économies</p><p>• Reste à vivre</p><p><a href='dashboard.html'>Ouvrir le tableau</a></p>"
    if (s.includes('budget') || s.includes('dépense')) return "<h4>Conseils budget</h4><p>• Listez les essentiels (logement, courses, transport)</p><p>• Règle 50/30/20: besoins/loisirs/épargne</p><p>• Planifiez un fonds d’urgence</p>"
    return null
  }

  async function callGemini(text) {
    var apiKey = localStorage.getItem('gemini_api_key') || 'api_key'
    if (!apiKey) return null
    
    try {
      var response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: text + " (Réponds de manière pédagogique, brève et bienveillante en tant qu'assistant 'FamilyCoach' pour la gestion du budget familial. Utilise un formatage HTML simple si nécessaire: <b>, <br>, <ul><li>.)" }] }]
        })
      })
      var data = await response.json()
      if (data.error) throw new Error(data.error.message)
      return data.candidates[0].content.parts[0].text
    } catch (e) {
      console.error(e)
      return null
    }
  }

  async function handleSend (text) {
    if (!text || !text.trim()) return
    addMessage(text.trim(), 'user')
    
    // Commande spéciale pour configurer la clé API
    if (text.startsWith('/apikey ')) {
      var key = text.split(' ')[1].trim()
      if (key) {
        localStorage.setItem('gemini_api_key', key)
        setTimeout(function() { addMessage("✅ Clé API Gemini enregistrée avec succès ! Je suis maintenant connecté à mon intelligence artificielle.", 'bot') }, 500)
      } else {
        setTimeout(function() { addMessage("❌ Clé invalide.", 'bot') }, 500)
      }
      return
    }

    var r = replyFor(text)
    if (r) {
      setTimeout(function () { addMessage(r, 'bot') }, 150)
    } else {
      // Si pas de réponse locale, on tente Gemini
      var loadingId = 'loading-' + Date.now()
      var d = document.createElement('div')
      d.className = 'chatbot-message bot'
      d.id = loadingId
      d.innerHTML = '<div class="chatbot-avatar bot">🤝</div><div class="chatbot-bubble">🤔 Je réfléchis...</div>'
      messages.appendChild(d)
      messages.scrollTop = messages.scrollHeight
      
      var geminiReply = await callGemini(text)
      
      var loadingMsg = document.getElementById(loadingId)
      if (loadingMsg) loadingMsg.remove()

      if (geminiReply) {
        // Convertir le markdown basique de Gemini en HTML si besoin (simple replace)
        geminiReply = geminiReply.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
        geminiReply = geminiReply.replace(/\n/g, '<br>')
        addMessage(geminiReply, 'bot')
      } else {
        var fallback = "<h4>Je peux aider sur</h4><p>Inscription, Premium, Analyse, Objectifs, Exports, Sécurité, Personas, Tableau de bord, Conseils budget.</p><p>Pour activer mon IA, envoyez <code>/apikey VOTRE_CLE</code></p>"
        addMessage(fallback, 'bot')
      }
    }
  }

  send.addEventListener('click', function () { handleSend(input.value); input.value = '' })
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { handleSend(input.value); input.value = '' } })

  var suggestions = [
    { k: 'Inscription', v: 'Comment m’inscrire ?' },
    { k: 'Premium', v: 'Qu’apporte l’offre Premium ?' },
    { k: 'Analyse', v: 'Comment analyser mes dépenses ?' },
    { k: 'Objectifs', v: 'Comment fixer un objectif ?' },
    { k: 'Exports', v: 'Comment exporter en Excel ?' },
    { k: 'Sécurité', v: 'Mes données sont-elles privées ?' },
    { k: 'Personas', v: 'Quel profil choisir ?' },
    { k: 'Tableau de bord', v: 'Que montre le tableau de bord ?' }
  ]
  suggestions.forEach(function (sug) {
    var b = document.createElement('button')
    b.className = 'chatbot-chip'
    b.textContent = sug.k
    b.addEventListener('click', function () { handleSend(sug.v) })
    quick.appendChild(b)
  })

  var persona = 'famille'
  try { persona = localStorage.getItem('fb_persona') || 'famille' } catch (err) {}
  var greet = 'Bonjour ! Je suis FamilyCoach, votre assistant bienveillant.'
  if (persona === 'parent_seul') greet = 'Bonjour ! Je suis FamilyCoach. Je vous aide à simplifier le quotidien et garder le cap.'
  else if (persona === 'seniors') greet = 'Bonjour ! Je suis FamilyCoach. Je vous aide à gérer sereinement vos revenus et dépenses.'
  else if (persona === 'jeunes_couples') greet = 'Bonjour ! Je suis FamilyCoach. Je vous aide à construire vos projets sans stress.'
  addMessage("<h4>" + greet + "</h4><p>Je réponds simplement à vos questions et je vous guide pas à pas. Choisissez une suggestion ci-dessous ou posez votre question.</p>", 'bot')
})
