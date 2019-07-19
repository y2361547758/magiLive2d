
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
const option = {
    transparent: true,
    preserveDrawingBuffer: true,    // to capture
    view: document.getElementById("canvas")
}
if (!PIXI.Renderer) PIXI.Renderer = PIXI.WebGLRenderer
let renderer = null;
let stage = new PIXI.Container();
function init(x, y) {
    renderer = new PIXI.Renderer(x, y, option);
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(stage);
    }
    animate();
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
    live2dSprite.on("click", (evt) => {
        const point = evt.data.global;
        if (live2dSprite.hitTest("head", point.x, point.y)) {
            live2dSprite.setRandomExpression();
        }
        // if (live2dSprite.hitTest("body", point.x, point.y)) {
            live2dSprite.startRandomMotionOnce("motion");
            // live2dSprite.playSound("星のカケラ.mp3", "sound/");
        // }
    });
    if (follow) live2dSprite.on("mousemove", function(evt) {
        const point = evt.data.global;
        live2dSprite.setViewPoint(point.x, point.y);
    });
}
function show(path, model, callback) { getModel(path, model, _show, callback); }
