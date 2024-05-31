import { AnyAction, ThunkAction, configureStore } from '@reduxjs/toolkit'
import * as Sentry from '@sentry/react'

import definitionsReducer from './definitionsSlice'
import designReducer from './designSlice'
import devicesReducer from './devicesSlice'
import { errorsListenerMiddleware } from './errorsListener'
import errorsReducer from './errorsSlice'
import keymapReducer from './keymapSlice'
import lightingReducer from './lightingSlice'
import macrosReducer from './macrosSlice'
import menusReducer from './menusSlice'
import settingsReducer from './settingsSlice'

const sentryEnhancer = Sentry.createReduxEnhancer({})

export const store = configureStore({
	reducer: {
		settings: settingsReducer,
		macros: macrosReducer,
		devices: devicesReducer,
		keymap: keymapReducer,
		definitions: definitionsReducer,
		lighting: lightingReducer,
		menus: menusReducer,
		design: designReducer,
		errors: errorsReducer,
	},
	enhancers: [sentryEnhancer],
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(errorsListenerMiddleware.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>
