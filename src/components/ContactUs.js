import React, { useState } from "react";
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
  const options = countryList()
    .getData()
    .map((country) => country.label);

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
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
  };

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: { xs: "20px", sm: "0" },
      }}
    >
      <Card
        sx={{
          width: { xs: "100%", sm: 600 },
          margin: "auto",
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <CardMedia
          component="img"
          alt="Logo"
          image={logo}
          title="Overseas Education Center"
          sx={{
            width: { xs: "100%", sm: "550px" },
            height: { xs: "auto", sm: "100px" },
            margin: "20px auto",
          }}
        />
        <CardContent>
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
            <form onSubmit={handleSubmit}>
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
                      <strong>First Name:</strong> {formData.firstName}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Last Name:</strong> {formData.lastName}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Country Interested:</strong>{" "}
                      {formData.countryInterested}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Intake Year:</strong> {formData.intakeYear}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Level Applying for:</strong>{" "}
                      {formData.levelApplying}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Email:</strong> {formData.email}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Phone Number:</strong> {formData.phone}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Notes:</strong> {formData.notes}
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
                <Button disabled={activeStep === 0} onClick={handleBack}>
                  Back
                </Button>
                {activeStep === steps.length - 1 ? (
                  <Button type="submit" variant="contained" color="primary">
                    Submit
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
        </CardContent>
      </Card>
    </Container>
  );
};

export default ContactUsForm;
