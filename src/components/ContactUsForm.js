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
import countryList from "react-select-country-list";
import logo from "../assets/OEC.png";

const steps = [
  "Personal Info",
  "Application Details",
  "Contact Info",
  "Preview",
];

const getYears = () => {
  const currentYear = new Date().getFullYear();
  return [currentYear, currentYear + 1, currentYear + 2];
};

const ContactUsForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    countryInterested: "",
    intakeYear: "",
    levelApplying: "",
    email: "",
    phone: "",
    notes: "",
    resume: null,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const options = countryList()
    .getData()
    .map((country) => country.label);

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

  const handleCountryChange = (event, value) => {
    setFormData({
      ...formData,
      countryInterested: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      resume: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
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
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                    />
                  </Box>
                )}
                {activeStep === 1 && (
                  <Box marginTop={3}>
                    <Autocomplete
                      options={options}
                      value={formData.countryInterested}
                      onChange={handleCountryChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Country Interested"
                          variant="outlined"
                          fullWidth
                        />
                      )}
                    />
                    <FormControl fullWidth margin="normal">
                      <Autocomplete
                        options={getYears()}
                        value={formData.intakeYear}
                        onChange={(event, newValue) =>
                          handleChange({
                            target: { name: "intakeYear", value: newValue },
                          })
                        }
                        renderInput={(params) => (
                          <TextField {...params} label="Intake Year" />
                        )}
                      />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                      <Autocomplete
                        options={["Under Graduate", "Post Graduate"]}
                        value={formData.levelApplying}
                        onChange={(event, newValue) =>
                          handleChange({
                            target: {
                              name: "levelApplying",
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
                        First Name : {formData.firstName}
                      </Typography>
                      <Typography variant="body1">
                        Last Name : {formData.lastName}
                      </Typography>
                      <Typography variant="body1">
                        Country Interested : {formData.countryInterested}
                      </Typography>
                      <Typography variant="body1">
                        Intake Year : {formData.intakeYear}
                      </Typography>
                      <Typography variant="body1">
                        Level Applying for : {formData.levelApplying}
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
                          <strong>Resume:</strong> {formData.resume.name}
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
