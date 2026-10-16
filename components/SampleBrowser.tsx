"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { sampleCategories, sampleProjects, type SampleCategory } from "@/data/samples";

export function SampleBrowser() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SampleCategory | "All">("All");

  const visibleProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return sampleProjects.filter((project) => {
      const matchesCategory = category === "All" || project.category === category;
      const searchableText = `${project.title} ${project.subject} ${project.category} ${project.summary}`.toLocaleLowerCase();
      return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [category, query]);

  return (
    <>
      <div className="sample-controls">
        <label className="sample-search">
          <span className="visually-hidden">Search demonstration projects</span>
          <span className="sample-search__icon" aria-hidden="true">⌕</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search titles, subjects, and topics"
          />
        </label>
        <div className="sample-filters" role="group" aria-label="Filter projects by category">
          {sampleCategories.map((item) => (
            <button
              className={`sample-filter${category === item ? " sample-filter--active" : ""}`}
              key={item}
              type="button"
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <p className="sample-results" aria-live="polite">
        Showing {visibleProjects.length} of {sampleProjects.length} demonstration projects
      </p>
      {visibleProjects.length > 0 ? (
        <div className="project-grid">
          {visibleProjects.map((project, index) => (
            <article className="project-card" key={project.slug}>
              <div className={`project-card__art project-card__art--${(index % 3) + 1}`} aria-hidden="true">
                <span className="project-card__art-mark">{project.category === "Computing" ? "⌘" : project.category === "Writing" ? "¶" : "✦"}</span>
                <span className="project-card__art-lines"><i /><i /><i /></span>
                <span className="project-card__art-label">DEMO / NOT CLIENT WORK</span>
              </div>
              <div className="project-card__body">
                <div className="project-card__meta">
                  <span>{project.category}</span>
                  <span>{project.subject}</span>
                </div>
                <h2><Link href={`/samples/${project.slug}`}>{project.title}</Link></h2>
                <p>{project.summary}</p>
                <Link className="project-card__link" href={`/samples/${project.slug}`}>
                  Explore this example <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="content-empty content-empty--compact" role="status">
          <span className="content-empty__icon" aria-hidden="true">⌕</span>
          <h2>No matching examples</h2>
          <p>Try a different search term or choose another subject category.</p>
          <button
            className="button button--secondary"
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("All");
            }}
          >
            Clear search and filters
          </button>
        </div>
      )}
    </>
  );
}
