/**
 * Created by wangweijie5 on 2016/12/16.
 */

"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __instance = function () {
    var instance = void 0;
    return function (newInstance) {
        if (newInstance) instance = newInstance;
        return instance;
    };
}();

var AudioRenderer = function () {
    function AudioRenderer() {
        _classCallCheck(this, AudioRenderer);

        if (__instance()) return __instance();

        // 确保只有单例
        if (AudioRenderer.unique !== undefined) {
            return AudioRenderer.unique;
        }

        AudioRenderer.unique = this;

        this.oAudioContext = null;
        this.currentVolume = 80; // 初始音量
        this.bSetVolume = false;
        this.gainNode = null;
        this.iWndNum = -1; // 窗口号
        this.mVolumes = new Map(); // 用于存储所有音量

        // Init AudioContext
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        this.oAudioContext = new AudioContext();

        this.writeString = function (view, offset, string) {
            for (var i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };

        this.setBufferToDataview = function (output, offset, input) {
            for (var i = 0; i < input.length; i++, offset++) {
                output.setUint8(offset, input[i]);
            }
        };

        __instance(this);
    }

    /**
     * @synopsis 音频播放
     *
     *  @param dataBuf [IN] 音频缓存
     *  @param dataLen [IN] 缓存长度
     *  @param audioInfo [IN] 音频参数
     *
     * @returns 状态码
     */


    _createClass(AudioRenderer, [{
        key: 'Play',
        value: function Play(dataBuf, dataLen, audioInfo) {
            var bufferData = new ArrayBuffer(44 + dataLen);
            var viewTalk = new DataView(bufferData);
            var sampleRates = audioInfo.samplesPerSec;
            var channels = audioInfo.channels;
            var bitsPerSample = audioInfo.bitsPerSample;

            //console.log("audiorender sampleRates"+sampleRates+"channels:"+channels+"bitsPerSample:"+bitsPerSample);

            /* RIFF identifier */
            this.writeString(viewTalk, 0, 'RIFF');
            /* file length */
            viewTalk.setUint32(4, 32 + dataLen * 2, true);
            /* RIFF type */
            this.writeString(viewTalk, 8, 'WAVE');
            /* format chunk identifier */
            this.writeString(viewTalk, 12, 'fmt ');
            /* format chunk length */
            viewTalk.setUint32(16, 16, true);
            /* sample format (raw) */
            viewTalk.setUint16(20, 1, true);
            /* channel count */
            viewTalk.setUint16(22, channels, true);
            /* sample rate */
            viewTalk.setUint32(24, sampleRates, true);
            /* byte rate (sample rate * block align) */
            viewTalk.setUint32(28, sampleRates * 2, true);
            /* block align (channel count * bytes per sample)/8 */
            viewTalk.setUint16(32, channels * bitsPerSample / 8, true);
            /* bits per sample */
            viewTalk.setUint16(34, bitsPerSample, true);
            /* data chunk identifier */
            this.writeString(viewTalk, 36, 'data');
            /* data chunk length */
            viewTalk.setUint32(40, dataLen, true);
            this.setBufferToDataview(viewTalk, 44, dataBuf);

            var self = this;
            this.oAudioContext.decodeAudioData(viewTalk.buffer, function (buffer) {

                var bufferSource = self.oAudioContext.createBufferSource();
                if (bufferSource == null) {
                    return -1;
                }

                bufferSource.buffer = buffer;
                bufferSource.start(0);

                if (self.gainNode == null || self.bSetVolume) {
                    self.gainNode = self.oAudioContext.createGain();
                    // self.gainNode.gain.value = self.currentVolume;
                    // // self.currentVolume = self.gainNode.gain.value;
                    // self.gainNode.connect(self.oAudioContext.destination);

                    self.bSetVolume = false;
                }

                self.gainNode.gain.value = self.currentVolume/100;
                // self.currentVolume = self.gainNode.gain.value;
                self.gainNode.connect(self.oAudioContext.destination);

                bufferSource.connect(self.gainNode);
            }, function (e) {
                console.log("decode error");
                return -1;
            });

            return 0;
        }

        /**
         * @synopsis 停止播放
         *
         * @returns 返回音量
         */

    }, {
        key: 'Stop',
        value: function Stop() {
            if (this.gainNode != null) {
                this.gainNode.disconnect();
                this.gainNode = null;
            }

            // this.oAudioContext.close();

            // AudioRenderer.unique = undefined;
            // __instance() = null;
            return true;
        }

        /**
         * @synopsis 设置音量
         *
         *  @param iVolume [IN] 音量
         *
         * @returns 状态码
         */

    }, {
        key: 'SetVolume',
        value: function SetVolume(iVolume) {
            this.bSetVolume = true;
            this.currentVolume = iVolume;

            // 储存当前窗口设置音量值
            this.mVolumes.set(this.iWndNum, this.currentVolume);
            return true;
        }

        /**
         * @synopsis 设置窗口号
         *
         *  @param iWndNum [IN] 窗口号
         *
         * @returns 状态码
         */

    }, {
        key: 'SetWndNum',
        value: function SetWndNum(iWndNum) {
            this.iWndNum = iWndNum;

            // 获取当前窗口设置音量值
            var iVolume = this.mVolumes.get(iWndNum);
            if (iVolume == undefined) {
                iVolume = 80; // 默认音量
            }
            this.currentVolume = iVolume;

            return true;
        }

        /**
         * @synopsis 获取音量
         *
         * @returns 返回音量
         */

    }, {
        key: 'GetVolume',
        value: function GetVolume() {
            // 获取当前窗口设置音量值
            var iVolume = this.mVolumes.get(this.iWndNum);
            if (iVolume == undefined) {
                iVolume = 80; // 默认音量
            }

            return iVolume;
        }
    }]);

    return AudioRenderer;
}();
//# sourceMappingURL=AudioRenderer.js.map