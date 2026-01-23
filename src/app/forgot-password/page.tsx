"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

const schema = yup.object({
  email: yup.string().email().required("Email is required"),
});

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: { email: string }) => {
    console.log("Email submitted:", data.email);
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success("Reset link sent! Check your email.");
        reset();
      } else {
        toast.error(result.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };
  
  

  return (
    <section className="singUp-area section-py-120">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-lg-8">
            <div className="singUp-wrap">
              <h2 className="title">Forgot Password</h2>
              <p>Enter your email address and we’ll send you a link to reset your password.</p>

              <form onSubmit={handleSubmit(onSubmit)} className="account__form">
                <div className="form-grp">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    {...register("email")}
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 border rounded"
                  />
                  <p className="form_error">{errors.email?.message}</p>
                </div>

                <button type="submit" className="btn btn-two arrow-btn mt-3">
                  Send Reset Link
                </button>
              </form>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
