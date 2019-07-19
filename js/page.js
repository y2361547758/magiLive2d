let sc = $('#char');
let sl = $('#custom');
let page = 0;

function triggerF() { follow = !follow; sl.change(); }
function resize() { init(parseInt($('#width').val()), parseInt($('#height').val())); sl.change(); }

const downloadBlob = function(index) {
    return function(blob) {
        const a = document.createElement("a");
        a.download = index;
        a.href = window.URL.createObjectURL(blob);
        a.click();
        window.URL.revokeObjectURL(a.href);
    }
}
function save(index) { renderer.view.toBlob(downloadBlob(index)); }
function capture() { save(page++); }

function get(url, callback) {
    $.getJSON({
        url: url,
        success: function(data) {callback(data)},
        error: function(xhr) {alert(xhr.responseJSON)}
    })
}

$(document).ready(function() {
    init(parseInt($('#width').val()), parseInt($('#height').val()));

    get("/magica/resource/image_native/live2d/list.json", function (list) {
        sc.empty()
        for (let c in list) {
            char = list[c];
            sc.append($('<option></option>').text(c + "-" + char.name).val(c));
        }
        sc.val("");

        sc.change(function() {
            sl.empty();
            if (sc.val() in list) for (let c in list[sc.val()]['models']) {
                custom = list[sc.val()]['models'][c];
                let o = $('<option></option>');
                o.text(c + "-" + custom);
                o.val(c);
                sl.append(o);
            }
            sl.val("");
        })
        sl.change(function() {
            let lastChild = null;
            while (lastChild = stage.children.shift()) { lastChild.destroy(); }
            show("/magica/resource/image_native/live2d/" + sl.val() + "/", "model.json");
        });
    });
})