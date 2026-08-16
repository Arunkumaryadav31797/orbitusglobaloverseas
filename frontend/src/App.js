import { useEffect, useRef, useState } from "react";
import "@/App.css";
import axios from "axios";
import { motion, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import { ArrowRight, ArrowUpRight, Award, BookOpen, Check, ChevronDown, ChevronLeft, ChevronRight, CircleCheck, Clock3, Globe2, GraduationCap, Instagram, Linkedin, Menu, MessageCircle, Plane, ShieldCheck, Sparkles, Star, Target, X, Zap } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const easeOut = [0.16, 1, 0.3, 1];

const maskLine = { hidden: { y: "115%" }, show: (i) => ({ y: "0%", transition: { duration: 1, delay: 0.2 + i * 0.13, ease: easeOut } }) };

const destinations = [
  { country: "United Kingdom", flag: "🇬🇧", code: "UK", info: "2-year post-study work visa", tuition: "$22k–$42k / year", fields: "Business · Computing · Design" },
  { country: "United States", flag: "🇺🇸", code: "USA", info: "OPT up to 3 years", tuition: "$24k–$55k / year", fields: "STEM · Business · Arts" },
  { country: "Canada", flag: "🇨🇦", code: "CAN", info: "Up to 3-year PGWP", tuition: "$18k–$36k / year", fields: "IT · Healthcare · Management" },
  { country: "Australia", flag: "🇦🇺", code: "AUS", info: "2–4 year PSW visa", tuition: "$20k–$40k / year", fields: "Engineering · Nursing · IT" },
  { country: "Germany & Europe", flag: "🇩🇪", code: "EUR", info: "Low-cost public options", tuition: "$0–$18k / year", fields: "Engineering · Research · MBA" },
  { country: "New Zealand", flag: "🇳🇿", code: "NZ", info: "Up to 3-year PSWV", tuition: "$19k–$35k / year", fields: "Hospitality · Business · Science" },
];
const services = [
  [Target, "Profile Evaluation", "A clear, honest strategy built around your grades, goals and budget."],
  [BookOpen, "SOP, Essay & LOR", "Turn your story into applications that admissions teams remember."],
  [Award, "Scholarship Planning", "Find grants, loans and funding routes that make your plan achievable."],
  [ShieldCheck, "Visa Guidance", "Embassy-ready documentation and mock interviews, end to end."],
  [Zap, "Test Preparation", "Smart guidance for IELTS, TOEFL, PTE, GRE and GMAT."],
  [Plane, "Pre-Departure", "Accommodation, forex, health cover and your first days abroad."],
];
const reviews = [
  { name: "Ananya Reddy", uni: "University of Birmingham", course: "MSc Data Science", country: "🇬🇧", image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=160&q=80", quote: "Orbitus made every step feel simple. My counsellor was always one call away." },
  { name: "Rahul Mehta", uni: "University of Toronto", course: "Master of Management", country: "🇨🇦", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80", quote: "From shortlisting to visa approval, the team was transparent and genuinely invested." },
  { name: "Sara Khan", uni: "Monash University", course: "Bachelor of Nursing", country: "🇦🇺", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80", quote: "The mock interview prep gave me the confidence to secure my visa on the first attempt." },
];
const faqs = ["What are the minimum requirements to study abroad?", "How much does Orbitus charge for consultation?", "When should I start my application process?", "Can I work part-time while studying?"];
const faqAnswers = ["Requirements vary by country, course and university. We assess your academics, English proficiency and goals to create a realistic shortlist.", "Your first profile assessment and strategy call are completely free. We’ll explain any next-step services clearly before you decide.", "Ideally 8–12 months before your preferred intake. Some competitive courses and scholarship deadlines close earlier.", "Yes. Most destinations allow international students to work part-time with conditions. We’ll guide you on the rules for your country."];
const cities = ["London", "Toronto", "Sydney", "New York", "Berlin", "Auckland", "Dublin", "Melbourne"];

function Reveal({ children, delay = 0, className = "" }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 38 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-70px" }} transition={{ duration: 0.95, delay, ease: easeOut }}>{children}</motion.div>;
}

function Logo() { return <a href="#top" className="logo" data-testid="brand-logo"><span className="logo-mark"><Globe2 size={20} /></span><span>ORBITUS <b>GLOBAL</b><small>OVERSEAS</small></span></a>; }
function Button({ children, className = "", ...props }) { return <button className={`btn ${className}`} {...props}>{children}</button>; }

function Chapter({ num, eyebrow, title, copy, dark }) {
  return <Reveal className={`chapter ${dark ? "dark" : ""}`}>
    <div className="chapter-meta"><span className="chapter-num">{num}</span><span className="eyebrow">{eyebrow}</span></div>
    <h2>{title}</h2>
    {copy && <p>{copy}</p>}
  </Reveal>;
}

function Marquee() {
  const row = cities.map((c) => <span key={c} className="marquee-item">{c}<i>✦</i></span>);
  return <div className="marquee" aria-hidden="true"><div className="marquee-track"><div className="marquee-row">{row}</div><div className="marquee-row">{row}</div></div></div>;
}

function Header({ onAssess }) {
  const [open, setOpen] = useState(false);
  return <>
    <div className="admission-bar"><span><Sparkles size={14} /> Admissions open for upcoming intakes</span><button onClick={onAssess} data-testid="admissions-apply-button">Get free guidance <ArrowRight size={14} /></button></div>
    <header className="header"><div className="container nav">
      <Logo />
      <nav className={open ? "nav-links open" : "nav-links"}>{[["Destinations", "destinations"], ["Services", "services"], ["Process", "process"], ["Stories", "stories"], ["About", "about"]].map(([label, id]) => <a href={`#${id}`} key={id} onClick={() => setOpen(false)} data-testid={`nav-${id}-link`}>{label}</a>)}<a href="#contact" onClick={() => setOpen(false)} data-testid="nav-contact-link">Contact</a></nav>
      <div className="nav-actions"><a className="track-link" href="#contact" data-testid="track-application-link">Track application <ArrowUpRight size={14} /></a><a className="whatsapp-link" href="https://wa.me/447760973454?text=Hi%20Orbitus%20Global%20Overseas%2C%20I%20would%20like%20to%20book%20a%20free%20study%20abroad%20consultation." target="_blank" rel="noreferrer" data-testid="header-whatsapp-link"><MessageCircle size={15} /> WhatsApp</a><Button className="btn-gold nav-cta" onClick={onAssess} data-testid="header-assessment-button">Free assessment <ArrowRight size={15} /></Button></div>
      <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Toggle navigation" data-testid="mobile-menu-button">{open ? <X /> : <Menu />}</button>
    </div></header>
  </>;
}

function Hero({ onAssess }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  return <section className="hero" id="top" ref={ref}>
    <div className="hero-glow" />
    <div className="container hero-grid">
      <div className="hero-copy">
        <motion.span className="kicker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 0.9 }}><span className="pulse-dot" /> Hyderabad — London · Your global education partner</motion.span>
        <h1>
          <span className="mask"><motion.span custom={0} variants={maskLine} initial="hidden" animate="show">Turn your dream of</motion.span></span>
          <span className="mask"><motion.span custom={1} variants={maskLine} initial="hidden" animate="show">studying abroad</motion.span></span>
          <span className="mask"><motion.span custom={2} variants={maskLine} initial="hidden" animate="show"><em>into reality.</em></motion.span></span>
        </h1>
        <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.9, ease: easeOut }}>End-to-end guidance for ambitious students targeting top universities in the UK, USA, Canada, Australia and Europe.</motion.p>
        <motion.div className="hero-buttons" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.9, ease: easeOut }}>
          <Button className="btn-gold" onClick={onAssess} data-testid="hero-assessment-button">Start free assessment <ArrowRight size={17} /></Button>
          <a href="#destinations" className="text-link" data-testid="hero-destinations-link">Explore countries <ArrowUpRight size={17} /></a>
        </motion.div>
        <motion.div className="mini-trust" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.9 }}>
          <div className="avatar-stack"><span>AR</span><span>RM</span><span>SK</span></div>
          <div><strong>Join 3,000+ global graduates</strong><small>Guided with confidence, every step</small></div>
        </motion.div>
      </div>
      <motion.div className="hero-visual" style={{ y }} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, delay: 0.5, ease: easeOut }}>
        <div className="hero-frame">
          <img src="https://images.unsplash.com/photo-1758270704524-596810e891b5?crop=entropy&cs=srgb&fm=jpg&q=85&w=1000" alt="International students on a university campus" />
          <div className="hero-spotlight" />
        </div>
        <div className="visual-label label-top"><span className="label-icon"><ShieldCheck size={19} /></span><div><b>98.4%</b><small>Visa success rate</small></div></div>
        <div className="visual-label label-bottom"><span className="flag-bubble">🇬🇧</span><div><b>Dream destination</b><small>Now within reach</small></div><ArrowUpRight size={17} /></div>
      </motion.div>
    </div>
    <div className="container stats">
      {[["98.4%", "Visa success rate"], ["500+", "University partnerships"], ["$2M+", "Scholarships secured"], ["1:1", "Dedicated mentorship"]].map(([n, l], i) => <Reveal key={l} delay={i * 0.08} className="stat"><strong>{n}</strong><span>{l}</span></Reveal>)}
    </div>
  </section>;
}

