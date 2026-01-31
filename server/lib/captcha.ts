/**
 * CAPTCHA Verification for Google reCAPTCHA v3
 *
 * Frontend sends a token, backend verifies it with Google
 */

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || "";
const RECAPTCHA_MIN_SCORE = 0.5; // 0.0 - 1.0, higher = more confident it's human

interface VerifyResponse {
  success: boolean;
  score?: number;
  action?: string;
  error_codes?: string[];
  message?: string;
}

/**
 * Verify reCAPTCHA token with Google
 */
export async function verifyCaptcha(token: string): Promise<VerifyResponse> {
  if (!RECAPTCHA_SECRET_KEY) {
    console.warn("RECAPTCHA_SECRET_KEY not set, skipping CAPTCHA verification");
    return { success: true }; // Skip if not configured
  }

  if (!token) {
    return {
      success: false,
      message: "CAPTCHA token is required",
    };
  }

  try {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`,
      },
    );

    const data = await response.json();

    // Check if verification was successful
    if (!data.success) {
      return {
        success: false,
        error_codes: data["error-codes"],
        message: "CAPTCHA verification failed",
      };
    }

    // Check score (reCAPTCHA v3 only)
    if (typeof data.score === "number" && data.score < RECAPTCHA_MIN_SCORE) {
      return {
        success: false,
        score: data.score,
        message: `CAPTCHA score too low (${data.score}), suspected bot activity`,
      };
    }

    return {
      success: true,
      score: data.score,
      action: data.action,
    };
  } catch (error) {
    console.error("Error verifying CAPTCHA:", error);
    return {
      success: false,
      message: "Failed to verify CAPTCHA with server",
    };
  }
}

/**
 * Middleware for CAPTCHA verification
 */
export function requireCaptcha(minScore: number = RECAPTCHA_MIN_SCORE) {
  return async (req: any, res: any, next: any) => {
    const { captchaToken } = req.body;

    const result = await verifyCaptcha(captchaToken);

    if (!result.success) {
      return res.status(400).json({
        error: result.message,
        details: {
          errorCodes: result.error_codes,
          score: result.score,
        },
      });
    }

    // Store verification result in request for logging
    req.captchaScore = result.score;
    req.captchaAction = result.action;

    next();
  };
}
