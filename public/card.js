class Card {
    constructor(x, y, w, h, suit, number, text = '') {
        this.suit = suit;
        this.number = number;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.text = text;
    }

    display() {

        fill(color(this.suit));
        rect(this.x, this.y, this.w, this.h);
        fill(0);
        rect(this.x + 10, this.y + this.h - 70, this.w - 20, 60);
        textSize(40);
        fill(255);
        textAlign(CENTER);
        text(this.number, this.x + 10, this.y + this.h - 60, this.w - 20, 60);
        if (this.text != '') {
            fill(0);
            rect(this.x + 10, this.y + 50, this.w - 20, 20);
            fill(255)
            textSize(20);
            text(this.text, this.x + 10, this.y + 50, this.w - 20, 20);
        }
    }


    hitTest() {
        if (mouseX > this.x && mouseX < this.x + this.w &&
            mouseY > this.y && mouseY < this.h + this.y)
            return true;
        else
            return false;
    }

}