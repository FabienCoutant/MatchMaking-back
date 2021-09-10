

export const delay = (ms: number | undefined) => new Promise(res => setTimeout(res, ms));

export const wait = (ms:number)=>{
    const start = new Date().getTime();
    let end = start;
    console.log("test")
    while(end < start + ms) {
        end = new Date().getTime();
    }
}
