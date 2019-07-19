let page = 0;
let models = null;
let voices = null;
let sl = $('#custom');

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

    get("/magica/resource/sound_native/voice/list.json", function (list) {voices = list});
    get("/magica/resource/image_native/live2d/list.json", function (list) {
        models = list
        let sc = $('#char');
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
        $('#zoom').change(function() {
            $('#Lzoom').text("Zoom: " + this.value + '%');
            $(renderer.view).css("width", this.value + '%');
        });
        let se = $('#function > #g1 > select.exp');
        let sm = $('#function > #g1 > select.motion');
        let sv = $('#function > #g1 > select.voice');
        sl.change(function() {
            let lastChild = null;
            while (lastChild = stage.children.shift()) { lastChild.destroy(); }
            show("/magica/resource/image_native/live2d/" + this.value + "/", "model.json", function(model) {
                se.empty();
                for (let c in model.expressions) {
                    exp = model.expressions[c];
                    se.append($('<option></option>').text(c).val(exp.name));
                }
                se.val("");
                
                sm.empty();
                for (let c in model.motions.motion) {
                    exp = model.motions.motion[c];
                    sm.append($('<option></option>').text(exp.name).val(c));
                }
                sm.val("");
            });

            sv.empty();
            if (sc.val() in voices.char) {
                let char = voices.char[sc.val()];
                let list = [];
                for (let i in char["00"]) list[parseInt(i)] = char["00"][i];
                let custom = char[sl.val().slice(4)];
                if (custom) for (let i in custom) list[parseInt(i)] = custom[i];
                for (let c in list) { sv.append($('<option></option>').text(c).val(list[c])) }
            }
            sv.val("");
        });
        se.change(function() { stage.children[0].model.setExpression(this.value) });
        sm.change(function() { stage.children[0].model.startMotion("motion", this.value) });
        sv.change(function() { stage.children[0].model.playSound(this.value + ".mp3", '/magica/resource/sound_native/voice/') });
        $('#function > #g1 > button.exp').click(function(){ se.change() });
        $('#function > #g1 > button.motion').click(function(){ sm.change() });
        $('#function > #g1 > button.replay').click(function(){
            let audio = stage.children[0].model.audioElement;
            audio.load();
            audio.play();
        });
        $('#function > #g1 > button.pause').click(function(){
            let audio = stage.children[0].model.audioElement;
            if (audio.paused) audio.play();
            else audio.pause();
        });
    });
})