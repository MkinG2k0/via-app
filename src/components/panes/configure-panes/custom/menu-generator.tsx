import type { VIAItem, VIAItemSlice, VIAMenu, VIASubmenu, VIASubmenuSlice } from '@the-via/reader'

import { faDisplay, faHeadphones, faLightbulb, faMicrochip } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { evalExpr } from '@the-via/pelpi'
import React, { useState } from 'react'
import { getSelectedDefinition } from 'src/store/definitionsSlice'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { getSelectedCustomMenuData, updateCustomMenuValue } from 'src/store/menusSlice'
import styled from 'styled-components'

import { component, title } from '../../../icons/lightbulb'
import { OverflowCell, SubmenuCell, SubmenuRow } from '../../grid'
import { CenterPane } from '../../pane'
import { VIACustomItem } from './custom-control'

type Category = {
	// TODO: type this any
	Menu: React.FC<any>
	label: string
}

const CustomPane = styled(CenterPane)`
	height: 100%;
	background: var(--color_dark_grey);
`

const Container = styled.div`
	display: flex;
	align-items: center;
	flex-direction: column;
	padding: 0 12px;
`

type Props = {
	viaMenu: VIAMenu
}

function isItem(elem: VIAItem | VIAItemSlice | VIAMenu | VIASubmenu | VIASubmenuSlice): boolean {
	return 'type' in elem
}

function isSlice(elem: VIAItem | VIAItemSlice | VIAMenu | VIASubmenu | VIASubmenuSlice): boolean {
	return !('label' in elem)
}

function categoryGenerator(props: any): Category[] {
	return props.viaMenu.content.flatMap((menu: any) => submenuGenerator(menu, props))
}

function itemGenerator(elem: TagWithId<VIAItem, VIAItemSlice>, props: any): any {
	if ('showIf' in elem && !evalExpr(elem.showIf as string, props.selectedCustomMenuData)) {
		return []
	}
	if ('label' in elem) {
		return { ...elem, key: elem._id }
	} else {
		return elem.content.flatMap((e) => itemGenerator(e as TagWithId<VIAItem, VIAItemSlice>, props))
	}
}

const MenuComponent = React.memo((props: any) => (
	<>
		{props.elem.content
			.flatMap((elem: any) => itemGenerator(elem, props))
			.map((itemProps: any) => (
				<VIACustomItem
					{...itemProps}
					updateValue={props.updateCustomMenuValue}
					value={props.selectedCustomMenuData[itemProps.content[0]]}
				/>
			))}
	</>
))

const MenuBuilder = (elem: any) => (props: any) => <MenuComponent {...props} elem={elem} key={elem._id} />

function submenuGenerator(elem: TagWithId<VIASubmenu, VIASubmenuSlice>, props: any): any {
	if ('showIf' in elem && !evalExpr(elem.showIf as string, props.selectedCustomMenuData)) {
		return []
	}
	if ('label' in elem) {
		return {
			label: elem.label,
			Menu: MenuBuilder(elem),
		}
	} else {
		return elem.content.flatMap((e) => submenuGenerator(e as TagWithId<VIASubmenu, VIASubmenuSlice>, props))
	}
}

export const Pane: React.FC<Props> = (props: any) => {
	const dispatch = useAppDispatch()
	const menus = categoryGenerator(props)
	const [selectedCategory, setSelectedCategory] = useState(menus[0] || { label: '', Menu: () => <div /> })
	const SelectedMenu = selectedCategory.Menu

	const selectedDefinition = useAppSelector(getSelectedDefinition)
	const selectedCustomMenuData = useAppSelector(getSelectedCustomMenuData)

	const childProps = {
		...props,
		selectedDefinition,
		selectedCustomMenuData,
		updateCustomMenuValue: (command: string, ...rest: number[]) => dispatch(updateCustomMenuValue(command, ...rest)),
	}

	if (!selectedDefinition || !selectedCustomMenuData) {
		return null
	}

	return (
		<>
			<SubmenuCell>
				<MenuContainer>
					{menus.map((menu) => (
						<SubmenuRow
							$selected={selectedCategory.label === menu.label}
							key={menu.label}
							onClick={() => setSelectedCategory(menu)}
						>
							{menu.label}
						</SubmenuRow>
					))}
				</MenuContainer>
			</SubmenuCell>
			<OverflowCell>
				<CustomPane>
					<Container>{SelectedMenu(childProps)}</Container>
				</CustomPane>
			</OverflowCell>
		</>
	)
}

export const Icon = component
export const Title = title

export type IdTag = { _id: string }
export type MapIntoArr<A, C> = A extends (infer B)[] ? (B & C)[] : any
export type IntersectKey<A, B extends keyof A, C> = {
	[K in B]: MapIntoArr<A[B], C>
} & A
export type TagWithId<A, B extends { content: any }> = (A & IdTag) | IntersectKey<B, 'content', IdTag>

export const MenuContainer = styled.div`
	padding: 15px 10px 20px 10px;
`

export type LabelProps = {
	_id?: string
	_renderIf?: (props: any) => boolean
	_type?: 'menu' | 'slice' | 'submenu'
	content: any
}

export function elemLabeler(elem: any, prefix: string = ''): any {
	if (isItem(elem)) {
		return {
			...elem,
			...(elem.showIf ? { _renderIf: (props: any) => evalExpr(elem.showIf, props) } : {}),
			_id: prefix,
			_type: 'item',
		}
	} else if (isSlice(elem)) {
		return {
			...elem,
			...(elem.showIf ? { _renderIf: (props: any) => evalExpr(elem.showIf, props) } : {}),
			_id: prefix,
			_type: 'slice',
			content: menuLabeler(elem.content, prefix),
		}
	} else {
		return {
			...elem,
			...(elem.showIf ? { _renderIf: (props: any) => evalExpr(elem.showIf, props) } : {}),
			_id: prefix,
			_type: 'menu',
			content: menuLabeler(elem.content, prefix),
		}
	}
}

export function menuLabeler(menus: any, prefix: string = ''): any {
	return menus.map((menu: any, idx: number) => elemLabeler(menu, `${prefix}-${idx}`))
}

const iconKeywords = [
	{
		icon: faLightbulb,
		keywords: ['light', 'rgb'],
	},
	{
		icon: faHeadphones,
		keywords: ['audio', 'sound'],
	},
	{
		icon: faDisplay,
		keywords: ['display', 'oled', 'lcd'],
	},
]

const getIconFromLabel = (menu: VIAMenu) => {
	const label = menu.label.toLowerCase()
	const defaultIcon = { icon: faMicrochip }
	return (iconKeywords.find((icon) => icon.keywords.some((keyword) => label.includes(keyword))) || defaultIcon).icon
}

export const makeCustomMenu = (menu: VIAMenu, idx: number) => {
	return {
		Title: menu.label,
		// Allow icon to be configurable
		Icon: () => <FontAwesomeIcon icon={getIconFromLabel(menu)} />,
		Pane: (props: any) => <Pane {...props} key={`${menu.label}-${idx}`} viaMenu={menu} />,
	}
}
export const makeCustomMenus = (menus: VIAMenu[]) => menus.map(makeCustomMenu)
