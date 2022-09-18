#!/usr/bin/python3
# -*- coding: UTF-8 -*-
import os
import re
import json
# import codecs
# def read_json(item):
#     with codecs.open(item, 'r', 'utf-8-sig') as f:
#         return json.load(f)

MODEL_PATH = 'resource/image_native/live2d_v4/'
dl = os.listdir(MODEL_PATH)
dl.sort()
models = {}
chars = {}
for m in dl:
    # params = read_json(MODEL_PATH + m + "/params.json")
    # charaName = params["charaName"]
    if not os.path.isdir(MODEL_PATH + m): continue
    ch = int(m[0:-2])
    with os.popen('grep charaName ' + MODEL_PATH + m + '/params.json | cut -d \'"\' -f 4 | sed \'s/　/ /g\'') as f:
        charaName = f.read().strip().replace('(圧縮)', '').replace('（圧縮）', '').replace('_圧縮', '').strip('_圧縮').replace(' ', '')
        name = charaName.split('_')[0].split('(')[0].split('（')[0]
    custom = re.search(r'[(（](.*?)[)）](.*)', charaName)
    if not name in chars and os.path.isdir(MODEL_PATH + m[0:-2] + '00'):
        with os.popen('grep charaName ' + MODEL_PATH + m[0:-2] + '00/params.json | cut -d \'"\' -f 4 | sed \'s/　/ /g\'') as f:
            name = f.read().rstrip().rstrip('圧縮').split('_')[0].split('(')[0].split('（')[0].replace(' ', '')
    custom = (custom.group(1) + '_' + custom.group(2)) if custom else charaName.lstrip(name)
    custom = custom.strip('_').replace('__', '_').replace('._', '.') if custom else charaName
    if not ch in models:
        if name in chars:
            if chars[name] > ch:
                models[ch] = models.pop(chars[name])
                chars[name] = ch
            else:
                if chars[name] < ch: ch = chars[name]
        else:
            chars[name] = ch
            models[ch] = {'name': name, 'models': {}}
    models[ch]['models'][int(m)] = custom
    # models[ch]['models'][int(m[-2:])] = {'name': custom, 'id': m}

with open(MODEL_PATH + "list.json", 'w', encoding="UTF-8") as f:
    json.dump(models, f, ensure_ascii=False, indent=4, sort_keys=True)

VOICE_PATH = 'resource/sound_native/voice/'
dl = os.listdir(VOICE_PATH)
voices = {'char': {}, 'game': {}, 'kyube': {}}
for m in dl:
    vo = re.match(r'^vo_([a-zA-Z]+?)_(.+)_hca\.hca$', m)
    if not vo: continue
    char = vo.group(1)
    if char == "char":
        id = re.search(r'(\d+)_(\d+)_(\d+)', vo.group(2))
        ch = id.group(1)
        custom = id.group(2)
        id = id.group(3)
        if not ch in voices['char']:
            voices['char'][ch] = {}
        if not custom in voices['char'][ch]:
            voices['char'][ch][custom] = {}
        voices['char'][ch][custom][id] = m[:-4]
    elif char == "game":
        id = re.search(r'(\d+)_(\d+)', vo.group(2))
        ch = id.group(1)
        id = id.group(2)
        if not ch in voices['game']:
            voices['game'][ch] = {}
        voices['game'][ch][id] = m[:-4]
    elif char == "kyube":
        id = re.search(r'(\d+)_(\d+)', vo.group(2))
        ch = id.group(1)
        id = id.group(2)
        if not ch in voices['kyube']:
            voices['kyube'][ch] = {}
        voices['kyube'][ch][id] = m[:-4]

with open(VOICE_PATH + "list.json", 'w', encoding="UTF-8") as f:
    json.dump(voices, f, ensure_ascii=False, indent=4, sort_keys=True)
