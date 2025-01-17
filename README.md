# Advance stepper

It's very easy to use

![Horzontal Stepper](https://lh3.googleusercontent.com/pw/AP1GczMeVm5MjY3vsviwtnX8yspKmBmv91DnYfNTw9i2dtIZjrTI9GpGvWALeMNCVkAEp_O4k2FKThaRXLM_yvb1LrM3TplthZZXxjeX3FaZP0vnZ1JEJaMcNeKufRGp0nw6ii2WdgGi2ejZi1slK8wWW5w=w987-h194-s-no-gm?authuser=0)


![Vertical Stepper](https://lh3.googleusercontent.com/pw/AP1GczNVczBb5XBT8LULTHg8UD1ZtvdyK6LglLc9lm3kBKqXcqr6hcqfPOBxFv673xzG9Ss2wy16kruI79fB2dHtAEd7QKLY9skRPsPHdDU6HqdrxIcuNNPVSWFJN4iBXj8PulhII7EOGizVhnUilAMqAZo=w453-h376-s-no-gm)

## Create your own Stepper through customization in the below url and use into your website

- https://ersouravsingh.com/

## Install
`npm install advance-stepper`


## How to use
```
import Stepper from "advance-stepper";

 <Stepper
    activeStep={0}
    direction="horizontal"
    barSize={7}
    space={20}
    showContentSide="bothSide"
    stepProps={{
        stepImg: "",
        activeStepImg: "",
        previousStepImg: "",
        stepCss: {
        backgroundBarColor: "#E8E8E8",
        activeBackgroundBarColor: "#3B8FE5",
        backgroundStepColor: "#E8E8E8",
        activeBackgroundStepColor: "#3B8FE5",
        previousBackgroundStepColor: "#3B8FE5",
        borderStepColor: "#E8E8E8",
        activeBorderStepColor: "#a5d2ff",
        previousBorderStepColor: "#3B8FE5",
        textStepColor: "#6A6A6A",
        activeTextStepColor: "#ffffff",
        previousTextStepColor: "#ffffff",
        borderSpaceColor: "#ffffff",
        activeBorderSpaceColor: "#ffffff",
        previousBorderSpaceColor: "#ffffff",
        },
        stepSize: 40,
        stepBorderSize: 2,
        stepBorderSpace: 2,
    }}
    steps={[
        {
        label: "1",
        contentFirstSide: "Top Text 1",
        contentSecondSide: "Bottom Text 1",
        },
        {
        label: "2",
        contentFirstSide: "Top Text 2",
        contentSecondSide: "Bottom Text 2",
        },
        {
        label: "3",
        contentFirstSide: "Top Text 3",
        contentSecondSide: "Bottom Text 3",
        },
    ]}
    handleActiveStep={({ activeStep, prevStep, nextStep }) => {
        console.log(
        "activeStep, prevStep, nextStep",
        activeStep,
        prevStep,
        nextStep
        );
    }}
 />
```