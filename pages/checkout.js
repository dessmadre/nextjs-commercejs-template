import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import { STRIPE_PUBLIC_TEST_KEY } from 'lib/constants';
import CheckoutForm from 'components/CheckoutForm';

const stripePromise = loadStripe(STRIPE_PUBLIC_TEST_KEY);

export default function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
