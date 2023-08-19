require("dotenv").config()
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json")
const express = require("express");
const app = express()
const cors = require("cors");
const bodyParser = require("body-parser");
const moment = require("moment");
const port = 5000

app.use(express.json())
app.use(bodyParser.json())

const [mobileMon, mobileYear, basicMon, basicYear, standardMon, standardYear, premiumMon, premiumYear] = 
['price_1NglQnSD0l6dioopgFa3INS8', 'price_1NglQnSD0l6dioopxV8wiTTG', 'price_1NgnpVSD0l6dioopBqABcAin', 'price_1NgnpVSD0l6dioopnsrfohL8', 'price_1NgnqYSD0l6dioopTnxibwAM', 'price_1NgnqYSD0l6dioopW0Sq8huc', 'price_1NgnrfSD0l6dioopE77vbpCG', 'price_1NgnrfSD0l6dioopxXsEeT2y'];

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://billing-subscription-2ef17-default-rtdb.firebaseio.com"
  });
  

app.use(
    cors({
        origin:"http://localhost:3000"
    })
)

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)


/*********** create subscription ************/

const stripeSession = async(plan) => {
    try {
        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [
                {
                    price: plan,
                    quantity: 1
                },
            ],
            success_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel"
        });
        return session;
    }catch (e){
        return e;
    }
};

app.post("/api/v1/create-subscription-checkout-session", async(req, res) => {
    const {plan, customerId} = req.body;
    let planId = null;
    if(plan == 100) planId = mobileMon;
    else if(plan == 1000) planId = mobileYear;
    else if(plan == 200) planId = basicMon;
    else if(plan == 2000) planId = basicYear;
    else if(plan == 500) planId = standardMon;
    else if(plan == 5000) planId = standardYear;
    else if(plan == 700) planId = premiumMon;
    else if(plan == 7000) planId = premiumYear;

    try{

        const session = await stripeSession(planId);
        const user = await admin.auth().getUser(customerId);

        await admin.database().ref("users").child(user.uid).update({
            subscription: {
                sessionId: session.id
            }
        });
        return res.json({session})

    }catch(error){
        res.send(error)
    }
})

/************ payment success ********/

app.post("/api/v1/payment-success", async (req, res) => {
    const { sessionId, firebaseId } = req.body;
  
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
  
      if (session.payment_status === 'paid') {
          const subscriptionId = session.subscription;
          try {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            const user = await admin.auth().getUser(firebaseId);
            const planId = subscription.plan.amount;
            let planType = "";
            console.log(subscription.plan.amount);
            if (subscription.plan.amount === 10000 || subscription.plan.amount === 100000) planType = "mobile";
            else if (subscription.plan.amount === 20000 || subscription.plan.amount === 2000000) planType = "basic";
            else if (subscription.plan.amount === 50000 || subscription.plan.amount === 500000) planType = "standard";
            else if (subscription.plan.amount === 70000 || subscription.plan.amount === 700000) planType = "premium";
            const startDate = moment.unix(subscription.current_period_start).format('YYYY-MM-DD');
            const endDate = moment.unix(subscription.current_period_end).format('YYYY-MM-DD');
            const durationInSeconds = subscription.current_period_end - subscription.current_period_start;
            const durationInDays = moment.duration(durationInSeconds, 'seconds').asDays();
            await admin.database().ref("users").child(user.uid).update({ 
                subscription: {
                  sessionId: null,
                  planId:planId,
                  planType: planType,
                  planStartDate: startDate,
                  planEndDate: endDate,
                  planDuration: durationInDays
                }});
  
              
            } catch (error) {
              console.error('Error retrieving subscription:', error);
            }
          return res.json({ message: "Payment successful" });
        } else {
          return res.json({ message: "Payment failed" });
        }
      } catch (error) {
        res.send(error);
      }
    });
  
         
app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
})