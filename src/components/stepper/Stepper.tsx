import React, { useState, useRef, useEffect } from "react";
import "./Stepper.css";
import { StepperType, StepType } from "./Stepper.type";

const Stepper = (props: StepperType) => {
  const {
    steps,
    barSize = 4,
    direction = "horizontal",
    space = 4,
    showContentSide = "bothSide",
    stepProps,
    handleActiveStep = () => {},
  } = props;

  const stepCss = stepProps?.stepCss;
  const stepsLength = (steps || []).length;
  const stepSizeValue = Number(stepProps?.stepSize || 0);
  const stepBorderSizeValue = Number(stepProps?.stepBorderSize || 0);
  const stepBorderSpaceValue = Number(stepProps?.stepBorderSpace || 0);
  const barSizeValue =
    Number(barSize) > stepSizeValue ? stepSizeValue : Number(barSize);
  const spaceValue = Number(space);

  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(window.devicePixelRatio);
  const [resizeWindow, setResizeWindow] = useState<number>(window.innerWidth);

  const containerRef = useRef<HTMLDivElement>(null);
  const containerBoxRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const stepContentFirstSideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stepContainerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stepContentSecondSideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stepRef = useRef<HTMLDivElement>(null);
  const activeStepRef = useRef<HTMLElement | null>(null);
  const progressActiveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleZoom = () => {
      setZoomLevel(window.devicePixelRatio);
      setResizeWindow(window.innerWidth);
    };

    window.addEventListener("resize", handleZoom);

    return () => {
      window.removeEventListener("resize", handleZoom);
    };
  }, []);

  const getStepSize = (isHalf: boolean = false) => {
    return isHalf
      ? stepRef.current!.offsetHeight / 2
      : stepRef.current!.offsetHeight;
  };
  const handleStepClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    idx: number
  ) => {
    // set active step event for later use when user toggle between horizontal and vertical
    activeStepRef.current = event.currentTarget;

    // set active progress bar width and height;
    const rect = event.currentTarget.getBoundingClientRect();
    const container = containerRef.current!.getBoundingClientRect();
    const leftSideWidth = window.scrollX + container.left;
    const topSideHeight = window.scrollY + container.top;
    if (direction === "horizontal") {
      progressActiveRef.current!.style.width =
        rect.left - leftSideWidth + window.scrollX + "px";
      progressActiveRef.current!.style.height = "100%";
    } else {
      progressActiveRef.current!.style.width = "100%";
      progressActiveRef.current!.style.height =
        rect.top - topSideHeight + window.scrollY + "px";
    }
    setActiveStepIndex(idx);

    handleActiveStep({
      activeStep: idx,
      prevStep: idx <= 0 ? null : idx - 1,
      nextStep: idx >= stepsLength - 1 ? null : idx + 1,
    });
  };

  useEffect(() => {
    // reset active progress bar width and height;
    progressActiveRef.current!.style.width = `0px`;
    progressActiveRef.current!.style.height = `0px`;
    if (
      stepContainerRefs?.current &&
      stepContentFirstSideRefs?.current &&
      stepRef?.current &&
      stepContentSecondSideRefs?.current
    ) {
      if (direction === "horizontal") {
        // set space between steps;
        stepContainerRefs.current.forEach((ref, index) => {
          ref!.style.margin = `0px ${
            index === stepContainerRefs.current.length - 1 ? "0" : spaceValue
          }px 0px ${index === 0 ? "0" : spaceValue}px`;
        });

        // set min height of each elements in firstSide and secondSide;
        const topHeights = stepContentFirstSideRefs.current.map(
          (ref) => ref?.offsetHeight || 0
        );
        const maxTopHeight =
          showContentSide === "secondSideOnly" ? 0 : Math.max(...topHeights);
        stepContentFirstSideRefs.current.forEach((ref) => {
          ref!.style.minHeight = `${maxTopHeight}px`;
        });
        const bottomHeights = stepContentSecondSideRefs.current.map(
          (ref) => ref?.offsetHeight || 0
        );
        const maxBottomHeight = Math.max(...bottomHeights);
        stepContentSecondSideRefs.current.forEach((ref) => {
          ref!.style.minHeight = `${maxBottomHeight}px`;
        });

        // set default alignment, width and height of progress bar;
        progressRef.current!.style.top = `${
          maxTopHeight + getStepSize(true) - barSizeValue / 2
        }px`;
        progressRef.current!.style.height = `${barSizeValue}px`;
        progressRef.current!.style.left = `${getStepSize(true)}px`;
        const scrollWidth =
          containerBoxRef.current!.scrollWidth - getStepSize();
        progressRef.current!.style.width = `${scrollWidth}px`;

        // reset transition of active progressbar
        progressActiveRef.current!.style.transition = "width 0.5s ease-in-out";

        // set width and height of active progressbar
        const activeStep = activeStepRef?.current;
        if (activeStep) {
          const activeStepClient = activeStep.getBoundingClientRect();
          const container = containerRef.current!.getBoundingClientRect();
          const leftSideWidth = container.left;
          progressActiveRef.current!.style.width = `${
            activeStepClient.left - leftSideWidth
          }px`;
          progressActiveRef.current!.style.height = `${barSizeValue}px`;
        }
      }

      if (direction === "vertical") {
        // set space between steps;
        stepContainerRefs.current.forEach((ref, index) => {
          ref!.style.margin = `${index === 0 ? "0" : spaceValue}px 0px ${
            index === stepContainerRefs.current.length - 1 ? "0" : spaceValue
          }px 0px`;
        });

        // set content to left side and handle height
        stepContentFirstSideRefs.current.forEach((ref) => {
          ref!.style.minHeight = `auto`;
          if (showContentSide === "secondSideOnly") {
            ref!.style.flex = `none`;
          } else {
            ref!.style.flex = "1";
          }
        });

        // set content to right side and handle height
        stepContentSecondSideRefs.current.forEach((ref) => {
          ref!.style.minHeight = `auto`;
          if (showContentSide === "firstSideOnly") {
            ref!.style.flex = `none`;
          } else {
            ref!.style.flex = "1";
          }
        });

        // set alignment, width and height of progress bar;
        const containerHeight = containerRef.current!.offsetHeight;
        progressRef.current!.style.height = `${
          containerHeight - getStepSize()
        }px`;
        progressRef.current!.style.width = `${barSizeValue}px`;
        if (showContentSide === "secondSideOnly") {
          progressRef.current!.style.left = `${
            getStepSize(true) - barSizeValue / 2
          }px`;
        } else if (showContentSide === "firstSideOnly") {
          progressRef.current!.style.right = `${
            getStepSize(true) - barSizeValue / 2
          }px`;
          progressRef.current!.style.left = `unset`;
        } else {
          progressRef.current!.style.left = `calc(50% - ${barSizeValue / 2}px`;
        }
        progressRef.current!.style.top = `${getStepSize(true)}px`;

        // reset transition of active progressbar
        progressActiveRef.current!.style.transition = "height 0.5s ease-in-out";

        // set width and height of active progressbar
        const activeStep = activeStepRef?.current;
        if (activeStep) {
          const activeStepBound = activeStep.getBoundingClientRect();
          const container = containerRef.current!.getBoundingClientRect();
          const topSideHeight = container.top;
          progressActiveRef.current!.style.height = `${
            activeStepBound.top - topSideHeight
          }px`;
          progressActiveRef.current!.style.width = `${barSizeValue}px`;
        }
      }
    }
  }, [
    props,
    zoomLevel,
    resizeWindow,
    stepContainerRefs,
    stepContentFirstSideRefs,
    stepRef,
    stepContentSecondSideRefs,
  ]);

  let progressBarStyle = {};
  let activeProgressBarStyle = {};
  let activeStepStyle = {};
  let stepCenterCircle = {};
  let stepInnerCircle = {};
  if (stepCss?.backgroundBarColor) {
    progressBarStyle = {
      ...progressBarStyle,
      background: stepCss.backgroundBarColor,
    };
  }
  if (stepCss?.activeBackgroundBarColor) {
    activeProgressBarStyle = {
      ...activeProgressBarStyle,
      background: stepCss.activeBackgroundBarColor,
    };
  }

  return (
    <div className="main-container">
      <div className="stepper-container " ref={containerRef}>
        {/* Steps with Content Inline */}
        <div
          className={`stepper-container-box ${direction}`}
          ref={containerBoxRef}
        >
          {steps &&
            steps.length > 0 &&
            steps.map((step: StepType, index: number) => {
              const isActive = activeStepIndex === index;
              if (stepCss?.activeBorderSpaceColor && isActive) {
                stepCenterCircle = {
                  ...stepCenterCircle,
                  background: stepCss.activeBorderSpaceColor,
                };
              } else if (stepCss?.borderSpaceColor) {
                stepCenterCircle = {
                  ...stepCenterCircle,
                  background: stepCss.borderSpaceColor,
                };
              }
              if (
                stepCss?.previousBorderSpaceColor &&
                index < activeStepIndex
              ) {
                stepCenterCircle = {
                  ...stepCenterCircle,
                  background: stepCss.previousBorderSpaceColor,
                };
              }
              if (stepCss?.activeBackgroundStepColor && isActive) {
                stepInnerCircle = {
                  ...stepInnerCircle,
                  background: stepCss.activeBackgroundStepColor,
                  margin: stepBorderSpaceValue + "px",
                };
              } else if (stepCss?.backgroundStepColor) {
                stepInnerCircle = {
                  ...stepInnerCircle,
                  background: stepCss.backgroundStepColor,
                  margin: stepBorderSpaceValue + "px",
                };
              }
              if (
                stepCss?.previousBackgroundStepColor &&
                index < activeStepIndex
              ) {
                stepInnerCircle = {
                  ...stepInnerCircle,
                  background: stepCss.previousBackgroundStepColor,
                  margin: stepBorderSpaceValue + "px",
                };
              }

              if (stepCss?.activeBorderStepColor && isActive) {
                activeStepStyle = {
                  ...activeStepStyle,
                  borderColor: stepCss.activeBorderStepColor,
                };
              } else if (stepCss?.borderStepColor) {
                activeStepStyle = {
                  ...activeStepStyle,
                  borderColor: stepCss.borderStepColor,
                };
              }
              if (
                stepCss?.previousBorderStepColor &&
                (index < activeStepIndex ||
                  (index === steps.length - 1 && isActive))
              ) {
                activeStepStyle = {
                  ...activeStepStyle,
                  borderColor: stepCss.previousBorderStepColor,
                };
              }

              if (stepCss?.activeTextStepColor && isActive) {
                activeStepStyle = {
                  ...activeStepStyle,
                  color: stepCss.activeTextStepColor,
                };
              } else if (stepCss?.textStepColor) {
                activeStepStyle = {
                  ...activeStepStyle,
                  color: stepCss.textStepColor,
                };
              }
              if (stepCss?.previousTextStepColor && index < activeStepIndex) {
                activeStepStyle = {
                  ...activeStepStyle,
                  color: stepCss.previousTextStepColor,
                };
              }

              let renderImage = stepProps?.stepImg;
              if (stepProps?.activeStepImg && isActive) {
                renderImage = stepProps?.activeStepImg;
              } else if (
                stepProps?.previousStepImg &&
                index < activeStepIndex
              ) {
                renderImage = stepProps?.previousStepImg;
              }
              return (
                <div
                  className={`step-container ${direction}`}
                  key={index}
                  ref={(el: HTMLDivElement) => {
                    if (el) stepContainerRefs.current[index] = el;
                  }}
                >
                  {/* Content Above the Step */}
                  <div
                    className={`step-content-top ${direction} ${
                      isActive ? "active" : ""
                    }`}
                    ref={(el) => {
                      if (el) stepContentFirstSideRefs.current[index] = el;
                    }}
                  >
                    {(showContentSide === "bothSide" ||
                      showContentSide === "firstSideOnly") && (
                      <div className="step-inner-content-top">
                        {step.contentFirstSide}
                      </div>
                    )}
                  </div>
                  {/* Step Point */}
                  <div
                    ref={stepRef}
                    className={`step ${isActive ? "completed" : ""} ${
                      isActive ? "active" : ""
                    }`}
                    onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) =>
                      handleStepClick(e, index)
                    }
                    style={{
                      borderWidth: stepBorderSizeValue + "px",
                      borderStyle: "solid",
                      ...activeStepStyle,
                    }}
                  >
                    <div
                      className="step-center-circle"
                      style={{
                        ...stepCenterCircle,
                      }}
                    >
                      <div
                        className="step-inner-circle"
                        style={{
                          width: stepSizeValue + "px",
                          height: stepSizeValue + "px",
                          ...stepInnerCircle,
                        }}
                      >
                        {renderImage ? (
                          <img src={renderImage} alt={"step-" + index} />
                        ) : (
                          step?.label
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content Below the Step */}
                  <div
                    ref={(el: HTMLDivElement) => {
                      if (el) stepContentSecondSideRefs.current[index] = el;
                    }}
                    className={`step-content-bottom  ${direction} ${
                      isActive ? "active" : ""
                    }`}
                  >
                    {(showContentSide === "bothSide" ||
                      showContentSide === "secondSideOnly") && (
                      <div className="step-inner-content-bottom">
                        {step.contentSecondSide}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
        {/* Progress Bar */}
        <div
          className={`progress-bar ${direction}`}
          ref={progressRef}
          style={progressBarStyle}
        >
          <div
            className="progress-fill"
            ref={progressActiveRef}
            style={activeProgressBarStyle}
          />
        </div>
      </div>
    </div>
  );
};

export default Stepper;
