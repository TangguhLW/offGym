// Keep the opening animation visible on fast starts without delaying an already slow launch.
export function hideBoot() {
  const b = document.getElementById('boot')
  if (!b || b.className || b.dataset.exitPending) return
  b.dataset.exitPending = '1'
  const fade = () => {
    b.className = 'out'
    setTimeout(() => b.remove(), 260)
  }
  const remaining = Math.max(0, 1500 - performance.now())
  if (remaining) setTimeout(fade, remaining)
  else fade()
}
