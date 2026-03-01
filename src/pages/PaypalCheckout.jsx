import { useLocation, useNavigate } from "react-router-dom";
import { PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { convertVNDtoUSD } from "../utils/currency";

const PaypalCheckout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { backendUrl, token, setCartItems } = useContext(ShopContext);

  const orderData = state?.orderData;



  if (!orderData) return <p>No order found</p>;

  return (
    <div className="paypal-checkout-container">
      <h2>Pay with PayPal</h2>

      <PayPalButtons
        createOrder={(data, actions) => {
          const usdAmount = convertVNDtoUSD(orderData.amount);

          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: usdAmount.toFixed(2),
                  currency_code: 'USD'
                },
                description: `Order Total: ${orderData.amount.toLocaleString()} VND (${usdAmount.toFixed(2)} USD)`
              }
            ]
          });
        }}
        onApprove={async (data, actions) => {
          const details = await actions.order.capture();
          console.log(details);

          try {
            const response = await axios.post(backendUrl + "/api/order/paypal", {
              orderData,
              paypalInfo: details
            }, { headers: { token } });

            if (response.data.success) {
              setCartItems({});
              toast.success("Payment successful!");
              navigate("/orders");
            } else {
              toast.error("Payment failed");
            }

          } catch (error) {
            toast.error(error.message);
          }
        }}
        onError={(err) => {
          console.log(err);
          toast.error("PayPal error");
        }}
      />
    </div>
  );
};

export default PaypalCheckout;
