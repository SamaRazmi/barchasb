declare module "react-puzzle-captcha" {
  import React from "react";

  interface PuzzleCaptchaProps {
    onSuccess?: () => void;
    onFail?: () => void;
    sliderText?: string;
  }

  const PuzzleCaptcha: React.FC<PuzzleCaptchaProps>;
  export default PuzzleCaptcha;
}
