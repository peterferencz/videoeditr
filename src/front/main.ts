/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DrawFrame, getTimelineData, getTotalFrames, render } from '../core/Renderer'
import { SceneGenerator } from '../core/Scene'
import { setup as renderSetup } from '../core/Renderer'
import './style.scss'
import TimeLine from './timeline'

let resolution:[number,number]
let currentframe = 0
let totalframes = 0
let fps = 0
const rendering = false

export type setupConfig = {
    resolution: [number,number],
    fps:number,
    scenes:SceneGenerator[],
    background:string,
    rendering?: {
        output?: 'mp4'//|'mov'|'gif',
        quality?:number
    }
}

const canvas:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas')!
const ctx = canvas.getContext('2d')!

export function getConfig(){
    return {
        resolution: resolution,
        fps: fps,
        context: ctx
    }
}

export function setup(config:setupConfig){
    fps = config.fps
    resolution = config.resolution
    renderSetup(ctx, config)
    
    totalframes = getTotalFrames()

    //#region canvas
    canvas.width = resolution[0]
    canvas.height = resolution[1]
    function setupCanvas(){
        const canvascontainer = document.getElementById('preview')!

        if(canvascontainer.clientWidth / canvascontainer.clientHeight > resolution[0] / resolution[1] ){
            canvas.style.width = canvascontainer.clientHeight * resolution[0] / resolution[1] + 'px'
            canvas.style.height = canvascontainer.clientHeight + 'px'
        }else{
            canvas.style.width = canvascontainer.clientWidth + 'px'
            canvas.style.height = canvascontainer.clientWidth * resolution[1] / resolution[0] + 'px'
        }
    }
    window.addEventListener('resize', setupCanvas)
    //TODO when opening fresh tab, it resizez bad
    //#endregion

    //#region timeline
    const timeLineElement = document.getElementById('timeline')!
    const timeLineHoverElement = document.getElementById('timelinehover')!
    const timeline = new TimeLine(timeLineElement, getTimelineData(), {
        start:0,
        end:totalframes,
        view:0,
        backgroundTickCount: 10,
        canModifyView:true,
        canModifyOffset:true,
        showCurrentTime: true,
        currentTime:0,
        //TODO scaletext
        onClick: (e)=>{
            if(playing || rendering) return
            setCurrentFrame(Math.round(e.time))
        },
        // onViewChange: (val)=>val,
        // onOffsetChange: (val)=>val,
    })
    timeLineElement.addEventListener('mousemove', (e) => {
        timeLineHoverElement.style.left = `${e.clientX}px`
    })
    timeLineElement.addEventListener('mouseenter', () => {
        timeLineHoverElement.style.display = 'block'
    })
    timeLineElement.addEventListener('mouseleave', () => {
        timeLineHoverElement.style.display = 'none'
    })
    //#endregion

    window.addEventListener('keydown', e => {
        // console.log(e.key)
        if(rendering) return
        if(e.key == ' '){
            togglePlaying()
        }
        if(playing) return
        switch (e.key) {
        case 'ArrowLeft':
            setCurrentFrame(currentframe-1)
            break
        case 'ArrowRight':
            setCurrentFrame(currentframe+1)
            break
        case 'Home':
            setCurrentFrame(0)
            break
        case 'End':
            setCurrentFrame(totalframes)
            break
        case 'r':
            if(!e.ctrlKey) break
            setCurrentFrame(0)
            render()
            e.preventDefault()
            break
        default:
            break
        }
    })

    let playing = false
    window.addEventListener('blur', Pause)
    updatePlayingStatus(playing)
    function togglePlaying(){
        if(playing){
            Pause()
        }else{
            Play()
        }
    }
    let starttime = Date.now()
    let starttime_fps = Date.now()
    let framescount = 0
    const interval = 1000 / fps
    function Play(){
        if(playing) return
        playing = true
        updatePlayingStatus(playing)
        starttime = Date.now()

        animate()
    }
    function animate(){
        if(!playing) return
        requestAnimationFrame(animate)
        const dt = Date.now() - starttime

        //#region fps counting
        const dt_fps = Date.now() - starttime_fps
        if(dt_fps > 1000){
            actualFpsText.textContent = `[${framescount} fps]`
            starttime_fps = Date.now() - dt_fps % 1000
            framescount = 0
        }
        //#endregion

        if(dt < interval) return
        
        framescount++

        starttime = Date.now() - dt % interval
        if(currentframe >= totalframes){
            Pause()
            return
        }
        setCurrentFrame(currentframe+1)
    }
    function Pause(){
        if(!playing) return
        playing = false
        updatePlayingStatus(playing)
    }

    function setCurrentFrame(t:number){
        if(rendering) return
        currentframe = Math.max(0, Math.min(totalframes, t))
        timeline.setTime(currentframe)
        updateToolbar()

        DrawFrame(currentframe)
    }

    totalFrameText.textContent = `[${totalframes}]`
    totalTimeText.textContent = formattime(totalframes)

    setCurrentFrame(0)
    setupCanvas()
}



//#region toolbar
const currentTimeText = document.getElementById('currentTime')!
const currentFrameText = document.getElementById('currentFrame')!
const totalTimeText = document.getElementById('totalTime')!
const totalFrameText = document.getElementById('totalFrame')!
const playbackStatusText = document.getElementById('playingstatus')!
const actualFpsText = document.getElementById('actualfps')!
function updatePlayingStatus(playing:boolean){
    if(playing){
        playbackStatusText.textContent = '[Playing]'
        actualFpsText.style.display = 'block'
    }else{
        playbackStatusText.textContent = '[Paused]'
        actualFpsText.style.display = 'none'
    }
}
function updateToolbar() {
    currentTimeText.textContent = formattime(currentframe)
    currentFrameText.textContent = `[${currentframe}]`
}
function formattime(frame:number){
    const minutes = Math.floor(frame / fps / 60)
    const seconds = Math.floor(frame / 60 % 60)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2,'0')}`
}
//#endregion