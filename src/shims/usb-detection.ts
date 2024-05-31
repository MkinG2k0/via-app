type USBMonitorEvent = 'change' | 'remove'
export class usbDetect {
	static hasMonitored = false
	static shouldMonitor = false
	static _listeners: { change: Function[]; remove: Function[] } = {
		change: [],
		remove: [],
	}
	private static onConnect = ({ device }: HIDConnectionEvent) => {
		console.log('Detected Connection')
		if (usbDetect.shouldMonitor) {
			usbDetect._listeners.change.forEach((f) => f(device))
		}
	}
	private static onDisconnect = ({ device }: HIDConnectionEvent) => {
		console.log('Detected Disconnection')
		if (usbDetect.shouldMonitor) {
			usbDetect._listeners.change.forEach((f) => f(device))
			usbDetect._listeners.remove.forEach((f) => f(device))
		}
	}
	static off(eventName: USBMonitorEvent, cb: () => void) {
		this._listeners[eventName] = this._listeners[eventName].filter((f) => f !== cb)
	}
	static on(eventName: USBMonitorEvent, cb: () => void) {
		this._listeners[eventName] = [...this._listeners[eventName], cb]
	}
	static startMonitoring() {
		this.shouldMonitor = true
		if (!this.hasMonitored && navigator.hid) {
			navigator.hid.addEventListener('connect', usbDetect.onConnect)
			navigator.hid.addEventListener('disconnect', usbDetect.onDisconnect)
		}
	}
	static stopMonitoring() {
		this.shouldMonitor = false
	}
}
