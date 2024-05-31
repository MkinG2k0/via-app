import styled from 'styled-components'

const LoadingText = styled.div`
	font-size: 30px;
	color: var(--color_label-highlighted);
`

enum LoadingLabel {
	Loading = 'Loading...',
	Searching = 'Searching for devices...',
}

type Props = {
	isSearching: boolean
}

export default function (props: Props) {
	return (
		<LoadingText data-tid={'loading-message'}>
			{props.isSearching ? LoadingLabel.Searching : LoadingLabel.Loading}
		</LoadingText>
	)
}
