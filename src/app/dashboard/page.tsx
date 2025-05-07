import Dashboard from '@/components/Dashboard';
import { ReduxProvider } from '@/store';

export default function DashboardPage() {
  return (
    <ReduxProvider>
      <Dashboard />
    </ReduxProvider>
  );
}
