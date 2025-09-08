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
});