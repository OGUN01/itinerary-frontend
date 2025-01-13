import React from 'react';
import { render, screen, waitFor, within, act } from '@testing-library/react';
import { PreferencesForm } from '../PreferencesForm';
import { useTripStore } from '@/store/trip';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the trip store
jest.mock('@/store/trip', () => ({
  useTripStore: jest.fn()
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

describe('PreferencesForm', () => {
  const mockStore = {
    setPreferences: jest.fn(),
    preferences: {
      budget: 0,
      activities: [],
      meal_preferences: [],
      preferred_places: [],
      transport_preferences: [],
      accommodation_type: 'hotel'
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
    (useTripStore as unknown as jest.Mock).mockReturnValue(mockStore);
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PreferencesForm />);

    // Fill in budget
    const budgetInput = screen.getByLabelText(/budget/i);
    await act(async () => {
      await user.type(budgetInput, '1000');
    });

    // Select activities
    const activitiesSection = screen.getByRole('group', { name: /activities/i });
    const museumsCheckbox = within(activitiesSection).getByLabelText(/museums/i);
    await act(async () => {
      await user.click(museumsCheckbox);
    });

    // Select transport preferences
    const transportSection = screen.getByRole('group', { name: /transport preferences/i });
    const walkingCheckbox = within(transportSection).getByLabelText(/walking/i);
    await act(async () => {
      await user.click(walkingCheckbox);
    });

    // Select accommodation type
    const accommodationSection = screen.getByRole('group', { name: /accommodation type/i });
    const select = within(accommodationSection).getByRole('combobox');
    await act(async () => {
      await user.selectOptions(select, 'hotel');
    });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /generate itinerary/i });
    await act(async () => {
      await user.click(submitButton);
    });

    await waitFor(() => {
      expect(mockStore.setPreferences).toHaveBeenCalledWith({
        budget: 1000,
        activities: ['Museums'],
        meal_preferences: [],
        preferred_places: [],
        transport_preferences: ['Walking'],
        accommodation_type: 'hotel'
      });
    });
  });

  it('shows validation errors for required fields', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PreferencesForm />);

    // Submit form without filling required fields
    const submitButton = screen.getByRole('button', { name: /generate itinerary/i });
    await act(async () => {
      await user.click(submitButton);
    });

    // Check for validation messages
    await waitFor(() => {
      expect(screen.getByText(/budget must be at least \$100/i)).toBeInTheDocument();
      expect(screen.getByText(/select at least one activity/i)).toBeInTheDocument();
      expect(screen.getByText(/select at least one transport preference/i)).toBeInTheDocument();
    });
  });

  it('validates budget range', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PreferencesForm />);

    const budgetInput = screen.getByLabelText(/budget/i);
    await act(async () => {
      await user.type(budgetInput, '50');
    });

    const submitButton = screen.getByRole('button', { name: /generate itinerary/i });
    await act(async () => {
      await user.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/budget must be at least \$100/i)).toBeInTheDocument();
    });
  });

  it('validates maximum selections', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PreferencesForm />);

    // Try to select more than 5 activities
    const activities = [
      'Museums',
      'Shopping',
      'Nature',
      'Adventure',
      'Relaxation',
      'Cultural'
    ];

    const activitiesSection = screen.getByRole('group', { name: /activities/i });

    for (const activity of activities) {
      const checkbox = within(activitiesSection).getByLabelText(new RegExp(activity, 'i'));
      await act(async () => {
        await user.click(checkbox);
      });
    }

    await waitFor(() => {
      expect(screen.getByText(/maximum 5 activities allowed/i)).toBeInTheDocument();
    });
  });
}); 