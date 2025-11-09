// // src/pages/Contact.jsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useToast } from "../context/ToastContext"; // optional if you have ToastContext

// export default function Contact() {
//   const navigate = useNavigate();
//   let toast = null;
//   try {
//     // useToast is optional — if your app provides it it will show toasts
//     toast = useToast();
//   } catch (e) {
//     toast = null;
//   }

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     subject: "",
//     message: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [submitting, setSubmitting] = useState(false);
//   const [response, setResponse] = useState(null);

//   function handleChange(e) {
//     const { name, value } = e.target;
//     setForm((s) => ({ ...s, [name]: value }));
//     setErrors((s) => ({ ...s, [name]: "" }));
//   }

//   function validate(values) {
//     const err = {};
//     if (!values.name.trim()) err.name = "Please enter your name";
//     if (!values.email.trim()) err.email = "Please enter your email";
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) err.email = "Please enter a valid email";
//     if (!values.subject.trim()) err.subject = "Please enter a subject";
//     if (!values.message.trim()) err.message = "Please enter a message";
//     return err;
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setResponse(null);

//     const err = validate(form);
//     setErrors(err);
//     if (Object.keys(err).length) return;

//     setSubmitting(true);
//     // simulate network request
//     await new Promise((r) => setTimeout(r, 900));

//     // store submission in localStorage (demo)
//     const existing = JSON.parse(localStorage.getItem("cv_contact_submissions" || "[]")) || [];
//     const payload = {
//       id: Date.now(),
//       ...form,
//       createdAt: new Date().toISOString(),
//     };
//     existing.unshift(payload);
//     localStorage.setItem("cv_contact_submissions", JSON.stringify(existing));

//     setSubmitting(false);
//     setResponse({ ok: true, message: "Thanks — your message has been received. We'll get back to you shortly." });

//     // show toast if available
//     if (toast?.showToast) toast.showToast("Message sent", "success");

//     // reset form after a short delay (optional)
//     setForm({ name: "", email: "", subject: "", message: "" });

//     // optional: navigate to a "thank you" route or keep on same page
//     // navigate('/thank-you')  // uncomment if you want dedicated page
//   }

//   return (
//     <section className="container py-5">
//       <div className="row gx-4">
//         <div className="col-md-6">
//           <h2 className="h4 mb-3">Contact Us</h2>
//           <p className="text-muted">
//             Have a question about CraftVista, an order, or a custom request? Send us a message and we’ll reply within 24-48 hours.
//           </p>

//           <form onSubmit={handleSubmit} noValidate>
//             <div className="mb-3">
//               <label className="form-label">Name</label>
//               <input name="name" value={form.name} onChange={handleChange} className={`form-control ${errors.name ? "is-invalid" : ""}`} placeholder="Your full name" />
//               {errors.name && <div className="invalid-feedback">{errors.name}</div>}
//             </div>

//             <div className="mb-3">
//               <label className="form-label">Email</label>
//               <input name="email" value={form.email} onChange={handleChange} className={`form-control ${errors.email ? "is-invalid" : ""}`} placeholder="you@example.com" />
//               {errors.email && <div className="invalid-feedback">{errors.email}</div>}
//             </div>

//             <div className="mb-3">
//               <label className="form-label">Subject</label>
//               <input name="subject" value={form.subject} onChange={handleChange} className={`form-control ${errors.subject ? "is-invalid" : ""}`} placeholder="Short subject" />
//               {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
//             </div>

//             <div className="mb-3">
//               <label className="form-label">Message</label>
//               <textarea name="message" value={form.message} onChange={handleChange} className={`form-control ${errors.message ? "is-invalid" : ""}`} rows="6" placeholder="Write your message here..." />
//               {errors.message && <div className="invalid-feedback">{errors.message}</div>}
//             </div>

//             <div className="d-flex gap-2 align-items-center">
//               <button type="submit" className="btn btn-warning" disabled={submitting}>
//                 {submitting ? "Sending..." : "Send Message"}
//               </button>

