import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { htmlToJsx } from "../util/jsx"
import { byDateAndAlphabetical } from "./PageList"
import { resolveRelative, FullSlug } from "../util/path"
import { Date as DateDisplay, getDate } from "./Date"
import readingTime from "reading-time"
import { i18n } from "../i18n"

function getFrontmatterDate(fm: Record<string, unknown> | undefined): Date | null {
  if (!fm) return null
  const raw = fm["date"] ?? fm["Time"] ?? fm["created"] ?? fm["created_at"]
  if (!raw) return null
  const d = new Date(raw as string)
  return isNaN(d.getTime()) ? null : d
}

const LatestNote: QuartzComponent = ({ allFiles, fileData, cfg }: QuartzComponentProps) => {
  const latest = allFiles
    .filter((f) =>
      !f.slug?.endsWith("index") &&
      f.slug !== "index" &&
      f.frontmatter?.draft !== true &&
      getFrontmatterDate(f.frontmatter) !== null
    )
    .sort((a, b) => {
      const dateA = getFrontmatterDate(a.frontmatter)!.getTime()
      const dateB = getFrontmatterDate(b.frontmatter)!.getTime()
      return dateB - dateA
    })
    .at(0)

  if (!latest || !latest.htmlAst) return null

  const title = latest.frontmatter?.title ?? latest.slug
  const content = htmlToJsx(latest.filePath!, latest.htmlAst)
  const href = resolveRelative(fileData.slug!, latest.slug!)
  const tags = latest.frontmatter?.tags ?? []

  const readingTimeText = latest.text
    ? i18n(cfg.locale).components.contentMeta.readingTime({
        minutes: Math.ceil(readingTime(latest.text).minutes),
      })
    : null

  return (
    <div class="latest-note">
      <p class="latest-note-label">
        <svg class="label-chevron" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="5 8 14 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        Latest Article
        <svg class="label-chevron" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="5 8 14 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </p>
      <h2 class="latest-note-title">
        <a href={href} class="internal">{title}</a>
      </h2>
      <p class="latest-note-meta">
        {latest.dates && <DateDisplay date={getDate(cfg, latest)!} locale={cfg.locale} />}
        {latest.dates && readingTimeText && <span class="meta-sep">·</span>}
        {readingTimeText && <span>{readingTimeText}</span>}
      </p>
      {tags.length > 0 && (
        <ul class="latest-note-tags">
          {tags.map((tag) => (
            <li>
              <a class="internal tag-link" href={resolveRelative(fileData.slug!, `tags/${tag}` as FullSlug)}>
                {tag}
              </a>
            </li>
          ))}
        </ul>
      )}
      <div class="latest-note-content popover-hint">
        {content}
      </div>
    </div>
  )
}

LatestNote.css = `
.latest-note {
  margin-top: 2.5rem;
}

.latest-note-label {
  font-family: "Satoshi", sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #9C8B74;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  white-space: nowrap;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background-color: #DAC5A7;
    opacity: 0.5;
  }

  .label-chevron {
    color: #DAC5A7;
    flex-shrink: 0;

    &.flipped {
      transform: rotate(180deg);
    }
  }
}

.latest-note-title {
  margin: 0 0 0.25rem 0;
  font-size: 1.5rem;
  font-weight: 600;

  a {
    background: none !important;
    padding: 0 !important;
    color: var(--dark) !important;

    &:hover {
      color: #DAC5A7 !important;
    }
  }
}

.latest-note-meta {
  font-size: 0.8rem;
  color: #9C8B74;
  margin: 0 0 0.6rem 0;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.meta-sep {
  color: #DAC5A7;
}

.latest-note-tags {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.latest-note-content {
  border-top: 1px solid var(--lightgray);
  padding-top: 1.5rem;
}
`

export default (() => LatestNote) satisfies QuartzComponentConstructor
