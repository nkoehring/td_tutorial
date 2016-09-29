class Game {
  constructor(w, h) {
    Crafty.init(w, h)
    Crafty.background("black")
    Crafty.e("Enemy").level(10)
    Crafty.e("Tower").at(80, 50)
  }
}

new Game(800, 600)
