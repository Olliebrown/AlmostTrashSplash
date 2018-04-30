/* globals __DEV__ */

 // Import the entire 'phaser' namespace
import Phaser from 'phaser'

// Import the config file
import config from '../config'

// Import needed functions from utils and config settings
import { centerGameObjects } from '../utils'
import FlyingGarbage from '../sprites/FlyingGarbage'

const PHASE_TIMING = [
  2.5, 1, 1, 1, 2
]

const POSITIONS = [
  [-200, 100],
  [340, -50],
  [630, -50],
  [920, -50],
  [1480, 100]
]

const VELOCITY = [
  [ [900, -500], [300, -250], [0, 0], [-300, -250], [-1000, -500] ],
  [ [900, -500], [300, -250], [0, 0], [-300, -250], [-1000, -500] ],
  [ [900, -500], [300, -250], [0, 0], [-300, -250], [-1000, -500] ],
  [ [900, -500], [300, -250], [0, 0], [-300, -250], [-1000, -500] ]
]

const SCALES = [
  [0.33, 0.3, 0.3, 0.16],
  [4.0, 3.5, 2.8, 0.3],
  [0.9, 1.5, 1.0, 0.66],
  [1.0, 1.0, 1.0, 1.0],
  [0.4, 0.5, 0.5, 0.5]
]

const SMOOTH = [
  true, false, false, false, true
]

/**
 * The Splash game state. This game state displays a dynamic splash screen used
 * to communicate the progress of asset loading.
 */
class Splash extends Phaser.State {
  // Initialize some local settings for this state
  init () {
    this.phase = 0

    // When was this state started?
    this.started = this.lastTime = this.game.time.time

    // Set / Reset world bounds
    this.game.world.setBounds(0, 0, this.game.width, this.game.height)
  }

  // Pre-load is done
  create () {
    // Start Physics
    this.game.physics.startSystem(Phaser.Physics.P2JS)
    this.game.physics.p2.setImpactEvents(true)
    this.game.physics.p2.gravity.y = 700
    this.game.physics.p2.world.defaultContactMaterial.friction = 0.3
    this.game.physics.p2.setBounds(
      0, 0, this.game.width, this.game.height,
      false, false, false, true)

    // Add all the game sprites
    let i = Math.floor(Phaser.Math.random(0, 4))
    for (let game = 0; game < 5; game++) {
      let garbage = new FlyingGarbage({
        position: { x: POSITIONS[game][0], y: POSITIONS[game][1] },
        velocity: {
          x: VELOCITY[i][game][0],
          y: VELOCITY[i][game][1],
          angular: Phaser.Math.random(-10, 10)
        },
        key: `${config.GAMES[game]}_${i + 1}`,
        scale: SCALES[game][i],
        smooth: SMOOTH[game],
        game: this.game
      })

      this.game.add.existing(garbage)
    }

    // Add the logo to the screen and center it
    let centX = this.game.world.centerX
    let centY = this.game.world.centerY + 100
    this.logo = this.game.add.sprite(centX, centY, 'logo')
    this.logo2 = this.game.add.sprite(centX, centY, 'logo')
    this.logo.width = this.logo.height = 512
    this.logo2.width = this.logo2.height = 512

    this.text = [
      this.game.add.sprite(centX, centY, 'text_almost'),
      this.game.add.sprite(centX, centY, 'text_trash'),
      this.game.add.sprite(centX, centY, 'text_studios')
    ]

    this.text.forEach((text, i) => {
      text.width = text.height = 512
      if (i === 2) {
        text.alpha = 0.0
      } else {
        text.visible = false
      }
    })

    centerGameObjects([
      this.logo, this.logo2, this.text[0], this.text[1], this.text[2]
    ])

    // Create the trash can collider
    this.game.physics.p2.enable(this.logo2)
    this.canCollider = this.logo2.body
    this.logo2.visible = false

    // Setup the collider polygon
    let FIX = 2.0
    let OFFSET = 256
    this.canCollider.addPolygon(
      { skipSimpleCheck: true },
      [ 123 / FIX - OFFSET, 95 / FIX - OFFSET,
        214 / FIX - OFFSET, 889 / FIX - OFFSET,
        731 / FIX - OFFSET, 886 / FIX - OFFSET,
        831 / FIX - OFFSET, 84 / FIX - OFFSET,
        810 / FIX - OFFSET, 84 / FIX - OFFSET,
        711 / FIX - OFFSET, 860 / FIX - OFFSET,
        235 / FIX - OFFSET, 860 / FIX - OFFSET,
        145 / FIX - OFFSET, 95 / FIX - OFFSET
      ]
    )

    this.canCollider.static = true
    this.canCollider.collideWorldBounds = true
  }

  // Called repeatedly after pre-load finishes and after 'create' has run
  update () {
    let elapsed = this.game.time.elapsedSince(this.lastTime) / 1000
    if (this.phase === 0) {
      if (elapsed >= PHASE_TIMING[this.phase]) {
        this.phase++
        this.lastTime = this.game.time.time
        this.game.physics.p2.pause()
      }
    } else if (this.phase < 4) {
      if (elapsed >= PHASE_TIMING[this.phase]) {
        if (this.phase === 1) {
          this.text[0].visible = true
          this.game.sounds.play('punch2', 0.5)
          this.game.camera.shake(0.01, 100)
        } else if (this.phase === 2) {
          this.text[1].visible = true
          this.game.sounds.play('punch1', 0.5)
          this.game.camera.shake(0.01, 100)
        }

        this.phase++
        this.lastTime = this.game.time.time
      }
    } else if (this.phase === 4) {
      this.text[2].alpha = elapsed / PHASE_TIMING[4]
      if (elapsed >= PHASE_TIMING[this.phase]) {
        this.text[2].alpha = 1.0
        this.lastTime = this.game.time.time
        this.phase++

        // Fade camera
        setTimeout(() => {
          this.game.world.camera.fade(0x9f9f9f, 500)

          // Redirect window after fade
          if (window.dest !== undefined) {
            setTimeout(() => {
              window.location = window.dest
            }, 1000)
          }
        }, 2000)
      }
    }
  }
}

// Expose the Splash class for use in other modules
export default Splash
