export type BookingFormValues = {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  reasonForVisit: string;
};

export type BookingFormErrors = Partial<Record<keyof BookingFormValues, string>>;

type BookingFormProps = {
  values: BookingFormValues;
  errors: BookingFormErrors;
  canSubmit: boolean;
  onChange: (field: keyof BookingFormValues, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function BookingForm({
  values,
  errors,
  canSubmit,
  onChange,
  onSubmit,
}: BookingFormProps) {
  return (
    <form className="booking-form" onSubmit={onSubmit} noValidate>
      <div className="field-group">
        <label htmlFor="patientName">Full name</label>
        <input
          id="patientName"
          name="patientName"
          type="text"
          autoComplete="name"
          value={values.patientName}
          aria-invalid={Boolean(errors.patientName)}
          aria-describedby={errors.patientName ? "patientName-error" : undefined}
          onChange={(event) => onChange("patientName", event.target.value)}
        />
        {errors.patientName ? (
          <p id="patientName-error" className="field-error">
            {errors.patientName}
          </p>
        ) : null}
      </div>

      <div className="field-grid">
        <div className="field-group">
          <label htmlFor="patientEmail">Email</label>
          <input
            id="patientEmail"
            name="patientEmail"
            type="email"
            autoComplete="email"
            value={values.patientEmail}
            aria-invalid={Boolean(errors.patientEmail)}
            aria-describedby={
              errors.patientEmail ? "patientEmail-error" : undefined
            }
            onChange={(event) => onChange("patientEmail", event.target.value)}
          />
          {errors.patientEmail ? (
            <p id="patientEmail-error" className="field-error">
              {errors.patientEmail}
            </p>
          ) : null}
        </div>

        <div className="field-group">
          <label htmlFor="patientPhone">
            Phone <span>optional</span>
          </label>
          <input
            id="patientPhone"
            name="patientPhone"
            type="tel"
            autoComplete="tel"
            value={values.patientPhone}
            aria-invalid={Boolean(errors.patientPhone)}
            aria-describedby={
              errors.patientPhone ? "patientPhone-error" : undefined
            }
            onChange={(event) => onChange("patientPhone", event.target.value)}
          />
          {errors.patientPhone ? (
            <p id="patientPhone-error" className="field-error">
              {errors.patientPhone}
            </p>
          ) : null}
        </div>
      </div>

      <div className="field-group">
        <label htmlFor="reasonForVisit">Reason for visit</label>
        <textarea
          id="reasonForVisit"
          name="reasonForVisit"
          rows={5}
          value={values.reasonForVisit}
          aria-invalid={Boolean(errors.reasonForVisit)}
          aria-describedby={
            errors.reasonForVisit ? "reasonForVisit-error" : undefined
          }
          onChange={(event) => onChange("reasonForVisit", event.target.value)}
        />
        {errors.reasonForVisit ? (
          <p id="reasonForVisit-error" className="field-error">
            {errors.reasonForVisit}
          </p>
        ) : null}
      </div>

      <button className="primary-button" type="submit" disabled={!canSubmit}>
        Submit booking request
      </button>
      {!canSubmit ? (
        <p className="form-note">Choose a physician and available time first.</p>
      ) : null}
    </form>
  );
}
