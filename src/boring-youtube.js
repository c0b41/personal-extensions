function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function markCurrentVideosAsNotBeingInteresting() {
  const videoMenuButtons = document.querySelectorAll('yt-icon.ytd-menu-renderer')

  for (let i = 0; i < videoMenuButtons.length; i++) {
    if (!videoMenuButtons[i]) {
      continue
    }
    videoMenuButtons[i].scrollIntoView()
    await sleep(10)

    videoMenuButtons[i].click()

    await sleep(50)

    var notInterestedButton = document.querySelector('#items > ytd-menu-service-item-renderer:nth-child(7) > tp-yt-paper-item')
    if (!notInterestedButton) {
      continue
    }
    notInterestedButton.click()

    console.log('One video has been marked. Waiting 100ms')
    window.scrollBy(0, 95)
    await sleep(500)
  }
}

async function markAllVideosAsNotBeingInteresting({ iterations }) {
  for (let i = 0; i < iterations; i++) {
    await markCurrentVideosAsNotBeingInteresting()
    await sleep(600)
  }

  location.reload()
}

let boringYoutubeStyle = `
.clear-button{
	border: none; 
	background: none; 
	cursor:pointer ;
}
.clear-button svg{
	width: 28px; 
	height: 23px; 
	padding-top: 4px; 
	fill: gray;
}
`

let buttonIcon = `
<svg fill="#000000" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 30 30" width="30px" height="30px">
<path d="M 13 3 A 1.0001 1.0001 0 0 0 11.986328 4 L 6 4 A 1.0001 1.0001 0 1 0 6 6 L 24 6 A 1.0001 1.0001 0 1 0 24 4 L 18.013672 4 A 1.0001 1.0001 0 0 0 17 3 L 13 3 z M 6 8 L 6 24 C 6 25.105 6.895 26 8 26 L 22 26 C 23.105 26 24 25.105 24 24 L 24 8 L 6 8 z"/>
</svg>
`

let buttonLoading = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: block;" width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
<path d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50" fill="#85a2b6" stroke="none">
  <animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" keyTimes="0;1" values="0 50 51;360 50 51"></animateTransform>
</path>
</svg>
`

window.onload = async () => {
  let clearButton = document.createElement('button')
  clearButton.innerHTML = buttonIcon
  clearButton.className = 'clear-button'
  clearButton.onclick = async () => {
    clearButton.innerHTML = buttonLoading
    try {
      await sleep(3000)
      console.log('Marking all videos as not interesting')
      await markAllVideosAsNotBeingInteresting({ iterations: 1 })
      console.log('All videos have been marked as not being interesting')
    } catch (error) {
      console.log('Error:', error)
    }
  }

  await sleep(1500)
  document.querySelector('#buttons').prepend(clearButton)

  var style = document.createElement('style')
  style.type = 'text/css'
  style.textContent = boringYoutubeStyle
  ;(document.head || document.documentElement).appendChild(style)
  console.log('Boring Youtube has been loaded')
}
