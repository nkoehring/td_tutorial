class Game {
  constructor(w, h) {
    Crafty.init(w, h)
    Crafty.background("black")
    Crafty.e("Enemy").level(10)
    Crafty.e("Tower").at(200, 50)
  }
}

new Game(800, 600)
