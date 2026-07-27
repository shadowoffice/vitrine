"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";

export type FilterableContentItem = {
  category: string;
  code: string;
  description: string;
  href: string;
  meta?: string;
  title: string;
};

type ContentFilterProps = {
  emptyMessage: string;
  items: FilterableContentItem[];
  label: string;
  placeholder: string;
};

const normalizeSearchText = (value: string): string =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export function ContentFilter({
  emptyMessage,
  items,
  label,
  placeholder,
}: ContentFilterProps) {
  const [query, setQuery] = useState("");
  const inputId = useId();
  const normalizedQuery = normalizeSearchText(query);
  const filteredItems = useMemo(() => {
    if (!normalizedQuery) {
      return items;
    }

    return items.filter((item) =>
      normalizeSearchText(
        [
          item.code,
          item.category,
          item.title,
          item.description,
          item.meta,
        ].join(" "),
      ).includes(normalizedQuery),
    );
  }, [items, normalizedQuery]);

  return (
    <div className="content-filter">
      <search className="content-filter-controls">
        <label htmlFor={inputId}>{label}</label>
        <div>
          <input
            id={inputId}
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder={placeholder}
            type="search"
            value={query}
          />
          {query && (
            <button
              className="text-button"
              onClick={() => setQuery("")}
              type="button"
            >
              Effacer
            </button>
          )}
        </div>
      </search>

      <p className="content-filter-count" aria-live="polite">
        {filteredItems.length} résultat
        {filteredItems.length === 1 ? "" : "s"}
      </p>

      {filteredItems.length > 0 ? (
        <div className="content-filter-results">
          {filteredItems.map((item) => (
            <Link href={item.href} key={item.href}>
              <div>
                <span>{item.code}</span>
                <small>{item.category}</small>
              </div>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              {item.meta && <small className="content-filter-meta">{item.meta}</small>}
              <strong>
                Consulter <span aria-hidden="true">→</span>
              </strong>
            </Link>
          ))}
        </div>
      ) : (
        <p className="content-filter-empty">{emptyMessage}</p>
      )}
    </div>
  );
}
