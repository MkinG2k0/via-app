export type PelpiMeta<A = {}> = A
export type PelpiInput<A> = {
	meta: PelpiMeta<A>
	setValue: (val: number) => void
	value: number
}
