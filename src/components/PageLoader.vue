<template>
  <div v-if="isLoading" class="page-loader">
    <div class="page-loader-progress" :style="{ width: progress + '%' }"></div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'PageLoader',
  setup() {
    const isLoading = ref(false)
    const progress = ref(0)
    const router = useRouter()
    let progressTimer = null
    let finishTimeout = null

    const startLoading = () => {
      // Don't restart if already loading
      if (isLoading.value) return
      
      // Clear any existing timers
      if (progressTimer) clearInterval(progressTimer)
      if (finishTimeout) clearTimeout(finishTimeout)
      
      isLoading.value = true
      progress.value = 30  // Start higher for immediate visibility
      
      // Gradually increase progress
      progressTimer = setInterval(() => {
        if (progress.value < 90) {
          // Increase progress, but slow down as we approach 90%
          const increment = (90 - progress.value) * 0.15
          progress.value += increment
          if (progress.value > 90) {
            progress.value = 90
          }
        }
      }, 80)  // Update more frequently for smoother animation
    }

    const finishLoading = () => {
      // Complete the progress
      progress.value = 100
      
      // Clear the progress timer
      if (progressTimer) {
        clearInterval(progressTimer)
        progressTimer = null
      }
      
      // Wait a bit before hiding to show completion
      finishTimeout = setTimeout(() => {
        isLoading.value = false
        progress.value = 0
      }, 200)
    }

    const handleLinkClick = (e) => {
      // Check if clicking on a router-link or a link inside router-link
      let target = e.target
      let link = null
      
      // Walk up the DOM tree to find the link element
      while (target && target !== document.body) {
        if (target.tagName === 'A' && target.hasAttribute('href')) {
          link = target
          break
        }
        target = target.parentElement
      }
      
      if (link) {
        const href = link.getAttribute('href')
        // Only start loading for internal routes (not external links or anchors)
        if (href && href.startsWith('/') && !href.startsWith('//') && !href.startsWith('/#')) {
          // Start immediately on click
          startLoading()
        }
      }
    }

    onMounted(() => {
      // Start loader immediately on link clicks (before navigation)
      document.addEventListener('click', handleLinkClick, true)

      router.beforeEach((to, from, next) => {
        // Ensure loader is shown if it wasn't already
        if (to.path !== from.path && !isLoading.value) {
          startLoading()
        }
        next()
      })

      router.afterEach(async () => {
        // Wait for the component to actually be mounted and rendered
        await nextTick()
        await nextTick() // Wait for child components too
        
        // Give the browser a chance to paint before finishing
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            finishLoading()
          })
        })
      })

      router.onError(() => {
        finishLoading()
      })
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleLinkClick, true)
      if (progressTimer) {
        clearInterval(progressTimer)
      }
      if (finishTimeout) {
        clearTimeout(finishTimeout)
      }
    })

    return {
      isLoading,
      progress,
    }
  },
}
</script>

<style scoped>
.page-loader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.05);
  pointer-events: none;
}

.page-loader-progress {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #2ba6cb, #50bc5b, #2ba6cb);
  background-size: 200% 100%;
  transition: width 0.2s ease;
  box-shadow: 0 0 15px rgba(43, 166, 203, 0.8), 0 0 5px rgba(43, 166, 203, 0.6);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 200% 0%;
  }
}
</style>

