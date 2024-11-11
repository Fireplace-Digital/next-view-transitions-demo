// Make sure GSAP and plugins are properly initialized
if (window.gsap && window.Draggable) {
  if (window.gsap.InertiaPlugin) {
    window.gsap.registerPlugin(window.gsap.InertiaPlugin);
  }
  window.gsap.registerPlugin(window.Draggable);
}