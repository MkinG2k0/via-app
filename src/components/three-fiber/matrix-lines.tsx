import { Segment, Segments } from '@react-three/drei'
import { VIAKey } from '@the-via/reader'
import { KeycapMetric } from 'src/utils/keyboard-rendering'
import { generateRowColArray } from '../n-links/matrix-lines'

export const MatrixLines: React.FC<{
	keys: VIAKey[]
	rows: number
	cols: number
	width: number
	height: number
}> = ({ keys, rows, cols, width, height }) => {
	const [rowColor, colColor] = ['lightpink', 'lightgrey']
	const { rowKeys, colKeys } = generateRowColArray(keys, rows, cols)
	return (
		<group
			key={`${rows}-${cols}-${width}-${height}`}
			position={[(-width * KeycapMetric.keyXPos) / 2, ((height + 0.4) * KeycapMetric.keyYPos) / 2, 11]}
			rotation={[Math.PI, 0, 0]}
			scale={0.35}
		>
			<Segments lineWidth={1}>
				{rowKeys.flatMap((seg) => {
					const cleanedSegments = seg.filter((x) => x)
					if (cleanedSegments.length >= 2) {
						return cleanedSegments.reduce(
							(prev, next, idx) => {
								if (prev.prev === null) {
									return { res: [], prev: next }
								}
								return {
									res: [
										...prev.res,
										<Segment
											color={rowColor}
											end={[next[0], next[1], 0]}
											key={`row-${idx}`}
											start={[prev.prev[0], prev.prev[1], 0]}
										/>,
									],
									prev: next,
								}
							},
							{ res: [], prev: null },
						).res
					}
					return []
				})}
				{colKeys.flatMap((seg) => {
					const cleanedSegments = seg.filter((x) => x)
					if (cleanedSegments.length >= 2) {
						return cleanedSegments.reduce(
							(prev, next, idx) => {
								if (prev.prev === null) {
									return { res: [], prev: next }
								}
								return {
									res: [
										...prev.res,
										<Segment
											color={colColor}
											end={[next[0], next[1], 0]}
											key={`col-${idx}`}
											start={[prev.prev[0], prev.prev[1], 0]}
										/>,
									],
									prev: next,
								}
							},
							{ res: [], prev: null },
						).res
					}
					return []
				})}
			</Segments>
		</group>
	)
}
