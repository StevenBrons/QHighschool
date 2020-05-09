void setup() {
  size(500,500);
  int x = width / 2;
  int y = height / 2;
  for (int i = 0; i < 10; i++) {
     drawSnowman(int(random(width)),int(random(height)));
  }
}

void draw() {
}

void drawSnowman(int x, int y) {
  fill(random(255),random(255),random(255));
  circle(x,y,70);
  circle(x,y - 40,60);
  circle(x,y - 70,50);
}

void mouseClicked() {
  drawSnowman(mouseX,mouseY);
}
