export enum RawKeycodeSequenceAction {
	CharacterStream = 5,
	Delay = 4,
	Down = 2,
	Tap = 1,
	Up = 3,
}

export enum GroupedKeycodeSequenceAction {
	Chord = 6,
}

export type RawKeycodeSequenceItem = [RawKeycodeSequenceAction, number | string]

export type RawKeycodeSequence = RawKeycodeSequenceItem[]

export type GroupedKeycodeSequenceItem = [GroupedKeycodeSequenceAction, string[]]

export type OptimizedKeycodeSequenceItem = GroupedKeycodeSequenceItem | RawKeycodeSequenceItem

export type OptimizedKeycodeSequence = OptimizedKeycodeSequenceItem[]
