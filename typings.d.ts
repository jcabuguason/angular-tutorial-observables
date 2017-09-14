/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}
// Override Array
interface Array<T> {
  flatten(): any[]
}