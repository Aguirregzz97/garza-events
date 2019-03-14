import { IPrimitiveProperties } from './CustomActivity'

// tslint:disable:no-console
export class ConsoleLogger {
  private namespace: string

  constructor(namespace: string) {
    this.namespace = namespace
  }

  error(message: string) {
    console.error(`[${this.namespace}] [Error] ${message}`)
  }

  info(message: string) {
    console.log(`[${this.namespace}] [Info] ${message}`)
  }

  warn(message: string) {
    console.warn(`[${this.namespace}] [Warn] ${message}`)
  }

  logReportData(eventName: string, payload?: IPrimitiveProperties) {
    console.info(`[${this.namespace}] [${eventName}]`, payload ? payload : '')
  }
}
