import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll } from "framer-motion";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowUpRight,
  ArrowUp,
  Menu,
  X,
  Play,
  Plus,
  Minus,
  Code2,
  Orbit,
  MoveUpRight,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AOS from "aos";
import "aos/dist/aos.css";
import Lenis from "lenis";
import ProjectGallery from "./components/ProjectGallery";
import Contact from "./components/Contact";
import MagneticLink from "./components/MagneticLink";
import { toolkits } from "./data";
const Scene = lazy(() => import("./components/Scene"));
gsap.registerPlugin(ScrollTrigger);
const links = [
  ["Home", "home"],
  ["About", "about"],
  ["Experience", "experience"],
  ["Projects", "projects"],
  ["Skills", "skills"],
  ["Education", "education"],
  ["Contact", "contact"],
];

function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 50);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  const toggle = useRef<HTMLButtonElement>(null);
  const navigation = useRef<HTMLElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        }),
      { rootMargin: "-15% 0px -60% 0px" },
    );
    links.forEach(([, id]) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!open) return;
    function key(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (event.key === "Tab") {
        const items = [
          toggle.current,
          ...Array.from(
            navigation.current?.querySelectorAll<HTMLAnchorElement>("a") || [],
          ),
        ].filter(Boolean) as HTMLElement[];
        if (event.shiftKey && document.activeElement === items[0]) {
          event.preventDefault();
          items.at(-1)?.focus();
        } else if (!event.shiftKey && document.activeElement === items.at(-1)) {
          event.preventDefault();
          items[0]?.focus();
        }
      }
    }
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [open]);
  return (
    <header className={`header${scrolled ? " scrolled" : ""}`}>
      <a className="brand" href="#home" aria-label="Fairoz Basha home">
        <span className="monogram">
          f<span>b</span>
          <i />
        </span>
        <span>
          FAIROZ<span className="brand-light"> BASHA</span>
          <sup>®</sup>
        </span>
      </a>
      <button
        ref={toggle}
        className="menu-toggle"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls="main-nav"
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
      <nav
        ref={navigation}
        id="main-nav"
        className={open ? "nav open" : "nav"}
        aria-label="Main navigation"
      >
        {links.map(([label, id]) => (
          <a
            key={id}
            className={active === id ? "active" : ""}
            href={`#${id}`}
            onClick={() => setOpen(false)}
          >
            {label}
            {id === "contact" && <ArrowUpRight size={15} />}
          </a>
        ))}
      </nav>
    </header>
  );
}
function Toolkit() {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="toolkit-grid">
      {toolkits.map((group, i) => (
        <div
          className="toolkit"
          key={group.title}
          data-aos={i % 2 ? "fade-down" : "fade-up"}
          data-aos-delay={i * 100}
        >
          <span className="mono muted">0{i + 1}</span>
          <h3>{group.title}</h3>
          <p>{group.subtitle}</p>
          <div>
            {group.items.map(([symbol, name, detail]) => (
              <div className="tool-item" key={name}>
                <button
                  aria-expanded={selected === name}
                  onClick={() => setSelected(selected === name ? null : name)}
                >
                  <span className="tool-symbol">{symbol}</span>
                  <span>{name}</span>
                  {selected === name ? <Minus size={15} /> : <Plus size={15} />}
                </button>
                {selected === name && <p className="tool-detail">{detail}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
function App() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    AOS.init({
      duration: 850,
      easing: "ease-out-cubic",
      offset: 65,
      once: true,
      disable: () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
    const refresh = () => AOS.refresh();
    window.addEventListener("load", refresh);
    const ctx = gsap.context(() => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.to(".hero-watermark", {
        xPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
      gsap.fromTo(
        ".timeline-line",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".experience-list",
            start: "top 75%",
            end: "bottom 65%",
            scrub: 0.7,
          },
        },
      );
      gsap.fromTo(
        ".process-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".process-grid",
            start: "top 85%",
            end: "bottom 45%",
            scrub: 1,
          },
        },
      );
    }, root);
    let lenis: Lenis | undefined;
    let tick: ((time: number) => void) | undefined;
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      lenis = new Lenis({ anchors: true, duration: 1.05 });
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
    }
    return () => {
      ctx.revert();
      lenis?.destroy();
      if (tick) gsap.ticker.remove(tick);
      window.removeEventListener("load", refresh);
    };
  }, []);
  return (
    <div ref={root}>
      <a className="skip-link" href="#about">
        Skip to content
      </a>
      <motion.div
        className="scroll-progress"
        style={{ scaleX: scrollYProgress }}
      />
      <Header />
      <main>
        <section id="home" className="hero">
          <div className="hero-topline mono">
            <span>
              <i className="status-dot" /> OPEN TO CREATIVE OPPORTUNITIES
            </span>
            <span>DESIGNER. DEVELOPER. ALWAYS CURIOUS.</span>
          </div>
          <div className="hero-content">
            <div className="hero-copy">
              <div className="hero-kicker" data-aos="fade-down">
                <span className="tiny-cross">✶</span>
                <span className="mono">
                  A LITTLE DESIGN.
                  <br />A LOT OF POSSIBILITY.
                </span>
              </div>
              <p className="intro" data-aos="fade-down" data-aos-delay="80">
                Hi, I’m Fairoz Basha.
              </p>
              <h1 data-aos="fade-down" data-aos-delay="160">
                Ideas made
                <br />
                <span className="serif">
                  to <span className="lavender">move.</span>
                </span>
                <span className="headline-dot">*</span>
              </h1>
              <p className="hero-role" data-aos="fade-up">
                MOTION GRAPHIC DESIGNER <span>&</span> DEVELOPER
              </p>
              <p
                className="hero-description"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                I transform creative ideas into visual experiences.
                <br />
                Where storytelling meets design and a little bit of code.
              </p>
              <div
                className="hero-actions"
                data-aos="fade-up"
                data-aos-delay="180"
              >
                <MagneticLink href="#projects">
                  Explore my work <ArrowUpRight size={19} />
                </MagneticLink>
                <a className="button secondary" href="#contact">
                  Let’s talk <span className="small-dot" />
                </a>
              </div>
            </div>
            <div className="hero-art">
              <div className="art-coordinate mono">
                FIG. 001 — CREATIVE ENERGY
              </div>
              <Suspense
                fallback={
                  <div className="scene-loading" role="status">
                    <span className="loading-orbit" />
                    FORMING A NEW PERSPECTIVE
                  </div>
                }
              >
                <Scene />
              </Suspense>
              <span className="scene-label mono">
                <i /> ALWAYS IN MOTION
              </span>
              <div className="orbit-note mono">
                A DIFFERENT
                <br />
                PERSPECTIVE, ALWAYS.
              </div>
            </div>
          </div>
          <div className="hero-bottom">
            <a className="scroll-cue" href="#about">
              <span className="scroll-icon">
                <ArrowDown size={17} />
              </span>
              <span className="mono">SCROLL TO EXPLORE</span>
            </a>
            <span className="hero-location mono">
              BASED IN INDIA <span>·</span> CREATING EVERYWHERE
            </span>
            <span className="mono hero-index">01 — 07</span>
          </div>
          <span className="hero-watermark" aria-hidden="true">
            IMAGINATION IN MOTION
          </span>
        </section>
        <div className="discipline-strip" aria-hidden="true">
          <span>MOTION DESIGN</span>
          <i>✶</i>
          <span>CREATIVE DEVELOPMENT</span>
          <i>✶</i>
          <span>VISUAL STORYTELLING</span>
          <i>✶</i>
          <span>3D EXPLORATIONS</span>
          <i>✶</i>
        </div>
        <section id="about" className="about section">
          <div className="section-top" data-aos="fade-down">
            <span className="eyebrow">01 / THE PERSON BEHIND THE PIXELS</span>
            <span className="mono muted">CREATIVITY, WITH A CURIOUS MIND.</span>
          </div>
          <div className="about-grid">
            <div className="about-visual" data-aos="fade-right">
              <div className="avatar-orbit">
                <span className="avatar-monogram">fb.</span>
                <i />
                <b>✶</b>
              </div>
              <div className="visual-caption mono">
                <span>DESIGN × TECHNOLOGY</span>
                <span>EST. IN CURIOSITY ↗</span>
              </div>
            </div>
            <div className="about-copy" data-aos="fade-up">
              <h2>
                A creative mind.
                <br />
                An <span className="serif lavender">ever-curious</span> soul.
              </h2>
              <p>
                I am Shaik Fairoz Basha, a creative Motion Graphic Designer &
                Developer with hands-on experience creating motion graphics,
                animations and digital visual content.
              </p>
              <p>
                I combine creative design skills with a background in Computer
                Applications, and I am continually expanding my knowledge in
                programming, machine learning, and artificial intelligence.
              </p>
              <p className="about-objective">
                My goal? Contribute to meaningful work, keep learning new
                skills, and grow with every challenge.
              </p>
              <a className="text-button" href="#contact">
                More than a project. A possibility. <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
          <div className="stats">
            {[
              ["06", "MONTHS IN MOTION DESIGN"],
              ["B.Com", "COMPUTER APPLICATIONS"],
              ["AI / ML", "INTERNSHIP EXPERIENCE"],
              ["03", "LANGUAGES: TELUGU, HINDI, ENGLISH"],
            ].map(([value, label], i) => (
              <div
                key={value}
                data-aos={i % 2 ? "fade-down" : "fade-up"}
                data-aos-delay={i * 80}
              >
                <strong>
                  {value}
                  <span className="lavender">{""}</span>
                </strong>
                <span className="mono">{label}</span>
              </div>
            ))}
          </div>
        </section>
        <section id="experience" className="experience section">
          <div className="section-top" data-aos="fade-down">
            <span className="eyebrow">02 / EXPERIENCE</span>
            <span className="mono muted">LEARNING BY MAKING</span>
          </div>
          <div className="experience-layout">
            <div data-aos="fade-up">
              <h2>
                Every experience.
                <br />A new <span className="serif lavender">perspective.</span>
              </h2>
              <p className="section-description">
                Creative practice meets a growing
                <br />
                interest in what technology can do.
              </p>
              <div className="experience-glyph" aria-hidden="true">
                <Orbit size={120} strokeWidth={0.55} />
              </div>
            </div>
            <div className="experience-list">
              <div className="timeline-line" />
              <article data-aos="fade-up">
                <span className="timeline-node" />
                <div className="experience-meta">
                  <span className="tag">DESIGN & ANIMATION</span>
                  <span className="mono muted">06 MONTHS</span>
                </div>
                <h3>Motion Graphic Designer</h3>
                <p>
                  Created motion graphics, animations and visual content using
                  Adobe After Effects and Adobe Illustrator for digital media
                  and presentations.
                </p>
                <div className="experience-tools">
                  <span>After Effects</span>
                  <span>Illustrator</span>
                  <Play size={15} />
                </div>
              </article>
              <article data-aos="fade-up" data-aos-delay="100">
                <span className="timeline-node" />
                <div className="experience-meta">
                  <span className="tag">EXPLORING TECHNOLOGY</span>
                  <span className="mono muted">LONG-TERM INTERNSHIP</span>
                </div>
                <h3>Machine Learning with AI</h3>
                <p>
                  A long-term internship in Machine Learning with Artificial
                  Intelligence — part of my ongoing exploration of programming
                  and intelligent technology.
                </p>
                <div className="experience-tools">
                  <span>AI / ML Internship</span>
                  <Code2 size={17} />
                </div>
              </article>
            </div>
          </div>
        </section>
        <section id="projects" className="projects section">
          <div className="section-top" data-aos="fade-down">
            <span className="eyebrow">03 / SELECTED PROJECTS</span>
            <span className="mono muted">STORIES WORTH EXPLORING</span>
          </div>
          <div className="section-heading" data-aos="fade-up">
            <h2>
              A few things
              <br />
              <span className="serif lavender">from my universe.</span>
            </h2>
            <p>
              Motion experiments, imagined worlds,
              <br />
              and ideas finding their form.
            </p>
            <ArrowDownRight
              className="section-arrow"
              size={52}
              strokeWidth={1}
            />
          </div>
          <ProjectGallery />
        </section>
        <section id="skills" className="skills section">
          <div className="section-top" data-aos="fade-down">
            <span className="eyebrow">04 / SKILLS & CREATIVE TOOLKIT</span>
            <span className="mono muted">
              THE TOOLS CHANGE. CURIOSITY STAYS.
            </span>
          </div>
          <div className="section-heading" data-aos="fade-up">
            <h2>
              Made with skill.
              <br />
              <span className="serif lavender">Driven by curiosity.</span>
            </h2>
            <p>
              A mix of creative tools, technical foundations,
              <br />
              and the human skills that connect them.
            </p>
          </div>
          <Toolkit />
        </section>
        <section id="education" className="education section">
          <div className="section-top" data-aos="fade-down">
            <span className="eyebrow">05 / EDUCATION</span>
            <span className="mono muted">A FOUNDATION TO BUILD ON</span>
          </div>
          <h2 data-aos="fade-up">
            Always a <span className="serif lavender">student.</span>
          </h2>
          <div className="education-grid">
            {[
              [
                "2022 — 2025",
                "B.Com",
                "Computer Applications",
                "Sri Chaitanya Degree College",
                "77%",
              ],
              [
                "2021 — 2022",
                "Intermediate",
                "Higher Secondary Education",
                "S.S.N Priyadarshini College",
                "55%",
              ],
              [
                "2020",
                "SSC",
                "Secondary School Education",
                "Sadhana High School",
                "98%",
              ],
            ].map(([year, title, subtitle, college, score], i) => (
              <article
                key={title}
                data-aos={i % 2 ? "fade-down" : "fade-up"}
                data-aos-delay={i * 100}
              >
                <div className="education-top">
                  <span className="mono">{year}</span>
                  <MoveUpRight size={18} />
                </div>
                <h3>{title}</h3>
                <p className="education-subtitle">{subtitle}</p>
                <p>{college}</p>
                <div className="education-grade">
                  <span className="mono muted">ACADEMIC SCORE</span>
                  <strong>{score}</strong>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section id="process" className="process section">
          <div className="section-top" data-aos="fade-down">
            <span className="eyebrow">THE CREATIVE PROCESS</span>
            <span className="mono muted">
              AN APPROACH TO MAKING THINGS MATTER
            </span>
          </div>
          <div className="section-heading" data-aos="fade-up">
            <h2>
              From a little spark.
              <br />
              <span className="serif lavender">To something more.</span>
            </h2>
            <p>
              A creative approach I aspire to bring
              <br />
              to every new idea.
            </p>
          </div>
          <div className="process-grid">
            <div className="process-line" />
            {[
              [
                "Discover",
                "Ask questions. Find the story. Understand what matters.",
                "◎",
              ],
              [
                "Conceptualize",
                "Connect the dots. Explore directions. Shape the idea.",
                "◇",
              ],
              [
                "Create",
                "Experiment with motion, form, and a little imagination.",
                "✶",
              ],
              [
                "Refine",
                "Step back. Look closer. Make every detail count.",
                "↗",
              ],
            ].map(([title, copy, glyph], i) => (
              <article
                key={title}
                data-aos={i % 2 ? "fade-down" : "fade-up"}
                data-aos-delay={i * 100}
              >
                <div className="process-glyph" aria-hidden="true">
                  {glyph}
                </div>
                <span className="mono muted">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>
        <Contact />
      </main>
      <footer>
        <a className="brand footer-brand" href="#home">
          <span className="monogram">
            f<span>b</span>
            <i />
          </span>
          <span>
            FAIROZ BASHA<sup>®</sup>
          </span>
        </a>
        <p>
          © {new Date().getFullYear()} · Designed & Developed for Shaik Fairoz
          Basha.
        </p>
        <a className="back-top mono" href="#home">
          BACK TO TOP <ArrowUp size={16} />
        </a>
      </footer>
      <motion.div
        className="site-enter"
        initial={reduced ? false : { scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
        aria-hidden="true"
      >
        <span>
          FAIROZ BASHA<span className="lavender">®</span>
        </span>
      </motion.div>
    </div>
  );
}
export default App;
