let vehicles = [];
let path;
let debug = false;

function setup() {
    createCanvas(800, 600);

    path = new Path();
    var pathNodes = [
        { x: 0, y: 150 },
        { x: 20, y: 160 },
        { x: 60, y: 230 },
        { x: 100, y: 340 },
        { x: 150, y: 380 },
        { x: 200, y: 355 },
        { x: 235, y: 280 },
        { x: 300, y: 200 },
        { x: 400, y: 150 },
        { x: 460, y: 160 },
        { x: 510, y: 310 },
        { x: 580, y: 350 },
        { x: 625, y: 310 },
        { x: 670, y: 210 },
        { x: 800, y: 150 },
    ];

    var singlePathNodes = [
        { x: 0, y: height / 3 },
        { x: width, y: height * 2 / 3 }
    ];

    pathNodes.forEach(function (node) {
        path.addNode(node);
    });
}

function draw() {
    background(255);
    path.display();
    vehicles.forEach(function (vehicle) {
        vehicle.follow(path);
        vehicle.run();
        vehicle.display();
    });
}

function mouseDragged() {
    if (0 < mouseX && mouseX < width && 0 < mouseY && mouseY < height)
        vehicles.push(new Vehicle(mouseX, mouseY));
}

function keyPressed() {
    if (key === "r") vehicles = [];
    if (key === "d") debug = !debug;
    return false;
}