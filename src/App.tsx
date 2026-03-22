import { useState, useEffect } from 'react'
import './App.css'

// ============================================================================
// BACKEND URL (Only this - no API keys in app!)
// ============================================================================

const BACKEND_URL = 'https://sauc-e-backend-production.up.railway.app'

const FREE_LESSON_LIMIT = 9

// Payment & external links
const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/28E00l3HOg638gA6hxa3u00'
const SAUCE_HOME = 'https://sauc-e.com'
const CHECKOUT_URL = 'https://sauc-e.com/checkitout'
const PRIVACY_POLICY_URL = 'https://docs.google.com/document/d/1AxzEmZn2AjEY7ry6HSM1S6mlB3ggs0SN'

type Context = 'Mathematics' | 'Science' | 'History' | 'Literature' | 'Philosophy'

const CONTEXTS: Context[] = ['Mathematics', 'Science', 'History', 'Literature', 'Philosophy']

function App() {
  // ============================================================================
  // STATE
  // ============================================================================

  const [isSubscribed] = useState(false)
  const [lessonCount, setLessonCount] = useState(0)
  const [question, setQuestion] = useState('')
  const [context, setContext] = useState<Context>('Mathematics')
  const [lesson, setLesson] = useState('')
  const [askedQuestion, setAskedQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [customerId] = useState<string | null>(null)

  const freeLeft = Math.max(0, FREE_LESSON_LIMIT - lessonCount)

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  useEffect(() => {
    syncUsageCount('web-user')
  }, [])

  async function syncUsageCount(cid: string) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/catsup/usage-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: cid || 'anonymous' }),
      })
      if (response.ok) {
        const data = await response.json()
        setLessonCount(data.usageCount || 0)
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'unknown'
      console.log('Usage sync skipped:', msg)
    }
  }

  // ============================================================================
  // GET LESSON (Calls backend, NOT Claude directly)
  // ============================================================================

  async function handleAsk() {
    if (!question.trim()) {
      alert('Please ask a question')
      return
    }

    // If free limit reached, redirect to payment
    if (!isSubscribed && lessonCount >= FREE_LESSON_LIMIT) {
      window.open(STRIPE_PAYMENT_LINK, '_blank')
      return
    }

    setLoading(true)
    const submittedQuestion = question.trim()

    try {
      const response = await fetch(`${BACKEND_URL}/api/catsup/get-lesson`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: customerId || 'anonymous',
          situation: submittedQuestion,
          context: context,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()

        if (response.status === 403) {
          window.open(STRIPE_PAYMENT_LINK, '_blank')
          return
        }

        throw new Error(errorData.error || 'Failed to get lesson')
      }

      const data = await response.json()
      setLesson(data.wisdom || data.lesson)
      setAskedQuestion(submittedQuestion)
      setLessonCount((prev) => prev + 1)
      setQuestion('')
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to process request'
      alert(msg)
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleAsk()
    }
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="catsup-page">

      {/* ===== sauc-e HEADER ===== */}
      <header className="sauce-header">
        <a
          href={SAUCE_HOME}
          target="_blank"
          rel="noopener noreferrer"
          className="sauce-logo-link"
        >
          <span className="sauce-name">sauc-e</span>
          <span className="sauce-tagline"> where HOME is the </span>
          <span className="sauce-heart">❤️</span>
        </a>
        <nav className="sauce-nav">
          <a
            href={CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="sauce-nav-link"
          >
            Check It Out Y'all
          </a>
          <a
            href={`${SAUCE_HOME}/about`}
            target="_blank"
            rel="noopener noreferrer"
            className="sauce-nav-link"
          >
            About
          </a>
          <a
            href={`${SAUCE_HOME}/contact`}
            target="_blank"
            rel="noopener noreferrer"
            className="sauce-nav-link"
          >
            Contact
          </a>
        </nav>
      </header>

      <div className="catsup-container">

        {/* ===== APP HEADER ===== */}
        <header className="catsup-header">
          <h1 className="catsup-title">CATS_UP (3,6,9)</h1>
          <p className="catsup-subtitle">Learn Through Questions</p>
          <p className="catsup-philosophy">Understanding = Questions / Ego</p>
        </header>

        {/* ===== PREMIUM PILL ===== */}
        {!isSubscribed && (
          <div className="premium-section">
            <a
              href={STRIPE_PAYMENT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className={`premium-pill${freeLeft === 0 ? ' premium-pill-urgent' : ''}`}
            >
              {freeLeft > 0
                ? `Premium · ${freeLeft} free left`
                : 'Upgrade to Premium · $9.99/mo'}
            </a>
          </div>
        )}

        {/* ===== APP CONTENT ===== */}
        <main className="catsup-content">

          {/* Context Pills */}
          <h2 className="catsup-section-title">Pick a Subject</h2>
          <div className="catsup-contexts">
            {CONTEXTS.map((c) => (
              <button
                key={c}
                className={`catsup-context-pill${context === c ? ' active' : ''}`}
                onClick={() => setContext(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Question Input */}
          <h2 className="catsup-section-title">Your Question</h2>
          <textarea
            className="catsup-input"
            placeholder="Ask a question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={4}
          />

          {/* Ask Button */}
          <button
            className={`catsup-ask-btn${loading ? ' disabled' : ''}`}
            onClick={handleAsk}
            disabled={loading}
          >
            {loading ? 'Thinking...' : 'Ask'}
          </button>

          {/* Response Box */}
          {lesson && (
            <div className="catsup-lesson-box">
              <p className="catsup-you-asked">You asked:</p>
              <p className="catsup-asked-question">"{askedQuestion}"</p>
              <hr className="catsup-divider" />
              <p className="catsup-lesson-text">{lesson}</p>

              {/* iOS-style footer inside response card */}
              <div className="catsup-card-footer">
                <p className="catsup-card-footer-line">
                  Curiosity = Questions / ego.&nbsp;&nbsp;ego = salt.&nbsp;&nbsp;Necessary for flavor.
                </p>
                <p className="catsup-card-footer-line">
                  Too much ego?&nbsp;&nbsp;Too salty! :p&nbsp;&nbsp;Stay Curious. Don't worry, the cat is safe :)
                </p>
                <div className="catsup-card-footer-links">
                  <a
                    href={PRIVACY_POLICY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="catsup-card-footer-link"
                  >
                    Privacy Policy
                  </a>
                  <span className="catsup-card-footer-sep">·</span>
                  <a
                    href={`${SAUCE_HOME}/terms`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="catsup-card-footer-link"
                  >
                    Terms of Use
                  </a>
                </div>
                <p className="catsup-card-footer-line catsup-card-footer-brought">
                  Brought to you by sauc-e
                </p>
                <p className="catsup-card-footer-line catsup-card-footer-prepared">
                  Prepared by Rilie Ravena Rivers
                </p>
              </div>
            </div>
          )}

        </main>

        {/* ===== MARKETING SECTION ===== */}
        <section className="catsup-marketing">
          <img
            src="/catsup_uvt.png"
            alt="CATS_UP — Us vs Them"
            className="catsup-marketing-img catsup-uvt-img"
          />
          <img
            src="/catsup_peak.png"
            alt="CATS_UP — Peak Flavour"
            className="catsup-marketing-img catsup-peak-img"
          />
        </section>

        {/* ===== SUBSCRIBE CTA ===== */}
        {!isSubscribed && (
          <section className="catsup-cta-section">
            <h2 className="catsup-cta-title">Learning That Actually Teaches</h2>
            <p className="catsup-cta-subtitle">Unlimited questions. $9.99/month.</p>
            <p className="catsup-cta-tagline">They give answers. We build thinkers.</p>
            <a
              href={STRIPE_PAYMENT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="catsup-cta-btn"
            >
              Subscribe at sauc-e.com
            </a>
          </section>
        )}

        {/* ===== LEGAL ===== */}
        <div className="catsup-legal">
          <a
            href={`${SAUCE_HOME}/terms`}
            target="_blank"
            rel="noopener noreferrer"
            className="catsup-legal-link"
          >
            Terms of Service
          </a>
          <span className="catsup-legal-sep">·</span>
          <a
            href={PRIVACY_POLICY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="catsup-legal-link"
          >
            Privacy Policy
          </a>
          <span className="catsup-legal-sep">·</span>
          <a
            href={`${SAUCE_HOME}/support`}
            target="_blank"
            rel="noopener noreferrer"
            className="catsup-legal-link"
          >
            Support
          </a>
        </div>

        {/* ===== FOOTER ===== */}
        <footer className="catsup-footer">
          <a
            href={SAUCE_HOME}
            target="_blank"
            rel="noopener noreferrer"
            className="catsup-footer-brand"
          >
            sauc-e.com
          </a>
          <p className="catsup-footer-tagline">HOME of all of our delicious APPS</p>
          <p className="catsup-footer-small">CATSUP is for Learning</p>
          <p className="catsup-footer-small">RELISH (Feelings) · BBQE (Safety)</p>
          <p className="catsup-footer-tiny">© 2026 3_6_NIFE.pi · 36Nife@gmail.com</p>
        </footer>

      </div>
    </div>
  )
}

export default App
