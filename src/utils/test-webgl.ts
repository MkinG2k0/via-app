function isWebGLAvailable() {
	try {
		const canvas = document.createElement('canvas')
		return Boolean(
			window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')),
		)
	} catch (e) {
		return false
	}
}

export const webGLIsAvailable = isWebGLAvailable()
