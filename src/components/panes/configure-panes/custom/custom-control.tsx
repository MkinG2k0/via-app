import type { VIADefinitionV2, VIADefinitionV3, VIAItem } from '@the-via/reader'

import React from 'react'
import { ConnectedColorPalettePicker } from 'src/components/inputs/color-palette-picker'
import { shiftFrom16Bit, shiftTo16Bit } from 'src/utils/keyboard-api'

import type { LightingData } from '../../../../types/types'

import { AccentButton } from '../../../inputs/accent-button'
import { AccentRange } from '../../../inputs/accent-range'
import { AccentSelect } from '../../../inputs/accent-select'
import { AccentSlider } from '../../../inputs/accent-slider'
import { ArrayColorPicker } from '../../../inputs/color-picker'
import { PelpiKeycodeInput } from '../../../inputs/pelpi/keycode-input'
import { ControlRow, Detail, Label } from '../../grid'

type Props = {
	definition: VIADefinitionV2 | VIADefinitionV3
	lightingData: LightingData
}

type ControlMeta = [
	React.FC<AdvancedControlProps> | string,
	{ type: string } & Partial<{
		getOptions: (d: VIADefinitionV2 | VIADefinitionV3) => string[]
		max: number
		min: number
	}>,
]

type AdvancedControlProps = { meta: ControlMeta } & Props

export const VIACustomItem = React.memo((props: { _id: string } & VIACustomControlProps) => (
	<ControlRow id={props._id}>
		<Label>{props.label}</Label>
		<Detail>
			{'type' in props ? <VIACustomControl {...props} value={props.value && Array.from(props.value)} /> : props.content}
		</Detail>
	</ControlRow>
))

type ControlGetSet = {
	updateValue: (name: string, ...command: number[]) => void
	value: number[]
}

type VIACustomControlProps = ControlGetSet & VIAItem

const boxOrArr = <N extends any>(elem: N | N[]) => (Array.isArray(elem) ? elem : [elem])

// we can compare value against option[1], that way corrupted values are false
const valueIsChecked = (option: number | number[], value: number[]) => boxOrArr(option).every((o, i) => o == value[i])

const getRangeValue = (value: number[], max: number) => {
	if (max > 255) {
		return shiftTo16Bit([value[0], value[1]])
	} else {
		return value[0]
	}
}

const getRangeBytes = (value: number, max: number) => {
	if (max > 255) {
		return shiftFrom16Bit(value)
	} else {
		return [value]
	}
}

const VIACustomControl = (props: VIACustomControlProps) => {
	const { content, type, options, value } = props as any
	const [name, ...command] = content
	switch (type) {
		case 'button': {
			const buttonOption: any[] = options || [1]
			return <AccentButton onClick={() => props.updateValue(name, ...command, buttonOption[0])}>Click</AccentButton>
		}
		case 'range': {
			return (
				<AccentRange
					defaultValue={getRangeValue(props.value, options[1])}
					max={options[1]}
					min={options[0]}
					onChange={(val: number) => props.updateValue(name, ...command, ...getRangeBytes(val, options[1]))}
				/>
			)
		}
		case 'keycode': {
			return (
				<PelpiKeycodeInput
					meta={{}}
					setValue={(val: number) => props.updateValue(name, ...command, ...shiftFrom16Bit(val))}
					value={shiftTo16Bit([props.value[0], props.value[1]])}
				/>
			)
		}
		case 'toggle': {
			const toggleOptions: any[] = options || [0, 1]
			return (
				<AccentSlider
					isChecked={valueIsChecked(toggleOptions[1], props.value)}
					onChange={(val) => props.updateValue(name, ...command, ...boxOrArr(toggleOptions[Number(val)]))}
				/>
			)
		}
		case 'dropdown': {
			const selectOptions = options.map((option: [string, number] | string, idx: number) => {
				const [label, value] = typeof option === 'string' ? [option, idx] : option
				return {
					value: value || idx,
					label,
				}
			})
			return (
				<AccentSelect
					defaultValue={selectOptions.find((p: any) => value[0] === p.value)}
					/*width={250}*/
					onChange={(option: any) => option && props.updateValue(name, ...command, Number(option.value))}
					options={selectOptions}
				/>
			)
		}
		case 'color': {
			return (
				<ArrayColorPicker
					color={props.value as [number, number]}
					setColor={(hue, sat) => props.updateValue(name, ...command, hue, sat)}
				/>
			)
		}
		case 'color-palette': {
			return <ConnectedColorPalettePicker />
		}
	}
	return null
}
