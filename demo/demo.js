const Canvas = ZE.Canvas;

const canvas = new Canvas('#container', {
    width: 600,
    height: 600
});

canvas.addShape('line', {
    attrs: {
        x1: 0,
        y1: 0,
        x2: 200,
        y2: 300,
        lineWidth: 3,
        strokeStyle: 'blank'
    }
});

canvas.addShape('line', {
    attrs: {
        x1: 100,
        y1: 100,
        x2: 150,
        y2: 50,
        lineWidth: 3,
        strokeStyle: 'blank'
    }
});

canvas.draw();
