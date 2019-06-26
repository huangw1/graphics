const Canvas = g.Canvas;

const canvas = new Canvas('#container', {
    width : 600,
    height: 600
});

canvas.addShape('video', {
    attrs: {
        x: 190,
        y: 100,
        w: 224,
        h: 400,
        video: 'https://video.likevideo.cn/cn_live/cng4/M05/4C/47/GgAwAF0K_jSEb-d_AAAAAFYfuT8800.mp4?crc=3906596899&type=5&i=04e9cec8e4cb3f09f5a4&crc2=670120467&crc8=1044580152&crc16=1498866042&crc32=437390478',
    }
});

canvas.addShape('image', {
    attrs: {
        x: 254,
        y: 150,
        w: 92,
        h: 30,
        img: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png',
    }
});

const line1 = canvas.addShape('line', {
    attrs: {
        x1         : 100,
        y1         : 100,
        x2         : 500,
        y2         : 100,
    },
    style: {
        lineWidth  : 5,
        strokeStyle: 'green'
    },
    event: {
        click () {
            console.log('line1');
        }
    }
});

const text1 = canvas.addShape('text', {
    attrs: {
        x   : 300,
        y   : 40,
        text: '渲染'
    },
    style: {
        font: '20px Helvetica'
    },
    event: {
        click () {
            console.log('text1');
        }
    }
});

const circle1 = canvas.addShape('circle', {
    attrs: {
        x        : 100,
        y        : 100,
        r        : 100,
    },
    style: {
        fillStyle: 'yellow',
    },
    event: {
        click () {
            console.log('circle1');
        }
    }
});

const rect1 = canvas.addShape('rect', {
    attrs: {
        x: 200,
        y: 200,
        w: 200,
        h: 200,
        opacity: 0
    },
    event: {
        click () {
            console.log('rect1');
        }
    },
    style: {
        fillStyle: 'rgb(0, 0, 0)'
    },
    animate: {
        attrs   : {
            x: 250,
            y: 250,
            w: 100,
            h: 100,
            opacity: 1
        },
        style: {
            fillStyle: 'rgb(0, 0, 0)'
        },
        duration: 500,
        delay: 500,
        effect: 'bounceOut'
    }
});

const layer1 = canvas.addLayer({
    attrs: {
        x      : 100,
        y      : 100,
        opacity: 0.2
    }
});

const line2 = layer1.addShape('line', {
    attrs: {
        x1         : 0,
        y1         : 0,
        x2         : 0,
        y2         : 400,
    },
    style: {
        lineWidth  : 5,
        strokeStyle: 'red'
    },
    event: {
        click () {
            console.log('line2');
        }
    },
});

// rect1.on('click', () => {
//     console.log('rect1')
// });
//
// text1.on('click', () => {
//     console.log('text1')
// });
//
// circle1.on('click', () => {
//     console.log('circle1')
// });
//
// line1.on('click', () => {
//     console.log('line1')
// });
//
// line2.on('click', () => {
//     console.log('line2')
// });

canvas.draw();
