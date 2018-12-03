class Path {
    constructor(w, h) {
        this.nodes = [];
        this.radius = 20;

        this.width = w;
        this.height = h;
    }

    generateNodes(n){
        this.nodes = [];
        let xOffset = this.width/n;
        let noiseOffset = 0;
        const noiseX = random(50);

        for (let i=-1; i<=n; i++){
            this.addNode({ x: i*xOffset, y: map(noise(noiseX, noiseOffset), 0, 1, 0, this.height) });
            noiseOffset += 0.2;
        }
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