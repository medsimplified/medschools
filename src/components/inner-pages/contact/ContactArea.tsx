import ContactForm from "@/forms/ContactForm"

const ContactArea = () => {
   return (
      <section className="contact-area section-py-120">
         <div className="container">
            <div className="row justify-content-center">
               <div className="col-lg-8">
                  <div className="contact-form-wrap">
                     <h4 className="title">Student Enquiry</h4>
                     <p>Your email address will not be published. Required fields are marked *</p>
                     <ContactForm />
                     <p className="ajax-response mb-0"></p>
                  </div>
               </div>
            </div>
         </div>
      </section>
   )
}

export default ContactArea
