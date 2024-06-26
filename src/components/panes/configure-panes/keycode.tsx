import { FC, useState, useEffect, useMemo } from 'react'
import { IKeycodeGroupItem } from 'src/utils/keycode-group'
import styled from 'styled-components'
import { Button } from '../../inputs/button'
import { KeycodeModal } from '../../inputs/custom-keycode-modal'
import { title, component } from '../../icons/keyboard'
import * as EncoderPane from './encoder'
import {
	keycodeInMaster,
	getByteForCode,
	getKeycodes,
	getOtherMenu,
	IKeycode,
	IKeycodeMenu,
	categoriesForKeycodeModule,
} from '../../../utils/key'
import { ErrorMessage } from '../../styled'
import {
	KeycodeType,
	getLightingDefinition,
	isVIADefinitionV3,
	isVIADefinitionV2,
	VIADefinitionV3,
} from '@the-via/reader'
import { OverflowCell, SubmenuOverflowCell, SubmenuRow } from '../grid'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { getBasicKeyToByte, getSelectedDefinition, getSelectedKeyDefinitions } from 'src/store/definitionsSlice'
import { getSelectedConnectedDevice } from 'src/store/devicesSlice'
import {
	getSelectedKey,
	getSelectedKeymap,
	updateKey as updateKeyAction,
	updateSelectedKey,
} from 'src/store/keymapSlice'
import { getMacroCount } from 'src/store/macrosSlice'
import {
	disableGlobalHotKeys,
	enableGlobalHotKeys,
	getDisableFastRemap,
	getDisableGroupKeys,
} from 'src/store/settingsSlice'
import { getNextKey } from 'src/utils/keyboard-rendering'
const KeycodeList = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, 64px);
	grid-auto-rows: 64px;
	justify-content: center;
	grid-gap: 10px;
`

const KeycodeGroup = styled.div`
	padding: 5px 0;
`

const MenuContainer = styled.div`
	padding: 15px 20px 20px 10px;
`

const Keycode = styled(Button)<{ disabled: boolean }>`
	width: 50px;
	height: 50px;
	line-height: 18px;
	border-radius: 64px;
	font-size: 14px;
	border: 4px solid var(--border_color_icon);
	background: var(--bg_control);
	color: var(--color_label-highlighted);
	margin: 0;
	box-shadow: none;
	position: relative;
	border-radius: 10px;
	&:hover {
		border-color: var(--color_accent);
		transform: translate3d(0, -2px, 0);
	}
	${(props: any) => props.disabled && 'cursor:not-allowed;filter:opacity(50%);'}
`

const KeycodeContent = styled.div`
	text-overflow: ellipsis;
	overflow: hidden;
`

const CustomKeycode = styled(Button)`
	width: 50px;
	height: 50px;
	line-height: 18px;
	border-radius: 10px;
	font-size: 14px;
	border: 4px solid var(--border_color_icon);
	background: var(--color_accent);
	border-color: var(--color_inside_accent);
	color: var(--color_inside_accent);
	margin: 0;
`

const KeycodeContainer = styled.div`
	padding: 12px;
	padding-bottom: 30px;
`

const KeycodeDesc = styled.div`
	position: fixed;
	bottom: 0;
	background: #d9d9d97a;
	box-sizing: border-box;
	transition: opacity 0.4s ease-out;
	height: 25px;
	width: 100%;
	line-height: 14px;
	padding: 5px;
	font-size: 14px;
	opacity: 1;
	pointer-events: none;
	&:empty {
		opacity: 0;
	}
