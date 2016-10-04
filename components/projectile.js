Crafty.c("Projectile", {
  required: "2D, Canvas, Color, Tween",

  events: {
    TweenEnd () {
      this.target.hit(this.strength)
      this.destroy()
    }
  },

  init () {
    this.x = 0
    this.y = 0
    this.w = 5
    this.h = 5
    this.speed = 1
    this.color("#FFFF00")
  },

  from (source) {
    this.x = (source.x + source.w / 2.0) - this.w / 2.0
    this.y = (source.y + source.h / 2.0) - this.h / 2.0
    this.speed = source.projectile_speed || 1
    this.strength = source.strength || 1
    return this
  },

  to (target) {
    this.target = {
      x: (target.x + target.w / 2.0) - this.w / 2.0,
      y: (target.y + target.h / 2.0) - this.h / 2.0,
      hit: target.hit.bind(target)
    }

    return this
  },

  fire () {
    const distance = Crafty.math.distance(this.x, this.y, this.target.x, this.target.y)
    const time_needed = distance / this.speed * FIELD_SIZE

    this.tween({
      x: this.target.x,
      y: this.target.y
    }, time_needed, 0)
    return this // or maybe not, as this is actually fire and forget
  }
})
