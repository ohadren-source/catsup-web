import './Landing.css';

interface LandingProps {
  onEnter: () => void;
}

const SAUCE_HOME = 'https://sauc-e.com';
const CHECKOUT_URL = 'https://sauc-e.com/checkitout';

export default function Landing({ onEnter }: LandingProps) {
  return (
    <div className="catsup-landing">
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

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <img src="/catsup_logo_1024x1024.jpg" alt="CATSUP" className="bowl-logo" />
          <h1>CATSUP (3,6,9)</h1>
          <p className="tagline">Learn Through Questions</p>
          <p className="subtitle">Understanding = Questions / Ego</p>
          <button className="enter-btn" onClick={onEnter}>Enter App</button>
        </div>
      </section>

      {/* SHOWCASE — Three Q&A Pairs */}
      <section className="showcase">
        <h2 className="showcase-title">How It Works</h2>
        <div className="showcase-container">
          
          {/* PAPA — Philosophy */}
          <div className="qa-pair papa">
            <div className="qa-label">PAPA</div>
            <div className="qa-content">
              <div className="question-side">
                <img src="/iPad_PHI_Question.png" alt="Papa question" />
              </div>
              <div className="answer-side">
                <img src="/iPad_PHI_Response.png" alt="Papa answer" />
              </div>
            </div>
          </div>

          {/* MAMA — History */}
          <div className="qa-pair mama">
            <div className="qa-label">MAMA</div>
            <div className="qa-content">
              <div className="question-side">
                <img src="/history_q_-_iPad_Pro_13-inch__M5__-_2026-02-24_at_17_45_17.jpg" alt="Mama question" />
              </div>
              <div className="answer-side">
                <img src="/history_r_-_iPad_Pro_13-inch__M5__-_2026-02-24_at_18_12_57.jpg" alt="Mama answer" />
              </div>
            </div>
          </div>

          {/* LEM — Literature */}
          <div className="qa-pair lem">
            <div className="qa-label">LEM</div>
            <div className="qa-content">
              <div className="question-side">
                <img src="/lit_q_r_-_iPad_Pro_13-inch__M5__-_2026-02-24_at_18_16_06.jpg" alt="Lem question" />
              </div>
              <div className="answer-side">
                <img src="/Lit_Question___Response.jpg" alt="Lem answer" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* PREMIUM BOTTLES */}
      <section className="premium">
        <div className="premium-content">
          <div className="premium-bottle">
            <img src="/CATSUP_PRO_FLAVOR_student_1024x2.png" alt="Student flavor" className="bottle-img" />
          </div>
          <div className="premium-bottle">
            <img src="/CATSUP_PRO_FLAVOR_school_1024x2.png" alt="School flavor" className="bottle-img" />
          </div>
        </div>
      </section>

      {/* U vs THEM */}
      <section className="u-vs-them">
        <div className="uvt-header">
          <img src="/catsup_logo_1024x1024.jpg" alt="CATSUP" className="uvt-logo" />
          <h2>CATSUP (3,6,9) US vs THEM</h2>
          <p>Feeling behind? We help you catch up.</p>
        </div>
        
        <div className="uvt-comparison">
          <img src="/catsup_iphone_U_v_T.png" alt="US vs THEM comparison" className="uvt-image" />
        </div>

        <div className="uvt-footer">
          <p className="uvt-tagline">"They give answers. We build thinkers."</p>
          <p className="uvt-subtitle">Cheaper than a tutor. Better than cheating.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <button className="cta-button" onClick={onEnter}>Start Learning</button>
      </section>
    </div>
  );
}
