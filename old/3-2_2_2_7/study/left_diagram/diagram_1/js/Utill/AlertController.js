import MainActivity from "../Activity/MainActivity.js";

export function SetAlertText(text) {
    const info_text = MainActivity.shadow.querySelector(".pop_text")

    info_text.innerHTML = text
}

export function ShowAlert(main, text = "") {
    const info_message = main.shadow.querySelector(".info_message")
    const info_text = main.shadow.querySelector(".pop_text")

    if (text) info_text.innerHTML = text

    info_message.style.display = "block"
}

export function HideAlert(main, text = "") {
    const info_message = main.shadow.querySelector(".info_message")
    info_message.style.display = "none"
}

let alertDelay
export function ShowOneSecond(main, text = "", timer = 1500) {
    if (alertDelay) {
        clearTimeout(alertDelay)
    }

    ShowAlert(main, text)

    alertDelay = setTimeout(() => {
        HideAlert(main)
    }, timer)
}