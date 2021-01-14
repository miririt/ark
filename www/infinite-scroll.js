
class Scroll {
  static bounceBack = () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight + Scroll.bounceBackSize) {
      scrollBy({
        'top': -Scroll.bounceBackSize,
        'left': 0,
        'behavior': 'smooth'
      });
    }
  }

  static isSearching = false;

  static loadMore = () => {
    if(!this.isSearching) {
      this.isSearching = true;
      Search.scrollMore()
      .then(() => {
        this.isSearching = false;
      })
      .catch(err => {
        console.log(err);
        this.isSearching = false;
      });
      this.bounceBack();
    }
  }
}

Scroll.bounceBackSize = 48;

window.addEventListener('load', e => {
  const bounceBackBuffer = document.querySelector('#bounce-back');
  bounceBackBuffer.style.height = `${Scroll.bounceBackSize}px`;
});

window.addEventListener('scroll', e => {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight + Scroll.bounceBackSize) {
    Scroll.loadMore();
  }
});