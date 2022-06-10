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
	server = "ws://" + window.location.hostname + "/rtcgw-ws";
else
  server = "wss://" + window.location.hostname + "/rtcgw-ws";
  
server = "wss://test11.ys7.com/rtcgw-ws";
var janus = null;
var sts = null;
var opaqueId = "sts-"+Janus.randomString(12);

// var spinner = null;

$(document).ready(function() {
	// Initialize the library (all console debuggers enabled)
	Janus.init({debug: "all", callback: function() {
		// Use a button to start the demo
		window.startWebRTC = function() {
			// Make sure the browser supports WebRTC
			if(!Janus.isWebrtcSupported()) {
				EZUIWebRTC.log("浏览器不支持WebRTC","error");
				return;
			}

			// if($('#sts_url').val().length == 0){
			// 	bootbox.alert("Please input sts url... ");
			// 	return;
			// }
			if(!(window.EZUIWebRTC.opt.stsUrl && window.EZUIWebRTC.opt.stsUrl.length >0)){
				EZUIWebRTC.log("sts地址不能为空","error");
				return;
			}

			// Create session
			janus = new Janus(
				{
					server: server,
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
						// Attach to sts plugin
						janus.attach(
							{
								plugin: "rtcgw.plugin.sts",
								opaqueId: opaqueId,
								success: function(pluginHandle) {
									$('#details').remove();
									sts = pluginHandle;
									EZUIWebRTC.log("Plugin attached! (" + sts.getPlugin() + ", id=" + sts.getId() + ")");
									// EZUIWebRTC.log(
									// Negotiate WebRTC
									//test10.ys.com
									//var url = "sts://10.86.29.210:8664/rtc?room=1000"
									// var url = $('#sts_url').val();
									var url = window.EZUIWebRTC.opt.stsUrl;
									var body = { "request": "start", "url": url};
									//sts.send({"message": body});
									EZUIWebRTC.log("Trying a createOffer too (audio/video sendrecv)");
									sts.createOffer(
										{
											// No media provided: by default, it's sendrecv for audio and video
											media: { audio: true, video: true, data: false },	// Audio only
											// If you want to test simulcasting (Chrome and Firefox only), then
											// pass a ?simulcast=true when opening this demo page: it will turn
											// the following 'simulcast' property to pass to janus.js to true
											simulcast: false,
											simulcast2: false,
											success: function(jsep) {
												EZUIWebRTC.log("Got SDP!");
												EZUIWebRTC.log(jsep);
												sts.send({"message": body, "jsep": jsep});
											},
											error: function(error) {
												Janus.error("WebRTC error:", error);
												EZUIWebRTC.log("WebRTC error... " + JSON.stringify(error),"error");
											}
										});
								},
								error: function(error) {
									EZUIWebRTC.log("  -- Error attaching plugin...", "error");
								},
								consentDialog: function(on) {
									EZUIWebRTC.log("Consent dialog should be " + (on ? "on" : "off") + " now");
									//Janus.debug("Consent dialog should be " + (on ? "on" : "off") + " now");
									// if(on) {
									// 	// Darken screen and show hint
									// 	$.blockUI({
									// 		message: '<div><img src="up_arrow.png"/></div>',
									// 		css: {
									// 			border: 'none',
									// 			padding: '15px',
									// 			backgroundColor: 'transparent',
									// 			color: '#aaa',
									// 			top: '10px',
									// 			left: (navigator.mozGetUserMedia ? '-100px' : '300px')
									// 		} });
									// } else {
									// 	// Restore screen
									// 	$.unblockUI();
									// }
								},
								iceState: function(state) {
									Janus.log("ICE state changed to " + state);
									EZUIWebRTC.log("ICE state changed to " + state);
								},
								mediaState: function(medium, on) {
									Janus.log("Janus " + (on ? "started" : "stopped") + " receiving our " + medium);
									EZUIWebRTC.log("Janus " + (on ? "started" : "stopped") + " receiving our " + medium);
								},
								webrtcState: function(on) {
									Janus.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
									EZUIWebRTC.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
									// $("#audioleft").parent().unblock();
								},
								slowLink: function(uplink, lost) {
									Janus.warn("Janus reports problems " + (uplink ? "sending" : "receiving") +
										" packets on this PeerConnection (" + lost + " lost packets)");
									EZUIWebRTC.log("Janus reports problems " + (uplink ? "sending" : "receiving") +
									" packets on this PeerConnection (" + lost + " lost packets)","warn");
								},
								onmessage: function(msg, jsep) {
									Janus.debug(" ::: Got a message :::");
									EZUIWebRTC.log(" ::: Got a message :::","debug");
									Janus.debug(msg);
									EZUIWebRTC.log(msg,"debug");
									if(jsep !== undefined && jsep !== null) {
										Janus.debug("Handling SDP as well...");
										Janus.debug(jsep);
										EZUIWebRTC.log("Handling SDP as well...","debug");
										EZUIWebRTC.log(jsep,"debug");
										sts.handleRemoteJsep({jsep: jsep});
									}
									var result = msg["result"];
									if(result !== null && result !== undefined) {
										if(result === "done") {
											// The plugin closed
											//bootbox.alert("The STS Test is over");
											EZUIWebRTC.log("The STS Test is over","warn");
											// if(spinner !== null && spinner !== undefined)
											// 	spinner.stop();
											// spinner = null;
											$('#myaudio').remove();
											//$('#waitingvideo').remove();
											$('#peeraudio').remove();
											return;
										}
										// Any loss?
										var status = result["status"];
										if(status === "slow_link") {
											//~ var bitrate = result["bitrate"];
											//~ toastr.warning("The bitrate has been cut to " + (bitrate/1000) + "kbps", "Packet loss?", {timeOut: 2000});
											toastr.warning("Janus apparently missed many packets we sent, maybe we should reduce the bitrate", "Packet loss?", {timeOut: 2000});
										  EZUIWebRTC.log("Janus apparently missed many packets we sent, maybe we should reduce the bitrate","warn");
										}
									}
									var events = msg["event"];
									if(events !== null && events !== undefined){
										if(events === "room_created"){
											var room = msg["room"];
											Janus.log("sts room created! " + room);
											EZUIWebRTC.log("房间创建成功!" + room,"success");
											EZUIWebRTC.opt.room = room;
										}
									}	
								},
								onlocalstream: function(stream) {
									Janus.debug(" ::: Got a local stream :::");
									EZUIWebRTC.log(" ::: Got a local stream :::","debug");
									Janus.debug(stream);
									EZUIWebRTC.log(stream,"debug")
									if($('#myvideo').length === 0) {
										$('#videos').removeClass('hide').show();
										$('#videoleft').append('<video class="rounded centered" id="myvideo" width=320 height=240 autoplay playsinline muted="muted"/>');
									}
									Janus.attachMediaStream($('#myvideo').get(0), stream);
									$("#myvideo").get(0).muted = "muted";
									if(sts.webrtcStuff.pc.iceConnectionState !== "completed" &&
											sts.webrtcStuff.pc.iceConnectionState !== "connected") {
										// $("#videoleft").parent().block({
										// 	message: '<b>Publishing...</b>',
										// 	css: {
										// 		border: 'none',
										// 		backgroundColor: 'transparent',
										// 		color: 'white'
										// 	}
										// });
										// No remote video yet
										$('#videoright').append('<video class="rounded centered" id="waitingvideo" width=320 height=240 />');
										// if(spinner == null) {
										// 	var target = document.getElementById('videoright');
										// 	spinner = new Spinner({top:100}).spin(target);
										// } else {
										// 	spinner.spin();
										// }
									}
									var videoTracks = stream.getVideoTracks();
									if(videoTracks === null || videoTracks === undefined || videoTracks.length === 0) {
										// No webcam
										$('#myvideo').hide();
										if($('#videoleft .no-video-container').length === 0) {
											$('#videoleft').append(
												'<div class="no-video-container">' +
													'No webcam available' +
												'</div>');
										}
									} else {
										$('#videoleft .no-video-container').remove();
										$('#myvideo').removeClass('hide').show();
									}
								},
								onremotestream: function(stream) {
									Janus.debug(" ::: Got a remote stream :::");
									Janus.debug(stream);
									EZUIWebRTC.log(" ::: Got a remote stream :::","debug");
									EZUIWebRTC.log(stream,"debug");
									if($('#peervideo').length === 0) {
										$('#videos').removeClass('hide').show();
										$('#videoright').append('<video class="rounded centered hide" id="peervideo" width=320 height=240 autoplay playsinline/>');
										// Show the video, hide the spinner and show the resolution when we get a playing event
										$("#peervideo").bind("playing", function () {
											$('#waitingvideo').remove();
											if(this.videoWidth)
												$('#peervideo').removeClass('hide').show();
											// if(spinner !== null && spinner !== undefined)
											// 	spinner.stop();
											// spinner = null;
										});
									}
									Janus.attachMediaStream($('#peervideo').get(0), stream);
									var videoTracks = stream.getVideoTracks();
									if(videoTracks === null || videoTracks === undefined || videoTracks.length === 0) {
										// No remote video
										$('#peervideo').hide();
										if($('#videoright .no-video-container').length === 0) {
											$('#videoright').append(
												'<div class="no-video-container">' +
													'<i class="fa fa-video-camera fa-5 no-video-icon"></i>' +
													'<span class="no-video-text">No remote video available</span>' +
												'</div>');
										}
									} else {
										$('#videoright .no-video-container').remove();
										$('#peervideo').removeClass('hide').show();
									}
								},
								ondataopen: function(data) {
									Janus.log("The DataChannel is available!");
									EZUIWebRTC.log("The DataChannel is available!","success");
								},
								ondata: function(data) {
									Janus.debug("We got data from the DataChannel! " + data);
									EZUIWebRTC.log("We got data from the DataChannel!" + data,"debug");
								},
								oncleanup: function() {
									Janus.log(" ::: Got a cleanup notification :::");
									EZUIWebRTC.log(" ::: Got a cleanup notification :::");
									// if(spinner !== null && spinner !== undefined)
									// 	spinner.stop();
									// spinner = null;
									$('#myvideo').remove();
									$('#waitingvideo').remove();
									// $("#videoleft").parent().unblock();
									$('#peervideo').remove();
								}
							});
					},
					error: function(error) {
						Janus.error(error);
						EZUIWebRTC.log(error,"error")
						// bootbox.alert(error, function() {
						// 	window.location.reload();
						// });
					},
					destroyed: function() {
						// window.location.reload();
					}
				});
		};
	}});
});

// 停止
window.stopWebRTC = function (){
	janus.destroy();
}