function Destinations() {
  return <section className="section destinations" id="destinations"><div className="container">
    <Chapter num="01" eyebrow="Choose your horizon" title="Where will your next chapter take you?" copy="From your first shortlist to your first day on campus, our destination experts make the right choice feel clear." />
    <div className="destination-grid">{destinations.map((item, i) => <Reveal key={item.code} delay={(i % 3) * 0.08}>
      <motion.article whileHover={{ y: -8 }} transition={{ duration: 0.35, ease: easeOut }} className="destination-card" data-testid={`destination-card-${item.code.toLowerCase()}`}>
        <span className="ghost-code">{item.code}</span>
        <div className="country-top"><span className="country-flag">{item.flag}</span><span className="country-code">{item.code}</span></div>
        <h3>{item.country}</h3>
        <p className="country-info"><Clock3 size={14} /> {item.info}</p>
        <div className="country-details"><div><small>Typical tuition</small><strong>{item.tuition}</strong></div><div><small>Popular fields</small><strong>{item.fields}</strong></div></div>
        <a href="#assessment" onClick={(e) => e.preventDefault()} data-testid={`destination-guide-${item.code.toLowerCase()}`}>View country guide <ArrowUpRight size={15} /></a>
      </motion.article>
    </Reveal>)}</div>
  </div></section>;
}

