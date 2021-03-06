export interface TranscodingUser {
  /**
   * Transparency of the video frame.
   *
   * The value ranges between 0.0 and 1.0:
   * - 0.0: Completely transparent.
   * - 1.0: (Default) Opaque.
   */
  alpha?: number;
  /**
   * Height of the video.
   *
   * Integer only. The value range is `[0,10000]`, and the default value is `640`.
   */
  height?: number;
  /** User ID of the CDN live host. */
  uid?: number | string;
  /**
   * Width of the video.
   *
   * Integer only. The value range is `[0,10000]`, and the default value is `360`.
   */
  width?: number;
  /**
   * The position of the upper left end of the video on the horizontal axis.
   *
   * Integer only. The value range is `[0,10000]`, and the default value is `0`.
   */
  x?: number;
  /**
   * The position of the upper left end of the video on the vertical axis.
   *
   * Integer only. The value range is `[0,10000]`, and the default value is `0`.
   */
  y?: number;
  /**
   * Layer position of the video frame.
   *
   * Integer only. The value range is `[0,100]`.
   *
   * From v2.3.0, Agora SDK supports setting zOrder as 0.
   * - 0: (Default) Lowest.
   * - 100: Highest.
   */
  zOrder?: number;
}
