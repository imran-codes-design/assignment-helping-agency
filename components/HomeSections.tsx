const services = [
  {
    icon: "✎",
    title: "Writing guidance",
    text: "Shape a clear argument, plan a structure, and make academic writing feel more manageable.",
  },
  {
    icon: "⌕",
    title: "Research planning",
    text: "Explore research questions, source strategies, and practical ways to organize your project.",
  },
  {
    icon: "▤",
    title: "Data & methods",
    text: "Talk through research methods, analysis approaches, and how to explain your process.",
  },
  {
    icon: "⌘",
    title: "Technical projects",
    text: "Get learning-focused support with coding concepts, project planning, and technical reports.",
  },
  {
    icon: "¶",
    title: "Editing & clarity",
    text: "Improve readability, flow, and consistency while keeping the work and ideas yours.",
  },
  {
    icon: "◎",
    title: "Study skills",
    text: "Build a realistic plan for deadlines, revision, referencing, and focused study sessions.",
  },
];

const subjects = [
  "Business & management",
  "Finance & economics",
  "Computing & data",
  "Engineering",
  "Health sciences",
  "Law",
  "Psychology",
  "Education",
  "Social sciences",
  "Marketing",
  "Humanities",
  "Natural sciences",
];

const steps = [
  ["01", "Tell us what you're working on", "Share your subject, goals, and the kind of guidance you need."],
  ["02", "Agree a useful next step", "Clarify the scope and choose a practical way to move forward."],
  ["03", "Work through the ideas", "Build understanding with structured, learning-focused support."],
  ["04", "Review and reflect", "Use feedback to refine your own work and plan what comes next."],
];

const benefits = [
  ["Your ideas stay yours", "Support is designed to help you understand and develop your own work."],
  ["Clear scope from the start", "Discuss what you need before deciding whether the support is a fit."],
  ["Respectful, private contact", "Only share information that is necessary to discuss your request."],
  ["Learning comes first", "Guidance should complement your course rules and academic integrity policies."],
];

const samples = [
  ["Research planning", "Turning a broad topic into a focused research question."],
  ["Data storytelling", "Presenting findings with clear labels and thoughtful interpretation."],
  ["Essay structure", "Organizing a discussion into a coherent, readable argument."],
];

