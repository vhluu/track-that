const NimblePicker = require('emoji-mart/dist/components/picker/nimble-picker').default
const React = require('react')
const { define } = require('remount/es5')

async function main() {
  const data = await (await fetch('/assets/all.json')).json()
  const Picker = props => (React.createElement(NimblePicker, {
    set: 'apple',
    data,
    native: true,
    onSelect: emoji => {
      console.log('emoji chosen ' + emoji);
      var tagIconField = document.querySelector('.tag-field-icon');
      tagIconField.textContent = emoji.native; // sets content of icon field in form 

      var emojiPicker = document.querySelector('emoji-picker'); 
      tagIconField.parentElement.removeChild(emojiPicker); // removes the emoji picker

      var tagFieldWrapper = document.querySelectorAll('.tag-field-wrapper');
      for(var i = 0; i < tagFieldWrapper.length; i++) {
        tagFieldWrapper[i].classList.remove('prevent-click'); // allows click event on form again
      }
    },
    title: 'Pick your emoji',
    showPreview: true,
    autoFocus: true,
    ...props
  }))

  define({ 'emoji-picker': Picker})
}

main().catch(err => console.error(err))
