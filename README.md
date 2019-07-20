# magiLive2d
One another Live2d viewer, base on Pixi.js 4, for Magireco

see [DEMO](https://git.rika.ren/) or [LiveView](https://jp.rika.ren/live2d/index.html)

# prepare

To access game files, you can use a proxy or download them on your server.
A proxy can't work well by default.

## Proxy
```
[required]
/magica/resource/image_native/live2d/ -> $(proxy)/magica/resource/download/asset/master/resource/image_native/live2d/
[option]
/magica/resource/sound_native/voice/ -> $(proxy)/magica/resource/download/asset/master/resource/sound_native/voice/
/magica/resource/image_web/ -> $(proxy)/magica/resource/image_web/
```

## Download
### Models & images

Because the download-resources that larger than 1MB are split in to 1MB piece, you'd better download the resources and joint them.
See [magireco-data-downloader](https://gitlab.com/Nanami_yachiyo/magireco-data-downloader)/[multithread](https://gitlab.com/Nanami_yachiyo/magireco-data-downloader/blob/multithread/py3/py3_down.py)

### Voices

After you joint resources, you just got .hca encripted sounds. Decrypt them and encode them into .mp3 or other format yourself.
Remember change ext in [js/page.js](https://github.com/y2361547758/magiLive2d/blob/master/js/page.js#L95).

For hca decrypt, see [HCADecoder](https://github.com/Nyagamon/HCADecoder) | [FastHCADecoder](https://github.com/KinoMyu/FastHCADecoder) | [Ishotihadus/hca](https://github.com/Ishotihadus/hca) | etc.

## list.json

Create the list.json on `live2d/` and `voice/` yourself, or run `makelist.py` with

# Feature

Expression, Motion, Voice; Mouse/touch follow; Click/touch motion; Replay/pause voice; Resize; Zoom; Capture

# Todo

* Model position controlor
* Voice with motion / Motion with voice
* Record video/gif
* Backgroud (static) switch, capture include background option
* Multi model display/control
* Talkbox text 
* Story script re-play (?) 

# Dependency

[Live2D cubism-sdk2 WebGL](http://sites.cybernoids.jp/cubism-sdk2_e/webgl2-1) ([LICENCE](http://sites.cybernoids.jp/cubism-sdk2_e/policy-sdk))

[pixi-live2d](https://github.com/avgjs/pixi-live2d) ([LICENCE](https://github.com/avgjs/pixi-live2d/blob/master/LICENSE.txt))

[Pixi.js](https://github.com/pixijs/pixi.js) ([LICENCE](https://github.com/pixijs/pixi.js/blob/master/LICENSE.txt))

