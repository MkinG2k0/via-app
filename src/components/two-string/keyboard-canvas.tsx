import React, { useMemo } from 'react'
import { shallowEqual } from 'react-redux'
import { KeyboardCanvasContentProps, KeyboardCanvasProps } from 'src/types/keyboard-rendering'
import { CSSVarObject, calculateKeyboardFrameDimensions } from 'src/utils/keyboard-rendering'
import styled from 'styled-components'

import { Case } from './case'
import { KeyGroup } from './key-group'
import { MatrixLines } from './matrix-lines'
export const KeyboardCanvas: React.FC<KeyboardCanvasProps<React.MouseEvent>> = (props) => {
	const { containerDimensions, shouldHide, ...otherProps } = props
	const { width, height } = useMemo(() => calculateKeyboardFrameDimensions(otherProps.keys), [otherProps.keys])
	const containerHeight = containerDimensions.height
	const minPadding = 35
	const ratio =
		Math.min(
			Math.min(
				1,
				containerDimensions &&
					containerDimensions.width /
						((CSSVarObject.keyWidth + CSSVarObject.keyXSpacing) * width - CSSVarObject.keyXSpacing + minPadding * 2),
			),
			containerHeight /
				((CSSVarObject.keyHeight + CSSVarObject.keyYSpacing) * height - CSSVarObject.keyYSpacing + minPadding * 2),
		) || 1

	return (
		<div
			style={{
				transform: `scale(${ratio}, ${ratio})`,
				opacity: shouldHide ? 0 : 1,
				position: 'absolute',
				pointerEvents: shouldHide ? 'none' : 'all',
			}}
		>
			<KeyboardCanvasContent {...otherProps} height={height} width={width} />
		</div>
	)
}
const KeyboardGroup = styled.div`
	position: relative;
`

const KeyboardCanvasContent: React.FC<KeyboardCanvasContentProps<React.MouseEvent>> = React.memo((props) => {
	const { matrixKeycodes, keys, definition, pressedKeys, mode, showMatrix, selectable, width, height } = props

	return (
		<KeyboardGroup>
			<Case height={height} width={width} />
			<KeyGroup
				{...props}
				definition={definition}
				keys={keys}
				matrixKeycodes={matrixKeycodes}
				mode={mode}
				pressedKeys={pressedKeys}
				selectable={selectable}
			/>
			{showMatrix && (
				<MatrixLines
					cols={definition.matrix.cols}
					height={height}
					keys={keys}
					rows={definition.matrix.rows}
					width={width}
				/>
			)}
		</KeyboardGroup>
	)
}, shallowEqual)
