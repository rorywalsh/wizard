class Button {
    constructor(x, y, w, h, text, colour) {
        this.colour =  color(colour);
        this.text = text;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    display() {
        var colour = this.colour;
        var resize = 0;
        if(this.hitTest()){
            if(mouseIsPressed){
                colour = color(red(this.colour)*.6, green(this.colour)*.6, blue(this.colour)*.6);
                resize = 2;
            }
            else
                colour = color(red(this.colour)*.9, green(this.colour)*.9, blue(this.colour)*.9);
        }

        textAlign(CENTER, CENTER);
        fill(colour);
        rect(this.x+resize/2, this.y+resize/2, this.w-resize, this.h-resize, 10); 
        textSize(this.h/3);
        fill(0);
        text(this.text, this.x+resize/2, this.y+resize/2, this.w-resize, this.h-resize);            
    }


    hitTest() {
        if (mouseX > this.x && mouseX < this.x + this.w &&
            mouseY > this.y && mouseY < this.h + this.y)
            return true;
        else
            return false;
    }


}