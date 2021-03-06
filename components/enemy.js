Crafty.c("Enemy", {
  required: "2D, Canvas, Color",

  events: {
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
      Crafty.log("Aw, now I have to wait until the next round!")
      this.destroy()
    }

    return this
  }
})
