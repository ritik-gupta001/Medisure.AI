// Frontend Test Configuration
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../src/App';

// Mock fetch for API calls
global.fetch = jest.fn();

describe('MediSense AI Frontend Tests', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders main heading', () => {
    render(<App />);
    const heading = screen.getByText('MediSense AI');
    expect(heading).toBeInTheDocument();
  });

  test('renders tagline', () => {
    render(<App />);
    const tagline = screen.getByText('Your Personal Medical Report Assistant');
    expect(tagline).toBeInTheDocument();
  });

  test('demo mode button works', async () => {
    // Mock successful demo response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        session_id: 'demo-123',
        status: 'success',
        patient_summary: 'Test patient summary',
        doctor_summary: 'Test doctor summary',
        is_demo: true
      })
    });

    render(<App />);
    const demoButton = screen.getByText('Try Demo Mode');
    
    fireEvent.click(demoButton);

    await waitFor(() => {
      expect(screen.getByText('Analysis Results')).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/demo'),
      expect.any(Object)
    );
  });

  test('file upload area is visible', () => {
    render(<App />);
    const uploadArea = screen.getByText(/Drop your medical report here/);
    expect(uploadArea).toBeInTheDocument();
  });

  test('loading state displays correctly', async () => {
    // Mock delayed response
    fetch.mockImplementationOnce(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({
            session_id: 'test-123',
            status: 'success',
            patient_summary: 'Test summary',
            doctor_summary: 'Test doctor summary'
          })
        }), 100)
      )
    );

    render(<App />);
    const demoButton = screen.getByText('Try Demo Mode');
    
    fireEvent.click(demoButton);

    // Should show loading state
    expect(screen.getByText('Analyzing your medical report...')).toBeInTheDocument();

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('Analysis Results')).toBeInTheDocument();
    });
  });

  test('error handling works', async () => {
    // Mock error response
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<App />);
    const demoButton = screen.getByText('Try Demo Mode');
    
    fireEvent.click(demoButton);

    await waitFor(() => {
      expect(screen.getByText(/Error occurred/)).toBeInTheDocument();
    });
  });

  test('chat functionality', async () => {
    // First set up a demo analysis
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        session_id: 'demo-123',
        status: 'success',
        patient_summary: 'Test summary',
        doctor_summary: 'Test doctor summary',
        is_demo: true
      })
    });

    render(<App />);
    const demoButton = screen.getByText('Try Demo Mode');
    fireEvent.click(demoButton);

    await waitFor(() => {
      expect(screen.getByText('Analysis Results')).toBeInTheDocument();
    });

    // Mock chat response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        response: 'This is a test chat response',
        session_id: 'demo-123'
      })
    });

    // Find chat input and submit
    const chatInput = screen.getByPlaceholderText(/Ask about your report/);
    const chatButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(chatInput, { target: { value: 'What does this mean?' } });
    fireEvent.click(chatButton);

    await waitFor(() => {
      expect(screen.getByText('This is a test chat response')).toBeInTheDocument();
    });
  });

  test('file drag and drop', () => {
    render(<App />);
    const dropZone = screen.getByTestId('drop-zone');

    // Simulate drag enter
    fireEvent.dragEnter(dropZone);
    expect(dropZone).toHaveClass('border-teal-400');

    // Simulate drag leave
    fireEvent.dragLeave(dropZone);
    expect(dropZone).not.toHaveClass('border-teal-400');
  });

  test('responsive design elements', () => {
    render(<App />);
    
    // Check for responsive classes
    const container = screen.getByTestId('main-container');
    expect(container).toHaveClass('min-h-screen');
    
    const header = screen.getByTestId('header');
    expect(header).toHaveClass('text-center');
  });

  test('accessibility features', () => {
    render(<App />);
    
    // Check for proper ARIA labels
    const uploadButton = screen.getByRole('button', { name: /upload/i });
    expect(uploadButton).toBeInTheDocument();
    
    const demoButton = screen.getByRole('button', { name: /demo/i });
    expect(demoButton).toBeInTheDocument();
  });

  test('medical icons are displayed', () => {
    render(<App />);
    
    // Check for medical-themed icons (they should be in the DOM)
    const iconElements = document.querySelectorAll('svg');
    expect(iconElements.length).toBeGreaterThan(0);
  });
});