document.addEventListener('DOMContentLoaded', function () {
  var seeHow = document.getElementById('see-how')
  if (seeHow) {
    seeHow.addEventListener('click', function (e) {
      e.preventDefault()
      var target = document.getElementById('comment')
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  var ctx = document.getElementById('budgetChart')
  if (ctx && window.Chart) {
    var chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Logement', 'Courses', 'Transport', 'Éducation', 'Loisirs'],
        datasets: [{
          data: [40, 25, 10, 15, 10],
          backgroundColor: ['#4fb388', '#6fb7e9', '#f3a683', '#778beb', '#f7d794'],
          borderColor: '#ffffff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#1f2937', usePointStyle: true }
          },
          tooltip: { enabled: true }
        }
      }
    })
  } else if (ctx) {
    var data = [40, 25, 10, 15, 10]
    var colors = ['#4fb388', '#6fb7e9', '#f3a683', '#778beb', '#f7d794']
    var total = data.reduce(function (a, b) { return a + b }, 0)
    var w = ctx.width = ctx.clientWidth || 300
    var h = ctx.height = 260
    var c = ctx.getContext('2d')
    var cx = w / 2, cy = h / 2, r = Math.min(w, h) / 2 - 20
    var start = -Math.PI / 2
    data.forEach(function (val, i) {
      var angle = (val / total) * Math.PI * 2
      c.beginPath()
      c.moveTo(cx, cy)
      c.arc(cx, cy, r, start, start + angle)
      c.closePath()
      c.fillStyle = colors[i]
      c.fill()
      start += angle
    })
    c.globalCompositeOperation = 'destination-out'
    c.beginPath(); c.arc(cx, cy, r * 0.55, 0, Math.PI * 2); c.fill()
    c.globalCompositeOperation = 'source-over'
  }

  var cta = document.querySelector('#cta-signup[data-modal="true"]')
  var modal = document.getElementById('signupModal')
  var closeBtn = modal ? modal.querySelector('.modal-close') : null
  var form = document.getElementById('signupForm')
  var toast = document.getElementById('toast')

  if (cta && modal) {
    cta.addEventListener('click', function (e) {
      e.preventDefault()
      modal.classList.add('active')
      modal.setAttribute('aria-hidden', 'false')
      var nameInput = document.getElementById('name')
      if (nameInput) nameInput.focus()
    })
  }

  function closeModal () {
    if (!modal) return
    modal.classList.remove('active')
    modal.setAttribute('aria-hidden', 'true')
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', function () { closeModal() })
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal() })
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('active')) closeModal() })
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault()
      closeModal()
      if (toast) {
        toast.textContent = 'Bienvenue sur FamilyBudget+ !'
        toast.classList.add('show')
        toast.setAttribute('aria-hidden', 'false')
        setTimeout(function () {
          toast.classList.remove('show')
          toast.setAttribute('aria-hidden', 'true')
        }, 2500)
      }
    })
  }

  var signupPageForm = document.getElementById('signupPageForm')
  if (signupPageForm) {
    signupPageForm.addEventListener('submit', function (e) {
      e.preventDefault()
      var toastEl = document.getElementById('toast')
      if (toastEl) {
        toastEl.textContent = 'Compte créé. Redirection vers le tableau de bord…'
        toastEl.classList.add('show')
        toastEl.setAttribute('aria-hidden', 'false')
        setTimeout(function () { window.location.href = 'dashboard.html' }, 1200)
      } else {
        window.location.href = 'dashboard.html'
      }
    })
  }

  var catCtx = document.getElementById('categoryChart')
  if (catCtx && window.Chart) {
    var catChart = new Chart(catCtx, {
      type: 'bar',
      data: {
        labels: ['Logement', 'Courses', 'Transport', 'Éducation', 'Loisirs'],
        datasets: [{ label: 'Dépenses (€)', data: [900, 280, 120, 150, 90], backgroundColor: '#6fb7e9' }]
      },
      options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
    })
  } else if (catCtx) {
    var labels = ['Logement', 'Courses', 'Transport', 'Éducation', 'Loisirs']
    var vals = [900, 280, 120, 150, 90]
    var max = Math.max.apply(null, vals)
    var w2 = catCtx.width = catCtx.clientWidth || 300
    var h2 = catCtx.height = 260
    var g = catCtx.getContext('2d')
    var pad = 30, chartW = w2 - pad * 2, chartH = h2 - pad * 2
    g.clearRect(0, 0, w2, h2)
    g.fillStyle = '#1f2937'; g.font = '12px system-ui'
    var barW = chartW / vals.length * 0.6
    vals.forEach(function (v, i) {
      var x = pad + i * (chartW / vals.length) + (chartW / vals.length - barW) / 2
      var hBar = (v / max) * chartH
      var y = h2 - pad - hBar
      g.fillStyle = '#6fb7e9'
      g.fillRect(x, y, barW, hBar)
      g.fillStyle = '#6b7280'
      g.fillText(labels[i], x, h2 - pad + 16)
    })
  }

  var exportPdfBtn = document.getElementById('exportPdf')
  var exportExcelBtn = document.getElementById('exportExcel')
  var dataTable = document.getElementById('dataTable')
  function tableToCSV (table) {
    var rows = Array.prototype.slice.call(table.querySelectorAll('tr'))
    return rows.map(function (row) {
      var cells = Array.prototype.slice.call(row.querySelectorAll('th,td'))
      return cells.map(function (c) { return '"' + (c.textContent || '').replace(/"/g, '""') + '"' }).join(',')
    }).join('\n')
  }
  if (exportPdfBtn) {
    exportPdfBtn.addEventListener('click', function () { window.print() })
  }
  if (exportExcelBtn && dataTable) {
    exportExcelBtn.addEventListener('click', function () {
      var csv = tableToCSV(dataTable)
      var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      var url = URL.createObjectURL(blob)
      var a = document.createElement('a')
      a.href = url
      a.download = 'familybudget_export.csv'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      var toastEl = document.getElementById('toast')
      if (toastEl) {
        toastEl.textContent = 'Export Excel généré (CSV)'
        toastEl.classList.add('show')
        toastEl.setAttribute('aria-hidden', 'false')
        setTimeout(function () { toastEl.classList.remove('show'); toastEl.setAttribute('aria-hidden', 'true') }, 2000)
      }
    })
  }

  var personaGrid = document.getElementById('personaGrid')
  if (personaGrid) {
    personaGrid.addEventListener('click', function (e) {
      var card = e.target.closest('.persona-card')
      if (!card) return
      var p = card.getAttribute('data-persona')
      try { localStorage.setItem('fb_persona', p) } catch (err) {}
      var toastEl = document.getElementById('toast')
      if (toastEl) {
        toastEl.textContent = 'Profil sélectionné: ' + p.replace('_', ' ')
        toastEl.classList.add('show')
        toastEl.setAttribute('aria-hidden', 'false')
        setTimeout(function () { toastEl.classList.remove('show'); toastEl.setAttribute('aria-hidden', 'true') }, 2000)
      }
    })
  }

  var upgradeBtn = document.getElementById('upgradeBtn')
  var upgradeBtn2 = document.getElementById('upgradeBtn2')
  function handleUpgradeRedirect () {
    try { localStorage.setItem('fb_plan', 'premium') } catch (err) {}
    window.location.href = 'signup.html?plan=premium'
  }
  if (upgradeBtn) upgradeBtn.addEventListener('click', function (e) { e.preventDefault(); handleUpgradeRedirect() })
  if (upgradeBtn2) upgradeBtn2.addEventListener('click', function (e) { e.preventDefault(); handleUpgradeRedirect() })

  var params = new URLSearchParams(window.location.search)
  if (window.location.pathname.endsWith('/signup.html') || window.location.pathname.endsWith('signup.html')) {
    var planRaw = params.get('plan') || ''
    var isPremium = typeof planRaw === 'string' && planRaw.toLowerCase().indexOf('premium') !== -1
    if (isPremium) {
      try { localStorage.setItem('fb_plan', 'premium') } catch (err) {}
      var toastEl = document.getElementById('toast')
      if (toastEl) {
        toastEl.textContent = 'Option Premium sélectionnée'
        toastEl.classList.add('show')
        toastEl.setAttribute('aria-hidden', 'false')
        setTimeout(function () { toastEl.classList.remove('show'); toastEl.setAttribute('aria-hidden', 'true') }, 2000)
      }
      var titleEl = document.querySelector('main h1')
      if (titleEl) titleEl.textContent = 'Créer un compte Premium'
      var infoEl = document.querySelector('main p')
      if (infoEl) infoEl.textContent = 'Premium sélectionné — analyse avancée, exports illimités et alertes intelligentes.'
      var submitEl = document.querySelector('#signupPageForm button[type="submit"]')
      if (submitEl) submitEl.textContent = 'Créer mon compte Premium'
    }
  }

  var goalToggles = document.querySelectorAll('.goal-toggle')
  if (goalToggles && goalToggles.length) {
    goalToggles.forEach(function (chk) {
      var key = 'fb_goal_' + chk.getAttribute('data-goal')
      try { chk.checked = localStorage.getItem(key) === '1' } catch (err) {}
      chk.addEventListener('change', function () {
        try { localStorage.setItem(key, chk.checked ? '1' : '0') } catch (err) {}
        var toastEl = document.getElementById('toast')
        if (toastEl) {
          toastEl.textContent = chk.checked ? 'Alerte activée' : 'Alerte désactivée'
          toastEl.classList.add('show')
          toastEl.setAttribute('aria-hidden', 'false')
          setTimeout(function () { toastEl.classList.remove('show'); toastEl.setAttribute('aria-hidden', 'true') }, 2000)
        }
      })
    })
  }

  if (window.location.pathname.endsWith('/premium-account.html') || window.location.pathname.endsWith('premium-account.html')) {
    var statusEl = document.getElementById('planStatus')
    var infoEl2 = document.getElementById('planInfo')
    var activateBtn = document.getElementById('activatePremium')
    var deactivateBtn = document.getElementById('deactivatePremium')
    var manageBtn = document.getElementById('managePremium')
    var plan = 'free'
    try { plan = localStorage.getItem('fb_plan') || 'free' } catch (err) {}
    function renderPlan () {
      if (statusEl) statusEl.textContent = plan === 'premium' ? 'Premium actif' : 'Gratuit'
      if (infoEl2) infoEl2.textContent = plan === 'premium' ? 'Votre abonnement Premium est actif.' : 'Vous utilisez la version gratuite.'
      if (activateBtn) activateBtn.style.display = plan === 'premium' ? 'none' : 'inline-block'
      if (deactivateBtn) deactivateBtn.style.display = plan === 'premium' ? 'inline-block' : 'none'
      if (manageBtn) manageBtn.style.display = 'inline-block'
    }
    renderPlan()
    if (deactivateBtn) {
      deactivateBtn.addEventListener('click', function () {
        try { localStorage.setItem('fb_plan', 'free') } catch (err) {}
        plan = 'free'
        renderPlan()
        var toastEl = document.getElementById('toast')
        if (toastEl) {
          toastEl.textContent = 'Premium désactivé'
          toastEl.classList.add('show')
          toastEl.setAttribute('aria-hidden', 'false')
          setTimeout(function () { toastEl.classList.remove('show'); toastEl.setAttribute('aria-hidden', 'true') }, 2000)
        }
      })
    }
  }
})
