'use client'

import { useState, useEffect } from 'react'
import CodeEditor from './components/CodeEditor'
import styles from './page.module.css'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className={styles.container}>
      <div className={styles.stars}>
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <header className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.rocket}>🚀</span>
          VIBE CODING
          <span className={styles.rocket}>🚀</span>
        </h1>
        <p className={styles.subtitle}>~ where code meets aesthetic ~</p>
      </header>

      <main className={styles.main}>
        <CodeEditor />
      </main>

      <footer className={styles.footer}>
        <div className={styles.statusBar}>
          <span>✨ VIBING ✨</span>
          <span>|</span>
          <span>Press Ctrl+S to run</span>
          <span>|</span>
          <span>Made with 💜</span>
        </div>
      </footer>
    </div>
  )
}
