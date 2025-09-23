import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login.jsx'


// Create a mock function for navigation
const mockNavigate = vi.fn();

// Mock useNavigate from react-router-dom
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('Login', () => {
    it('unsuccessful login displays error message', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                success: false
            })
        });

        render(
            <MemoryRouter>
                <Login setToken={() => { }} />
            </MemoryRouter>
        );

        // Fill in username and password
        await userEvent.type(screen.getByLabelText(/USERNAME/i), 'user');
        await userEvent.type(screen.getByLabelText(/PASSWORD/i), 'pass');

        // Click login
        await userEvent.click(screen.getByRole('button', { name: /login/i }))

        // Assert error message is displayed
        await waitFor(() => {
            expect(screen.getByText(/Login failed: invalid credentials/i)).toBeInTheDocument();
        });
    });

    it('successful login calls setToken and navigates to /shop', async () => {
        const mockSetToken = vi.fn();
        const fakeToken = 'fake-token';
        // Mock fetch to return a successful response
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                success: true,
                accessToken: fakeToken
            }),
        });

        render(
            <MemoryRouter>
                <Login setToken={mockSetToken} />
            </MemoryRouter>
        );

        // Fill in username and password
        await userEvent.type(screen.getByLabelText(/USERNAME/i), 'user');
        await userEvent.type(screen.getByLabelText(/PASSWORD/i), 'pass');

        // Click login
        await userEvent.click(screen.getByRole('button', { name: /login/i }));

        // Assert setToken and navigation were called
        await waitFor(() => {
            expect(mockSetToken).toHaveBeenCalledWith(fakeToken);
            expect(mockNavigate).toHaveBeenCalledWith('/shop');
        });
    });
})