function Services() {
  return <section className="section services" id="services"><div className="container">
    <Chapter num="02" eyebrow="One partner. Every milestone." title="Clarity for every step of your journey." copy="You bring the ambition. We bring the experience, systems and people to help you move forward." />
    <div className="service-list">{services.map(([Icon, title, copy], i) => <Reveal key={title} delay={i * 0.04}>
      <div className="service-row" data-testid={`service-card-${i + 1}`}>
        <span className="service-num">{String(i + 1).padStart(2, "0")}</span>
        <span className="service-icon"><Icon size={20} /></span>
        <h3>{title}</h3>
        <p>{copy}</p>
        <ArrowUpRight className="service-arrow" size={22} />
      </div>
    </Reveal>)}</div>
  </div></section>;
}

function Roadmap() {
  const steps = ["Free profile evaluation & strategy call", "University shortlisting & documents", "Application submission & offer letter", "Financial proofs & visa approval", "Pre-departure briefing & touchdown"];
  const notes = ["We understand your ambition before recommending a path.", "A focused shortlist matched to your goals and budget.", "Polished applications submitted with confidence.", "Embassy-ready support until your visa is in hand.", "Feel ready for your new home before you fly."];
  return <section className="section roadmap" id="process"><div className="container">
    <div className="roadmap-head"><Chapter num="03" eyebrow="A simpler way forward" title="Your journey, mapped out." copy="No guesswork. Just a proven five-step roadmap and a team in your corner." dark /><div className="roadmap-badge"><CircleCheck size={18} /><span><b>Built around you</b><small>Personalised at every stage</small></span></div></div>
    <div className="steps">{steps.map((step, i) => <Reveal key={step} delay={i * 0.09}><div className="step" data-testid={`roadmap-step-${i + 1}`}><div className="step-num">{String(i + 1).padStart(2, "0")}</div><h3>{step}</h3><p>{notes[i]}</p></div></Reveal>)}</div>
  </div></section>;
}

