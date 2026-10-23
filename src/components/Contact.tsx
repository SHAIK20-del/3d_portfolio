import { lazy, Suspense, useState } from "react";
import type { FormEvent } from "react";
import { ArrowUpRight, Copy, Check } from "lucide-react";
import { email } from "../data";
const Scene = lazy(() => import("./Scene"));
export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState("");
  const [draft, setDraft] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setStatus(
        "Copy is unavailable here. Select the email address above to copy it manually.",
      );
    }
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name")).trim();
    const from = String(data.get("email")).trim();
    const message = String(data.get("message")).trim();
    if (!name || !from || !message) {
      setStatus("Please enter your name, email, and a message.");
      return;
    }
    const draftUrl = `mailto:${email}?subject=${encodeURIComponent(`Portfolio enquiry from ${name}`)}&body=${encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${from}`)}`;
    setDraft(draftUrl);
    window.open(draftUrl, "_blank", "noopener,noreferrer");
    setStatus(
      "Your email app has been requested. Review and send the message there; this website has not sent it.",
    );
  }
  return (
    <section className="contact section" id="contact">
      <div className="section-top" data-aos="fade-down">
        <span className="eyebrow">06 / LET’S COLLABORATE</span>
        <span className="mono muted">GOOD WORK STARTS WITH A CONVERSATION</span>
      </div>
      <div className="contact-grid">
        <div data-aos="fade-up">
          <h2>
            Have an idea?
            <br />
            Let’s bring it
            <br />
            <span className="serif lavender">to life.</span>
            <span className="contact-sculpture" aria-hidden="true">
              <Suspense fallback={null}>
                <Scene />
              </Suspense>
            </span>
          </h2>
          <p>
            Something bold. Something meaningful.
            <br />
            Something we haven’t seen before.
          </p>
          <div className="email-row">
            <a href={`mailto:${email}`}>
              {email}
              <ArrowUpRight size={20} />
            </a>
            <button onClick={copy} aria-label="Copy email address">
              {copied ? <Check size={17} /> : <Copy size={17} />}
            </button>
          </div>
          <span className="mono copy-status" role="status">
            {copied ? "EMAIL COPIED" : "LET’S MAKE SOMETHING MOVE."}
          </span>
        </div>
        <form onSubmit={submit} data-aos="fade-up" data-aos-delay="120">
          <p className="form-intro">Tell me what you’re thinking.</p>
          <label htmlFor="name">YOUR NAME</label>
          <input
            id="name"
            name="name"
            placeholder="How should I call you?"
            autoComplete="name"
            required
            maxLength={100}
          />
          <label htmlFor="email">EMAIL ADDRESS</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            maxLength={200}
          />
          <label htmlFor="message">YOUR IDEA</label>
          <textarea
            id="message"
            name="message"
            placeholder="A little about your project…"
            rows={3}
            required
            maxLength={5000}
          />
          <div className="form-bottom">
            <p>
              Opens your email app.
              <br />
              No message is sent from this website.
            </p>
            <button className="button primary" type="submit">
              Let’s talk <ArrowUpRight size={19} />
            </button>
          </div>
          <p role="status" className="form-status">
            {status}
          </p>
          {draft && (
            <a
              className="text-button"
              href={draft}
              target="_blank"
              rel="noreferrer"
            >
              Open email draft again <ArrowUpRight size={16} />
            </a>
          )}
        </form>
      </div>
    </section>
  );
}
