import { lerpGen, easeQuadGen } from './Math'
import { getFrames } from './Time'

export class Vector2{
    x:number
    y:number

    constructor(x:number,y:number){
        this.x = x
        this.y = y
    }

    offset(x:number,y:number){
        this.x += x
        this.y += y
    }

    
    public get length() : number {
        return Math.sqrt(this.x**2+this.y**2)
    }

    normalize(){
        const len = this.length
        this.x /= len
        this.y /= len
        return this
    }
    

    * linear(x:number,y:number,time:number){
        const frames = getFrames(time)
        const genx = lerpGen(this.x,x,frames)
        const geny = lerpGen(this.y,y,frames)
        
        for(let i = 0; i < frames + 1; i++){
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.x = genx.next().value!
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.y = geny.next().value!
            yield
        }

        this.x = x
        this.y = y
    }

    * ease(x:number,y:number,time:number){
        const frames = getFrames(time)
        const genx = easeQuadGen(this.x,x,frames)
        const geny = easeQuadGen(this.y,y,frames)
    
        for(let i = 0; i < frames + 1; i++){
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.x = genx.next().value!
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.y = geny.next().value!
            yield
        }

        this.x = x
        this.y = y
    }

    copy(){
        return new Vector2(this.x, this.y)
    }

    static center(v1:Vector2, v2:Vector2){
        return new Vector2(v1.x+ (v1.x+v2.x)/2,v1.y+ (v1.y+v2.y)/2)
    }
}