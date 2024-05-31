import { Provider } from 'react-redux'

import Routes from '../Routes'
import { store } from '../store'

export default () => (
	<Provider store={store}>
		<Routes />
	</Provider>
)
