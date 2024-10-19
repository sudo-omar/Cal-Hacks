const TemplateAppoitment = (params) => {
    return (
        <div>
            <h1>Doctor Appointment Transcript</h1>

            <div class="section">
                <h2>Patient Information</h2>
                <p><strong>Full Name:</strong> [Patient's Full Name]</p>
                <p><strong>Date of Birth:</strong> [Patient's Date of Birth]</p>
                <p><strong>Medical Record Number:</strong> [If applicable]</p>
                <p><strong>Appointment Date:</strong> [Date of Appointment]</p>
                <p><strong>Appointment Time:</strong> [Time of Appointment]</p>
            </div>

            <div class="section">
                <h2>Provider Information</h2>
                <p><strong>Doctor's Name:</strong> [Provider's Full Name]</p>
                <p><strong>Specialty:</strong> [Provider's Specialty/Department]</p>
            </div>

            <div class="section">
                <h2>Appointment Details</h2>
                <p><strong>Reason for Visit:</strong>[Brief description of symptoms or issues]</p>
                <p><strong>Medical History:</strong>[Relevant medical history, including past surgeries, chronic conditions, etc.]</p>
                <p><strong>Allergies:</strong>[List of known allergies]</p>
            </div>

            <div class="section">
                <h2>Clinical Observations</h2>
                <p><strong>Physical Examination Findings:</strong></p>
                <ul>
                    <li><strong>Vital Signs:</strong> [e.g., Blood Pressure, Heart Rate, etc.]</li>
                    <li>[Any physical abnormalities or observations]</li>
                </ul>
                <p><strong>Diagnosis:</strong>[Diagnosis or clinical assessment made during the visit]</p>
            </div>

            <div class="section">
                <h2>Treatment Plan</h2>
                <p><strong>Proposed Treatments:</strong>[Medications, therapies, lifestyle changes, etc.]</p>
                <p><strong>Follow-Up Appointments/Referrals:</strong>[Details of any further appointments or referrals to specialists]</p>
            </div>

            <div class="section">
                <h2>Patient Instructions</h2>
                <p>[Any specific instructions given to the patient, e.g., dietary restrictions, exercises, etc.]</p>
            </div>

            <div class="section">
                <h2>Next Appointment</h2>
                <p><strong>Date and Time:</strong> [Date and Time of Next Appointment]</p>
            </div>

            <div class="notice">
                <p><em>Confidentiality Notice: This transcript contains confidential information pertaining to the patient. Unauthorized disclosure is prohibited.</em></p>
            </div>
        </div>
    )
}

export default TemplateAppoitment;