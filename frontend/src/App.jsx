import React from 'react'
import Chatbot from './components/Chatbot'
import './App.css'

function App() {
  return (
    <>
      <header className="site-header">
        <div className="container header-wrap">
          <a href="#" className="logo">FamilyBudget<span>+</span></a>
          <nav className="nav">
            <a href="#">Fonctionnalités</a>
            <a href="#">Premium</a>
            <a href="#">Témoignages</a>
            <a href="#" className="btn btn-primary">Mon Espace</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-text">
              <h1>Maîtrisez votre budget familial avec le sourire</h1>
              <p>L'application intuitive pour gérer les finances de la famille sans stress. Suivi, objectifs et conseils personnalisés.</p>
              <div className="hero-actions">
                <a href="#" className="btn btn-primary btn-xl">Commencer gratuitement</a>
                <a href="#" className="btn btn-secondary btn-xl">Voir la démo</a>
              </div>
            </div>
            <div className="hero-visual">
               <img src="/assets/hero.svg" alt="Famille heureuse gérant son budget" />
            </div>
          </div>
        </section>

        <section className="container section">
          <div className="cta cta-wrap" style={{borderRadius: '16px', padding: '30px'}}>
            <div>
              <h2>Passez à la vitesse supérieure</h2>
              <p style={{color: 'rgba(255,255,255,0.9)'}}>Débloquez l'IA et les exports illimités avec Premium.</p>
            </div>
            <a href="#" className="btn" style={{background: 'white', color: 'var(--green)'}}>Découvrir Premium</a>
          </div>
        </section>
      </main>

      <Chatbot />
    </>
  )
}

export default App
