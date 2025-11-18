import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

/**
 * Prefetches route components on link hover for faster navigation
 */
export default function useRoutePrefetch() {
  const router = useRouter()
  const prefetchedRoutes = new Set()

  const prefetchRoute = (href) => {
    if (!href || !href.startsWith('/') || href.startsWith('//') || href === '#') return
    
    // Avoid prefetching the same route multiple times
    if (prefetchedRoutes.has(href)) return
    
    try {
      // Find matching route
      const route = router.resolve(href)
      if (route && route.matched && route.matched.length > 0) {
        route.matched.forEach((match) => {
          // Preload lazy-loaded components
          if (match.components) {
            Object.values(match.components).forEach((component) => {
              if (component && typeof component === 'function') {
                // Trigger the lazy loader to prefetch
                component().catch(() => {
                  // Ignore prefetch errors (e.g., component load failures)
                })
              }
            })
          }
        })
        prefetchedRoutes.add(href)
      }
    } catch (e) {
      // Ignore prefetch errors
      console.debug('Prefetch error:', e)
    }
  }

  const handleLinkMouseEnter = (e) => {
    // Walk up the DOM tree to find the link element
    let target = e.target
    let link = null
    
    while (target && target !== document.body) {
      if (target.tagName === 'A' && target.hasAttribute('href')) {
        link = target
        break
      }
      target = target.parentElement
    }
    
    if (link) {
      const href = link.getAttribute('href')
      // Prefetch with a small delay to avoid prefetching on accidental hovers
      setTimeout(() => {
        prefetchRoute(href)
      }, 50)
    }
  }

  onMounted(() => {
    // Prefetch on hover using capture phase for better performance
    document.addEventListener('mouseenter', handleLinkMouseEnter, true)
  })

  onUnmounted(() => {
    document.removeEventListener('mouseenter', handleLinkMouseEnter, true)
    prefetchedRoutes.clear()
  })

  return { prefetchRoute }
}

