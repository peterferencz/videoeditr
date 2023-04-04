import { Color } from '../Color'
import { paletteManager } from '../Palettemanager'
import { getFrames } from '../Time'
import { Vector2 } from '../Vector2'
import { View } from '../View'

type TextAlign = 'left'|'center'|'right'

export class Text implements View{
    position: Vector2
    text:string
    actualtext:string
    foreground:{c:Color,i:number}[]
    font:{size:number,emphasis?:'italic'|'bold',family:string,align:TextAlign}

    constructor(position: Vector2, text:string, foreground?:Color, font?:{size?:number,emphasis?:'italic'|'bold', family?:string,align?:TextAlign}){
        const palette = paletteManager.getCurrentPalette()
        this.position = position
        this.text = ''
        this.actualtext = ''
        this.foreground = [{c:foreground||palette.text.color,i:0}]

        if(font?.size != undefined){
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            font.size = palette.text[`size_${font.size == 0 ? 'p' : 'h'+font.size}`]
        }
        this.font = Object.assign({size:0, align:palette.text.align, family:palette.text.font}, font)

        const colorstack = [this.foreground[0].c]
        for(let i = 0; i < text.length; i++){
            if(text[i] != '<') {
                this.text += text[i]
                continue
            }

            if(text.substring(i+1, i+7) == 'color='){
                const textIndex = this.text.length
                i+=11 // skip 'color=rgba('
                const colorParseStart = i
                while(text[i++] != ')'){/**/}

                const colorArr = text.substring(colorParseStart+1,i-1).split(',')
                if(colorArr.length != 4){ throw new Error('Invalid color: please use the supplied color object') }
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const color = new Color(...colorArr.map(v=>parseFloat(v)))
                colorstack.push(color)
                this.foreground.push({c:color, i:textIndex})
            }else if(text.substring(i+1, i+8) == '/color>'){
                if(colorstack.length == 1){
                    throw new Error('Invalid color closing tag: no opening tag to close')
                }else{
                    colorstack.pop()
                    this.foreground.push({i:this.text.length,c:colorstack[colorstack.length-1]})
                    i += 7
                }
            }
        }
        this.actualtext = this.text
    }
    
    * typeIn(time:number){
        const frames = getFrames(time)
        for(let i = 0; i < frames+1; i++){
            this.text = this.actualtext.slice(0, Math.floor(i/frames*this.actualtext.length))
            yield
        }
        this.text = this.actualtext
    }

    * typeOut(time:number) {
        const frames = getFrames(time)
        for(let i = frames; i > -1; i--){
            this.text = this.actualtext.slice(0, Math.floor(i/frames*this.actualtext.length))
            yield
        }
        this.text = ''
    }
    
    draw(ctx:CanvasRenderingContext2D): void {
        ctx.font = `${this.font.emphasis?this.font.emphasis:''} ${this.font.size}px ${this.font.family}`
        const measure = ctx.measureText(this.text)
        let x = this.font.align == 'left' ? this.position.x :
            this.font.align == 'center' ? this.position.x - measure.width/2 :
                this.font.align == 'right' ? this.position.x - measure.width : 0
        for(let i = 0; i < this.text.length; i++){
            ctx.fillStyle = this.foreground.findLast(el => el.i <= i )?.c.toString() || 'red'
            ctx.fillText(this.text[i], x, this.position.y + this.font.size / 4)
            x += ctx.measureText(this.text[i]).width
        }
    }
    
}