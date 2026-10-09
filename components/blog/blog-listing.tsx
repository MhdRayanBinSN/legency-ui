"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState, type JSX } from "react";
import { Button } from "@/components/ui/button";
import { BubbleArrowLink } from "@/components/ui/bubble-arrow-link";
import type { BlogPost } from "@/data/blog-posts";

const filters = ["All", "CRO", "SEO", "Strategy", "Webflow"] as const;

type Filter = (typeof filters)[number];

function matchesFilter(post: BlogPost, filter: Filter): boolean {
  return filter === "All" || post.category.toLowerCase() === filter.toLowerCase();
}

function FeaturedArticle({ post }: { post: BlogPost }): JSX.Element {
  return (
    <section className="featured" data-astro-cid-x255k2k2>
      <div className="container mx-auto w-full max-w-[var(--max-w)] px-[var(--pad-x)]" data-astro-cid-x255k2k2>
        <h2 className="featured__label" data-astro-cid-x255k2k2>Featured Article</h2>
        <article className="featured__card" data-astro-cid-x255k2k2>
          <div className="featured__img-link" aria-hidden="true" data-astro-cid-x255k2k2>
            <img className="featured__img" src={post.image} alt="" width="1600" height="1067" fetchPriority="high" data-astro-cid-x255k2k2 />
          </div>
          <div className="featured__body" data-astro-cid-x255k2k2>
            <div className="featured__meta" data-astro-cid-x255k2k2>
              <span className="featured__chip" data-tag={post.category.toLowerCase()} data-astro-cid-x255k2k2>{post.category}</span>
              <span className="featured__date" data-astro-cid-x255k2k2>{post.date}</span>
            </div>
            <h3 className="featured__title" data-astro-cid-x255k2k2>{post.title}</h3>
            <p className="featured__desc" data-astro-cid-x255k2k2>{post.description}</p>
            <div className="featured__cta" data-astro-cid-x255k2k2>
              <BubbleArrowLink href="/blog/">Browse Articles</BubbleArrowLink>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

function RecentArticleCard({ post }: { post: BlogPost }): JSX.Element {
  return (
    <article className="post-card" data-astro-cid-x255k2k2>
      <div className="post-card__media" data-astro-cid-x255k2k2>
        <img className="post-card__img" src={post.image} alt={post.alt} width="1600" height="1067" loading="lazy" decoding="async" data-astro-cid-x255k2k2 />
      </div>
      <div className="post-card__meta" data-astro-cid-x255k2k2>
        <span className="post-card__tag" data-tag={post.category.toLowerCase()} data-astro-cid-x255k2k2>{post.category}</span>
        <span className="post-card__date" data-astro-cid-x255k2k2>{post.date}</span>
      </div>
      <h3 className="post-card__title" data-astro-cid-x255k2k2>{post.title}</h3>
      <p className="post-card__desc" data-astro-cid-x255k2k2>{post.description}</p>
    </article>
  );
}

export default function BlogListing({ posts }: { posts: BlogPost[] }): JSX.Element {
  const [selectedFilter, setSelectedFilter] = useState<Filter>("All");
  const [settledFilter, setSettledFilter] = useState<Filter>("All");

  useEffect(() => {
    if (selectedFilter === settledFilter) return;
    const timeout = window.setTimeout(() => setSettledFilter(selectedFilter), 300);
    return () => window.clearTimeout(timeout);
  }, [selectedFilter, settledFilter]);

  return (
    <>
      <header className="bloghead" data-astro-cid-x255k2k2>
        <div className="container mx-auto w-full max-w-[var(--max-w)] px-[var(--pad-x)]" data-astro-cid-x255k2k2>
          <span className="label" data-astro-cid-x255k2k2>Blog</span>
          <h1 className="bloghead__title" data-astro-cid-x255k2k2>Insights &amp; Strategy</h1>
        </div>
      </header>
      {posts.length > 0 && <FeaturedArticle post={posts[0]} />}
      {posts.length === 0 && (
        <section className="section recent" data-astro-cid-x255k2k2>
          <div className="container mx-auto w-full max-w-[var(--max-w)] px-[var(--pad-x)]" data-astro-cid-x255k2k2>
            <p data-astro-cid-x255k2k2>No blog articles available yet.</p>
          </div>
        </section>
      )}
      {posts.length > 0 && (
        <section className="section recent" data-astro-cid-x255k2k2>
          <div className="container mx-auto w-full max-w-[var(--max-w)] px-[var(--pad-x)]" data-astro-cid-x255k2k2>
            <div className="recent__head" data-astro-cid-x255k2k2>
              <h2 className="recent__title" data-astro-cid-x255k2k2>Recent Articles</h2>
              <div className="recent__filters" role="group" aria-label="Filter articles by topic" data-astro-cid-x255k2k2>
                {filters.map((filter) => {
                  const active = selectedFilter === filter;
                  return (
                    <Button
                      key={filter}
                      type="button"
                      className="filter-btn"
                      data-filter-status={active ? "active" : "not-active"}
                      aria-pressed={active}
                      onClick={() => setSelectedFilter(filter)}
                      data-astro-cid-x255k2k2
                    >
                      {filter}
                    </Button>
                  );
                })}
              </div>
            </div>
            <ul className="recent__grid" data-astro-cid-x255k2k2>
              {posts.map((post) => {
                const visible = matchesFilter(post, selectedFilter);
                const wasVisible = matchesFilter(post, settledFilter);
                const status = visible
                  ? "active"
                  : wasVisible && selectedFilter !== settledFilter
                    ? "transition-out"
                    : "not-active";

                return (
                  <li
                    key={post.slug}
                    className="filter-list__item"
                    data-filter-status={status}
                    aria-hidden={!visible && status === "not-active"}
                    data-astro-cid-x255k2k2
                  >
                    <RecentArticleCard post={post} />
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
