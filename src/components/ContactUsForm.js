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
  CardMedia,
  Typography,
  Container,
  Autocomplete,
  FormControl,
} from "@mui/material";
import logo from "../assets/OEC.png";

const steps = [
  "Personal Info",
  "Application Details",
  "Contact Info",
  "Preview",
];

const ContactUsForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    country_interested: "",
    intake_year: "",
    level_applying: "",
    email: "",
    phone: "",
    notes: "",
    resume: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      resume: e.target.files[0],
    });
  };

  const handleReset = () => {
    setFormData({
      firstname: "",
      lastname: "",
      country_interested: "",
      intake_year: "",
      level_applying: "",
      email: "",
      phone: "",
      notes: "",
      resume: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("firstname", formData.firstname);
    data.append("lastname", formData.lastname);
    data.append("country_interested", formData.country_interested);
    data.append("intake_year", formData.intake_year);
    data.append("level_applying", formData.level_applying);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("notes", formData.notes);
    data.append("resume", formData.resume);

    try {
      const response = await fetch(
        "https://smhri.com/oeccrm/api/create/contactus/",
        {
          method: "POST",
          body: data,
        }
      );
      if (response.ok) {
        handleReset();
        setFormSubmitted(true);
      } else {
        setFormSubmitted(false);
      }
    } catch (error) {
      setFormSubmitted(false);
      console.error(error);
    }
  };

  useEffect(() => {
    if (formSubmitted) {
      const timer = setTimeout(() => {
        window.location.href = "https://www.oecindia.com";
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [formSubmitted]);

  return (
    <Container
      sx={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        padding: { xs: "20px", sm: "0" },
      }}
    >
      <Card
        sx={{
          boxShadow: 3,
          margin: "auto",
          borderRadius: 2,
          width: { xs: "100%", sm: 600 },
        }}
      >
        <CardMedia
          image={logo}
          component="img"
          sx={{ margin: "20px auto" }}
          alt="Overseas Education Center"
          title="Overseas Education Center"
        />
        <CardContent>
          {formSubmitted ? (
            <>
              <Box>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ textAlign: "center", mb: 2 }}
                >
                  Thank you for Trusting us for Your Overseas Education Journey.
                  We are delighted to have you onboard. In the meantime, explore
                  our website{" "}
                  <a
                    href="https://www.oecindia.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.oecindia.com
                  </a>{" "}
                  for more information.
                </Typography>
              </Box>
            </>
          ) : (
            <>
              <Typography
                variant="h5"
                component="div"
                sx={{ textAlign: "center", mb: 2 }}
              >
                Contact Us
              </Typography>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <form>
                {activeStep === 0 && (
                  <Box>
                    <TextField
                      label="First Name"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="Last Name"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                    />
                  </Box>
                )}
                {activeStep === 1 && (
                  <Box marginTop={3}>
                    <FormControl fullWidth margin="normal">
                      <Autocomplete
                        options={[
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
                        ]}
                        value={formData.country_interested}
                        onChange={(event, newValue) =>
                          handleChange({
                            target: {
                              name: "country_interested",
                              value: newValue,
                            },
                          })
                        }
                        renderInput={(params) => (
                          <TextField {...params} label="Country Interested" />
                        )}
                      />
                    </FormControl>
                    <TextField
                      label="Intake Year"
                      type="number"
                      name="intake_year"
                      value={formData.intake_year}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                      <Autocomplete
                        options={["Under Graduate", "Post Graduate"]}
                        value={formData.level_applying}
                        onChange={(event, newValue) =>
                          handleChange({
                            target: {
                              name: "level_applying",
                              value: newValue,
                            },
                          })
                        }
                        renderInput={(params) => (
                          <TextField {...params} label="Level Applying for" />
                        )}
                      />
                    </FormControl>
                  </Box>
                )}
                {activeStep === 2 && (
                  <Box>
                    <TextField
                      label="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="Notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                      multiline
                      rows={4}
                    />
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      Upload Resume
                    </Typography>
                    <Button
                      variant="contained"
                      component="label"
                      fullWidth
                      sx={{ mt: 1 }}
                    >
                      Upload Resume
                      <input type="file" hidden onChange={handleFileChange} />
                    </Button>
                    {formData.resume && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {formData.resume.name}
                      </Typography>
                    )}
                  </Box>
                )}
                {activeStep === 3 && (
                  <Box>
                    <Card sx={{ m: 2, p: 2 }}>
                      <Typography variant="body1">
                        First Name : {formData.firstname}
                      </Typography>
                      <Typography variant="body1">
                        Last Name : {formData.lastname}
                      </Typography>
                      <Typography variant="body1">
                        Country Interested : {formData.country_interested}
                      </Typography>
                      <Typography variant="body1">
                        Intake Year : {formData.intake_year}
                      </Typography>
                      <Typography variant="body1">
                        Level Applying for : {formData.level_applying}
                      </Typography>
                      <Typography variant="body1">
                        Email : {formData.email}
                      </Typography>
                      <Typography variant="body1">
                        Phone Number : {formData.phone}
                      </Typography>
                      <Typography variant="body1">
                        Notes : {formData.notes}
                      </Typography>
                      {formData.resume && (
                        <Typography variant="body1">
                          Resume : {formData.resume.name}
                        </Typography>
                      )}
                    </Card>
                  </Box>
                )}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleBack}
                    disabled={activeStep === 0}
                  >
                    Back
                  </Button>
                  {activeStep === steps.length - 1 ? (
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={handleSubmit}
                    >
                      Confirm Submit
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default ContactUsForm;
