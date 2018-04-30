// Import the entire 'phaser' namespace
import Phaser from 'phaser'

/**
 * The main player-controllable sprite. This class encapsulates the logic for the main
 * player sprite with all of it's animations and states. It includes a simple, hard-coded
 * movement state-machine that coordinates transitions between differnt movement states
 * and the idle state. It shows examples of setting up animations that are embedded in a
 * larger sprite-sheet and carefule management of the current state. No physics are used
 * in this example, only basic animation.
 *
 * See Phaser.Sprite for more about sprite objects and what they support.
 */
class FlyingGarbage extends Phaser.Sprite {
  constructor ({ game, key, position, velocity, scale, smooth }) {
    super(game, position.x, position.y, key, 0)

    this.game = game
    this.scale.setTo(scale)
    this.smoothed = smooth
    this.garbage = true

    // Setup physics
    this.game.physics.p2.enable(this)
    this.body.collideWorldBounds = true
    this.body.damping = 0.5

    // Set initial velocity
    this.body.velocity.x = velocity.x
    this.body.velocity.y = velocity.y
    this.body.angularVelocity = velocity.angular

    // Collision Events
    this.body.onBeginContact.add(this.beginHit, this)
  }

  beginHit (myBody, hitBody, myShape, hitShape, contactEqs) {
    if (!hitBody.parent || !hitBody.parent.sprite) {
      return
    }

    let which = Math.floor(Phaser.Math.random(1, 5))
    this.game.sounds.play(`can${which}`, 0.5)
  }
}

export default FlyingGarbage
