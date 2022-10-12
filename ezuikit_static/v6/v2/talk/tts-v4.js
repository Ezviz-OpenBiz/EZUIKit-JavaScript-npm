// We make use of this 'server' variable to provide the address of the
// REST Janus API. By default, in this example we assume that Janus is
// co-located with the web server hosting the HTML pages but listening
// on a different port (8088, the default for HTTP in Janus), which is
// why we make use of the 'window.location.hostname' base address. Since
// Janus can also do HTTPS, and considering we don't really want to make
// use of HTTP for Janus if your demos are served on HTTPS, we also rely
// on the 'window.location.protocol' prefix to build the variable, in
// particular to also change the port used to contact Janus (8088 for
// HTTP and 8089 for HTTPS, if enabled).
// In case you place Janus behind an Apache frontend (as we did on the
// online demos at http://janus.conf.meetecho.com) you can just use a
// relative path for the variable, e.g.:
//
// 		var server = "/janus";
//
// which will take care of this on its own.
//
//
// If you want to use the WebSockets frontend to Janus, instead, you'll
// have to pass a different kind of address, e.g.:
//
// 		var server = "ws://" + window.location.hostname + ":8188";
//
// Of course this assumes that support for WebSockets has been built in
// when compiling the server. WebSockets support has not been tested
// as much as the REST API, so handle with care!
//
//
// If you have multiple options available, and want to let the library
// autodetect the best way to contact your server (or pool of servers),
// you can also pass an array of servers, e.g., to provide alternative
// means of access (e.g., try WebSockets first and, if that fails, fall
// back to plain HTTP) or just have failover servers:
//
//		var server = [
//			"ws://" + window.location.hostname + ":8188",
//			"/janus"
//		];
//
// This will tell the library to try connecting to each of the servers
// in the presented order. The first working server will be used for
// the whole session.
//
var server = null;
if(window.location.protocol === 'http:')
  //server = "http://" + window.location.hostname + ":9020/janus";
  // yujianbo
  server = "https://" + "10.80.21.211" + ":9022/janus";
else
  //server = "https://" + window.location.hostname + ":9022/janus";
  // -yujianbo
  server = "https://" + "10.80.21.211" + ":9022/janus";

var janus = null;
var tts = null;
var opaqueId = "tts-"+Janus.randomString(12);

