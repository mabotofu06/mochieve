/**
 * ログレベル定義
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * 環境別ログ設定
 */
interface LogConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean; // 将来的なリモートログ送信用
}

/**
 * 環境別ログ設定
 */
const LOG_CONFIGS: Record<string, LogConfig> = {
  development: {
    level: 'debug',
    enableConsole: true,
    enableRemote: false
  },
  test: {
    level: 'warn',
    enableConsole: false,
    enableRemote: false
  },
  production: {
    level: 'error',
    enableConsole: false,
    enableRemote: true // 将来的にリモートログサービスと連携
  }
};

/**
 * ログレベルの優先度（数値が高いほど重要）
 */
const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

/**
 * 現在の環境設定を取得
 */
function getCurrentConfig(): LogConfig {
  const env = process.env.NODE_ENV || 'development';
  return LOG_CONFIGS[env] || LOG_CONFIGS.development;
}

/**
 * ログレベルが出力対象かチェック
 */
function shouldLog(level: LogLevel): boolean {
  const config = getCurrentConfig();
  return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[config.level];
}

/**
 * ログメッセージを整形
 */
function formatMessage(level: LogLevel, message: string, context?: string): string {
  const timestamp = new Date().toISOString();
  const contextStr = context ? `[${context}]` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${contextStr} ${message}`;
}

/**
 * コンソールに出力
 */
function outputToConsole(level: LogLevel, formattedMessage: string, data?: any): void {
  const config = getCurrentConfig();
  
  if (!config.enableConsole || !shouldLog(level)) {
    return;
  }

  switch (level) {
    case 'debug':
      console.debug(formattedMessage, data || '');
      break;
    case 'info':
      console.info(formattedMessage, data || '');
      break;
    case 'warn':
      console.warn(formattedMessage, data || '');
      break;
    case 'error':
      console.error(formattedMessage, data || '');
      break;
  }
}

/**
 * リモートログサービスに送信（将来的な拡張用）
 */
function outputToRemote(level: LogLevel, message: string, context?: string, data?: any): void {
  const config = getCurrentConfig();
  
  if (!config.enableRemote || !shouldLog(level)) {
    return;
  }

  // TODO: 将来的にリモートログサービス（Sentry、LogRocket等）と連携
  // 現在は何もしない
}

/**
 * ロガークラス
 */
export class Logger {
  private context?: string;

  constructor(context?: string) {
    this.context = context;
  }

  /**
   * デバッグレベルログ
   */
  debug(message: string, data?: any): void {
    const formattedMessage = formatMessage('debug', message, this.context);
    outputToConsole('debug', formattedMessage, data);
    outputToRemote('debug', message, this.context, data);
  }

  /**
   * 情報レベルログ
   */
  info(message: string, data?: any): void {
    const formattedMessage = formatMessage('info', message, this.context);
    outputToConsole('info', formattedMessage, data);
    outputToRemote('info', message, this.context, data);
  }

  /**
   * 警告レベルログ
   */
  warn(message: string, data?: any): void {
    const formattedMessage = formatMessage('warn', message, this.context);
    outputToConsole('warn', formattedMessage, data);
    outputToRemote('warn', message, this.context, data);
  }

  /**
   * エラーレベルログ
   */
  error(message: string, error?: Error | any): void {
    const formattedMessage = formatMessage('error', message, this.context);
    outputToConsole('error', formattedMessage, error);
    outputToRemote('error', message, this.context, error);
  }
}

/**
 * デフォルトロガーインスタンス
 */
export const logger = new Logger();

/**
 * コンテキスト付きロガーを作成
 */
export function createLogger(context: string): Logger {
  return new Logger(context);
}

/**
 * 便利メソッド（従来のconsole.logの代替）
 */
export const log = {
  debug: (message: string, data?: any) => logger.debug(message, data),
  info: (message: string, data?: any) => logger.info(message, data),
  warn: (message: string, data?: any) => logger.warn(message, data),
  error: (message: string, error?: Error | any) => logger.error(message, error)
};