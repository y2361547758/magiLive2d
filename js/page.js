let page = 0;
let models = null;
let voices = null;
let sl = $("#custom");
let audio;

function triggerF() { follow = !follow; sl.change(); }
function resize() { init(parseInt($("#width").val()), parseInt($("#height").val())); sl.change(); }

const downloadBlob = function(index) {
    return function(blob) {
        const a = document.createElement("a");
        a.download = index;
        a.href = window.URL.createObjectURL(blob);
        a.click();
        window.URL.revokeObjectURL(a.href);
    }
}
function save(index) { app.renderer.view.toBlob(downloadBlob(index)); }
function capture() { save(page++); }

$(document).ready(function() {
    init(parseInt($("#width").val()), parseInt($("#height").val()));

    fetch("/magica/resource/sound_native/voice/list.json").then(r => r.json(), alert)
    .then(list => voices = list)
    fetch("/magica/resource/image_native/live2d_v4/list.json").then(r => r.json(), alert)
    .then(list => {
        models = list
        let sc = $("#char");
        sc.empty()
        for (let c in list) {
            char = list[c];
            sc.append($("<option></option>").text(c + "-" + char.name).val(c));
        }
        sc.val("");

        sc.change(function() {
            sl.empty();
            if (sc.val() in list) for (let c in list[sc.val()]["models"]) {
                custom = list[sc.val()]["models"][c];
                let o = $("<option></option>");
                o.text(c + "-" + custom);
                o.val(c);
                sl.append(o);
            }
            sl.val("");
        })
        $("#zoom").change(function() {
            $("#Lzoom").text("Zoom: " + this.value + "%");
            $(app.renderer.view).css("width", this.value * $("#width").val() / 100 + "px");
        });
        let se = $("#function > #g1 > select.exp");
        let sm = $("#function > #g1 > select.motion");
        let sv = $("#function > #g1 > select.voice");
        sl.change(function() {
            let lastChild = null;
            while (lastChild = app.stage.children.shift()) { lastChild.destroy(); }
            show("/magica/resource/image_native/live2d_v4/" + this.value + "/", "model.model3.json", function(model) {
                se.empty();
                for (let c in model.Expressions) {
                    exp = model.Expressions[c];
                    se.append($("<option></option>").text(exp.Name.replace(/\.json$/, '')).val(exp.Name));
                }
                se.val("");
                
                sm.empty();
                for (let c in model.Motions.Motion) {
                    exp = model.Motions.Motion[c];
                    sm.append($("<option></option>").text(exp.Name).val(c));
                }
                sm.val("");
            });

            sv.empty();
            let cid = sl.val().substr(0, 4);
            let char = voices.char[cid];
            let list = [];
            if (char) {
                for (let i in char["00"]) list[parseInt(i)] = char["00"][i];
                let custom = char[sl.val().slice(4)];
                if (custom) for (let i in custom) list[parseInt(i)] = custom[i];
            }
            switch(cid) {
                case "1001":
                    list["g100"] = voices.game["0001"]["00"];
                    list["g105"] = voices.game["0001"]["05"];
                    break;
                case "1002":
                    list["g101"] = voices.game["0001"]["01"];
                    list["g105"] = voices.game["0001"]["05"];
                    break;
                case "1003":
                    list["g102"] = voices.game["0001"]["02"];
                    list["g105"] = voices.game["0001"]["05"];
                    break;
                case "1004":
                    list["g104"] = voices.game["0001"]["04"];
                    list["g105"] = voices.game["0001"]["05"];
                    break;
                case "1005":
                    list["g103"] = voices.game["0001"]["03"];
                    list["g105"] = voices.game["0001"]["05"];
                    break;
                case "1017":
                    for (let i in voices.game["0002"]) list["g2" + i] = voices.game["0002"][i];
                    for (let i in voices.game["0003"]) list["g3" + i] = voices.game["0003"][i];
                    break;
                case "8101":
                    for (let i in voices.kyube["0001"]) if (i < 24) list["q1" + i] = voices.kyube["0001"][i];
                    break;
                case "8100":
                    for (let i in voices.kyube["0001"]) if (i > 23) list["q1" + i] = voices.kyube["0001"][i];
                    break;
            }
            for (let c in list) { sv.append($("<option></option>").text(c).val(list[c])) }
            sv.val("");
        });
        se.change(function() {
            app.stage.children[0].internalModel.motionManager.stopAllMotions();
            app.stage.children[0].internalModel.motionManager.startMotion("Motion", sm.val() ?? 0);
            app.stage.children[0].internalModel.motionManager.expressionManager.setExpression(this.value)
        });
        sm.change(function() {
            app.stage.children[0].internalModel.motionManager.stopAllMotions();
            app.stage.children[0].internalModel.motionManager.startMotion("Motion", this.value)
        });
        sv.change(function() { 
            //audio = app.stage.children[0].model.playSound(this.value + ".mp3", "/magica/resource/sound_native/voice/");
        });
        $("#function > #g1 > button.exp").click(function(){ se.change() });
        $("#function > #g1 > button.motion").click(function(){ sm.change() });
        // $("#function > #g1 > button.replay").click(function(){
        //     sv.change();
        //     audio.load();
        //     audio.play();
        // });
        // $("#function > #g1 > button.pause").click(function(){
        //     if (audio.paused) audio.play();
        //     else audio.pause();
        // });
    });
    $('#background').click(function(){
        $('.background').toggle();
    });
    $(document).keydown(function({ code }) {
      code === 'CapsLock' && capture();
    });
});
