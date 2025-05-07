import GoalsForm from '@/components/GoalsForm';
import { ReduxProvider } from '@/store';

export default function NewGoalPage() {
  return (
    <ReduxProvider>
      <GoalsForm />
    </ReduxProvider>
  );
}
