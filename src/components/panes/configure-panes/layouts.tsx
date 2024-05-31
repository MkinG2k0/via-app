import type { LayoutLabel } from '@the-via/reader'
import type { FC } from 'react'

import React from 'react'
import { getSelectedDefinition, getSelectedLayoutOptions, updateLayoutOption } from 'src/store/definitionsSlice'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import styled from 'styled-components'

import { component, title } from '../../icons/layouts'
import { AccentSelect } from '../../inputs/accent-select'
import { AccentSlider } from '../../inputs/accent-slider'
import { ControlRow, Detail, Label, SpanOverflowCell } from '../grid'
import { CenterPane } from '../pane'

const LayoutControl: React.FC<{
	meta: { labels: LayoutLabel; selectedOption: number }
	onChange: (val: any) => void
}> = (props) => {
	const { onChange, meta } = props
	const { labels, selectedOption } = meta
	if (Array.isArray(labels)) {
		const [label, ...optionLabels] = labels
		const options = optionLabels.map((label, idx) => ({
			label,
			value: `${idx}`,
		}))
		return (
			<ControlRow>
				<Label>{label}</Label>
				<Detail>
					<AccentSelect
						/*width={150}*/
						defaultValue={options[selectedOption]}
						onChange={(option: any) => {
							if (option) {
								onChange(Number(option.value))
							}
						}}
						options={options}
					/>
				</Detail>
			</ControlRow>
		)
	} else {
		return (
			<ControlRow>
				<Label>{labels}</Label>
				<Detail>
					<AccentSlider isChecked={Boolean(selectedOption)} onChange={(val) => onChange(Number(val))} />
				</Detail>
			</ControlRow>
		)
	}
}

const ContainerPane = styled(CenterPane)`
	height: 100%;
	background: var(--color_dark_grey);
`

const Container = styled.div`
	display: flex;
	align-items: center;
	flex-direction: column;
	padding: 0 12px;
`

export const Pane: FC = () => {
	const dispatch = useAppDispatch()

	const selectedDefinition = useAppSelector(getSelectedDefinition)
	const selectedLayoutOptions = useAppSelector(getSelectedLayoutOptions)

	if (!selectedDefinition || !selectedLayoutOptions) {
		return null
	}

	const { layouts } = selectedDefinition

	const labels = layouts.labels || []
	return (
		<SpanOverflowCell>
			<ContainerPane>
				<Container>
					{labels.map((label: LayoutLabel, idx: number) => (
						<LayoutControl
							key={idx}
							meta={{
								labels: label,
								selectedOption: selectedLayoutOptions[idx],
							}}
							onChange={(val) => dispatch(updateLayoutOption(idx, val))}
						/>
					))}
				</Container>
			</ContainerPane>
		</SpanOverflowCell>
	)
}
export const Title = title
export const Icon = component
