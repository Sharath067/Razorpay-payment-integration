import './App.css';

function App() {
  const paymentHandler = async () => {
    const amount = 500;
    const currency = "INR";
    const receiptId = '1234567890';

    try {
      const response = await fetch("http://localhost:5000/orders", {
        method: "POST",
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify({
          amount,
          currency,
          receipt: receiptId
        })
      });

      const order = await response.json();
      console.log('Order', order);

      const options = {
        key: "rzp_test_svw5BdfZdvaWfl", //  Razorpay API key here
        amount,
        currency,
        name: "ASAR IT",
        description: "Test Transaction",
        image: "https://i.ibb.co/5Y3m33n/test.png",
        order_id: order.id,
        handler: async function (response) {
          const body = { ...response };

          try {
            const validateResponse = await fetch('http://localhost:5000/validate', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(body)
            });

            const jsonResponse = await validateResponse.json();
            console.log('jsonResponse', jsonResponse);
          } catch (error) {
            console.error('Validation Error:', error);
          }
        },
        prefill: {
          name: "ASAR IT",
          email: "asarit@gmail.com",
          contact: "9876543210",
        },
        notes: {
          address: "ASAR IT office",
        },
        theme: {
          color: "#3399cc"
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
      });

      rzp1.open();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='product'>
      <h1>Razorpay Payment Gateway</h1>
      <button className='button' onClick={paymentHandler}>Pay now</button>
    </div>
  );
}

export default App;
