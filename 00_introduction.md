Introduction
============

The code in this step is only the minimal boilerplate from where we will start.
It creates a simple 800x600 canvas with black background and nothing more.

To achieve this first step, I simply followed the CraftyJS [Getting Started
Guide](http://craftyjs.com/getting-started/).

commented code
--------------

```js
class Game {                    // game class
  constructor(w, h) {
    Crafty.init(w, h)           // initialise Crafty (uses element with ID cr-stage by default
    Crafty.background("black")  // set black background
  }
}

new Game(800, 600)              // initialise the game with a 800x600 pixel sized field
```

As you might see, I use some ES6 fancyness, as far as things are supported in
modern Firefox and Chrome versions (no idea about IE and Edge, though). If you
are new to the topic, you can find a lot of useful information at
http://es6-features.org/ .

