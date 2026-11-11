import '@testing-library/jest-dom/vitest'

window.HTMLMediaElement.prototype.play = () => Promise.resolve()
window.HTMLMediaElement.prototype.pause = () => {}

// jsdom ne sait pas dessiner : sans contexte, le fond animé reste simplement vide.
window.HTMLCanvasElement.prototype.getContext = () => null
