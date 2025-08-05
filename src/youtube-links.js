const cleanUrlParams = (urlStr) => {
  if (!urlStr) return urlStr
  try {
    const url = new URL(urlStr)
    let changed = false
    const paramsToRemove = ['list', 'start_radio', 'pp']
    paramsToRemove.forEach((param) => {
      if (url.searchParams.has(param)) {
        url.searchParams.delete(param)
        changed = true
      }
    })
    return changed ? url.toString() : urlStr
  } catch (e) {
    return urlStr
  }
}

const findClosestAnchor = (element) => {
  let currentElement = element
  while (currentElement && currentElement !== document.body) {
    if (currentElement.tagName === 'A' && currentElement.href) {
      return currentElement
    }
    currentElement = currentElement.parentElement
  }
  return null
}

const isRelevantVideoLink = (url) => {
  const isVideoLink = url.pathname.endsWith('/watch') || url.searchParams.has('v')
  const hasTimestamp = url.searchParams.has('t')
  return isVideoLink && !hasTimestamp
}

const updateAllRelevantLinks = () => {
  const links = document.querySelectorAll('a[href]')
  links.forEach((link) => {
    try {
      const originalHref = link.href
      const url = new URL(originalHref)
      if (isRelevantVideoLink(url)) {
        const cleanedHref = cleanUrlParams(originalHref)
        if (originalHref !== cleanedHref) {
          link.href = cleanedHref
        }
        link.target = '_blank'
      }
    } catch (e) {}
  })
}

const handleLinkClick = (event) => {
  const clickedAnchor = findClosestAnchor(event.target)
  if (!clickedAnchor || !clickedAnchor.href) return
  try {
    const videoUrl = new URL(clickedAnchor.href)
    if (isRelevantVideoLink(videoUrl)) {
      event.preventDefault()
      event.stopImmediatePropagation()
      const urlToOpen = cleanUrlParams(clickedAnchor.href)
      window.location.href = urlToOpen
    }
  } catch (e) {}
}

document.addEventListener('DOMContentLoaded', () => {
  updateAllRelevantLinks()
  const observer = new MutationObserver((mutations) => {
    const addedNodesFound = mutations.some((mutation) => mutation.type === 'childList' && mutation.addedNodes.length > 0)
    if (addedNodesFound) {
      updateAllRelevantLinks()
    }
  })
  observer.observe(document.body, { childList: true, subtree: true })
})

document.addEventListener('click', handleLinkClick, true)
