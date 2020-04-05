class Card {
    constructor(x, y, w, h, suit, number) {
        this.suit = color(suit);
        print(this.colour);
        this.number = number;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    display() {
        fill(this.suit);
        rect(this.x, this.y, this.w, this.h);
        fill(0);
        rect(this.x + 10, this.y + this.h - 70, this.w - 20, 60);
        textSize(40);
        fill(255);
        textAlign(CENTER);
        text(this.number, this.x + 10, this.y + this.h - 60, this.w - 20, 60);
    }


    hitTest() {
        if (mouseX > this.x && mouseX < this.x + this.w &&
            mouseY > this.y && mouseY < this.h + this.y)
            return true;
        else
            return false;
    }

}