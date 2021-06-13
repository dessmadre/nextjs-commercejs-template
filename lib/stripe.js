import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// const stripe = new Stripe(
//   'sk_test_51Hm4dKDbeKtY9x5nJPQsw0U9gbnvl2KdUdDs3q7Zx9vEWBAfrSUYYAYop9OII0wMvosbeDviiYLkPY1x6clB9t3100m8N7i7y0  '
// );

export default stripe;
