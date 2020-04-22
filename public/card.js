// Represents a single card
class Card {
    constructor(suit, number) {
        this.suit = suit;
        this.number = number;
        this.x = 0;
        this.y = 0;
        this.w = 100;
        this.h = 100;
    }

    display(x, y, w, h) {
        this.drawCard(x, y, w, h);
    }

    shouldPlayCard() {
        return collidePointRect(mouseX, mouseY, this.x, this.y, this.w, this.h);
    }

    //edit to change look of cards
    drawCard(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.drawOutline();

        fill(255);
        textAlign(CENTER, CENTER);
        fill(0);
        textSize(this.h * .1)
        text(this.number, this.getBounds('topLeft').x, this.getBounds('topLeft').y, this.getBounds('topLeft').w);
        text(this.number, this.getBounds('topRight').x, this.getBounds('topRight').y, this.getBounds('topRight').w);
        text(this.number, this.getBounds('bottomLeft').x, this.getBounds('bottomLeft').y, this.getBounds('bottomLeft').w);
        text(this.number, this.getBounds('bottomRight').x, this.getBounds('bottomRight').y, this.getBounds('bottomRight').w);

        let suitBoundsTopLeft = this.getBounds('topLeft', 0, windowHeight * .02, windowHeight * .001);
        this.drawSuit(suitBoundsTopLeft.x, suitBoundsTopLeft.y, suitBoundsTopLeft.w, suitBoundsTopLeft.h);

        let suitBoundsBottomLeft = this.getBounds('bottomLeft', 0, -windowHeight * .08, windowHeight * .001);
        this.drawSuit(suitBoundsBottomLeft.x, suitBoundsBottomLeft.y, suitBoundsBottomLeft.w, suitBoundsBottomLeft.h);

        let suitBoundsTopRight = this.getBounds('topRight', 0, windowHeight * .02, windowHeight * .001);
        this.drawSuit(suitBoundsTopRight.x, suitBoundsTopRight.y, suitBoundsTopRight.w, suitBoundsTopRight.h);

        let suitBoundsBottomRight = this.getBounds('bottomRight', 0, -windowHeight * .08, windowHeight * .001);
        this.drawSuit(suitBoundsBottomRight.x, suitBoundsBottomRight.y, suitBoundsBottomRight.w, suitBoundsBottomRight.h);
    }

    drawOutline() {
        stroke(0);
        fill(255);
        strokeWeight(6);
        rect(this.x, this.y, this.w, this.h, this.h * 0.05);
        strokeWeight(2);
        stroke(255);
        rect(this.x + 2, this.y + 2, this.w - 4, this.h - 4, this.h * 0.05);
        strokeWeight(1);
    }


    drawSuit(x, y, w, h) {
        //use images if you don't want to draw with trigonometry...
        if (this.suit === 'diamonds') {
            fill(255, 0, 0);
            stroke(255, 0, 0);
            triangle(x - x * .02, y + h / 2, x + (w / 2), y, x * 1.02 + w, y + h / 2);
            triangle(x - x * .02, y + h / 2, x + (w / 2), h + y, x * 1.02 + w, y + h / 2);
        } else if (this.suit === 'hearts') {
            push();
            beginShape();
            fill(255, 0, 0);
            let numSteps = 50;
            let size = windowHeight * .002;
            for (var t = 0; t < 2 * PI; t += 2 * PI / numSteps) {
                var newX = 16 * pow(sin(t), 3);
                var newY = 13 * cos(t) - 5 * cos(2 * t) - 2 * cos(3 * t) - cos(4 * t);
                vertex((w / 2 + size * newX) + x, (h * .5 - size * (newY) * 1.2) + y);
            }
            endShape(CLOSE);
            pop();
        } else if (this.suit === 'spades') {
            push();
            beginShape();
            fill(0);
            let numSteps = 50;
            let size = windowHeight * .002;
            let leafH = h * .8;
            for (var t = 0; t < 2 * PI; t += 2 * PI / numSteps) {
                var newX = 16 * pow(sin(t), 3);
                var newY = 13 * cos(t) - 5 * cos(2 * t) - 2 * cos(3 * t) - cos(4 * t);
                vertex(w - (w / 2 + size * newX) + x * 1.001, leafH - (leafH / 2 - size * (newY)) + y);
            }
            endShape(CLOSE);
            pop();
            push();
            fill(0);
            stroke(0);
            strokeWeight(windowHeight * .005);
            let newStemX = x * 1.001;
            beginShape();
            vertex(newStemX + w / 3, y + h);
            quadraticVertex(newStemX + w / 2, y + h, newStemX + w / 2, y + h / 2);
            vertex(newStemX + w / 2, y + h / 2);
            quadraticVertex(newStemX + w / 2, y + h, newStemX + (w / 3) * 2, y + h);
            endShape(CLOSE)
            pop();
        } else if (this.suit === 'clubs') {
            push();
            beginShape();
            fill(0);
            stroke(0);
            ellipse(x + w / 2, y + h * .25, w * .8);
            ellipse(x + w / 2, y + h * .5, w * .4);
            ellipse(x + w * .1, y + h * .6, w * .8);
            ellipse(x + w * .9, y + h * .6, w * .8);
            endShape(CLOSE);
            pop();
            push();
            fill(0);
            stroke(0);
            strokeWeight(windowHeight * .005);
            let newStemX = x * 1.001;
            beginShape();
            vertex(newStemX + w / 3, y + h);
            quadraticVertex(newStemX + w / 2, y + h, newStemX + w / 2, y + h / 2);
            vertex(newStemX + w / 2, y + h / 2);
            quadraticVertex(newStemX + w / 2, y + h, newStemX + (w / 3) * 2, y + h);
            endShape(CLOSE)
            pop();
        }
    }

    //return rectangle in one of four positions relative to card
    getBounds(pos, x = 0, y = 0, scale = 1) {
        let bounds;
        if (pos == 'topLeft')
            bounds = { x: this.x + this.w * 0.1, y: this.y + this.h * 0.1, w: this.w * 0.2, h: this.h * .2 }
        else if (pos == 'topRight')
            bounds = { x: this.x + this.w * 0.7, y: this.y + this.h * 0.1, w: this.w * 0.2, h: this.h * .2 }
        else if (pos == 'bottomLeft')
            bounds = { x: this.x + this.w * 0.1, y: this.y + this.h * 0.9, w: this.w * 0.2, h: this.h * .2 }
        else if (pos == 'bottomRight')
            bounds = { x: this.x + this.w * 0.7, y: this.y + this.h * 0.9, w: this.w * 0.2, h: this.h * .2 }

        return { x: bounds.x + x, y: bounds.y + y, w: bounds.w * scale, h: bounds.h * scale };
    }
}