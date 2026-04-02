import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { byDateAndAlphabetical } from "./PageList"
import { resolveRelative } from "../util/path"
import { i18n } from "../i18n"
import style from "./styles/toc.scss"

// @ts-ignore
import script from "./scripts/toc.inline"
import { concatenateResources } from "../util/resources"
import OverflowListFactory from "./OverflowList"

const { OverflowList, overflowListAfterDOMLoaded } = OverflowListFactory()

const LatestNoteTOC: QuartzComponent = ({ allFiles, fileData, cfg }: QuartzComponentProps) => {
  const latest = allFiles
    .filter((f) => !f.slug?.endsWith("index") && f.slug?.startsWith("articles/"))
    .sort(byDateAndAlphabetical(cfg))
    .at(0)

  if (!latest?.toc || latest.toc.length === 0) return null

  const href = resolveRelative(fileData.slug!, latest.slug!)

  return (
    <div class="toc">
      <button type="button" class="toc-header" aria-expanded="true">
        <h3>{i18n(cfg.locale).components.tableOfContents.title}</h3>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24" height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="fold"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <OverflowList class="toc-content">
        {latest.toc.map((entry) => (
          <li key={entry.slug} class={`depth-${entry.depth}`}>
            <a href={`${href}#${entry.slug}`} data-for={entry.slug}>
              {entry.text}
            </a>
          </li>
        ))}
      </OverflowList>
    </div>
  )
}

LatestNoteTOC.css = style
LatestNoteTOC.afterDOMLoaded = concatenateResources(script, overflowListAfterDOMLoaded)

export default (() => LatestNoteTOC) satisfies QuartzComponentConstructor
