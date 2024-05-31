import type {
	DefinitionVersion,
	KeyboardDefinitionIndex,
	KeyboardDictionary,
	LightingValue,
	VIAMenu,
} from '@the-via/reader'

import { TestKeyboardSoundsMode } from 'src/components/void/test-keyboard-sounds'

export enum TestKeyState {
	Initial,
	KeyDown,
	KeyUp,
}

export type HIDColor = {
	hue: number
	sat: number
}

export type LightingData = {
	customColors?: HIDColor[]
} & Partial<{ [key in LightingValue]: number[] }>

export type DeviceInfo = {
	productId: number
	productName: string
	protocol?: number
	vendorId: number
}

export type Device = {
	interface: number
	path: string
	productName: string
} & DeviceInfo

export type Keymap = number[]
export type Layer = {
	isLoaded: boolean
	keymap: Keymap
}

export type DeviceLayerMap = { [devicePath: string]: Layer[] }

export type WebVIADevice = {
	_device: HIDDevice
} & Device

// Refers to a device that may or may not have an associated definition but does have a valid protocol version
export type AuthorizedDevice = {
	hasResolvedDefinition: false
	path: string
	protocol: number
	requiredDefinitionVersion: DefinitionVersion
	vendorProductId: number
} & DeviceInfo

export type ConnectedDevice = {
	hasResolvedDefinition: true
	path: string
	protocol: number
	requiredDefinitionVersion: DefinitionVersion
	vendorProductId: number
} & DeviceInfo

export type AuthorizedDevices = Record<string, AuthorizedDevice>
export type ConnectedDevices = Record<string, ConnectedDevice>

export type MacroEditorSettings = {
	recordDelaysEnabled: boolean
	smartOptimizeEnabled: boolean
	tapEnterAtEOMEnabled: boolean
}

export type TestKeyboardSoundsSettings = {
	isEnabled: boolean
	mode: TestKeyboardSoundsMode
	transpose: number
	volume: number
	waveform: OscillatorType
}

export type Settings = {
	designDefinitionVersion: DefinitionVersion
	disableFastRemap: boolean
	disableRecordKeyboard: boolean
	macroEditor: MacroEditorSettings
	renderMode: '2D' | '3D'
	showDesignTab: boolean
	testKeyboardSoundsSettings: TestKeyboardSoundsSettings
	themeMode: 'dark' | 'light'
	themeName: string
}

export type CommonMenusMap = {
	[menu: string]: VIAMenu[]
}

export type StoreData = {
	definitionIndex: DefinitionIndex
	definitions: KeyboardDictionary
	settings: Settings
}

export type VendorProductIdMap = Record<number, { v2: boolean; v3: boolean }>

export type DefinitionIndex = {
	hash: string
	supportedVendorProductIdMap: VendorProductIdMap
} & Pick<KeyboardDefinitionIndex, 'generatedAt' | 'theme' | 'version'>

export type EncoderBehavior = [number, number, number]
