declare module 'wowjs' {
  export class WOW {
    constructor(options?: { live?: boolean; [key: string]: any });
    init(): void;
  }
  export default WOW;
}
