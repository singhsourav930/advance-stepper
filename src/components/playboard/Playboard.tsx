import React, { useMemo, useState } from "react";
import Stepper from "../stepper/Stepper.tsx";
import {
  ActiveStepParamType,
  StepperType,
  StepType,
} from "../stepper/Stepper.type.ts";
import { Prism } from "@mantine/prism";
import { TextInput, Radio, Textarea, Button } from "@mantine/core";
import "./Playboard.css";

function Playboard() {
  const steps = [
    {
      label: "1",
      contentFirstSide: "Top 1",
      contentSecondSide: "Bottom 1",
    },
    {
      label: "2",
      contentFirstSide: "Top 2",
      contentSecondSide: "Bottom 2",
    },
    {
      label: "3",
      contentFirstSide: "Top 3",
      contentSecondSide: "Bottom 3",
    },
  ];

  const handleActiveStep = ({
    activeStep,
    prevStep,
    nextStep,
  }: ActiveStepParamType) => {
    console.log(
      "activeStep, prevStep, nextStep",
      activeStep,
      prevStep,
      nextStep
    );
    setStepperForm((stepperData) => ({
      ...stepperData,
      activeStep: activeStep,
    }));
  };

  const [stepperForm, setStepperForm] = useState<StepperType>({
    activeStep: 0,
    direction: "horizontal",
    barSize: 7,
    space: 20,
    showContentSide: "bothSide",
    stepProps: {
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
    },
    steps: steps,
    handleActiveStep: handleActiveStep,
  });

  const formatObjectForJSX = (
    obj: StepperType,
    indent: number,
    isRepeat?: boolean
  ): unknown => {
    const entries = Object.entries(obj);
    const entriesLength = Object.entries(entries).length;
    return entries
      .map((entryData, idx) => {
        const [key, value] = entryData;
        if (typeof value === "object" && !Array.isArray(value)) {
          if (React.isValidElement(value)) {
            return `${" ".repeat(indent)}${key}${isRepeat ? ":" : "="}${
              isRepeat ? "" : "{"
            }"ReactNode"${isRepeat ? `,${entriesLength - 1 === idx ? `\n${" ".repeat(indent - 2)}` : ""}` : "}"}`;
          } else {
            return `${" ".repeat(indent)}${key}${isRepeat ? ":" : "="}${
              isRepeat ? "" : "{"
            }{${formatObjectForJSX(value, indent + 2, true)}}${
              isRepeat ? "," : `\n${" ".repeat(indent)}}`
            }`;
          }
        } else if (Array.isArray(value)) {
          const arrdata = value.map((arrayData, arrIdx) => {
            return `${arrIdx === 0 ? `${" ".repeat(indent + 2)}` : ""}\n${" ".repeat(indent + 2)}{${formatObjectForJSX(arrayData, indent + 4, true)}}`;
          });
          return `${" ".repeat(indent)}${key}={[${arrdata}]\n${" ".repeat(indent)}}`;
        } else if (typeof value === "string") {
          return `${idx === 0 ? "\n" : ""}${" ".repeat(indent)}${key}${isRepeat ? ":" : "="}"${value}"${
            isRepeat
              ? `,${entriesLength - 1 === idx ? `\n${" ".repeat(indent - 2)}` : ""}`
              : ""
          }`;
        } else if (typeof value === "number") {
          return `${" ".repeat(indent)}${key}${isRepeat ? ":" : "="}${
            isRepeat ? value : `{${value}}`
          }${isRepeat ? `,${entriesLength - 1 === idx ? `\n${" ".repeat(indent)}` : ""}` : ""}`;
        } else {
          return `${" ".repeat(indent)}${key}={${value}}`;
        }
      })
      .join("\n")
      .replace(
        `setStepperForm((stepperData) => ({
      ...stepperData,
      activeStep
    }));`,
        "// write your logic here"
      );
  };

  const structuredStepper = useMemo(() => {
    return `<Stepper\n${formatObjectForJSX(stepperForm, 2)}\n/>`;
  }, [stepperForm]);

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "50%" }}>
        <Stepper {...stepperForm} />
        <br />
        <Prism language="tsx">{structuredStepper}</Prism>
      </div>
      <div style={{ marginLeft: "5%", width: "45%" }}>
        <div>
          Direction:
          <Button
            onClick={() => {
              setStepperForm({
                ...stepperForm,
                direction:
                  stepperForm?.direction === "vertical"
                    ? "horizontal"
                    : "vertical",
              });
            }}
          >
            Make a{" "}
            {stepperForm?.direction === "vertical" ? "horizontal" : "vertical"}
          </Button>
          <TextInput value={stepperForm?.direction} type="type" disabled />
          <br />
          Step Size:
          <TextInput
            value={stepperForm?.stepProps?.stepSize}
            type="number"
            onChange={(e) =>
              setStepperForm({
                ...stepperForm,
                stepProps: {
                  ...stepperForm.stepProps,
                  stepSize: +e.target.value,
                },
              })
            }
          />
          <br />
          Border Space:
          <TextInput
            value={stepperForm?.stepProps?.stepBorderSpace}
            type="number"
            onChange={(e) =>
              setStepperForm({
                ...stepperForm,
                stepProps: {
                  ...stepperForm.stepProps,
                  stepBorderSpace: +e.target.value,
                },
              })
            }
          />
          <br />
          Bar Size:
          <TextInput
            value={stepperForm.barSize}
            type="number"
            onChange={(e) =>
              setStepperForm({
                ...stepperForm,
                barSize: +e.target.value,
              })
            }
          />
          <br />
          Space:
          <TextInput
            value={stepperForm?.space}
            type="number"
            onChange={(e) =>
              setStepperForm({
                ...stepperForm,
                space: +e.target.value,
              })
            }
          />
          <br />
          Step Border Size:
          <TextInput
            value={stepperForm?.stepProps?.stepBorderSize}
            type="number"
            onChange={(e) =>
              setStepperForm({
                ...stepperForm,
                stepProps: {
                  ...stepperForm.stepProps,
                  stepBorderSize: +e.target.value,
                },
              })
            }
          />
          <br />
          Show Content:
          <br />
          <Radio
            value={stepperForm.showContentSide}
            type="radio"
            checked={stepperForm.showContentSide === "bothSide"}
            name="showContentSide"
            onChange={() =>
              setStepperForm({
                ...stepperForm,
                showContentSide: "bothSide",
              })
            }
          />
          Both Side
          <br />
          <Radio
            value={stepperForm.showContentSide}
            type="radio"
            name="showContentSide"
            onChange={() =>
              setStepperForm({
                ...stepperForm,
                showContentSide: "firstSideOnly",
              })
            }
          />
          First Side Only
          <br />
          <Radio
            value={stepperForm.showContentSide}
            type="radio"
            name="showContentSide"
            onChange={() =>
              setStepperForm({
                ...stepperForm,
                showContentSide: "secondSideOnly",
              })
            }
          />
          Second Side Only
        </div>
        <div>
          Step Css:
          <div>
            <Textarea
              value={JSON.stringify(stepperForm?.stepProps?.stepCss, null, 4)}
              onChange={(e) =>
                setStepperForm({
                  ...stepperForm,
                  stepProps: {
                    ...stepperForm.stepProps,
                    stepCss: JSON.parse(e.target.value),
                  },
                })
              }
              rows={14}
              cols={50}
            >
              {JSON.stringify(stepperForm?.stepProps?.stepCss, null, 4)}
            </Textarea>
          </div>
        </div>
        <div>
          Steps data:
          <Textarea
            value={JSON.stringify(
              (stepperForm?.steps || []).map((step) => ({
                ...step,
                contentFirstSide:
                  typeof step.contentFirstSide === "string"
                    ? step.contentFirstSide
                    : `ReactNode`, // Replace JSX with a placeholder
                contentSecondSide:
                  typeof step.contentSecondSide === "string"
                    ? step.contentSecondSide
                    : `ReactNode`, // Replace JSX with a placeholder
              })),
              null,
              4
            )}
            onChange={(e) => {
              try {
                const updatedSteps = JSON.parse(e.target.value);
                setStepperForm({
                  ...stepperForm,
                  steps: updatedSteps.map((step: StepType) => ({
                    ...step,
                    contentFirstSide:
                      step.contentFirstSide === "JSX Element" ? (
                        <div>Default JSX</div> // Replace placeholder with JSX
                      ) : (
                        step.contentFirstSide
                      ),
                    contentSecondSide:
                      step.contentSecondSide === "JSX Element" ? (
                        <div>Default JSX</div> // Replace placeholder with JSX
                      ) : (
                        step.contentSecondSide
                      ),
                  })),
                });
              } catch (error) {
                console.error("Invalid JSON:", error);
              }
            }}
            rows={14}
            cols={70}
          ></Textarea>
        </div>
      </div>
      <br />
    </div>
  );
}

export default Playboard;