//               <button type="button" className="btn btn-outline-secondary" onClick={() => { setForm({ name: "", email: "", subject: "", message: "" }); setErrors({}); setResponse(null); }}>
//                 Reset
//               </button>

//               {response && (
//                 <div className={`ms-3 ${response.ok ? "text-success" : "text-danger"}`}>
//                   {response.message}
//                 </div>
//               )}
//             </div>
//           </form>
//         </div>

//         <div className="col-md-6">
//           <h3 className="h6 mb-3">Reach us</h3>
//           <ul className="list-unstyled text-muted">
//             <li><strong>Customer support:</strong> support@craftvista.example</li>
//             <li><strong>Phone:</strong> +91 98765 43210</li>
//             <li><strong>Address:</strong> 123 Craft Street, Handicraft City</li>
//           </ul>

//           <div className="mt-4">
//             <h4 className="h6">Our response policy</h4>
//             <p className="small text-muted">
//               We aim to respond to all enquiries within 1–2 business days. For urgent matters, please call the phone number above.
//             </p>
//           </div>

//           <div className="mt-4">
//             <h4 className="h6">Recent inquiries (demo)</h4>
//             <RecentSubmissions />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// // small helper component to show recent saved submissions from localStorage
// function RecentSubmissions() {
//   const [list, setList] = useState(() => {
//     try {
//       return JSON.parse(localStorage.getItem("cv_contact_submissions") || "[]");
//     } catch {
//       return [];
//     }
//   });

//   if (!list || !list.length) return <div className="text-muted small">No recent inquiries (demo).</div>;

//   return (
//     <div>
//       {list.slice(0, 5).map((s) => (
//         <div key={s.id} className="mb-2 p-2 border rounded" style={{ background: "#fafafa" }}>
//           <div className="fw-bold">{s.subject}</div>
//           <div className="small text-muted">{s.name} — {new Date(s.createdAt).toLocaleString()}</div>
//           <div className="mt-1">{s.message.slice(0, 120)}{s.message.length > 120 ? "…" : ""}</div>
//         </div>
//       ))}
//       <div className="mt-2 small text-muted">Saved locally for demo.</div>
//     </div>
//   );
// }


import React from 'react';

export default function ContactUs() {
  return (
    <section className="contact-section py-5">
      <div className="container">
        <div className="row g-4 align-items-start">
          {/* Left: contact info */}
          <div className="col-12 col-md-5">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <h2 className="h4 mb-3">Contact Us</h2>
                <p className="mb-4">
                  Have a question or need help? Send us a message and we’ll get back within 24 hours.
                </p>

                <ul className="list-unstyled mb-0">
                  <li className="mb-2">
                    <strong>Phone:</strong><br />
                    <a href="tel:+911234567890">+91 12345 67890</a>
                  </li>
                  <li className="mb-2">
                    <strong>Email:</strong><br />
                    <a href="mailto:support@example.com">support@example.com</a>
                  </li>
                  <li className="mb-2">
                    <strong>Address:</strong><br />
                    123 Example Street, City, India
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="col-12 col-md-7">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <form className="row g-3" onSubmit={(e) => e.preventDefault()}>
                  <div className="col-12 col-sm-6">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input id="name" className="form-control" type="text" placeholder="Your name" />
                  </div>

                  <div className="col-12 col-sm-6">
                    <label htmlFor="phone" className="form-label">Phone</label>
                    <input id="phone" className="form-control" type="tel" placeholder="+91 12345 67890" />
                  </div>

                  <div className="col-12">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input id="email" className="form-control" type="email" placeholder="you@example.com" />
                  </div>

                  <div className="col-12">
                    <label htmlFor="message" className="form-label">Message</label>
                    <textarea id="message" className="form-control" rows="5" placeholder="How can we help?"></textarea>
                  </div>

                  <div className="col-12 d-grid">
                    <button type="submit" className="btn btn-primary btn-lg">Send Message</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
