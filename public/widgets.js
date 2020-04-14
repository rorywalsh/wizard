class Button {
    constructor(
        type,
        text,
        innerColour,
        outlineColour,
        textColour,
        lerpColour
    ) {
        this.type = type;
        this.innerColour = innerColour;
        this.outlineColour = outlineColour;
        this.textColour = textColour;
        this.lerpColour = lerpColour;
        this.focus = false;
        this.text = text;
        this.incr = 0;
        // this.x = x;
        // this.y = y;
        // this.w = w;
        // this.h = h;
    }

    display(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        let a = 0;
        textSize(30);
        var colour = this.innerColour;
        var resize = 0;
        if (this.focus == true) {
            a = sin(this.incr);
            this.incr += 0.1;
        } else {
            a = 0;
        }

        if (this.hitTest()) {
            if (mouseIsPressed) {
                colour = color(
                    red(this.innerColour) * 0.6,
                    green(this.innerColour) * 0.6,
                    blue(this.innerColour) * 0.6
                );
                resize = 3;
            } else
                colour = color(
                    red(this.innerColour) * 0.9,
                    green(this.innerColour) * 0.9,
                    blue(this.innerColour) * 0.9
                );
        }

        textAlign(CENTER, CENTER);
        ellipseMode(CENTER);
        strokeWeight(windowWidth * .005);
        stroke(this.outlineColour);
        if (this.focus == true) {
            // print(a);
            colour = lerpColor(this.innerColour, this.lerpColour, abs(a));
        }


        fill(colour);
        ellipse(
            this.x + resize / 2,
            this.y + resize / 2,
            this.r - resize
        );


        fill(0);
        if (this.text != "+" && this.text != "-") {
            fill(255);
            textSize(60);
            textStyle(BOLD);
            strokeWeight(0);
            text(
                this.text,
                this.x - this.r / 2,
                this.y - this.r / 2,
                this.r + resize,
                this.r + resize
            );
        } else if (this.text == "+") {
            fill(255);
            strokeWeight(0);
            rect(
                this.x - this.r / 2 + windowWidth * 0.01 + resize * .3,
                this.y - this.r * .05 + resize * .3,
                this.r * .6 + resize * .3,
                this.r * 0.1 + resize * .3
            );
            rect(
                this.x - this.r * .05 + resize * .3,
                this.y - this.r * .3 + resize * .3,
                this.r * 0.1 + resize * .3,
                this.r * 0.6 + resize * .3
            );
        } else if (this.text = '-') {
            fill(255);
            strokeWeight(0);
            rect(
                this.x - this.r / 2 + windowWidth * 0.01 + resize * .3,
                this.y - this.r * .05 + resize * .3,
                this.r * .6 + resize * .3,
                this.r * 0.1 + resize * .3
            );
        }
        textSize(30);
    }

    hitTest() {
        return collidePointCircle(mouseX, mouseY, this.x, this.y, this.r);
    }
}

class LeaderBoard {
    constructor(players) {
        this.players = players;
    }

    display(x, y, w, h) {
        fill(0, 100, 0);
        stroke(40);

        strokeWeight(w * 0.01);
        rect(x, y, w, h, h * 0.05);

        //horizontal lines
        line(x, y + h * 0.3, x + w, y + h * 0.3);

        //vertical lines
        for (var i = w / 3; i < w; i += w / 3) {
            line(x + i, y, x + i, y + h);
        }

        for (var i = 0; i < this.players.length; i++) {
            strokeWeight(w * 0.01);
            line(
                x,
                y + h * 0.3 + i * ((h * 0.7) / this.players.length),
                x + w,
                y + h * 0.3 + i * ((h * 0.7) / this.players.length)
            );
            fill(255);
            strokeWeight(2);
            //print(this.players[i].name);
            text(
                this.players[i].name == '' ? 'Player ' + this.players[i].number : this.players[i].name,
                x,
                y + h * 0.3 + i * ((h * 0.7) / this.players.length),
                w / 3,
                (h * 0.7) / this.players.length
            );
            text(
                this.players[i].bid == -1 ? "-" : this.players[i].bid,
                x + w / 3,
                y + h * 0.3 + (i * (h * 0.7)) / this.players.length,
                w / 3,
                (h * 0.7) / this.players.length
            );
            text(
                this.players[i].score,
                x + (w / 3) * 2,
                y + h * 0.3 + (i * (h * 0.7)) / this.players.length,
                w / 3,
                (h * 0.7) / this.players.length
            );
        }

        fill(255);
        textSize(h * 0.2);
        strokeWeight(2);
        textAlign(CENTER, CENTER);
        text("Players", x, y, w / 3, h * 0.3);

        text("Bids", x + w / 3, y, w / 3, h * 0.3);
        text("Score", x + (w / 3) * 2, y, w / 3, h * 0.3);
    }
}

class InfoDisplay {
    constructor(text, innerColour, outerColour, textColour) {
        this.text = text;
        this.innerColour = innerColour;
        this.outerColour = outerColour;
        this.textColour = textColour;
        this.numberOfDots = 0;
        this.maxDots = 0;
        this.dots = '';
    }

    display(x, y, w, h) {
        strokeWeight(this.h * .01);
        stroke(this.outerColour);
        fill(this.innerColour);
        rect(x, y, w, h, h * .1);
        textAlign(LEFT);
        fill(this.textColour);
        text(this.text, x * 1.1, y, w, h);
        if (!this.text.includes(' won the hand')) {
            this.maxDots = 24 - this.text.length;
            if (frameCount % 25 == 0) {
                this.numberOfDots = (this.numberOfDots < this.maxDots ? this.numberOfDots + 1 : 0)

                if (this.numberOfDots == 0)
                    this.text = this.text.substring(0, this.text.indexOf('.'));

                this.text += '.';
            }
        }

    }
}