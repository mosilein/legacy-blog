
function toggleToc(this: HTMLElement) {
  this.classList.toggle("collapsed")
  this.setAttribute(
    "aria-expanded",
    this.getAttribute("aria-expanded") === "true" ? "false" : "true",
  )
  const content = this.nextElementSibling as HTMLElement | undefined
  if (!content) return
  content.classList.toggle("collapsed")
}

function highlightHeading(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  el.classList.remove("toc-highlight")
  void el.offsetWidth // force reflow to restart animation
  el.classList.add("toc-highlight")
}

function setupToc() {
  for (const toc of document.getElementsByClassName("toc")) {
    const button = toc.querySelector(".toc-header")
    const content = toc.querySelector(".toc-content")
    if (!button || !content) return
    button.addEventListener("click", toggleToc)
    window.addCleanup(() => button.removeEventListener("click", toggleToc))
  }

  for (const link of document.querySelectorAll<HTMLAnchorElement>(".toc-content a[href^='#']")) {
    const handler = () => {
      const id = link.getAttribute("href")!.slice(1)
      document.querySelectorAll(".toc-content a.in-view").forEach((el) => el.classList.remove("in-view"))
      link.classList.add("in-view")
setTimeout(() => highlightHeading(id), 50)
    }
    link.addEventListener("click", handler)
    window.addCleanup(() => link.removeEventListener("click", handler))
  }
}

document.addEventListener("nav", () => {
  setupToc()

})
