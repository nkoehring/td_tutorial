Shooting action
===============

In this step the tower will learn to shoot at an enemy. This contains details
on how to find the enemies in range and doing things frequently.

Power to the tower
------------------

Before any tower can shoot, it needs to have a kind of strength indicator.
Later in the game, towers should be able to get stronger to be able to keep up
with the hordes of enemies.

But lets start with a strength of 1. This means, inflicting one damage per
shot:

```js
  init () {
    this.w = 15
    this.h = 15
    this.strength = 1     // a weak tower
    this.color("#00FF00")
  },

```

More power to the tower!
------------------------

Because it is easy but has some quirks, lets implement a very simple levelup
mechanic: Double the strength on every level up. Level up by clicking the
tower.

```js
  levelUp () {
    this.strength *= 2
    Crafty.log("strength is now", this.strength)

    return this
  }
```

We don't need to set a level directly because we always create level one towers
and level them up step by step.

To level the tower up, just click it:

```js
  events: {
    MouseDown () { this.startDrag() },
    MouseUp   () { this.stopDrag() },
    Click     () { this.levelUp() }
  }
```

Complications
-------------

But there is a problem. When the tower gets dragged, it also gets a click
event and with it a level up.

There are multiple solutions to this problem:

Later in the game, towers will only be draggable once, so the click handler
could be set afterwards and the drag-handlers could be removed. The draggable
tower could also be only a dummy that resets its position but places a new,
non-draggable tower.

These things will happen not earlier than step 7 of the tutorial, though, so
for an simple intermediate solution, a variable will help:

```js
  events: {
    MouseDown () { this.startDrag() },
    MouseUp   () { this.stopDrag() },
    Dragging  () { this.dragging = true },    // life is dragging me!
    Click     () { this.levelUp() }
  }
```

To make sure, the poor tower doesn't feel dragged forever, the variable will
set to false after the click event:

```js
  levelUp () {
    if (this.dragging) {    // Life's dragging?
      this.dragging = false // Try again, next time!
      return this           // This time, nothing happens, though.
    }
    // …
```

Now the tower is clickable and draggable without any complications. But still
cannot use its power.

Lets shoot! Wait… not so fast!
------------------------------

To shoot, the tower needs to "communicate" the hit to the target. Three things
need to be considered:

* Which target is in range?
* How to tell the target that it has been shot?
* How often can we shoot?

None of these points can be considered a low haning fruit, so lets go one by
one.

Find targets in range
---------------------

To be able to find targets in range, we first need a range. Lets start with
some random picked value:

```js
  init () {
    this.w = 15
    this.h = 15
    this.strength = 1
    this.range = 2        // range of 2 …whatever that means
    this.color("#00FF00")
  }
```

Later the field will be split into equally sized squares. For now it is not but
we can simply assume a square size and multiply it with the range value. This
results in setting the range in squares, which makes totally sense.

But how to use this information?

