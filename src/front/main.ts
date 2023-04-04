/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DrawFrame, getTimelineData, getTotalFrames, render } from '../core/Renderer'
import { SceneGenerator } from '../core/Scene'
import { setup as renderSetup } from '../core/Renderer'
import './style.scss'
import TimeLine, { TimeLinRTDataElement } from './timeline'

let resolution:[number,number]
let currentframe = 0
let totalframes = 0
let fps = 0
const rendering = false
let timeline:TimeLine
let scenes:TimeLinRTDataElement[]

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

const canvascontainer = document.getElementById('preview')!
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
    scenes = getTimelineData()
    timeline = new TimeLine(timeLineElement, scenes, {
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
        case 'ArrowUp': {
            const el = scenes.find(s => s.from - s.falloffBefore < currentframe && s.to >= currentframe)
            setCurrentFrame(el ? el.from - el.falloffBefore : currentframe)
            break
        }
        case 'ArrowDown': {
            const el = scenes.find(s => s.from <= currentframe && s.to + s.falloffAfter > currentframe)
            setCurrentFrame(el ? el.to + el.falloffAfter : currentframe)
            break
        }
        case 'Home':
            setCurrentFrame(0)
            break
        case 'End':
            setCurrentFrame(totalframes)
            break
        case 's':
            if(!e.ctrlKey) break
            e.preventDefault()
            openShortcuts()
            break
        case 'Escape':
            closePopup()
            break
        case 'F1':
            openAbout()
            e.preventDefault()
            break
        case 'F11':
            toggleFullscreen()
            e.preventDefault()
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

    window.addEventListener('fullscreen', toggleFullscreen)

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

    
    totalFrameText.textContent = `[${totalframes}]`
    totalTimeText.textContent = formattime(totalframes)
    
    setCurrentFrame(0)
    setupCanvas()
}

function setCurrentFrame(t:number){
    if(rendering) return
    currentframe = Math.max(0, Math.min(totalframes, t))
    if(timeline) { timeline.setTime(currentframe) }
    updateToolbar()

    DrawFrame(currentframe)
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

//#region topbar
document.getElementById('top-openAbout')!.addEventListener('click', openAbout)
document.getElementById('top-openShortcuts')!.addEventListener('click', openShortcuts)
document.getElementById('top-render')!.addEventListener('click', render)
//#endregion

//#region popups
const popupcontainer = document.getElementById('popup')!
const popup_about = document.getElementById('about')!
const popup_shortcuts = document.getElementById('shortcuts')!
popupcontainer.addEventListener('click', (e) => {
    if(e.target != popupcontainer) return
    closePopup()
})
function openShortcuts(){
    popupcontainer.style.display = 'block'
    popup_about.style.display = 'none'
    popup_shortcuts.style.display = 'flex'
}
function openAbout(){
    popupcontainer.style.display = 'block'
    popup_about.style.display = 'flex'
    popup_shortcuts.style.display = 'none'
    
}
function closePopup(){
    popupcontainer.style.display = 'none'
}

let isFullscreen = false
function toggleFullscreen(){
    if(isFullscreen){
        exitFullscreen()
    }else{
        fullscreen()
    }
    isFullscreen = !isFullscreen
}
function fullscreen(){
    canvascontainer.requestFullscreen()
}
function exitFullscreen(){
    document.exitFullscreen()
}
//#endregion