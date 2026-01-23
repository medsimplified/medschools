"use client"
import { toast } from 'react-toastify';
import BtnArrow from "@/svg/BtnArrow"
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import emailjs from '@emailjs/browser';
import { useRef, useState } from 'react';

interface FormData {
   user_name: string;
   user_email: string;
   phone: string;
   message: string;
}

const schema = yup
   .object({
      user_name: yup.string().required().label("Name"),
      user_email: yup.string().required().email().label("Email"),
      phone: yup.string().required().label("Phone"),
      message: yup.string().required().label("Message"),
   })
   .required();

const ContactForm = () => {
   const [form, setForm] = useState({
      user_name: "",
      user_email: "",
      phone: "",
      message: "",
   });
   const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

   const { register, handleSubmit, reset, formState: { errors }, } = useForm<FormData>({ resolver: yupResolver(schema), });

   const formRef = useRef<HTMLFormElement>(null);

   const sendEmail = (data: FormData) => {
      if (formRef.current) {
         setStatus("loading");
         emailjs.sendForm('themegenix', 'template_hdr7ic6', formRef.current, 'QOBCxT0bzNKEs-CwW')
            .then((result) => {
               const notify = () => toast('Message sent successfully', { position: 'top-center' });
               notify();
               setStatus("success");
               setForm({ user_name: "", user_email: "", phone: "", message: "" });
               console.log(result.text);
            }, (error) => {
               setStatus("error");
               console.log(error.text);
            });
      } else {
         console.error("Form reference is null");
      }
   };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm({ ...form, [e.target.name]: e.target.value });
   };

   const handleFormSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus("loading");
      try {
         const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
         });
         if (res.ok) {
            setStatus("success");
            setForm({ user_name: "", user_email: "", phone: "", message: "" });
         } else {
            setStatus("error");
         }
      } catch {
         setStatus("error");
      }
   };

   return (
      <form ref={formRef} onSubmit={handleSubmit(sendEmail)} id="contact-form">
         <div className="form-grp">
            <textarea {...register("message")} placeholder="Comment" required></textarea>
            <p className="form_error">{errors.message?.message}</p>
         </div>
         <div className="row">
            <div className="col-md-4">
               <div className="form-grp">
                  <input {...register("user_name")} type="text" placeholder="Name *" required />
                  <p className="form_error">{errors.user_name?.message}</p>
               </div>
            </div>
            <div className="col-md-4">
               <div className="form-grp">
                  <input {...register("user_email")} type="email" placeholder="E-mail *" required />
                  <p className="form_error">{errors.user_email?.message}</p>
               </div>
            </div>
            <div className="col-md-4">
               <div className="form-grp">
                  <input
                     {...register("phone")}
                     type="tel"
                     placeholder="Phone Number with Country Code *"
                     required
                  />
                  <p className="form_error">{errors.phone?.message}</p>
               </div>
            </div>
         </div>
         <button type="submit" className="btn btn-two arrow-btn" disabled={status === "loading"}>
            {status === "loading" ? "Sending..." : "Submit Now"} <BtnArrow />
         </button>
         {status === "success" && (
            <div className="alert alert-success mt-3">Message sent successfully!</div>
         )}
         {status === "error" && (
            <div className="alert alert-danger mt-3">Failed to send message. Please try again.</div>
         )}
      </form>
   )
}

export default ContactForm
