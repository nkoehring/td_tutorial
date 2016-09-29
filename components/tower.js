Crafty.c("Tower", {
  required: "2D, Canvas, Color, Draggable",

  events: {
    MouseDown () { this.startDrag() },
    MouseUp   () { this.stopDrag() }
  },

  init () {
    this.w = 15
    this.h = 15
    this.color("#00FF00")
  },

  at (x, y) {
    this.x = x
    this.y = y
  }

})
