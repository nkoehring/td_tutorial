The first tower
===============

After creating a simple enemy, a tower is needed to oppose it. But first, lets
clean up the code a bit.

Clean up
--------

Thanks to Craftys component system, it doesn't matter where the component is
defined, as long as it happens before it is used.

Lets keep every component in a single file under `./components/` and move the
enemy definition into `./components/enemy.js`. In the same fashion, the code
for the tower should be in `./components/tower.js`. Don't forget to include the
files in the `index.html`:

```html
  <!-- ... -->
  <script src="crafty.min.js"></script>
  <script src="components/enemy.js"></script>  <!-- load enemy component -->
  <script src="components/tower.js"></script>  <!-- load tower component -->
  <script src="td.js"></script>
  <!-- ... -->
```

Tower component
---------------

The initial Tower component will look just as expected:

```js
Crafty.c("Tower", {
  required: "2D, Canvas, Color",
  init () {
    this.w = 15
    this.h = 15
    this.x = 50
    this.y = 80
    this.color("#00FF00")
  }
})
```

This creates a slightly smaller green square next to the red enemy square.

Positioning outsourced
----------------------

We don't want fixed positions for the towers from the beginning, so we move out
the positioning into a separate function:


```js
Crafty.c("Tower", {
  required: "2D, Canvas, Color",

  init () {
    this.w = 15
    this.h = 15
    this.color("#00FF00")
  },

  at (x, y) {     // set the position of the tower
    this.x = x
    this.y = y
  }
})
```

Now we can add the tower like:

```js
Crafty.e("Tower").at(80, 50)
```

This line should be right before or after the the line where the enemy is added
to the scene in `td.js`.

By the way: If we don't specify the position, the tower will be at 0,0. This
might not be optimal, but we lack a default position for the towers for now, so
we have to solve this later.

Dragging action
---------------

The next step is to make the tower draggable. Fortunately this is super easy
with Crafty, thanks to the `Draggable` component:

```js
  // …
  required: "2D, Canvas, Color, Draggable",
  // …
```

Now we only need to define when to start and stop the dragging:

```js
  events: {
    MouseDown () { this.startDrag() },
    MouseUp   () { this.stopDrag() }
  },
```

Done! The tower can now be dragged to any place and stays where it is dropped.

Conclusion
----------

From now on every component will reside in its own file in the `./components/`
directory. This keeps the code more readable and clean.

Thanks to the Crafty component system, this tutoral step was very short and
simple. Now a tower can be put into the scene and even moved with the mouse.

In the [next step](https://github.com/nkoehring/td_tutorial/tree/03_shooting_action)
the tower will learn how to shoot at the enemy as soon at it is in range.
