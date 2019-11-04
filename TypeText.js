class TypeText{
  constructor(htmlElement, cursorChar = '|'){
    this.htmlElement = htmlElement;
    this.arr_styles = [];
    this.cursorStyle = '';
    this.cursorChar = cursorChar;
    this.cursor = `<span class="cursor">${this.cursorChar}</span>`;
    document.getElementsByTagName('head')[0].insertAdjacentHTML('beforeend',`
    <style>
      .cursor-blink{
        -webkit-animation-name: cursor-animation;
                animation-name: cursor-animation;
        -webkit-animation-duration: 1s;
                animation-duration: 1s;
        -webkit-animation-iteration-count: infinite;
                animation-iteration-count: infinite;
      }
      @keyframes cursor-animation{
        0%{
          opacity: 1;
        }
        50%{
          opacity: 0;
        }
        100%{
          opacity: 1;
        }
      }
    </style>
    `);
  };
  async type(str, styleAttr = '', timing = 50){
    let increment = 0;
    this.cursor = this.cursor.replace('class="cursor cursor-blink"', 'class="cursor"');
    this.cursorRemove();
    if(!isNaN(styleAttr) && styleAttr !== ''){
      timing = parseFloat(styleAttr);
      styleAttr = '';
    }
      for(let char of str){
        if(styleAttr !== ''){
          this.htmlElement.innerHTML += `<span class="char-typed" style="${styleAttr}">${char}</span>` + this.cursor;
        }
        else{
          if(this.arr_styles.length > 0){
            increment++;
            if(increment > this.arr_styles.length - 1){
              this.htmlElement.innerHTML += `<span class="char-typed" style="${this.arr_styles[this.arr_styles.length - 1]}">${char}</span>` + this.cursor;
            }
            else{
              this.htmlElement.innerHTML += `<span class="char-typed" style="${this.arr_styles[increment - 1]}">${char}</span>` + this.cursor;
            }
          }
          else
            this.htmlElement.innerHTML += `<span class="char-typed">${char}</span>` + this.cursor;
        }
        await this.sleep(timing);
        await this.cursorRemove();
      }
    await this.cursorBlink();
    this.htmlElement.innerHTML += this.cursor;
  }

  async eraseAll(timing = 50){
    this.arr_styles = [];
    let spans = this.htmlElement.getElementsByClassName('char-typed');
    await this.resetCursor();
    for(let i = spans.length - 1; i >= 0; i--){
      await this.sleep(timing);
      this.arr_styles.push(spans[i].getAttribute('style'));
      spans[i].remove();
    }
    this.arr_styles.reverse();
    await this.cursorRemove();
    await this.cursorBlink();
    this.htmlElement.innerHTML += this.cursor;
  }
  async eraseLastChars(num_of_chars_from_end, timing = 50){
    let spans = this.htmlElement.getElementsByClassName('char-typed');
    await this.resetCursor();
    this.arr_styles = [];
    if(num_of_chars_from_end <= spans.length){
      let breakpoint = spans.length - num_of_chars_from_end;
      for(let i = spans.length - 1; i >= breakpoint; i--){
        this.arr_styles.push(spans[i].getAttribute('style'));
        spans[i].remove();
        await this.sleep(timing);
      }
      this.arr_styles.reverse();
      await this.cursorRemove();
      await this.cursorBlink();
      this.htmlElement.innerHTML += this.cursor;
    }
    else {
      console.error('num_of_chars_from_end cannot be bigger than the amount of characters in a string \'this.htmlElement.innerText\'');
    }
  }
  async replaceLastInstanceOf(strToBeReplaced, strToReplaceWith, styleAttr = '', timing = 50, timingErase = 50){
    if(this.htmlElement.innerText.replace(this.cursorChar, '').includes(strToBeReplaced)){
      let firstCharIndex = this.htmlElement.innerText.replace(this.cursorChar, '').lastIndexOf(strToBeReplaced);
      let lastCharIndex = firstCharIndex + strToBeReplaced.length;
      let spans = this.htmlElement.getElementsByClassName('char-typed');
      let increment = -1;
      this.arr_styles = [];
      for(let i = spans.length - 1; i >= 0; i--)
        if(i >= firstCharIndex && i < lastCharIndex){
          await this.sleep(timingErase);
          this.arr_styles.push(spans[i].getAttribute('style'));
          spans[i].remove();
          await this.placeCursorAt(i);
        }
      this.arr_styles.reverse();
      for(let char of strToReplaceWith){
        let span = document.createElement('span');
        let node = document.createTextNode(char);
        span.appendChild(node);
        span.classList.add('char-typed');
        if(increment + 1 > this.arr_styles.length - 1){
          if(styleAttr == '')
            span.setAttribute('style', this.arr_styles[this.arr_styles.length - 1]);
          else
            span.setAttribute('style', styleAttr);
        }
        else{
          if(styleAttr == '')
            span.setAttribute('style', this.arr_styles[increment + 1]);
          else
            span.setAttribute('style', styleAttr);
        }

        this.htmlElement.insertBefore(span, spans[firstCharIndex + (increment + 1)]);
        await this.cursorRemove();
        span.insertAdjacentHTML('afterend', this.cursor);
        increment++;
        await this.sleep(timing);
      }
      this.htmlElement.getElementsByClassName('cursor')[0].classList.add('cursor-blink');
    }
    else {
      console.error(strToBeReplaced + ' was not found!');
    }
  }
  async cursorRemove(){
    try{
      this.htmlElement.getElementsByClassName('cursor')[0].remove();
    }
    catch{}
  }
  async setCursorStyle(styleAttr = ''){
    this.cursor = `<span class="cursor" style="${styleAttr}">${this.cursorChar}</span>`;
    try{
    this.htmlElement.getElementsByClassName('cursor')[0].setAttribute('style', styleAttr);
    }
    catch{}
  }
  sleep(ms = 50) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async resetCursor(){
    let spans = this.htmlElement.getElementsByClassName('char-typed');
    this.cursor = this.cursor.replace('class="cursor cursor-blink"', 'class="cursor"');
    this.cursorRemove();
    spans[spans.length - 1].insertAdjacentHTML('afterend', this.cursor);
  }
  async placeCursorAt(pos = 1, timing = 50){
    let spans = this.htmlElement.getElementsByClassName('char-typed');
    //this.cursor = this.cursor.replace('class="cursor cursor-blink"', 'class="cursor"');
    this.cursorRemove();
    if(pos > 0)
      spans[pos - 1].insertAdjacentHTML('afterend', this.cursor);
    else if(pos == 0)
      spans[0].insertAdjacentHTML('beforebegin', this.cursor);

    await this.sleep(timing);
  }
  async cursorBlink(){
    this.cursor = this.cursor.replace('class="cursor"', 'class="cursor cursor-blink"');
  }
  async changeCursorChar(char){
    this.cursor = this.cursor.replace(this.cursorChar, char);
    this.cursorChar = char;
    try{
      this.htmlElement.getElementsByClassName('cursor')[0].innerHTML = char;
    }
    catch{}
  }
}
