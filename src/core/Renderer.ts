import { getConfig, setupConfig } from '../front/main'
import { Gen, Scene, SceneGenerator, WorkingScene } from './Scene'
import { View } from './View'
import { Transition } from './Transition'
import { TimeLinRTDataElement } from '../front/timeline'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'

type flagTypes = {name:'transitioning',value:number}

let previousFrame = -1
let config:setupConfig
let scenes:WorkingScene[]
let ctx:CanvasRenderingContext2D

const ffmpeg = createFFmpeg({
    // log:true
})

export function setup(canvasContext:CanvasRenderingContext2D, setupConfig:setupConfig){
    config = setupConfig
    ctx = canvasContext
    setScenes(setupConfig.scenes)
}

export function getTotalFrames(){
    return scenes[scenes.length-1].to -1
}

export function getTimelineData():TimeLinRTDataElement[]{
    return scenes.map((s, i) => {
        const prevoisTransitionDuration = i == 0 ? 0 : scenes[i-1].transitionDuration || 0
        console
        return {
            from: s.from + prevoisTransitionDuration,
            to:s.to - (s.transitionDuration||0),
            falloffBefore: prevoisTransitionDuration,
            falloffAfter: s.transitionDuration||0,
            text: `Scene ${i+1}`
        }
    })
}

function isTransition(t:Transition|void): t is Transition{
    return (t as Transition) != undefined
}

export function getScenes():WorkingScene[]{
    return scenes
}

function setScenes(generators:SceneGenerator[]){
    const sceneobjects = generators.map(gen => new Scene(gen))
    const workingScenes = []

    let start = 0
    let transitionstart = 0
    let transition = undefined
    for(let i = 0; i < generators.length; i++){
        const currentGen = generators[i](sceneobjects[i])

        let j = start-1
        for(const val of currentGen){
            j++
            if(!isTransition(val)){ continue }
            
            //TODO if last scene, don't allow transition
            transitionstart = j
            transition = (val as Transition)
            const gen = transition(sceneobjects[i], sceneobjects[i+1], ctx)
            while(!gen.next().done){
                j++
            }
            break
        }
        if(!transition){
            transitionstart = j
        }
        
        sceneobjects[i].clearViews()
        workingScenes.push(new WorkingScene(sceneobjects[i], start, j, transition, j - transitionstart))
        //J = duration
        start = transitionstart
        transition = undefined
    }
    
    scenes = workingScenes
}

function clearScreen(){
    ctx.clearRect(0,0,config.resolution[0],config.resolution[1])
    ctx.fillStyle = config.background
    ctx.fillRect(0,0,config.resolution[0],config.resolution[1])
}

export function DrawFrame(frame:number){
    if(previousFrame == frame) {return}

    clearScreen()

    const currentScenes = scenes.filter(s => s.to > frame && s.from <= frame)
    if(currentScenes.length == 0){ console.error('Couldn\'t find scene for index ' + frame); return }
    
    currentScenes[0].scene.clearViews()
    const generator = currentScenes[0].scene.generator(currentScenes[0].scene)
    for (let i = 0; i < frame - currentScenes[0].from+1; i++) {
        generator.next()
    }
    
    if(currentScenes.length == 2){
        currentScenes[1].scene.clearViews()
        const generator = currentScenes[1].scene.generator(currentScenes[1].scene)
        for (let i = 0; i < frame - currentScenes[1].from+1; i++) {
            generator.next()
        }
    }

    if(currentScenes.length == 2 && currentScenes[0].transition && currentScenes[0].transitionDuration){
        const gen = currentScenes[0].transition(currentScenes[0].scene, currentScenes[1].scene, ctx)
        for(let i = 0; i < currentScenes[0].transitionDuration - currentScenes[0].to + frame + 1; i ++){
            clearScreen()
            gen.next()
        }
    }else{
        currentScenes[0].scene.drawViews(ctx)
    }

    previousFrame = frame
}

export async function render() {
    console.log('[RENDERER] Loading ffmpeg')
    await ffmpeg.load()
    
    console.log('[RENDERER] Rendering frames')
    for(let i = 0; i < getTotalFrames(); i++){
        DrawFrame(i)
        ffmpeg.FS('writeFile', `img${i.toString().padStart(5,'0')}.png`, await fetchFile(ctx.canvas.toDataURL('image/png', config.rendering?.quality || 1)))
    }
    
    console.log('[RENDERER] Putting frames together')
    await ffmpeg.run('-framerate', getConfig().fps.toString(), '-pattern_type', 'glob', '-i', '*.png', '-c:a', 'copy', '-shortest', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', 'out.' + (config.rendering?.output || 'mp4'))
    
    const data = ffmpeg.FS('readFile', 'out.' + (config.rendering?.output || 'mp4'))
    console.log(data)

    console.log('[RENDERER] Cleaning up')
    for(let i = 0; i < getTotalFrames(); i++){
        DrawFrame(i)
        ffmpeg.FS('unlink', `img${i.toString().padStart(5,'0')}.png`)
    }
    
    const blob = new Blob([data.buffer], {type: 'video/mp4'})
    const url = URL.createObjectURL(blob)
    console.log(url)
    window.open(url, '_blank')
    
    ffmpeg.FS('unlink', 'out.mp4')
}