// Represents a single card

class Card {
    constructor(x, y, w, h, suit, number, text = "") {
        this.suit = suit;
        this.number = number;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.text = text;
    }

    display(x, y, w, h) {
        drawCard(x, y, w, h);
    }

    hitTest() {
        return collidePointRect(mouseX, mouseY, this.x, this.y, this.w, this.h);
    }

    //edit to change lokk of cards
    drawCard() {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        stroke(0);
        fill(color(this.suit));
        strokeWeight(6);
        rect(this.x, this.y, this.w, this.h, this.h * 0.05);
        strokeWeight(2);
        stroke(255);
        rect(this.x + 2, this.y + 2, this.w - 4, this.h - 4, this.h * 0.05);
        strokeWeight(1);
        fill(255);
        textAlign(CENTER, CENTER);
        if (this.number != "Trump") {
            fill(255);
            stroke(0);
            ellipse(
                this.x + this.w * 0.2,
                this.y + this.h * 0.15,
                this.w * 0.25
            );
            ellipse(
                this.x + this.w * 0.8,
                this.y + this.h * 0.15,
                this.w * 0.25
            );
            ellipse(
                this.x + this.w * 0.2,
                this.y + this.h * 0.85,
                this.w * 0.25
            );
            ellipse(
                this.x + this.w * 0.8,
                this.y + this.h * 0.85,
                this.w * 0.25
            );
            fill(0);
            text(
                this.number,
                this.x + this.w * 0.1,
                this.y + this.h * 0.1672,
                this.w * 0.25
            );
            text(
                this.number,
                this.x + this.w * 0.7,
                this.y + this.h * 0.1672,
                this.w * 0.25
            );
            text(
                this.number,
                this.x + this.w * 0.1,
                this.y + this.h * 0.86,
                this.w * 0.25
            );
            text(
                this.number,
                this.x + this.w * 0.7,
                this.y + this.h * 0.86,
                this.w * 0.25
            );
        } else {
            fill(40);
            textSize(this.h * .1);
            // print(this.h * .1);
            rect(
                this.x + this.w * 0.1,
                this.y + this.h - this.h * 0.35,
                this.w - this.w * 0.2,
                this.h * 0.1,
                this.h * 0.1
            );
            fill(255);
            text(
                this.number,
                this.x + this.w * 0.1,
                this.y + this.h - this.h * 0.35,
                this.w - this.w * 0.2,
                this.h * 0.1
            );
        }

    }

}
