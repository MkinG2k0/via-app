import React from 'react'
import { AccentButton } from './accent-button'
type Props = {
	onLoad: (files: File[]) => void
	multiple?: boolean
	inputRef?: React.MutableRefObject<HTMLInputElement | undefined>
	children: string
}

export function AccentUploadButton(props: Props) {
	const input = props.inputRef || React.useRef<HTMLInputElement>()
	function onChange(e: any) {
		props.onLoad(e.target.files as File[])
		;(input.current as any).value = null
	}
	return (
		<AccentButton onClick={() => input.current && input.current.click()}>
			{props.children}
			<input
				accept={'application/json'}
				multiple={props.multiple}
				onChange={onChange}
				ref={input as any}
				style={{ display: 'none' }}
				type={'file'}
			/>
		</AccentButton>
	)
}
