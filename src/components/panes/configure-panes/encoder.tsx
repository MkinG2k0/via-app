import type { VIAKey } from '@the-via/reader'

import { FC, useEffect, useState } from 'react'
import { PelpiKeycodeInput } from 'src/components/inputs/pelpi/keycode-input'
import { ErrorMessage } from 'src/components/styled'
import { getSelectedKeyDefinitions } from 'src/store/definitionsSlice'
import { getSelectedConnectedDevice, getSelectedKeyboardAPI } from 'src/store/devicesSlice'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { getSelectedKey, getSelectedKeymap, getSelectedLayerIndex, updateKey } from 'src/store/keymapSlice'
import { KeyboardAPI } from 'src/utils/keyboard-api'
import styled from 'styled-components'

import { ControlRow, Detail, Label, SpanOverflowCell } from '../grid'
import { CenterPane } from '../pane'

const Encoder = styled(CenterPane)`
	height: 100%;
	background: var(--color_dark_grey);
`

const Container = styled.div`
	display: flex;
	align-items: center;
	flex-direction: column;
	padding: 0 12px;
`

const renderEncoderError = () => {
	return (
		<ErrorMessage>
			Your current firmware does not support rotary encoders. Install the latest firmware for your device.
		</ErrorMessage>
	)
}

export const Pane: FC = () => {
	const [cwValue, setCWValue] = useState<number>()
	const [ccwValue, setCCWValue] = useState<number>()
	const selectedKey = useAppSelector(getSelectedKey)
	const dispatch = useAppDispatch()
	const keys: ({ ei?: number } & VIAKey)[] = useAppSelector(getSelectedKeyDefinitions)
	const matrixKeycodes = useAppSelector((state) => getSelectedKeymap(state) || [])
	const layer = useAppSelector(getSelectedLayerIndex)
	const selectedDevice = useAppSelector(getSelectedConnectedDevice)
	const api = useAppSelector(getSelectedKeyboardAPI)
	const val = matrixKeycodes[selectedKey ?? -1]
	const encoderKey = keys[selectedKey ?? -1]
	const canClick = Boolean(encoderKey) && encoderKey.col !== -1 && encoderKey.row !== -1

	const setEncoderValue = (type: 'ccw' | 'click' | 'cw', val: number) => {
		if (api && selectedKey !== null && encoderKey && encoderKey.ei !== undefined) {
			const encoderId = Number(encoderKey.ei)
			switch (type) {
				case 'ccw': {
					api.setEncoderValue(layer, encoderId, false, val)
					setCCWValue(val)
					break
				}
				case 'cw': {
					api.setEncoderValue(layer, encoderId, true, val)
					setCWValue(val)
					break
				}
				case 'click': {
					dispatch(updateKey(selectedKey, val))
					break
				}
			}
		}
	}
	const loadValues = async (layer: number, id: number, api: KeyboardAPI) => {
		const cw = await api.getEncoderValue(layer, id, true)
		const ccw = await api.getEncoderValue(layer, id, false)
		setCWValue(cw)
		setCCWValue(ccw)
	}
	useEffect(() => {
		if (
			selectedDevice &&
			selectedDevice.protocol >= 10 &&
			encoderKey !== undefined &&
			encoderKey.ei !== undefined &&
			api
		) {
			const encoderId = Number(encoderKey.ei)
			loadValues(layer, encoderId, api)
		}
	}, [encoderKey, selectedDevice, layer])

	if (
		encoderKey === undefined ||
		(selectedDevice && selectedDevice.protocol < 10) ||
		ccwValue === undefined ||
		cwValue === undefined
	) {
		return <SpanOverflowCell>{renderEncoderError()}</SpanOverflowCell>
	}
	return (
		<SpanOverflowCell>
			<Encoder>
				<Container>
					<ControlRow>
						<Label>Rotate Counterclockwise</Label>
						<Detail>
							<PelpiKeycodeInput meta={{}} setValue={(val: number) => setEncoderValue('ccw', val)} value={ccwValue} />
						</Detail>
					</ControlRow>
					<ControlRow>
						<Label>Rotate Clockwise</Label>
						<Detail>
							<PelpiKeycodeInput meta={{}} setValue={(val: number) => setEncoderValue('cw', val)} value={cwValue} />
						</Detail>
					</ControlRow>
					{canClick && (
						<ControlRow>
							<Label>Press Encoder</Label>
							<Detail>
								<PelpiKeycodeInput meta={{}} setValue={(val: number) => setEncoderValue('click', val)} value={val} />
							</Detail>
						</ControlRow>
					)}
				</Container>
			</Encoder>
		</SpanOverflowCell>
	)
}