function Assessment({ close }) {
  const [step, setStep] = useState(1); const [sent, setSent] = useState(false); const [error, setError] = useState("");
  const [form, setForm] = useState({ qualification: "", degree: "", countries: [], intake: "", english: "", budget: "", full_name: "", email: "", phone: "", city: "", consent: false });
  const set = (key, value) => setForm({ ...form, [key]: value });
  const toggleCountry = (c) => set("countries", form.countries.includes(c) ? form.countries.filter((x) => x !== c) : [...form.countries, c]);
  const next = () => { if (step === 1 && (!form.qualification || !form.degree || !form.countries.length || !form.intake)) return setError("Please complete your qualification, target degree, country and intake."); if (step === 2 && (!form.english || !form.budget)) return setError("Please choose your English test status and annual budget."); setError(""); setStep(step + 1); };
  const submit = async (e) => { e.preventDefault(); if (!form.full_name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) || !/^\+?[0-9\s-]{9,}$/.test(form.phone) || !form.city || !form.consent) return setError("Please complete your name, valid contact details and consent."); try { await axios.post(`${API}/leads`, form); setSent(true); } catch (_) { setError("We couldn’t save your assessment right now. Please try again."); } };
  return <div className="modal-backdrop" role="dialog" aria-modal="true" data-testid="assessment-modal"><motion.div className="assessment-modal" initial={{ opacity: 0, y: 34, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5, ease: easeOut }}>
    <button className="modal-close" onClick={close} aria-label="Close assessment" data-testid="assessment-close-button"><X /></button>
    {sent ? <div className="success-state"><div className="success-icon"><Check size={30} /></div><span className="eyebrow">Assessment received</span><h2>You’re one step closer, {form.full_name.split(" ")[0]}.</h2><p>Our destination expert will review your profile and reach out within one business day with a personalised plan.</p><a className="btn btn-whatsapp" href="https://wa.me/447760973454?text=Hi%20Orbitus%20Global%20Overseas%2C%20I%20just%20completed%20my%20free%20assessment." target="_blank" rel="noreferrer" data-testid="success-whatsapp-button"><MessageCircle size={17} /> Chat with your counsellor</a></div> : <>
      <div className="modal-heading"><span className="eyebrow">Free profile assessment</span><h2>Let’s find your best-fit path.</h2><p>Three minutes now. A clearer study-abroad plan next.</p></div>
      <div className="progress"><span className="progress-track"><i style={{ width: `${step * 33.33}%` }} /></span><small>Step {step} of 3</small></div>
      <form onSubmit={submit}>
        {step === 1 && <div className="form-step"><label>Current highest qualification<select value={form.qualification} onChange={(e) => set("qualification", e.target.value)} data-testid="qualification-select"><option value="">Select qualification</option><option>12th Grade</option><option>Bachelor&apos;s</option><option>Master&apos;s</option></select></label><label>Target degree<select value={form.degree} onChange={(e) => set("degree", e.target.value)} data-testid="degree-select"><option value="">Select target degree</option><option>Undergraduate</option><option>Postgraduate</option><option>Diploma</option><option>Doctorate</option></select></label><label>Preferred countries <span className="hint">Select all that apply</span><div className="chips">{["UK", "USA", "Canada", "Australia", "Europe", "New Zealand", "Other"].map((c) => <button type="button" className={form.countries.includes(c) ? "chip selected" : "chip"} onClick={() => toggleCountry(c)} key={c} data-testid={`country-chip-${c.toLowerCase().replace(" ", "-")}`}>{form.countries.includes(c) && <Check size={12} />} {c}</button>)}</div></label><label>Target intake<select value={form.intake} onChange={(e) => set("intake", e.target.value)} data-testid="intake-select"><option value="">Choose intake</option><option>Fall 2026</option><option>Spring 2027</option><option>Later</option></select></label></div>}
        {step === 2 && <div className="form-step"><label>English test status<select value={form.english} onChange={(e) => set("english", e.target.value)} data-testid="english-select"><option value="">Choose status</option><option>IELTS</option><option>TOEFL</option><option>PTE</option><option>Duolingo</option><option>Not yet taken</option></select></label><label>Expected annual budget <span className="hint">Tuition + living</span><select value={form.budget} onChange={(e) => set("budget", e.target.value)} data-testid="budget-select"><option value="">Choose range</option><option>Under $20,000</option><option>$20,000–$35,000</option><option>$35,000–$50,000</option><option>$50,000+</option></select></label><div className="budget-note"><Sparkles size={18} /><span>Not sure yet? That’s okay. We’ll help you build a realistic budget around your destination.</span></div></div>}
        {step === 3 && <div className="form-step"><label>Full name<input value={form.full_name} onChange={(e) => set("full_name", e.target.value)} placeholder="e.g. Priya Sharma" data-testid="full-name-input" /></label><label>Email address<input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" data-testid="email-input" /></label><label>Phone / WhatsApp number<input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 00000 00000" data-testid="phone-input" /></label><label>Current city / nationality<input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Hyderabad, India" data-testid="city-input" /></label><label className="consent"><input type="checkbox" checked={form.consent} onChange={(e) => set("consent", e.target.checked)} data-testid="consent-checkbox" /> <span>I agree to receive admission updates via WhatsApp / Email.</span></label></div>}
        {error && <p className="form-error" role="alert" data-testid="assessment-error">{error}</p>}
        <div className="form-actions">{step > 1 && <button type="button" className="back-button" onClick={() => { setError(""); setStep(step - 1); }} data-testid="assessment-back-button"><ChevronLeft size={16} /> Back</button>}{step < 3 ? <Button type="button" className="btn-dark" onClick={next} data-testid="assessment-next-button">Continue <ChevronRight size={16} /></Button> : <Button type="submit" className="btn-gold" data-testid="assessment-submit-button">Get my free assessment <ArrowRight size={16} /></Button>}</div>
      </form></>}
  </motion.div></div>;
}

