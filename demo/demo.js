const Canvas = g.Canvas;

const canvas = new Canvas('#container', {
    width : 600,
    height: 600
});

const line1 = canvas.addShape('line', {
    attrs: {
        x1         : 100,
        y1         : 100,
        x2         : 500,
        y2         : 100,
        lineWidth  : 5,
        strokeStyle: 'green'
    }
});

const rect1 = canvas.addShape('rect', {
    attrs: {
        x: 200,
        y: 200,
        w: 200,
        h: 200,
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
        lineWidth  : 5,
        strokeStyle: 'red'
    }
});

rect1.on('click', () => {
    console.log('rect1')
});

line1.on('click', () => {
    console.log('line1')
});

line2.on('click', () => {
    console.log('line2')
});

canvas.draw();
