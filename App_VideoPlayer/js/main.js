class VideoPlayer {
  constructor(settings) {
    this._settings = Object.assign(VideoPlayer.DefaultSettings, settings);
  }

  init() {
    if (!this._settings.videoUrl) return console.error('Please provide videoUrl!');
    if (!this._settings.videoPlayerContainer) return console.error('Please provide videoPlayerContainer');
    
    this._addTemplate();

    this._setElements();

    this._setEvents();
  }

  toggle() {
      const method = this._video.paused ? 'play' : 'pause';

      this._video[method]();
      this._toggleBtn.textContent = this._video.paused ? '►' : '❚ ❚';
  }

  _videoProgressHandler() {
    const percent = this._video.currentTime / this._video.duration * 100;

    this._progress.style.flexBasis = `${percent}%`;
  }

  _rewind(e) {
    this._video.currentTime = e.offsetX / this._progressContainer.offsetWidth * this._video.duration;
  }

/**
 * _volumeHandler changes video volume 
 * @return {[type]}   [description]
 */
  _volumeHandler() {
    this._video.volume = this._volume.value;
  }

  /**
   * _playbackRateHandler changes video playbackRate
   * @return {[type]} [description]
   */
  _playbackRateHandler() {
    this._video.playbackRate = this._playbackRate.value;
  }

  /**
   * _skipHandler skips video currenTime back
   * @return {[type]} [description]
   */
  _skipPrevHandler() {
    this._video.currentTime += this._settings.skipPrev;
  }

  /**
   * _skipNextHandler skips video currenTime forward
   * @return {[type]} [description]
   */
  _skipNextHandler() {
    this._video.currentTime += this._settings.skipNext;
  }

  /**
   * _skipHandler skips video currenTime back or forward depending on where the dblclick was done
   * @param  {event} e [description]
   * @return {[type]}   [description]
   */
  _skipHandler(e) {
    // the video is devided into 3 parts: left, center, right
      const third = this._video.offsetWidth / 3;

      if (e.offsetX <= third) {
        this._video.currentTime += this._settings.skipPrev;
      } else if (e.offsetX >= this._video.offsetWidth - third) {
        this._video.currentTime += this._settings.skipNext;
      }
  }

  _addTemplate() {
    const template = this._createVideoTemplate();
    const container = document.querySelector(this._settings.videoPlayerContainer);

    container ? container.insertAdjacentHTML('afterbegin', template) : console.error('videoPlayerContainer is not found');
  }

  _setElements() {
    this._videoContainer = document.querySelector(this._settings.videoPlayerContainer);
    this._video = this._videoContainer.querySelector('video');
    this._toggleBtn = this._videoContainer.querySelector('.toggle');
    this._progress = this._videoContainer.querySelector('.progress__filled');
    this._progressContainer = this._videoContainer.querySelector('.progress');

    /**
     * volume controler
     * @type {[type]}
     */
    this._volume = this._videoContainer.querySelector('input[name="volume"]');
    /**
     * playback controler
     * @type {[type]}
     */
    this._playbackRate = this._videoContainer.querySelector('input[name="playbackRate"]');

  /**
   * _skipPrev controler
   * @type {[type]}
   */
    this._skipPrev = this._videoContainer.querySelector(`button[data-skip="${this._settings.skipPrev}"]`);

    /**
     * _skipNext controler
     * @type {[type]}
     */
    this._skipNext = this._videoContainer.querySelector(`button[data-skip="${this._settings.skipNext}"]`);

  }

  _setEvents() {
    /**
     * variables for setting timer to ignore click event if it was first of double click and not final one
     * @type {Number} 'timer'
     * @type {Number} 'delay'
     * @type {Boolean} 'prevent'
     */
    let timer = 0;
    let delay = 300;
    let prevent = false;

    /**
     * adding event listener for single clicking the video 
     * the method was borrowed here:
     * https://css-tricks.com/snippets/javascript/bind-different-events-to-click-and-double-click/ 
     * @param  {event} 'click' [description]
     * @return {[type]}         [description]
     */
    this._video.addEventListener('click', () => {
      timer = setTimeout( () => {
        if(!prevent) this.toggle();
        prevent = false;
      }, delay);   
    });

    this._toggleBtn.addEventListener('click', () => this.toggle());
    this._video.addEventListener('timeupdate', () => this._videoProgressHandler());
    this._progressContainer.addEventListener('click', (e) => this._rewind(e));

    /**
     * adding event listener for pressing key "space"
     * @param  {event} 'keypress' [description]
     * @return {[type]}            [description]
     */
    document.addEventListener('keydown', (e) => {
      if (e.keyCode === 32) {
        e.preventDefault();
        this.toggle();
      }
    });

    /**
     * adding event listener for clicking volume controler
     * @param  {event} 'click' [description]
     * @return {[type]}         [description]
     */
    this._volume.addEventListener('click', () => this._volumeHandler());

    /**
     * adding event listener for clicking playbackRate controler
     * @param  {event} 'click' [description]
     * @return {[type]}         [description]
     */
    this._playbackRate.addEventListener('click', () => this._playbackRateHandler());

    /**
     * adding event listener for clicking skip prev btn
     * @param  {event} 'click' [description]
     * @return {[type]}         [description]
     */
    this._skipPrev.addEventListener('click', () => this._skipPrevHandler());

    /**
     * adding event listener for clicking skip next btn
     * @param  {event} 'click' [description]
     * @return {[type]}         [description]
     */
    this._skipNext.addEventListener('click', () => this._skipNextHandler());

    /**
     * adding event listener for dblclicking the video
     * @param  {event} 'dbclick' [description]
     * @return {[type]}           [description]
     */
    this._video.addEventListener('dblclick', (e) => {
      clearTimeout(timer);
      prevent = true;  
      this._skipHandler(e)
    } );
  }

  _createVideoTemplate() {
    return `
      <div class="player">
        <video class="player__video viewer" src="${this._settings.videoUrl}"></video>
        <div class="player__controls">
          <div class="progress">
            <div class="progress__filled"></div>
          </div>
          <button class="player__button toggle" title="Toggle Play">►</button>
          <input type="range" name="volume" class="player__slider" min=0 max="1" step="0.05" value="${this._settings.volume}">
          <input type="range" name="playbackRate" class="player__slider" min="0.5" max="2" step="0.1" value="1">
          <button data-skip="${this._settings.skipPrev}" class="player__button">« ${this._settings.skipPrev}s</button>
          <button data-skip="${this._settings.skipNext}" class="player__button">${this._settings.skipNext}s »</button>
        </div>
      </div>
    `;
  }

  static get DefaultSettings() {
    return {
      videoUrl: '',
      videoPlayerContainer: 'body',
      volume: 1,
      skipPrev: -2,
      skipNext: 2
    }
  }

}

const playerInstance = new VideoPlayer({
  videoUrl:'video/mov_bbb.mp4'
});

playerInstance.init();