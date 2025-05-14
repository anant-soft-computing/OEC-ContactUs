import React, { useState, useEffect } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Autocomplete,
  Grid,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
  CloudUpload,
  CheckCircleOutline,
} from "@mui/icons-material";
import * as yup from "yup";
import logo from "../assets/OEC.png";

const steps = [
  "Personal Info",
  "Application Details",
  "Contact Info",
  "Preview & Submit",
];

const currentYear = new Date().getFullYear();

const validationSchemas = [
  // Step 0: Personal Info
  yup.object().shape({
    firstname: yup.string().trim().required("First name is required"),
    lastname: yup.string().trim().required("Last name is required"),
  }),
  // Step 1: Application Details
  yup.object().shape({
    country_interested: yup
      .string()
      .nullable()
      .required("Country of interest is required"),
    intake_year: yup
      .number()
      .typeError("Intake year must be a valid year")
      .required("Intake year is required")
      .min(currentYear, `Year must be ${currentYear} or later`)
      .max(currentYear + 7, "Intake year seems too far in the future"),
    level_applying: yup
      .string()
      .nullable()
      .required("Level of application is required"),
  }),
  // Step 2: Contact Info
  yup.object().shape({
    email: yup
      .string()
      .email("Enter a valid email")
      .required("Email is required"),
    phone: yup
      .string()
      .matches(/^[0-9+-]{8,15}$/, "Enter a valid phone number")
      .required("Phone number is required"),
    notes: yup.string().optional(),
  }),
  // Step 3: Preview (no validation needed here, fields are already validated)
  yup.object().shape({}),
];

const countryOptions = [
  "Uk",
  "Australia",
  "Canada",
  "USA",
  "New Zealand",
  "Ireland",
  "Germany",
  "France",
  "Switzerland",
  "Spain",
  "Georgia",
  "Czech",
  "Hungary",
  "Dubai",
  "Malaysia",
];

const levelOptions = ["Under Graduate", "Post Graduate"];

const ContactUsForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    country_interested: null,
    intake_year: "",
    level_applying: null,
    email: "",
    phone: "",
    notes: "",
    resume: null,
  });
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validateStep = async () => {
    try {
      const currentSchema = validationSchemas[activeStep];
      await currentSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const newErrors = {};
        err.inner.forEach((error) => {
          if (error.path && !newErrors[error.path]) {
            newErrors[error.path] = error.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep();
    if (isValid) {
      if (activeStep === steps.length - 1) {
        await handleFormSubmit();
      } else {
        setActiveStep((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleAutocompleteChange = (name, newValue) => {
    setFormData({
      ...formData,
      [name]: newValue,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      resume: file || null,
    });
    if (errors.resume) {
      setErrors({ ...errors, resume: "" });
    }
    // Optionally, validate file immediately
    if (file) {
      validationSchemas[2]
        .validateAt("resume", { resume: file })
        .then(() => setErrors((prev) => ({ ...prev, resume: "" })))
        .catch((err) =>
          setErrors((prev) => ({ ...prev, resume: err.message }))
        );
    }
  };

  const handleReset = () => {
    setFormData({
      firstname: "",
      lastname: "",
      country_interested: null,
      intake_year: "",
      level_applying: null,
      email: "",
      phone: "",
      notes: "",
      resume: null,
    });
    setActiveStep(0);
    setErrors({});
    setFormSubmitted(false);
    setIsSubmitting(false);
    setSubmitError("");
  };

  const handleFormSubmit = async (event) => {
    if (event) event.preventDefault();

    // Final validation of all fields before submitting (optional if step-by-step is trusted)
    const allFieldsSchema = yup.object().shape({
      ...validationSchemas[0].fields,
      ...validationSchemas[1].fields,
      ...validationSchemas[2].fields,
    });

    try {
      await allFieldsSchema.validate(formData, { abortEarly: false });
      setErrors({});
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const newErrors = {};
        err.inner.forEach((error) => {
          if (error.path && !newErrors[error.path]) {
            newErrors[error.path] = error.message;
          }
        });
        setErrors(newErrors);
        // Find the first step with an error and navigate to it
        const errorFields = Object.keys(newErrors);
        if (errorFields.length > 0) {
          const fieldWithError = errorFields[0];
          if (validationSchemas[0].fields[fieldWithError]) setActiveStep(0);
          else if (validationSchemas[1].fields[fieldWithError])
            setActiveStep(1);
          else if (validationSchemas[2].fields[fieldWithError])
            setActiveStep(2);
        }
        setSubmitError("Please correct the errors in the form.");
        return;
      }
    }

    setIsSubmitting(true);
    setSubmitError("");

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== "") {
        data.append(key, formData[key]);
      }
    });
    if (formData.resume) {
      data.set("resume", formData.resume);
    } else {
      data.delete("resume");
    }

    try {
      const response = await fetch(
        "https://smhri.com/oeccrm/api/create/contactus/",
        {
          method: "POST",
          body: data,
        }
      );
      if (response.ok) {
        setFormSubmitted(true);
      } else {
        const errorData = await response.text();
        setSubmitError(
          `Submission failed: ${response.statusText} - ${
            errorData || "Server error"
          }`
        );
        setFormSubmitted(false);
      }
    } catch (error) {
      setSubmitError(
        `Submission error: ${
          error.message || "Network error, please try again."
        }`
      );
      setFormSubmitted(false);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (formSubmitted) {
      const timer = setTimeout(() => {
        window.location.href = "https://www.oecindia.com";
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [formSubmitted]);

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Personal Info
        return (
          <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Your Personal Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.firstname}
                  helperText={errors.firstname}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.lastname}
                  helperText={errors.lastname}
                />
              </Grid>
            </Grid>
          </Paper>
        );
      case 1: // Application Details
        return (
          <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Your Study Preferences
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Autocomplete
                  options={countryOptions}
                  value={formData.country_interested}
                  onChange={(event, newValue) =>
                    handleAutocompleteChange("country_interested", newValue)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Country Interested In"
                      error={!!errors.country_interested}
                      helperText={errors.country_interested}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Intake Year (e.g., 2025)"
                  type="number"
                  name="intake_year"
                  value={formData.intake_year}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.intake_year}
                  helperText={errors.intake_year}
                  InputProps={{
                    inputProps: { min: currentYear, max: currentYear + 7 },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={levelOptions}
                  value={formData.level_applying}
                  onChange={(event, newValue) =>
                    handleAutocompleteChange("level_applying", newValue)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Level Applying For"
                      error={!!errors.level_applying}
                      helperText={errors.level_applying}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Paper>
        );
      case 2: // Contact Info
        return (
          <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              How We Can Reach You
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.phone}
                  helperText={errors.phone}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Additional Notes (Optional)"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.notes}
                  helperText={errors.notes}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 1 }}>
                  Upload Resume (Optional)
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  startIcon={<CloudUpload />}
                  sx={{
                    borderColor: errors.resume ? "error.main" : "primary.main",
                    color: errors.resume ? "error.main" : "primary.main",
                    "&:hover": {
                      borderColor: errors.resume
                        ? "error.dark"
                        : "primary.dark",
                      backgroundColor: errors.resume
                        ? "rgba(211, 47, 47, 0.04)"
                        : "rgba(25, 118, 210, 0.04)",
                    },
                  }}
                >
                  {formData.resume
                    ? formData.resume.name
                    : "Choose File (PDF, DOC, DOCX | Max 5MB)"}
                  <input
                    type="file"
                    hidden
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  />
                </Button>
                {errors.resume && (
                  <Typography
                    color="error"
                    variant="caption"
                    sx={{ display: "block", mt: 0.5 }}
                  >
                    {errors.resume}
                  </Typography>
                )}
                {!errors.resume && formData.resume && (
                  <Typography
                    variant="body2"
                    sx={{ mt: 1, color: "success.main" }}
                  >
                    Selected: {formData.resume.name} (
                    {(formData.resume.size / 1024 / 1024).toFixed(2)} MB)
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Paper>
        );
      case 3: // Preview
        return (
          <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Review Your Information
            </Typography>
            <Box sx={{ lineHeight: 1.8 }}>
              <Typography variant="body1">
                <strong>Full Name:</strong> {formData.firstname}{" "}
                {formData.lastname}
              </Typography>
              <Typography variant="body1">
                <strong>Country of Interest:</strong>{" "}
                {formData.country_interested}
              </Typography>
              <Typography variant="body1">
                <strong>Intake Year:</strong> {formData.intake_year}
              </Typography>
              <Typography variant="body1">
                <strong>Applying For:</strong> {formData.level_applying}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {formData.email}
              </Typography>
              <Typography variant="body1">
                <strong>Phone:</strong> {formData.phone}
              </Typography>
              {formData.notes && (
                <Typography variant="body1">
                  <strong>Notes:</strong> {formData.notes}
                </Typography>
              )}
              {formData.resume && (
                <Typography variant="body1">
                  <strong>Resume:</strong> {formData.resume.name}
                </Typography>
              )}
            </Box>
            {submitError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {submitError}
              </Alert>
            )}
          </Paper>
        );
      default:
        return null;
    }
  };

  if (formSubmitted) {
    return (
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          minHeight: "90vh",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 2 }}>
          <CheckCircleOutline
            sx={{ fontSize: 60, color: "success.main", mb: 2 }}
          />
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            color="success.dark"
          >
            Thank You!
          </Typography>
          <Typography variant="h6" component="div" sx={{ mb: 2 }}>
            Thank you for trusting OEC for your overseas education journey. We
            are delighted to have you onboard!
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Our team will review your application and contact you shortly.
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            In the meantime, explore our website:{" "}
            <a
              href="https://www.oecindia.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1976d2", textDecoration: "underline" }}
            >
              www.oecindia.com
            </a>
          </Typography>
          <Typography variant="caption" display="block">
            You will be redirected in a few seconds...
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button
              variant="contained"
              onClick={() =>
                (window.location.href = "https://www.oecindia.com")
              }
            >
              Go to Homepage Now
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        py: { xs: 2, sm: 4 },
      }}
    >
      <Card
        sx={{
          boxShadow: { sm: 3, md: 5 },
          borderRadius: 2,
          width: "100%",
          maxWidth: { xs: "100%", sm: 700 },
          margin: "auto",
          overflow: "visible",
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={logo}
            alt="Overseas Education Center Logo"
            style={{ maxHeight: "60px" }}
          />
        </Box>
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ textAlign: "center", mb: 1, fontWeight: "medium" }}
          >
            Begin Your Journey With Us
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ textAlign: "center", mb: 3, color: "text.secondary" }}
          >
            Fill out the form below to get started.
          </Typography>

          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <form
            onSubmit={
              activeStep === steps.length - 1
                ? handleFormSubmit
                : (e) => {
                    e.preventDefault();
                    handleNext();
                  }
            }
          >
            {renderStepContent(activeStep)}
            {submitError && activeStep !== steps.length - 1 && (
              <Alert severity="error" sx={{ mt: 2, mb: 1 }}>
                {submitError}
              </Alert>
            )}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 4,
              }}
            >
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={activeStep === 0 || isSubmitting}
                startIcon={<ArrowBack />}
              >
                Back
              </Button>
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={handleFormSubmit}
                  disabled={isSubmitting}
                  startIcon={
                    isSubmitting ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <CheckCircleOutline />
                    )
                  }
                >
                  {isSubmitting ? "Submitting..." : "Confirm & Submit"}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  endIcon={<ArrowForward />}
                >
                  Next
                </Button>
              )}
            </Box>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <Button
                color="secondary"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                Reset Form
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ContactUsForm;
