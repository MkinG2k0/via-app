import { ThreeEvent } from '@react-three/fiber'
import { VIADefinitionV2, VIADefinitionV3, VIAKey } from '@the-via/reader'
import { TestKeyState } from 'src/types/types'
import { BufferGeometry } from 'three'

export enum DisplayMode {
	Configure = 2,
	ConfigureColors = 4,
	Design = 3,
	Test = 1,
}

export enum KeycapState {
	Pressed = 1,
	Unpressed = 2,
}

export type KeyColorPair = {
	c: string
	t: string
}

export type NDimension = '2D' | '3D'

export type KeyboardCanvasContentProps<T> = {
	definition: VIADefinitionV2 | VIADefinitionV3
	height: number
	keyColors?: number[][]
	keys: ({ ei?: number } & VIAKey)[]
	matrixKeycodes: number[]
	mode: DisplayMode
	onKeycapPointerDown?: (e: T, idx: number) => void
	onKeycapPointerOver?: (e: T, idx: number) => void
	pressedKeys?: TestKeyState[]
	selectable: boolean
	selectedKey?: number
	showMatrix?: boolean
	width: number
}

export type KeyboardCanvasProps<T> = {
	containerDimensions: DOMRect
	shouldHide?: boolean
} & Omit<KeyboardCanvasContentProps<T>, 'height' | 'width'>

export type KeyGroupProps<T> = {
	definition: VIADefinitionV2 | VIADefinitionV3
	keyColors?: number[][]
	keys: VIAKey[]
	matrixKeycodes: number[]
	mode: DisplayMode
	onKeycapPointerDown?: (e: T, idx: number) => void
	onKeycapPointerOver?: (e: T, idx: number) => void
	pressedKeys?: TestKeyState[]
	selectable?: boolean
	selectedKey?: number
}

export type KeyCoords<T> = {
	color: KeyColorPair
	idx: number
	meshKey: string
	onClick: (e: T, idx: number) => void
	onPointerDown?: (e: T, idx: number) => void
	onPointerOver?: (e: T, idx: number) => void
	position: [number, number, number]
	rotation: [number, number, number]
	scale: [number, number, number]
}

export type KeysKeys<T> = {
	coords: KeyCoords<T>[]
	indices: string[]
}

export type KeycapSharedProps<T> = {
	disabled: boolean
	keyState: number
	keyboardKeys: string
	label: any
	mode: DisplayMode
	selected: boolean
	shouldRotate: boolean
	skipFontCheck: boolean
	textureHeight: number
	textureOffsetX: number
	textureWidth: number
} & Omit<KeyCoords<T>, 'meshKey'>

export type TwoStringKeycapProps = {
	clipPath: null | string
} & KeycapSharedProps<React.MouseEvent<Element, MouseEvent>>

export type ThreeFiberKeycapProps = {
	keycapGeometry: BufferGeometry
} & KeycapSharedProps<ThreeEvent<MouseEvent>>
