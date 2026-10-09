/* eslint-disable @next/next/no-img-element */
import type { JSX } from "react";
import { blogPosts } from "@/data/blog-posts";

export default function Guides(): JSX.Element {
  return (
    <section className="section blogteaser" data-astro-cid-lcdefpme>
      <div
        className="container mx-auto w-full max-w-[var(--max-w)] px-[var(--pad-x)]"
        data-astro-cid-lcdefpme
      >
        <h2 className="blogteaser__title" data-astro-cid-lcdefpme>
          Guides for
          <br data-astro-cid-lcdefpme />
          B2B marketing teams
        </h2>
        <div className="blogteaser__grid" data-astro-cid-lcdefpme>
          {blogPosts.slice(0, 3).map((post) => (
            <article key={post.slug} className="post-card" data-astro-cid-lcdefpme>
              <div className="post-card__media" data-astro-cid-lcdefpme>
                <img
                  className="post-card__img"
                  src={post.image}
                  alt={post.alt}
                  width="1600"
                  height="1067"
                  loading="lazy"
                  decoding="async"
                  data-astro-cid-lcdefpme
                />
              </div>
              <div className="post-card__meta" data-astro-cid-lcdefpme>
                <span
                  className="post-card__tag"
                  data-tag={post.category.toLowerCase()}
                  data-astro-cid-lcdefpme
                >
                  {post.category}
                </span>
                <span data-astro-cid-lcdefpme>{post.date}</span>
              </div>
              <h3 data-astro-cid-lcdefpme>{post.title}</h3>
              <a
                className="post-card__link"
                data-underline-link
                href={`/blog/${post.slug}/`}
                aria-label={`Read the article: ${post.title}`}
                data-astro-cid-lcdefpme
              >
                Read the article &rarr;
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}