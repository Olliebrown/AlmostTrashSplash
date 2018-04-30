// Import the entire 'phaser' namespace
import Phaser from 'phaser'

// Import the config file
import config from '../config'

/**
 * The Boot game state. This game state is used as a quick, low-impact
 * game state that will pre-load any assets needed for a more feature-
 * rich loading screen or splash screen that will come next.
 */
class Boot extends Phaser.State {
  // Initialize the stage and any simple settings
  init () {
    // Set the background color
    this.stage.backgroundColor = '#9f9f9f'
  }

  // Load all data needed for this game state
  preload () {
    // Read the assets for the splash screen (used in next stage)
    this.load.image('logo', './assets/images/Background.png')
    this.load.image('text_almost', './assets/images/text_Almost.png')
    this.load.image('text_trash', './assets/images/text_Trash.png')
    this.load.image('text_studios', './assets/images/text_Studios.png')

    // Load all the game assets
    for (let i = 1; i <= 4; i++) {
      for (let game = 0; game < 5; game++) {
        this.load.image(`${config.GAMES[game]}_${i}`,
          `./assets/images/gameSprites/${config.GAMES[game]}_${i}.png`)
      }
    }

    // The audiosprite with all music and SFX
    this.load.audioSprite('sounds', [
      'assets/audio/sounds.ogg', 'assets/audio/sounds.mp3',
      'assets/audio/sounds.m4a', 'assets/audio/sounds.ac3'
    ], 'assets/audio/sounds.json')
  }

  create () {
    this.game.sounds = this.game.add.audioSprite('sounds')
  }

  // Called repeatedly after pre-load to draw the stage
  render () {
    if (this.game.sounds.get('punch1').isDecoded) {
      this.state.start('Splash')
    }
  }
}

// Expose the Boot class for use in other modules
export default Boot
