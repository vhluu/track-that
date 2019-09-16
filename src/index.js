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
      document.querySelector('.tag-field-icon').textContent = emoji.native;
      document.querySelector('.tag-emoji-picker').classList.add('hide');
    },
    title: 'Pick your emoji',
    showPreview: true,
    autoFocus: true,
    ...props
  }))

  define({ 'emoji-picker': Picker})

  // const picker = document.createElement('emoji-picker')
  // document.body.appendChild(picker)
}

main().catch(err => console.error(err))
