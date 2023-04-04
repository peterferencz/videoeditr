/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { lerpGen, easeQuadGen } from './Math'
import { getFrames } from './Time'

export class Color{
    red:number
    green:number
    blue:number
    alpha:number
    
    constructor(red:number, green:number, blue:number, alpha:number){
        this.red = red
        this.green = green
        this.blue = blue
        this.alpha = alpha
    }

    toString(){
        return `rgba(${this.red},${this.green},${this.blue},${this.alpha})`
    }

    * linear(to:Color, time:number){
        const frames = getFrames(time)
        const genR = lerpGen(this.red, to.red, frames)
        const genG = lerpGen(this.green, to.green, frames)
        const genB = lerpGen(this.blue, to.blue, frames)
        const genA = lerpGen(this.alpha, to.alpha, frames)

        for(let i = 0; i < frames + 1; i++){
            this.red = genR.next().value!
            this.green = genG.next().value!
            this.blue = genB.next().value!
            this.alpha = genA.next().value!
            yield
        }

        this.red = to.red
        this.green = to.green
        this.blue = to.blue
        this.alpha = to.alpha
    }
    
    * ease(to:Color, time:number){
        const frames = getFrames(time)
        const genR = easeQuadGen(this.red, to.red, frames)
        const genG = easeQuadGen(this.green, to.green, frames)
        const genB = easeQuadGen(this.blue, to.blue, frames)
        const genA = easeQuadGen(this.alpha, to.alpha, frames)

        for(let i = 0; i < frames + 1; i++){
            this.red = genR.next().value!
            this.green = genG.next().value!
            this.blue = genB.next().value!
            this.alpha = genA.next().value!
            yield
        }

        this.red = to.red
        this.green = to.green
        this.blue = to.blue
        this.alpha = to.alpha
    }

    * easeIn(time:number, force=true){
        const frames = getFrames(time)
        const alpha = easeQuadGen(force?0:this.alpha,1,frames)

        for(let i = 0; i < frames + 1; i++){
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.alpha = alpha.next().value!
            yield
        }

        this.alpha = 1
    }
    
    * easeOut(time:number, force=true){
        const frames = getFrames(time)
        const alpha = easeQuadGen(force?this.alpha:1,0,frames)

        for(let i = 0; i < frames + 1; i++){
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.alpha = alpha.next().value!
            yield
        }

        this.alpha = 0
    }
    
    * lerpIn(time:number, force=true){
        const frames = getFrames(time)
        const alpha = lerpGen(force?0:this.alpha,1,frames)

        for(let i = 0; i < frames + 1; i++){
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.alpha = alpha.next().value!
            yield
        }

        this.alpha = 1
    }
    
    * lerpOut(time:number, force=true){
        const frames = getFrames(time)
        const alpha = lerpGen(force?this.alpha:1,0,frames)

        for(let i = 0; i < frames + 1; i++){
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.alpha = alpha.next().value!
            yield
        }

        this.alpha = 0
    }

