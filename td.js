class Game {
  constructor(w, h) {
    Crafty.init(w, h)
    Crafty.background("black")
    Crafty.c("Enemy", {
      required: "2D, Canvas, Color, Mouse",

      events: {
        Click (evt) {
          this.hit(1)
        }
      },

      init () {
        this.x = 50
        this.y = 50
        this.w = 20
        this.h = 20
        this.hp = 1
        this.color("#FF0000")
      },

      level (level) {
        this.hp = this.hp * level
        return this
      },

      hit (damage) {
        this.hp -= damage
        Crafty.log("hp is now", this.hp)

        if (this.hp <= 0) {
          this.destroy()
        }

        return this
      }
    })

    Crafty.e("Enemy").level(10)
  }
}

new Game(800, 600)
