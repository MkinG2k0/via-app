import type { LightingValue, VIADefinitionV2, VIADefinitionV3 } from '@the-via/reader'

import React from 'react'
import { getSelectedDefinition } from 'src/store/definitionsSlice'
import { useAppSelector } from 'src/store/hooks'
import { useAppDispatch } from 'src/store/hooks'
import { getSelectedLightingData, updateBacklightValue } from 'src/store/lightingSlice'

import { AccentRange } from '../../../../inputs/accent-range'
import { AccentSelect } from '../../../../inputs/accent-select'
import { AccentSlider } from '../../../../inputs/accent-slider'
import { ArrayColorPicker } from '../../../../inputs/color-picker'
import { ControlRow, Detail, Label } from '../../../grid'

export type ControlMeta = [
	LightingValue,
	React.FC<AdvancedControlProps> | string,
	{ type: string } & Partial<{
		getOptions: (d: VIADefinitionV2 | VIADefinitionV3) => string[]
		max: number
		min: number
	}>,
]
type AdvancedControlProps = { meta: ControlMeta }
export const LightingControl = (props: AdvancedControlProps) => {
	const dispatch = useAppDispatch()
	const lightingData = useAppSelector(getSelectedLightingData)
	const definition = useAppSelector(getSelectedDefinition)
	const [command, label, meta] = props.meta
	const valArr = lightingData && lightingData[command]
	if (!valArr || !definition) {
		return null
	}

	const labelContent = typeof label === 'string' ? label : label(props)
	switch (meta.type) {
		case 'slider':
			return (
				<ControlRow>
					<Label>{labelContent}</Label>
					<Detail>
						<AccentSlider
							isChecked={Boolean(valArr[0])}
							onChange={(val: boolean) => dispatch(updateBacklightValue(command, Number(val)))}
						/>
					</Detail>
				</ControlRow>
			)

		case 'range':
			return (
				<ControlRow>
					<Label>{labelContent}</Label>
					<Detail>
						<AccentRange
							defaultValue={valArr[0]}
							max={meta.max}
							min={meta.min}
							onChange={(val) => dispatch(updateBacklightValue(command, val))}
						/>
					</Detail>
				</ControlRow>
			)
		case 'color':
			return (
				<ControlRow>
					<Label>{labelContent}</Label>
					<Detail>
						<ArrayColorPicker
							color={valArr as [number, number]}
							setColor={(hue, sat) => dispatch(updateBacklightValue(command, hue, sat))}
						/>
					</Detail>
				</ControlRow>
			)
		case 'select': {
			const options = ((meta as any).getOptions(definition) as string[]).map((label, value) => ({
				value,
				label,
			}))
			return (
				<ControlRow>
					<Label>{labelContent}</Label>
					<Detail>
						<AccentSelect
							defaultValue={(options as any).find((p: any) => valArr[0] === p.value)}
							/*width={250}*/
							onChange={(option: any) => {
								if (option) {
									dispatch(updateBacklightValue(command, Number(option.value)))
								}
							}}
							options={options as any}
						/>
					</Detail>
				</ControlRow>
			)
		}
		case 'row_col':
			return (
				<ControlRow>
					<Label>{labelContent}</Label>
					<Detail>
						<AccentSlider
							isChecked={valArr[0] !== 255}
							onChange={(val) => {
								const args = val ? [254, 254] : [255, 255]
								dispatch(updateBacklightValue(command, ...args))
							}}
						/>
					</Detail>
				</ControlRow>
			)
	}
	return null
}