Again, the componentisation benefits us: Crafty has a very handy selection tool
build in that can search for entities by components. All the information about
it can be found in the [according section](http://craftyjs.com/api/Crafty.html)
of the documentation.

To select all enemies, we ask Crafty for all entities that use the Enemy
component:

```js
Crafty("Enemy")
```

To filter for all enemies in range, the distance has to be calculated for every
enemy:

```js
Crafty("Enemy").each(enemy => {
  let x1 = enemy.x
  let y1 = enemy.y
  let x2 = tower.x
  let y2 = tower.y

  // Pythagoras, Pythagoras – does whatever a Pythagoras does…
  let distance = Math.sqrt(1.0 * (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
})
```

Okay, this totally looks like it should be put into a separate helper for
later. Luckily, Crafty did that for us already! See
http://craftyjs.com/api/Crafty-math.html#Crafty-math-distance for all the
details about this and other math based helpers in Crafty.

Now that the distance is known, it should be used! But lets first move the
tower a bit away:

```js
class Game {
  constructor(w, h) {
    Crafty.init(w, h)
    Crafty.background("black")
    Crafty.e("Enemy").level(10)
    Crafty.e("Tower").at(200, 50) // move the tower out of range in td.js
  }
}

new Game(800, 600)
```

Now back in components/tower.js:

```js
Crafty("Enemy").each(enemy => {
  // how relieving!
  let distance = Crafty.math.distance(enemy.x, enemy.y, tower.x, tower.y)
  if (distance < tower.range * 20) { // lets assume, the tiles will be 20x20 pixel
    enemy.hit(tower.strength)        // hit that enemy!
  }
})
```

Success! The tower can now hit all targets in range. To do this, it needs to
actually shoot, though. We don't have automatic fire for now, so the function
to fire needs to be called manually. The only moment (for now) where the range
between enemy and tower changes is when dropping the tower:

```js
  levelUp () {
    if (this.dragging) {
      this.dragging = false
      this.aimAndShoot()          // lets shoot after dropping the tower, but not on levelup
      return this
    }

    this.strength *= 2
    Crafty.log("strength is now", this.strength)

    return this
  }
```

Okay, this method does to much to be a plain levelUp method. For clarity it
should be split:

```js
  onClick () {
    if (this.dragging) {
      this.dragging = false
      this.aimAndShoot()          // lets shoot after dropping the tower, but not on levelup
      return this
    } else {
      this.levelUp()
    }
  },

  levelUp() {
    this.strength *= 2
    Crafty.log("strength is now", this.strength)

    return this
  }
```

Neat!

Now that we found out how to find targets in range and how to tell them that
there have been shot, lets move to automatic shooting.

We declare independence!
------------------------

First, lets read a bit about [Craftys gameloop](http://craftyjs.com/documentation/gameloop.html)!
The gameloop is the heart of every game. It should run ideally 60 times every
second, which results in 60 FPS. If the execution takes to long, the FPS go
down. Modern browsers help with achieving smooth animations by offering a
method, that syncs with the browsers own rendering cycle. This function is
called [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame).

After knowing more about how the gameloop of Crafty works, it seems obvious to
use the EnterFrame event to do things on a regular basis. One could use a
variable to count the frames since the last shoot and accumulate the time per
frame returned by the event itself.

For example:

```js
  // …
  events: {
    // …
    EnterFrame (frameData) {
      this.lastShotSince += frameData.dt
      if (this.lastShotSince >= this.reloadTime) {
        this.lastShotSince = 0
        this.aimAndShoot()
      }
    }
  },

  init () {
    // …
    this.lastShotSince = 0
    this.reloadTime = 500  // 500ms to reload = 2 shots per second
  }
```

This works splendid but – thanks to Craftys toolbox – there is a shorter way.
Instead of using the EnterFrame event directly, the [delay
component](http://craftyjs.com/api/Delay.html) can be used. This shrinks the
whole thing down to an added component, a variable and one line of code:

```js
  // …
  required: "2D, Canvas, Color, Draggable, Delay",
  // …
  init () {
    this.w = 15
    this.h = 15
    this.strength = 1
    this.range = 2
    this.color("#00FF00")
    this.reloadTime = 500
    this.delay(() => { this.aimAndShoot() }, this.reloadTime, -1) // shoot forever
  },
  // …
```

Cleanup and some thought on optimisation
----------------------------------------

Now that the tower "aims" and shoots automatically, the manual shooting on drop
can be removed again:

```js
  // …
  onClick () {
    if (this.dragging) {
      this.dragging = false
      return this
    } else {
      this.levelUp()
    }
  },
  // …
```

Now every tower will do distance checks for every existing enemy twice a
second. That seems quite bruteforce and could have performance implications.
Optimisation is not trivial, though. Two ideas that I spontaneously got:

#### Sort enemies by "how far they got on the path"

…and stop iterations at first hit or if the nearest enemy is to far away.

This should spare quite some calculations especially in the beginning of a
wave but the second point is hard to realise as paths are not always a straight
line. It also will work less well for towers in the beginning of the path.
Maybe they could search the list backwards? I don't think this would help much.

#### Indicator fields

Towers could be activated by path sections. So in the beginning the tower
"knows" which path sections are in its range. The towers could register at
these path sections and as soon as an enemy reaches the path section, the tower
can be notified or "activated".

Conclusion
----------

Now the towers can aim and shoot at enemies in range at regular intervals. They
also got a level based strength.

This section grew a bit more than expected, so the part that discusses shooting
and hit indicators got moved into a sub-section: [03.1 Bling Bling!](https://github.com/nkoehring/td_tutorial/tree/03.1_bling_bling).
