// Represents a single card
class Card {
    constructor(suit, number, spacing) {
        print('============');
        print(spacing);
        this.suit = suit;
        this.number = number;
        this.spacing = spacing;
        this.x = 0;
        this.y = 0;
        this.w = 100;
        this.h = 100;
        this.clubImg = loadImage('imgs/clubs.png');
        this.diamondImg = loadImage('imgs/diamonds.png');
        this.spadeImg = loadImage('imgs/spades.png');
        this.heartImg = loadImage('imgs/hearts.png');
    }

    display(x, y, w, h) {
        this.drawCard(x, y, w, h);
    }

    shouldPlayCard() {
        return collidePointRect(mouseX, mouseY, this.x, this.y, this.spacing, this.h);
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

        let suitBoundsTopLeft = this.getBounds('topLeft', 0, windowHeight * .02, min(windowHeight * .001, .8));
        this.drawSuit(suitBoundsTopLeft.x, suitBoundsTopLeft.y, suitBoundsTopLeft.w, suitBoundsTopLeft.h);

        let suitBoundsBottomLeft = this.getBounds('bottomLeft', 0, -windowHeight * .08, min(windowHeight * .001, .8));
        this.drawSuit(suitBoundsBottomLeft.x, suitBoundsBottomLeft.y, suitBoundsBottomLeft.w, suitBoundsBottomLeft.h);

        let suitBoundsTopRight = this.getBounds('topRight', 0, windowHeight * .02, min(windowHeight * .001, .8));
        this.drawSuit(suitBoundsTopRight.x, suitBoundsTopRight.y, suitBoundsTopRight.w, suitBoundsTopRight.h);

        let suitBoundsBottomRight = this.getBounds('bottomRight', 0, -windowHeight * .08, min(windowHeight * .001, .8));
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
        if (this.suit === 'diamonds') {
            image(this.diamondImg, x, y, w, h);
        } else if (this.suit === 'hearts') {
            image(this.heartImg, x, y, w, h);
        } else if (this.suit === 'spades') {
            image(this.spadeImg, x, y, w, h);
        } else if (this.suit === 'clubs') {
            image(this.clubImg, x, y, w, h);
        }
    }

    //return rectangle in one of four positions relative to card - with optional scaling
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