const video=document.querySelector('.player');
const canvas=document.querySelector('.photo');
const ctx=canvas.getContext('2d');
const strip=document.querySelector('.strip');


function getVideo(){
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(e =>{
            
            video.srcObject=e;
            video.play();
        });
}

getVideo();

function paintToCanvas(){
    const height=video.videoHeight;
    const width=video.videoWidth;
    console.log(height,width);
    canvas.width=width;
    canvas.height=height;
    

    setInterval(()=>{
        ctx.drawImage(video, 0, 0, width, height);
        let pixels=ctx.getImageData(0,0,width,height);
        // pixels=redEffect(pixels);
        // pixels=rgbSplit(pixels);
        pixels=greenScreen(pixels);
        ctx.putImageData(pixels,0,0);

    },16);
}

function redEffect(pixels){
    for(let i=0;i<pixels.data.length;i+=4)
    {
        pixels.data[i]=pixels.data[i]+100;
        pixels.data[i+1]=pixels.data[i+1]-50;
        pixels.data[i+2]=pixels.data[i+2]-50;
    }
    return pixels;
}


function rgbSplit(pixels){
    for(let i=0;i<pixels.data.length;i+=4)
    {
        pixels.data[i+200]=pixels.data[i];
        pixels.data[i+300]=pixels.data[i+1];
        pixels.data[i-240]=pixels.data[i+2];
    }
    return pixels;
}

function greenScreen(pixels){
    const level={};
    document.querySelectorAll('.rgb input').forEach((input)=>{
        // console.log(input);
        level[input.name]=input.value;
    });
    for(let i=0;i<pixels.data.length;i+=4)
    {
        let red=pixels.data[i];
        let green=pixels.data[i+1];
        let blue=pixels.data[i+2];
        if(red>=level.rmin && red<=level.rmax && green>=level.gmin && green<=level.gmax && blue>=level.bmin && blue<=level.bmax)
        {
            pixels.data[i]=250;
            pixels.data[i+1]=250;
            pixels.data[i+2]=60;

        }
    }
    return pixels;
}


video.addEventListener('canplay',paintToCanvas)

function  takePhoto(){
    const data=canvas.toDataURL('image/jpeg');
    const link=document.createElement('a');
    link.href=data;
    link.setAttribute('download','shivam');
    link.innerHTML=`<img src="${data}"/>`;
    strip.insertBefore(link,strip.firstChild);

}