export function HomeSections() {
  return (
    <>
      <section className="hero" id="home">
        <div className="hero__grid" aria-hidden="true" />
        <div className="container hero__inner">
          <div className="hero__copy">
            <p className="pill"><span className="pill__dot" /> Thoughtful academic guidance</p>
            <h1>Make space for your <span>best thinking.</span></h1>
            <p className="hero__description">
              A calm, practical partner for navigating research, writing, and the next step in your studies.
            </p>
            <div className="hero__actions">
              <a className="button button--primary" href="#quote-form">Explore support <span aria-hidden="true">↗</span></a>
              <a className="button button--secondary" href="#how-it-works"><span className="play-icon" aria-hidden="true">▶</span> How it works</a>
            </div>
            <p className="hero__note">A learning-first approach. No promises of grades or outcomes.</p>
          </div>
          <div className="hero-art" aria-label="Illustration of a notebook, pencil, and study notes">
            <div className="hero-art__sun" />
            <div className="hero-art__paper">
              <span className="hero-art__paper-label">FIELD NOTES</span>
              <span className="hero-art__paper-title">Ideas into<br />understanding</span>
              <span className="hero-art__line" />
              <span className="hero-art__line hero-art__line--short" />
              <span className="hero-art__scribble">✳</span>
            </div>
            <div className="hero-art__badge"><span>✦</span> Your work,<br />your direction</div>
            <div className="hero-art__pencil" />
          </div>
        </div>
        <div className="container hero__bottom">
          <span>Curious minds welcome</span>
          <span className="hero__bottom-rule" />
          <span>Practical support at every stage</span>
        </div>
      </section>

      <section className="section section--white" id="services">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Ways we can work together</p>
            <h2>Support for the work<br className="desktop-break" /> behind the work.</h2>
            <p>Explore learning-focused guidance for the questions and projects that matter to you.</p>
          </div>
          <div className="service-grid">
            {services.map((service) => (
              <article className="service-card" key={service.title}>
                <span className="service-card__icon" aria-hidden="true">{service.icon}</span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <a href="#quote-form">Talk about this <span aria-hidden="true">→</span></a>
              </article>
            ))}
          </div>
          <p className="section-footnote">Support scope depends on your course rules and the details of your request.</p>
        </div>
      </section>

      <section className="section disciplines" aria-labelledby="disciplines-heading">
        <div className="container disciplines__inner">
          <div>
            <p className="eyebrow">A broad range of subjects</p>
            <h2 id="disciplines-heading">Bring your curiosity.<br /><span>We'll find the focus.</span></h2>
            <p className="disciplines__intro">These are example subject areas, not a promise of specialist availability. Tell us what you're studying and we'll discuss fit.</p>
          </div>
          <ul className="subject-list">
            {subjects.map((subject) => <li key={subject}><span aria-hidden="true">✦</span>{subject}</li>)}
          </ul>
        </div>
      </section>

      <section className="section section--white" id="how-it-works">
        <div className="container">
          <div className="section-heading section-heading--center">
            <p className="eyebrow">A clear place to begin</p>
            <h2>From question to next step.</h2>
            <p>A simple outline for a thoughtful, collaborative support experience.</p>
          </div>
          <div className="steps-grid">
            {steps.map(([number, title, text]) => (
              <article className="step-card" key={number}>
                <span className="step-card__number">{number}</span>
                <span className="step-card__connector" aria-hidden="true" />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="trust-section">
        <div className="container trust-section__inner">
          <div className="trust-section__copy">
            <p className="eyebrow eyebrow--light">A better way to work</p>
            <h2>Thoughtful support.<br /><span>Your learning at the centre.</span></h2>
            <p>Academic work is personal. Our starting point is listening, clarity, and a shared understanding of the kind of help that fits your goals.</p>
            <a className="button button--light" href="#quote-form">Tell us what you need <span aria-hidden="true">↗</span></a>
          </div>
          <div className="benefit-list">
            {benefits.map(([title, text], index) => (
              <article className="benefit-item" key={title}>
                <span className="benefit-item__number">0{index + 1}</span>
                <div><h3>{title}</h3><p>{text}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="samples">
        <div className="container">
          <div className="section-heading section-heading--row">
            <div>
              <p className="eyebrow">A glimpse of the process</p>
              <h2>Small examples.<br />Useful ways of thinking.</h2>
            </div>
            <p>These original, illustrative prompts show the kinds of questions a study conversation might explore.</p>
          </div>
          <div className="sample-grid">
            {samples.map(([category, title], index) => (
              <article className={`sample-card sample-card--${index + 1}`} key={title}>
                <div className="sample-card__art" aria-hidden="true">
                  {index === 0 ? <><span className="sample-card__circle" /><span className="sample-card__chart">↗</span></> :
                    index === 1 ? <><span className="sample-card__bars"><i /><i /><i /><i /></span><span className="sample-card__axis" /></> :
                      <><span className="sample-card__note">A → B → C</span><span className="sample-card__lines"><i /><i /><i /></span></>}
                </div>
                <div className="sample-card__body">
                  <span className="sample-card__category">{category} · illustrative prompt</span>
                  <h3>{title}</h3>
                  <a href="#quote-form">Discuss your project <span aria-hidden="true">→</span></a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--white" id="reviews">
        <div className="container">
          <div className="section-heading section-heading--center">
            <p className="eyebrow">Learner voices</p>
            <h2>Honest feedback belongs here.</h2>
            <p>We won't invent testimonials, ratings, or results. Verified feedback can be added when it is available and approved for publication.</p>
          </div>
          <div className="testimonial-placeholder">
            <span className="testimonial-placeholder__mark" aria-hidden="true">“</span>
            <div>
              <strong>Placeholder for verified learner feedback</strong>
              <p>This space is intentionally reserved for genuine, permissioned testimonials.</p>
            </div>
            <span className="testimonial-placeholder__tag">No reviews displayed</span>
          </div>
        </div>
      </section>
    </>
  );
}
