import AlertList from '@/components/AlertList';
import { ReduxProvider } from '@/store';

export default function AlertsPage() {
  return (
    <ReduxProvider>
      <AlertList />
    </ReduxProvider>
  );
}
