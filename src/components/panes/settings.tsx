import { faToolbox } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { getSelectedConnectedDevice } from 'src/store/devicesSlice'
import { useAppSelector } from 'src/store/hooks'
import {
	getDisableFastRemap,
	getDisableRecordKeyboard,
	getRenderMode,
	getShowDesignTab,
	getThemeMode,
	getThemeName,
	toggleCreatorMode,
	toggleFastRemap,
	toggleRecordKeyboard,
	toggleThemeMode,
	updateRenderMode,
	updateThemeName,
} from 'src/store/settingsSlice'
import { webGLIsAvailable } from 'src/utils/test-webgl'
import { THEMES } from 'src/utils/themes'
import styled from 'styled-components'

import { AccentSelect } from '../inputs/accent-select'
import { AccentSlider } from '../inputs/accent-slider'
import { MenuTooltip } from '../inputs/tooltip'
import { ErrorMessage } from '../styled'
import { MenuContainer } from './configure-panes/custom/menu-generator'
import { ControlRow, Detail, Grid, IconContainer, Label, MenuCell, Row, SpanOverflowCell } from './grid'
import { Pane } from './pane'

const Container = styled.div`
	display: flex;
	align-items: center;
	flex-direction: column;
	padding: 0 12px;
`

const DiagnosticContainer = styled(Container)`
	margin-top: 20px;
	padding-top: 20px;
`

const SettingsErrorMessage = styled(ErrorMessage)`
	margin: 0;
	font-style: italic;
`

export const Settings = () => {
	const dispatch = useDispatch()
	const showDesignTab = useAppSelector(getShowDesignTab)
	const disableFastRemap = useAppSelector(getDisableFastRemap)
	const disableRecordKeyboard = useAppSelector(getDisableRecordKeyboard)
	const themeMode = useAppSelector(getThemeMode)
	const themeName = useAppSelector(getThemeName)
	const renderMode = useAppSelector(getRenderMode)
	const selectedDevice = useAppSelector(getSelectedConnectedDevice)

	const [showDiagnostics, setShowDiagnostics] = useState(false)

	const themeSelectOptions = Object.keys(THEMES).map((k) => ({
		label: k.replaceAll('_', ' '),
		value: k,
	}))
	const themeDefaultValue = themeSelectOptions.find((opt) => opt.value === themeName)

	const renderModeOptions = webGLIsAvailable
		? [
				{
					label: '2D',
					value: '2D',
				},
				{
					label: '3D',
					value: '3D',
				},
			]
		: [{ label: '2D', value: '2D' }]
	const renderModeDefaultValue = renderModeOptions.find((opt) => opt.value === renderMode)
	return (
		<Pane>
			<Grid style={{ overflow: 'hidden' }}>
				<MenuCell style={{ pointerEvents: 'all', borderTop: 'none' }}>
					<MenuContainer>
						<Row $selected={true}>
							<IconContainer>
								<FontAwesomeIcon icon={faToolbox} />
								<MenuTooltip>General</MenuTooltip>
							</IconContainer>
						</Row>
					</MenuContainer>
				</MenuCell>
				<SpanOverflowCell style={{ flex: 1, borderWidth: 0 }}>
					<Container>
						<ControlRow>
							<Label>Show Design tab</Label>
							<Detail>
								<AccentSlider isChecked={showDesignTab} onChange={() => dispatch(toggleCreatorMode())} />
							</Detail>
						</ControlRow>
						<ControlRow>
							<Label>Fast Key Mapping</Label>
							<Detail>
								<AccentSlider isChecked={!disableFastRemap} onChange={() => dispatch(toggleFastRemap())} />
							</Detail>
						</ControlRow>
						<ControlRow>
							<Label>Record Keyboard</Label>
							<Detail>
								<AccentSlider isChecked={!disableRecordKeyboard} onChange={() => dispatch(toggleRecordKeyboard())} />
							</Detail>
						</ControlRow>
						<ControlRow>
							<Label>Light Mode</Label>
							<Detail>
								<AccentSlider isChecked={themeMode === 'light'} onChange={() => dispatch(toggleThemeMode())} />
							</Detail>
						</ControlRow>
						<ControlRow>
							<Label>Keycap Theme</Label>
							<Detail>
								<AccentSelect
									defaultValue={themeDefaultValue}
									onChange={(option: any) => {
										option && dispatch(updateThemeName(option.value))
									}}
									options={themeSelectOptions}
								/>
							</Detail>
						</ControlRow>
						<ControlRow>
							<Label>Render Mode</Label>
							<Detail>
								<AccentSelect
									defaultValue={renderModeDefaultValue}
									onChange={(option: any) => {
										option && dispatch(updateRenderMode(option.value))
									}}
									options={renderModeOptions}
								/>
							</Detail>
						</ControlRow>
						<ControlRow>
							<Label>Show Diagnostic Information</Label>

							<Detail>
								{selectedDevice ? (
									<AccentSlider isChecked={showDiagnostics} onChange={() => setShowDiagnostics(!showDiagnostics)} />
								) : (
									<SettingsErrorMessage>Requires connected device</SettingsErrorMessage>
								)}
							</Detail>
						</ControlRow>
					</Container>
					{showDiagnostics && selectedDevice ? (
						<DiagnosticContainer>
							<ControlRow>
								<Label>VIA Firmware Protocol</Label>
								<Detail>{selectedDevice.protocol}</Detail>
							</ControlRow>
						</DiagnosticContainer>
					) : null}
				</SpanOverflowCell>
			</Grid>
		</Pane>
	)
}
