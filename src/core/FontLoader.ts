export class FontLoader{
    static loadFont(name:string, url:string){
        const f = new FontFace(name, `url(${url})`)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        f.load().then(font => document.fonts.add(font))
    }
}