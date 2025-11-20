'use client'

import { useState, useRef, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import styles from './CodeEditor.module.css'

const defaultCode = `// Welcome to Vibe Coding! 🚀✨
// Write your JavaScript code here and press Ctrl+S to run

function createVibes() {
  console.log("✨ Creating good vibes... ✨");

  const vibes = [
    "You're doing amazing! 💜",
    "Keep coding! 🚀",
    "You're a coding wizard! 🧙‍♂️",
    "Vibes are immaculate! ✨"
  ];

  return vibes[Math.floor(Math.random() * vibes.length)];
}

console.log(createVibes());

// Try creating your own functions!
// The console output appears below 👇
`

export default function CodeEditor() {
  const [code, setCode] = useState(defaultCode)
  const [output, setOutput] = useState<string[]>(['✨ Ready to vibe! Press Ctrl+S to run your code...'])
  const [theme, setTheme] = useState<'cyberpunk' | 'synthwave' | 'neon'>('cyberpunk')
  const editorRef = useRef<any>(null)

  const runCode = () => {
    const logs: string[] = []
    const originalLog = console.log
    const originalError = console.error
    const originalWarn = console.warn

    console.log = (...args) => {
      logs.push('> ' + args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' '))
    }

    console.error = (...args) => {
      logs.push('❌ ERROR: ' + args.join(' '))
    }

    console.warn = (...args) => {
      logs.push('⚠️ WARNING: ' + args.join(' '))
    }

    try {
      setOutput(['🚀 Running code...', ''])
      // eslint-disable-next-line no-eval
      eval(code)
      if (logs.length === 0) {
        logs.push('✅ Code executed successfully! (No output)')
      }
    } catch (error: any) {
      logs.push(`❌ ERROR: ${error.message}`)
    } finally {
      console.log = originalLog
      console.error = originalError
      console.warn = originalWarn
    }

    setOutput(logs)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        runCode()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [code])

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
  }

  const themeColors = {
    cyberpunk: {
      primary: '#ff00de',
      secondary: '#00ffff',
      glow: 'rgba(255, 0, 222, 0.3)'
    },
    synthwave: {
      primary: '#ff6ec7',
      secondary: '#ffd319',
      glow: 'rgba(255, 110, 199, 0.3)'
    },
    neon: {
      primary: '#00ff41',
      secondary: '#00ffff',
      glow: 'rgba(0, 255, 65, 0.3)'
    }
  }

  const currentTheme = themeColors[theme]

  return (
    <div className={styles.editorContainer}>
      <div className={styles.controls}>
        <button
          className={styles.runButton}
          onClick={runCode}
          style={{
            borderColor: currentTheme.primary,
            color: currentTheme.primary,
            boxShadow: `0 0 20px ${currentTheme.glow}`
          }}
        >
          ▶ RUN CODE
        </button>

        <div className={styles.themeSelector}>
          <span style={{ color: currentTheme.secondary }}>Theme:</span>
          {(['cyberpunk', 'synthwave', 'neon'] as const).map((t) => (
            <button
              key={t}
              className={`${styles.themeButton} ${theme === t ? styles.active : ''}`}
              onClick={() => setTheme(t)}
              style={{
                borderColor: themeColors[t].primary,
                backgroundColor: theme === t ? themeColors[t].glow : 'transparent',
                color: themeColors[t].primary
              }}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.workspace}>
        <div
          className={styles.editorPanel}
          style={{
            borderColor: currentTheme.primary,
            boxShadow: `0 0 30px ${currentTheme.glow}`
          }}
        >
          <div
            className={styles.panelHeader}
            style={{
              borderBottomColor: currentTheme.primary,
              background: currentTheme.glow
            }}
          >
            <span style={{ color: currentTheme.secondary }}>📝 CODE EDITOR</span>
          </div>
          <div className={styles.editorWrapper}>
            <Editor
              height="100%"
              defaultLanguage="javascript"
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              onMount={handleEditorDidMount}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: true,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 10, bottom: 10 },
                fontFamily: "'Fira Code', 'Courier New', monospace",
                fontLigatures: true,
              }}
            />
          </div>
        </div>

        <div
          className={styles.outputPanel}
          style={{
            borderColor: currentTheme.secondary,
            boxShadow: `0 0 30px ${currentTheme.glow}`
          }}
        >
          <div
            className={styles.panelHeader}
            style={{
              borderBottomColor: currentTheme.secondary,
              background: currentTheme.glow
            }}
          >
            <span style={{ color: currentTheme.primary }}>💻 CONSOLE OUTPUT</span>
          </div>
          <div className={styles.output}>
            {output.map((line, i) => (
              <div key={i} className={styles.outputLine}>
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
