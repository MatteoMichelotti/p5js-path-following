class Vehicle {
    constructor(x, y) {
        this.maxSpeed = random(3,5);
        this.maxForce = random(0.2,0.3);

        this.position = createVector(x, y);
        this.velocity = createVector(2, 0);
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
        // Get nodes of path
        const pathNodes = path.getNodes();

        // Predict position 50 (arbitrary) frames ahead
        let predict = this.velocity.copy().normalize().mult(50);
        let predictedPosition = p5.Vector.add(this.position, predict);

        // Find closest normal to the path
        let normal = null;
        let target = null;
        let closest = 999999;

        for (let i = 0; i < pathNodes.length - 1; i++) {
            // Get edges of current segment of path
            let segmentStart = pathNodes[i].copy();
            let segmentEnd = pathNodes[i + 1].copy();

            // Find unity vector (direction) of segment
            let dir = p5.Vector.sub(segmentEnd, segmentStart).normalize();

            // Get normal point of predicted position on segment
            let normalPoint = this.getNormal(predictedPosition, segmentStart, segmentEnd);

            // If normal is not on segment, consider segment end as normal point
            if (normalPoint.x < segmentStart.x || normalPoint.x > segmentEnd.x)
                normalPoint = segmentEnd.copy();

            // Calculate distance of predicted point from path
            const normalDist = p5.Vector.dist(normalPoint, predictedPosition);
            if (normalDist < closest) {
                closest = normalDist;
                normal = normalPoint;

                target = p5.Vector.add(normalPoint.copy(), dir.mult(10));
            }
        }

        let isClosestOnPath = path.isOnPath(closest);
        if (!isClosestOnPath && target)
            this.seek(target);

        if (debug) {
            push();
            noFill();
            stroke(255);
            if (target)
                ellipse(target.x, target.y, 9,9);
            stroke(isClosestOnPath ? 0 : 255, 0, 0);
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
        let desired = p5.Vector.sub(target, this.position);
        if (desired.mag() === 0) return;
        desired.setMag(this.maxSpeed);

        const steer = p5.Vector.sub(desired, this.velocity).limit(this.maxForce);

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