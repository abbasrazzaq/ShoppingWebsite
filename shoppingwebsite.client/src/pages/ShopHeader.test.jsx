import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ShopHeader from './ShopHeader.jsx';

describe('ShopHeader', () => {
    it('hides shop on shop page', () => {
        render(
            <MemoryRouter initialEntries={['/shop']}>
                <ShopHeader
                    cartItems={() => { } }
                    setToken={() => { }}
                />
            </MemoryRouter>
        );

        expect(screen.queryByText('Browse Shop')).not.toBeInTheDocument();
    });

    it('hides cart on cart page', () => {
        render(
            <MemoryRouter initialEntries={['/cart']}>
                <ShopHeader
                    cartItems={{ 1: 2 }}
                    setToken={() => { }}
                />
            </MemoryRouter>
        );

        expect(screen.queryByText('Cart')).not.toBeInTheDocument();
    });

    it('shows the correct cart items count', () => {
        render(
            <MemoryRouter initialEntries={['/shop']}>
                <ShopHeader
                    cartItems={{ 1: 2, 2: 6 }}
                    setToken={() => { }}
                />
            </MemoryRouter>
        );

        expect(
            screen.getByText((content, element) => {
                return element.textContent === 'Cart (8 items)';
            })
        ).toBeInTheDocument();
    });

    it('clears token on logout', async () => {
        const mockSetToken = vi.fn();

        render(
            <MemoryRouter initialEntries={['/shop']}>
                <ShopHeader
                    cartItems={{}}
                    setToken={mockSetToken}
                />
            </MemoryRouter>
        );

        const logoutLink = screen.getByText('Logout');
        await userEvent.click(logoutLink);

        expect(mockSetToken).toHaveBeenCalledTimes(1);
        expect(mockSetToken).toHaveBeenCalledWith(null);
        expect(window.location.pathname).toBe('/');
        
        
    });
});