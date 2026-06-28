import { prisma } from "./prisma";

type LogLevel = "debug" | "info" | "warn" | "error";

type LogContext = Record<string, unknown>;

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel: LogLevel =
  (process.env.LOG_LEVEL as LogLevel) || "debug";

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
}

function formatMessage(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString();
  const ctx = context ? ` ${JSON.stringify(context)}` : "";
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${ctx}`;
}

function logToConsole(level: LogLevel, message: string, context?: LogContext) {
  const formatted = formatMessage(level, message, context);
  switch (level) {
    case "error":
      console.error(formatted);
      break;
    case "warn":
      console.warn(formatted);
      break;
    case "info":
      console.info(formatted);
      break;
    default:
      console.log(formatted);
  }
}

async function logToDatabase(params: {
  level: LogLevel;
  message: string;
  context?: LogContext;
  action?: string;
  userId?: string;
  url?: string;
  stack?: string;
}) {
  try {
    await prisma.errorLog.create({
      data: {
        level: params.level,
        message: params.message,
        context: params.context ? JSON.stringify(params.context) : null,
        action: params.action || null,
        userId: params.userId || null,
        url: params.url || null,
        stack: params.stack || null,
      },
    });
  } catch {
    console.error("[LOGGER] Failed to write error log to database");
  }
}

export const logger = {
  debug(message: string, context?: LogContext & { action?: string; userId?: string; url?: string }) {
    if (!shouldLog("debug")) return;
    logToConsole("debug", message, context);
  },

  info(message: string, context?: LogContext & { action?: string; userId?: string; url?: string }) {
    if (!shouldLog("info")) return;
    logToConsole("info", message, context);
  },

  warn(message: string, context?: LogContext & { action?: string; userId?: string; url?: string }) {
    if (!shouldLog("warn")) return;
    logToConsole("warn", message, context);
    logToDatabase({ level: "warn", message, ...context });
  },

  error(message: string, context?: LogContext & { action?: string; userId?: string; url?: string; stack?: string }) {
    if (!shouldLog("error")) return;
    logToConsole("error", message, context);
    logToDatabase({ level: "error", message, ...context });
  },
};
