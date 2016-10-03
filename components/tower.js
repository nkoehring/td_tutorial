Crafty.c("Tower", {
  required: "2D, Canvas, Color, Draggable, Delay, Tween",

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
    this.reloadTime = 500
    this.alpha_ready = 1.0
    this.alpha_empty = 0.5
    this.original_color = "#00FF00"
    this.flash_color = "#AAFF00"

    this.color(this.original_color)
    this.alpha = this.alpha_empty

    this.reload()
    this.delay(() => { this.aimAndShoot() }, this.reloadTime, -1)
  },

  aimAndShoot () {
    let tower = this

    Crafty("Enemy").each(function(i) {
      const enemy = this
      const distance = Crafty.math.distance(enemy.x, enemy.y, tower.x, tower.y)

      if (distance < tower.range * 20) {
        Crafty.log("Fire!")

        tower.color(tower.flash_color)
        enemy.hit(tower.strength)

        tower.delay(() => {
          tower.color(tower.original_color)
          tower.alpha = tower.alpha_empty
          tower.reload()
        }, tower.reloadTime*0.2, 0)
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

  reload () {
    this.tween({alpha: this.alpha_ready}, this.reloadTime*0.8, "linear")
  },

  at (x, y) {
    this.x = x
    this.y = y

    return this
  }

})
