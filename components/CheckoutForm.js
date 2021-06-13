import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });
    if (!error) {
      const { id } = paymentMethod;

      try {
        const { data } = await axios.post('/api/charge', { id, amount: 1099 });
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <form className='w-72 my-0 mx-auto' onSubmit={handleSubmit}>
      <CardElement />
      <button
        className='bg-green-300 px-3 py-1 mt-5 hover:bg-green-400'
        type='submit'
        disabled={!stripe}
      >
        Pay
      </button>
    </form>
  );
}
