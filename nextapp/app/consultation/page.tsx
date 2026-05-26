import React, { useEffect } from "react";

export default function ConsultationPage() {
  useEffect(() => {
    const form = document.getElementById("bookingForm") as HTMLFormElement | null;
    if (!form) return;
    const handleSubmit = async (e: Event) => {
      e.preventDefault();
      const formData = new FormData(form);
      // Collect fields used in the wizard
      const payload: any = {
        service: formData.get("bookingService") as string,
        name: formData.get("bookingName") as string,
        phone: formData.get("bookingPhone") as string,
        date: formData.get("bookingDate") as string,
        // time slot handled by data-slot attribute on selected button
        time: (document.querySelector("#slotGrid .selected") as HTMLElement | null)?.getAttribute("data-slot") || null,
        type: (form.querySelector('input[name="type"]:checked') as HTMLInputElement | null)?.value || null,
        // Files are handled separately; omitted for brevity
      };
      try {
        const res = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await res.json();
        if (result.success) {
          alert("Booking submitted successfully!");
        } else {
          alert(`Error: ${result.error}`);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to submit booking.");
      }
    };
    form.addEventListener("submit", handleSubmit as any);
    return () => {
      form.removeEventListener("submit", handleSubmit as any);
    };
  }, []);

  return (
    <section className="section consultation-section" id="consultation">
      <div className="container section-heading reveal">
        <p className="eyebrow">Consultation Booking</p>
        <h2>A polished appointment flow for online, offline and video consultations.</h2>
      </div>
      <div className="container booking-shell reveal">
        <aside className="booking-progress" id="bookingProgress">
          <span className="active" data-step="0">1 Service</span>
          <span data-step="1">2 Date</span>
          <span data-step="2">3 Time</span>
          <span data-step="3">4 Documents</span>
          <span data-step="4">5 Confirm</span>
        </aside>
        <form className="booking-form" id="bookingForm">
          <div className="wizard-panel active" data-panel="0">
            <label>
              Service
              <select id="bookingService">
                <option>GST Consultation</option>
                <option>Income Tax Filing</option>
                <option>Legal Documentation</option>
                <option>Litigation Review</option>
                <option>Notary Service</option>
                <option>Bookkeeping Services</option>
              </select>
            </label>
            <label>
              Full name
              <input id="bookingName" type="text" placeholder="Client name" required />
            </label>
            <label>
              Mobile number
              <input id="bookingPhone" type="tel" placeholder="+91 98765 43210" required />
            </label>
          </div>
          <div className="wizard-panel" data-panel="1">
            <label>
              Date
              <input id="bookingDate" type="date" />
            </label>
            <div className="mini-calendar" id="miniCalendar" aria-label="Quick date picker"></div>
          </div>
          <div className="wizard-panel" data-panel="2">
            <span className="field-title">Time Slot</span>
            <div className="slot-grid" id="slotGrid">
              <button type="button" data-slot="10:00 AM">10:00 AM</button>
              <button type="button" className="selected" data-slot="12:30 PM">12:30 PM</button>
              <button type="button" data-slot="3:00 PM">3:00 PM</button>
              <button type="button" data-slot="5:30 PM">5:30 PM</button>
            </div>
            <span className="field-title">Consultation Type</span>
            <div className="type-toggle">
              <label><input type="radio" name="type" value="Online" defaultChecked /> Online</label>
              <label><input type="radio" name="type" value="Offline" /> Offline</label>
              <label><input type="radio" name="type" value="Video meeting" /> Video meeting</label>
            </div>
          </div>
          <div className="wizard-panel" data-panel="3">
            <label>
              Upload Documents
              <input id="bookingFiles" type="file" multiple />
            </label>
            <ul className="file-list" id="bookingFileList"></ul>
          </div>
          <div className="wizard-panel" data-panel="4">
            <h3>Appointment Summary</h3>
            <div className="summary-panel" id="bookingSummary"></div>
          </div>
          <div className="wizard-actions">
            <button className="btn btn-secondary" id="bookingBack" type="button">Back</button>
            <button className="btn btn-primary" id="bookingNext" type="button">Next</button>
            <button className="btn btn-primary" type="submit" style={{ display: "none" }} id="bookingSubmit">Submit</button>
          </div>
        </form>
      </div>
    </section>
  );
}
