import { ClientEvent } from '../enums/client-event.enum';
import { ConnectionState } from '../types/connection-state.type';
import { ChannelMediaError } from './channel-media-error.model';
import { ChannelMediaRelayConfiguration } from './channel-media-relay-configuration.model';
import { InjectStreamConfig } from './inject-stream-config.model';
import { LiveTranscoding } from './live-transcoding.model';
import { LocalAudioStatsMap } from './local-audio-stats-map.model';
import { LocalVideoStatsMap } from './local-video-stats-map.model';
import { RemoteAudioStatsMap } from './remote-audio-stats-map.model';
import { RemoteVideoStatsMap } from './remote-video-stats-map.model';
import { SessionStats } from './session-stats.model';
import { Stream } from './stream.model';
import { SubscribeOptions } from './subscribe-options.model';
import { SystemStats } from './system-stats.model';
import { TransportStats } from './transport-stats.model';
import { TurnServer } from './turn-server.model';

/**
 * The Client object returned by the [createClient](https://docs.agora.io/en/Video/API%20Reference/web/globals.html#createclient)
 * method provides access to much of the core AgoraRTC functionality.
 *
 * @see [Web Client](https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.client.html)
 */
export interface AgoraClient {
  /**
   * Injects an Online Media Stream to a Live Broadcast
   *
   * If this method is called successfully, the server pulls the voice or video stream and
   * injects it into a live channel. This is applicable to scenarios where all of the audience members
   * in the channel can watch a live show and interact with each other.
   *
   *
   * This method call triggers the following callbacks:
   *
   * - On the local client:
   *   - `Client.on("streamInjectedStatus")`, with the state of injecting the online stream.
   *   - `Client.on("stream-added")` and `Client.on("peer-online")` (uid: 666), if the online media stream is injected into the channel.
   *
   * - On the remote client:
   *   - `Client.on("stream-added")` and `Client.on("peer-online")` (uid: 666), if the online media stream is injected into the channel.
   *
   * @remarks
   * You can only inject one online media stream into the same channel at the same time.
   * Ensure that you [enable the RTMP Converter service](https://docs.agora.io/en/Video/cdn_streaming_web#prerequisites)
   * before using this function.
   *
   * @param url URL address of the live streaming.
   * ASCII characters only, and the string length must be greater than 0 and less than 256 bytes.
   * Valid protocols are RTMP, HLS, and HTTP-FLV.
   *
   * - Supported FLV audio codec type: AAC.
   * - Supported FLV video codec type: H.264 (AVC).
   *
   * @param config Configuration of the inject stream, see
   * [InjectStreamConfig](https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.injectstreamconfig.html) for details.
   *
   * @see [Inject an Online Media Stream](https://docs.agora.io/en/Interactive%20Broadcast/inject_stream_web?platform=Web) for details.
   */
  addInjectStreamUrl: (url: string, config: InjectStreamConfig) => void;
  /**
   * Configures the CDN Live Streaming
   *
   * @deprecated Agora recommends using the following methods instead:
   *  - [startLiveStreaming](https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.client.html#startlivestreaming)
   *  - [setLiveTranscoding](https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.client.html#setlivetranscoding)
   *  - [stopLiveStreaming](https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.client.html#stoplivestreaming)
   * @description
   * This method configures the CDN live streaming before joining a channel.
   * Call [configPublisher](https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.client.html#configpublisher) before
   * [Client.join](https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.client.html#join).
   * @example
   * client.configPublisher({
   *  width: 360,
   *  height: 640,
   *  framerate: 30,
   *  bitrate: 500,
   *  publishUrl: "rtmp://xxx/xxx/"
   * });
   */
  configPublisher: (
    width: number,
    height: number,
    framerate: number,
    bitrate: number,
    publisherUrl: string
  ) => void;
  /**
   * Disables dual streams.
   *
   * @example
   * client.disableDualStream(() => {
   *   console.log("Disable dual stream success!")
   * }, err => {
   *   console.log(err)
   * })
   */
  disableDualStream: (
    onSuccess?: () => any,
    onFailure?: (error: Error) => any
  ) => void;
  /**
   * Enables the SDK to report the active remote users who are speaking and their volume regularly.
   *
   * If this method is enabled, the SDK will return the volumes every two seconds, regardless of whether there are active speakers.
   *
   * @remark
   * If you have multiple web pages running the Web SDK, this function might not work.
   *
   * @example
   * client.enableAudioVolumeIndicator(); // Triggers the "volume-indicator" callback event every two seconds.
   * client.on("volume-indicator", evt => {
   *   evt.attr.forEach((volume, index) => {
   *     console.log(`#${index} UID ${volume.uid} Level ${volume.level}`);
   *   });
   * });
   */
  enableAudioVolumeIndicator: () => void;
  /**
   * Enables the dual-stream mode on the publisher side.
   *
   * Dual streams are a hybrid of a high-video stream and a low-video stream:
   * - High-video stream: high bitrate, high resolution
   * - Low-video stream: low bitrate, low resolution
   *
   * @example
   * client.enableDualStream(() => {
   *   console.log("Enable dual stream success!")
   * }, err => {
   *   console,log(err)
   * })
   *
   * @remark
   * This method does not apply to the following scenarios:
   * - The stream is created by defining the audioSource and videoSource properties.
   * - Audio-only mode (audio: true, video: false)
   * - Safari browser on iOS
   * - Screen-sharing scenario
   */
  enableDualStream: (
    onSuccess?: () => any,
    onFailure?: (error: Error) => any
  ) => void;
  /**
   * Enumerates the available video input devices, such as cameras.
   *
   * If this method succeeds, the SDK returns a list of video input devices in an array of MediaDeviceInfo objects.
   */
  getCameras: (callback: (devices: MediaDeviceInfo[]) => any) => void;
  /**
   * This method returns the state of the connection between the SDK and Agora's edge server.
   *
   * @description
   * The connection state:
   *  - DISCONNECTED: The SDK is disconnected from Agora's edge server.
   *    This is the initial state before
   *    [Client.join](https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.client.html#join).
   *    The SDK also enters this state after the app calls
   *    [Client.leave](https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.client.html#leave).
   *  - CONNECTING: The SDK is connecting to Agora's edge server. The SDK enters this state when
   *    calling [Client.join](https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.client.html#join)
   *    or reconnecting to Agora's edge server automatically after the connection is lost.
   *  - CONNECTED: The SDK is connected to Agora's edge server and joins a channel. You can now publish or
   *    subscribe to a stream in the channel.
   *  - DISCONNECTING: The SDK is disconnecting from Agora's edge server. The SDK enters this state when calling
   *    [Client.leave](https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.client.html#leave).
   */
  getConnectionState: () => ConnectionState;
  /**
   * Retrieves the Audio Statistics of the Local Stream
   *
   * This method retrieves the audio statistics of the published stream,
   * including audio codec type, sampling rate, bitrate, and so on.
   *
   * @description
   *  - Some of the statistics are calculated after the stream-published event, which may take at most 3 seconds.
   * - This method supports the Chrome browser only.
   * @example
   * client.getLocalAudioStats((localAudioStats) => {
   *  Object.keys(localAudioStats).forEach(uid => {
   *   console.log(`Audio CodecType from ${uid}: ${localAudioStats[uid].CodecType}`);
   *   console.log(`Audio MuteState from ${uid}: ${localAudioStats[uid].MuteState}`);
   *   console.log(`Audio RecordingLevel from ${uid}: ${localAudioStats[uid].RecordingLevel}`);
   *   console.log(`Audio SamplingRate from ${uid}: ${localAudioStats[uid].SamplingRate}`);
   *   console.log(`Audio SendBitrate from ${uid}: ${localAudioStats[uid].SendBitrate}`);
   *   console.log(`Audio SendLevel from ${uid}: ${localAudioStats[uid].SendLevel}`);
   *  })
   * });
   */
  getLocalAudioStats: (callback: (stats: LocalAudioStatsMap) => any) => void;
  /**
   * Retrieves the Video Statistics of the Local Stream
   *
   * This method retrieves the video statistics of the published stream, including video resolution, bitrate, frame rate, and so on.
   *
   * @description
   * Some of the statistics are calculated after the stream-published event, which may take at most 3 seconds.
   * This method supports the Chrome browser only.
   */
  getLocalVideoStats: (callback: (stats: LocalVideoStatsMap) => any) => void;
  /**
   * Gets the Statistics of the System Network
   * @deprecated from v2.5.1, use getTransportStats instead.
   *
   * This method gets the statistics of the browser's local network.
   * Currently only the network type information is provided, see NetworkType.
   *
   * @description
   * Chrome 61+ is required for this function, and the compatibility is not guaranteed. See Network Information API for details.
   */
  getNetworkStats: (callback: (stats: any) => any) => void;
  /**
   * Enumerates Audio Output Devices
   *
   * This method enumerates the available audio output devices, such as speakers.
   * If this method succeeds, the SDK returns a list of audio output devices in an array of
   * [MediaDeviceInfo](https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.mediadeviceinfo.html) objects.
   */
  getPlayoutDevices: (callback: (devices: MediaDeviceInfo[]) => any) => void;
  /**
   * Enumerates Audio Input Devices
   *
   * This method enumerates the available audio input devices, such as microphones.
   * If this method succeeds, the SDK returns a list of audio input devices in an array of MediaDeviceInfo objects.
   */
  getRecordingDevices: (callback: (devices: MediaDeviceInfo[]) => any) => void;
  /**
   * Retrieves the Audio Statistics of the Remote Stream
   * This method retrieves the audio statistics of the remote stream, including audio codec type, packet loss rate, bitrate, and so on.
   *
   * @description
   * The statistics are calculated after the `stream-subscribed` event, which may take at most 3 seconds.
   * This method supports the Chrome browser only.
   */
  getRemoteAudioStats: (callback: (stats: RemoteAudioStatsMap) => void) => void;
  /**
   * Retrieves the Video Statistics of the Remote Stream
   * This method retrieves the video statistics of the remote stream, including packet loss rate, video bitrate, frame rate, and so on.
   *
   * @description
   * The statistics are calculated after the `stream-subscribed` event, which may take at most 3 seconds.
   * This method supports the Chrome browser only.
   */
  getRemoteVideoStats: (callback: (stats: RemoteVideoStatsMap) => void) => void;
  /**
   * Gets the Statistics of the Session
   * This method gets the statistics of the session connection.
   *
   * @description
   * This method should be called after joining the channel, and it may take at most 3 seconds to retrieve the statistics.
   * This method supports the Chrome browser only.
   */
  getSessionStats: (callback: (stats: SessionStats) => void) => void;
  /**
   * Gets the Statistics of the System
   *
   * This method gets the statistics of the system.
   *
   * Currently only the battery level information is provided.
   * @see [BatteryLevel](https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.systemstats.html#batterylevel).
   *
   * @description
   * This feature is experimental.
   * @see [Battery Status API](https://developer.mozilla.org/en-US/docs/Web/API/Battery_Status_API) for browser compatibility.
   */
  getSystemStats: (callback: (stats: SystemStats) => void) => void;
  /**
   * Gets the Statistics of the Transmission
   * This method gets the statistics of the transmission quality to Agora service.
   *
   * @description
   * Calculation of the statistics may take at most 3 seconds.
   * This method supports the Chrome browser only.
   */
  getTransportStats: (callback: (stats: TransportStats) => void) => void;
  /**
   * Initializes the Client object.
   *
   * @param appId Pass in the App ID for your project.
   * ASCII characters only, and the string length must be greater than 0 and less than 256 bytes.
   * To get your App ID,
   * @see [Get an App ID](https://docs.agora.io/en/Video/web_prepare?platform=Web#create-an-agora-account-and-get-an-app-id).
   * @param [onSuccess] The callback when the method succeeds.
   * @param [onFailure] The callback when the method fails.
   *
   * @example
   * client.init(appId, () => {
   * console.log("client initialized");
   * // Join a channel
   * //……
   * }, err => {
   *     console.log("client init failed ", err);
   *     // Error handling
   * });
   */
  init: (
    appId: string,
    onSuccess?: () => void,
    onFailure?: (error: Error) => void
  ) => void;
  /**
   * Joins an AgoraRTC Channel
   * This method joins an AgoraRTC channel.
   *
   * @description
   * All users in the same channel should have the same type (number or string) of uid.
   *  - If you use a number as the user ID, it should be a 32-bit unsigned integer with a value ranging from 0 to (232-1).
   *  - If you use a string as the user ID, the maximum length is 255 characters.
   *
   * @param tokenOrKey
   * - Low security requirements: Pass null as the parameter value.
   * - High security requirements: Pass the string of the Token or Channel Key as the parameter value. See Use Security Keys for details.
   * @param channel
   * A string that provides a unique channel name for the Agora session. The length must be within 64 bytes. Supported character scopes:
   * - 26 lowercase English letters a-z
   * - 26 uppercase English letters A-Z
   * - 10 numbers 0-9
   * - Space
   * - "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", "{", "}", "|", "~", ","
   * @param uid The user ID, an integer or a string, ASCII characters only. Ensure this ID is unique.
   * If you set the uid to null, the server assigns one and returns it in the onSuccess callback.
   * @param [onSuccess] The callback when the method succeeds. The server returns the uid which represents the identity of the user.
   * @param [onFailure] The callback when the method fails.
   * @example
   * client.join(<token>, "1024", null, uid => {
   *    console.log("client" + uid + "joined channel");
   *    // Create a local stream
   *    //……
   * }, err => {
   *    console.error("client join failed ", err);
   *    // Error handling
   * });
   *
   */
  join: (
    tokenOrKey: string | null,
    channel: string | null,
    uid: number | string | null,
    onSuccess?: (uid: number | string) => void,
    onFailure?: (error: Error) => void
  ) => void;
  /**
   * Leaves an AgoraRTC Channel
   *
   * This method enables a user to leave a channel.
   *
   * @param [onSuccess] The callback when the method succeeds.
   * @param [onFailure] The callback when the method fails.
   * @example
   * client.leave(_ => {
   *     console.log("client leaves channel");
   *     //……
   * }, err => {
   *     console.log("client leave failed ", err);
   *     //error handling
   * });
   */
  leave: (onSuccess?: () => void, onFailure?: (error: Error) => void) => void;
  /**
   * This method removes the events attached by the Client.on() method.
   *
   * @example
   * client.on("stream-published", function processStreamPublished(evt) {
   *  console.log("Stream Published");
   *  evt.stream.play("divId");
   *  client.off("stream-published", processStreamPublished);
   * })
   */
  off: (eventType: ClientEvent, callback: (evt: any) => void) => void;
  /**
   * Occurs when an Agora.io event connected to the local client is received from the SDK.
   *
   * @see [On](https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.client.html#on)
   * for all variations of this core function.
   */
  on: (event: ClientEvent, callback: (evt: any) => void) => void;
  /**
   * Publishes a Local Stream
   * This method publishes a local stream to the SD-RTN.
   *
   * @description
   * In a live broadcast, whoever calls this API is the host.
   *
   * @param stream Stream object, which represents the local stream.
   * @param [onFailure] The callback when the method fails.
   * @example
   * client.publish(stream, err => {
   *    console.log(err);
   *    //……
   * })
   */
  publish: (stream: Stream, onFailure?: (error: Error) => void) => void;
  /**
   * Removes the Injected Stream
   *
   * This method removes the HTTP/HTTPS URL address (added by addInjectStreamUrl) from the live broadcast.
   *
   * @param url URL address of the live streaming. ASCII characters only, and the string
   * length must be greater that 0 and less than 256 bytes.
   */
  removeInjectStreamUrl: (url: string) => void;
  /**
   * This method renews your channel key.
   *
   * Once the Channel Key schema is enabled, the key expires after a certain period of time.
   * When the onFailure callback reports the error DYNAMIC_KEY_TIMEOUT, the application should renew the
   * Channel Key by calling this method. Not doing so will result in SDK disconnecting with the server.
   */
  renewChannelKey: (
    key: string,
    onSuccess?: () => void,
    onFailure?: (error: Error) => void
  ) => void;
  /**
   * This method renews your token.
   *
   * Once the Token schema is enabled, the token expires after a certain period of time.
   * In case of the `onTokenPrivilegeWillExpire` or `onTokenPrivilegeDidExpire` callback events, the application
   * should renew the Token by calling this method. Not doing so will result in SDK disconnecting with the server.
   *
   * @param token Specifies the renewed Token.
   */
  renewToken: (token: string) => void;
  /**
   * Sets the role of the user.
   *
   * This method is applicable only to the live mode.
   * Sets the role of the user such as a host or an audience (default), before joining a channel.
   * This method can be used to switch the user role after the user joins a channel.
   *
   * In live mode ([mode](https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.clientconfig.html#mode) is set as live):
   * - Before joining the channel, you can call this method to set the role.
   * - After joining the channel, you can call this method to switch the role:
   *   When you call [publish](https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.client.html#publish),
   *   the user role switches to host; when you call
   *   [unpublish](https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.client.html#unpublish),
   *   the user role switches to audience.
   *   After calling [publish](https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.client.html#publish),
   *   if you call this method and set the user role as audience,
   *   [unpublish](https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.client.html#unpublish) is called automatically.
   *
   * In communication mode
   * ([mode](https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.clientconfig.html#mode) set as `rtc`),
   * this method does not take effect. All users are host by default.
   *
   * @param role User role in a live broadcast:
   * - "audience": Audience, the default role. An audience can only receive streams.
   * - "host": Host. A host can both send and receive streams.
   *
   * @example
   * client.setClientRole('host', _ => {
   *    console.log("setHost success");
   *  }, e => {
   *    console.log("setHost failed", e);
   *  })
   */
  setClientRole: (
    role: 'audience' | 'host',
    callback?: (error: Error) => void
  ) => void;
  /**
   * This method sets the encryption mode.
   *
   * @description
   * Ensure that you call this API before
   * [Client.join](https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.client.html#join).
   *
   * @param encryptionMode
   * - aes-128-xts: Sets the encryption mode as AES128XTS.
   * - aes-256-xts: Sets the encryption mode as AES256XTS.
   * - aes-128-ecb: Sets the encryption mode as AES128ECB.
   */
  setEncryptionMode: (
    encryptionMode: 'aes-128-xts' | 'aes-256-xts' | 'aes-128-ecb'
  ) => void;
  /**
   * This method enables the built-in encryption.
   *
   * @description
   * Ensure that you call this API before
   * [Client.join](https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.client.html#join).
   *
   * @param password
   * - The encryption password. ASCII characters only, and the string length must be greater than 0 and less than 256 bytes.
   */
  setEncryptionSecret: (password: string) => void;
  /**
   * This method sets the video layout and audio for CDN live.
   *
   * @description
   * Call [setLiveTranscoding](https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.client.html#setlivetranscoding)
   * after [createStream](https://docs.agora.io/en/Video/API%20Reference/web/globals.html#createstream).
   * For details, see [Push Streams to the CDN](https://docs.agora.io/en/Video/push_stream_web).
   */
  setLiveTranscoding: (coding: LiveTranscoding) => void;
  /**
   * Sets the Low-video Stream Parameter
   *
   * If you enabled the dual-stream mode by calling
   * [Client.enableDualStream](https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.client.html#enabledualstream),
   * use this method to set the low-video stream profile.
   * If you do not set the low-video stream profile, the SDK will assign default values based on your stream video profile.
   *
   * @description
   * - As different web browsers have different restrictions on the video profile, the parameters you set
   *   may fail to take effect. The Firefox browser has a fixed frame rate of 30 fps, therefore the frame
   *   rate settings do not work on the Firefox browser.
   * - Due to limitations of some devices and browsers, the resolution you set may fail to take effect and
   *   get adjusted by the browser. In this case, billings will be calculated based on the actual resolution.
   * - Call [Client.join](https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.client.html#join) before using this method.
   * - Screen sharing supports the high-video stream only.
   *
   * @see [setLowStreamParameter](https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.client.html#setlowstreamparameter)
   */
  setLowStreamParameter: (param: {
    bitrate?: number;
    framerate?: number;
    height?: number;
    width?: number;
  }) => void;
  /**
   * Deploys the Nginx Server
   *
   * Use this method to deploy the Nginx server.
   *
   * @description
   * Ensure that you call this API before
   * [Client.join](https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.client.html#join).
   * Proxy services by different service providers may result in slow performance if you are using the Firefox browser.
   * Therefore, Agora recommends using the same service provider for the proxy services. If you use different service providers,
   * Agora recommends not using the Firefox browser.
   *
   * @param proxyServer Your Nginx server domain name. ASCII characters only, and the string length
   * must be greater than 0 and less than 256 bytes.
   */
  setProxyServer: (proxyServer: string) => void;
  /**
   * Sets the Remote Video-stream Type
   * When a remote user sends dual streams, this method decides on which stream to receive on the subscriber side.
   * If this method is not used, the subscriber receives the high-video stream.
   *
   * @description
   * As not all web browsers are compatible with dual streams, Agora does not recommend developers setting the
   * resolution of the low-video stream.
   *
   * Some web browsers may not be fully compatible with dual streams:
   * @see [Table](https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.client.html#setremotevideostreamtype)
   *
   * @param stream The remote video stream object.
   * @param streamType Sets the remote video stream type. The following lists the video-stream types:
   * - 0: High-bitrate, high-resolution video stream.
   * - 1: Low-bitrate, low-resolution video stream.
   *
   * @example
   * switchStream = function (){
   *   if (highOrLow === 0) {
   *     highOrLow = 1
   *     console.log("Set to low");
   *   }
   *   else {
   *     highOrLow = 0
   *     console.log("Set to high");
   *   }
   *
   *   client.setRemoteVideoStreamType(stream, highOrLow);
   * }
   */
  setRemoteVideoStreamType: (stream: Stream, streamType: 0 | 1) => void;
  /**
   * Use this method to set stream fallback option on the receiver.
   *
   * Under poor network conditions, the SDK can choose to subscribe to the low-video stream or only the audio stream.
   *
   * @description
   * This method can only be used when the publisher has enabled the dual-stream mode by
   * [enableDualStream](https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.client.html#enabledualstream).
   *
   * @param stream The remote stream object.
   * @param fallbackType The fallback option:
   * - 0: Disable the fallback.
   * - 1: (Default) Automatically subscribe to the low-video stream under poor network.
   * - 2: Under poor network, the SDK may subscribe to the low-video stream (of lower resolution and lower bitrate) first,
   * but if the network still does not allow displaying the video, the SDK will receive audio only.
   *
   * @example
   * // The sender side, after publishing the high stream
   *  client.enableDualStream();
   *
   *  // The receiver side, set the fallback option as 2
   *  client.setStreamFallbackOption(remoteStream, 2);
   *
   */
  setStreamFallbackOption: (stream: Stream, fallbackType: 0 | 1 | 2) => void;
  /**
   * Deploys the TURN Server.
   *
   * @description
   * Ensure that you call this API before
   * [Client.join](https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.client.html#join).
   *
   * @see [setTurnServer](https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.client.html#setturnserver)
   */
  setTurnServer: (turnServer: TurnServer) => void;
  /**
   * Starts relaying media streams across channels.
   *
   * After this method call, the SDK triggers the following callbacks:
   *
   * - Client.on(`"channel-media-relay-state"`), which reports the state and error code of the media stream relay.
   *  - If the media stream relay starts successfully, this callback returns `state` 2 and `code` 0.
   *  - If the media stream relay fails, this callback returns `state` 3. Refer to `code` for the error code and call this method again.
   *
   * - Client.on(`"channel-media-relay-event"`), which reports the events of the media stream relay.
   *  - If the media stream relay starts successfully, this callback returns `code` 4, reporting that the
   *    SDK starts relaying the media stream to the destination channel.
   *
   * @remark
   * - Contact sales-us＠agora.io to enable this function.
   * - We do not support string user IDs in this API.
   * - Call this method only after joining a channel.
   * - In a live-broadcast channel, only a host can call this method.
   * - To call this method again after it succeeds, you must call stopChannelMediaRelay to quit the current relay.
   *
   * @since 3.0.0
   */
  startChannelMediaRelay: (
    config: ChannelMediaRelayConfiguration,
    callback: (error?: ChannelMediaError) => void
  ) => void;
  /**
   * This method starts a live stream.
   *
   * @description
   * Call [startLiveStreaming](https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.client.html#startlivestreaming)
   * after [createStream](https://docs.agora.io/en/Video/API%20Reference/web/globals.html#createstream).
   *
   * @param url URL address for the live stream. ASCII characters only, and
   * the string length must be greater than 0 and less than 256 bytes.
   * @param [enableTranscoding] Marks whether to enable live transcoding.
   * If set as true, setLiveTranscoding must be called before this method.
   *
   * @see [Push Streams to the CDN](https://docs.agora.io/en/Video/push_stream_web).
   */
  startLiveStreaming: (url: string, enableTranscoding?: boolean) => void;
  /**
   * Enables Cloud Proxy.
   *
   * This method must be called before joining the channel or after leaving the channel.
   *
   * To use the cloud proxy service, some extra settings are needed, see
   * [Use Cloud Proxy](https://docs.agora.io/en/Interactive%20Broadcast/cloud_proxy_web?platform=Web) for details.
   */
  startProxyServer: () => void;
  /**
   * Stops the media stream relay. Once the relay stops, the user leaves all the destination channels.
   *
   * After this method call, the SDK triggers the `Client.on("channel-media-relay-state")` callback.
   *
   * - If the relay stops, the callback returns `state` 0.
   * - If the relay fails to stop, the callback returns `state` 3 and `code` 2 or 8. The failure is usually due to poor network conditions.
   *   You can call [Client.leave](https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.client.html#leave)
   *   to leave the channel and stop the relay.
   *
   * @since 3.0.0
   * @example
   * stopChannelMediaRelay: () => {
   *  client.stopChannelMediaRelay(e => {
   *    if(e) {
   *      utils.notification(`stopChannelMediaRelay failed: ${JSON.stringify(e)}`);
   *    } else {
   *      utils.notification(`stopChannelMediaRelay success`);
   *    }
   *  });
   * }
   *
   * @param callback The result of stopping the media stream relay.
   */
  stopChannelMediaRelay: (
    callback: (error?: ChannelMediaError) => void
  ) => void;
  /**
   * This method stops and deletes the live streaming.
   * When the live stream stops, the SDK triggers the `Client.on("liveStreamingStopped")` callback.
   *
   * @param url URL address of the live streaming. ASCII characters only, and
   * the string length must be greater than 0 and less than 256 bytes.
   */
  stopLiveStreaming: (url: string) => void;
  /**
   * Disables Cloud Proxy.
   *
   * This method must be called before joining the channel or after leaving the channel.
   *
   * This method disables all proxy settings, including those set by
   * [setProxyServer](https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.client.html#setproxyserver) and
   * [setTurnServer](https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.client.html#setturnserver).
   */
  stopProxyServer: () => void;
  /**
   * This method enables a user to subscribe to a remote stream.
   *
   * After the user subscribes to a remote stream, the SDK triggers the `Client.on("stream-subscribed")` callback.
   * If the remote stream contains an audio track, the SDK also triggers the `Client.on("first-audio-frame-decode")` callback;
   * if the remote stream contains a video track, the SDK also triggers the `Client.on("first-video-frame-decode")` callback.
   *
   * @example
   * client.subscribe(stream, err => {
   *    console.error("stream subscribe failed", err);
   *    //……
   * });
   *
   * Advanced
   *
   * This method can be called multiple times for a single remote stream,
   * and enables you to switch between receiving/not receiving the video or audio data flexibly.
   *
   * @example
   * // Initially, subscribe to the stream and receive only the video data
   * client.subscribe(stream, {video: true, audio: false});
   *
   * // After a while, switch to receiving only the audio data
   * client.subscribe(stream, {video: false, audio: true});
   *
   * @remarks
   * - video and `audio` cannot be set as `false` at the same time. If you need to stop subscribing to the stream,
   * call [Client.unsubscribe](https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.client.html#unsubscribe) instead.
   * - Safari does not support independent subscription. Set `options` as `null` for Safari,
   * otherwise the `SAFARI_NOT_SUPPORTED_FOR_TRACK_SUBSCRIPTION` error occurs.
   *
   * @param stream Stream object, which represents the remote stream.
   * @param [options] Sets whether to receive the video or audio data independently by the `video` and `audio` parameters.
   * @param [onFailure] The callback when the method fails. The following are common errors:
   * - `"SAFARI_NOT_SUPPORTED_FOR_TRACK_SUBSCRIPTION"`: Safari does not support independent subscription.
   * - `"INVALID_OPERATION"`: The user is not in the channel, possibly because the user has not
   *    joined the channel or the connection is interrupted.
   * - `"SUBSCRIBE_STREAM_FAILED"`: The subscription fails, usually because the SDK has disconnected
   *    from the Agora server when subscribing to the stream.
   * - `"PEERCONNECTION_FAILED"`: Fails to establish the media transport channel.
   */
  subscribe: (
    stream: Stream,
    options?: SubscribeOptions,
    onFailure?: (error: Error) => void
  ) => void;
  /**
   * Unpublishes the Local Stream.
   *
   * When the stream is unpublished, the `Client.on("stream-removed")` callback is triggered on the remote client.
   *
   * @param stream Stream object, which represents the local stream.
   *
   * @example
   * client.unpublish(stream, err => {
   *    console.log(err);
   *    //……
   * })
   *
   * @remarks
   * In a live broadcast, the user role of a host switches to audience after unpublishing, and
   * the `Client.on("peer-leave")` callback is triggered on the remote client.
   */
  unpublish: (stream: Stream, onFailure?: (error: Error) => void) => void;
  /**
   * Unsubscribes from a Remote Stream.
   *
   * @param stream Stream object, which represents the remote stream.
   *
   * @example
   * client.unsubscribe(stream, err => {
   *   console.log(err);
   *   //……
   * })
   *
   */
  unsubscribe: (stream: Stream, onFailure?: (error: Error) => void) => void;
  /**
   * Updates the channels for media stream relay.
   *
   * After the channel media relay starts, if you want to relay the media stream to more channels,
   * or leave the current relay channel, you can call this method.
   *
   * After this method call, the SDK triggers the `Client.on("channel-media-relay-event")` callback.
   * - If the update succeeds, the callback returns `code` 7.
   * - If the update fails, the callback returns `code` 8, and the SDK also triggers the
   * `Client.on("channel-media-relay-state")` callback with `state` 3. In this case, the media relay state is reset, and you need to call
   * [startChannelMediaRelay](https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.client.html#startchannelmediarelay)
   * again to restart the relay.
   *
   * @remarks
   * - Call this method after
   * [startChannelMediaRelay](https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.client.html#startchannelmediarelay).
   * - You can add a maximum of four destination channels to a relay.
   *
   * @example
   * client.updateChannelMediaRelay(channelMediaConfig, e => {
   *   if (e) {
   *     utils.notification(`updateChannelMediaRelay failed: ${JSON.stringify(e)}`);
   *   } else {
   *     utils.notification(`updateChannelMediaRelay success`);
   *   }
   * });
   *
   * @since 3.0.0
   */
  updateChannelMediaRelay: (
    config: ChannelMediaRelayConfiguration,
    callback: (error?: ChannelMediaError) => void
  ) => void;

  /* Legacy properties from angular-agora-rtc */
  aesMode?: string;
  aespassword?: string;
  gatewayClient?: {};
  highStream?: any;
  highStreamState?: number;
  isDualStream?: boolean;
  key?: any;
  lowStream?: any;
  lowStreamParameter?: any;
  lowStreamState?: number;
  proxyServer?: any;
  turnServer?: any;
}
