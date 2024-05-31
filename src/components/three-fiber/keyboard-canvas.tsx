import { SpringValue, a, useSpring } from '@react-spring/three'
import { PresentationControls } from '@react-three/drei'
import { ThreeEvent } from '@react-three/fiber'
import React, { useEffect, useMemo, useState } from 'react'
import { shallowEqual } from 'react-redux'
import { KeyboardCanvasContentProps, KeyboardCanvasProps } from 'src/types/keyboard-rendering'
import { DisplayMode } from 'src/types/keyboard-rendering'
import { CSSVarObject, calculateKeyboardFrameDimensions } from 'src/utils/keyboard-rendering'

import { Case } from './case'
import { KeyGroup } from './key-group'
import { MatrixLines } from './matrix-lines'

export const KeyboardCanvas: React.FC<KeyboardCanvasProps<ThreeEvent<MouseEvent>>> = (props) => {
	const { containerDimensions, shouldHide, ...otherProps } = props
	const { width, height } = useMemo(() => calculateKeyboardFrameDimensions(otherProps.keys), [otherProps.keys])
	const [sceneMouseOver, setSceneMouseover] = useState(false)
	const { verticalPostion, tilt } = useSpring({
		config: { tension: 35, friction: 5, mass: 0.3 },
		verticalPostion: sceneMouseOver ? 1 : -3,
		tilt: sceneMouseOver ? -0.15 : 0,
	})

	useEffect(() => {
		const canvasElement = document.querySelector('canvas')
		if (canvasElement) {
			canvasElement.addEventListener('mouseenter', () => {
				setSceneMouseover(true)
			})
			canvasElement.addEventListener('mouseleave', () => {
				setSceneMouseover(false)
			})
		}
	}, [])

	const ratio =
		Math.min(
			Math.min(
				1,
				containerDimensions &&
					containerDimensions.width /
						((CSSVarObject.keyWidth + CSSVarObject.keyXSpacing) * width - CSSVarObject.keyXSpacing + 70),
			),
			500 / ((CSSVarObject.keyHeight + CSSVarObject.keyYSpacing) * height - CSSVarObject.keyYSpacing + 70),
		) || 1

	return (
		<group position={[0, -0.0, -19]} scale={0.015 * ratio} visible={!shouldHide}>
			<KeyboardCanvasContent
				{...otherProps}
				height={height}
				tilt={tilt}
				verticalPostion={verticalPostion}
				width={width}
			/>
		</group>
	)
}

const KeyboardCanvasContent: React.FC<
	{
		tilt: SpringValue<number>
		verticalPostion: SpringValue<number>
	} & KeyboardCanvasContentProps<ThreeEvent<MouseEvent>>
> = React.memo((props) => {
	const {
		matrixKeycodes,
		keys,
		definition,
		pressedKeys,
		mode,
		showMatrix,
		selectable,
		width,
		height,
		verticalPostion,
		tilt,
	} = props

	return (
		<a.group position-y={verticalPostion} rotation-x={tilt}>
			<PresentationControls
				azimuth={[-Math.PI / 16, Math.PI / 16]} // Horizontal limits
				config={{ mass: 1, tension: 170, friction: 26 }} // Spring config
				enabled={props.mode !== DisplayMode.ConfigureColors} // the controls can be disabled by setting this to false
				global={true} // Spin globally or by dragging the model
				polar={[-Math.PI / 10, Math.PI / 10]} // Vertical limits
				snap={true} // Snap-back to center (can also be a spring config)
				speed={1} // Speed factor
				zoom={1} // Zoom factor when half the polar-max is reached
			>
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
			</PresentationControls>
		</a.group>
	)
}, shallowEqual)
