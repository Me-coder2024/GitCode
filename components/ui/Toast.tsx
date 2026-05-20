import hotToast from 'react-hot-toast';

/**
 * Pre-configured toast helpers styled for the GitCode design system.
 *
 * Usage:
 *   import toast from '@/components/ui/Toast';
 *   toast.success('Saved!');
 *   toast.error('Something went wrong');
 *   toast.loading('Processing…');
 */

const baseStyle = {
  borderRadius: '12px',
  padding: '12px 16px',
  fontSize: '14px',
  fontWeight: 500,
  fontFamily: '"Inter", sans-serif',
  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
};

const toast = {
  success(message: string) {
    return hotToast.success(message, {
      style: {
        ...baseStyle,
        background: '#E0F7F3',
        color: '#00BFA6',
        border: '1px solid #00BFA6',
      },
      iconTheme: {
        primary: '#00BFA6',
        secondary: '#FFFFFF',
      },
    });
  },

  error(message: string) {
    return hotToast.error(message, {
      style: {
        ...baseStyle,
        background: '#FDE8EA',
        color: '#E63946',
        border: '1px solid #E63946',
      },
      iconTheme: {
        primary: '#E63946',
        secondary: '#FFFFFF',
      },
    });
  },

  loading(message: string) {
    return hotToast.loading(message, {
      style: {
        ...baseStyle,
        background: '#FFFFFF',
        color: '#1A1A2E',
        border: '1px solid #E5E7EB',
      },
    });
  },

  dismiss(toastId?: string) {
    hotToast.dismiss(toastId);
  },
};

export default toast;
