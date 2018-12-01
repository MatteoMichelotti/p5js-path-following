class Vehicle {
    constructor(x, y) {
        this.maxSpeed = 1;//random(3,7);
        this.maxForce = 0.05;//random(0.3,0.5);

        this.position = createVector(x, y);
        this.velocity = createVector(1, 0);
        this.acceleration = createVector(0, 0);

    }

    run() {
        this.update();
        this.wrapBorder();
        this.display();
    }

    update() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    follow(path) {
        // Predict position 50 (arbitrary) frames ahead
        let predict = this.velocity.copy().normalize().mult(50);
        let predictedPosition = p5.Vector.add(this.position, predict);

        // Find closest normal to the path
        let normal = null;
        let target = null;
        let closest = 999999;
        let segmentEndTarget = null;
        const pathNodes = path.getNodes();

        for (let i = 0; i < pathNodes.length - 1; i++) {
            let segmentStart = pathNodes[i].copy();
            let segmentEnd = pathNodes[i + 1].copy();

            let dir = p5.Vector.sub(segmentEnd, segmentStart).normalize();

            let normalPoint = this.getNormal(predictedPosition, segmentStart, segmentEnd);
            if (normalPoint.x < segmentStart.x || normalPoint.x > segmentEnd.x)
                normalPoint = segmentEnd.copy();

            const normalDist = p5.Vector.dist(normalPoint, predictedPosition);
            if (normalDist < closest) {
                closest = normalDist;
                segmentEndTarget = segmentEnd.copy();
                normal = p5.Vector.add(normalPoint.copy(), dir);
            }
        }

        if (!path.isOnPath(closest)) {
            //determine target on path (even different segment), 20 frames in the future
            //target = ...
            // this.seek(target);
        }

        if (debug) {
            push();
            noFill();
            stroke(path.isOnPath(closest) ? 0 : 255, 0, 0);
            ellipse(predictedPosition.x, predictedPosition.y, 5, 5);
            line(normal.x, normal.y, predictedPosition.x, predictedPosition.y);
            ellipse(normal.x, normal.y, 5, 5);
            if (target)
                ellipse(target.x, target.y, 7, 7);
            pop();
        }
    }

    getNormal(p, start, end) {
        let start_end = p5.Vector.sub(end, start).normalize();
        let start_p = p5.Vector.sub(p, start);

        let projection = p5.Vector.mult(start_end, start_p.dot(start_end));
        let normalPoint = p5.Vector.add(start, projection);
        return normalPoint;
    }

    seek(target) {
        var desired = p5.Vector.sub(target, this.position).setMag(this.maxSpeed);
        var steer = p5.Vector.sub(desired, this.velocity).limit(this.maxForce);

        this.applyForce(steer);
    }

    wrapBorder() {
        if (this.position.x < 5) this.position.x = width - 5;
        if (this.position.x > (width - 5)) this.position.x = 5;
        if (this.position.y < 5) this.position.y = height - 5;
        if (this.position.y > (height - 5)) this.position.y = 5;
    }

    display() {
        fill(110);
        push();
        translate(this.position.x, this.position.y);
        rotate(this.velocity.heading());
        triangle(10, 0, -8, 5, -8, -5);
        pop();
    }
}