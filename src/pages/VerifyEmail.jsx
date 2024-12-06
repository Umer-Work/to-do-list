import { useEffect, useState } from "react";
import supabaseClient from "../services/supabaseClient";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [message, setMessage] = useState("Verifying...");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get("token");
      const email = params.get("email");

      if (token && email) {
        const { error } = await supabaseClient.auth.verifyOtp({
          email,
          token,
          type: "signup",
        });
        if (error) setMessage("Verification failed.", error);
        else setMessage("Email verified successfully!");

        const { data: user, error: userError } = await supabaseClient
          .from("users")
          .select("id")
          .eq("email", email)
          .single();

        console.log({ aaaaaa: user });

        if (userError) {
          console.error("Error fetching user ID:", userError);
          return;
        }

        await supabaseClient
          .from("users")
          .update({ is_verified: true })
          .eq("id", user.id);

        navigate("/dashboard");
      } else {
        setMessage("Invalid verification link.");
      }
    };

    verify();
  }, [location, navigate]);

  return <h2>{message}</h2>;
};

export default VerifyEmail;
