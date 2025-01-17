export interface StepType {
  label: string | number;
  contentFirstSide: React.ReactNode | string;
  contentSecondSide: React.ReactNode | string;
}
export interface StepPropsType {
  stepImg?: string;
  activeStepImg?: string;
  previousStepImg?: string;
  stepCss?: StepCssType;

  stepSize?: number;
  stepBorderSize?: number;
  stepBorderSpace?: number;
}

export type DirectionType = "horizontal" | "vertical";
export type ShowContentSideType =
  | "firstSideOnly"
  | "secondSideOnly"
  | "bothSide";

export interface ActiveStepParamType {
  activeStep: number;
  prevStep: number | null;
  nextStep: number | null;
}

export interface StepCssType {
  backgroundBarColor?: string;
  activeBackgroundBarColor?: string;

  backgroundStepColor?: string;
  activeBackgroundStepColor?: string;
  previousBackgroundStepColor?: string;

  borderStepColor?: string;
  activeBorderStepColor?: string;
  previousBorderStepColor?: string;

  textStepColor?: string;
  activeTextStepColor?: string;
  previousTextStepColor?: string;

  borderSpaceColor?: string;
  activeBorderSpaceColor?: string;
  previousBorderSpaceColor?: string;
}

export interface StepperType {
  steps?: StepType[];
  direction?: DirectionType;
  activeStep?: number;
  handleActiveStep?: (activeStepParam: ActiveStepParamType) => void;
  barSize?: number;
  space?: number;
  showContentSide?: ShowContentSideType;
  stepProps?: StepPropsType;
}
