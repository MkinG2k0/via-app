import { VIAKey } from '@the-via/reader'
import { CSSVarObject } from 'src/utils/keyboard-rendering'
import styled from 'styled-components'

import { generateRowColArray } from '../n-links/matrix-lines'

type MatrixProps = {
	colKeys: number[][][]
	rowKeys: number[][][]
}

const Matrix: React.FC<MatrixProps> = ({ rowKeys, colKeys }) => (
	<SVG
		style={{
			position: 'absolute',
			top: CSSVarObject.insideBorder,
			left: CSSVarObject.insideBorder,
		}}
	>
		{rowKeys.map((arr, index) => (
			<RowLine key={index} points={arr.map((point) => (point || []).join(',')).join(' ')} />
		))}
		{colKeys.map((arr, index) => (
			<ColLine key={index} points={arr.map((point) => (point || []).join(',')).join(' ')} />
		))}
	</SVG>
)

const SVG = styled.svg`
	transform: rotateZ(0);
	width: 100%;
	height: 100%;
`
const RowLine = styled.polyline`
	stroke: var(--color_accent);
	stroke-width: 3;
	fill-opacity: 0;
	stroke-opacity: 0.4;
	stroke-linecap: round;
`
const ColLine = styled.polyline`
	stroke: var(--color_light-grey);
	stroke-width: 3;
	fill-opacity: 0;
	stroke-opacity: 0.4;
	stroke-linecap: round;
`

export const MatrixLines: React.FC<{
	cols: number
	height: number
	keys: VIAKey[]
	rows: number
	width: number
}> = ({ keys, rows, cols, width, height }) => {
	const { rowKeys, colKeys } = generateRowColArray(keys, rows, cols)
	return <Matrix colKeys={colKeys} rowKeys={rowKeys} />
}
