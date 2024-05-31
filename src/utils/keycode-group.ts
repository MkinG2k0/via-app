import { IKeycode } from 'src/utils/key'

export interface IKeycodeGroupItem {
	name: string
	keycodes: IKeycode[]
}

export const keycodeGroup: IKeycodeGroupItem[] = [
	{
		name: 'Special',
		keycodes: [
			{ name: '', code: 'KC_NO', title: 'Nothing' },
			{ name: '▽', code: 'KC_TRNS', title: 'Pass-through' },
		],
	},
	{
		name: 'Alphabet',
		keycodes: [
			{ name: 'A', code: 'KC_A', keys: 'a' },
			{ name: 'B', code: 'KC_B', keys: 'b' },
			{ name: 'C', code: 'KC_C', keys: 'c' },
			{ name: 'D', code: 'KC_D', keys: 'd' },
			{ name: 'E', code: 'KC_E', keys: 'e' },
			{ name: 'F', code: 'KC_F', keys: 'f' },
			{ name: 'G', code: 'KC_G', keys: 'g' },
			{ name: 'H', code: 'KC_H', keys: 'h' },
			{ name: 'I', code: 'KC_I', keys: 'i' },
			{ name: 'J', code: 'KC_J', keys: 'j' },
			{ name: 'K', code: 'KC_K', keys: 'k' },
			{ name: 'L', code: 'KC_L', keys: 'l' },
			{ name: 'M', code: 'KC_M', keys: 'm' },
			{ name: 'N', code: 'KC_N', keys: 'n' },
			{ name: 'O', code: 'KC_O', keys: 'o' },
			{ name: 'P', code: 'KC_P', keys: 'p' },
			{ name: 'Q', code: 'KC_Q', keys: 'q' },
			{ name: 'R', code: 'KC_R', keys: 'r' },
			{ name: 'S', code: 'KC_S', keys: 's' },
			{ name: 'T', code: 'KC_T', keys: 't' },
			{ name: 'U', code: 'KC_U', keys: 'u' },
			{ name: 'V', code: 'KC_V', keys: 'v' },
			{ name: 'W', code: 'KC_W', keys: 'w' },
			{ name: 'X', code: 'KC_X', keys: 'x' },
			{ name: 'Y', code: 'KC_Y', keys: 'y' },
			{ name: 'Z', code: 'KC_Z', keys: 'z' },
		],
	},
	{
		name: 'Number',
		keycodes: [
			{ name: '!\n1', code: 'KC_1', keys: '1' },
			{ name: '@\n2', code: 'KC_2', keys: '2' },
			{ name: '#\n3', code: 'KC_3', keys: '3' },
			{ name: '$\n4', code: 'KC_4', keys: '4' },
			{ name: '%\n5', code: 'KC_5', keys: '5' },
			{ name: '^\n6', code: 'KC_6', keys: '6' },
			{ name: '&\n7', code: 'KC_7', keys: '7' },
			{ name: '*\n8', code: 'KC_8', keys: '8' },
			{ name: '(\n9', code: 'KC_9', keys: '9' },
			{ name: ')\n0', code: 'KC_0', keys: '0' },
		],
	},
	{
		name: 'F-row',
		keycodes: [
			{ name: 'F1', code: 'KC_F1' },
			{ name: 'F2', code: 'KC_F2' },
			{ name: 'F3', code: 'KC_F3' },
			{ name: 'F4', code: 'KC_F4' },
			{ name: 'F5', code: 'KC_F5' },
			{ name: 'F6', code: 'KC_F6' },
			{ name: 'F7', code: 'KC_F7' },
			{ name: 'F8', code: 'KC_F8' },
			{ name: 'F9', code: 'KC_F9' },
			{ name: 'F10', code: 'KC_F10' },
			{ name: 'F11', code: 'KC_F11' },
			{ name: 'F12', code: 'KC_F12' },
		],
	},
	{
		name: 'Numpad',
		keycodes: [
			{ name: '1', code: 'KC_P1', keys: 'num_1', title: 'Numpad 1' },
			{ name: '2', code: 'KC_P2', keys: 'num_2', title: 'Numpad 2' },
			{ name: '3', code: 'KC_P3', keys: 'num_3', title: 'Numpad 3' },
			{ name: '4', code: 'KC_P4', keys: 'num_4', title: 'Numpad 4' },
			{ name: '5', code: 'KC_P5', keys: 'num_5', title: 'Numpad 5' },
			{ name: '6', code: 'KC_P6', keys: 'num_6', title: 'Numpad 6' },
			{ name: '7', code: 'KC_P7', keys: 'num_7', title: 'Numpad 7' },
			{ name: '8', code: 'KC_P8', keys: 'num_8', title: 'Numpad 8' },
			{ name: '9', code: 'KC_P9', keys: 'num_9', title: 'Numpad 9' },
			{
				name: '0',
				code: 'KC_P0',
				width: 2000,
				keys: 'num_0',
				title: 'Numpad 0',
			},
		],
	},
	{
		name: 'Symbol',
		keycodes: [
			{ name: '_\n-', code: 'KC_MINS', keys: '-' },
			{ name: '+\n=', code: 'KC_EQL', keys: '=' },
			{ name: '~\n`', code: 'KC_GRV', keys: '`' },
			{ name: '{\n[', code: 'KC_LBRC', keys: '[' },
			{ name: '}\n]', code: 'KC_RBRC', keys: ']' },
			{ name: '|\n\\', code: 'KC_BSLS', keys: '\\', width: 1500 },
			{ name: ':\n;', code: 'KC_SCLN', keys: ';' },
			{ name: '"\n\'', code: 'KC_QUOT', keys: "'" },
			{ name: '<\n,', code: 'KC_COMM', keys: ',' },
			{ name: '>\n.', code: 'KC_DOT', keys: '.' },
			{ name: '?\n/', code: 'KC_SLSH', keys: '/' },
			{ name: '=', code: 'KC_PEQL' },
			{ name: ',', code: 'KC_PCMM' },
			{ name: '÷', code: 'KC_PSLS', keys: 'num_divide', title: 'Numpad ÷' },
			{ name: '×', code: 'KC_PAST', keys: 'num_multiply', title: 'Numpad ×' },
			{ name: '-', code: 'KC_PMNS', keys: 'num_subtract', title: 'Numpad -' },
			{ name: '+', code: 'KC_PPLS', keys: 'num_add', title: 'Numpad +' },
			{ name: '.', code: 'KC_PDOT', keys: 'num_decimal', title: 'Numpad .' },
		],
	},
	{
		name: 'Arrow',
		keycodes: [
			{ name: 'Menu', code: 'KC_APP', width: 1250, shortName: 'RApp' },
			{ name: 'Left', code: 'KC_LEFT', keys: 'left', shortName: '←' },
			{ name: 'Down', code: 'KC_DOWN', keys: 'down', shortName: '↓' },
			{ name: 'Up', code: 'KC_UP', keys: 'up', shortName: '↑' },
			{ name: 'Right', code: 'KC_RGHT', keys: 'right', shortName: '→' },
		],
	},
	{
		name: 'Other keys',
		keycodes: [
			{ name: 'Esc', code: 'KC_ESC', keys: 'esc' },

			{ name: 'Print Screen', code: 'KC_PSCR', shortName: 'Print' },
			{ name: 'Scroll Lock', code: 'KC_SLCK', shortName: 'Scroll' },
			{ name: 'Pause', code: 'KC_PAUS' },
			{ name: 'Tab', code: 'KC_TAB', keys: 'tab', width: 1500 },
			{
				name: 'Backspace',
				code: 'KC_BSPC',
				keys: 'backspace',
				width: 2000,
				shortName: 'Bksp',
			},
			{ name: 'Insert', code: 'KC_INS', keys: 'insert', shortName: 'Ins' },
			{ name: 'Del', code: 'KC_DEL', keys: 'delete' },
			{ name: 'Home', code: 'KC_HOME', keys: 'home' },
			{ name: 'End', code: 'KC_END', keys: 'end' },
			{ name: 'Page Up', code: 'KC_PGUP', keys: 'pageup', shortName: 'PgUp' },
			{
				name: 'Page Down',
				code: 'KC_PGDN',
				keys: 'pagedown',
				shortName: 'PgDn',
			},
			{ name: 'Num\nLock', code: 'KC_NLCK', keys: 'num', shortName: 'N.Lck' },
			{ name: 'Caps Lock', code: 'KC_CAPS', keys: 'caps_lock', width: 1750 },
			{ name: 'Enter', code: 'KC_ENT', keys: 'enter', width: 2250 },

			{
				name: 'Num\nEnter',
				code: 'KC_PENT',
				shortName: 'N.Ent',
				title: 'Numpad Enter',
			},
			{
				name: 'Left Shift',
				code: 'KC_LSFT',
				keys: 'shift',
				width: 2250,
				shortName: 'LShft',
			},
			{ name: 'Right Shift', code: 'KC_RSFT', width: 2750, shortName: 'RShft' },
			{ name: 'Left Ctrl', code: 'KC_LCTL', keys: 'ctrl', width: 1250 },
			{ name: 'Right Ctrl', code: 'KC_RCTL', width: 1250, shortName: 'RCtl' },
			{
				name: 'Left Win',
				code: 'KC_LGUI',
				keys: 'cmd',
				width: 1250,
				shortName: 'LWin',
			},
			{ name: 'Right Win', code: 'KC_RGUI', width: 1250, shortName: 'RWin' },
			{
				name: 'Left Alt',
				code: 'KC_LALT',
				keys: 'alt',
				width: 1250,
				shortName: 'LAlt',
			},
			{ name: 'Right Alt', code: 'KC_RALT', width: 1250, shortName: 'RAlt' },
			{ name: 'Space', code: 'KC_SPC', keys: 'space', width: 6250 },
		],
	},
]

export const allKeyCode = keycodeGroup.flatMap((keycodeGroup) => keycodeGroup.keycodes)