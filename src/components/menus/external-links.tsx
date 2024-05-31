import { faDiscord, faGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'
import { VIALogo } from '../icons/via'
import { CategoryMenuTooltip } from '../inputs/tooltip'
import { CategoryIconContainer } from '../panes/grid'

const ExternalLinkContainer = styled.span`
	position: absolute;
	right: 1em;
	display: flex;
	gap: 1em;
`

export const ExternalLinks = () => (
	<ExternalLinkContainer>
		<a href={'https://caniusevia.com/'} rel={'noreferrer'} target={'_blank'}>
			<CategoryIconContainer>
				<VIALogo fill={'currentColor'} height={'25px'} />
				<CategoryMenuTooltip>Firmware + Docs</CategoryMenuTooltip>
			</CategoryIconContainer>
		</a>
		<a href={'https://discord.gg/NStTR5YaPB'} rel={'noreferrer'} target={'_blank'}>
			<CategoryIconContainer>
				<FontAwesomeIcon icon={faDiscord} size={'xl'} />
				<CategoryMenuTooltip>Discord</CategoryMenuTooltip>
			</CategoryIconContainer>
		</a>
		<a href={'https://github.com/the-via/app'} rel={'noreferrer'} target={'_blank'}>
			<CategoryIconContainer>
				<FontAwesomeIcon icon={faGithub} size={'xl'} />
				<CategoryMenuTooltip>Github</CategoryMenuTooltip>
			</CategoryIconContainer>
		</a>
	</ExternalLinkContainer>
)
