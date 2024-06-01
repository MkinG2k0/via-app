import { allBasicKeyCode, IKeycodeGroupItem, keycodeGroup } from 'src/utils/keycode-group'
import { advancedKeycodeToString, advancedStringToKeycode } from './advanced-keys'
import {
	BuiltInKeycodeModule,
	VIADefinitionV3,
	VIADefinitionV2,
	getLightingDefinition,
	KeycodeType,
} from '@the-via/reader'

export interface IKeycode {
	name: string
	code: string
	title?: string
	shortName?: string
	keys?: string
	width?: number
	type?: 'container' | 'text' | 'layer'
	layer?: number
}

export interface IKeycodeMenu {
	id: string
	label: string
	keycodes: IKeycode[]
	keycodeGroup?: IKeycodeGroupItem[]
	width?: 'label'
	detailed?: string
}

// Tests if label is an alpha
export function isAlpha(label: string) {
	return /[A-Za-z]/.test(label) && label.length === 1
}

// Test if label is a numpad number
export function isNumpadNumber(label: string) {
	return /['0-9]/.test(label) && label.length === 1
}

export function isArrowKey(label: string) {
	return /[🠗🠕🠖🠔←↑→↓]$/.test(label)
}

export function isNumpadSymbol(label: string) {
	const centeredSymbol = '-+.÷×'.split('')
	return label.length === 1 && centeredSymbol.includes(label[0])
}

// Test if label is a multi-legend, e.g. "!\n1"
export function isMultiLegend(label: string) {
	const topLegend = '~!@#$%^&*()_+|{}:"<>?'.split('')
	return label.length !== 1 && topLegend.includes(label[0])
}

// Tests if label is a number
export function isNumericOrShiftedSymbol(label: string) {
	const numbersTop = '!@#$%^&*()_+|~{}:"<>?1234567890'.split('')
	return label.length === 1 && numbersTop.includes(label[0])
}

// Tests if label is a number
export function isNumericSymbol(label: string) {
	const numbersTop = '!@#$%^&*()_+|~{}:"<>?'.split('')
	return label.length !== 1 && numbersTop.includes(label[0])
}

// Maps the byte value to the keycode
export function getByteForCode(code: string, basicKeyToByte: Record<string, number>) {
	const byte: number | undefined = basicKeyToByte[code]
	if (byte !== undefined) {
		return byte
	} else if (isLayerCode(code)) {
		return getByteForLayerCode(code, basicKeyToByte)
	} else if (advancedStringToKeycode(code, basicKeyToByte) !== null) {
		return advancedStringToKeycode(code, basicKeyToByte)
	}
	throw `Could not find byte for ${code}`
}

function isLayerCode(code: string) {
	return /([A-Za-z]+)\((\d+)\)/.test(code)
}

function getByteForLayerCode(keycode: string, basicKeyToByte: Record<string, number>): number {
	const keycodeMatch = keycode.match(/([A-Za-z]+)\((\d+)\)/)
	if (keycodeMatch) {
		const [, code, layer] = keycodeMatch
		const numLayer = parseInt(layer)
		switch (code) {
			case 'TO': {
				return Math.min(basicKeyToByte._QK_TO + numLayer, basicKeyToByte._QK_TO_MAX)
			}
			case 'MO': {
				return Math.min(basicKeyToByte._QK_MOMENTARY + numLayer, basicKeyToByte._QK_MOMENTARY_MAX)
			}
			case 'DF': {
				return Math.min(basicKeyToByte._QK_DEF_LAYER + numLayer, basicKeyToByte._QK_DEF_LAYER_MAX)
			}
			case 'TG': {
				return Math.min(basicKeyToByte._QK_TOGGLE_LAYER + numLayer, basicKeyToByte._QK_TOGGLE_LAYER_MAX)
			}
			case 'OSL': {
				return Math.min(basicKeyToByte._QK_ONE_SHOT_LAYER + numLayer, basicKeyToByte._QK_ONE_SHOT_LAYER_MAX)
			}
			case 'TT': {
				return Math.min(basicKeyToByte._QK_LAYER_TAP_TOGGLE + numLayer, basicKeyToByte._QK_LAYER_TAP_TOGGLE_MAX)
			}
			case 'CUSTOM': {
				return Math.min(basicKeyToByte._QK_KB + numLayer, basicKeyToByte._QK_KB_MAX)
			}
			case 'MACRO': {
				return Math.min(basicKeyToByte._QK_MACRO + numLayer, basicKeyToByte._QK_MACRO_MAX)
			}
			default: {
				throw new Error('Incorrect code')
			}
		}
	}
	throw new Error('No match found')
}

function getCodeForLayerByte(byte: number, basicKeyToByte: Record<string, number>) {
	if (basicKeyToByte._QK_TO <= byte && basicKeyToByte._QK_TO_MAX >= byte) {
		const layer = byte - basicKeyToByte._QK_TO
		return `TO(${layer})`
	} else if (basicKeyToByte._QK_MOMENTARY <= byte && basicKeyToByte._QK_MOMENTARY_MAX >= byte) {
		const layer = byte - basicKeyToByte._QK_MOMENTARY
		return `MO(${layer})`
	} else if (basicKeyToByte._QK_DEF_LAYER <= byte && basicKeyToByte._QK_DEF_LAYER_MAX >= byte) {
		const layer = byte - basicKeyToByte._QK_DEF_LAYER
		return `DF(${layer})`
	} else if (basicKeyToByte._QK_TOGGLE_LAYER <= byte && basicKeyToByte._QK_TOGGLE_LAYER_MAX >= byte) {
		const layer = byte - basicKeyToByte._QK_TOGGLE_LAYER
		return `TG(${layer})`
	} else if (basicKeyToByte._QK_ONE_SHOT_LAYER <= byte && basicKeyToByte._QK_ONE_SHOT_LAYER_MAX >= byte) {
		const layer = byte - basicKeyToByte._QK_ONE_SHOT_LAYER
		return `OSL(${layer})`
	} else if (basicKeyToByte._QK_LAYER_TAP_TOGGLE <= byte && basicKeyToByte._QK_LAYER_TAP_TOGGLE_MAX >= byte) {
		const layer = byte - basicKeyToByte._QK_LAYER_TAP_TOGGLE
		return `TT(${layer})`
	} else if (basicKeyToByte._QK_KB <= byte && basicKeyToByte._QK_KB_MAX >= byte) {
		const n = byte - basicKeyToByte._QK_KB
		return `CUSTOM(${n})`
	} else if (basicKeyToByte._QK_MACRO <= byte && basicKeyToByte._QK_MACRO_MAX >= byte) {
		const n = byte - basicKeyToByte._QK_MACRO
		return `MACRO(${n})`
	}
}

export const keycodesList = getKeycodes().reduce<IKeycode[]>((p, n) => p.concat(n.keycodes), [])

export const getByteToKey = (basicKeyToByte: Record<string, number>) =>
	Object.keys(basicKeyToByte).reduce(
		(p, n) => {
			const key = basicKeyToByte[n]
			if (key in p) {
				const basicKeycode = keycodesList.find(({ code }) => code === n)
				if (basicKeycode) {
					return { ...p, [key]: basicKeycode.code }
				}
				return p
			}
			return { ...p, [key]: n }
		},
		{} as { [key: number]: string },
	)

function isLayerKey(byte: number, basicKeyToByte: Record<string, number>) {
	return [
		[basicKeyToByte._QK_TO, basicKeyToByte._QK_TO_MAX],
		[basicKeyToByte._QK_MOMENTARY, basicKeyToByte._QK_MOMENTARY_MAX],
		[basicKeyToByte._QK_DEF_LAYER, basicKeyToByte._QK_DEF_LAYER_MAX],
		[basicKeyToByte._QK_TOGGLE_LAYER, basicKeyToByte._QK_TOGGLE_LAYER_MAX],
		[basicKeyToByte._QK_ONE_SHOT_LAYER, basicKeyToByte._QK_ONE_SHOT_LAYER_MAX],
		[basicKeyToByte._QK_LAYER_TAP_TOGGLE, basicKeyToByte._QK_LAYER_TAP_TOGGLE_MAX],
		[basicKeyToByte._QK_KB, basicKeyToByte._QK_KB_MAX],
		[basicKeyToByte._QK_MACRO, basicKeyToByte._QK_MACRO_MAX],
	].some((code) => byte >= code[0] && byte <= code[1])
}

export function getCodeForByte(
	byte: number,
	basicKeyToByte: Record<string, number>,
	byteToKey: Record<number, string>,
) {
	const keycode = byteToKey[byte]
	if (keycode && !keycode.startsWith('_QK')) {
		return keycode
	} else if (isLayerKey(byte, basicKeyToByte)) {
		return getCodeForLayerByte(byte, basicKeyToByte)
	} else if (advancedKeycodeToString(byte, basicKeyToByte, byteToKey) !== null) {
		return advancedKeycodeToString(byte, basicKeyToByte, byteToKey)
	} else {
		return `0x${Number(byte).toString(16)}`
	}
}

export function keycodeInMaster(keycode: string, basicKeyToByte: Record<string, number>) {
	return keycode in basicKeyToByte || isLayerCode(keycode) || advancedStringToKeycode(keycode, basicKeyToByte) !== null
}

function shorten(str: string) {
	return str
		.split(' ')
		.map((word) => word.slice(0, 1) + word.slice(1).replace(/[aeiou ]/gi, ''))
		.join('')
}

export function isCustomKeycodeByte(byte: number, basicKeyToByte: Record<string, number>) {
	return byte >= basicKeyToByte._QK_KB && byte <= basicKeyToByte._QK_KB_MAX
}

export function getCustomKeycodeIndex(byte: number, basicKeyToByte: Record<string, number>) {
	return byte - basicKeyToByte._QK_KB
}

export function isMacroKeycodeByte(byte: number, basicKeyToByte: Record<string, number>) {
	return byte >= basicKeyToByte._QK_MACRO && byte <= basicKeyToByte._QK_MACRO_MAX
}

export function getMacroKeycodeIndex(byte: number, basicKeyToByte: Record<string, number>) {
	return byte - basicKeyToByte._QK_MACRO
}

export function getLabelForByte(
	byte: number,
	size = 100,
	basicKeyToByte: Record<string, number>,
	byteToKey: Record<number, string>,
) {
	const keycode = getCodeForByte(byte, basicKeyToByte, byteToKey)
	const basicKeycode = keycodesList.find(({ code }) => code === keycode)
	if (!basicKeycode) {
		return keycode
	}
	return getShortNameForKeycode(basicKeycode, size)
}

export function getShortNameForKeycode(keycode: IKeycode, size = 100) {
	const { code, name, shortName } = keycode
	if (size <= 150 && shortName) {
		return shortName
	}
	if (size === 100 && name.length > 5) {
		const shortenedName = shorten(name)
		if (code) {
			const shortCode = code.replace('KC_', '').replace('_', ' ')
			return shortenedName.length > 4 && shortCode.length < shortenedName.length ? shortCode : shortenedName
		}
		return shortenedName
	}
	return name
}

export function getOtherMenu(basicKeyToByte: Record<string, number>): IKeycodeMenu {
	const keycodes = Object.keys(basicKeyToByte)
		.filter((key) => !key.startsWith('_QK'))
		.filter((key) => !keycodesList.map(({ code }) => code).includes(key))
		.map((code) => ({
			name: code.replace('KC_', '').replace(/_/g, ' '),
			code: code,
		}))

	return {
		id: 'other',
		label: 'Other',
		keycodes,
	}
}

function buildLayerMenu(): IKeycodeMenu {
	const hardCodedKeycodes: IKeycode[] = [
		{
			name: 'Fn1\n(Fn3)',
			code: 'FN_MO13',
			title: 'Hold = Layer 1, Hold with Fn2 = Layer 3',
			shortName: 'Fn1(3)',
		},
		{
			name: 'Fn2\n(Fn3)',
			code: 'FN_MO23',
			title: 'Hold = Layer 2, Hold with Fn1 = Layer 3',
			shortName: 'Fn2(3)',
		},
		{
			name: 'Space Fn1',
			code: 'LT(1,KC_SPC)',
			title: 'Hold = Layer 1, Tap = Space',
			shortName: 'Spc Fn1',
		},
		{
			name: 'Space Fn2',
			code: 'LT(2,KC_SPC)',
			title: 'Hold = Layer 2, Tap = Space',
			shortName: 'Spc Fn2',
		},
		{
			name: 'Space Fn3',
			code: 'LT(3,KC_SPC)',
			title: 'Hold = Layer 3, Tap = Space',
			shortName: 'Spc Fn3',
		},
	]

	const menu: IKeycodeMenu = {
		id: 'layers',
		label: 'Layers',
		width: 'label',
		keycodes: [
			{
				name: 'MO',
				code: 'MO(layer)',
				type: 'layer',
				layer: 0,
				title: 'Momentary turn layer on',
			},
			{
				name: 'TG',
				code: 'TG(layer)',
				type: 'layer',
				layer: 0,
				title: 'Toggle layer on/off',
			},
			{
				name: 'TT',
				code: 'TT(layer)',
				type: 'layer',
				layer: 0,
				title: "Normally acts like MO unless it's tapped multple times which toggles layer on",
			},
			{
				name: 'OSL',
				code: 'OSL(layer)',
				type: 'layer',
				layer: 0,
				title: 'Switch to layer for one keypress',
			},
			{
				name: 'TO',
				code: 'TO(layer)',
				type: 'layer',
				layer: 0,
				title: 'Turn on layer when pressed',
			},
			{
				name: 'DF',
				code: 'DF(layer)',
				type: 'layer',
				layer: 0,
				title: 'Sets the default layer',
			},
		],
	}

	const keycodesGroup: IKeycodeGroupItem[] = []

	const keycodes = menu.keycodes.flatMap((keycode) => {
		let res: IKeycode[] = []
		for (let idx = 0; idx < 10; idx++) {
			const newTitle = (keycode.title || '').replace('layer', `layer ${idx}`)
			const newCode = keycode.code.replace('layer', `${idx}`)
			const newName = `${keycode.name}(${idx})`
			res = [...res, { ...keycode, name: newName, title: newTitle, code: newCode }]
		}
		keycodesGroup.push({ name: keycode.name, keycodes: res })
		return res
	})

	// Statically generate layer codes from 0-9 instead of making it an input
	return {
		keycodeGroup: [...keycodesGroup, { name: 'Other', keycodes: hardCodedKeycodes }],
		...menu,
		keycodes: [...hardCodedKeycodes, ...keycodes],
	}
}

function generateMacros(numMacros: number = 16): IKeycode[] {
	let res: IKeycode[] = []
	for (let idx = 0; idx < numMacros; idx++) {
		const newName = `M${idx}`
		const newCode = `MACRO(${idx})`
		const newTitle = `Macro ${idx}`
		res = [...res, { name: newName, title: newTitle, code: newCode }]
	}
	return res
}

export function getKeycodes(numMacros = 16): IKeycodeMenu[] {
	return [
		{
			id: 'basic',
			label: 'Basic',
			keycodes: allBasicKeyCode,
			keycodeGroup,
		},
		{
			id: 'wt_lighting',
			label: 'Lighting',
			width: 'label',
			keycodes: [
				{
					name: 'Bright -',
					code: 'BR_DEC',
					title: 'Brightness -',
					shortName: 'BR -',
				},
				{
					name: 'Bright +',
					code: 'BR_INC',
					title: 'Brightness +',
					shortName: 'BR +',
				},
				{
					name: 'Effect -',
					code: 'EF_DEC',
					title: 'Effect -',
					shortName: 'EF -',
				},
				{
					name: 'Effect +',
					code: 'EF_INC',
					title: 'Effect +',
					shortName: 'EF +',
				},
				{
					name: 'Effect Speed -',
					code: 'ES_DEC',
					title: 'Effect Speed -',
					shortName: 'ES -',
				},
				{
					name: 'Effect Speed +',
					code: 'ES_INC',
					title: 'Effect Speed +',
					shortName: 'ES +',
				},
				{
					name: 'Color1 Hue -',
					code: 'H1_DEC',
					title: 'Color1 Hue -',
					shortName: 'H1 -',
				},
				{
					name: 'Color1 Hue +',
					code: 'H1_INC',
					title: 'Color1 Hue +',
					shortName: 'H1 +',
				},
				{
					name: 'Color2 Hue -',
					code: 'H2_DEC',
					title: 'Color2 Hue -',
					shortName: 'H2 -',
				},
				{
					name: 'Color2 Hue +',
					code: 'H2_INC',
					title: 'Color2 Hue +',
					shortName: 'H2 +',
				},
				{
					name: 'Color1 Sat -',
					code: 'S1_DEC',
					title: 'Color1 Sat -',
					shortName: 'S1 -',
				},
				{
					name: 'Color1 Sat +',
					code: 'S1_INC',
					title: 'Color1 Sat +',
					shortName: 'S1 +',
				},
				{
					name: 'Color2 Sat -',
					code: 'S2_DEC',
					title: 'Color2 Sat -',
					shortName: 'S2 -',
				},
				{
					name: 'Color2 Sat +',
					code: 'S2_INC',
					title: 'Color2 Sat +',
					shortName: 'S2 +',
				},
			],
		},
		{
			id: 'media',
			label: 'Media',
			width: 'label',
			keycodes: [
				{ name: 'Vol -', code: 'KC_VOLD', title: 'Volume Down' },
				{ name: 'Vol +', code: 'KC_VOLU', title: 'Volume Up' },
				{ name: 'Mute', code: 'KC_MUTE', title: 'Mute Audio' },
				{ name: 'Play', code: 'KC_MPLY', title: 'Play/Pause' },
				{ name: 'Media Stop', code: 'KC_MSTP', title: 'Media Stop' },
				{ name: 'Previous', code: 'KC_MPRV', title: 'Media Previous' },
				{ name: 'Next', code: 'KC_MNXT', title: 'Media Next' },
				{ name: 'Rewind', code: 'KC_MRWD', title: 'Rewind' },
				{ name: 'Fast Forward', code: 'KC_MFFD', title: 'Fast Forward' },
				{ name: 'Select', code: 'KC_MSEL', title: 'Media Select' },
				{ name: 'Eject', code: 'KC_EJCT', title: 'Media Eject' },

				{ name: 'Audio On', code: 'AU_ON' },
				{ name: 'Audio Off', code: 'AU_OFF' },
				{ name: 'Audio Toggle', code: 'AU_TOG' },
				{ name: 'Clicky Toggle', code: 'CLICKY_TOGGLE' },
				{ name: 'Clicky Enable', code: 'CLICKY_ENABLE' },
				{ name: 'Clicky Disable', code: 'CLICKY_DISABLE' },
				{ name: 'Clicky Up', code: 'CLICKY_UP' },
				{ name: 'Clicky Down', code: 'CLICKY_DOWN' },
				{ name: 'Clicky Reset', code: 'CLICKY_RESET' },
				{ name: 'Music On', code: 'MU_ON' },
				{ name: 'Music Off', code: 'MU_OFF' },
				{ name: 'Music Toggle', code: 'MU_TOG' },
				{ name: 'Music Mode', code: 'MU_MOD' },
			],
		},
		{
			id: 'macro',
			label: 'Macro',
			width: 'label',
			keycodes: generateMacros(numMacros),
		},
		buildLayerMenu(),
		{
			id: 'mouse',
			label: 'Mouse',
			width: 'label',
			keycodes: [
				{ name: 'Mouse ↑', code: 'KC_MS_UP' },
				{ name: 'Mouse ↓', code: 'KC_MS_DOWN' },
				{ name: 'Mouse ←', code: 'KC_MS_LEFT' },
				{ name: 'Mouse →', code: 'KC_MS_RIGHT' },
				{ name: 'Mouse Btn1', code: 'KC_MS_BTN1' },
				{ name: 'Mouse Btn2', code: 'KC_MS_BTN2' },
				{ name: 'Mouse Btn3', code: 'KC_MS_BTN3' },
				{ name: 'Mouse Btn4', code: 'KC_MS_BTN4' },
				{ name: 'Mouse Btn5', code: 'KC_MS_BTN5' },
				{ name: 'Mouse Btn6', code: 'KC_MS_BTN6' },
				{ name: 'Mouse Btn7', code: 'KC_MS_BTN7' },
				{ name: 'Mouse Btn8', code: 'KC_MS_BTN8' },
				{ name: 'Mouse Wh ↑', code: 'KC_MS_WH_UP' },
				{ name: 'Mouse Wh ↓', code: 'KC_MS_WH_DOWN' },
				{ name: 'Mouse Wh ←', code: 'KC_MS_WH_LEFT' },
				{ name: 'Mouse Wh →', code: 'KC_MS_WH_RIGHT' },
				{ name: 'Mouse Acc0', code: 'KC_MS_ACCEL0' },
				{ name: 'Mouse Acc1', code: 'KC_MS_ACCEL1' },
				{ name: 'Mouse Acc2', code: 'KC_MS_ACCEL2' },
			],
		},
		{
			id: 'special',
			label: 'Special',
			width: 'label',
			keycodes: [
				{ name: '~', code: 'S(KC_GRV)', keys: '`', title: 'Shift + `' },
				{ name: '!', code: 'S(KC_1)', keys: '!', title: 'Shift + 1' },
				{ name: '@', code: 'S(KC_2)', keys: '@', title: 'Shift + 2' },
				{ name: '#', code: 'S(KC_3)', keys: '#', title: 'Shift + 3' },
				{ name: '$', code: 'S(KC_4)', keys: '$', title: 'Shift + 4' },
				{ name: '%', code: 'S(KC_5)', keys: '%', title: 'Shift + 5' },
				{ name: '^', code: 'S(KC_6)', keys: '^', title: 'Shift + 6' },
				{ name: '&', code: 'S(KC_7)', keys: '&', title: 'Shift + 7' },
				{ name: '*', code: 'S(KC_8)', keys: '*', title: 'Shift + 8' },
				{ name: '(', code: 'S(KC_9)', keys: '(', title: 'Shift + 9' },
				{ name: ')', code: 'S(KC_0)', keys: ')', title: 'Shift + 0' },
				{ name: '_', code: 'S(KC_MINS)', keys: '_', title: 'Shift + -' },
				{ name: '+', code: 'S(KC_EQL)', keys: '+', title: 'Shift + =' },
				{ name: '{', code: 'S(KC_LBRC)', keys: '{', title: 'Shift + [' },
				{ name: '}', code: 'S(KC_RBRC)', keys: '}', title: 'Shift + ]' },
				{ name: '|', code: 'S(KC_BSLS)', keys: '|', title: 'Shift + \\' },
				{ name: ':', code: 'S(KC_SCLN)', keys: ':', title: 'Shift + /' },
				{ name: '"', code: 'S(KC_QUOT)', keys: '"', title: "Shift + '" },
				{ name: '<', code: 'S(KC_COMM)', keys: '<', title: 'Shift + ,' },
				{ name: '>', code: 'S(KC_DOT)', keys: '>', title: 'Shift + .' },
				{ name: '?', code: 'S(KC_SLSH)', keys: '?', title: 'Shift + /' },
				{ name: 'NUHS', code: 'KC_NUHS', title: 'Non-US # and ~' },
				{ name: 'NUBS', code: 'KC_NUBS', title: 'Non-US \\ and |' },
				{ name: 'Ro', code: 'KC_RO', title: 'JIS \\ and |' },
				{ name: '¥', code: 'KC_JYEN', title: 'JPN Yen' },
				{ name: '無変換', code: 'KC_MHEN', title: 'JIS Muhenkan' },
				{ name: '漢字', code: 'KC_HANJ', title: 'Hanja' },
				{ name: '한영', code: 'KC_HAEN', title: 'HanYeong' },
				{ name: '変換', code: 'KC_HENK', title: 'JIS Henkan' },
				{ name: 'かな', code: 'KC_KANA', title: 'JIS Katakana/Hiragana' },
				{
					name: 'Esc `',
					code: 'KC_GESC',
					title: 'Esc normally, but ` when Shift or Win is pressed',
				},
				{
					name: 'LS (',
					code: 'KC_LSPO',
					title: 'Left Shift when held, ( when tapped',
				},
				{
					name: 'RS )',
					code: 'KC_RSPC',
					title: 'Right Shift when held, ) when tapped',
				},
				{
					name: 'LC (',
					code: 'KC_LCPO',
					title: 'Left Control when held, ( when tapped',
				},
				{
					name: 'RC )',
					code: 'KC_RCPC',
					title: 'Right Control when held, ) when tapped',
				},
				{
					name: 'LA (',
					code: 'KC_LAPO',
					title: 'Left Alt when held, ( when tapped',
				},
				{
					name: 'RA )',
					code: 'KC_RAPC',
					title: 'Right Alt when held, ) when tapped',
				},
				{
					name: 'SftEnt',
					code: 'KC_SFTENT',
					title: 'Right Shift when held, Enter when tapped',
				},
				{ name: 'Reset', code: 'RESET', title: 'Reset the keyboard' },
				{ name: 'Debug', code: 'DEBUG', title: 'Toggle debug mode' },
				{
					name: 'Toggle NKRO',
					code: 'MAGIC_TOGGLE_NKRO',
					shortName: 'NKRO',
					title: 'Toggle NKRO',
				},
				// I don't even think the locking stuff is enabled...
				{ name: 'Locking Num Lock', code: 'KC_LNUM' },
				{ name: 'Locking Caps Lock', code: 'KC_LCAP' },
				{ name: 'Locking Scroll Lock', code: 'KC_LSCR' },
				{ name: 'Power', code: 'KC_PWR' },
				{ name: 'Power OSX', code: 'KC_POWER' },
				{ name: 'Sleep', code: 'KC_SLEP' },
				{ name: 'Wake', code: 'KC_WAKE' },
				{ name: 'Calc', code: 'KC_CALC' },
				{ name: 'Mail', code: 'KC_MAIL' },
				{ name: 'Help', code: 'KC_HELP' },
				{ name: 'Stop', code: 'KC_STOP' },
				{ name: 'Alt Erase', code: 'KC_ERAS' },
				{ name: 'Again', code: 'KC_AGAIN' },
				{ name: 'Menu', code: 'KC_MENU' },
				{ name: 'Undo', code: 'KC_UNDO' },
				{ name: 'Select', code: 'KC_SELECT' },
				{ name: 'Exec', code: 'KC_EXECUTE' },
				{ name: 'Cut', code: 'KC_CUT' },
				{ name: 'Copy', code: 'KC_COPY' },
				{ name: 'Paste', code: 'KC_PASTE' },
				{ name: 'Find', code: 'KC_FIND' },
				{ name: 'My Comp', code: 'KC_MYCM' },
				{ name: 'Home', code: 'KC_WWW_HOME' },
				{ name: 'Back', code: 'KC_WWW_BACK' },
				{ name: 'Forward', code: 'KC_WWW_FORWARD' },
				{ name: 'Stop', code: 'KC_WWW_STOP' },
				{ name: 'Refresh', code: 'KC_WWW_REFRESH' },
				{ name: 'Favorites', code: 'KC_WWW_FAVORITES' },
				{ name: 'Search', code: 'KC_WWW_SEARCH' },
				{
					name: 'Screen +',
					code: 'KC_BRIU',
					shortName: 'Scr +',
					title: 'Screen Brightness Up',
				},
				{
					name: 'Screen -',
					code: 'KC_BRID',
					shortName: 'Scr -',
					title: 'Screen Brightness Down',
				},
				{ name: 'F13', code: 'KC_F13' },
				{ name: 'F14', code: 'KC_F14' },
				{ name: 'F15', code: 'KC_F15' },
				{ name: 'F16', code: 'KC_F16' },
				{ name: 'F17', code: 'KC_F17' },
				{ name: 'F18', code: 'KC_F18' },
				{ name: 'F19', code: 'KC_F19' },
				{ name: 'F20', code: 'KC_F20' },
				{ name: 'F21', code: 'KC_F21' },
				{ name: 'F22', code: 'KC_F22' },
				{ name: 'F23', code: 'KC_F23' },
				{ name: 'F24', code: 'KC_F24' },
			],
		},
		/* These are for controlling the original backlighting and bottom RGB. */
		{
			id: 'qmk_lighting',
			label: 'Lighting',
			width: 'label',
			keycodes: [
				{ name: 'BL Toggle', code: 'BL_TOGG' },
				{ name: 'BL On', code: 'BL_ON' },
				{ name: 'BL Off', code: 'BL_OFF', shortName: 'BL Off' },
				{ name: 'BL -', code: 'BL_DEC' },
				{ name: 'BL +', code: 'BL_INC' },
				{ name: 'BL Cycle', code: 'BL_STEP' },
				{ name: 'BR Toggle', code: 'BL_BRTG' },
				{ name: 'RGB Toggle', code: 'RGB_TOG' },
				{ name: 'RGB Mode -', code: 'RGB_RMOD' },
				{ name: 'RGB Mode +', code: 'RGB_MOD' },
				{ name: 'Hue -', code: 'RGB_HUD' },
				{ name: 'Hue +', code: 'RGB_HUI' },
				{ name: 'Sat -', code: 'RGB_SAD' },
				{ name: 'Sat +', code: 'RGB_SAI' },
				{ name: 'Bright -', code: 'RGB_VAD' },
				{ name: 'Bright +', code: 'RGB_VAI' },
				{ name: 'Effect Speed-', code: 'RGB_SPD' },
				{ name: 'Effect Speed+', code: 'RGB_SPI' },
				{ name: 'RGB Mode P', code: 'RGB_M_P', title: 'Plain' },
				{ name: 'RGB Mode B', code: 'RGB_M_B', title: 'Breathe' },
				{ name: 'RGB Mode R', code: 'RGB_M_R', title: 'Rainbow' },
				{ name: 'RGB Mode SW', code: 'RGB_M_SW', title: 'Swirl' },
				{ name: 'RGB Mode SN', code: 'RGB_M_SN', title: 'Snake' },
				{ name: 'RGB Mode K', code: 'RGB_M_K', title: 'Knight' },
				{ name: 'RGB Mode X', code: 'RGB_M_X', title: 'Xmas' },
				{ name: 'RGB Mode G', code: 'RGB_M_G', title: 'Gradient' },
			],
		},
		/*
     These custom keycodes always exist and should be filtered out if necessary
     Name and Title should be replaced with the correct ones from the keyboard json
    */
		{
			id: 'custom',
			label: 'Custom',
			width: 'label',
			keycodes: [
				{ name: 'CUSTOM(0)', code: 'CUSTOM(0)', title: 'Custom Keycode 0' },
				{ name: 'CUSTOM(1)', code: 'CUSTOM(1)', title: 'Custom Keycode 1' },
				{ name: 'CUSTOM(2)', code: 'CUSTOM(2)', title: 'Custom Keycode 2' },
				{ name: 'CUSTOM(3)', code: 'CUSTOM(3)', title: 'Custom Keycode 3' },
				{ name: 'CUSTOM(4)', code: 'CUSTOM(4)', title: 'Custom Keycode 4' },
				{ name: 'CUSTOM(5)', code: 'CUSTOM(5)', title: 'Custom Keycode 5' },
				{ name: 'CUSTOM(6)', code: 'CUSTOM(6)', title: 'Custom Keycode 6' },
				{ name: 'CUSTOM(7)', code: 'CUSTOM(7)', title: 'Custom Keycode 7' },
				{ name: 'CUSTOM(8)', code: 'CUSTOM(8)', title: 'Custom Keycode 8' },
				{ name: 'CUSTOM(9)', code: 'CUSTOM(9)', title: 'Custom Keycode 9' },
				{ name: 'CUSTOM(10)', code: 'CUSTOM(10)', title: 'Custom Keycode 10' },
				{ name: 'CUSTOM(11)', code: 'CUSTOM(11)', title: 'Custom Keycode 11' },
				{ name: 'CUSTOM(12)', code: 'CUSTOM(12)', title: 'Custom Keycode 12' },
				{ name: 'CUSTOM(13)', code: 'CUSTOM(13)', title: 'Custom Keycode 13' },
				{ name: 'CUSTOM(14)', code: 'CUSTOM(14)', title: 'Custom Keycode 14' },
				{ name: 'CUSTOM(15)', code: 'CUSTOM(15)', title: 'Custom Keycode 15' },
			],
		},
	]
}

export const categoriesForKeycodeModule = (keycodeModule: BuiltInKeycodeModule | 'default') =>
	({
		default: ['basic', 'media', 'macro', 'layers', 'special', 'mouse'],
		[BuiltInKeycodeModule.WTLighting]: ['wt_lighting'],
		[BuiltInKeycodeModule.QMKLighting]: ['qmk_lighting'],
	})[keycodeModule]

export const getKeycodesForKeyboard = (definition: VIADefinitionV3 | VIADefinitionV2) => {
	// v2
	let includeList: string[] = []
	if ('lighting' in definition) {
		const { keycodes } = getLightingDefinition(definition.lighting)
		includeList = categoriesForKeycodeModule('default').concat(
			keycodes === KeycodeType.None
				? []
				: keycodes === KeycodeType.QMK
					? categoriesForKeycodeModule(BuiltInKeycodeModule.QMKLighting)
					: categoriesForKeycodeModule(BuiltInKeycodeModule.WTLighting),
		)
	} else {
		const { keycodes } = definition
		includeList = keycodes.flatMap(categoriesForKeycodeModule)
	}
	return getKeycodes()
		.flatMap((keycodeMenu) => (includeList.includes(keycodeMenu.id) ? keycodeMenu.keycodes : []))
		.sort((a, b) => {
			if (a.code <= b.code) {
				return -1
			} else {
				return 1
			}
		})
}
