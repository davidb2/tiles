export class Color {
  private _r: number;
  private _g: number;
  private _b: number;
  private _a: number;
  private _hexString: string;
  private _rgbaString: string;

  private static _red: Color = new Color(0xf4, 0x36, 0x43);
  private static _orange: Color = new Color(0xff, 0x00, 0x98);
  private static _yellow: Color = new Color(0xff, 0x3b, 0xeb);
  private static _green: Color = new Color(0x4c, 0x50, 0xaf);
  private static _blue: Color = new Color(0x21, 0xf3, 0x96);
  private static _indigo: Color = new Color(0x3f, 0xb5, 0x51);
  private static _violet: Color = new Color(0x9c, 0xb0, 0x27);
  private static _white: Color = new Color(0xff, 0xff, 0xff);
  private static _black: Color = new Color(0x00, 0x00, 0x00);

  static get Red(): Color { return Color._red; }
  static get Orange(): Color { return Color._orange; }
  static get Yellow(): Color { return Color._yellow; }
  static get Green(): Color { return Color._green; }
  static get Blue(): Color { return Color._blue; }
  static get Indigo(): Color { return Color._indigo; }
  static get Violet(): Color { return Color._violet; }
  static get White(): Color { return Color._white; }
  static get Black(): Color { return Color._black; }

  constructor(r: number, g: number, b: number, a: number = 0xff) {
    [r, g, b, a].forEach(color => 
      console.assert(
        0 <= color && color <= 0xff,
        'Hues must be in the interval [0, 255].' + [r, g, b, a]
      )
    );
    this._r = r;
    this._g = g;
    this._b = b;
    this._a = a;

    this._hexString = '#' + 
      [this._r, this._b, this._g]
        .map((c) => this.pad(c.toString(16)))
        .join('');
    
    this._rgbaString = 'rgba(' + [this._r, this._g, this._b, this._a].join() + ')';
  }

  public static *rainbow(k: number) {
    console.assert(0 <= 2 * k && 2 * k <= 24);
    const numColors = 1 << (2 * k);
    console.log(k, numColors);
    const x = 1 << (24 - 2 * k);
    for (let i = 0; i < numColors; i++) {
      const colorNum = i * x;
      const color = new Color((colorNum >> 0x10) & 0xff, (colorNum >> 0x8) & 0xff, colorNum & 0xff);
      console.log(i, x, colorNum);
      console.log(color);
      yield color;
    }
    console.log('finshed coloring');
  }

  public static *cycle(k: number) {
    console.assert(0 <= 2 * k && 2 * k <= 24);
    const numColors = 1 << (2 * k);
    
    for (let idx = 0; idx < numColors; idx++ ) {
      yield new Color(Math.floor(0xff * (idx / numColors)), 0, 0, 1);
    }

//    let idx = 0;
//    for (let b = 0; b < 0xff && idx < numColors; b++) {
//      for (let g = 0; g < 0xff && idx < numColors; g++) {
//        for (let r = 0; r < 0xff && idx < numColors; r++) {
//          for (let a = 0; a < 0xff && idx < numColors; a++) {
//            yield new Color(r, g, b, a);
//          }
//        }
//      }
//    }
  }

  public get hexString(): string {
    return this._hexString;
  }

  public get rgbaString(): string {
    return this._rgbaString;
  }

  private pad(num: string): string {
    return num.length === 2 ? num : '0' + num;
  }
}
