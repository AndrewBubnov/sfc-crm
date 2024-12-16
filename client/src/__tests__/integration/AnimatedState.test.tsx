import { render, screen, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AnimatedState } from '@/modules/table/components/AnimatedState.tsx';

describe('AnimatedState', () => {
	it('should display the initial `text`', () => {
		render(<AnimatedState text="initial" />);
		expect(screen.getByText('initial')).toBeInTheDocument();
	});

	it('should animate the `text` change on not changed `id`', () => {
		const { rerender } = render(<AnimatedState text="initial" />);

		rerender(<AnimatedState text="updated" />);

		expect(screen.getByText('initial')).toBeInTheDocument();
		expect(screen.getByText('updated')).toBeInTheDocument();

		const animatedDiv = screen.getByText('updated').closest('div');
		expect(animatedDiv).toHaveClass('transition-transform');
	});

	it('should hide the previous state after animation end', () => {
		const { rerender } = render(<AnimatedState text="initial" />);

		rerender(<AnimatedState text="updated" />);

		const previousText = screen.getByText('initial');
		const newText = screen.getByText('updated');

		expect(previousText).toBeInTheDocument();
		expect(newText).toBeInTheDocument();

		const animatedDiv = screen.getByText('updated').closest('div');
		act(() => {
			animatedDiv?.dispatchEvent(new Event('transitionend'));
		});

		expect(previousText).toHaveClass('opacity-0');
		expect(newText).toBeInTheDocument();
	});

	it('should apply the correct class for `error` state', () => {
		render(<AnimatedState text="error" errorClassName="text-red-400" isError />);

		const textElement = screen.getByText('error');
		expect(textElement).toHaveClass('text-red-400');
	});
});
