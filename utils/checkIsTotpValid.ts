import { Verification } from "@/prisma/generated-prisma-client";
import { generateConfig, Totp, TotpConfig } from "time2fa";
import log from "./consoleLogger";

export function checkIsTotpValid(
  totp: string,
  verification: Verification,
): boolean {
  const totpConfig = generateConfig({
    algo: verification.algorithm as TotpConfig["algo"],
    digits: verification.digits,
    period: verification.period,
  });

  let isTotpValid = false;
  log.info(
    `Validating TOTP with secret: ${verification.secret}, digits: ${totpConfig.digits}, period: ${totpConfig.period}`,
  );
  // Totp.validate throws error if number of digits is different from expected
  try {
    isTotpValid = Totp.validate(
      { passcode: totp, secret: verification.secret },
      totpConfig,
    );
  } catch (error) {
    console.error("Error validating TOTP:", error);
    isTotpValid = false;
  }

  return isTotpValid;
}
