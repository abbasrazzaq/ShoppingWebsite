import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

describe('PrivateRoute', () => {
    it('renders children when token is present', () => {
        render(
            <MemoryRouter>
                <PrivateRoute token="valid-token">
                    <div>Protected Content</div>
                </PrivateRoute>
            </MemoryRouter >
        );

        expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('redirects to "/" when token is missing', () => {
        render(
            <MemoryRouter initialEntries={['/protected']}>
                <PrivateRoute token={null}>
                    <div>Protected Content</div>
                </PrivateRoute>
            </MemoryRouter>
        );

        expect(window.location.pathname).toBe('/');
    });
});