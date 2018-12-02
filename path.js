class Path {
    constructor() {
        this.nodes = [];
        this.radius = 10;
    }

    addNode(node) {
        this.nodes.push(createVector(node.x, node.y));
    }

    getNodes() {
        return this.nodes;
    }

    isOnPath(distance) {
        return distance <= this.radius;
    }

    display() {
        strokeWeight(this.radius * 2);
        stroke(235);
        for (let i = 0; i < this.nodes.length - 1; i++)
            line(this.nodes[i].x, this.nodes[i].y, this.nodes[i + 1].x, this.nodes[i + 1].y);

        strokeWeight(2);
        stroke(150);
        for (let i = 0; i < this.nodes.length - 1; i++)
            line(this.nodes[i].x, this.nodes[i].y, this.nodes[i + 1].x, this.nodes[i + 1].y);
    }
}