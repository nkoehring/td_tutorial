Deadly clicks
=============

As a first step and to get a clue how to do things with Crafty, lets create a
simple "enemy" that has some hitpoints which decrease on click until the entity
eventually disappears.

Entities in Crafty
------------------

A good way to organise and modularise the code with Crafty is to create own
components. More details on this can be found in the Crafty documentation
about [entities](http://craftyjs.com/documentation/entities.html),
[components](http://craftyjs.com/documentation/components.html) and the API
documentation for [Crafty.c](http://craftyjs.com/api/Crafty-c.html).

So the first step would be to create a simple "Enemy" entity in the constructor
of the game class:

```js
class Game {
  constructor(w, h) {
    Crafty.init(w, h)
    Crafty.background("black")

    Crafty.c("Enemy", {                // create a new component "Enemy"
      required: "2D, Canvas, Color",   // other components to include

      init () {                        // component constructor
        this.x = 50                    // set position and size
        this.y = 50
        this.w = 20
        this.h = 20
        this.color("#FF0000")          // and the colour
      }
    })

    Crafty.e("Enemy")                  // initialise the enemy entity
  }
}
```

This creates a red square and places it in the left upper corner of the canvas.
For now, the enemy is really just a red square and nothing more.

It's alive!
-----------

The next step is to add hitpoints. The easiest way to keep track of them is
another variable, declared in the `init()` function:

```js
  // …
  init () {
    this.x = 50
    this.y = 50
    this.w = 20
    this.h = 20
    this.hp = 1           // one hitpoint, this is a very weak guy
    this.color("#FF0000")
  }
  // …
```

But how to kill it?
-------------------

Now we want to inflict some damage. To describe what damage is, lets create a
`hit` function:

```js
  // …
  hit (damage) {                      // function to inflict damage
    this.hp -= damage                 // simply substract the inflicted damage
    Crafty.log("hp is now", this.hp)  // log the current amount of HP

    return this                       // realise method chaining
  }
  // …
```

First: What is method chaining? The usual way to configure entities in Crafty
is to chain the configuration methods. For example:

```js
Crafty.e("2D, Color").attr(({x:10, y:10, w:30, h:30}).color("red")
```

For this to work, every method simply returns the entity object itself.

But now back to topic: To make this method meaningful, we need to call it. Of
course we could just call it right after the creation:


```js
Crafty.e("Enemy").hit(1)
```

Though this is a bit lame, we see a message in the javascript console (F12 in
most browsers), that says "hp is now 0".

But our enemy is still invincible because he doesn't care about the hitpoints.
We can easily reach negative values and nothing happens:
```js
Crafty.e("Enemy").hit(10)
// "hp is now -9"
```

Immortal enemies are stupid anyway
----------------------------------

To change that, lets check after every hit and call `destroy()` in case the
entity is out of hit points:


```js
  // …
  hit (damage) {
    this.hp -= damage
    Crafty.log("hp is now", this.hp)

    if (this.hp <= 0) {               // Am I dead already?
      Crafty.log("Aw, now I have to wait until the next round!")
      this.destroy()                  // Oh, how embarassing!
    }

    return this
  }
  // …
```

Now that our enemy doesn't have to carry the burden of immortality anymore, it
disappears as soon as enough damage is inflicted:


```js
Crafty.e("Enemy").hit(1)
// hp is now 0
// Aw, now I have to wait until the next round!
```

Stronger enemies are not stupid, though
--------------------------------------

To make this a bit more challenging, lets increase the hitpoints. Simply
raising the initial value would be sufficient for now, even better would be to
make the hitpoints level dependent, though. So an enemy of level 1 has 1
hitpoint, one of level 2 has 2 and so on:

```js
  level (level) {
    this.hp *= level // multiply the level with the hitpoints
    return this      // do the chaining magic again
  }
```

Now we can create an enemy and set its level right away:

```js
Crafty.e("Enemy").level(10)
```

This gives 10 hitpoints to the enemy. Now, lets get interactive. The killer
machine is called: Mouse! Okay, this one was really bad, I know.

Click click…
------------

After carefully studying http://craftyjs.com/documentation/mouse.html we know
to make use of the mouse, the mouse component needs to be added:

```js
  // …
  required: "2D, Canvas, Color, Mouse",
  // …
```

Important is, that the mouse events are all capitalised. So we need to bind to
"Click" instead of "click". All our click handler has to do is to inflict some
damage, that means calling `hit(1)`:

```js
  events: {
    Click (evt) {   // bind the click handler
      this.hit(1)   // inflict damage
    }
  }
```

By now, the square is clickable and will disappear after clicking enough:

```js
  Crafty.e("Enemy").level(10)
  // click: hp is now 9
  // click: hp is now 8
  // …
```

Conclusion
----------

In this step, a simple static enemy entity is created. It has level based
hitpoints, which will be useful later in the game. It gets damage on click,
which is not useful for the game but good for testing.

In the [next step](https://github.com/nkoehring/td_tutorial/tree/02_the_first_tower), we will create the tower entity to have something to oppose the enemy.
