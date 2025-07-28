function cleanUrlParams(urlStr) {
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

    if (changed) {
      return url.toString()
    }
  } catch (e) {}
  return urlStr
}

function findClosestAnchor(element) {
  let currentElement = element
  while (currentElement && currentElement !== document.body) {
    if (currentElement.tagName === 'A' && currentElement.href) {
      return currentElement
    }
    currentElement = currentElement.parentElement
  }
  return null
}

document.addEventListener(
  'click',
  function (event) {
    const clickedAnchor = findClosestAnchor(event.target)

    // If an anchor tag was clicked AND it contains our target string
    let videoUrl = new URL(clickedAnchor.href)

    //console.log(videoUrl)
    if (clickedAnchor && videoUrl.pathname !== 'watch' && !videoUrl.searchParams.get('t')) {
      // Prevent the default navigation and stop event propagation
      event.preventDefault()
      event.stopImmediatePropagation()

      const urlToOpen = cleanUrlParams(clickedAnchor.href)

      window.open(urlToOpen, '_blank')
      return
    }
  },
  true
)

function updateAllRelevantLinks() {
  const links = document.querySelectorAll('a[href]')

  links.forEach((link) => {
    const originalHref = link.href
    if (originalHref.includes('youtube.com/watch?v=')) {
      const cleanedHref = cleanUrlParams(originalHref)
      if (originalHref !== cleanedHref) {
        link.href = cleanedHref
      }
      link.target = '_blank'
    }
  })
}

document.addEventListener('DOMContentLoaded', () => {
  updateAllRelevantLinks()

  const observer = new MutationObserver((mutations) => {
    let addedNodesFound = false
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        addedNodesFound = true
      }
    })
    if (addedNodesFound) {
      updateAllRelevantLinks()
    }
  })

  observer.observe(document.body, { childList: true, subtree: true })
})
