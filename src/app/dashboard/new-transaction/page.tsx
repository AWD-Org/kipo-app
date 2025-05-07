import TxForm from '@/components/TxForm';
import { ReduxProvider } from '@/store';

export default function NewTransactionPage() {
  return (
    <ReduxProvider>
      <TxForm />
    </ReduxProvider>
  );
}