var spinner = null;

	// Initialize the library (all console debuggers enabled)
	Janus.init({debug: "all", callback: function() {
		window.stopTalk = function (){
			janus.destroy();
		}
		// debugger;
		window.startTalk = function() {
			// Make sure the browser supports WebRTC
			if(!Janus.isWebrtcSupported()) {
				bootbox.alert("No WebRTC support... ");
				return;
			}

			// if($('#tts_url').val().length == 0){
			// 	bootbox.alert("Please input tts url... ");
			// 	return;
			// }

			// $(this).attr('disabled', true).unbind('click');

			// Create session
			janus = new Janus(
				{
					server: window.EZUIKit.opt.rtcUrl,
					// No "iceServers" is provided, meaning janus.js will use a default STUN server
					// Here are some examples of how an iceServers field may look like to support TURN
					// 		iceServers: [{urls: "turn:yourturnserver.com:3478", username: "janususer", credential: "januspwd"}],
					// 		iceServers: [{urls: "turn:yourturnserver.com:443?transport=tcp", username: "janususer", credential: "januspwd"}],
					// 		iceServers: [{urls: "turns:yourturnserver.com:443?transport=tcp", username: "janususer", credential: "januspwd"}],
					// Should the Janus API require authentication, you can specify either the API secret or user token here too
					//		token: "mytoken",
					//	or
					//		apisecret: "serversecret",
					success: function() {
						// Attach to tts plugin
						janus.attach(
							{
								plugin: "rtcgw.plugin.tts",
								opaqueId: opaqueId,
								success: function(pluginHandle) {
									// $('#details').remove();
									tts = pluginHandle;
									Janus.log("Plugin attached! (" + tts.getPlugin() + ", id=" + tts.getId() + ")");
									// Negotiate WebRTC
									//var url = "tts://61.130.6.23:8664/talk://D13781761:0:1:cas.ys7.com:6500?97fbd2a75fa94b7682c994d3d1fac8ca:ut.5porslgu79e9r7ca48z32k8abgl3rp58-77bhb6i7xr-1kmumtg-jkhy7pvfr:0:3"
									

									//var url = "tts://10.86.15.209:8664/talk://D13781761:0:1:cas.ys7.com:6500?32db2578ba7c4a84be22ecc0bcd0f8db:ut.5lqpkhim5m7cdk2y5w60g7hm9vd7i3v0-3d2pwhxe2t-11wx2ge-sh4yazbll:0:3"
									//var url = "tts://10.86.15.209:8664/talk://D13781761:0:1:cas.ys7.com:6500"
									//test12.ys.com
									//var url = "tts://10.86.15.209:8664/talk://D08197169:0:1:cas.ys7.com:6500"
									//test10.ys.com
									//var url = "tts://10.86.29.210:8664/talk://D08197169:0:1:cas.ys7.com:6500"
									var url = window.EZUIKit.opt.talkLink;
									console.log("ttsUlr",url);
									var body = { "request": "start", "url": url, "codec": "opus", "dir": "sendrecv", "audio_debug": 1};
									//tts.send({"message": body});
									Janus.debug("Trying a createOffer too (audio/video sendrecv)");
									tts.createOffer(
										{
											// No media provided: by default, it's sendrecv for audio and video
											media: { audio: true, video: false, data: false },	// Audio only
											// If you want to test simulcasting (Chrome and Firefox only), then
											// pass a ?simulcast=true when opening this demo page: it will turn
											// the following 'simulcast' property to pass to janus.js to true
											simulcast: false,
											simulcast2: false,
											success: function(jsep) {
												Janus.debug("Got SDP!");
												Janus.debug(jsep);
												tts.send({"message": body, "jsep": jsep});
												if(typeof window.EZUIKit.handleTalkSuccess !== 'undefined'){
													window.EZUIKit.handleTalkSuccess();
												}
											},
											error: function(error) {
												Janus.error("WebRTC error:", error);
											//	bootbox.alert("WebRTC error... " + JSON.stringify(error));
											if(typeof window.EZUIKit.handleTalkError !== 'undefined'){
												window.EZUIKit.handleTalkError(error);
											}
											}
										});
									// $('#start').removeAttr('disabled').html("Stop")
									// 	.click(function() {
									// 		$(this).attr('disabled', true);
									// 		janus.destroy();
									// 	});
								},
								error: function(error) {
									console.error("  -- Error attaching plugin...", error);
									bootbox.alert("Error attaching plugin... " + error);
									if(window.EZUIKit.handleTalkError !== 'undefined'){
										window.EZUIKit.handleTalkError(error);
									}
								},
								consentDialog: function(on) {
									Janus.debug("Consent dialog should be " + (on ? "on" : "off") + " now");
									if(on) {
										// Darken screen and show hint
										// $.blockUI({
										// 	message: '<div><img src="up_arrow.png"/></div>',
										// 	css: {
										// 		border: 'none',
										// 		padding: '15px',
										// 		backgroundColor: 'transparent',
										// 		color: '#aaa',
										// 		top: '10px',
										// 		left: (navigator.mozGetUserMedia ? '-100px' : '300px')
										// 	} });
									} else {
										// Restore screen
										// $.unblockUI();
									}
								},
								iceState: function(state) {
									Janus.log("ICE state changed to " + state);
								},
								mediaState: function(medium, on) {
									Janus.log("Janus " + (on ? "started" : "stopped") + " receiving our " + medium);
								},
								webrtcState: function(on) {
									Janus.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
									// $("#audioleft").parent().unblock();
								},
								slowLink: function(uplink, lost) {
									Janus.warn("Janus reports problems " + (uplink ? "sending" : "receiving") +
										" packets on this PeerConnection (" + lost + " lost packets)");
								},
								onmessage: function(msg, jsep) {
									Janus.debug(" ::: Got a message :::");
									Janus.debug(msg);
									if(jsep !== undefined && jsep !== null) {
										Janus.debug("Handling SDP as well...");
										Janus.debug(jsep);
										tts.handleRemoteJsep({jsep: jsep});
									}
									var result = msg["result"];
									if(result !== null && result !== undefined) {
										if(result === "done") {
											// The plugin closed
											bootbox.alert("The TTS Test is over");
											if(spinner !== null && spinner !== undefined)
												spinner.stop();
											spinner = null;
											// $('#myaudio').remove();
											//$('#waitingvideo').remove();
											// $('#peeraudio').remove();
											return;
										}

										if(result === "msg"){
											if(typeof window.EZUIKit.handleTalkMessage !== 'undefined'){
												window.EZUIKit.handleTalkMessage(msg);
								      }
                    }
										// Any loss?
										var status = result["status"];
										if(status === "slow_link") {
											//~ var bitrate = result["bitrate"];
											//~ toastr.warning("The bitrate has been cut to " + (bitrate/1000) + "kbps", "Packet loss?", {timeOut: 2000});
											toastr.warning("Janus apparently missed many packets we sent, maybe we should reduce the bitrate", "Packet loss?", {timeOut: 2000});
										}
									}
								},
								onlocalstream: function(stream) {
									Janus.debug(" ::: Got a local stream :::");
									Janus.debug(stream);

									// if($('#myaudio').length === 0) {
									// 	$('#audios').removeClass('hide').show();
									// 	$('#audioleft').append('<audio id="myaudio" autoplay controls muted>Your browser does not support audio tag</audio>');
									// }
									Janus.attachMediaStream(document.getElementById("myaudio"), stream);
									//$("#myaudio").get(0).muted = "muted";
									if(tts.webrtcStuff.pc.iceConnectionState !== "completed" &&
											tts.webrtcStuff.pc.iceConnectionState !== "connected") {
										// $("#audioleft").parent().block({
										// 	message: '<b>Publishing...</b>',
										// 	css: {
										// 		border: 'none',
										// 		backgroundColor: 'transparent',
										// 		color: 'white'
										// 	}
										// });
										// No remote video yet
										//$('#audioright').append('<video class="rounded centered" id="waitingvideo" width=320 height=240 />');
										if(spinner == null) {
											var target = document.getElementById('audioright');
											//spinner = new Spinner({top:100}).spin(target);
										} else {
											spinner.spin();
										}
									}
									var audioTracks = stream.getAudioTracks();
									if(audioTracks === null || audioTracks === undefined || audioTracks.length === 0) {
										// $('#myaudio').hide();
									} else {
										// $('#myaudio').removeClass('hide').show();
										// document.getElementById('myaudio').play();
									}
								},
								onremotestream: function(stream) {
									Janus.debug(" ::: Got a remote stream :::");
									Janus.debug(stream);
									// if($('#peeraudio').length === 0) {
									// 	$('#audios').removeClass('hide').show();
									// 	// $('#audioright').append('<audio id="peeraudio" autoplay controls>Your browser does not support audio tag</audio>');
									// 	// Show the video, hide the spinner and show the resolution when we get a playing event
									// 	var audio = $('<audio id="peeraudio" autoplay controls playsinline preload="preload" loop="true"></audio>');
									// 	audio = audio.get(0);
									// 	audio.setAttribute("id", 'peeraudio');
									// 	audio.setAttribute("preload","preload");
									// 	// 自动播放解决苹果不兼容autoplay属性
									// 	audio.setAttribute("loop",true);
									// 	$('#audioright').append(audio);
									// 	$("#peeraudio").bind("playing", function () {
									// 		//$('#waitingvideo').remove();
									// 		$('#peeraudio').removeClass('hide').show();
									// 		if(spinner !== null && spinner !== undefined)
									// 			spinner.stop();
									// 		spinner = null;
									// 	});
									// }
									Janus.attachMediaStream(document.getElementById("peeraudio"), stream);
									var audioTracks = stream.getAudioTracks();
									if(audioTracks === null || audioTracks === undefined || audioTracks.length === 0) {
									//	$('#peeraudio').hide();
									} else {
									//	$('#peeraudio').removeClass('hide').show();
										document.getElementById('peeraudio').play();
									}
								},
								ondataopen: function(data) {
									Janus.log("The DataChannel is available!");
								},
								ondata: function(data) {
									Janus.debug("We got data from the DataChannel! " + data);
								},
								oncleanup: function() {
									Janus.log(" ::: Got a cleanup notification :::");
									if(spinner !== null && spinner !== undefined)
										spinner.stop();
									spinner = null;
									// $('#myaudio').remove();
									// //$('#waitingvideo').remove();
									// $("#audioleft").parent().unblock();
									// $('#peeraudio').remove();
								}
							});
					},
					error: function(error) {
						Janus.error(error);
						if(window.EZUIKit.handleTalkError !== 'undefined'){
							window.EZUIKit.handleTalkError(error);
						}
					},
					destroyed: function() {
						// window.location.reload();
					}
				});
			}

	}});

function checkEnter(event) {
	var theCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
	if(theCode == 13) {
		sendData();
		return false;
	} else {
		return true;
	}
}

// Helper to parse query string
function getQueryStringValue(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