`

const generateKeycodeCategories = (basicKeyToByte: Record<string, number>, numMacros: number = 16) =>
	getKeycodes(numMacros).concat(getOtherMenu(basicKeyToByte))

const maybeFilter = <M extends Function>(maybe: boolean, filter: M) => (maybe ? () => true : filter)

export const Pane: FC = () => {
	const selectedKey = useAppSelector(getSelectedKey)
	const dispatch = useAppDispatch()
	const keys = useAppSelector(getSelectedKeyDefinitions)
	useEffect(
		() => () => {
			dispatch(updateSelectedKey(null))
		},
		[],
	) // componentWillUnmount equiv

	if (selectedKey !== null && keys[selectedKey].ei !== undefined) {
		return <EncoderPane.Pane />
	}
	return <KeycodePane />
}

export const KeycodePane: FC = () => {
	const dispatch = useAppDispatch()
	const macros = useAppSelector((state: any) => state.macros)
	const selectedDefinition = useAppSelector(getSelectedDefinition)
	const selectedDevice = useAppSelector(getSelectedConnectedDevice)
	const matrixKeycodes = useAppSelector(getSelectedKeymap)
	const selectedKey = useAppSelector(getSelectedKey)
	const disableFastRemap = useAppSelector(getDisableFastRemap)
	const selectedKeyDefinitions = useAppSelector(getSelectedKeyDefinitions)
	const { basicKeyToByte } = useAppSelector(getBasicKeyToByte)
	const macroCount = useAppSelector(getMacroCount)
	const disableGroupKeys = useAppSelector(getDisableGroupKeys)

	const KeycodeCategories = useMemo(
		() => generateKeycodeCategories(basicKeyToByte, macroCount),
		[basicKeyToByte, macroCount],
	)

	// TODO: improve typing so we can get rid of this
	if (!selectedDefinition || !selectedDevice || !matrixKeycodes) {
		return null
	}

	const [selectedCategory, setSelectedCategory] = useState(KeycodeCategories[0].id)
	const [mouseOverDesc, setMouseOverDesc] = useState<string | null>(null)
	const [showKeyTextInputModal, setShowKeyTextInputModal] = useState(false)

	const getEnabledMenus = (): IKeycodeMenu[] => {
		if (isVIADefinitionV3(selectedDefinition)) {
			return getEnabledMenusV3(selectedDefinition)
		}
		const { lighting, customKeycodes } = selectedDefinition
		const { keycodes } = getLightingDefinition(lighting)
		return KeycodeCategories.filter(maybeFilter(keycodes === KeycodeType.QMK, ({ id }) => id !== 'qmk_lighting'))
			.filter(maybeFilter(keycodes === KeycodeType.WT, ({ id }) => id !== 'lighting'))
			.filter(maybeFilter(typeof customKeycodes !== 'undefined', ({ id }) => id !== 'custom'))
	}
	const getEnabledMenusV3 = (definition: VIADefinitionV3): IKeycodeMenu[] => {
		const keycodes = ['default' as const, ...(definition.keycodes || [])]
		const allowedKeycodes = keycodes.flatMap((keycodeName) => categoriesForKeycodeModule(keycodeName))

		if ((selectedDefinition.customKeycodes || []).length !== 0) {
			allowedKeycodes.push('custom')
		}
		return KeycodeCategories.filter((category) => allowedKeycodes.includes(category.id))
	}

	const renderMacroError = () => {
		return (
			<ErrorMessage>
				Your current firmware does not support macros. Install the latest firmware for your device.
			</ErrorMessage>
		)
	}

	const renderCategories = () => {
		return (
			<MenuContainer>
				{getEnabledMenus().map(({ id, label }) => (
					<SubmenuRow $selected={id === selectedCategory} key={id} onClick={() => setSelectedCategory(id)}>
						{label}
					</SubmenuRow>
				))}
			</MenuContainer>
		)
	}

	const renderKeyInputModal = () => {
		dispatch(disableGlobalHotKeys())

		return (
			<KeycodeModal
				defaultValue={selectedKey !== null ? matrixKeycodes[selectedKey] : undefined}
				onConfirm={(keycode) => {
					dispatch(enableGlobalHotKeys())
					updateKey(keycode)
					setShowKeyTextInputModal(false)
				}}
				onExit={() => {
					dispatch(enableGlobalHotKeys())
					setShowKeyTextInputModal(false)
				}}
			/>
		)
	}

	const updateKey = (value: number) => {
		if (selectedKey !== null) {
			dispatch(updateKeyAction(selectedKey, value))
			dispatch(
				updateSelectedKey(
					disableFastRemap || !selectedKeyDefinitions ? null : getNextKey(selectedKey, selectedKeyDefinitions),
				),
			)
		}
	}

	const handleClick = (code: string, i: number) => {
		if (code == 'text') {
			setShowKeyTextInputModal(true)
		} else {
			return keycodeInMaster(code, basicKeyToByte) && updateKey(getByteForCode(code, basicKeyToByte))
		}
	}

	const renderKeycode = (keycode: IKeycode, index: number) => {
		const { code, title, name } = keycode
		return (
			<Keycode
				disabled={!keycodeInMaster(code, basicKeyToByte) && code != 'text'}
				key={code}
				onClick={() => handleClick(code, index)}
				onMouseOut={() => setMouseOverDesc(null)}
				onMouseOver={() => setMouseOverDesc(title ? `${code}: ${title}` : code)}
			>
				<KeycodeContent>{name}</KeycodeContent>
			</Keycode>
		)
	}

	const renderCustomKeycode = () => {
		return (
			<CustomKeycode
				key={'customKeycode'}
				onClick={() => selectedKey !== null && handleClick('text', 0)}
				onMouseOut={() => setMouseOverDesc(null)}
				onMouseOver={() => setMouseOverDesc('Enter any QMK Keycode')}
			>
				Any
			</CustomKeycode>
		)
	}

	const renderSelectedCategory = (keycodes: IKeycode[], selectedCategory: string) => {
		const keycodeListItems = keycodes.map((keycode, i) => renderKeycode(keycode, i))
		switch (selectedCategory) {
			case 'macro': {
				return !macros.isFeatureSupported ? renderMacroError() : <KeycodeList>{keycodeListItems}</KeycodeList>
			}
			case 'special': {
				return <KeycodeList>{keycodeListItems.concat(renderCustomKeycode())}</KeycodeList>
			}
			case 'custom': {
				if (
					(!isVIADefinitionV2(selectedDefinition) && !isVIADefinitionV3(selectedDefinition)) ||
					!selectedDefinition.customKeycodes
				) {
					return null
				}
				return (
					<KeycodeList>
						{selectedDefinition.customKeycodes.map((keycode, idx) => {
							return renderKeycode(
								{
									...keycode,
									code: `CUSTOM(${idx})`,
								},
								idx,
							)
						})}
					</KeycodeList>
				)
			}
			default: {
				return <KeycodeList>{keycodeListItems}</KeycodeList>
			}
		}
	}

	const renderSelectedCategoryWithGroup = (keycodes: IKeycodeGroupItem[], selectedCategory: string) => {
		const keycodeListItems = keycodes.map(({ keycodes, name }, i) => {
			// renderKeycode(keycode, i)
			return (
				<div key={name}>
					<KeycodeGroup>{name}</KeycodeGroup>
					<KeycodeList>{keycodes.map((keycode, i) => renderKeycode(keycode, i))}</KeycodeList>
				</div>
			)
		})

		switch (selectedCategory) {
			case 'macro': {
				return !macros.isFeatureSupported ? renderMacroError() : <KeycodeList>{keycodeListItems}</KeycodeList>
			}
			case 'special': {
				return <KeycodeList>{keycodeListItems.concat(renderCustomKeycode())}</KeycodeList>
			}
			case 'custom': {
				if (
					(!isVIADefinitionV2(selectedDefinition) && !isVIADefinitionV3(selectedDefinition)) ||
					!selectedDefinition.customKeycodes
				) {
					return null
				}
				return (
					<KeycodeList>
						{selectedDefinition.customKeycodes.map((keycode, idx) => {
							return renderKeycode(
								{
									...keycode,
									code: `CUSTOM(${idx})`,
								},
								idx,
							)
						})}
					</KeycodeList>
				)
			}
			default: {
				return <div>{keycodeListItems}</div>
			}
		}
	}

	const findSelectedCategory = KeycodeCategories.find(({ id }) => id === selectedCategory)!
	const isAvailableGroup = !disableGroupKeys && Boolean(findSelectedCategory?.keycodeGroup)

	return (
		<>
			<SubmenuOverflowCell>{renderCategories()}</SubmenuOverflowCell>
			<OverflowCell>
				{isAvailableGroup ? (
					<KeycodeContainer>
						{renderSelectedCategoryWithGroup(findSelectedCategory.keycodeGroup!, selectedCategory)}
					</KeycodeContainer>
				) : (
					<KeycodeContainer>{renderSelectedCategory(findSelectedCategory.keycodes, selectedCategory)}</KeycodeContainer>
				)}
				<KeycodeDesc>{mouseOverDesc}</KeycodeDesc>
				{showKeyTextInputModal && renderKeyInputModal()}
			</OverflowCell>
		</>
	)
}

export const Icon = component
export const Title = title
