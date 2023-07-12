import React, {useEffect, useRef, useState} from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  cancelPaymentMethodSetupIntent,
  createPaymentMethodSetupIntent
} from "../../helpers/firebase/firebase_functions/payment_method";
import PaymentMethodSetupForm from "./PaymentMethodSetupForm";
import Loader from "../../components/utility/loader";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)

function PaymentMethodSetup(props) {

  const { customer_id, billing_profile_id } = props
  const [setupIntent, setSetupIntent] = useState({});
  const [setupCompleted, setSetupCompleted] = useState(false);
  // const setupIntentRef = React.createRef();
  // setupIntentRef.current = setupIntent;

  const setupIntentRef = useRef();
  useEffect(() => {
    setupIntentRef.current = setupIntent;
  }, [setupIntent]);

  const {id, client_secret} = setupIntent

  const onSetupCompleted = () => {
    setSetupCompleted(true)
  }


  useEffect(() => {
    if (customer_id && billing_profile_id){
      createPaymentMethodSetupIntent({customer_id: customer_id, billing_profile_id: billing_profile_id}).then(async (result) => {
        console.log(`created SetupIntent ${result.id}`)
        setSetupIntent(result)
      }).catch(e=> console.error(e.message));
    }
    return () => {
      const id = setupIntentRef.current?.id
      if (!setupCompleted && id){
        cancelPaymentMethodSetupIntent({id}).then(async (result) => {
          console.log(`Setup Intent ${id} was successfully cancelled`)
        }).catch(e=> console.error(`Error Cancelling Setup Intent {e.message)}`))
      }
    }

  }, []);
  // TODO:  pass a onSuccess callback to PaymentMethodSetupForm    on unmount  cancel setup if setupSuccess is false

  return (
    <>
      {client_secret && stripePromise ? (
        <Elements stripe={stripePromise} options={{ clientSecret: client_secret }}>
          <PaymentMethodSetupForm onSetupCompleted={onSetupCompleted}/>
        </Elements>
      ): <Loader></Loader>}
    </>
  );
}

export default PaymentMethodSetup;