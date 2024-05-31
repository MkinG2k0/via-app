import type { VIADefinitionV2, VIADefinitionV3 } from '@the-via/reader'

import React from 'react'
import { useDispatch } from 'react-redux'
import { getDesignSelectedOptionKeys, updateSelectedOptionKeys } from 'src/store/designSlice'
import { useAppSelector } from 'src/store/hooks'

import { AccentSelect } from './inputs/accent-select'
import { AccentSlider } from './inputs/accent-slider'
import { Detail, IndentedControlRow, Label } from './panes/grid'

interface Props {
	RowComponent?: React.JSXElementConstructor<any>
	definition: VIADefinitionV2 | VIADefinitionV3
	onLayoutChange: (newSelectedOptionKeys: number[]) => void
}

function Layouts({ definition, onLayoutChange, RowComponent = IndentedControlRow }: Props): JSX.Element | null {
	const selectedOptionKeys = useAppSelector(getDesignSelectedOptionKeys)
	const dispatch = useDispatch()

	React.useEffect(() => {
		dispatch(updateSelectedOptionKeys([]))
	}, [definition])

	React.useEffect(() => {
		onLayoutChange(selectedOptionKeys)
	}, [selectedOptionKeys])

	if (!definition.layouts.labels) {
		return null
	}

	const LayoutControls = definition.layouts.labels.map((label, layoutKey) => {
		const optionKeys = definition.layouts.optionKeys[layoutKey]

		// Multiple versions of this layout
		if (Array.isArray(label)) {
			const name = label[0]
			const options = label.slice(1)

			const selectElementOptions = options.map((option, optionIndex) => ({
				label: option,
				value: optionKeys[optionIndex],
			}))

			return (
				<RowComponent key={`${layoutKey}-${name}`}>
					<Label>{name}</Label>
					<Detail>
						<AccentSelect
							onChange={(option: any) => {
								if (option && option.label) {
									const optionIndex = options.indexOf(option.label)
									const optionKeys = Array.from(selectedOptionKeys).map((i) => i || 0)
									optionKeys[layoutKey] = optionIndex
									dispatch(updateSelectedOptionKeys(optionKeys))
								}
							}}
							options={selectElementOptions as any}
							value={
								selectedOptionKeys[layoutKey]
									? selectElementOptions[selectedOptionKeys[layoutKey]]
									: (selectElementOptions[0] as any)
							}
						/>
					</Detail>
				</RowComponent>
			)
		}
		if (typeof label === 'string') {
			return (
				<RowComponent key={`${layoutKey}-${label}`}>
					<Label>{label}</Label>
					<Detail>
						<AccentSlider
							isChecked={Boolean(selectedOptionKeys[layoutKey])}
							onChange={(isChecked) => {
								const optionKeys = Array.from(selectedOptionKeys).map((i) => i || 0)
								optionKeys[layoutKey] = Number(isChecked)
								dispatch(updateSelectedOptionKeys(optionKeys))
							}}
						/>
					</Detail>
				</RowComponent>
			)
		}
		return null
	})

	return <>{LayoutControls}</>
}

export default Layouts
