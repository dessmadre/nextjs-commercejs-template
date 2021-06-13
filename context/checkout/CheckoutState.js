import commerce from 'lib/commercejs';
import CheckoutContext from './checkoutContext';
import CheckoutReducer from './checkoutReducer';
import { useReducer } from 'react';
import {
  CAPTURE_ORDER_SUCCESS,
  GENERATE_CHECKOUT_TOKEN,
  GET_SHIPPING_OPTIONS,
  REMOVE_SHIPPING_OPTIONS,
  UPDATE_CHECKOUT_LIVE_OBJECT,
  ABORT_CHECKOUT,
} from '../types';

const CheckoutState = (props) => {
  /**
   * Declare initial state
   */

  const initialState = {
    checkout: {
      shippingOptions: [],
      checkoutToken: {},
      live: {},
    },
    orderReceipt: {},
  };

  const [state, dispatch] = useReducer(CheckoutReducer, initialState);

  /**
   * Checkout Actions
   */

  // use commerce.js checkout helper to return list of available shipping methods for the provided checkout token
  const getShippingOptionsForCheckout = (checkoutId, country = 'US') => {
    return commerce.checkout
      .getShippingOptions(checkoutId, { country })
      .then((shippingOptions) => {
        dispatch({
          type: GET_SHIPPING_OPTIONS,
          payload: shippingOptions,
        });
        return shippingOptions;
      })
      .catch((err) => {
        dispatch({
          type: REMOVE_SHIPPING_OPTIONS,
        });
        console.log('Error while fetching shipping options', err);
        throw new Error(err);
      });
  };

  // Use commerce.js checkout generateToken method to generate a checkout token object from a cart.id which can be used to initiate the process of capturing an order
  const generateCheckoutTokenFromCart = (cartId) => {
    return commerce.checkout
      .generateTokenFrom('cart', cartId)
      .then((res) => {
        dispatch({
          type: GENERATE_CHECKOUT_TOKEN,
          payload: res,
        });
        return res;
      })
      .catch((err) => {
        console.log('Error while generating checkout token object', err);
        dispatch({
          type: ABORT_CHECKOUT,
        });
      });
  };

  // Validate a shippinig method for the provided chekcout token, and applies it to the checkout
  const setShippingOptionInCheckout = (
    checkoutId,
    shippingOptionId,
    country,
    region
  ) => {
    return commerce.checkout
      .checkShippingOption(checkoutId, {
        shipping_option_id: shippingOptionId,
        country,
        region,
      })
      .then((res) => {
        if (res.valid) {
          dispatch({
            type: UPDATE_CHECKOUT_LIVE_OBJECT,
            payload: res.live,
          });
        }
      })
      .catch((err) => {
        console.log(
          'Error while attempting to update live object with selected shipping option',
          err
        );
        throw new Error(err);
      });
  };

  const setDiscountCodeInCheckout = (checkoutId, code) => {
    return commerce.checkout
      .checkDiscount(checkoutId, { code })
      .then((res) => {
        console.log(res.live);
        dispatch({
          type: UPDATE_CHECKOUT_LIVE_OBJECT,
          payload: res.live,
        });
      })
      .catch((err) => {
        console.log('Error while updating live object with discount code', err);
        throw new Error(err);
      });
  };

  // Captures an order and payment by providing the checkout id and order data derived from checkout
  const captureOrder = async (checkoutId, order) => {
    return commerce.checkout
      .capture(checkoutId, order)
      .then((res) => {
        dispatch({
          type: CAPTURE_ORDER_SUCCESS,
          payload: res,
        });
      })
      .catch((err) => {
        console.log('Error while capturing order', err);
        throw new Error(err);
      });
  };

  return (
    <CheckoutContext.Provider
      value={{
        checkout: state.checkout,
        checkoutToken: state.checkout.checkoutToken,
        shippingOptions: state.checkout.shippingOptions,
        live: state.checkout.live,
        orderReceipt: state.orderReceipt,
        getShippingOptionsForCheckout,
        generateCheckoutTokenFromCart,
        setShippingOptionInCheckout,
        setDiscountCodeInCheckout,
        captureOrder,
      }}
    >
      {props.children}
    </CheckoutContext.Provider>
  );
};

export default CheckoutState;
