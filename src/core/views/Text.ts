import { Color } from '../Color'
import { getFrames } from '../Time'
import { Vector2 } from '../Vector2'
import { View } from '../View'

export class Text implements View{
    position: Vector2
    text:string
    foreground:Color
    font:{size:number,emphasis?:'italic'|'bold',family:string,align:'left'|'center'|'right'}

    constructor(position: Vector2, text:string, font:{size:number,emphasis?:'italic'|'bold', family:string,align:'left'|'center'|'right'}, foreground:Color){
        this.position = position
        this.text = text
        this.foreground = foreground
        this.font = font
    }
    
    * typeIn(time:number){
        const frames = getFrames(time)
        const t = this.text
        for(let i = 0; i < frames+1; i++){
            this.text = t.slice(0, Math.floor(i/frames*t.length))
            yield
        }
        this.text = t
    }

    * typeOut(time:number) {
        const frames = getFrames(time)
        const t = this.text
        for(let i = frames; i > -1; i--){
            this.text = t.slice(0, Math.floor(i/frames*t.length))
            yield
        }
        this.text = ''
    }
    
    
    draw(ctx:CanvasRenderingContext2D): void {
        ctx.font = `${this.font.emphasis?this.font.emphasis:''} ${this.font.size}px ${this.font.family}`
        ctx.fillStyle = this.foreground.toString()
        ctx.textAlign = this.font.align
        ctx.fillText(this.text, this.position.x, this.position.y)
    }
    
}