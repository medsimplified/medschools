

interface DataType {
   id: number;
   title: string;
   desc: string;
   class_name?: string;
}[];

const faq_data: DataType[] = [
   {
      id: 1,
      title: "Master High-Stakes Exams with Comprehensive,Practice-Oriented Resources",
      desc: "At MedSchool Simplified, we understand the high-stakes nature of exams like FMGE, NEET PG, and USMLE, as well as the importance of staying updated in an ever-evolving medical field. Our comprehensive resources—ranging from premium lecture notes to curated MCQs and clinical case discussions—reflect our commitment to thorough, user-friendly study support. Each element is designed to bridge the gap between theory and practice, enabling learners to apply their knowledge in real-world settings.",
   },
   {
      id: 2,
      title: "Structured Learning That Connects Concepts to Clinical Practice",
      class_name: "collapsed",
      desc: "We believe that learning should be both accessible and engaging. That’s why our platform offers a clear structure, where content is neatly mapped out by chapters and specialties. This helps students navigate seamlessly from one lesson to the next, ensuring they never lose sight of how each piece of information fits into the bigger clinical picture. The website also fosters a sense of community: by registering and logging in, you can interact with peers, share insights, and discuss challenging topics—all while tracking your progress and identifying areas that may need further review.",
   },
   {
      id: 3,
      title: "Stay Confident and Current with Evolving Medical Knowledge",
      class_name: "collapsed",
      desc: "Beyond just preparing for exams, MedSchool Simplified aims to bolster confidence and competence in all facets of medical education. Whether you’re brushing up on your basics, delving into specialized fields, or practicing for board examinations, our resources evolve with you. With ongoing updates, we stay committed to delivering cutting-edge information, so you remain at the forefront of current medical knowledge.",
   },
    {
      id: 4,
      title: "Join Our Community to Transform the Way You Learn Medicine",
      class_name: "collapsed",
      desc: "We invite you to join us at www.medschoolsimplified.in and explore our premium lectures, interactive MCQs, and immersive case discussions. Your support, through subscriptions and sharing our links with colleagues, propels us to continually refine and expand our offerings. Together, let’s make medical education more streamlined, interactive, and rewarding for aspiring healthcare professionals worldwide.",
   },
];

const FaqOne = () => {
   return (
      <>
         <div className="section__title mb-15">
            <span className="sub-title">More About us</span>
            {/* <h2 className="title bold">Why Our Schools are the Right Fit for Your Child?</h2> */}
         </div>
         {/* <p>Groove’s intuitive shared inbox makes it easy for team members to organize, prioritize and.In this episod.</p> */}
         <div className="faq__wrap faq__wrap-two">
            <div className="accordion" id="accordionExample">
               {faq_data.map((item) => (
                  <div key={item.id} className="accordion-item">
                     <h2 className="accordion-header">
                        <button className={`accordion-button ${item.class_name}`} type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${item.id}`} aria-expanded="true" aria-controls={`collapse${item.id}`}>
                           {item.title}
                        </button>
                     </h2>
                     <div id={`collapse${item.id}`} className={`accordion-collapse collapse ${item.id === 1 ? "show" : ""}`} data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                           <p>{item.desc}</p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </>
   )
}

export default FaqOne