    //#region Colors
    static get Transparent() { return new Color(255,255,255,0) }
    static get Maroon() { return new Color(128,0,0,1) }
    static get DarkRed() { return new Color(139,0,0,1) }
    static get Brown() { return new Color(165,42,42,1) }
    static get Firebrick() { return new Color(178,34,34,1) }
    static get Crimson() { return new Color(220,20,60,1) }
    static get Red() { return new Color(255,0,0,1) }
    static get Tomato() { return new Color(255,99,71,1) }
    static get Coral() { return new Color(255,127,80,1) }
    static get IndianRed() { return new Color(205,92,92,1) }
    static get LightCoral() { return new Color(240,128,128,1) }
    static get DarkSalmon() { return new Color(233,150,122,1) }
    static get Salmon() { return new Color(250,128,114,1) }
    static get LightSalmon() { return new Color(255,160,122,1) }
    static get OrangeRed() { return new Color(255,69,0,1) }
    static get DarkOrange() { return new Color(255,140,0,1) }
    static get Orange() { return new Color(255,165,0,1) }
    static get Gold() { return new Color(255,215,0,1) }
    static get DarkGoldenRod() { return new Color(184,134,11,1) }
    static get GoldenRod() { return new Color(218,165,32,1) }
    static get PaleGoldenRod() { return new Color(238,232,170,1) }
    static get DarkKhaki() { return new Color(189,183,107,1) }
    static get Khaki() { return new Color(240,230,140,1) }
    static get Olive() { return new Color(128,128,0,1) }
    static get Yellow() { return new Color(255,255,0,1) }
    static get YellowGreen() { return new Color(154,205,50,1) }
    static get DarkOliveGreen() { return new Color(85,107,47,1) }
    static get OliveDrab() { return new Color(107,142,35,1) }
    static get LawnGreen() { return new Color(124,252,0,1) }
    static get Chartreuse() { return new Color(127,255,0,1) }
    static get GreenYellow() { return new Color(173,255,47,1) }
    static get DarkGreen() { return new Color(0,100,0,1) }
    static get Green() { return new Color(0,128,0,1) }
    static get ForestGreen() { return new Color(34,139,34,1) }
    static get Lime() { return new Color(0,255,0,1) }
    static get LimeGreen() { return new Color(50,205,50,1) }
    static get LightGreen() { return new Color(144,238,144,1) }
    static get PaleGreen() { return new Color(152,251,152,1) }
    static get DarkSeaGreen() { return new Color(143,188,143,1) }
    static get MediumSpringGreen() { return new Color(0,250,154,1) }
    static get SpringGreen() { return new Color(0,255,127,1) }
    static get SeaGreen() { return new Color(46,139,87,1) }
    static get MediumAquaMarine() { return new Color(102,205,170,1) }
    static get MediumSeaGreen() { return new Color(60,179,113,1) }
    static get LightSeaGreen() { return new Color(32,178,170,1) }
    static get DarkSlateGray() { return new Color(47,79,79,1) }
    static get Teal() { return new Color(0,128,128,1) }
    static get DarkCyan() { return new Color(0,139,139,1) }
    static get Aqua() { return new Color(0,255,255,1) }
    static get Cyan() { return new Color(0,255,255,1) }
    static get LightCyan() { return new Color(224,255,255,1) }
    static get DarkTurquoise() { return new Color(0,206,209,1) }
    static get Turquoise() { return new Color(64,224,208,1) }
    static get MediumTurquoise() { return new Color(72,209,204,1) }
    static get PaleTurquoise() { return new Color(175,238,238,1) }
    static get AquaMarine() { return new Color(127,255,212,1) }
    static get PowderBlue() { return new Color(176,224,230,1) }
    static get CadetBlue() { return new Color(95,158,160,1) }
    static get SteelBlue() { return new Color(70,130,180,1) }
    static get CornFlowerBlue() { return new Color(100,149,237,1) }
    static get DeepSkyBlue() { return new Color(0,191,255,1) }
    static get DodgerBlue() { return new Color(30,144,255,1) }
    static get LightBlue() { return new Color(173,216,230,1) }
    static get SkyBlue() { return new Color(135,206,235,1) }
    static get LightSkyBlue() { return new Color(135,206,250,1) }
    static get MidnightBlue() { return new Color(25,25,112,1) }
    static get Navy() { return new Color(0,0,128,1) }
    static get DarkBlue() { return new Color(0,0,139,1) }
    static get MediumBlue() { return new Color(0,0,205,1) }
    static get Blue() { return new Color(0,0,255,1) }
    static get RoyalBlue() { return new Color(65,105,225,1) }
    static get BlueViolet() { return new Color(138,43,226,1) }
    static get Indigo() { return new Color(75,0,130,1) }
    static get DarkSlateBlue() { return new Color(72,61,139,1) }
    static get SlateBlue() { return new Color(106,90,205,1) }
    static get MediumSlateBlue() { return new Color(123,104,238,1) }
    static get MediumPurple() { return new Color(147,112,219,1) }
    static get DarkMagenta() { return new Color(139,0,139,1) }
    static get DarkViolet() { return new Color(148,0,211,1) }
    static get DarkOrchid() { return new Color(153,50,204,1) }
    static get MediumOrchid() { return new Color(186,85,211,1) }
    static get Purple() { return new Color(128,0,128,1) }
    static get Thistle() { return new Color(216,191,216,1) }
    static get Plum() { return new Color(221,160,221,1) }
    static get Violet() { return new Color(238,130,238,1) }
    static get Magenta() { return new Color(255,0,255,1) }
    static get Fuchsia() { return new Color(255,0,255,1) }
    static get Orchid() { return new Color(218,112,214,1) }
    static get MediumVioletRed() { return new Color(199,21,133,1) }
    static get PaleVioletRed() { return new Color(219,112,147,1) }
    static get DeepPink() { return new Color(255,20,147,1) }
    static get HotPink() { return new Color(255,105,180,1) }
    static get LightPink() { return new Color(255,182,193,1) }
    static get Pink() { return new Color(255,192,203,1) }
    static get AntiqueWhite() { return new Color(250,235,215,1) }
    static get Beige() { return new Color(245,245,220,1) }
    static get Bisque() { return new Color(255,228,196,1) }
    static get BlanchedAlmond() { return new Color(255,235,205,1) }
    static get Wheat() { return new Color(245,222,179,1) }
    static get CornSilk() { return new Color(255,248,220,1) }
    static get LemonChiffon() { return new Color(255,250,205,1) }
    static get LightGoldenRodYellow() { return new Color(250,250,210,1) }
    static get LightYellow() { return new Color(255,255,224,1) }
    static get SaddleBrown() { return new Color(139,69,19,1) }
    static get Sienna() { return new Color(160,82,45,1) }
    static get Chocolate() { return new Color(210,105,30,1) }
    static get Peru() { return new Color(205,133,63,1) }
    static get SandyBrown() { return new Color(244,164,96,1) }
    static get BurlyWood() { return new Color(222,184,135,1) }
    static get Tan() { return new Color(210,180,140,1) }
    static get RosyBrown() { return new Color(188,143,143,1) }
    static get Moccasin() { return new Color(255,228,181,1) }
    static get NavajoWhite() { return new Color(255,222,173,1) }
    static get PeachPuff() { return new Color(255,218,185,1) }
    static get MistyRose() { return new Color(255,228,225,1) }
    static get LavenderBlush() { return new Color(255,240,245,1) }
    static get Linen() { return new Color(250,240,230,1) }
    static get OldLace() { return new Color(253,245,230,1) }
    static get PapayaWhip() { return new Color(255,239,213,1) }
    static get SeaShell() { return new Color(255,245,238,1) }
    static get MintCream() { return new Color(245,255,250,1) }
    static get SlateGray() { return new Color(112,128,144,1) }
    static get LightSlateGray() { return new Color(119,136,153,1) }
    static get LightSteelBlue() { return new Color(176,196,222,1) }
    static get Lavender() { return new Color(230,230,250,1) }
    static get FloralWhite() { return new Color(255,250,240,1) }
    static get AliceBlue() { return new Color(240,248,255,1) }
    static get GhostWhite() { return new Color(248,248,255,1) }
    static get Honeydew() { return new Color(240,255,240,1) }
    static get Ivory() { return new Color(255,255,240,1) }
    static get Azure() { return new Color(240,255,255,1) }
    static get Snow() { return new Color(255,250,250,1) }
    static get Black() { return new Color(0,0,0,1) }
    static get DimGray() { return new Color(105,105,105,1) }
    static get DimGrey() { return new Color(105,105,105,1) }
    static get Gray() { return new Color(128,128,128,1) }
    static get Grey() { return new Color(128,128,128,1) }
    static get DarkGray() { return new Color(169,169,169,1) }
    static get DarkGrey() { return new Color(169,169,169,1) }
    static get Silver() { return new Color(192,192,192,1) }
    static get LightGray() { return new Color(211,211,211,1) }
    static get LightGrey() { return new Color(211,211,211,1) }
    static get Gainsboro() { return new Color(220,220,220,1) }
    static get WhiteSmoke() { return new Color(245,245,245,1) }
    static get White() { return new Color(255,255,255,1) }
    //#endregion
}