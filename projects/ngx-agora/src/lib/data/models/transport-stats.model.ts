/**
 * Statistics of the network connection.
 */
export interface TransportStats {
  /**
   * The network type.
   * @remark
   * Chrome 61+ is required for this function, and the compatibility is not guaranteed.
   * @see [Network Information API](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API) for details.
   */
  NetworkType: 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown' | 'UNSUPPORTED';
  /**
   * The estimated available bandwidth for sending the stream, in Kbps.
   */
  OutgoingAvailableBandwidth: string;
  /**
   * RTT (Round-Trip Time) between the SDK and the access node of the SD-RTN, in ms.
   */
  RTT: string;
}
