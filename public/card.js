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

    hitTest() {
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
        text(this.number, this.getBounds('topLeft').x, this.getBounds('topLeft').y, this.getBounds('topLeft').w);
        text(this.number, this.getBounds('topRight').x, this.getBounds('topRight').y, this.getBounds('topRight').w);
        text(this.number, this.getBounds('bottomLeft').x, this.getBounds('bottomLeft').y, this.getBounds('bottomLeft').w);
        text(this.number, this.getBounds('bottomRight').x, this.getBounds('bottomRight').y, this.getBounds('bottomRight').w);

        let suitBoundsTopLeft = this.getBounds('topLeft', -windowWidth * .003, windowHeight * .02, 0, -windowHeight * 0.02);
        this.drawSuit(suitBoundsTopLeft.x, suitBoundsTopLeft.y, suitBoundsTopLeft.w, suitBoundsTopLeft.h);

        let suitBoundsBottomLeft = this.getBounds('bottomLeft', -windowWidth * .003, -windowHeight * .09, 0, -windowHeight * 0.02);
        this.drawSuit(suitBoundsBottomLeft.x, suitBoundsBottomLeft.y, suitBoundsBottomLeft.w, suitBoundsBottomLeft.h);

        let suitBoundsTopRight = this.getBounds('topRight', -windowWidth * .003, windowHeight * .02, 0, -windowHeight * 0.02);
        this.drawSuit(suitBoundsTopRight.x, suitBoundsTopRight.y, suitBoundsTopRight.w, suitBoundsTopRight.h);

        let suitBoundsBottomRight = this.getBounds('bottomRight', -windowWidth * .003, -windowHeight * .09, 0, -windowHeight * 0.02);
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
        //only draws diamonds for now...
        fill(0);
        stroke(0);
        triangle(x, y + h / 2, x + (w / 2), y, x + w, y + h / 2);
        triangle(x, y + h / 2, x + (w / 2), h + y, x + w, y + h / 2);
    }

    //return rectangle in one of four positions relative to card
    getBounds(pos, x = 0, y = 0, w = 0, h = 0) {
        let bounds;
        if (pos == 'topLeft')
            bounds = { x: this.x + this.w * 0.1, y: this.y + this.h * 0.1, w: this.w * 0.25, h: this.h * .25 }
        else if (pos == 'topRight')
            bounds = { x: this.x + this.w * 0.7, y: this.y + this.h * 0.1, w: this.w * 0.25, h: this.h * .25 }
        else if (pos == 'bottomLeft')
            bounds = { x: this.x + this.w * 0.1, y: this.y + this.h * 0.9, w: this.w * 0.25, h: this.h * .25 }
        else if (pos == 'bottomRight')
            bounds = { x: this.x + this.w * 0.7, y: this.y + this.h * 0.9, w: this.w * 0.25, h: this.h * .25 }

        return { x: bounds.x + x, y: bounds.y + y, w: bounds.w + w, h: bounds.h + h };
    }
}