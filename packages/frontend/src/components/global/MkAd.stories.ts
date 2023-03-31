/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable import/no-default-export */
import { Meta } from '@storybook/vue3';
const meta = {
	title: 'components/global/MkAd',
	component: MkAd,
} satisfies Meta<typeof MkAd>;
export default meta;
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { expect } from '@storybook/jest';
import { userEvent, within } from '@storybook/testing-library';
import { StoryObj } from '@storybook/vue3';
import { i18n } from '@/i18n';
import MkAd from './MkAd.vue';
const common = {
	render(args) {
		return {
			components: {
				MkAd,
			},
			setup() {
				return {
					args,
				};
			},
			computed: {
				props() {
					return {
						...args,
					};
				},
			},
			template: '<MkAd v-bind="props" />',
		};
	},
	async play({ canvasElement, args }) {
		const canvas = within(canvasElement);
		const a = canvas.getByRole<HTMLAnchorElement>('link');
		await expect(a.href).toMatch(/^https?:\/\/.*#test$/);
		const img = within(a).getByRole('img');
		await expect(img).toBeInTheDocument();
		let buttons = canvas.getAllByRole<HTMLButtonElement>('button');
		await expect(buttons).toHaveLength(1);
		const i = buttons[0];
		await expect(i).toBeInTheDocument();
		await userEvent.click(i);
		await expect(a).not.toBeInTheDocument();
		await expect(i).not.toBeInTheDocument();
		buttons = canvas.getAllByRole<HTMLButtonElement>('button');
		await expect(buttons).toHaveLength(args._hasReduce ? 2 : 1);
		const reduce = args._hasReduce ? buttons[0] : null;
		const back = buttons[args._hasReduce ? 1 : 0];
		if (reduce) {
			await expect(reduce).toBeInTheDocument();
			await expect(reduce.textContent).toBe(
				i18n.ts._ad.reduceFrequencyOfThisAd
			);
		}
		await expect(back).toBeInTheDocument();
		await expect(back.textContent).toBe(i18n.ts._ad.back);
		await userEvent.click(back);
		if (reduce) {
			await expect(reduce).not.toBeInTheDocument();
		}
		await expect(back).not.toBeInTheDocument();
		const aAgain = canvas.getByRole<HTMLAnchorElement>('link');
		await expect(aAgain).toBeInTheDocument();
		const imgAgain = within(aAgain).getByRole('img');
		await expect(imgAgain).toBeInTheDocument();
	},
	args: {
		prefer: [],
		specify: {
			id: 'someadid',
			radio: 1,
			url: '#test',
		},
		_hasReduce: true,
	},
	parameters: {
		layout: 'centered',
	},
} satisfies StoryObj<typeof MkAd>;
export const Square = {
	...common,
	args: {
		...common.args,
		specify: {
			...common.args.specify,
			place: 'square',
			imageUrl:
				'https://github.com/misskey-dev/misskey/blob/master/packages/frontend/assets/about-icon.png?raw=true',
		},
	},
};
export const Horizontal = {
	...common,
	args: {
		...common.args,
		specify: {
			...common.args.specify,
			place: 'horizontal',
			imageUrl:
				'https://github.com/misskey-dev/misskey/blob/master/packages/frontend/assets/fedi.jpg?raw=true',
		},
	},
};
export const HorizontalBig = {
	...common,
	args: {
		...common.args,
		specify: {
			...common.args.specify,
			place: 'horizontal-big',
			imageUrl:
				'https://github.com/misskey-dev/misskey/blob/master/packages/frontend/assets/fedi.jpg?raw=true',
		},
	},
};
export const ZeroRatio = {
	...Square,
	args: {
		...Square.args,
		specify: {
			...Square.args.specify,
			ratio: 0,
		},
		_hasReduce: false,
	},
};