function Reviews() {
  const [active, setActive] = useState(0);
  return <section className="section stories" id="stories"><div className="container">
    <div className="stories-heading"><Chapter num="04" eyebrow="Real journeys. Real momentum." title="The next success story could be yours." /><div className="review-controls"><button onClick={() => setActive((active + reviews.length - 1) % reviews.length)} aria-label="Previous story" data-testid="previous-story-button"><ChevronLeft /></button><button onClick={() => setActive((active + 1) % reviews.length)} aria-label="Next story" data-testid="next-story-button"><ChevronRight /></button></div></div>
    <div className="review-grid">{reviews.map((r, i) => <motion.article animate={{ opacity: i === active ? 1 : 0.5, scale: i === active ? 1 : 0.97 }} transition={{ duration: 0.5, ease: easeOut }} className="review-card" key={r.name} data-testid={`review-card-${i + 1}`}>
      <div className="review-person"><img src={r.image} alt={r.name} /><div><strong>{r.name}</strong><small>{r.course}</small></div><span className="review-flag">{r.country}</span></div>
      <div className="stars">{[1, 2, 3, 4, 5].map((n) => <Star key={n} size={14} fill="currentColor" />)}</div>
      <p>“{r.quote}”</p>
      <div className="review-uni"><GraduationCap size={16} /><span>{r.uni}</span><CircleCheck size={16} /></div>
    </motion.article>)}</div>
  </div></section>;
}

