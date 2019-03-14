import { ConsoleLogger } from './ConsoleLogger'

export class Log {
  private static loggerInstance: ConsoleLogger = new ConsoleLogger('ETISYS')

  static get logger(): ConsoleLogger {
    return this.loggerInstance
  }
}
