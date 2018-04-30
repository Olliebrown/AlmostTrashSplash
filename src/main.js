// Import the two main libraries that Phaser will depend on (only done once)
import 'pixi' // The underlying sprite library of Phaser
import 'p2' // The most flexible physics library used in Phaser

// Import the entire 'phaser' namespace
import Phaser from 'phaser'

// Import the three main states used in our example game
import BootState from './states/Boot' // A preliminary state that loads minimal assets
import SplashState from './states/Splash' // A fancy loading splash screen for loading more assets

// Import our general configuration file
import config from './config'

/**
 * The main class that encapsulates the entirity of our game including all the game states,
 * all the loaded and cached assets, and any reusable logic needed in any state.
 */
class Game extends Phaser.Game {
  // Function automatically called upon class creation
  constructor () {
    // Pass configuration details to Phaser.Game
    super(config.gameWidth, config.gameHeight, Phaser.AUTO, 'content', null)

    // Name and load ALL needed game states (add more states here as you make them)
    this.state.add('Boot', BootState, false)
    this.state.add('Splash', SplashState, false)

    // Start the 'boot' state
    this.state.start('Boot')
  }
}

// Check for a target to load after the splash screen
let query = window.location.search.substring(1)
let vars = query.split('&')
let pair = vars[0].split('=')
if (pair.length > 1 && pair[0] === 'dest') {
  window.dest = pair[1]
}

window.game = new Game()
