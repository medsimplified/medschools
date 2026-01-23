"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import BtnArrow from "@/svg/BtnArrow";
import Link from "next/link";
import { signIn } from "next-auth/react";

interface FormData {
  role: 'student' | 'instructor' | 'course_uploader';
  email: string;
  password: string;
}

// ✅ Validation schema
const schema = yup.object({
  role: yup.string().oneOf(['student', 'instructor', 'course_uploader']).required("Role is required"),
  email: yup.string().required("Email is required").email("Invalid email"),
  password: yup.string().required("Password is required"),
});

const LoginForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { role: 'student' },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
        role: data.role,
      });
      if (res?.ok) {
        toast.success("Login successful!", { position: "top-center" });
        reset();
        // Redirect based on role
        let redirectPath = "/courses";
        if (data.role === "student") redirectPath = "/student-dashboard";
        else if (data.role === "instructor") redirectPath = "/instructor-dashboard";
        else if (data.role === "course_uploader") redirectPath = "/instructor-uploader-dashboard";
        setTimeout(() => router.push(redirectPath), 1500);
      } else {
        toast.error(res?.error || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login Error:", err);
      toast.error("Something went wrong");
    }
  };

  // Watch role for conditional fields
  const role = watch('role');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="account__form">
      <div className="form-grp">
        <label htmlFor="role">Role</label>
        <select
          id="role"
          {...register("role")}
          style={{
            width: '100%',
            padding: '14px 20px',
            fontSize: '16px',
            color: 'var(--tg-heading-color)',
            border: '1px solid #E1E1E1',
            background: 'var(--tg-common-color-white)',
            borderRadius: '5px',
            lineHeight: '1',
            transition: 'all 0.3s ease-out 0s',
            cursor: 'pointer'
          }}
        >
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
          <option value="course_uploader">Course Uploader</option>
        </select>
        <p className="form_error">{errors.role?.message}</p>
      </div>


      <div className="form-grp">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          {...register("email")}
          type="email"
          placeholder="Enter your email"
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
        <p className="form_error">{errors.email?.message}</p>
      </div>

      <div className="form-grp">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          {...register("password")}
          type="password"
          placeholder="Enter your password"
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
        <p className="form_error">{errors.password?.message}</p>
      </div>

      <div className="account__check mb-3">
        <div className="account__check-remember">
          <input type="checkbox" className="form-check-input" id="remember" />
          <label htmlFor="remember" className="form-check-label">
            Remember me
          </label>
        </div>
        <div className="account__check-forgot">
          <Link href="/forgot-password">Forgot Password?</Link>
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-two arrow-btn"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Signing in..." : <>Sign In <BtnArrow /></>}
      </button>
    </form>
  );
};

export default LoginForm;
