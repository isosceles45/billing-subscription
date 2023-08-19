import React from 'react'
import { useEffect, useState } from 'react';
import Navbar from '../../components/navbar/Navbar'
import firebase from '../../firebase/firebaseConfig';

const data = [
  {
    id: 'plan1',
    name: 'Mobile',
    description: 'Access on mobile devices only',
    monthlyPrice: 100,
    yearlyPrice: 1000,
    videoQuality: 'SD',
    resolution: '480p',
    devices: 'Mobile devices',
},
{
    id: 'plan2',
    name: 'Basic',
    description: 'Access to basic features',
    monthlyPrice: 200,
    yearlyPrice: 2000,
    videoQuality: 'SD',
    resolution: '480p',
    devices: 'Mobile, tablet, computer',
},
{
    id: 'plan3',
    name: 'Standard',
    description: 'Access to standard features',
    monthlyPrice: 500,
    yearlyPrice: 5000,
    videoQuality: 'HD',
    resolution: '1080p',
    devices: 'Mobile, tablet, computer, TV',
},
{
    id: 'plan4',
    name: 'Premium',
    description: 'Access to premium features',
    monthlyPrice: 700,
    yearlyPrice: 7000,
    videoQuality: 'Ultra HD',
    resolution: '4K',
    devices: 'Mobile, tablet, computer, TV',
},
];

const Home = () => {

  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [planType, setPlanType] = useState("");
  const [selectedPlanType, setSelectedPlanType] = useState("monthly");

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        setUserName(user.displayName);
        const userRef = firebase.database().ref("users/" + user.uid);
        userRef.on("value", (snapshot) => {
          const user = snapshot.val();
          if (user && user.subscription) {
            setPlanType(user.subscription.planType || "");
          }
          console.log(planType);
        });
      } else {
        setUserId("");
        setUserName("");
      }
    });
  }, [userId]);

  const checkout = (plan) => {
    fetch("http://localhost:5000/api/v1/create-subscription-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({ plan: plan, customerId: userId }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        console.log(res);
        return res.json().then((json) => Promise.reject(json));
      })
      .then(({ session }) => {
        window.location = session.url;
      })
      .catch((e) => {
        console.log(e.error);
      });
  };

  const handlePlanTypeChange = (type) => {
    setSelectedPlanType(type);
  };


  return (
    <div>
      <Navbar/>
      <div className="plans-page py-8">
            <div className="plans-container container mx-auto bg-white rounded p-4">
            <div className="flex justify-center mb-6">
            <button
              className={`bg-transparent px-4 py-2 rounded font-bold mr-4 ${
                selectedPlanType === "monthly" && "bg-blue-500 text-white"
              }`}
              onClick={() => handlePlanTypeChange("monthly")}
            >
              Monthly
            </button>
            <button
              className={`bg-transparent px-4 py-2 rounded font-bold ${
                selectedPlanType === "yearly" && "bg-blue-500 text-white"
              }`}
              onClick={() => handlePlanTypeChange("yearly")}
            >
              Yearly
            </button>
          </div>
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-5 z-50 place-items-center w-9/12 mx-auto
        mt-20"
        >
          {data.map((item, idx) => (
            <div
              key={idx}
              className={`bg-white px-6 py-6 rounded-xl text-[#4f7cff] w-full mx-auto grid 
              place-items-center ${
                planType === item.name.toLowerCase() && userId !== "" &&
                "border-[8px] rounded-sm border-green-400"
              }`}
            >
              <div className="text-4xl text-slate-700 text-center py-4 font-bold">
                {item.name}
              </div>
              <p className="lg:text-sm text-xs text-center px-6 text-slate-500">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Dignissimos quaerat dolore sit eum quas non mollitia
                reprehenderit repudiandae debitis tenetur?
              </p>
              <div className="text-4xl text-center font-bold py-4">
                ₹{selectedPlanType === "monthly"
                    ? `${item.monthlyPrice}`
                    : `${item.yearlyPrice}`}
              </div>
              <div className="mx-auto flex justify-center items-center my-3">
                {userId !== "" && planType === item.name.toLowerCase() ? (
                  <button className="bg-green-600 text-white rounded-md text-base uppercase w-auto py-2 px-4 font-bold">
                    Subscribed
                  </button>
                ) : (
                  <button
                    onClick={() => checkout(
                      selectedPlanType === "monthly"
                        ? Number(item.monthlyPrice)
                        : Number(item.yearlyPrice)
                    )}
                    className="bg-[#3d5fc4] text-white rounded-md text-base uppercase w-24 py-2 font-bold"
                  >
                    Start
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
            </div>
        </div>
    </div>
  )
}

export default Home