function Faq() {
  const [open, setOpen] = useState(0);
  return <section className="section faq" id="about"><div className="container faq-grid">
    <Chapter num="05" eyebrow="Questions, answered" title="Good decisions start with clarity." copy="Still curious? Our counsellors are happy to talk through your situation — no pressure, no jargon." />
    <div className="faq-list">{faqs.map((q, i) => <div className={open === i ? "faq-item active" : "faq-item"} key={q}><button onClick={() => setOpen(open === i ? -1 : i)} data-testid={`faq-button-${i + 1}`}><span>{q}</span><ChevronDown size={18} /></button>{open === i && <p data-testid={`faq-answer-${i + 1}`}>{faqAnswers[i]}</p>}</div>)}</div>
  </div></section>;
}

function Footer() {
  return <footer id="contact"><div className="container footer-grid">
    <div><Logo /><p className="footer-copy">Make your global ambition actionable with guidance that puts your future first.</p><div className="socials"><a href="https://www.instagram.com" aria-label="Instagram" data-testid="instagram-link"><Instagram size={17} /></a><a href="https://www.linkedin.com" aria-label="LinkedIn" data-testid="linkedin-link"><Linkedin size={17} /></a></div></div>
    <div><h4>Explore</h4><a href="#destinations" data-testid="footer-destinations-link">Study destinations</a><a href="#services" data-testid="footer-services-link">Our services</a><a href="#process" data-testid="footer-process-link">How it works</a></div>
    <div><h4>Talk to us</h4><a href="mailto:Contact.orbitusglobal@gmail.com" data-testid="footer-email-link">Contact.orbitusglobal@gmail.com</a><a href="tel:+918499042433" data-testid="footer-mobile-link">+91 84990 42433</a><a href="https://wa.me/447760973454" data-testid="footer-whatsapp-link">WhatsApp: +44 77609 73454</a></div>
    <div><h4>Our offices</h4><p>Hyderabad, India<br />London, United Kingdom</p><span className="trust-badge"><ShieldCheck size={16} /> Trusted guidance, always</span></div>
  </div><div className="container footer-bottom"><span>© 2026 Orbitus Global Overseas. All rights reserved.</span><span>Privacy · Terms · Student-first advice</span></div></footer>;
}

function App() {
  const [assessment, setAssessment] = useState(false);
  useEffect(() => {
    const lenis = new Lenis({ anchors: true, lerp: 0.09 });
    let raf;
    const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);
  return <div className="site">
    <Header onAssess={() => setAssessment(true)} />
    <main>
      <Hero onAssess={() => setAssessment(true)} />
      <Marquee />
      <Destinations />
      <Services />
      <Roadmap />
      <Reviews />
      <section className="assessment-banner" id="assessment"><div className="container assessment-inner">
        <Reveal><span className="eyebrow">Your next move</span><h2>Get a plan that feels <em>made for you.</em></h2><p>Tell us where you are. We’ll show you what’s possible.</p></Reveal>
        <Button className="btn-dark" onClick={() => setAssessment(true)} data-testid="banner-assessment-button">Start free assessment <ArrowRight size={17} /></Button>
      </div></section>
      <Faq />
    </main>
    <Footer />
    <a className="floating-whatsapp" href="https://wa.me/447760973454?text=Hi%20Orbitus%20Global%20Overseas%2C%20I%20would%20like%20to%20book%20a%20free%20study%20abroad%20consultation." target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" data-testid="floating-whatsapp-button"><MessageCircle size={23} /><span>Chat with us</span></a>
    {assessment && <Assessment close={() => setAssessment(false)} />}
  </div>;
}

export default App;
