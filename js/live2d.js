
// Global: if chara watch the pointer
let follow = true;

// edit the model content, re-locate relative path
function setpath(model, baseurl) {
    function sa(arr, name) {
        if (!name) for (let j in arr) arr[j] = baseurl + arr[j];
        else for (let j in arr) arr[j][name] = baseurl + arr[j][name];
    }
    if (typeof model == "object") {
        for (let i in model) {
            switch (i) {
                case "model":
                case "physics":
                case "pose":
                    model[i] = baseurl + model[i];
                break;
                case "textures":
                case "idleFace":
                case "motionFace":
                    sa(model[i]);
                break;
                case "expressions":
                    sa(model[i], "file");
                break;
                case "motions":
                    for (let j in model[i]) sa(model[i][j], "file");
                break;
            }
        }
    }
    model["hit_areas"] = [
        {"name":"head", "id":"D_REF.HEAD"},
        {"name":"body", "id":"D_REF.BODY"}
    ];
    return model;
}
// AJAX get
function getModel(path, model, callback, callback2) {
    $.getJSON({
        url: path + model,
        dataType: "json",
        success: function(data) {
            callback(setpath(data, path));
            callback2(data);
        },
        error: function(xhr) {alert(xhr.responseJSON)}
    });
}
// Pixi option
let option = {
    width: 900,
    height: 1600,
    transparent: true,
    preserveDrawingBuffer: true,    // to capture
    view: document.getElementById("canvas")
}
let app = null;
let stage = new PIXI.Container();

function init(x, y) {
    option.width = x;
    option.height = y;
    app = new PIXI.Application(option);
    app.stage.addChild(stage);
    // const sprite = new PIXI.Sprite.fromImage("./7_room2_a.jpg");
    // stage.addChild(sprite);
}
function _show(model) {
    // let model = getModel(url);
    const live2dSprite = new PIXI.Live2DSprite(model, {
        eyeBlink: true,
        lipSyncWithSound: true,
        debugLog: false,
        debugMouseLog: false,
        randomMotion: false,
        defaultMotionGroup:"motion"
    });
    stage.addChild(live2dSprite);
    live2dSprite.adjustScale(0, 0, 0.75);
    // live2dSprite.startRandomMotion("motion");
    // live2dSprite.setRandomExpression();
    function t(evt) {
        const point = evt.data.global;
        if (live2dSprite.hitTest("head", point.x, point.y)) {
            live2dSprite.setRandomExpression();
        }
        live2dSprite.startRandomMotionOnce("motion");
    }
    live2dSprite.on("click", t);
    live2dSprite.on("tap", t);
    live2dSprite.on("pointertap", t);
    let o = null;
    live2dSprite.on("touchstart", function(evt) {
        o = {x: evt.data.global.x, y: evt.data.global.y};
    });
    live2dSprite.on("touchmove", function(evt) {
        if (o) {
            let t = {x: evt.data.global.x, y:evt.data.global.y};
            window.scroll(window.scrollX + o.x - t.x, window.scrollY + o.y - t.y);
        }
    });
    live2dSprite.on("touchend", function() { o = null; });
    if (follow) {
        function f(evt) {
            const point = evt.data.global;
            live2dSprite.setViewPoint(point.x, point.y);
        }
        live2dSprite.on("mousemove", f);
        live2dSprite.on("touchstart", f);
        live2dSprite.on("tap", f);
        live2dSprite.on("touchmove", f);
        live2dSprite.on("pointermove", f);
        live2dSprite.on("pointerdown", f);
    }
}
function show(path, model, callback) { getModel(path, model, _show, callback); }
