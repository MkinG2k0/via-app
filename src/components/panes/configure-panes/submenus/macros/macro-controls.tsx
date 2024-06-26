import {
	faCircle,
	faCompress,
	faExpand,
	faMagicWandSparkles,
	faSave,
	faSquare,
	faStopwatch,
	faTrash,
	faUndo,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconButtonContainer, IconToggleContainer } from 'src/components/inputs/icon-button'
import { IconButtonTooltip } from 'src/components/inputs/tooltip'
import styled from 'styled-components'

const MacroEditControlsContainer = styled.div`
	background: var(--bg_menu);
	display: inline-flex;
	align-items: center;
	padding: 0 10px;
`
const MacroControlGroupContainer = styled.div`
	border-radius: 2px;
	border: 1px solid var(--border_color_icon);
	display: inline-flex;
	> button:last-child {
		border: none;
	}
`
const MacroControlGroupDivider = styled.div`
	background: var(--border_color_icon);
	width: 1px;
	height: 80%;
	margin: 0 10px;
`

export const MacroEditControls: React.FC<{
	isFullscreen: boolean
	isRecording: boolean
	optimizeRecording: boolean
	recordDelays: boolean
	hasUnsavedChanges?: boolean
	undoChanges(): void
	deleteMacro(): void
	saveChanges(): void
	toggleOptimizeRecording(): void
	toggleRecordDelays(): void
	toggleFullscreen(): void
	isEmpty?: boolean
	recordingToggleChange: (a: boolean) => void
	addText: () => void
	isDelaySupported: boolean
}> = ({
	isFullscreen,
	isRecording,
	recordingToggleChange,
	hasUnsavedChanges,
	undoChanges,
	saveChanges,
	recordDelays,
	toggleRecordDelays,
	optimizeRecording,
	toggleOptimizeRecording,
	isEmpty,
	deleteMacro,
	toggleFullscreen,
	isDelaySupported,
}) => {
	const recordComponent = (
		<IconButtonContainer
			disabled={!isFullscreen}
			onClick={() => {
				recordingToggleChange(!isRecording)
			}}
		>
			<FontAwesomeIcon color={'var(--color_label)'} icon={isRecording ? faSquare : faCircle} size={'sm'} />
			<IconButtonTooltip>
				{isFullscreen ? (isRecording ? 'Stop Recording' : 'Record Keystrokes') : 'Can only record when fullscreen'}
			</IconButtonTooltip>
		</IconButtonContainer>
	)
	return (
		<MacroEditControlsContainer>
			{hasUnsavedChanges ? (
				<>
					{!isRecording ? (
						<>
							<MacroControlGroupContainer>
								<IconButtonContainer disabled={!hasUnsavedChanges || isRecording} onClick={undoChanges}>
									<FontAwesomeIcon color={'var(--color_label)'} icon={faUndo} size={'sm'} />
									<IconButtonTooltip>Undo Changes</IconButtonTooltip>
								</IconButtonContainer>
								<IconButtonContainer disabled={!hasUnsavedChanges || isRecording} onClick={() => saveChanges()}>
									<FontAwesomeIcon color={'var(--color_label)'} icon={faSave} size={'sm'} />
									<IconButtonTooltip>Save Changes</IconButtonTooltip>
								</IconButtonContainer>
							</MacroControlGroupContainer>
							<MacroControlGroupDivider />
						</>
					) : null}
				</>
			) : !isEmpty ? (
				<>
					<MacroControlGroupContainer>
						<IconButtonContainer disabled={hasUnsavedChanges || isRecording} onClick={deleteMacro}>
							<FontAwesomeIcon color={'var(--color_label)'} icon={faTrash} size={'sm'} />
							<IconButtonTooltip>Delete Macro</IconButtonTooltip>
						</IconButtonContainer>
					</MacroControlGroupContainer>
					<MacroControlGroupDivider />
				</>
			) : (
				<></>
			)}
			<MacroControlGroupContainer>
				{recordComponent}
				<IconButtonContainer onClick={toggleFullscreen}>
					<FontAwesomeIcon color={'var(--color_label)'} icon={isFullscreen ? faCompress : faExpand} size={'sm'} />
					<IconButtonTooltip>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</IconButtonTooltip>
				</IconButtonContainer>
			</MacroControlGroupContainer>
			{!isRecording ? (
				<>
					<MacroControlGroupDivider />
					<MacroControlGroupContainer>
						<IconToggleContainer $selected={optimizeRecording} onClick={toggleOptimizeRecording}>
							<FontAwesomeIcon icon={faMagicWandSparkles} size={'sm'} />
							<IconButtonTooltip>
								{!optimizeRecording ? 'Use Smart Optimization' : 'Skip Smart Optimization'}
							</IconButtonTooltip>
						</IconToggleContainer>
						<IconToggleContainer $selected={recordDelays} disabled={!isDelaySupported} onClick={toggleRecordDelays}>
							<FontAwesomeIcon className={'fa-stack-1x'} icon={faStopwatch} size={'sm'} />
							<IconButtonTooltip>
								{!isDelaySupported
									? 'Upgrade firmware to use delays'
									: !recordDelays
										? 'Record Delays'
										: 'Skip Recording Delays'}
							</IconButtonTooltip>
						</IconToggleContainer>
					</MacroControlGroupContainer>
				</>
			) : null}
		</MacroEditControlsContainer>
	)
}
