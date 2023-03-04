export function* waitFrames(n:number){
    for(let i = 0; i < n; i++){
        yield
    }
}

import { fps } from '../front/main'
export function* waitSeconds(n:number){
    for(let i = 0; i < n*fps; i++){
        yield
    }
}