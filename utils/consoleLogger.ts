import chalk from "chalk";
import logSymbols from "log-symbols";

type ConsoleLogParameterTypes = Parameters<typeof console.log>;

const log = (...args: ConsoleLogParameterTypes) => void console.log(...args);

const logMethods = {
  info: (message: string, ...args: unknown[]) =>
    console.log(chalk.blueBright(` ${logSymbols.info} ${message}`), ...args),
  success: (message: string, ...args: unknown[]) =>
    console.log(chalk.green(` ${logSymbols.success} ${message}`), ...args),
  warn: (message: string, ...args: unknown[]) =>
    console.warn(chalk.yellow(` ${logSymbols.warning} ${message}`), ...args),
  error: (message: string, ...args: unknown[]) =>
    console.error(chalk.red(` ${logSymbols.error} ${message}`), ...args),
};

log.info = logMethods.info;
log.success = logMethods.success;
log.warn = logMethods.warn;
log.error = logMethods.error;

export default log;
