Crafty.c("Tower", {
  required: "2D, Canvas, Color, Draggable, Delay",

  events: {
    MouseDown () { this.startDrag() },
    MouseUp   () { this.stopDrag() },
    Dragging  () { this.dragging = true },
    Click     () { this.onClick() }
  },

  init () {
    this.w = 15
    this.h = 15
    this.strength = 1
    this.range = 2
    this.color("#00FF00")
    this.reloadTime = 500
    this.delay(() => { this.aimAndShoot() }, this.reloadTime, -1)
  },

  aimAndShoot () {
    let tower = this

    Crafty("Enemy").each(function(i) {
      const enemy = this
      const distance = Crafty.math.distance(enemy.x, enemy.y, tower.x, tower.y)
      if (distance < tower.range * 20) {
        Crafty.log("Fire!")
        enemy.hit(tower.strength)
      }
    })
  },

  onClick () {
    if (this.dragging) {
      this.dragging = false
      return this
    } else {
      this.levelUp()
    }
  },

  levelUp () {
    this.strength *= 2
    Crafty.log("strength is now", this.strength)

    return this
  },

  at (x, y) {
    this.x = x
    this.y = y

    return this
  }

})
