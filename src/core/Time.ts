import { getConfig } from '../front/main'

export function getFrames(seconds:number){
    return getConfig().fps * seconds
}

export function* waitFrames(n:number, after?:Generator<unknown,unknown>){
    for(let i = 0; i < n; i++){
        yield
    }

    if(after == null) { return }
    while(!after.next().done){
        yield
    }
}

export function* waitSeconds(n:number, after?:Generator<unknown,unknown>){
    for(let i = 0; i < n*getConfig().fps; i++){
        yield
    }

    if(after == null) { return }
    while(!after.next().done){
        yield
    }
}

export function* all(...generators:Generator<unknown,unknown>[]){
    while(generators.length > 0){
        generators = generators.filter(val => !val.next().done)
        yield
    }
}

export function* sequence(...generators:Generator<unknown,unknown>[]){
    for(let i = 0; i < generators.length; i++){
        while(!generators[i].next().done){ yield }
    }
}

export function* generate(times:number, callback:(i:number)=>void){
    for(let i = 0; i < times; i ++){
        callback(i)
        yield
    }
}