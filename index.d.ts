export { CommonsModule } from './commons.module';

declare global {
  // Override Array
  interface Array<T> {
    flatten(): any[]
  }
}