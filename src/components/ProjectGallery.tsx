import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, X, ChevronLeft, ChevronRight } from "lucide-react";
import AOS from "aos";
import { projects } from "../data";
import type { Project } from "../data";
export function ProjectArt({ project }: { project: Project }) {
  return (
    <div
      className={`project-art art-${project.art}`}
      aria-label={`Abstract concept artwork for ${project.title}`}
      role="img"
    >
      <div className="art-grid" />
      <div className="art-object">
        <i />
        <i />
        <i />
      </div>
      <span className="art-caption">
        {project.category === "Community"
          ? "PEOPLE. PURPOSE. POSSIBILITY."
          : "AN EXPLORATION IN MOTION"}
      </span>
      <span className="art-word">
        {project.art === "mercy"
          ? "MERCY"
          : project.art === "sindbad"
            ? "SINDBAD"
            : project.art === "chrono"
              ? "CHRONO"
              : project.art === "survey"
                ? "TOGETHER"
                : project.title.split(" ")[1] || project.title}
      </span>
      <span className="art-corner">
        FB® — CONCEPT {String(project.id).padStart(2, "0")}
      </span>
    </div>
  );
}
export default function ProjectGallery() {
  const [category, setCategory] = useState("All work");
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const filtered = projects.filter(
    (p) => category === "All work" || p.category === category,
  );
  const visible =
    expanded || category !== "All work" ? filtered : filtered.slice(0, 3);
  useEffect(() => {
    AOS.refresh();
  }, [category, expanded]);
  const isOpen = selected !== null;
  useEffect(() => {
    if (!isOpen) return;
    const modal = dialog.current;
    const previousOverflow = document.body.style.overflow;
    modal?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      modal?.close();
      document.body.style.overflow = previousOverflow;
      opener.current?.focus();
    };
  }, [isOpen]);
  function open(project: Project, element: HTMLElement) {
    opener.current = element;
    setSelected(project);
  }
  return (
    <>
      <div className="project-toolbar">
        <div className="filters" aria-label="Filter projects">
          {[
            "All work",
            "Motion design",
            "3D & Animation",
            "Story concepts",
            "Community",
          ].map((c) => (
            <button
              key={c}
              aria-pressed={category === c}
              className={category === c ? "active" : ""}
              onClick={() => setCategory(c)}
            >
              {c}
              {c === "All work" && <span>09</span>}
            </button>
          ))}
        </div>
        <span className="mono muted">A FEW IDEAS, IN FULL COLOUR.</span>
      </div>
      <motion.div layout={!reduced} className="project-grid">
        <AnimatePresence mode="popLayout">
          {visible.map((project) => (
            <motion.article
              layout={!reduced}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key={project.id}
              className="project-card"
            >
              <button
                className="project-open"
                onClick={(e) => open(project, e.currentTarget)}
                aria-label={`View ${project.title}`}
                onPointerMove={(e) => {
                  if (reduced || e.pointerType === "touch") return;
                  const bounds = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty(
                    "--rx",
                    `${-(e.clientY - bounds.top - bounds.height / 2) / 60}deg`,
                  );
                  e.currentTarget.style.setProperty(
                    "--ry",
                    `${(e.clientX - bounds.left - bounds.width / 2) / 60}deg`,
                  );
                }}
                onPointerLeave={(e) => {
                  e.currentTarget.style.setProperty("--rx", "0deg");
                  e.currentTarget.style.setProperty("--ry", "0deg");
                }}
              >
                <ProjectArt project={project} />
                <span className="project-arrow">
                  <ArrowUpRight size={22} />
                </span>
              </button>
              <div className="project-meta">
                <span className="mono muted">
                  {String(project.id).padStart(2, "0")} / {project.label}
                </span>
                <h3>
                  <button onClick={(e) => open(project, e.currentTarget)}>
                    {project.title}
                  </button>
                </h3>
                <span className="project-status">
                  {project.category === "Community"
                    ? "Community service"
                    : "Personal / Creative Project · Concept"}
                </span>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
      {category === "All work" && (
        <button
          className="text-button view-all"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Show featured projects" : "Explore all 9 projects"}
          <ArrowUpRight size={18} />
        </button>
      )}
      <dialog
        data-lenis-prevent
        ref={dialog}
        className="project-dialog"
        onCancel={() => setSelected(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelected(null);
        }}
        aria-labelledby="project-dialog-title"
      >
        {selected && (
          <div className="dialog-inner">
            <button
              className="close-button"
              onClick={() => setSelected(null)}
              aria-label="Close project"
            >
              <X />
            </button>
            <ProjectArt project={selected} />
            <div className="dialog-copy">
              <p className="eyebrow">{selected.label}</p>
              <h2 id="project-dialog-title">{selected.title}</h2>
              <p>{selected.description}</p>
              <span className="status-pill">{selected.status}</span>
              <p className="media-note">
                {selected.media
                  ? "Project media"
                  : "Concept artwork · Final project media has not been added."}
              </p>
              {selected.media && (
                <img
                  className="project-media"
                  src={selected.media}
                  alt={`${selected.title} project media`}
                />
              )}{" "}
              {selected.url && (
                <a
                  className="button primary"
                  href={selected.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  View project <ArrowUpRight size={18} />
                </a>
              )}
              <div className="dialog-navigation">
                <button
                  onClick={() =>
                    setSelected(
                      projects[
                        (projects.findIndex((p) => p.id === selected.id) +
                          projects.length -
                          1) %
                          projects.length
                      ],
                    )
                  }
                >
                  <ChevronLeft size={17} /> Previous
                </button>
                <span className="mono muted">
                  {String(selected.id).padStart(2, "0")} / 09
                </span>
                <button
                  onClick={() =>
                    setSelected(
                      projects[
                        (projects.findIndex((p) => p.id === selected.id) + 1) %
                          projects.length
                      ],
                    )
                  }
                >
                  Next <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
