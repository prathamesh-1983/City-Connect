import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App.jsx';
import { useFacilities } from './hooks/useFacilities.js';

const facility = {
  type: 'Feature',
  geometry: { type: 'Point', coordinates: [73.03, 19.03] },
  properties: {
    id: 'node/1',
    name: 'Central Hospital',
    category: 'Hospitals',
    locality: 'Vashi',
    source: 'OpenStreetMap',
  },
};

vi.mock('./hooks/useFacilities.js', () => ({
  useFacilities: vi.fn(),
}));

vi.mock('./components/map/CityMap.jsx', () => ({
  default: () => <div aria-label="Map of Navi Mumbai facilities">Map test surface</div>,
}));

describe('CityConnect app', () => {
  beforeEach(() => {
    localStorage.clear();
    useFacilities.mockReturnValue({
      status: 'ready',
      facilities: [facility],
      metadata: { extractedAt: '2026-10-30T00:00:00.000Z' },
      rejected: 0,
      error: '',
    });
  });

  it('renders the dashboard and changes to the interactive map section', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /City intelligence, at a glance/i })).toBeInTheDocument();
    expect(screen.getByText('Central Hospital')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Explore Map/ }));
    expect(screen.getByRole('heading', { name: /Find your next point of interest/i })).toBeInTheDocument();
    expect(screen.getByText('Search results')).toBeInTheDocument();
  });

  it('supports saving a facility and opening it from the saved locations view', () => {
    render(<App />);
    fireEvent.click(screen.getAllByRole('button', { name: 'Save location' })[0]);
    fireEvent.click(screen.getByRole('button', { name: /Saved Locations/ }));
    expect(screen.getByText('Central Hospital')).toBeInTheDocument();
    expect(screen.getByText(/stored in this browser only/i)).toBeInTheDocument();
  });

  it('focuses search with the Ctrl+K shortcut', () => {
    render(<App />);
    const input = screen.getByRole('textbox', { name: 'Search facilities' });
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(input).toHaveFocus();
  });

  it('clearly labels synthetic locations instead of presenting them as verified OSM records', () => {
    useFacilities.mockReturnValue({
      status: 'ready',
      facilities: [{
        ...facility,
        properties: { ...facility.properties, id: 'demo/1', name: 'DEMO ONLY · Health point', source: 'Synthetic development sample' },
      }],
      metadata: { status: 'development_sample' },
      rejected: 0,
      error: '',
    });

    render(<App />);

    expect(screen.getByRole('alert')).toHaveTextContent(/synthetic locations are not real or verified facilities/i);
    expect(screen.getByText('SYNTHETIC DEVELOPMENT SAMPLE')).toBeInTheDocument();
    expect(screen.getByText('Synthetic preview only — not verified')).toBeInTheDocument();
    expect(screen.queryByText('Verified OSM records loaded')).not.toBeInTheDocument();
    expect(screen.getByText(/These synthetic locations only demonstrate the interface/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Analytics' }));
    expect(screen.getByText(/Metrics below describe the synthetic development fixture only/i)).toBeInTheDocument();
    expect(screen.getByText(/Locality and category counts describe only synthetic entries/i)).toBeInTheDocument();
  });
});
