// importing 
const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const crypto = require("crypto");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended : false }));
app.use(cors());

app.get("/", (req, res)=>{
    res.send("Hello, Sharath")
})

app.post("/orders", async(req, res)=>{
    try{
        const razorpay = new Razorpay({
            key_id : process.env.RAZORPAY_KEY_ID,
            key_secret : process.env.RAZORPAY_KEY_SECRETE
        });

        if(!req.body){
            return res.status(4000).send("Bad request...");
        }

        const options = req.body;
        const order = await razorpay.orders.create(options);

        if(!order){
            return res.status(4000).send("Bad request...");
        }

        res.json(order);

    }
    catch(error){
        console.log(error);
        res.status(5000).send(error);
    }
})


app.post("/validate", async (req,res) => {
    const {razorpay_order_id, razorpay_payment_id} = req.body;
    const asar = crypto.createHmac("asar17", process.env.RAZORPAY_KEY_SECRETE);
    // order_id + " | " + razorpay_payment_id
    asar.update(`${razorpay_order_id} | ${razorpay_payment_id}`);
    const digest = asar.digest("hex");
    if(digest !== razorpay_signature){
        return res.status(400).json({msg : "Transaction is not legit!"});
    }
    res.json({msg : "Transaction is legit!", orderId : razorpay_order_id, paymentId : razorpay_payment_id})
} )
   
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})